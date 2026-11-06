-- ISM Digital Museum: схемийн өргөтгөл (өмнөх хүснэгтүүд дээр нэмэгдэнэ, дахин ажиллуулахад аюулгүй)
-- Supabase → SQL Editor → New query → буулгаад Run

-- 1. Хэрэглэгчийн профайл
alter table profiles
  add column if not exists student_code text,
  add column if not exists full_name text,
  add column if not exists major text default 'Мэдээллийн систем',
  add column if not exists course_year int check (course_year between 1 and 4),
  add column if not exists interests text[] default '{}';

-- 2. Ангилал
alter table exhibition_categories
  add column if not exists name_en text,
  add column if not exists kind text not null default 'project';

-- 3. Үзмэр
alter table exhibits alter column creator_id drop not null;
alter table exhibits
  add column if not exists author_name text,
  add column if not exists course_year int check (course_year between 1 and 4),
  add column if not exists project_type text,
  add column if not exists summary text,
  add column if not exists course_name text,
  add column if not exists project_name text,
  add column if not exists video_url text,
  add column if not exists source_url text,
  add column if not exists is_featured boolean default false,
  add column if not exists is_active boolean default true;

-- 4. Багш нар
alter table teachers
  add column if not exists education text,
  add column if not exists experience text,
  add column if not exists research text,
  add column if not exists certificates text,
  add column if not exists publications text,
  add column if not exists source_url text,
  add column if not exists is_active boolean default true;

-- 5. Арга хэмжээ
alter table events
  add column if not exists event_type text,
  add column if not exists location text,
  add column if not exists organizer text,
  add column if not exists participants text,
  add column if not exists purpose text,
  add column if not exists source_url text,
  add column if not exists is_active boolean default true;

-- 6. Зурагт цомог
create table if not exists gallery_photos (
  id bigint generated always as identity primary key,
  album text not null,
  title text,
  event_title text,
  photo_date date,
  description text,
  image_url text not null,
  source_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 7. Хичээл
create table if not exists courses (
  id bigint generated always as identity primary key,
  code text unique not null,
  name text not null,
  description text,
  course_year int check (course_year between 1 and 4),
  source_url text,
  is_active boolean default true
);

-- 8. Тэнхимийн тухай мэдээлэл (түлхүүр-утга, админ засна)
create table if not exists site_info (
  key text primary key,
  label text,
  value text
);

-- 9. Хэрэглэгчийн үзсэн / дуртай үзмэр
create table if not exists favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  exhibit_id bigint not null references exhibits(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, exhibit_id)
);
create table if not exists views (
  user_id uuid not null references profiles(id) on delete cascade,
  exhibit_id bigint not null references exhibits(id) on delete cascade,
  viewed_at timestamptz default now(),
  primary key (user_id, exhibit_id)
);

-- RLS
alter table gallery_photos enable row level security;
alter table courses enable row level security;
alter table site_info enable row level security;
alter table favorites enable row level security;
alter table views enable row level security;

-- Нийтэд унших (идэвхгүйг зөвхөн admin харна)
drop policy if exists "read exhibits" on exhibits;
drop policy if exists "read teachers" on teachers;
drop policy if exists "read events" on events;
create policy "read exhibits" on exhibits for select using (is_active is not false or is_admin());
create policy "read teachers" on teachers for select using (is_active is not false or is_admin());
create policy "read events" on events for select using (is_active is not false or is_admin());

drop policy if exists "read gallery" on gallery_photos;
drop policy if exists "read courses" on courses;
drop policy if exists "read site_info" on site_info;
create policy "read gallery" on gallery_photos for select using (is_active is not false or is_admin());
create policy "read courses" on courses for select using (is_active is not false or is_admin());
create policy "read site_info" on site_info for select using (true);

-- Admin бичих эрх
drop policy if exists "admin gallery" on gallery_photos;
drop policy if exists "admin courses" on courses;
drop policy if exists "admin site_info" on site_info;
create policy "admin gallery" on gallery_photos for all using (is_admin()) with check (is_admin());
create policy "admin courses" on courses for all using (is_admin()) with check (is_admin());
create policy "admin site_info" on site_info for all using (is_admin()) with check (is_admin());

-- Хэрэглэгч зөвхөн өөрийн favorites / views
drop policy if exists "own favorites" on favorites;
drop policy if exists "own views" on views;
create policy "own favorites" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own views" on views for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
