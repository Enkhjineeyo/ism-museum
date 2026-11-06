-- 2022 оноос хойших тэнхимийн өдөрлөгүүд (жилд 2 удаа: хавар, намар)
-- Өмнөх 03 файлаар орсон таамаглалтай 3 мөрийг арилгаад, зөв мэдээллээр дахин оруулна.
delete from events where cover_image_url in ('/events/sports-day.jpg','/events/halloween.jpg','/events/welcome-night.jpg');
delete from gallery_photos where image_url in ('/events/sports-day.jpg','/events/halloween.jpg','/events/welcome-night.jpg','/events/img4.jpg');

insert into events (title, event_date, event_type, location, organizer, participants, purpose, description, cover_image_url, source_url, is_active) values
('Нөхөрлөл өдөрлөг — 2022 намар', '2022-10-09', 'Тэнхимийн өдөрлөг', 'Mon Resort',
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн оюутнууд, багш нар',
 'Тэнхимийн оюутан, багш нарыг нэгтгэх',
 'Тэнхимийн анхны жилийн өдөрлөг. Тоглоом, хоолтой. Оролцооны төлбөр 35K. Dress code: Keep warm.',
 '/events/nohorlol-2022.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('Хаврын спорт өдөрлөг — 2023', null, 'Тэнхимийн өдөрлөг', 'СЭЗИС-ийн спорт заал',
 'Мэдээллийн систем менежментийн тэнхим', 'Оюутан, багш нар',
 'Спортын тэмцээнээр дамжуулан нөхөрлөл бэхжүүлэх',
 '2023 оны хаврын спорт өдөрлөг.',
 null, 'https://www.instagram.com/ufe_ismd/', true),

('Намрын өдөрлөг — 2023 (All of us ISM Workshop)', '2023-11-11', 'Тэнхимийн өдөрлөг', null,
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн оюутнууд',
 'Оюутнуудыг нэгтгэх, багийн ажиллагаа',
 '2023 оны намрын өдөрлөг. "All of us ISM Workshop" нэртэй бүлгийн үйл ажиллагаа явагдсан.',
 '/events/workshop-2023.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('Friendship Sports Day — 2024 хавар', null, 'Тэнхимийн өдөрлөг', 'СЭЗИС-ийн спорт заал',
 'Мэдээллийн систем менежментийн тэнхим', 'Оюутан, багш нар',
 'Спортын өдөрлөгөөр нөхөрлөл бэхжүүлэх',
 '2024 оны хаврын спорт өдөрлөг (Friendship sports day). Instagram хуудсанд 2024.05.27-нд бичлэг нийтлэгдсэн.',
 '/events/sports-day.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('ISMD Networking Day — 2024 намар', '2024-11-09', 'Тэнхимийн өдөрлөг', 'Goo Terelj Resort',
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн оюутан, багш нар',
 'Unite, Learn, and Grow together!',
 'Хөтөлбөр: Unite (цуглаж, Амралтын газарлуу явах, багт хуваагдах), Learn (нээлтийн үйл ажиллагаа, илтгэл хэлэлцүүлэг, Icebreaking game), Entertainment (өдрийн хоол, 1 болон 2-р курсын оюутнуудын урлагийн мэндчилгээ, Entertainment хэсэг), Enjoy (оройн хоол, аз ёндоогоо шалгах цаг, чөлөөт цаг, галын наадам). СЭЗИС дээр автобус зогссон.',
 '/events/networking-day-2024.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('ISM Alumni Network Event', null, 'Төгсөгчидтэй хийх уулзалт', 'Зүүн 4 зам, Батхаан центр 1 давхар, Maximus Irish Caupona',
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн төгсөгчид',
 'ISM төгсөгчдийн сүлжээг бэхжүүлэх',
 'ISM Alumni Network Event: 4 дүгээр сарын 06, 20 цагт (урилга дээрх жил тодорхойгүй, UFE 100 лого бүхий). Холбогдох утас: 99066863, 99091425.',
 '/events/alumni-network.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('IT Power Play өдөрлөг — 2025 хавар', null, 'Тэнхимийн өдөрлөг', null,
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн оюутнууд',
 null, '2025 оны хаврын тэнхимийн өдөрлөг "IT Power Play".',
 null, 'https://www.instagram.com/ufe_ismd/', true),

('Нөхөрлөл өдөрлөг — 2025 намар', null, 'Тэнхимийн өдөрлөг', null,
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн оюутнууд',
 null, '2025 оны намрын "Нөхөрлөл" өдөрлөг.',
 '/events/welcome-night.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('Нөхөрлөл спорт өдөрлөг — 2026 хавар', '2026-04-18', 'Тэнхимийн өдөрлөг', 'СЭЗИС-ийн спорт заал',
 'Мэдээллийн систем менежментийн тэнхим', 'Үе үеийн багш нар, одоогийн болон төгсөгч оюутнууд',
 'Мэдээллийн систем хөтөлбөрийн спорт өдөрлөг',
 'Тэмцээний төрлүүд: гар бөмбөг, буухиа тэмцээн. Ирээдүйн технологийн эзэд болсон оюутнууд, төгсөгчид, багш нарыг урьсан. 2026 оны 4-р сарын 18.',
 '/events/sports-2026.jpg', 'https://www.instagram.com/ufe_ismd/', true),

('The Last Login ISMD — Networking Event (2026 намар)', '2026-10-30', 'Тэнхимийн өдөрлөг', '4C, СЭЗИС',
 'Мэдээллийн систем менежментийн тэнхим', 'Тэнхимийн оюутнууд',
 'Networking: лекц, харилцаа холбоо, хоол, тоглоом',
 '2026.10.30, 14:00–17:00. Хөтөлбөр: Lecture, Communication, Catering, Games. Оролцооны төлбөр 5K.',
 '/events/last-login-2026.jpg', 'https://www.instagram.com/ism_last_login/', true);
