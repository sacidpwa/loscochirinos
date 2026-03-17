-- Create recipes tables

CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key_comments TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity VARCHAR(100) DEFAULT '',
  unit VARCHAR(50) DEFAULT '',
  photo_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS recipe_processes (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  stage VARCHAR(20) NOT NULL CHECK (stage IN ('inicial', 'intermedio', 'final', 'posterior')),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);
