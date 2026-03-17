-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  delivery_days VARCHAR(255),
  payment_method VARCHAR(255),
  supplies_provided TEXT,
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert suggested suppliers for a Cochinita Pibil restaurant
INSERT INTO suppliers (name, contact_person, phone, supplies_provided, delivery_days, payment_method, rating, notes) VALUES
('Carniceria La Yucateca', 'Don Manuel', '555-123-4567', 'Cerdo para cochinita, carne para tacos', 'Lunes, Miercoles, Viernes', 'Efectivo / Transferencia', 4, 'Llegar temprano para mejor corte. Pedir con 1 dia de anticipacion.'),
('Achiotes del Sureste', 'Sra. Carmen', '555-234-5678', 'Pasta de achiote, especias yucatecas, chile habanero', 'Martes, Jueves', 'Transferencia', 5, 'Producto autentico de Yucatan. Pedido minimo $500.'),
('Tortilleria El Maiz', 'Roberto', '555-345-6789', 'Tortillas de maiz, tostadas para panuchos', 'Diario', 'Efectivo', 4, 'Entrega 7am. Avisar cambios de cantidad con anticipacion.'),
('Verduras Frescas MX', 'Lupita', '555-456-7890', 'Cebolla morada, cilantro, limon, naranja agria, jitomate', 'Lunes, Miercoles, Viernes', 'Efectivo / Credito 15 dias', 4, 'Revisar calidad al recibir. Buenos precios en temporada.'),
('Frijoles y Granos SA', 'Ing. Perez', '555-567-8901', 'Frijol negro, arroz, lentejas', 'Quincenal', 'Transferencia', 3, 'Compra al mayoreo. Almacenar en lugar seco.'),
('Panaderia Don Pancho', 'Pancho', '555-678-9012', 'Pan frances para tortas, pan dulce para desayunos', 'Diario', 'Efectivo', 5, 'Entrega 6:30am. Pan recien horneado.'),
('Refrescos y Bebidas Centro', 'Lic. Garcia', '555-789-0123', 'Refrescos, aguas frescas, cerveza', 'Martes, Viernes', 'Credito 30 dias', 4, 'Dejar envases vacios listos para intercambio.'),
('Lacteos del Norte', 'Maria', '555-890-1234', 'Queso Oaxaca, crema, queso de bola', 'Lunes, Jueves', 'Transferencia', 4, 'Refrigerar inmediatamente. Verificar fechas de caducidad.'),
('Desechables Express', 'Juan', '555-901-2345', 'Contenedores, servilletas, bolsas, vasos', 'Semanal', 'Credito 15 dias', 3, 'Pedir con 3 dias de anticipacion. Minimo $1000.'),
('Gas LP Rapido', 'Dispatcher', '555-012-3456', 'Gas LP para cocina', 'Bajo demanda', 'Efectivo', 4, 'Llamar cuando tanque este al 20%. Entrega mismo dia.');
