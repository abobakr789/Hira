-- المسار التشخيصي: السماح بمادة الدراسات الاجتماعية (social) في diag_questions. الجسم مطابق للصيغة السابقة عدا قائمة المواد.
create or replace function public.diag_questions(p_codes text[], p_n integer default 3, p_subject text default 'islamic')
returns table(oc text, qid uuid, qtype text, stem_ar text, stem_en text, options jsonb, difficulty smallint)
language plpgsql
stable
security definer
set search_path to ''
as $$
declare g smallint; tr text; n int := least(greatest(coalesce(p_n,3),1),5);
begin
  if auth.uid() is null then raise exception 'auth required'; end if;
  if p_subject is null or p_subject not in ('islamic','arabic','social') then raise exception 'bad subject'; end if;
  if coalesce(array_length(p_codes,1),0) > 12 then raise exception 'too many codes'; end if;
  select * into g, tr from private.my_grade_track();
  return query
  select r.oc, r.qid, r.qtype, r.stem_ar, r.stem_en, r.options, r.difficulty
  from (
    select o.code as oc, q.id as qid, q.qtype::text as qtype, q.stem_ar, q.stem_en, q.options, q.difficulty,
           row_number() over (partition by o.id order by random()) as rn
    from public.learning_outcomes o
    join public.subjects s on s.id = o.subject_id and s.code = p_subject
    join public.questions q on q.outcome_id = o.id and q.is_active and q.qtype = 'mcq' and coalesce(q.bank,'') <> 'benchmark'
    where o.code = any(p_codes)
      and (g is null or q.year_group <= g)
      and (q.track is null or q.track::text = coalesce(tr,'native'))
  ) r
  where r.rn <= n;
end $$;
