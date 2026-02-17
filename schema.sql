-- Create the bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid default auth.uid() not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Policies
create policy "Users can view their own bookmarks"
on bookmarks for select
using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
on bookmarks for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
on bookmarks for delete
using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
