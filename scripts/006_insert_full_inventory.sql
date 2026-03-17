-- Script para insertar todas las categorías e insumos de Los Cochirinos

-- Primero eliminamos datos existentes para evitar duplicados
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM supplies;
DELETE FROM categories;

-- Reiniciar secuencias
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE supplies_id_seq RESTART WITH 1;

-- Insertar categorías
INSERT INTO categories (name) VALUES 
('Desechables'),
('Grasas'),
('Lácteos'),
('Carbohidratos'),
('Proteínas'),
('Semillas y Condimentos'),
('Verdura'),
('Suministros de Limpieza');

-- Insertar insumos de DESECHABLES (category_id = 1)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(1, 'Contenedor medio litro', 'Semanal', 0, 0, 'pza'),
(1, 'Tapa medio litro y litro', 'Semanal', 0, 0, 'pza'),
(1, 'Contenedor 1 litro', 'Semanal', 0, 0, 'pza'),
(1, 'Vasos de plástico 10 oz', 'Semanal', 0, 0, 'pza'),
(1, 'Tapas de vaso 10oz', 'Semanal', 0, 0, 'pza'),
(1, 'Vasos de plástico chico 4', 'Semanal', 0, 0, 'pza'),
(1, 'Tapa de vaso chico 4', 'Semanal', 0, 0, 'pza'),
(1, 'Contenedor 8x8', 'Semanal', 0, 0, 'pza'),
(1, 'Contenedor 7x7', 'Semanal', 0, 0, 'pza'),
(1, 'Servitoalla', 'Semanal', 0, 0, 'pza'),
(1, 'Servilletas', 'Semanal', 0, 0, 'paq'),
(1, 'Bolsas 25x35', 'Semanal', 0, 0, 'paq'),
(1, 'Bolsas empaque chico', 'Semanal', 0, 0, 'paq'),
(1, 'Bolsas empaque grande', 'Semanal', 0, 0, 'paq'),
(1, 'Bolsas de Basura', 'Semanal', 0, 0, 'paq'),
(1, 'Vasos de café para llevar', 'Semanal', 0, 0, 'pza'),
(1, 'Tapas de vaso café', 'Semanal', 0, 0, 'pza');

-- Insertar insumos de GRASAS (category_id = 2)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(2, 'Aceite vegetal', 'Semanal', 0, 0, 'l'),
(2, 'Aceite de olivo', 'Quincenal', 0, 0, 'l'),
(2, 'Manteca', 'Semanal', 0, 0, 'kg');

-- Insertar insumos de LÁCTEOS (category_id = 3)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(3, 'Crema', 'Tercer día', 0, 0, 'l'),
(3, 'Mantequilla', 'Semanal', 0, 0, 'kg'),
(3, 'Queso rallado', 'Semanal', 0, 0, 'kg'),
(3, 'Queso tipo gouda', 'Semanal', 0, 0, 'kg'),
(3, 'Crema para café', 'Semanal', 0, 0, 'l');

-- Insertar insumos de CARBOHIDRATOS (category_id = 4)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(4, 'Tortillas de maíz', 'Diario', 0, 0, 'kg'),
(4, 'Tortillas de harina chicas', 'Tercer día', 0, 0, 'paq'),
(4, 'Tortillas de harina grandes', 'Tercer día', 0, 0, 'paq'),
(4, 'Telera', 'Diario', 0, 0, 'pza');

-- Insertar insumos de PROTEÍNAS (category_id = 5)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(5, 'Carne de cerdo', 'Semanal', 0, 0, 'kg'),
(5, 'Carne de res para asar', 'Semanal', 0, 0, 'kg'),
(5, 'Carne de pollo para asar', 'Semanal', 0, 0, 'kg'),
(5, 'Huevo', 'Semanal', 0, 0, 'pza');

-- Insertar insumos de SEMILLAS Y CONDIMENTOS (category_id = 6)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(6, 'Frijol', 'Semanal', 0, 0, 'kg'),
(6, 'Orégano', 'Mensual', 0, 0, 'g'),
(6, 'Pimienta gorda', 'Mensual', 0, 0, 'g'),
(6, 'Sal', 'Quincenal', 0, 0, 'kg'),
(6, 'Achiote', 'Quincenal', 0, 0, 'kg'),
(6, 'Knorr', 'Semanal', 0, 0, 'pza'),
(6, 'Ajo', 'Semanal', 0, 0, 'kg'),
(6, 'Vinagre blanco', 'Quincenal', 0, 0, 'l'),
(6, 'Vinagre de manzana', 'Quincenal', 0, 0, 'l'),
(6, 'Salsa tipo maggi', 'Quincenal', 0, 0, 'l'),
(6, 'Salsa tipo inglesa', 'Quincenal', 0, 0, 'l');

-- Insertar insumos de VERDURA (category_id = 7)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(7, 'Habanero', 'Tercer día', 0, 0, 'kg'),
(7, 'Limón', 'Tercer día', 0, 0, 'kg'),
(7, 'Cilantro', 'Tercer día', 0, 0, 'manojo'),
(7, 'Chile verde', 'Tercer día', 0, 0, 'kg'),
(7, 'Tomate verde', 'Tercer día', 0, 0, 'kg'),
(7, 'Chile guajillo ancho', 'Semanal', 0, 0, 'kg'),
(7, 'Cebolla morada', 'Tercer día', 0, 0, 'kg'),
(7, 'Lechuga', 'Tercer día', 0, 0, 'pza'),
(7, 'Epazote', 'Semanal', 0, 0, 'manojo');

-- Insertar insumos de SUMINISTROS DE LIMPIEZA (category_id = 8)
INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit) VALUES
(8, 'Jabón de manos', 'Quincenal', 0, 0, 'l'),
(8, 'Jabón de trastes', 'Semanal', 0, 0, 'l'),
(8, 'Esponjas', 'Semanal', 0, 0, 'pza'),
(8, 'Fibras', 'Semanal', 0, 0, 'pza'),
(8, 'Guantes para manos nitrilo', 'Semanal', 0, 0, 'caja'),
(8, 'Guantes de limpieza', 'Quincenal', 0, 0, 'par'),
(8, 'Fabuloso', 'Semanal', 0, 0, 'l'),
(8, 'Cloro', 'Semanal', 0, 0, 'l'),
(8, 'Escobas', 'Mensual', 0, 0, 'pza'),
(8, 'Trapeador', 'Mensual', 0, 0, 'pza'),
(8, 'Cubetas', 'Trimestral', 0, 0, 'pza'),
(8, 'Toallas desengrasantes', 'Semanal', 0, 0, 'rollo'),
(8, 'Jergas', 'Quincenal', 0, 0, 'pza'),
(8, 'Trapos', 'Quincenal', 0, 0, 'pza');
