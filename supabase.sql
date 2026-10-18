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
grant select (name,message,created_at,approved) on public.guestbook_entries to anon;
grant insert (name,message) on public.guestbook_entries to anon;
create policy "read_approved" on public.guestbook_entries for select to anon using (approved = true);
create policy "submit_pending" on public.guestbook_entries for insert to anon with check (approved = false);
-- Moderasyon: Supabase Dashboard > Table Editor üzerinden approved=true yapın.
-- ÜRETİM GÜVENLİĞİ: Bu doğrudan public API'de IP rate-limit ve CAPTCHA yoktur.
-- Trafiğe açmadan önce CAPTCHA doğrulayan bir sunucu/edge function ve rate limit ekleyin.
-- Spam freni (creative-playground projesinde kurulu): son 10 dakikada 30'dan fazla not gelirse yeni ekleme reddedilir.
create or replace function public.guestbook_rate_limit()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if (select count(*) from public.guestbook_entries where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'rate_limited';
  end if;
  return new;
end; $$;
revoke all on function public.guestbook_rate_limit() from public, anon, authenticated;
create trigger guestbook_rate_limit before insert on public.guestbook_entries for each row execute function public.guestbook_rate_limit();

-- Masa tıklama sayacı (creative-playground projesinde kurulu).
-- Kişisel veri yok: isim, IP, çerez tutulmaz; yalnızca ne tıklandı ve ne zaman.
-- event: 'open' = masada obje açıldı (target: envelope, jar, notebook...), 'link' = dış siteye geçildi (target: alan adı)
create table if not exists public.desk_events (
  id bigserial primary key,
  event text not null check (event in ('open', 'link')),
  target text not null check (char_length(target) between 1 and 80),
  created_at timestamptz not null default now()
);
alter table public.desk_events enable row level security;
revoke all on public.desk_events from anon, authenticated;
grant insert (event, target) on public.desk_events to anon;
grant usage, select on sequence public.desk_events_id_seq to anon;
create policy "record_event" on public.desk_events for insert to anon with check (true);
create index if not exists desk_events_created_at_idx on public.desk_events (created_at desc);
-- (spam freni: 10 dakikada 3000 olay; guestbook_rate_limit ile aynı yapıda desk_events_rate_limit tetikleyicisi)
-- Örnek rapor: select target, count(*) from desk_events where event='open' and created_at > now() - interval '7 days' group by 1 order by 2 desc;
