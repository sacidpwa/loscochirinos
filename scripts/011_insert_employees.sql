-- Insert employees for Los Cochirinos
-- Each employee is added to all 3 areas so they can be evaluated across departments

-- Get area IDs
DO $$
DECLARE
  cocina_id INT;
  servicio_id INT;
  admin_id INT;
BEGIN
  SELECT id INTO cocina_id FROM training_areas WHERE name = 'Cocina';
  SELECT id INTO servicio_id FROM training_areas WHERE name = 'Servicio';
  SELECT id INTO admin_id FROM training_areas WHERE name = 'Administracion';

  -- Wendy - Titular de Cocina
  INSERT INTO team_members (name, position, area_id) VALUES ('Wendy', 'Titular Cocina', cocina_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Wendy', 'Apoyo Servicio', servicio_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Wendy', 'Apoyo Administracion', admin_id) ON CONFLICT DO NOTHING;

  -- Adrian - Titular de Servicio
  INSERT INTO team_members (name, position, area_id) VALUES ('Adrian', 'Apoyo Cocina', cocina_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Adrian', 'Titular Servicio', servicio_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Adrian', 'Apoyo Administracion', admin_id) ON CONFLICT DO NOTHING;

  -- Fernanda - Titular de Administracion
  INSERT INTO team_members (name, position, area_id) VALUES ('Fernanda', 'Apoyo Cocina', cocina_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Fernanda', 'Apoyo Servicio', servicio_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Fernanda', 'Titular Administracion', admin_id) ON CONFLICT DO NOTHING;

  -- Edith - Expo (between kitchen and service)
  INSERT INTO team_members (name, position, area_id) VALUES ('Edith', 'Expo / Apoyo Cocina', cocina_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Edith', 'Expo / Apoyo Servicio', servicio_id) ON CONFLICT DO NOTHING;
  INSERT INTO team_members (name, position, area_id) VALUES ('Edith', 'Apoyo Administracion', admin_id) ON CONFLICT DO NOTHING;
END $$;
