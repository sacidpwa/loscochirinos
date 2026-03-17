-- Insert categories
INSERT INTO categories (name) VALUES 
  ('Semillas y Condimentos'),
  ('Proteína'),
  ('Desechables'),
  ('Verdura'),
  ('Lácteos'),
  ('Suministros de Limpieza')
ON CONFLICT DO NOTHING;

-- Insert supplies
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum) VALUES
  -- Semillas y Condimentos
  (1, 'Achiote', 'Mensual', 0, 0),
  (1, 'Comino', 'Mensual', 0, 0),
  (1, 'Recado Rojo', 'Semanal', 0, 0),
  (1, 'Orégano', 'Mensual', 0, 0),
  (1, 'Ajo en polvo', 'Mensual', 0, 0),
  (1, 'Sal', 'Mensual', 0, 0),
  (1, 'Pimienta negra', 'Mensual', 0, 0),
  (1, 'Chile habanero molido', 'Semanal', 0, 0),
  
  -- Proteína
  (2, 'Carne de cerdo (pierna o espalda)', 'Bisemanal', 0, 0),
  (2, 'Carne asada (cortes para tacos)', 'Semanal', 0, 0),
  (2, 'Pollo (muslos o pechuga)', 'Semanal', 0, 0),
  (2, 'Queso tipo Oaxaca', 'Semanal', 0, 0),
  (2, 'Queso rallado', 'Semanal', 0, 0),
  (2, 'Frijoles refritos', 'Semanal', 0, 0),
  
  -- Desechables
  (3, 'Platos biodegradables', 'Bisemanal', 0, 0),
  (3, 'Vasos desechables', 'Bisemanal', 0, 0),
  (3, 'Cubiertos desechables', 'Bisemanal', 0, 0),
  (3, 'Servilletas', 'Bisemanal', 0, 0),
  (3, 'Bolsas para llevar', 'Bisemanal', 0, 0),
  
  -- Verdura
  (4, 'Cebolla morada', 'Semanal', 0, 0),
  (4, 'Cilantro', 'Semanal', 0, 0),
  (4, 'Limones', 'Semanal', 0, 0),
  (4, 'Jitomate', 'Semanal', 0, 0),
  (4, 'Lechuga', 'Semanal', 0, 0),
  (4, 'Chile habanero fresco', 'Semanal', 0, 0),
  (4, 'Aguacate', 'Semanal', 0, 0),
  
  -- Lácteos
  (5, 'Crema', 'Semanal', 0, 0),
  (5, 'Leche', 'Semanal', 0, 0),
  (5, 'Mantequilla', 'Semanal', 0, 0),
  
  -- Suministros de Limpieza
  (6, 'Jabón líquido para trastes', 'Mensual', 0, 0),
  (6, 'Cloro', 'Mensual', 0, 0),
  (6, 'Desengrasante', 'Mensual', 0, 0),
  (6, 'Escobas y trapeadores', 'Trimestral', 0, 0),
  (6, 'Bolsas de basura', 'Bisemanal', 0, 0)
ON CONFLICT DO NOTHING;
