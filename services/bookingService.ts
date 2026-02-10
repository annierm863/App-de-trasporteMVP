
import { supabase } from './supabase';
import { Booking } from '../types';

export const getAdminStats = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Get Today's Rides Count
    // Note: This matches pickup_datetime starting with today's date
    const { count: todayCount, error: todayError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('pickup_datetime', `${today}T00:00:00`)
        .lt('pickup_datetime', `${today}T23:59:59`);

    if (todayError) {
        console.error('Error fetching today stats:', todayError);
    }

    // Get Requested Rides Count
    const { count: requestedCount, error: requestedError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'requested');

    if (requestedError) {
        console.error('Error fetching requested stats:', requestedError);
    }

    return {
        todayCount: todayCount || 0,
        requestedCount: requestedCount || 0
    };
};

export const getAdminBookings = async (options?: { status?: string; searchQuery?: string }) => {
    let query = supabase
        .from('bookings')
        .select(`
            id,
            pickup_datetime,
            pickup_address,
            dropoff_address,
            estimated_fare_min,
            status,
            created_at,
            client:clients (
                id,
                full_name,
                phone,
                email
            )
        `)
        .order('pickup_datetime', { ascending: true }); // Default to upcoming first

    // Apply filters
    if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
    }

    if (options?.searchQuery) {
        // Search logic
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }

    let mappedData = data.map((b: any) => ({
        id: b.id,
        status: b.status,
        date: new Date(b.pickup_datetime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        rawDate: b.pickup_datetime, // For sorting/grouping
        time: new Date(b.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pickupAddress: b.pickup_address,
        dropoffAddress: b.dropoff_address,
        fare: b.estimated_fare_min ? `$${b.estimated_fare_min}` : 'Calculated at end of trip',
        clientName: b.client?.full_name || 'Unknown Client',
        clientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.client?.full_name || 'U')}&background=random`,
        clientPhone: b.client?.phone,
        clientEmail: b.client?.email,
        pickupDatetime: b.pickup_datetime,
        isVip: false
    }));

    // JS Search Filter
    if (options?.searchQuery) {
        const lowerQ = options.searchQuery.toLowerCase();
        mappedData = mappedData.filter(b =>
            b.clientName.toLowerCase().includes(lowerQ) ||
            b.pickupAddress.toLowerCase().includes(lowerQ) ||
            b.dropoffAddress.toLowerCase().includes(lowerQ)
        );
    }

    return mappedData;
};

export const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

    if (error) {
        throw error;
    }
};

export const generateInvoiceEmailUrl = (booking: any) => {
    if (!booking.clientEmail) return null;

    const subject = encodeURIComponent(`Ride Receipt - ${booking.date}`);
    const body = encodeURIComponent(`Dear ${booking.clientName},

Thank you for riding with Privaro Premium. Your trip has been completed.

TRIP DETAILS
----------------------------
Date: ${booking.date}
Time: ${booking.time}
Pickup: ${booking.pickupAddress}
Dropoff: ${booking.dropoffAddress}

Total Fare: ${booking.fare}

We hope to see you again soon!

Best regards,
Privaro Premium Team
    `);

    return `mailto:${booking.clientEmail}?subject=${subject}&body=${body}`;
};
