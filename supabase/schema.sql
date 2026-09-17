create table if not exists public.water_state_snapshots (
  id bigserial primary key,
  state_id text not null unique,
  state_name text not null,
  lat double precision not null,
  lng double precision not null,
  overall_risk text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.water_city_snapshots (
  id bigserial primary key,
  state_id text not null,
  city_name text not null,
  district text not null,
  lat double precision not null,
  lng double precision not null,
  source text not null,
  tds integer not null,
  ph double precision not null,
  turbidity double precision not null,
  fluoride double precision not null,
  nitrate integer not null,
  arsenic double precision not null,
  risk text not null,
  reason text not null,
  contaminants text[] not null default '{}',
  updated_at text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.touch_water_snapshot()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger water_state_snapshot_touch
before update on public.water_state_snapshots
for each row execute function public.touch_water_snapshot();

create trigger water_city_snapshot_touch
before update on public.water_city_snapshots
for each row execute function public.touch_water_snapshot();
