-- Optional: run AFTER schema.sql to pre-load the board with your current desk data.
-- Safe to skip if you'd rather start empty and add rows from the app.

insert into schools (name, group_name, contact, status) values
('Kings'' Al Barsha', 'Kings'' Education', 'Robyn Adams / Punam Bhara', 'Signed'),
('DBS Springs', 'Taaleem', 'Sheridan Teasel / Deepika Manghnani', 'Signed'),
('DBS Jumeirah Park', 'Taaleem', 'Lucy Stebbings', 'Signed'),
('GIS', 'Taaleem', 'Nicola Macmillan', 'Signed'),
('Ajyal International School MBZ', '—', 'Michaela March / Allison', 'Signed'),
('EIS Jumeirah', 'Taaleem', 'Wendy Feherty / Laila Sabet', 'Signed'),
('UIPS Dubai', '—', 'Danilo Rances', 'Signed'),
('Indian High School', 'IHS', 'Soumya Suthan', 'Signed'),
('NIMS Sharjah', '—', 'Feroz Mammed', 'Signed'),
('ABC British Academy', '—', 'Hazel Govender / Ann / Bushra', 'Pending'),
('VISS-KHF', '—', 'Steve Walsh / Ryan Harb', 'Signed'),
('Cranleigh Abu Dhabi', '—', 'Monica Dascal', 'Pending'),
('North Gate British School Ajman', '—', 'Michael Lynch', 'Pending');

insert into vacancies (school, group_name, role, contact, status, date_added) values
('Kings'' Al Barsha', 'Kings'' Education', 'A-Level Physics', 'Mishal Nur Rahim', 'Open', '2026-07-14'),
('Kings'' Al Barsha', 'Kings'' Education', 'Business', 'Robyn Adams', 'Open', '2026-07-10'),
('DBS Springs', 'Taaleem', 'English/Media Teacher — Term 1 (supply)', 'Sheridan Teasel', 'Open', '2026-07-21'),
('DBS Springs', 'Taaleem', 'STEAM Teacher — 1–2 term (supply)', 'Sheridan Teasel', 'Open', '2026-07-21'),
('DBS Springs', 'Taaleem', 'Maths Teacher — Term 1', 'Deepika Manghnani', 'Open', '2026-07-02'),
('DBS Springs', 'Taaleem', 'English Teacher — Term 1 (supply)', 'Sheridan Teasel', 'Filled', '2026-07-21'),
('DBS Jumeirah Park', 'Taaleem', 'EYFS Class Teacher', 'Lucy Stebbings', 'Open', '2026-07-15'),
('GIS', 'Taaleem', 'Secondary Maths (2 positions)', 'Nicola Macmillan', 'On Hold', '2026-07-14'),
('Ajyal International School MBZ', '—', 'FS2 Class Teacher (EYFS)', 'Michaela March', 'Filled', '2026-06-22'),
('Ajyal International School MBZ', '—', 'Business/Accounting', 'Allison', 'Open', '2026-07-05'),
('Ajyal International School MBZ', '—', 'Psychology/Sociology', 'Allison', 'Closed', '2026-07-05'),
('EIS Jumeirah', 'Taaleem', 'Business & Economics Teacher', 'Wendy Feherty / Laila Sabet', 'Closed', '2026-06-26'),
('UIPS Dubai', '—', 'Educational Director', 'Danilo Rances', 'Open', '2026-07-08'),
('Indian High School', 'IHS', 'Multiple (SPED, LSA, Music, English, Art, Maths, French)', 'Soumya Suthan', 'On Hold', '2026-06-23');

insert into pipeline (school, candidate, role, type, stage, note) values
('Kings'' Al Barsha', 'Nabil Anis', 'A-Level Physics', 'Permanent', 'Submitted', 'Start 2026-08-23'),
('Kings'' Al Barsha', 'Noman Shafiq', 'A-Level Physics', 'Permanent', 'Submitted', 'Start 2026-08-23'),
('Kings'' Al Barsha', 'Mohamed Elbayyar', 'A-Level Physics', 'Permanent', 'Submitted', ''),
('Kings'' Al Barsha', 'Vineeth Kumar', 'A-Level Physics', 'Permanent', 'Interview', 'Interviewed at Kings'''),
('DBS Springs', 'Nuha', 'English — Term 1', 'Supply', 'Interview', 'Interview 2026-07-22'),
('DBS Springs', 'Tahir', 'English — Term 1', 'Supply', 'Interview', 'Interview 2026-07-22'),
('DBS Springs', 'Frederick', 'English — Term 1', 'Supply', 'Submitted', ''),
('DBS Springs', 'Krizzane Salinas', 'English/Media — Term 1', 'Supply', 'Interview', 'Interview 2026-07-24'),
('DBS Springs', 'Tanzeela Shaikh', 'STEAM — Term 1', 'Supply', 'Interview', 'Interview 2026-07-24'),
('DBS Springs', 'Wajeeha', 'Maths — Term 1', 'Supply', 'Rejected', 'No A-Level experience'),
('DBS Jumeirah Park', 'Dinali Athukorala', 'EYFS', 'Permanent', 'Submitted', 'Chase Lucy for decision'),
('DBS Jumeirah Park', 'Suzanne Vaidya', 'EYFS', 'Permanent', 'Rejected', 'Already applied direct'),
('DBS Jumeirah Park', 'Harvinder Kaur', 'EYFS', 'Permanent', 'Rejected', 'Already applied direct'),
('GIS', 'Vahida Beevi', 'Secondary Maths', 'Permanent', 'Submitted', 'Chase Nicola for decision'),
('GIS', 'Abdeali Jawadwala', 'Secondary Maths', 'Permanent', 'Submitted', ''),
('Ajyal MBZ', 'Tahseen Muhammad', 'FS2 Class Teacher', 'Permanent', 'Offer', 'Offer out — confirm acceptance / package'),
('Ajyal MBZ', 'Bettinah Mutyavaviri', 'FS2 Class Teacher', 'Permanent', 'Rejected', ''),
('Ajyal MBZ', 'Sandra Kadoura', 'EYFS Class Teacher', 'Permanent', 'Offer', 'Offer out — confirm acceptance / package'),
('Ajyal MBZ', 'Bevemie Diamos', 'EYFS Class Teacher', 'Permanent', 'Rejected', ''),
('EIS Jumeirah', 'Piotr', 'Business & Economics', 'Permanent', 'Rejected', ''),
('VISS-KHF', 'Bernadette Sneddon', 'Grade 5 Primary Homeroom', 'Permanent', 'Rejected', 'Career instability + prior group history'),
('VISS-KHF', 'Sashoy Austin', 'Grade 5 Primary Homeroom', 'Permanent', 'Rejected', 'Interviewed poorly');

insert into daily_log (log_date, entry) values
('2026-07-24', 'Interview links sent to Krizzane Salinas and Tanzeela Shaikh (DBS Springs), interviews Thu 24th.'),
('2026-07-22', 'Nuha and Tahir interviewed for DBS Springs English — Term 1; awaiting feedback.'),
('2026-07-21', 'DBS Jumeirah Park rejected Suzanne Vaidya and Harvinder Kaur — both already applied direct, known to school.'),
('2026-07-17', 'Chased Nicola (GIS) on Vahida Beevi decision; confirmed Pakistani-passport restriction on submissions.'),
('2026-07-17', 'VISS-KHF rejected Bernadette Sneddon and Sashoy Austin for Grade 5 Primary Homeroom.'),
('2026-07-16', 'Ajyal MBZ offer confirmed for Tahseen Muhammad (FS2); package details requested from HR/Principal.'),
('2026-07-03', 'Sandra Kadoura interview complete at Ajyal; school proceeding to offer, liaising with Raj (HR).');
