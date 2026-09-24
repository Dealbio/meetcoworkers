create index if not exists profile_industries_industry_id_idx
  on public.profile_industries (industry_id);

create index if not exists profiles_city_id_idx
  on public.profiles (city_id);
