CREATE TABLE IF NOT EXISTS flow_steps (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  step_type TEXT NOT NULL DEFAULT 'process',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO flow_steps (label, step_type, sort_order) VALUES
('INICIO', 'terminal', 0),
('Buscar llave', 'process', 1),
('Dejar pertenencias', 'process', 2),
('Prender las luces', 'process', 3),
('Sacar arbolitos', 'process', 4),
('Abres gas', 'process', 5),
('Pones olla', 'process', 6),
('Sacas tupper', 'process', 7),
('Sacar olla para frijoles y calentarlos', 'process', 8),
('Verter en olla', 'process', 9),
('Tupper en fregadero', 'process', 10),
('Desconectar y prender sistema', 'process', 11),
('Verificas saldo de caja', 'decision', 12),
('Verter cafe de olla en tetera', 'process', 13),
('Recibes pan dulce', 'process', 14),
('Colocar canasta de pan', 'process', 15),
('Recibes las tortillas en hielera', 'process', 16),
('LISTO PARA OPERAR', 'terminal', 17);
