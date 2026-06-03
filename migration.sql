-- Run this in the Supabase SQL Editor to update your existing tables

-- 1. Add missing columns to the courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS total_fee NUMERIC;

-- 2. Add missing columns to the students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS batch TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS admission_date DATE DEFAULT CURRENT_DATE;

-- 3. Ensure fee_payments table exists (in case it wasn't created)
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  payment_date DATE DEFAULT CURRENT_DATE,
  amount_paid NUMERIC NOT NULL,
  payment_type TEXT NOT NULL,
  months_paid TEXT[]
);
