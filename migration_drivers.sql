-- Add professional fields to drivers table

ALTER TABLE public.drivers
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS total_trips INTEGER DEFAULT 0;

-- Optional: Add constraint for unique email if desired, but keeping it flexible for now
-- ALTER TABLE public.drivers ADD CONSTRAINT unique_driver_email UNIQUE (email);
