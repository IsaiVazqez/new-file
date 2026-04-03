CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT,
  category TEXT DEFAULT 'general',
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Seed default settings
INSERT OR IGNORE INTO settings (key, value, label, category) VALUES
  ('site_name', 'NewFile Studio', 'Nombre del sitio', 'general'),
  ('site_description', 'Estudio de Visualización Arquitectónica', 'Descripción', 'general'),
  ('contact_email', 'hola@newfile.studio', 'Email de contacto', 'contacto'),
  ('contact_phone', '+52-999-123-4567', 'Teléfono', 'contacto'),
  ('contact_address', 'Calle 60 #450, Centro Histórico, Mérida, Yucatán', 'Dirección', 'contacto'),
  ('whatsapp_url', 'https://wa.me/529991234567', 'WhatsApp URL', 'contacto'),
  ('social_instagram', 'https://instagram.com/new.file', 'Instagram', 'redes'),
  ('social_facebook', '', 'Facebook', 'redes'),
  ('social_tiktok', '', 'TikTok', 'redes'),
  ('social_behance', '', 'Behance', 'redes'),
  ('social_linkedin', '', 'LinkedIn', 'redes');
