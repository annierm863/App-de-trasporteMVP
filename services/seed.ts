
import { supabase } from './supabase';

export const seedDatabase = async () => {
    console.log('Starting seed...');

    // 1. Create Client (James)
    // Use a fixed UUID to prevent duplicates on re-runs
    const clientId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { error: clientError } = await supabase
        .from('clients')
        .upsert({
            id: clientId,
            full_name: 'James',
            phone: '+1 555 0123 4567',
            email: 'james@vip.com'
        });

    if (clientError) console.error('Error seeding client:', clientError);
    else console.log('Client seeded.');

    // 2. Create Driver (James Anderson)
    const driverId = 'd2c94382-7a0e-4f10-bf61-39049774641e';
    const { error: driverError } = await supabase
        .from('drivers')
        .upsert({
            id: driverId,
            full_name: 'James Anderson',
            phone: '+1 555 9876 5432',
            status: 'active'
        });

    if (driverError) console.error('Error seeding driver:', driverError);
    else console.log('Driver seeded.');

    // 3. Create Vehicle (Mercedes)
    const vehicleId = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
    const { error: vehicleError } = await supabase
        .from('vehicles')
        .upsert({
            id: vehicleId,
            driver_id: driverId,
            make: 'Mercedes-Benz',
            model: 'S-Class',
            color: 'Black',
            plate_number: 'LUX-555'
        });

    if (vehicleError) console.error('Error seeding vehicle:', vehicleError);
    else console.log('Vehicle seeded.');

    return { clientId, driverId };
};
