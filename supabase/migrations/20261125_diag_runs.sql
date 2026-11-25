-- المسار التشخيصي: حفظ نتائج الطلاب ليراها المعلم (لوحة الفصل). إضافة فقط.
-- القراءة بنفس سياسة attempts: الطالب نفسه، ومعلمو مدرسته، وولي أمره، والمشرف العام.
-- الكتابة: الطالب يدرج لنفسه فقط، ولا تعديل ولا حذف من الواجهة.

create table if not exists public.diag_runs (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  year_group    smallint not null,
  graph_version integer not null,
  results       jsonb not null,   -- { "<outcome code>": { "r": صحيح, "a": مسؤول عنه, "st": "ok|root|affected|na" } }
  created_at    timestamptz not null default now()
);
create index if not exists diag_runs_student_created on public.diag_runs (student_id, created_at desc);

alter table public.diag_runs enable row level security;

create policy diag_runs_read on public.diag_runs
  for select to authenticated using (private.can_view_student(student_id));

create policy diag_runs_insert on public.diag_runs
  for insert to authenticated with check (student_id = (select auth.uid()));

revoke all on public.diag_runs from anon;
grant select, insert on public.diag_runs to authenticated;
comment on table public.diag_runs is 'المسار التشخيصي: نتيجة كل تشخيص (حالة كل مخرج: متمكن/أصل التعثر/متأثر)';
