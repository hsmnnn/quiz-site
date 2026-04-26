-- Supabaseダッシュボードの「SQL Editor」で実行してください

create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  score integer not null,
  total integer not null,
  answers jsonb not null,
  created_at timestamp with time zone default now()
);

-- 匿名ユーザーからINSERTを許可（クライアントからの保存に必要）
alter table quiz_results enable row level security;

create policy "Allow anonymous insert" on quiz_results
  for insert to anon
  with check (true);

-- 管理者（service_role）は全件SELECT可能（CSVエクスポートはサーバーサイドのanon keyで実施）
create policy "Allow anon select" on quiz_results
  for select to anon
  using (true);
