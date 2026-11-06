# ISM Digital Museum

СЭЗИС-ийн Мэдээллийн системийн менежментийн тэнхимийн цахим музей. React + JavaScript (Vite), Supabase (Auth, PostgreSQL, Storage, RLS), Vercel.

## Суулгах
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env, дараа нь утгуудыг бөглөнө
npm run dev
```
`.env`-д `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (anon/publishable түлхүүр). `service_role` түлхүүрийг ХЭЗЭЭ Ч хийхгүй.

## Өгөгдлийн сан (Supabase → SQL Editor)
1. `sql/01_schema.sql` ажиллуулна (хүснэгт нэмэх, RLS)
2. `sql/02_seed.sql` ажиллуулна (баталгаатай эх сурвалжтай мэдээлэл)
3. Storage → `images` bucket (Public) байх ёстой
4. Сайтаар бүртгүүлсний дараа Table Editor → `profiles` → өөрийн `role`-ийг `admin` болгоно

## Хуудсууд
Нүүр, Тэнхимийн тухай (мэргэжил, хичээл, 1–4 курс, Time Machine түүх), Цахим музей, Оюутны бүтээл, Багш нар (дэлгэрэнгүй профайл), Арга хэмжээ, Зурагт цомог (Grid/Masonry/Lightbox), Ангилал, Профайл, Нэвтрэх/Бүртгүүлэх, Админ (/admin).

## Deploy
GitHub-д push → Vercel Import → Environment Variables-д дээрх хоёр утгыг нэмээд Deploy. Supabase → Authentication → URL Configuration-д Vercel домайнаа оруулна.

## Эх сурвалж
ufe.edu.mn/c/76, ISMD Facebook/Instagram, repository.ufe.edu.mn, online.ufe.edu.mn, training.ufe.edu.mn
