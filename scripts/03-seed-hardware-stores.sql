-- Seed hardware stores data
INSERT INTO hardware_stores (name, location, address, phone, email, rating, specialties) VALUES
  ('BuildMart Kenya', 'Nairobi', 'Industrial Area, Nairobi', '+254 700 123 456', 'info@buildmart.co.ke', 4.5, ARRAY['cement', 'steel', 'timber', 'roofing']),
  ('Cemtech Supplies', 'Mombasa', 'Changamwe, Mombasa', '+254 700 234 567', 'sales@cemtech.co.ke', 4.3, ARRAY['cement', 'blocks', 'sand', 'aggregates']),
  ('Steel & Iron Ltd', 'Nairobi', 'Ruaraka, Nairobi', '+254 700 345 678', 'orders@steeliron.co.ke', 4.7, ARRAY['steel', 'iron', 'reinforcement', 'metal']),
  ('Timber Traders', 'Nakuru', 'Nakuru Town', '+254 700 456 789', 'info@timbertraders.co.ke', 4.2, ARRAY['timber', 'wood', 'plywood', 'doors']),
  ('Roofing Solutions', 'Kisumu', 'Kisumu CBD', '+254 700 567 890', 'sales@roofingsolutions.co.ke', 4.6, ARRAY['roofing', 'iron sheets', 'tiles', 'gutters']),
  ('Hardware Hub', 'Eldoret', 'Eldoret Town', '+254 700 678 901', 'info@hardwarehub.co.ke', 4.4, ARRAY['general hardware', 'tools', 'paint', 'plumbing']);
