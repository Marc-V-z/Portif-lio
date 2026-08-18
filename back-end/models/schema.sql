DROP TABLE IF EXISTS post_media, posts, projects, admins, contacts CASCADE;

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  cover_fit VARCHAR(20) DEFAULT 'cover',
  theme_color VARCHAR(20),
  theme_image VARCHAR(255),
  page_bg_color VARCHAR(20),
  page_bg_image VARCHAR(255),
  page_bg_repeat BOOLEAN DEFAULT false,
  github_link VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(150),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);