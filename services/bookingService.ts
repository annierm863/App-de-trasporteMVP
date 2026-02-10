
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
        // Search by client name is tricky with joins in Supabase directly if not using RPC or flattened view.
        // For MVP/Small scale: Fetch then filter in JS is safest/easiest if RLS/Foreign Tables allow.
        // BUT `!inner` join could work if we want to filter by client name.
        // Let's try client!inner first.
        // Actually, for simplicity and stability, let's fetch more and filter in JS for search
        // OR use a specific search logic.
        // Given the prompt "make it functional", let's try to simple JS filter for search if dataset is small
        // or improved query if possible.
        // Let's stick to simple query and JS filter for search to avoid complex join syntax errors without verifying exact pg schema extensions.
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
        clientName: b.client?.full_name || 'Unknown Client',
        clientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.client?.full_name || 'U')}&background=random`,
        clientPhone: b.client?.phone,
        clientEmail: b.client?.email,
        pickupDatetime: b.pickup_datetime,
        isVip: false
    }));

    // JS Search Filter (Robust for MVP)
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

export const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

    if (error) {
        throw error;
    }
};
