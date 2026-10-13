-- Supabase SQL Editor üzerinden çalıştırın. İlgili tabloda RLS mutlaka açık olmalıdır.
create table if not exists public.guestbook_entries (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(trim(name)) between 2 and 40),
 message text not null check (char_length(trim(message)) between 3 and 400),
 approved boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.guestbook_entries enable row level security;
revoke all on public.guestbook_entries from anon, authenticated;
grant select (name,message,created_at) on public.guestbook_entries to anon;
grant insert (name,message) on public.guestbook_entries to anon;
create policy "read_approved" on public.guestbook_entries for select to anon using (approved = true);
create policy "submit_pending" on public.guestbook_entries for insert to anon with check (approved = false);
-- Moderasyon: Supabase Dashboard > Table Editor üzerinden approved=true yapın.
-- ÜRETİM GÜVENLİĞİ: Bu doğrudan public API'de IP rate-limit ve CAPTCHA yoktur.
-- Trafiğe açmadan önce CAPTCHA doğrulayan bir sunucu/edge function ve rate limit ekleyin.