-- Healthcare AI Coordination System - Supabase Schema
-- Table: patients

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    heart_rate INT NOT NULL,
    blood_pressure VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    avatar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo patient metrics
CREATE POLICY "Allow public read access" ON patients
    FOR SELECT USING (true);

-- Insert synthetic demo patient data
INSERT INTO patients (id, name, age, gender, heart_rate, blood_pressure, status, avatar)
VALUES
    ('P-001', 'Jane Doe', 32, 'Female', 72, '120/80', 'Normal', 'https://ui-avatars.com/api/?name=Jane+Doe&background=4caf50&color=fff'),
    ('P-002', 'Michael Smith', 45, 'Male', 88, '135/90', 'Elevated', 'https://ui-avatars.com/api/?name=Michael+Smith&background=ff9800&color=fff'),
    ('P-003', 'Sarah Jenkins', 28, 'Female', 65, '110/70', 'Excellent', 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=4caf50&color=fff'),
    ('P-004', 'Robert Chen', 61, 'Male', 98, '155/95', 'Critical', 'https://ui-avatars.com/api/?name=Robert+Chen&background=ff4d4d&color=fff'),
    ('P-005', 'Emily Davis', 39, 'Female', 76, '118/76', 'Normal', 'https://ui-avatars.com/api/?name=Emily+Davis&background=4caf50&color=fff')
ON CONFLICT (id) DO NOTHING;
