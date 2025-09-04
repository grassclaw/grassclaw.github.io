-- Create search_keywords table to store user's custom search keywords
create table if not exists public.search_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tab_name text not null,
  keywords text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, tab_name)
);

-- Enable RLS
alter table public.search_keywords enable row level security;

-- RLS policies for search_keywords
create policy "search_keywords_select_own"
  on public.search_keywords for select
  using (auth.uid() = user_id);

create policy "search_keywords_insert_own"
  on public.search_keywords for insert
  with check (auth.uid() = user_id);

create policy "search_keywords_update_own"
  on public.search_keywords for update
  using (auth.uid() = user_id);

create policy "search_keywords_delete_own"
  on public.search_keywords for delete
  using (auth.uid() = user_id);
