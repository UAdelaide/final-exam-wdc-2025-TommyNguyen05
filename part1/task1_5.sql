/* Adding 5 new users */
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('khanhle', 'khanhle@example.com', 'hashed696', 'walker'),
('jennifer', 'jennifer@example.com', 'hashed311', 'owner'); /* 3 owners, 2 walkers */

/* Adding 5 new dogs */
INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Luca', 'large'),
((SELECT user_id FROM Users WHERE username = 'jennifer'), 'Liam', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Harry', 'small');

/* Adding 5 new walk requests */
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')),
'2025-06-10 08:00:00', 30, 'Parklands', 'open'),

((SELECT dog_id FROM Dogs WHERE name = 'Bella' AND owner_id = (SELECT user_id FROM Users WHERE username = 'carol123')),
'2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),

((SELECT dog_id FROM Dogs WHERE name = 'Luca' AND owner_id = (SELECT user_id FROM Users WHERE username = 'alice123')),
'2025-06-11 18:00:00', 60, 'River Walk', 'open'),

((SELECT dog_id FROM Dogs WHERE name = 'Liam' AND owner_id = (SELECT user_id FROM Users WHERE username = 'jennifer')),
'2025-06-12 10:00:00', 30, 'Arndale', 'open'),

((SELECT dog_id FROM Dogs WHERE name = 'Harry' AND owner_id = (SELECT user_id FROM Users WHERE username = 'carol123')),
'2025-06-13 07:30:00', 45, 'North Terrace', 'cancelled');
