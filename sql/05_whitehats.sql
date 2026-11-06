-- 1) Намрын өдөрлөгийг тэнхимийн өдөрлөгт нэгтгэх (04-ийг өмнө нь ажиллуулсан бол)
update events set event_type = 'Тэнхимийн өдөрлөг' where event_type = 'Намрын өдөрлөг';

-- 2) White Hats клуб
update site_info set label = 'Оюутны клуб, нэгдэл',
  value = 'White Hats club — тэнхимийн оюутнуудын клуб. 2022 онд үүсгэн байгуулагдсан. Одоогийн тэргүүн: Б.Оюу. Instagram: https://www.instagram.com/ufe_whitehats/'
where key = 'clubs';
insert into site_info (key, label, value)
select 'clubs', 'Оюутны клуб, нэгдэл',
  'White Hats club — тэнхимийн оюутнуудын клуб. 2022 онд үүсгэн байгуулагдсан. Одоогийн тэргүүн: Б.Оюу. Instagram: https://www.instagram.com/ufe_whitehats/'
where not exists (select 1 from site_info where key = 'clubs');
