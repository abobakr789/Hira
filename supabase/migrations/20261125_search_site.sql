-- البحث الشامل: دروس + آيات وأحاديث الدروس، بنص مجرّد من التشكيل (private.ar_norm).
-- SECURITY DEFINER لكنه يقيّد بنفس شرط السياسات: lessons.is_published و private.content_ok(lesson_id). للمسجّلين فقط. قراءة فقط.
-- لا يبحث في الأسئلة ولا مفاتيحها (حتى لا يكشف الإجابات).

create or replace function public.search_site(p_q text, p_lim integer default 12)
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $$
declare q text; lim int := least(greatest(coalesce(p_lim,12),1),30); les jsonb; ev jsonb;
begin
  if auth.uid() is null then raise exception 'auth required'; end if;
  q := private.ar_norm(trim(coalesce(p_q,'')));
  if char_length(q) < 3 then return jsonb_build_object('lessons','[]'::jsonb,'evidences','[]'::jsonb); end if;
  q := replace(replace(replace(q,'\','\\'),'%','\%'),'_','\_');

  select coalesce(jsonb_agg(x), '[]'::jsonb) into les from (
    select l.code, l.title_ar, l.title_en, u.year_group, u.term
    from public.lessons l join public.units u on u.id = l.unit_id
    where l.is_published and private.content_ok(l.id) and l.search_norm like '%' || q || '%'
    order by u.year_group, u.term, l.sort_order
    limit lim) x;

  select coalesce(jsonb_agg(x), '[]'::jsonb) into ev from (
    select l.code as lesson_code, l.title_ar, l.title_en, e.kind::text as kind, e.surah_no, e.ayah_from, e.ayah_to, e.text_ar, e.source
    from public.evidences e join public.lessons l on l.id = e.lesson_id
    where l.is_published and private.content_ok(l.id) and private.ar_norm(e.text_ar) like '%' || q || '%'
    order by e.kind, e.surah_no nulls last, e.ayah_from nulls last
    limit lim) x;

  return jsonb_build_object('lessons', les, 'evidences', ev);
end $$;

revoke all on function public.search_site(text, integer) from public, anon;
grant execute on function public.search_site(text, integer) to authenticated;
comment on function public.search_site(text, integer) is 'البحث الشامل: دروس وآيات وأحاديث الدروس (بلا تشكيل)، بحسب صلاحية الطالب';
