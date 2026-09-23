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
-- Phase 1 has no cross-user profile browsing. Keep every profile column,
-- including contact details, private to its owner until a later phase adds a
-- deliberately limited public projection and connection-aware contact access.
create policy "Users can read their own profile" on public.profiles
for select to authenticated using (user_id = (select auth.uid()));
create policy "Users can create their own profile" on public.profiles
for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users can update their own profile" on public.profiles
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy "Users can read their own profile industries" on public.profile_industries
for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = (select auth.uid()))
);
create policy "Users can add their own profile industries" on public.profile_industries
for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = (select auth.uid()))
);
create policy "Users can remove their own profile industries" on public.profile_industries
for delete to authenticated using (
  exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = (select auth.uid()))
);

-- Save the profile and its industry relationships as one transaction. Any
-- validation, ownership, delete, or insert failure rolls back the whole call,
-- so onboarding can never be completed with a partially saved industry set.
create function public.save_my_profile(
  p_first_name text,
  p_last_name text,
  p_avatar_url text,
  p_headline text,
  p_company_name text,
  p_working_on text,
  p_role_category text,
  p_city_id uuid,
  p_open_to_meet boolean,
  p_linkedin_url text,
  p_industry_ids uuid[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  saved_profile_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if cardinality(p_industry_ids) not between 1 and 3 then
    raise exception 'Choose between 1 and 3 industries' using errcode = '23514';
  end if;

  if (select count(distinct industry_id) from unnest(p_industry_ids) as selected(industry_id))
     <> cardinality(p_industry_ids) then
    raise exception 'Industry selections must be unique' using errcode = '23505';
  end if;

  if not exists (
    select 1 from public.cities where id = p_city_id and is_active
  ) then
    raise exception 'Choose an active city' using errcode = '23503';
  end if;

  insert into public.profiles (
    user_id, first_name, last_name, avatar_url, headline, company_name,
    working_on, role_category, city_id, open_to_meet, linkedin_url,
    onboarding_completed
  ) values (
    current_user_id, p_first_name, p_last_name, p_avatar_url, p_headline,
    nullif(p_company_name, ''), p_working_on, p_role_category, p_city_id,
    p_open_to_meet, nullif(p_linkedin_url, ''), true
  )
  on conflict (user_id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    avatar_url = excluded.avatar_url,
    headline = excluded.headline,
    company_name = excluded.company_name,
    working_on = excluded.working_on,
    role_category = excluded.role_category,
    city_id = excluded.city_id,
    open_to_meet = excluded.open_to_meet,
    linkedin_url = excluded.linkedin_url,
    onboarding_completed = true
  returning id into saved_profile_id;

  delete from public.profile_industries
  where profile_id = saved_profile_id;

  insert into public.profile_industries (profile_id, industry_id)
  select saved_profile_id, industry_id
  from unnest(p_industry_ids) as selected(industry_id);

  return saved_profile_id;
end;
$$;

revoke all on function public.save_my_profile(
  text, text, text, text, text, text, text, uuid, boolean, text, uuid[]
) from public, anon;
grant execute on function public.save_my_profile(
  text, text, text, text, text, text, text, uuid, boolean, text, uuid[]
) to authenticated;

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
