-- Seeding script for JanSetu-AI

-- 1. SEED DEPARTMENTS
INSERT INTO departments (id, name, category, contact, sla_hours) VALUES
('municipal', 'Municipal Corporation', 'Public Infrastructure & Civic Maintenance', 'municipal.help@jansetu.gov.in', 96),
('electricity', 'Electricity Department', 'Power Supply & Maintenance', 'electricity.help@jansetu.gov.in', 48),
('water', 'Water Supply Department', 'Water Distribution & Pipelines', 'water.help@jansetu.gov.in', 96),
('roads', 'Roads & Transport', 'Road Maintenance & Infrastructure', 'roads.help@jansetu.gov.in', 96),
('police', 'Police', 'Public Safety & Security', 'police.help@jansetu.gov.in', 48),
('healthcare', 'Healthcare', 'Government Hospitals & Health Centers', 'healthcare.help@jansetu.gov.in', 96),
('education', 'Education', 'Government Schools & Examination Boards', 'education.help@jansetu.gov.in', 96),
('sanitation', 'Sanitation', 'Waste Management & Public Hygiene', 'sanitation.help@jansetu.gov.in', 96),
('pds', 'Public Distribution System', 'Ration & Food Supplies', 'pds.help@jansetu.gov.in', 96),
('revenue', 'Revenue Department', 'Land Records & Property Tax', 'revenue.help@jansetu.gov.in', 168),
('electricity_board', 'Electricity Board', 'Utility Billing & Metres', 'billing.electricity@jansetu.gov.in', 48),
('environment', 'Environment Department', 'Pollution Control & Forestry', 'env.help@jansetu.gov.in', 168),
('women_child', 'Women & Child Development', 'Social Welfare Services', 'wcd.help@jansetu.gov.in', 96),
('social_welfare', 'Social Welfare', 'Pension & Disability Benefits', 'social.help@jansetu.gov.in', 168),
('agriculture', 'Agriculture', 'Farming Subsidies & Seeds Support', 'agri.help@jansetu.gov.in', 168),
('housing', 'Housing', 'Government Housing Schemes', 'housing.help@jansetu.gov.in', 168),
('telecom', 'Telecommunications', 'Government Broadband & Telecom Network', 'telecom.help@jansetu.gov.in', 96),
('other', 'Other', 'General Enquiries & Miscellaneous Services', 'support@jansetu.gov.in', 168)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    category = EXCLUDED.category, 
    contact = EXCLUDED.contact, 
    sla_hours = EXCLUDED.sla_hours;

-- 2. SEED USERS
INSERT INTO users (id, name, email, phone, role, department_id, city, state) VALUES
('usr_citizen', 'Rahul Verma', 'demo.citizen@jansetu.ai', '9876543210', 'citizen', NULL, 'Vadodara', 'Gujarat'),
('usr_officer', 'Amit Sharma', 'demo.officer@jansetu.ai', '9988776655', 'officer', 'municipal', 'Vadodara', 'Gujarat'),
('usr_admin', 'Rajesh Kumar', 'demo.admin@jansetu.ai', '9123456789', 'admin', NULL, 'New Delhi', 'Delhi'),
('usr_citizen_2', 'Priyal Patel', 'priyal.patel@gmail.com', '9898989898', 'citizen', NULL, 'Vadodara', 'Gujarat'),
('usr_citizen_3', 'Rohan Gupta', 'rohan.gupta@gmail.com', '9797979797', 'citizen', NULL, 'Ahmedabad', 'Gujarat')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    email = EXCLUDED.email, 
    phone = EXCLUDED.phone, 
    role = EXCLUDED.role, 
    department_id = EXCLUDED.department_id, 
    city = EXCLUDED.city, 
    state = EXCLUDED.state;

-- 3. SEED OFFICERS
INSERT INTO officers (id, name, department_id, zone, email, phone, active) VALUES
('usr_officer', 'Amit Sharma', 'municipal', 'Ward 12', 'demo.officer@jansetu.ai', '9988776655', TRUE),
('off_electricity', 'Suresh Patil', 'electricity', 'Zone 3', 'suresh.electricity@jansetu.ai', '9876123456', TRUE),
('off_water', 'Mahesh Patel', 'water', 'Zone A', 'mahesh.water@jansetu.ai', '9876543211', TRUE),
('off_roads', 'Vikram Singh', 'roads', 'Central Ward', 'vikram.roads@jansetu.ai', '9876543212', TRUE),
('off_police', 'Inspector Vijay', 'police', 'City Center Station', 'vijay.police@jansetu.ai', '9876543213', TRUE)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    department_id = EXCLUDED.department_id, 
    zone = EXCLUDED.zone, 
    email = EXCLUDED.email, 
    phone = EXCLUDED.phone, 
    active = EXCLUDED.active;

-- 4. SEED GRIEVANCES
INSERT INTO grievances (id, citizen_id, title, description, category, subcategory, department_id, location, priority, ai_confidence, ai_summary, status, assigned_officer_id, sla_deadline, created_at, updated_at, resolved_at, evidence_urls) VALUES
('JS-2026-001245', 'usr_citizen', 'Streetlight not working', 'There has been no streetlight working outside our apartment for the last 5 days. It is very dark at night and unsafe for children.', 'Public Infrastructure', 'Street Lighting', 'municipal', '{"lat": 22.3072, "lng": 73.1812, "address": "Block C, Samrajya Flats, Gotri Road", "city": "Vadodara", "ward": "Ward 12"}', 'Medium', 94.0, 'Citizen reports a non-functional streetlight near their residential building for approximately five days, potentially affecting public safety during nighttime.', 'In Progress', 'usr_officer', NOW() + INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NULL, '{}'::TEXT[]),

('JS-2026-001246', 'usr_citizen_2', 'Power outage in block B', 'Total blackout in our block since yesterday 6 PM. No info from local helpline.', 'Utilities', 'Power Failure', 'electricity', '{"lat": 22.3120, "lng": 73.1950, "address": "Block B, Alkapuri Heights", "city": "Vadodara", "ward": "Ward 5"}', 'High', 96.0, 'Sudden total power outage reported in residential apartments since yesterday evening with no updates from local helpline support.', 'Assigned', 'off_electricity', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL, '{}'::TEXT[]),

('JS-2026-001247', 'usr_citizen_3', 'Garbage not collected since 3 days', 'The municipal garbage truck has not visited our street for three consecutive days. Waste piles are accumulating on roadsides causing foul smells.', 'Sanitation', 'Waste Accumulation', 'municipal', '{"lat": 23.0225, "lng": 72.5714, "address": "Aura Residency, Satellite Area", "city": "Ahmedabad", "ward": "Ward 1"}', 'Medium', 92.0, 'Accumulated uncollected domestic waste on residential streets for three consecutive days resulting in hygiene concerns and bad odor.', 'Resolved', 'usr_officer', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', '{}'::TEXT[]),

('JS-2026-001248', 'usr_citizen', 'Major water pipeline leakage', 'There is a huge crack in the main water supply pipeline causing lakhs of liters of water to waste on the road. Water pressure in homes is very low.', 'Utilities', 'Water Leakage', 'water', '{"lat": 22.3015, "lng": 73.1690, "address": "Main Road Cross, Vasna Road", "city": "Vadodara", "ward": "Ward 12"}', 'High', 95.0, 'Major pipe rupture on the main public pipeline causing massive potable water wastage and drop in household water distribution pressure.', 'In Progress', 'off_water', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', NULL, '{}'::TEXT[]),

('JS-2026-001249', 'usr_citizen_2', 'Pothole on main highway road', 'A massive, deep pothole has formed on the highway near the bypass bridge. It is causing severe accidents and traffic jams.', 'Public Infrastructure', 'Road Damage', 'roads', '{"lat": 22.3300, "lng": 73.2200, "address": "National Highway Bypass Flyover, Harni", "city": "Vadodara", "ward": "Ward 4"}', 'High', 97.0, 'Dangerous deep pothole on a high-speed bypass highway causing structural hazards, vehicle damage, and high risk of accidents.', 'Escalated', 'off_roads', NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', NULL, '{}'::TEXT[]),

('JS-2026-001250', 'usr_citizen_3', 'School infrastructure issue', 'The ceiling plaster of government secondary school classroom fell yesterday. Fortunately, it was Sunday so children were not present. Needs urgent repairs.', 'Education', 'School Maintenance', 'education', '{"lat": 23.0300, "lng": 72.5800, "address": "Govt Boys High School, Gota", "city": "Ahmedabad", "ward": "Ward 3"}', 'Medium', 89.0, 'Partial ceiling plaster collapse inside a state secondary school classroom requesting urgent civil inspection and maintenance repairs.', 'Submitted', NULL, NOW() + INTERVAL '4 days', NOW(), NOW(), NULL, '{}'::TEXT[]),

('JS-2026-001235', 'usr_citizen', 'Illegal garbage dumping', 'Commercial waste is being dumped illegally in the empty plot next to our house during midnight hours.', 'Sanitation', 'Illegal Dumping', 'municipal', '{"lat": 22.3072, "lng": 73.1812, "address": "Plot 42, Gotri Road", "city": "Vadodara", "ward": "Ward 12"}', 'Medium', 91.0, 'Unlawful late-night dumping of commercial solid waste in an vacant plot adjacent to domestic residential housing.', 'Closed', 'usr_officer', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', '{}'::TEXT[]),

('JS-2026-001236', 'usr_citizen_3', 'Low water pressure', 'We receive tap water for only 15 minutes daily and that too with very low pressure. Not enough to fill single bucket.', 'Utilities', 'Low Water Supply', 'water', '{"lat": 23.0100, "lng": 72.5500, "address": "Girdhar Nagar", "city": "Ahmedabad", "ward": "Ward 10"}', 'Low', 93.0, 'Short duration and inadequate pressure of drinking water supply in household connections.', 'Resolved', 'off_water', NOW() - INTERVAL '2 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', '{}'::TEXT[]),

('JS-2026-001237', 'usr_citizen', 'Traffic light malfunctioning', 'The traffic signal at Alkapuri circle is stuck on red from all directions causing absolute chaos.', 'Public Infrastructure', 'Traffic Signals', 'roads', '{"lat": 22.3100, "lng": 73.1800, "address": "Alkapuri Circle", "city": "Vadodara", "ward": "Ward 12"}', 'High', 95.0, 'Malfunctioning traffic control light signals causing dangerous junction gridlocks.', 'Resolved', 'off_roads', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', '{}'::TEXT[]),

('JS-2026-001238', 'usr_citizen', 'Noise pollution late night', 'A local banquet hall is playing loud music past 1 AM. It is disturbing senior citizens and sleeping infants.', 'Public Safety', 'Noise Pollution', 'police', '{"lat": 22.3072, "lng": 73.1812, "address": "Rajpath Banquets, Gotri Road", "city": "Vadodara", "ward": "Ward 12"}', 'Medium', 90.0, 'Violation of midnight commercial decibel limits disturbing sleep and peace in residential zoning.', 'Closed', 'off_police', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', '{}'::TEXT[]),

('JS-2026-001239', 'usr_citizen_2', 'Primary health center lack of medicines', 'The local government health center has no basic antibiotics or paracetamol in stock for past 1 week. Patients are asked to buy from outside.', 'Healthcare', 'Medicine Shortage', 'healthcare', '{"lat": 22.3150, "lng": 73.2000, "address": "Sub-Health Center, Harni", "city": "Vadodara", "ward": "Ward 4"}', 'High', 94.0, 'Medicine shortage at government primary care dispensary forced patients to source retail medication out-of-pocket.', 'In Progress', NULL, NOW() + INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NULL, '{}'::TEXT[]),

('JS-2026-001240', 'usr_citizen_3', 'Ration card distribution delay', 'Applied for new BPL ration card 3 months ago. Application status is pending verification at center.', 'Utilities', 'PDS Grievance', 'pds', '{"lat": 23.0400, "lng": 72.6000, "address": "Ration Shop 12, Nikol", "city": "Ahmedabad", "ward": "Ward 12"}', 'Medium', 88.0, 'Delayed processing and document distribution of BPL Ration application cards exceeding standard timelines.', 'In Progress', NULL, NOW() + INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', NULL, '{}'::TEXT[]),

('JS-2026-001241', 'usr_citizen', 'Drainage water overflow on street', 'The sewer line is blocked and black sewage water is overflowing onto our society entrance road. It is highly unhygienic and smelling bad.', 'Sanitation', 'Sewer Overflows', 'municipal', '{"lat": 22.3080, "lng": 73.1820, "address": "Royal Residency, Gotri", "city": "Vadodara", "ward": "Ward 12"}', 'High', 96.0, 'Blocked public drainage mains causing backup of toxic municipal wastewater directly onto residential entrance pavements.', 'In Progress', 'usr_officer', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '6 hours', NULL, '{}'::TEXT[]),

('JS-2026-001242', 'usr_citizen_2', 'Voltage fluctuations destroying appliances', 'Severe high voltage spikes occurring multiple times daily. Already my refrigerator motor got burnt yesterday.', 'Utilities', 'Voltage Spikes', 'electricity', '{"lat": 22.3130, "lng": 73.1960, "address": "Vasant Vihar, Alkapuri", "city": "Vadodara", "ward": "Ward 5"}', 'Medium', 93.0, 'Intermittent high electrical voltage spikes in domestic lines damaging domestic refrigerator motors.', 'Submitted', NULL, NOW() + INTERVAL '2 days', NOW(), NOW(), NULL, '{}'::TEXT[]),

('JS-2026-001243', 'usr_citizen_3', 'Cyber theft complaint', 'Received phishing SMS and Rs 45,000 debited from bank account. Need urgent registration of cyber police complaint.', 'Public Safety', 'Cyber Crime', 'police', '{"lat": 23.0200, "lng": 72.5600, "address": "Vastrapur Police Station Area", "city": "Ahmedabad", "ward": "Ward 2"}', 'High', 95.0, 'Unauthorized financial withdrawal from bank account through deceptive phishing links.', 'Assigned', 'off_police', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', NULL, '{}'::TEXT[]),

('JS-2026-001244', 'usr_citizen', 'Park maintenance issues', 'The children public park has broken swings and rusted slides which can injure kids. Lighting is also missing.', 'Public Infrastructure', 'Park Maintenance', 'municipal', '{"lat": 22.3072, "lng": 73.1812, "address": "Childrens Park, Gotri Road", "city": "Vadodara", "ward": "Ward 12"}', 'Low', 92.0, 'Dilapidated recreational structures and absence of evening lighting inside municipal child parks.', 'Resolved', 'usr_officer', NOW() - INTERVAL '3 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', '{}'::TEXT[])
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    department_id = EXCLUDED.department_id,
    location = EXCLUDED.location,
    priority = EXCLUDED.priority,
    ai_confidence = EXCLUDED.ai_confidence,
    ai_summary = EXCLUDED.ai_summary,
    status = EXCLUDED.status,
    assigned_officer_id = EXCLUDED.assigned_officer_id,
    sla_deadline = EXCLUDED.sla_deadline,
    updated_at = EXCLUDED.updated_at,
    resolved_at = EXCLUDED.resolved_at;

-- 5. SEED TIMELINE LOGS
INSERT INTO grievance_updates (grievance_id, status, remark, updated_by, timestamp) VALUES
('JS-2026-001245', 'Submitted', 'Grievance submitted by citizen Rahul Verma', 'Citizen System', NOW() - INTERVAL '2 days'),
('JS-2026-001245', 'AI Classified', 'AI auto-detected Category: Public Infrastructure, Department: Municipal Corporation, SLA: 4 Days', 'JanSetu AI', NOW() - INTERVAL '2 days'),
('JS-2026-001245', 'Assigned', 'Grievance auto-routed to Municipal Officer Amit Sharma (Ward 12)', 'JanSetu Dispatcher', NOW() - INTERVAL '2 days'),
('JS-2026-001245', 'In Progress', 'Officer visited site. Streetlight bulb replacement ordered from central inventory.', 'Officer Amit Sharma', NOW() - INTERVAL '1 day'),

('JS-2026-001246', 'Submitted', 'Grievance submitted by citizen Priyal Patel', 'Citizen System', NOW() - INTERVAL '1 day'),
('JS-2026-001246', 'AI Classified', 'AI auto-detected Category: Utilities, Department: Electricity Department, SLA: 48 Hours', 'JanSetu AI', NOW() - INTERVAL '1 day'),
('JS-2026-001246', 'Assigned', 'Assigned to Electricity Officer Suresh Patil (Zone 3)', 'JanSetu Dispatcher', NOW() - INTERVAL '1 day'),

('JS-2026-001247', 'Submitted', 'Grievance submitted by citizen Rohan Gupta', 'Citizen System', NOW() - INTERVAL '4 days'),
('JS-2026-001247', 'AI Classified', 'AI auto-detected Category: Sanitation, Department: Municipal Corporation, SLA: 4 Days', 'JanSetu AI', NOW() - INTERVAL '4 days'),
('JS-2026-001247', 'Assigned', 'Assigned to Municipal Officer Amit Sharma', 'JanSetu Dispatcher', NOW() - INTERVAL '4 days'),
('JS-2026-001247', 'In Progress', 'Solid waste cleanup truck routed to location.', 'Officer Amit Sharma', NOW() - INTERVAL '3 days'),
('JS-2026-001247', 'Resolved', 'Waste cleared and bins sanitized. Photo proof uploaded.', 'Officer Amit Sharma', NOW() - INTERVAL '1 day'),

('JS-2026-001248', 'Submitted', 'Grievance submitted by citizen Rahul Verma', 'Citizen System', NOW() - INTERVAL '1 day'),
('JS-2026-001248', 'AI Classified', 'AI auto-detected Category: Utilities, Department: Water Supply Department, SLA: 4 Days', 'JanSetu AI', NOW() - INTERVAL '1 day'),
('JS-2026-001248', 'Assigned', 'Assigned to Water Officer Mahesh Patel', 'JanSetu Dispatcher', NOW() - INTERVAL '1 day'),
('JS-2026-001248', 'In Progress', 'Main valve closed. Welder team on site repairing pipeline crack.', 'Officer Mahesh Patel', NOW() - INTERVAL '12 hours'),

('JS-2026-001249', 'Submitted', 'Grievance submitted by citizen Priyal Patel', 'Citizen System', NOW() - INTERVAL '4 days'),
('JS-2026-001249', 'AI Classified', 'AI auto-detected Category: Public Infrastructure, Department: Roads & Transport, SLA: 4 Days', 'JanSetu AI', NOW() - INTERVAL '4 days'),
('JS-2026-001249', 'Assigned', 'Assigned to Roads Officer Vikram Singh', 'JanSetu Dispatcher', NOW() - INTERVAL '4 days'),
('JS-2026-001249', 'Escalated', 'Resolution timeline exceeded (96 Hours breach). Auto-escalated to Command Center.', 'JanSetu SLA Engine', NOW() - INTERVAL '2 days'),

('JS-2026-001250', 'Submitted', 'Grievance submitted by citizen Rohan Gupta', 'Citizen System', NOW()),

('JS-2026-001235', 'Submitted', 'Grievance submitted by citizen Rahul Verma', 'Citizen System', NOW() - INTERVAL '10 days'),
('JS-2026-001235', 'AI Classified', 'AI auto-detected Category: Sanitation, Department: Municipal Corporation, SLA: 4 Days', 'JanSetu AI', NOW() - INTERVAL '10 days'),
('JS-2026-001235', 'Assigned', 'Assigned to Municipal Officer Amit Sharma', 'JanSetu Dispatcher', NOW() - INTERVAL '10 days'),
('JS-2026-001235', 'In Progress', 'Inspected site and issued fine to local builders dumping debris.', 'Officer Amit Sharma', NOW() - INTERVAL '8 days'),
('JS-2026-001235', 'Resolved', 'Debris completely removed. Warning board installed.', 'Officer Amit Sharma', NOW() - INTERVAL '6 days'),
('JS-2026-001235', 'Closed', 'Citizen closed the ticket and left positive rating.', 'Citizen Rahul Verma', NOW() - INTERVAL '6 days'),

('JS-2026-001236', 'Submitted', 'Grievance submitted by citizen Rohan Gupta', 'Citizen System', NOW() - INTERVAL '6 days'),
('JS-2026-001236', 'Resolved', 'Realigned booster pump valves in primary pumping station.', 'Officer Mahesh Patel', NOW() - INTERVAL '3 days'),

('JS-2026-001237', 'Submitted', 'Grievance submitted by citizen Rahul Verma', 'Citizen System', NOW() - INTERVAL '3 days'),
('JS-2026-001237', 'Resolved', 'Signal controller motherboard replaced by technician.', 'Officer Vikram Singh', NOW() - INTERVAL '1 day'),

('JS-2026-001238', 'Submitted', 'Grievance submitted by citizen Rahul Verma', 'Citizen System', NOW() - INTERVAL '1 day'),
('JS-2026-001238', 'Resolved', 'Patrol team dispatched. Issued warning. Banquet hall turned off speaker systems.', 'Officer Inspector Vijay', NOW() - INTERVAL '12 hours'),
('JS-2026-001238', 'Closed', 'Complaint marked resolved by citizen.', 'Citizen Rahul Verma', NOW() - INTERVAL '12 hours')
ON CONFLICT DO NOTHING;

-- 6. SEED FEEDBACK
INSERT INTO feedback (grievance_id, rating, comment, reopened, created_at) VALUES
('JS-2026-001235', 5, 'Quick action! The builder was fined and debris removed.', FALSE, NOW() - INTERVAL '6 days'),
('JS-2026-001236', 4, 'Water pressure has improved, thanks.', FALSE, NOW() - INTERVAL '3 days'),
('JS-2026-001237', 5, 'Traffic light is working fine now.', FALSE, NOW() - INTERVAL '1 day'),
('JS-2026-001238', 4, 'Police resolved it within 30 minutes of filing.', FALSE, NOW() - INTERVAL '12 hours')
ON CONFLICT (grievance_id) DO UPDATE SET 
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    reopened = EXCLUDED.reopened;

-- 7. SEED NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, grievance_id, is_read, created_at) VALUES
('usr_citizen', 'Streetlight complaint update', 'Your grievance JS-2026-001245 is now In Progress. Officer Amit Sharma has ordered parts.', 'JS-2026-001245', FALSE, NOW() - INTERVAL '1 day'),
('usr_citizen', 'Water leak complaint update', 'Your grievance JS-2026-001248 has been assigned to Officer Mahesh Patel.', 'JS-2026-001248', FALSE, NOW() - INTERVAL '1 day'),
('usr_citizen', 'Garbage complaint resolved', 'Grievance JS-2026-001235 has been marked as Resolved. Please provide feedback.', 'JS-2026-001235', TRUE, NOW() - INTERVAL '6 days')
ON CONFLICT DO NOTHING;
