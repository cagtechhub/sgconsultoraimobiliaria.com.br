-- Bucket público para imagens de empreendimentos.
-- Execute no SQL Editor do Supabase (ou via CLI).

insert into storage.buckets (id, name, public)
values ('properties', 'properties', true)
on conflict (id) do update set public = true;

-- Leitura pública
drop policy if exists "Public read properties" on storage.objects;
create policy "Public read properties"
on storage.objects for select
to public
using (bucket_id = 'properties');

-- Upload/update/delete via service_role (API backend). Policies extras para authenticated se necessário.
drop policy if exists "Service role manage properties" on storage.objects;
create policy "Service role manage properties"
on storage.objects for all
to service_role
using (bucket_id = 'properties')
with check (bucket_id = 'properties');
