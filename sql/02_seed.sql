-- ISM Digital Museum: бодит эх сурвалжаас баталгаатай мэдээлэл (01_schema.sql-ийн дараа ажиллуулна)
-- Зохиосон нэр, огноо, статистик ОРУУЛААГҮЙ. Дутуу талбарыг /admin хуудаснаас нөхнө.

-- 1. Ангилал (баримт №6)
insert into exhibition_categories (name, name_en, kind, description) values
  ('Оюутны бүтээл', 'Student Projects', 'project', 'Оюутнуудын хийсэн төсөл, бүтээл'),
  ('Программ хангамж, систем', 'Software Development', 'project', 'Веб, мобайл, мэдээллийн систем, чатбот, автоматжуулалт'),
  ('Өгөгдлийн шинжилгээ', 'Data Analytics', 'project', 'Power BI dashboard, Data Mining, Machine Learning'),
  ('Хиймэл оюун ухаан', 'Artificial Intelligence', 'project', 'AI, чатбот, машин сургалтын бүтээл'),
  ('UI/UX дизайн', 'UI/UX Design', 'project', 'Figma загвар, хэрэглэгчийн интерфейс ба туршлага'),
  ('Судалгаа, дипломын ажил', 'Research & Thesis', 'project', 'Дипломын ажил, судалгааны тайлан, эрдэм шинжилгээний илтгэл'),
  ('Тэнхимийн үйл ажиллагаа', 'Department Activities', 'archive', 'Өдөрлөг, сургалт, тэмцээн, уулзалт'),
  ('Амжилт, шагнал', 'Achievements', 'archive', 'Оюутан, багш нарын амжилт'),
  ('Төгсөгчдийн туршлага', 'Alumni Experience', 'archive', 'Төгсөгчдийн карьер, туршлага'),
  ('Түүхэн архив', 'Historical Archive', 'archive', 'Тэнхимийн түүхэн материал')
on conflict (name) do nothing;

-- 2. Багш нар: албан ёсны хуудаснаас (ufe.edu.mn/employee/ID) авсан мэдээлэл
update teachers t set education = v.e, research = v.r, certificates = v.c, source_url = v.u
from (values
  ('Н.Саранчимэг', 'СЭЗДС (2007–2011) Мэдээллийн системийн менежмент, бакалавр; МУИС (2011–2013) Мэдээллийн систем, магистр', 'Бизнес процесс загварчлал, өгөгдлийн шинжилгээ, бизнес шинжилгээ', null, 'https://ufe.edu.mn/employee/95'),
  ('Ш.Ганболд', 'МУБИС (1997–2000) Мэдээлэл зүйн багш, бакалавр; МУБИС (2000–2002) Компьютерийн шинжлэх ухааны магистр', 'Боловсролын хүртээмж, насанд хүрэгсдийн боловсрол, жижиг дунд бизнесийн санхүүжилт', null, 'https://ufe.edu.mn/employee/97'),
  ('Д.Анхтуяа', 'МУИС (1994) математикч; СЭЗДС (1998) бизнесийн удирдлага; Хандонг глобаль их сургууль (2002) бизнесийн удирдлагын магистр', 'Боловсрол судлал, мэдээллийн технологийг сургалтад ашиглах боломжууд', '2018 MNCEA-ийн шинжээч; 2025 ACQUIN-ийн шинжээч', 'https://ufe.edu.mn/employee/18'),
  ('Ц.Гүндэгмаа', 'МУБИС (2000–2004) Мэдээлэл зүйн багш, бакалавр; СЭЗИС (2008–2010) Бизнесийн удирдлага, магистр', 'Өгөгдөл олборлолт, өгөгдөл боловсруулах технологи, дээд боловсролын өгөгдлийн шинжилгээ', '2014 онд Монгол улсын мэргэшсэн инженерийн зэрэг', 'https://ufe.edu.mn/employee/98'),
  ('Л.Эрдэнэсайхан', 'МУБИС (2002–2006) бакалавр; МУБИС (2006–2008) магистр; Токүшима их сургууль (2011–2016) Doctor of Engineering', 'Өгөгдөл олборлолт, өгөгдлийн шинжилгээ, хүн ба компьютерийн харилцаа, UX дизайн', null, 'https://ufe.edu.mn/employee/100'),
  ('Г.Эрдэнэцэцэг', 'СЭЗДС (2008–2012) бакалавр; СЭЗДС (2012–2014) Бизнесийн удирдлага, магистр', 'Өгөгдлийн шинжилгээ, дата аналитик, дижитал шилжилт', 'Мэдээллийн технологийн инженерийн паспорт сертификат, 2014, ITPEC', 'https://ufe.edu.mn/employee/101'),
  ('Б.Бат-Оргил', null, null, null, 'https://ufe.edu.mn/employee/96'),
  ('Д.Хулан', 'СЭЗДС (2009–2013) бакалавр; ШУТИС (2014–2016) магистр', 'Хиймэл оюун, өгөгдлийн шинжилгээ, машин сургалт', 'Omdena: Жуниор машин сургалтын инженерийн сургалт', 'https://ufe.edu.mn/employee/454'),
  ('Н.Хөгжилт', 'БНХАУ-ын Үндэсний их сургууль Электроникийн инженерийн бакалавр (2003); ХААИС магистр (2025)', 'Машин сургалт, өгөгдлийн шинжилгээ, хиймэл оюун', null, 'https://ufe.edu.mn/employee/411'),
  ('Б.Гэрэлтцолмон', 'СЭЗДС (2008–2012) бакалавр; МУИС (2014–2016) Банк санхүү, магистр', 'Бизнес шинжилгээ, системийн шинжилгээ, өгөгдлийн шинжилгээ', 'IIBA байгууллагын гишүүн', 'https://ufe.edu.mn/employee/526')
) as v(n, e, r, c, u)
where t.name = v.n;

-- 3. Үзмэр: СЭЗИС-ийн бүтээлийн сангаас (repository.ufe.edu.mn) олдсон бүтээлүүд
insert into exhibits (title, summary, description, category_id, year_created, project_type, source_url, is_active)
select v.title, v.summary, v.summary, c.id, v.yr, v.pt, 'https://repository.ufe.edu.mn/', true
from (values
  ('Хиймэл оюунт чатбот агент хөгжүүлэх', 'СЭЗИС-ийн бүтээлийн санд бүртгэгдсэн бүтээл. Зохиогч, удирдагч багшийн мэдээллийг админ нөхнө.', 'Хиймэл оюун ухаан', 2025, 'Чатбот'),
  ('Мэргэжил сургалт үйлдвэрлэлийн төвийн дадлага удирдагч багшийн систем', 'СЭЗИС-ийн бүтээлийн санд бүртгэгдсэн мэдээллийн системийн бүтээл. Зохиогч, удирдагч багшийн мэдээллийг админ нөхнө.', 'Программ хангамж, систем', 2024, 'Мэдээллийн систем'),
  ('Ногоон технологи: Цахим хог хаягдлын менежментийн өнөөгийн байдал, сайжруулах арга зам', 'СЭЗИС-ийн бүтээлийн санд бүртгэгдсэн судалгааны бүтээл. Зохиогч, удирдагч багшийн мэдээллийг админ нөхнө.', 'Судалгаа, дипломын ажил', 2025, 'Судалгааны тайлан')
) as v(title, summary, cat, yr, pt)
join exhibition_categories c on c.name = v.cat
where not exists (select 1 from exhibits e where e.title = v.title);

-- 4. Арга хэмжээ / сургалт
update events set event_type = 'Шинэ элсэгчдийн танилцах өдөрлөг', location = 'MPM Event Hall'
where title like 'Welcome Night%' and event_type is null;

insert into events (title, event_date, description, event_type, organizer, source_url)
select v.title, v.d, v.descr, 'Мэргэжлийн сургалт, семинар', 'Мэдээллийн системийн менежментийн тэнхим', 'https://training.ufe.edu.mn/'
from (values
  ('Data Analysis: Power BI, Excel сургалт', '2026-04-12'::date, 'UFE Training-д бүртгэгдсэн сургалт. Хугацаа: 2026 оны 4-р сарын 12–26.'),
  ('Өгөгдөлд суурилсан шийдвэр гаргалт + AI', '2026-06-18'::date, 'UFE Training-д бүртгэгдсэн сургалт. Хугацаа: 2026 оны 6-р сарын 18–19.'),
  ('Бизнес процесс загварчлал (BPMN 2.0)', null::date, 'BPMN 2.0, процесс шинжилгээ, автоматжуулалтын сургалт. Огноог админ нөхнө.')
) as v(title, d, descr)
where not exists (select 1 from events e where e.title = v.title);

-- 5. Хичээлүүд (online.ufe.edu.mn-ээс)
insert into courses (code, name, source_url) values
  ('SWM231', 'Мобайл программчлал', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'),
  ('WEB231', 'Веб дизайн', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'),
  ('CGR220', 'Хэрэглэгчийн туршлагын дизайны үндэс', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'),
  ('CGR221', 'График дизайн', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'),
  ('DBM221', 'Өгөгдлийн сангийн удирдлага', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'),
  ('ISA231', 'IT Infrastructure', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn'),
  ('ISM435', 'Мэдээллийн системийн аудит', 'https://online.ufe.edu.mn/course/index.php?categoryid=20&lang=mn')
on conflict (code) do nothing;

-- 6. Тэнхимийн тухай (баталгаагүйг хоосон үлдээв, /admin → "Тэнхимийн тухай" хэсгээс нөхнө)
insert into site_info (key, label, value) values
  ('major_intro', 'Мэргэжлийн танилцуулга', 'Мэдээллийн систем мэргэжил нь бизнесийн үйл ажиллагаа болон мэдээллийн технологийг уялдуулан, байгууллагын мэдээллийг үр ашигтай боловсруулах, удирдах, систем хөгжүүлэх мэдлэг, ур чадвар эзэмшүүлэхэд чиглэнэ.'),
  ('major_index', 'Мэргэжлийн индекс (бүтээлийн сан)', '061303'),
  ('founded', 'Тэнхим байгуулагдсан он, түүх', null),
  ('mission', 'Зорилго', null),
  ('vision', 'Алсын хараа', null),
  ('traditions', 'Тэнхимийн уламжлал', null),
  ('clubs', 'Оюутны клуб, нэгдэл', 'White hats club (тэнхимийн оюутнуудын клуб; Н.Саранчимэгийн танилцуулгад дурдсан)'),
  ('alumni', 'Төгсөгчдийн ажлын байр, карьерын чиглэл', null),
  ('partners', 'Хамтын ажиллагаа, технологийн байгууллагууд', null)
on conflict (key) do nothing;
