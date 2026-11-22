-- تدقيق الآيات في محتوى حراء: كل ما بين ﴿ ﴾ يُقارن بجدول quran_ayahs (رسم تنزيل العثماني).
-- شغّله في محرّر SQL في Supabase أو عبر أداة execute_sql. للقراءة فقط.
--
-- المطابقة على «هيكل الحروف» لا على الإملاء، حتى لا تظهر إنذارات كاذبة من اختلاف الإملاء العثماني عن الإملائي:
--   تُزال التشكيلة وعلامات المصحف والألف بأنواعها والهمزات (ء ؤ ئ) والألف المقصورة،
--   وتُحذف الواو/الياء قبل الألف الخنجرية، وتُدمج اللامان (إدغام لام التعريف) والياءات والواوات المتتالية.
-- ما يُرصد بهذا الفحص: اقتطاع كلمات داخل الآية بلا نقاط (…)، واستبدال حرف أو كلمة، وفاصلة خاطئة (مثل «فأما» مكان «وأما»)،
--   وعبارات ليست آية وُضعت بين ﴿ ﴾.
-- ما لا يرصده: اختلاف الإملاء وحده (النبيين/النبيّـۧن، يستوون/يستوۥن)، فهذا يُراجَع بصريًا إن أردت رسم المصحف حرفيًا.
-- إنذار كاذب معروف: نص يمتد عبر نهاية آيتين ويلتقي فيه لامان (…الفيل ۝ ألم…) فيُدمجان في المحتوى ولا يُدمجان في الجدول.
-- كل ما يظهر هنا مرشّح للمراجعة اليدوية؛ لا تعدّل المحتوى آليًا.

create or replace function pg_temp.nz(x text) returns text language sql immutable as $$
  select regexp_replace(regexp_replace(regexp_replace(t3, 'لل', 'ل', 'g'), 'يي+', 'ي', 'g'), 'وو+', 'و', 'g')
  from (select regexp_replace(translate(t1, 'ةی', 'تي'), E'[اأإآٱءؤئى]|[^ء-ي]', '', 'g') t3
        from (select regexp_replace(regexp_replace(x, E'[\\u0648\\u0649\\u064A]\\u0670', '', 'g'), E'[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640\\u08D3-\\u08FF]', '', 'g') t1) a) b
$$;

with qa as (select surah, ayah, text_ar, pg_temp.nz(text_ar) n from public.quran_ayahs),
corpus as (select string_agg(n, '' order by surah, ayah) c from qa),
src as (
  select 'lesson_summaries' t, content::text s from public.lesson_summaries
  union all select 'evidences', coalesce(text_ar,'')||' '||coalesce(full_ar,'') from public.evidences
  union all select 'game_items', payload::text from public.game_items
  union all select 'lesson_book_texts', coalesce(body,'') from public.lesson_book_texts
  union all select 'lesson_readers', pages::text||' '||coalesce(questions::text,'') from public.lesson_readers
  union all select 'questions', coalesce(stem_ar,'')||' '||coalesce(options::text,'') from public.questions
  union all select 'seerah_bank', coalesce(q_ar,'')||' '||coalesce(ex_ar,'')||' '||coalesce(o_ar::text,'') from public.seerah_bank
  union all select 'teacher_decks', slides::text from public.teacher_decks
), segs as (select t, m[1] raw from src, regexp_matches(s, '﴿([^﴾]{3,}?)﴾', 'g') m),
parts as (select t, p part, pg_temp.nz(p) n from segs, regexp_split_to_table(raw, E'…|\\.\\.\\.|\\[|\\]|\\(|\\)|\\*') p),
bad as (select distinct on (part) t, part, n from parts
        where length(n) >= 4 and not (length(part) > 400 or part ~ '[{}"]')
          and position(n in (select c from corpus)) = 0)
select (select count(*) from parts where length(n) >= 4) as segments_checked,
       (select count(*) from bad) as flagged,
       (select jsonb_agg(jsonb_build_object('table', b.t,
          'content', left(regexp_replace(b.part, E'[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]', '', 'g'), 95),
          'nearest_ayah', (select a.surah||':'||a.ayah from qa a where position(left(b.n, 9) in a.n) > 0 order by a.surah, a.ayah limit 1)))
        from bad b) as list;
