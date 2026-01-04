-- 1. Add Guest Support Columns
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- 2. Drop existing permissive MVP policies (Cleanup)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.clients;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.bookings;

-- 3. Security Hardening: Strict RLS Policies

-- CLIENTS Table Policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" 
ON public.clients FOR SELECT 
USING (auth.uid() = id);

-- Users can insert their own profile (during sign up / guest login)
CREATE POLICY "Users can insert own profile" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" 
ON public.clients FOR UPDATE 
USING (auth.uid() = id);


-- BOOKINGS Table Policies
-- Users can see their own bookings
CREATE POLICY "Users can view own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = client_id);

-- Users can create bookings for themselves
CREATE POLICY "Users can create own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = client_id);

-- Users can NOT update bookings (only cancel, maybe?)
-- Let's allow specific updates if needed, mostly status=cancelled
CREATE POLICY "Users can update own bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = client_id);


-- DRIVERS/ADMIN ACCESS (Important for your Dashboard)
-- Since you are the admin/driver, we need a way for YOU to see everything.
-- For this MVP, we will allow any user with specific email (if you use email auth) 
-- OR strictly for now, we can create a temporary "Admin View All" policy pending full Admin Auth implementation.
-- UNCOMMENT the below if you have a specific admin email you will login with:
-- CREATE POLICY "Admin view all bookings" ON public.bookings FOR SELECT USING (auth.jwt() ->> 'email' = 'tu_email@ejemplo.com');

-- For now, to keep AdminDashboard working without complex admin setup, 
-- we might need to keep a "Drivers can read all" policy if we link drivers to auth.
-- But since Drivers table doesn't have auth_id yet, we have a challenge.

-- TEMPORARY FIX for Admin Dashboard testing:
-- Allow authenticated users to view bookings (restrict only writes strictly?), 
-- OR warn you that Admin Dashboard might show empty until you login as the client.
-- Let's stick to strict Client security as requested. Admin Dashboard will need you to be logged in as a "Driver User" in future.
-- For now, I will leave a comment about Admin Access.
