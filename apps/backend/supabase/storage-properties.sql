-- Bucket público para imagens de empreendimentos.
-- Execute no SQL Editor do Supabase (ou via CLI).

insert into storage.buckets (id, name, public)
values ('sgconsultoriaimobiliaria', 'sgconsultoriaimobiliaria', true)
on conflict (id) do update set public = true;

-- Leitura pública
drop policy if exists "Public read sgconsultoriaimobiliaria" on storage.objects;
create policy "Public read sgconsultoriaimobiliaria"
on storage.objects for select
to public
using (bucket_id = 'sgconsultoriaimobiliaria');

-- Upload/update/delete via service_role (API backend). Policies extras para authenticated se necessário.
drop policy if exists "Service role manage sgconsultoriaimobiliaria" on storage.objects;
create policy "Service role manage sgconsultoriaimobiliaria"
on storage.objects for all
to service_role
using (bucket_id = 'sgconsultoriaimobiliaria')
with check (bucket_id = 'sgconsultoriaimobiliaria');
