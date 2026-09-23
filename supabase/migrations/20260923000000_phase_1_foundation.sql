-- Phase 1: authentication-adjacent profile data and secure avatar storage.
create extension if not exists pgcrypto;

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  timezone text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, country_code)
);

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text not null check (char_length(trim(first_name)) between 1 and 60),
  last_name text not null check (char_length(trim(last_name)) between 1 and 60),
  avatar_url text not null,
  headline text not null check (char_length(trim(headline)) between 2 and 120),
  company_name text check (company_name is null or char_length(trim(company_name)) between 1 and 100),
  working_on text not null check (char_length(trim(working_on)) between 10 and 240),
  role_category text not null check (role_category in (
    'Founder', 'Investor', 'Operator', 'Consultant', 'Designer',
    'Developer', 'Marketer', 'Freelancer', 'Other'
  )),
  city_id uuid not null references public.cities(id),
  open_to_meet boolean not null default true,
  linkedin_url text check (linkedin_url is null or linkedin_url ~ '^https://([a-z]{2,3}\.)?linkedin\.com/'),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_industries (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  industry_id uuid not null references public.industries(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (profile_id, industry_id)
);

create function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cities_set_updated_at before update on public.cities
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create function public.enforce_profile_industry_limit()
returns trigger language plpgsql set search_path = '' as $$
begin
  -- Serialize concurrent additions for the same profile so two requests cannot
  -- both observe fewer than three existing rows.
  perform pg_advisory_xact_lock(hashtextextended(new.profile_id::text, 0));
  if (select count(*) from public.profile_industries where profile_id = new.profile_id) >= 3 then
    raise exception 'A profile can have at most 3 industries' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger profile_industries_max_three
before insert on public.profile_industries
for each row execute function public.enforce_profile_industry_limit();

insert into public.cities (name, country_code, timezone)
values ('Dubai', 'AE', 'Asia/Dubai');

insert into public.industries (name, slug) values
  ('AI', 'ai'), ('Health', 'health'), ('Fintech', 'fintech'),
  ('SaaS', 'saas'), ('Consumer', 'consumer'), ('Investment', 'investment'),
  ('Climate', 'climate'), ('Education', 'education'), ('Real Estate', 'real-estate');

alter table public.cities enable row level security;
alter table public.industries enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_industries enable row level security;

create policy "Authenticated users can read active cities" on public.cities
for select to authenticated using (is_active);
create policy "Authenticated users can read industries" on public.industries
for select to authenticated using (true);
create policy "Authenticated users can read profiles" on public.profiles
for select to authenticated using (true);
create policy "Users can create their own profile" on public.profiles
for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users can update their own profile" on public.profiles
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy "Authenticated users can read profile industries" on public.profile_industries
for select to authenticated using (true);
create policy "Users can add their own profile industries" on public.profile_industries
for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = (select auth.uid()))
);
create policy "Users can remove their own profile industries" on public.profile_industries
for delete to authenticated using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = (select auth.uid()))
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Avatar images are publicly readable" on storage.objects
for select using (bucket_id = 'avatars');
create policy "Users can upload avatars in their folder" on storage.objects
for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Users can update avatars in their folder" on storage.objects
for update to authenticated
using (bucket_id = 'avatars' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Users can delete avatars in their folder" on storage.objects
for delete to authenticated using (
  bucket_id = 'avatars' and owner_id = (select auth.uid()::text)
);

grant usage on schema public to authenticated;
grant select on public.cities, public.industries to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.profile_industries to authenticated;
