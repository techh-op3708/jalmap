INSERT INTO states (id, name, lat, lng, overall_risk)
VALUES
  ('maharashtra', 'Maharashtra', 19.7515, 75.7139, 'Moderate'),
  ('uttar-pradesh', 'Uttar Pradesh', 26.8467, 80.9462, 'Contaminated'),
  ('delhi', 'Delhi', 28.7041, 77.1025, 'Contaminated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cities (
  state_id, city_name, district, lat, lng, source, tds, ph, turbidity, fluoride, nitrate, arsenic, risk, reason, contaminants, updated_at
)
VALUES
  ('maharashtra', 'Mumbai', 'Mumbai', 19.0760, 72.8777, 'Mixed', 420, 7.2, 2.8, 0.3, 12, 0.005, 'Moderate', 'Mumbai draws from treated reservoirs but ageing pipes cause intermittent turbidity spikes.', ARRAY['Turbidity','OldPipes'], '2025-03-14'),
  ('maharashtra', 'Pune', 'Pune', 18.5204, 73.8567, 'River', 380, 7.5, 0.9, 0.4, 18, 0.003, 'Safe', 'Pune is supplied by a modern reservoir system and remains within BIS limits.', ARRAY[]::text[], '2025-03-14'),
  ('uttar-pradesh', 'Kanpur', 'Kanpur Nagar', 26.4499, 80.3319, 'River', 720, 7.6, 4.5, 0.6, 52, 0.04, 'Critical', 'Kanpur has severe industrial discharge and elevated arsenic and nitrate.', ARRAY['IndustrialWaste','Arsenic','Nitrate'], '2025-03-12'),
  ('delhi', 'West Delhi', 'West Delhi', 28.6439, 77.0833, 'Groundwater', 820, 8.0, 1.7, 1.4, 56, 0.022, 'Critical', 'West Delhi groundwater is degraded by industrial effluent and poor treatment.', ARRAY['IndustrialWaste','Fluoride','Nitrate'], '2025-03-15')
ON CONFLICT DO NOTHING;
