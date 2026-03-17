-- Table for oratory evaluations
CREATE TABLE IF NOT EXISTS oratoria_evaluations (
  id SERIAL PRIMARY KEY,
  participant_name VARCHAR(255) NOT NULL,
  -- Technical aspects (1-10)
  diccion INTEGER DEFAULT 5,
  ritmo INTEGER DEFAULT 5,
  entonacion INTEGER DEFAULT 5,
  intensidad INTEGER DEFAULT 5,
  -- Body expression (1-10)
  expresion_corporal INTEGER DEFAULT 5,
  dominio_escenico INTEGER DEFAULT 5,
  conexion_emocional INTEGER DEFAULT 5,
  -- Speech structure (1-10)
  introduccion INTEGER DEFAULT 5,
  desarrollo INTEGER DEFAULT 5,
  conclusion INTEGER DEFAULT 5,
  -- Total and notes
  total_score INTEGER DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
