-- Create portfolio_data table to store user's portfolio JSON data
create table if not exists public.portfolio_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  data_type text not null, -- 'work-experience', 'education', 'extracurriculars', etc.
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, data_type)
);

-- Enable RLS
alter table public.portfolio_data enable row level security;

-- RLS policies for portfolio_data
create policy "portfolio_data_select_own"
  on public.portfolio_data for select
  using (auth.uid() = user_id);

create policy "portfolio_data_insert_own"
  on public.portfolio_data for insert
  with check (auth.uid() = user_id);

create policy "portfolio_data_update_own"
  on public.portfolio_data for update
  using (auth.uid() = user_id);

create policy "portfolio_data_delete_own"
  on public.portfolio_data for delete
  using (auth.uid() = user_id);
