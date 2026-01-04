-- Payment System Migration

-- 1. Add Payment Columns to Bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('cash', 'zelle', 'cashapp', 'card', 'crypto')),
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')) DEFAULT 'pending';

-- 2. Optional: Add 'total_fare' if we want to lock the price at booking time
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS total_fare NUMERIC;

-- 3. Security: Ensure Guests can update their own booking for payment confirmation (optional, but good for future)
-- (Existing RLS "Users can update own bookings" covers this)
