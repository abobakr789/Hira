-- المسار التشخيصي: دالة تعيد أسئلة اختيار من متعدد (بلا مفاتيح الإجابة) لمخرجات التربية الإسلامية
-- حتى صف الطالب نفسه، عشوائيًا. لازمة لأن سياسة questions_grade_scope تمنع الطالب من قراءة أسئلة صفوف أخرى.
-- تستثني أسئلة المعيارية. إضافة فقط: لا تغيّر أي جدول أو سياسة قائمة.
-- التصحيح يتم عبر الدالة الموجودة public.prep_grade(p_term, p_answers, p_save := false) ولا يكتب شيئًا.

create or replace function public.diag_questions(p_codes text[], p_n integer default 3)
returns table(oc text, qid uuid, qtype text, stem_ar text, stem_en text, options jsonb, difficulty smallint)
language plpgsql
stable
security definer
set search_path to ''
as $$
declare g smallint; tr text; n int := least(greatest(coalesce(p_n,3),1),5);
begin
  if auth.uid() is null then raise exception 'auth required'; end if;
  if coalesce(array_length(p_codes,1),0) > 12 then raise exception 'too many codes'; end if;
  select * into g, tr from private.my_grade_track();
  return query
  select r.oc, r.qid, r.qtype, r.stem_ar, r.stem_en, r.options, r.difficulty
  from (
    select o.code as oc, q.id as qid, q.qtype::text as qtype, q.stem_ar, q.stem_en, q.options, q.difficulty,
           row_number() over (partition by o.id order by random()) as rn
    from public.learning_outcomes o
    join public.subjects s on s.id = o.subject_id and s.code = 'islamic'
    join public.questions q on q.outcome_id = o.id and q.is_active and q.qtype = 'mcq' and coalesce(q.bank,'') <> 'benchmark'
    where o.code = any(p_codes)
      and (g is null or q.year_group <= g)
      and (q.track is null or q.track::text = coalesce(tr,'native'))
  ) r
  where r.rn <= n;
end $$;

revoke all on function public.diag_questions(text[], integer) from public, anon;
grant execute on function public.diag_questions(text[], integer) to authenticated;
comment on function public.diag_questions(text[], integer) is 'المسار التشخيصي: أسئلة MCQ بلا مفاتيح لمخرجات التربية الإسلامية حتى صف الطالب، دون المعيارية';
