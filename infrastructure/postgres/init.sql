-- AegisIQ Database Initialization
-- This script runs when the PostgreSQL container is first created.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'capability_analyst', 'professional', 'reviewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_status AS ENUM ('planned', 'active', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_type AS ENUM ('soc', 'ir', 'threat_hunting', 'malware_analysis', 'cloud_security', 'network_security', 'dfir', 'identity_security');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE evidence_type AS ENUM ('strength', 'weakness', 'gap');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_format AS ENUM ('json', 'pdf');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE jd_source_type AS ENUM ('pdf', 'docx', 'txt');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- Core Tables
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'professional',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Descriptions table
CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_content TEXT NOT NULL,
    source_type jd_source_type NOT NULL,
    filename VARCHAR(255),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill DNA table
CREATE TABLE IF NOT EXISTS skill_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jd_id UUID NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    competencies JSONB NOT NULL DEFAULT '[]',
    knowledge_areas JSONB NOT NULL DEFAULT '[]',
    responsibilities JSONB NOT NULL DEFAULT '[]',
    difficulty VARCHAR(50),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_dna_id UUID REFERENCES skill_dna(id) ON DELETE SET NULL,
    status assessment_status NOT NULL DEFAULT 'planned',
    duration_minutes INTEGER,
    blueprint JSONB NOT NULL DEFAULT '{}',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practical Challenges table
CREATE TABLE IF NOT EXISTS practical_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    challenge_type challenge_type NOT NULL,
    scenario JSONB NOT NULL DEFAULT '{}',
    rubric JSONB NOT NULL DEFAULT '{}',
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES practical_challenges(id) ON DELETE CASCADE,
    transcript TEXT,
    concepts JSONB NOT NULL DEFAULT '[]',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
    scores JSONB NOT NULL DEFAULT '{}',
    mitre_mapping JSONB NOT NULL DEFAULT '[]',
    confidence FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    evidence_type evidence_type NOT NULL,
    description TEXT NOT NULL,
    references_data JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    content JSONB NOT NULL DEFAULT '{}',
    report_format report_format NOT NULL DEFAULT 'json',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    recommendations JSONB NOT NULL DEFAULT '[]',
    resources JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cyber Twin table
CREATE TABLE IF NOT EXISTS cyber_twins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    capability_profile JSONB NOT NULL DEFAULT '{}',
    verified_skills JSONB NOT NULL DEFAULT '[]',
    experience_graph JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Career Compass table
CREATE TABLE IF NOT EXISTS career_compasses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cyber_twin_id UUID NOT NULL REFERENCES cyber_twins(id) ON DELETE CASCADE,
    target_roles JSONB NOT NULL DEFAULT '[]',
    progression_paths JSONB NOT NULL DEFAULT '[]',
    recommended_milestones JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capability Heatmap table
CREATE TABLE IF NOT EXISTS capability_heatmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coverage_data JSONB NOT NULL DEFAULT '{}',
    strength_areas JSONB NOT NULL DEFAULT '[]',
    gap_areas JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_jd_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_dna_jd_id ON skill_dna(jd_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_challenges_assessment_id ON practical_challenges(assessment_id);
CREATE INDEX IF NOT EXISTS idx_responses_challenge_id ON responses(challenge_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_response_id ON evaluations(response_id);
CREATE INDEX IF NOT EXISTS idx_evidence_evaluation_id ON evidence(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_evaluation_id ON learning_paths(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_cyber_twins_user_id ON cyber_twins(user_id);
CREATE INDEX IF NOT EXISTS idx_career_compass_twin_id ON career_compasses(cyber_twin_id);
CREATE INDEX IF NOT EXISTS idx_heatmaps_user_id ON capability_heatmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- Updated_at trigger function
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
