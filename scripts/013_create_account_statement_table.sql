-- Account statement items table
CREATE TABLE IF NOT EXISTS account_items (
  id SERIAL PRIMARY KEY,
  concept TEXT NOT NULL,
  price DECIMAL(12,2) DEFAULT 0,
  payment DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the existing data
INSERT INTO account_items (concept, price, payment) VALUES
('Fachada de acuerdo a diseño, en lamina cal 14 oxidad a y barnizada con transparente automotriz iluminada en canales con manguera led, incluye demolición y envoquillado de puerta de acceso, puerta de aluminio color café, con chapa de seguridad, anuncio luminoso y moneda lateral, nicho de jardineras y jardineras empotrables nicho con iluminación, incluye material, mano de obra y retiro de escombro', 146000, 20000),
('Modificación a puerta de aluminio', 7680, 0),
('Opinion Positiva Wendy', 12000, 0),
('Pelicula de esmeril cristal puerta de aluminio', 700, 0);
