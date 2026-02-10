
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

export const getAdminClients = async (options?: { sortBy?: 'recent' | 'spend' | 'rides'; searchQuery?: string }) => {
    // 1. Fetch Clients
    let clientQuery = supabase.from('clients').select('*');

    // Simple search implementation (fetch all then filter if search is present, or use ILIKE if possible)
    // For scalable search, we'd use textSearch or similar, but for MVP JS filter is fine or ILIKE
    if (options?.searchQuery) {
        clientQuery = clientQuery.ilike('full_name', `%${options.searchQuery}%`);
    }

    const { data: clients, error: clientError } = await clientQuery;

    if (clientError) {
        console.error('Error fetching clients:', clientError);
        return [];
    }

    // 2. Fetch Bookings to aggregate stats
    const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('client_id, estimated_fare_min, status, pickup_datetime');

    if (bookingError) {
        console.error('Error fetching bookings for stats:', bookingError);
        return [];
    }

    // 3. Aggregate Stats
    const clientStats: any = {};
    bookings?.forEach((b: any) => {
        if (!clientStats[b.client_id]) {
            clientStats[b.client_id] = { totalRides: 0, totalSpend: 0, lastRide: null };
        }

        if (b.status === 'completed') {
            clientStats[b.client_id].totalRides += 1;
            clientStats[b.client_id].totalSpend += parseFloat(b.estimated_fare_min || 0);
        }

        // Track last ride date
        if (b.pickup_datetime) {
            const date = new Date(b.pickup_datetime);
            if (!clientStats[b.client_id].lastRide || date > clientStats[b.client_id].lastRide) {
                clientStats[b.client_id].lastRide = date;
            }
        }
    });

    // 4. Merge and Map
    let mappedClients = clients.map((c: any) => {
        const stats = clientStats[c.id] || { totalRides: 0, totalSpend: 0, lastRide: null };
        return {
            id: c.id,
            name: c.full_name,
            phone: c.phone,
            email: c.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name)}&background=random`,
            totalRides: stats.totalRides,
            totalSpend: stats.totalSpend,
            lastRide: stats.lastRide
        };
    });

    // 5. Sort
    if (options?.sortBy === 'spend') {
        mappedClients.sort((a, b) => b.totalSpend - a.totalSpend);
    } else if (options?.sortBy === 'rides') {
        mappedClients.sort((a, b) => b.totalRides - a.totalRides);
    } else {
        // default recent or name
        mappedClients.sort((a, b) => a.name.localeCompare(b.name));
    }

    return mappedClients;
};

export const getClientDetails = async (clientId: string) => {
    // 1. Fetch Client Profile
    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

    if (clientError) throw clientError;

    // 2. Fetch Client Bookings (History)
    const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', clientId)
        .order('pickup_datetime', { ascending: false });

    if (bookingError) throw bookingError;

    // 3. Calculate Stats
    let totalRides = 0;
    let totalSpend = 0;

    const rides = bookings.map((b: any) => {
        if (b.status === 'completed') {
            totalRides++;
            totalSpend += parseFloat(b.estimated_fare_min || 0);
        }
        return {
            id: b.id,
            date: new Date(b.pickup_datetime).toLocaleDateString(),
            time: new Date(b.pickup_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pickup: b.pickup_address,
            dropoff: b.dropoff_address,
            fare: b.estimated_fare_min,
            status: b.status
        };
    });

    return {
        profile: {
            id: client.id,
            name: client.full_name,
            phone: client.phone,
            email: client.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(client.full_name)}&background=random`,
            joinedDate: new Date(client.created_at).toLocaleDateString()
        },
        stats: {
            totalRides,
            totalSpend,
            rating: 5.0 // Placeholder as we don't have ratings table yet
        },
        rides
    };
};

// --- DRIVER FLEET MANAGEMENT ---

export const getDrivers = async () => {
    // Fetch drivers with their vehicles
    const { data, error } = await supabase
        .from('drivers')
        .select(`
            *,
            vehicle:vehicles(*)
        `)
        .order('full_name');

    if (error) {
        console.error('Error fetching drivers:', error);
        return [];
    }

    return data.map((d: any) => ({
        id: d.id,
        name: d.full_name,
        phone: d.phone,
        email: d.email,
        avatar: d.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.full_name)}&background=random`,
        status: d.status,
        rating: d.rating || 5.0,
        totalTrips: d.total_trips || 0,
        vehicle: d.vehicle && d.vehicle.length > 0 ? d.vehicle[0] : null
    }));
};

export const getDriver = async (id: string) => {
    const { data, error } = await supabase
        .from('drivers')
        .select(`
            *,
            vehicle:vehicles(*)
        `)
        .eq('id', id)
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.full_name,
        phone: data.phone,
        email: data.email,
        avatar: data.avatar_url,
        status: data.status,
        rating: data.rating,
        totalTrips: data.total_trips,
        vehicle: data.vehicle && data.vehicle.length > 0 ? data.vehicle[0] : null
    };
};

export const saveDriver = async (driverData: any, vehicleData: any) => {
    // 1. Upsert Driver
    const driverPayload: any = {
        full_name: driverData.name,
        phone: driverData.phone,
        email: driverData.email,
        avatar_url: driverData.avatar,
        status: driverData.status || 'inactive'
    };

    if (driverData.id && driverData.id !== 'new') {
        driverPayload.id = driverData.id;
    }

    const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .upsert(driverPayload)
        .select()
        .single();

    if (driverError) throw driverError;

    // 2. Upsert Vehicle (if provided)
    if (vehicleData && (vehicleData.make || vehicleData.model)) {
        const vehiclePayload: any = {
            driver_id: driver.id,
            make: vehicleData.make,
            model: vehicleData.model,
            color: vehicleData.color,
            plate_number: vehicleData.plateNumber
        };

        if (vehicleData.id) {
            vehiclePayload.id = vehicleData.id;
        }

        const { error: vehicleError } = await supabase
            .from('vehicles')
            .upsert(vehiclePayload);

        if (vehicleError) throw vehicleError;
    }

    return driver;
};
