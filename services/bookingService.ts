
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

export const getAdminBookings = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Fetch future bookings (including today)
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            id,
            pickup_datetime,
            pickup_address,
            dropoff_address,
            status,
            created_at,
            client:clients (
                id,
                full_name,
                phone,
                email
            )
        `)
        .gte('pickup_datetime', `${today}T00:00:00`)
        .order('pickup_datetime', { ascending: true });

    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }

    // Map to Booking interface (or a simpler version suitable for the dashboard)
    return data.map((b: any) => ({
        id: b.id,
        status: b.status,
        date: new Date(b.pickup_datetime).toLocaleDateString(),
        time: new Date(b.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pickupAddress: b.pickup_address,
        dropoffAddress: b.dropoff_address,
        clientName: b.client?.full_name || 'Unknown Client',
        clientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.client?.full_name || 'U')}&background=random`,
        clientPhone: b.client?.phone,
        clientEmail: b.client?.email,
        pickupDatetime: b.pickup_datetime,
        // VIP logic could be added if client has `is_vip` field, for now hardcoded or random for demo?
        // Let's assume standard client unless we add a VIP table.
        isVip: false // Placeholder
    }));
};

export const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

    if (error) {
        throw error;
    }
};
