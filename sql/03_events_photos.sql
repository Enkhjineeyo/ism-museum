-- Тэнхимийн өдөрлөгийн бодит зургууд (public/events/*.jpg → сайтын /events/...)
-- Огноог (event_date) мэдэж байгаа бол нөхөж өгнө үү. Одоохондоо хоосон (null).
insert into events (title, event_type, location, organizer, description, cover_image_url, source_url, is_active) values
('Нөхөрлөл — оюутан, төгсөгч, багш нарын спортын өдөрлөг', 'Спорт',
 null, 'Мэдээллийн систем менежментийн тэнхим',
 'МСМ тэнхимийн оюутан, төгсөгч, багш нарын спортын өдөрлөг. Тэмцээнд оролцогчид медалиа хүртэв.',
 '/events/sports-day.jpg', 'https://www.instagram.com/ism_last_login/', true),
('Тэнхимийн Halloween өдөрлөг', 'Өдөрлөг',
 null, 'Мэдээллийн систем менежментийн тэнхим',
 'Тэнхимийн оюутнуудын хамт зохион байгуулсан Halloween сэдэвтэй өдөрлөг.',
 '/events/halloween.jpg', 'https://www.instagram.com/ism_last_login/', true),
('Тэнхимийн оюутнуудын өдөрлөг (Christmas)', 'Өдөрлөг',
 null, 'Мэдээллийн систем менежментийн тэнхим',
 'Тэнхимийн оюутнуудын нэгдсэн өдөрлөгийн дурсамж.',
 '/events/welcome-night.jpg', 'https://www.instagram.com/ism_last_login/', true);

insert into gallery_photos (title, album, image_url, is_active) values
('Нөхөрлөл спортын өдөрлөг', 'Тэнхимийн өдөрлөг', '/events/sports-day.jpg', true),
('Halloween өдөрлөг', 'Тэнхимийн өдөрлөг', '/events/halloween.jpg', true),
('Өдөрлөгийн нэгдсэн зураг', 'Тэнхимийн өдөрлөг', '/events/welcome-night.jpg', true),
('МСМ тэнхимийн оюутнууд', 'Тэнхимийн өдөрлөг', '/events/img4.jpg', true);
