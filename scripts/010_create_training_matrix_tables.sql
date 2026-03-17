-- Training Matrix Tables for Los Cochirinos

-- Areas de capacitación
CREATE TABLE IF NOT EXISTS training_areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT 'teal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tareas/Operaciones por área
CREATE TABLE IF NOT EXISTS training_tasks (
  id SERIAL PRIMARY KEY,
  area_id INTEGER REFERENCES training_areas(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integrantes del equipo
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  area_id INTEGER REFERENCES training_areas(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calificaciones de capacitación
CREATE TABLE IF NOT EXISTS training_ratings (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES team_members(id) ON DELETE CASCADE,
  task_id INTEGER REFERENCES training_tasks(id) ON DELETE CASCADE,
  level VARCHAR(20) DEFAULT 'sin_capacitar', -- sin_capacitar, inicial, competente, experto
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_id, task_id)
);

-- Insertar áreas
INSERT INTO training_areas (name, description, color) VALUES
('Cocina', 'Área de preparación de alimentos y cochinita pibil', 'orange'),
('Servicio', 'Área de atención al cliente y servicio en sala', 'teal'),
('Administración', 'Área de gestión, caja y operaciones administrativas', 'violet');

-- Tareas de COCINA (área 1)
INSERT INTO training_tasks (area_id, name, description, sort_order) VALUES
(1, 'Preparación de cochinita pibil', 'Marinado, achiote, hoja de plátano, tiempos de cocción', 1),
(1, 'Preparación de cebolla morada encurtida', 'Corte, encurtido con naranja agria y habanero', 2),
(1, 'Preparación de salsas (habanero, roja, verde)', 'Técnicas de molcajete y licuado, niveles de picor', 3),
(1, 'Preparación de frijoles refritos', 'Cocción, refrito con manteca, sazón', 4),
(1, 'Preparación de chilaquiles', 'Tostado de tortilla, bañado en salsa, gratinado', 5),
(1, 'Armado de tortas (Cochipuerkas)', 'Pan, frijoles, cochinita, cebolla, técnica de servido', 6),
(1, 'Preparación de molletes', 'Dorado de pan, untado, gratinado de queso', 7),
(1, 'Cocción y manejo de huevos', 'Estrellados, revueltos, técnicas de cocción', 8),
(1, 'Preparación de tacos', 'Calentado de tortilla, porcionado, presentación', 9),
(1, 'Manejo de café de olla', 'Preparación tradicional, temperatura, servido', 10),
(1, 'Limpieza y sanitización de cocina', 'Protocolos de limpieza, manejo de químicos', 11),
(1, 'Control de temperaturas y almacenamiento', 'Cadena de frío, PEPS, etiquetado', 12),
(1, 'Mise en place matutino', 'Preparación previa al servicio, organización', 13),
(1, 'Manejo de residuos y basura', 'Separación, tiempos de retiro, protocolos', 14),
(1, 'Porcionado estándar', 'Cantidades exactas por platillo, control de costos', 15);

-- Tareas de SERVICIO (área 2)
INSERT INTO training_tasks (area_id, name, description, sort_order) VALUES
(2, 'Script de bienvenida', 'Saludo, presentación del origen yucateco, ingredientes premium', 1),
(2, 'Conocimiento del menú completo', 'Platillos, precios, ingredientes, alérgenos', 2),
(2, 'Técnica de toma de orden', 'Escucha activa, sugerencias, confirmación', 3),
(2, 'Manejo de terminal punto de venta', 'Captura de órdenes, cobros, cortes', 4),
(2, 'Servicio de bebidas', 'Aguas frescas, refrescos, café de olla', 5),
(2, 'Montaje y desmontaje de mesas', 'Limpieza, acomodo, presentación', 6),
(2, 'Manejo de quejas y situaciones difíciles', 'Escucha, empatía, solución, escalamiento', 7),
(2, 'Sugerencia de extras y upselling', 'Huevo extra, queso, carne asada, técnicas de venta', 8),
(2, 'Cobro y manejo de efectivo', 'Arqueo, cambio, detección de billetes falsos', 9),
(2, 'Limpieza de área de comedor', 'Mesas, piso, ventanas, sanitarios', 10),
(2, 'Atención telefónica y pedidos para llevar', 'Protocolo telefónico, empaque, entrega', 11),
(2, 'Manejo de plataformas de delivery', 'Rappi, Uber Eats, Didi Food, tiempos', 12),
(2, 'Apertura de sucursal', 'Checklist de apertura, verificaciones', 13),
(2, 'Cierre de sucursal', 'Checklist de cierre, seguridad, limpieza final', 14);

-- Tareas de ADMINISTRACIÓN (área 3)
INSERT INTO training_tasks (area_id, name, description, sort_order) VALUES
(3, 'Corte de caja diario', 'Arqueo, reporte de ventas, depósitos', 1),
(3, 'Control de inventario', 'Conteo físico, registro en sistema, mermas', 2),
(3, 'Elaboración de órdenes de compra', 'Revisión de stock, pedidos a proveedores', 3),
(3, 'Recepción de mercancía', 'Verificación, calidad, registro de entrada', 4),
(3, 'Manejo de nómina básica', 'Asistencia, horas extra, adelantos', 5),
(3, 'Programación de horarios', 'Turnos, descansos, cobertura', 6),
(3, 'Atención a proveedores', 'Negociación, pagos, relación comercial', 7),
(3, 'Reportes de ventas semanales', 'Análisis, comparativos, tendencias', 8),
(3, 'Manejo de facturación', 'Emisión de facturas, portal SAT', 9),
(3, 'Control de gastos operativos', 'Registro, categorización, presupuesto', 10),
(3, 'Supervisión de limpieza y mantenimiento', 'Checklists, seguimiento, reportes', 11),
(3, 'Capacitación de personal nuevo', 'Inducción, entrenamiento, evaluación', 12),
(3, 'Manejo de redes sociales básico', 'Publicaciones, respuestas, promociones', 13),
(3, 'Resolución de incidencias operativas', 'Toma de decisiones, escalamiento', 14);
