-- Run this in your Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guru',
  security_question TEXT,
  security_answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Institution Table (One per user)
CREATE TABLE IF NOT EXISTS institution (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT,
  address TEXT,
  principal_name TEXT,
  coordinator_name TEXT,
  halaqoh_teacher_name TEXT,
  academic_year TEXT DEFAULT '2025/2026',
  logo TEXT,
  watermark TEXT,
  principal_signature TEXT,
  coordinator_signature TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Halaqoh Table
CREATE TABLE IF NOT EXISTS halaqoh (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  halaqoh_id BIGINT REFERENCES halaqoh(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Deposits Table
CREATE TABLE IF NOT EXISTS daily_deposits (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'hafalan', 'ummi', 'tilawah'
  date TEXT NOT NULL,
  details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, type, date)
);

-- Exams Ummi Table
CREATE TABLE IF NOT EXISTS exams_ummi (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  level INTEGER,
  scores JSONB,
  date TEXT,
  semester TEXT DEFAULT 'Ganjil',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams Hafalan Table
CREATE TABLE IF NOT EXISTS exams_hafalan (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  surahs JSONB,
  note TEXT,
  date TEXT,
  days_progress JSONB,
  status TEXT DEFAULT 'ongoing',
  semester TEXT DEFAULT 'Ganjil',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly Recaps Table
CREATE TABLE IF NOT EXISTS monthly_recaps (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  total_hafalan TEXT,
  notes TEXT,
  UNIQUE(student_id, month),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Optional but recommended
-- For this demo, we'll keep it simple, but you should configure RLS in Supabase dashboard.
