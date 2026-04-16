-- Supabase Database Schema for Sango Information Hub

-- Articles table
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  category TEXT,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Podcasts table
CREATE TABLE podcasts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  duration TEXT,
  host TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles (for admin/auth features)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Public podcasts are viewable by everyone" ON podcasts
  FOR SELECT USING (true);

CREATE POLICY "Public events are viewable by everyone" ON events
  FOR SELECT USING (true);

-- Create policies for admin write access (you'll need to set up authentication)
-- These are examples - adjust based on your auth setup
CREATE POLICY "Admins can insert articles" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update articles" ON articles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete articles" ON articles
  FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat similar policies for podcasts and events

-- Create indexes for better performance
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_podcasts_category ON podcasts(category);
CREATE INDEX idx_events_date ON events(date);