-- Supabase Schema for JanSetu-AI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    sla_hours INTEGER NOT NULL DEFAULT 96
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY, -- Can hold Supabase Auth UUID or custom demo ID
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'officer', 'admin')),
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OFFICERS TABLE
CREATE TABLE IF NOT EXISTS officers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE CASCADE,
    zone VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. GRIEVANCES TABLE
CREATE TABLE IF NOT EXISTS grievances (
    id VARCHAR(50) PRIMARY KEY, -- Format: JS-2026-XXXXXX
    citizen_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    location JSONB NOT NULL, -- {lat: float, lng: float, address: string, city: string, ward: string}
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    ai_confidence REAL NOT NULL DEFAULT 100.0,
    ai_summary TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'AI Classified', 'Assigned', 'In Progress', 'Awaiting Citizen', 'Resolved', 'Closed', 'Escalated')),
    assigned_officer_id VARCHAR(100) REFERENCES officers(id) ON DELETE SET NULL,
    sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    evidence_urls TEXT[] DEFAULT '{}'::TEXT[]
);

-- 5. GRIEVANCE UPDATES TABLE (TIMELINE LOGS)
CREATE TABLE IF NOT EXISTS grievance_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id VARCHAR(50) NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    remark TEXT,
    updated_by VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    proof_url TEXT
);

-- 6. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grievance_id VARCHAR(50) NOT NULL UNIQUE REFERENCES grievances(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    reopened BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    grievance_id VARCHAR(50) REFERENCES grievances(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) policies for demonstration/development
-- We can enable full access policies for development purposes
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies
CREATE POLICY "Allow public select on departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public all on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow public select on officers" ON officers FOR SELECT USING (true);
CREATE POLICY "Allow public all on grievances" ON grievances FOR ALL USING (true);
CREATE POLICY "Allow public all on grievance_updates" ON grievance_updates FOR ALL USING (true);
CREATE POLICY "Allow public all on feedback" ON feedback FOR ALL USING (true);
CREATE POLICY "Allow public all on notifications" ON notifications FOR ALL USING (true);
