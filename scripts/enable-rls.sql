-- Enables Row-Level Security on every public table (see prisma/schema.prisma
-- @@map names). No policies are added: this app reads/writes exclusively via
-- Prisma using DATABASE_URL/DIRECT_URL (the Supabase postgres role, which
-- bypasses RLS), so enabling RLS with zero policies default-denies access
-- from Supabase's auto-generated PostgREST API (anon/authenticated roles)
-- without affecting the app.
--
-- Run this once in the Supabase SQL Editor (or `supabase db execute`).

alter table public.profiles enable row level security;
alter table public.teacher_assignments enable row level security;
alter table public.teacher_feature_permissions enable row level security;
alter table public.news_notices enable row level security;
alter table public.news_notice_attachments enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.principal_messages enable row level security;
alter table public.gallery_images enable row level security;
alter table public.faculty enable row level security;
alter table public.school_classes enable row level security;
alter table public.subjects enable row level security;
alter table public.library_books enable row level security;
alter table public.time_table_slots enable row level security;
alter table public.homework enable row level security;
alter table public.homework_attachments enable row level security;
alter table public.academic_posts enable row level security;
alter table public.toppers enable row level security;
alter table public.facilities enable row level security;
alter table public.bus_routes enable row level security;
alter table public.faqs enable row level security;
alter table public.admission_enquiries enable row level security;
alter table public.testimonials enable row level security;
alter table public.item_views enable row level security;
