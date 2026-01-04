-- FULL REPAIR & MIGRATION SCRIPT
-- Run this to ensure all tables exist AND security is applied.

-- 1. Create Tables (IF NOT EXISTS) to fix missing table errors
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    make TEXT,
    model TEXT,
    color TEXT,
    plate_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    pickup_datetime TIMESTAMPTZ NOT NULL,
    passengers INTEGER DEFAULT 1,
    estimated_fare_min NUMERIC,
    estimated_fare_max NUMERIC,
    status TEXT CHECK (status IN ('requested', 'confirmed', 'on_the_way', 'completed', 'cancelled')) DEFAULT 'requested',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add Guest Columns (Safe update)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='is_guest') THEN
        ALTER TABLE public.clients ADD COLUMN is_guest BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='device_id') THEN
        ALTER TABLE public.clients ADD COLUMN device_id TEXT;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. Clean up OLD policies (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.drivers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.drivers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vehicles;

-- 5. Apply NEW Security Policies

-- CLIENTS
CREATE POLICY "Users can view own profile" ON public.clients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.clients FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.clients FOR UPDATE USING (auth.uid() = id);

-- BOOKINGS
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = client_id);

-- PUBLIC READ for Drivers/Vehicles (Needed for Booking UI to show driver info)
CREATE POLICY "Public read drivers" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Public read vehicles" ON public.vehicles FOR SELECT USING (true);

