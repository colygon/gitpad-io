-- Create tables for Gitpad.io

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  linked_domain TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS domains_user_id_idx ON domains(user_id);
CREATE INDEX IF NOT EXISTS ideas_user_id_idx ON ideas(user_id);

-- Enable Row Level Security
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for domains
CREATE POLICY "Users can view their own domains"
  ON domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domains"
  ON domains FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains"
  ON domains FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for ideas
CREATE POLICY "Users can view their own ideas"
  ON ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
  ON ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
  ON ideas FOR DELETE
  USING (auth.uid() = user_id);
