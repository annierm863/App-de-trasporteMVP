-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Drivers Table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    make TEXT,
    model TEXT,
    color TEXT,
    plate_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Bookings Table
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

-- Enable Row Level Security (RLS) - Recommended Best Practice
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- MVP Policies (Open for development, restrict in production!)
-- IMPORTANT: These policies allow public access for MVP speed. Tighten these before launch.
CREATE POLICY "Enable read access for all users" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.clients FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.drivers FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.vehicles FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.bookings FOR UPDATE USING (true);
