begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 2, 1, 'الْوَحْدَةُ الْأولى: التَّنْمِيَةُ الْمُسْتَدامَةُ — إِطارٌ نَظَرِيٌّ عامٌّ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=2
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T2-L1', 'الرُّؤْيَةُ الْأولى: مَفْهومُ التَّنْمِيَةِ الْمُسْتَدامَةِ وَخَلْفِيَّتُهُ التّاريخِيَّةُ', 3, 'الْكِتابُ ص 9–20', true, '🎯 أُفَسِّرُ التَّطَوُّرَ التّاريخِيَّ لِمَفْهومِ التَّنْمِيَةِ الْمُسْتَدامَةِ، وَأُمَيِّزُ بَيْنَ أَبْرَزِ تَعْريفاتِهِ.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ أَنَّ التَّنْمِيَةَ الْمُسْتَدامَةَ مُمارَسَةٌ قَديمَةٌ وَإِنْ كانَ الْمُصْطَلَحُ حَديثًا.',1),('أُلَخِّصُ أَبْرَزَ التَّقاريرِ وَالْوَثائِقِ الْعالَمِيَّةِ الَّتي مَهَّدَتْ لِلْمَفْهومِ.',2),('أُمَيِّزُ بَيْنَ تَعْريفاتِ التَّنْمِيَةِ الْمُسْتَدامَةِ وَأَسْتَخْلِصُ قَضاياهَا الْكُبْرى.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: مَفْهومُ التَّنْمِيَةِ الْمُسْتَدامَةِ وَخَلْفِيَّتُهُ التّاريخِيَّةُ', 'أَمَّا التَّعْريفُ الْأَكْثَرُ شُهْرَةً لِلتَّنْمِيَةِ الْمُسْتَدامَةِ، وَالَّذي ذاعَ صيتُهُ في الْأَوْساطِ الْأَكاديمِيَّةِ وَالْمِهَنِيَّةِ، فَهُوَ تَعْريفُ اللَّجْنَةِ الْعالَمِيَّةِ لِلْبيئَةِ وَالتَّنْمِيَةِ (لَجْنَةِ بْرونْتْلانْد) وَالَّذي يُشيرُ إِلى أَنَّها «التَّنْمِيَةُ الَّتي تُلَبّي احْتِياجاتِ الْحاضِرِ دونَ الِانْتِقاصِ مِنْ قُدُراتِ الْأَجْيالِ الْقادِمَةِ عَلَى الْوَفاءِ بِاحْتِياجاتِها»؛ أَيْ أَنَّها عَمَلِيَّةُ تَغَيُّرٍ حَيْثُ يَجْري اسْتِغْلالُ الْمَواردِ وَتَوْجيهُ الِاسْتِثْماراتِ، وَتَكْييفُ التَّنْمِيَةِ التِّكْنولوجِيَّةِ وَالتَّطْويرِ الْمُؤَسَّسِيِّ بِتَناسُقٍ يُعَزِّزُ مِنَ الْإِمْكانِيّاتِ الْحاضِرَةِ وَالْمُسْتَقْبَلِيَّةِ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 14)', 'الْكِتابُ ص 9–20', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('صَدَرَ تَقْريرُ «حُدودِ النُّمُوِّ» عامَ:','[{"id": "a", "text": "1972 م"}, {"id": "b", "text": "1981 م"}, {"id": "c", "text": "1992 م"}]'),('أَشْهَرُ تَعْريفٍ لِلتَّنْمِيَةِ الْمُسْتَدامَةِ هُوَ تَعْريفُ:','[{"id": "a", "text": "لَجْنَةِ بْرونْتْلانْد"}, {"id": "b", "text": "الْبَنْكِ الدَّوْلِيِّ"}, {"id": "c", "text": "روبِرْتْ سولو"}]'),('انْعَقَدَتْ قِمَّةُ الْأَرْضِ في ريو دي جانيرو عامَ:','[{"id": "a", "text": "1992 م"}, {"id": "b", "text": "1987 م"}, {"id": "c", "text": "2002 م"}]'),('الْحَضارَةُ الَّتي بَقِيَتْ تَرْتَكِزُ عَلى أَساسٍ مُسْتَدامٍ هِيَ حَضارَةُ:','[{"id": "a", "text": "وادِي النّيلِ"}, {"id": "b", "text": "قُرْطاجَ"}, {"id": "c", "text": "روما"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T2-L2', 'الرُّؤْيَةُ الثّانِيَةُ: عَناصِرُ التَّنْمِيَةِ الْمُسْتَدامَةِ وَمُؤَشِّراتُها', 3, 'الْكِتابُ ص 21–38', true, '🎯 أُحَدِّدُ عَناصِرَ التَّنْمِيَةِ الْمُسْتَدامَةِ وَأَبْعادَها، وَأُصَنِّفُ مُؤَشِّراتِها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ أَنْظِمَةَ التَّنْمِيَةِ الْمُسْتَدامَةِ الثَّلاثَةَ وَقُوَّةَ كُلٍّ مِنْها الدّافِعَةَ.',1),('أَشْرَحُ نَهْجَ دِراسَةِ الِاسْتِدامَةِ وَأَعْمِدَتَهُ الْعَشَرَةَ.',2),('أُصَنِّفُ مُؤَشِّراتِ التَّنْمِيَةِ الْمُسْتَدامَةِ وَأَذْكُرُ أَمْثِلَةً عَلَيْها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: عَناصِرُ التَّنْمِيَةِ الْمُسْتَدامَةِ وَمُؤَشِّراتُها', 'وَيَتَمَثَّلُ التَّنَوُّعُ الْأَحْيائِيُّ في أَنَّهُ لا يَقْتَصِرُ عَلى مُجَرَّدِ الِاخْتِلافِ فيما بَيْنَ الْأَنْواعِ، بَلْ يَشْمَلُ أَيْضًا التَّبايُنَ الْجينِيَّ داخِلَ الْأَنْواعِ، وَالتَّبايُنَ بَيْنَ مَجْموعاتِ الْأَنْواعِ وَالْمَوائِلِ وَالنُّظُمِ الْإيكولوجِيَّةِ. وَيُسْهِمُ التَّنَوُّعُ الْأَحْيائِيُّ لِلْجيناتِ وَالْأَنْواعِ وَالنُّظُمِ الْإيكولوجِيَّةِ بِنَواتِجَ وَخَدَماتٍ ضَرورِيَّةٍ لِتَحْقيقِ رَفاهِيَةِ الْفَرْدِ. وَيُساعِدُ صَوْنُ التَّنَوُّعِ الْأَحْيائِيِّ عَلى أَنْ يَسْتَمِرَّ كَوْكَبُ الْأَرْضِ في تَأْدِيَةِ الْعَمَلِيّاتِ الْإيكولوجِيَّةِ الطَّبيعِيَّةِ الَّتي تَعْتَمِدُ عَلَيْهَا الْحَياةُ بِرُمَّتِها. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 36)', 'الْكِتابُ ص 21–38', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الْمُؤَشِّراتِ في كِتابِ لَجْنَةِ الْأُمَمِ الْمُتَّحِدَةِ الصّادِرِ 1996 م:','[{"id": "a", "text": "حَوالَيْ 130 مُؤَشِّرًا"}, {"id": "b", "text": "58 مُؤَشِّرًا"}, {"id": "c", "text": "40 مُؤَشِّرًا"}]'),('اقْتَرَحَ مُصْطَلَحَ (Sustainomics) عامَ 1994 م:','[{"id": "a", "text": "موهانْ موناسينجْ"}, {"id": "b", "text": "روبِرْتْ سولو"}, {"id": "c", "text": "جْرو بْرونْتْلانْد"}]'),('مِنْ مُؤَشِّراتِ الْعَدالَةِ الِاجْتِماعِيَّةِ:','[{"id": "a", "text": "مُعَدَّلُ الْبِطالَةِ"}, {"id": "b", "text": "مَساحَةُ النُّظُمِ الْإيكولوجِيَّةِ"}, {"id": "c", "text": "الْإِنْفاقُ عَلَى الْبَحْثِ"}]'),('يُساعِدُ نَهْجُ دِراسَةِ الِاسْتِدامَةِ صُنّاعَ الْقَرارِ عَلَى التَّرْكيزِ عَلى:','[{"id": "a", "text": "هَيْكَلِ التَّنْمِيَةِ"}, {"id": "b", "text": "حَجْمِ النُّمُوِّ الِاقْتِصادِيِّ"}, {"id": "c", "text": "عَدَدِ السُّكّانِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T2-L3', 'الرُّؤْيَةُ الثّالِثَةُ: اسْتْراتيجِيَّةُ التَّنْمِيَةِ الْمُسْتَدامَةِ', 3, 'الْكِتابُ ص 39–50', true, '🎯 أُوَضِّحُ مَفْهومَ اسْتْراتيجِيَّةِ التَّنْمِيَةِ الْمُسْتَدامَةِ وَمَزاياها، وَأُبَيِّنُ دَوْرَ الْمُؤَسَّساتِ فيها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ مَفْهومَ اسْتْراتيجِيَّةِ التَّنْمِيَةِ الْمُسْتَدامَةِ وَمَزاياها.',1),('أُبَيِّنُ أَهَمِّيَّةَ الْإِطارِ الْمُؤَسَّسِيِّ وَالْقُدْرَةِ الْمُؤَسَّسِيَّةِ.',2),('أَسْتَنْتِجُ لِمَ صارَ وَضْعُ بَرْنامَجٍ وَطَنِيٍّ لِلْمُؤَشِّراتِ ضَرورَةً.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: اسْتْراتيجِيَّةُ التَّنْمِيَةِ الْمُسْتَدامَةِ', 'يُقْصَدُ بِاسْتْراتيجِيَّةِ التَّنْمِيَةِ الْمُسْتَدامَةِ أَنَّها عَمَلِيَّةٌ مُنَسَّقَةٌ وَتَشارُكِيَّةٌ وَمُتَواصِلَةٌ مِنَ الْأَفْكارِ وَالْأَنْشِطَةِ الَّتي تُعْتَمَدُ لِتَحْقيقِ أَهْدافٍ اقْتِصادِيَّةٍ وَبيئِيَّةٍ وَاجْتِماعِيَّةٍ بِطَريقَةٍ مُتَوازِنَةٍ وَمُتَكامِلَةٍ عَلَى الْمُسْتَوَيَيْنِ الْوَطَنِيِّ وَالْمَحَلِّيِّ. وَتَتَضَمَّنُ هٰذِهِ الْعَمَلِيَّةُ تَحْليلَ الْوَضْعِ الْحالِيِّ وَصَوْغَ السِّياساتِ وَخُطَطِ الْعَمَلِ وَتَنْفيذَها وَرَصْدَها وَاسْتِعْراضَها بِصورَةٍ مُنْتَظَمَةٍ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 39)', 'الْكِتابُ ص 39–50', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('اسْتْراتيجِيَّةُ التَّنْمِيَةِ الْمُسْتَدامَةِ هِيَ:','[{"id": "a", "text": "عَمَلِيَّةٌ مُنَسَّقَةٌ وَتَشارُكِيَّةٌ وَمُتَواصِلَةٌ"}, {"id": "b", "text": "خُطَّةٌ نِهائِيَّةٌ تُكْتَبُ مَرَّةً"}, {"id": "c", "text": "قَرارٌ بيئِيٌّ مُنْفَرِدٌ"}]'),('مِنْ مُؤَشِّرَيِ الْإِطارِ الْمُؤَسَّسِيِّ:','[{"id": "a", "text": "تَنْفيذُ الِاتِّفاقِيّاتِ الْعالَمِيَّةِ الْمُصَدَّقِ عَلَيْها"}, {"id": "b", "text": "مُعَدَّلُ الْبِطالَةِ"}, {"id": "c", "text": "الْعُمْرُ الْمُتَوَقَّعُ عِنْدَ الْوِلادَةِ"}]'),('انْعَقَدَتْ قِمَّةُ جوهانِسْبِرْغ في عامِ:','[{"id": "a", "text": "2002 م"}, {"id": "b", "text": "1992 م"}, {"id": "c", "text": "2000 م"}]'),('التَّنْمِيَةُ الْمُسْتَدامَةُ مَسْؤولِيَّةُ:','[{"id": "a", "text": "الْقِطاعِ الْعامِّ وَالْخاصِّ وَالْمُجْتَمَعِ الْمَدَنِيِّ"}, {"id": "b", "text": "الْحُكومَةِ وَحْدَها"}, {"id": "c", "text": "الْمُنَظَّماتِ الدَّوْلِيَّةِ وَحْدَها"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 2, 2, 'الْوَحْدَةُ الثّانِيَةُ: مُؤَشِّراتُ التَّنْمِيَةِ الْمُسْتَدامَةِ في دَوْلَةِ الْإِماراتِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=2
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T2-L4', 'الرُّؤْيَةُ الْأولى: الْمُؤَشِّراتُ الِاقْتِصادِيَّةُ', 3, 'الْكِتابُ ص 51–60', true, '🎯 أَقْرَأُ الْمُؤَشِّراتِ الِاقْتِصادِيَّةَ لِلتَّنْمِيَةِ الْمُسْتَدامَةِ في الْإِماراتِ، وَأَسْتَنْتِجُ دَلالاتِها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أَقْرَأُ مُؤَشِّرَ نَصيبِ الْفَرْدِ مِنَ النّاتِجِ الْمَحَلِّيِّ الْإِجْمالِيِّ وَأُفَسِّرُ تَطَوُّرَهُ.',1),('أُوَضِّحُ مُؤَشِّرَ حِصَّةِ الِاسْتِثْمارِ وَدَلالَةَ الْفَجْوَةِ بَيْنَ الِادِّخارِ وَالِاسْتِثْمارِ.',2),('أُبَيِّنُ ما يَكْشِفُهُ الْميزانُ التِّجارِيُّ لِلسِّلَعِ وَالْخَدَماتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْمُؤَشِّراتُ الِاقْتِصادِيَّةُ', 'يُعَدُّ مُؤَشِّرُ نَصيبِ الْفَرْدِ مِنَ النّاتِجِ الْمَحَلِّيِّ الْإِجْمالِيِّ أَحَدَ الْمُؤَشِّراتِ الْمُهِمَّةِ الَّتي تُسْتَخْدَمُ لِقِياسِ مَتانَةِ الِاقْتِصادِ، وَتَقْييمِ الْأَداءِ، وَمُقارَنَتِهِ فيما بَيْنَ الدُّوَلِ الْمُخْتَلِفَةِ. وَتُصَنَّفُ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ ضِمْنَ الدُّوَلِ ذاتِ الْمُعَدَّلِ الْعالي لِلدُّخولِ الْفَرْدِيَّةِ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 51)', 'الْكِتابُ ص 51–60', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَلَغَ نَصيبُ الْفَرْدِ مِنَ النّاتِجِ الْمَحَلِّيِّ الْإِجْمالِيِّ عامَ 2006 م:','[{"id": "a", "text": "38609 دولاراتٍ"}, {"id": "b", "text": "21649 دولارًا"}, {"id": "c", "text": "24308 دولاراتٍ"}]'),('مُتَوَسِّطُ نِسْبَةِ الِاسْتِثْمارِ مِنَ النّاتِجِ لِلْفَتْرَةِ 2000–2007 م:','[{"id": "a", "text": "22.5%"}, {"id": "b", "text": "43.3%"}, {"id": "c", "text": "91%"}]'),('ارْتَفَعَ الْفائِضُ التِّجارِيُّ عامَ 2007 م إِلى حَوالَيْ:','[{"id": "a", "text": "39.8 مِلْيارَ دولارٍ"}, {"id": "b", "text": "17.7 مِلْيارَ دولارٍ"}, {"id": "c", "text": "22.5 مِلْيارَ دولارٍ"}]'),('احْتَلَّتِ الْإِماراتُ في تَقْريرِ التَّنْمِيَةِ الْبَشَرِيَّةِ 2007/2008 م الْمَرْكَزَ:','[{"id": "a", "text": "39"}, {"id": "b", "text": "21"}, {"id": "c", "text": "91"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T2-L5', 'الرُّؤْيَةُ الثّانِيَةُ: الْمُؤَشِّراتُ الِاجْتِماعِيَّةُ', 3, 'الْكِتابُ ص 61–75', true, '🎯 أَقْرَأُ الْمُؤَشِّراتِ الِاجْتِماعِيَّةَ لِلتَّنْمِيَةِ الْمُسْتَدامَةِ في الْإِماراتِ، وَأُقارِنُها بِالْمُعَدَّلاتِ الْعالَمِيَّةِ.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أَقْرَأُ مُؤَشِّرَ وَفَياتِ الْأَطْفالِ دونَ الْخامِسَةِ وَأُفَسِّرُ تَحَسُّنَهُ.',1),('أُقارِنُ مُتَوَسِّطَ الْعُمْرِ الْمُتَوَقَّعِ في الْإِماراتِ بِالْمُعَدَّلاتِ الدَّوْلِيَّةِ.',2),('أُبَيِّنُ مُؤَشِّراتِ مِياهِ الشُّرْبِ وَالْمَرافِقِ الصِّحِّيَّةِ وَخَدَماتِ الرِّعايَةِ الصِّحِّيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْمُؤَشِّراتُ الِاجْتِماعِيَّةُ', 'يُعَدُّ مُتَوَسِّطُ الْعُمْرِ الْمُتَوَقَّعِ عِنْدَ الْوِلادَةِ مِنْ أَهَمِّ الْمُؤَشِّراتِ الَّتي يُعْتَمَدُ عَلَيْها في حِسابِ مُؤَشِّرِ الْحَياةِ الْمُتَوَقَّعَةِ؛ حَيْثُ يُمَثِّلُ أَحَدَ الْمُكَوِّناتِ الثَّلاثَةِ لِمُؤَشِّرِ التَّنْمِيَةِ الْبَشَرِيَّةِ الَّذي يُعِدُّهُ بَرْنامَجُ الْأُمَمِ الْمُتَّحِدَةِ الْإِنْمائِيُّ. وَيُنْظَرُ إِلى هٰذَا الْمُتَوَسِّطِ بِوَصْفِهِ حَصيلَةَ الْمُتَغَيِّراتِ الصِّحِّيَّةِ الْمُخْتَلِفَةِ الَّتي تُسْهِمُ في صِحَّةِ الْفَرْدِ، بِما يُعَزِّزُ فُرَصَ عَيْشِهِ حَياةً أَطْوَلَ وَبِأَفْضَلِ حالَةٍ صِحِّيَّةٍ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 66)', 'الْكِتابُ ص 61–75', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('انْخَفَضَ مُعَدَّلُ وَفَياتِ الْأَطْفالِ دونَ الْخامِسَةِ في الْإِماراتِ عامَ 2005 م إِلى:','[{"id": "a", "text": "9 حالاتٍ لِكُلِّ أَلْفِ مَوْلودٍ حَيٍّ"}, {"id": "b", "text": "14 حالَةً"}, {"id": "c", "text": "83 حالَةً"}]'),('ارْتَفَعَ مُتَوَسِّطُ الْعُمْرِ الْمُتَوَقَّعِ عِنْدَ الْوِلادَةِ عامَ 2005 م إِلى:','[{"id": "a", "text": "78.3 سَنَةً"}, {"id": "b", "text": "75 سَنَةً"}, {"id": "c", "text": "68.1 سَنَةً"}]'),('نِسْبَةُ السُّكّانِ الَّذينَ توَفِّرُ لَهُمُ الْإِماراتُ مِياهَ الشُّرْبِ الصّالِحَةَ:','[{"id": "a", "text": "100%"}, {"id": "b", "text": "98%"}, {"id": "c", "text": "59%"}]'),('مُتَوَسِّطُ الْعُمْرِ الْمُتَوَقَّعِ عَلى صَعيدِ الْعالَمِ وَفْقَ التَّقْريرِ:','[{"id": "a", "text": "68.1 سَنَةً"}, {"id": "b", "text": "66.1 سَنَةً"}, {"id": "c", "text": "78.3 سَنَةً"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T2-L6', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُؤَشِّراتُ الْبيئِيَّةُ', 3, 'الْكِتابُ ص 80–98', true, '🎯 أَسْتَنْتِجُ ما تَكْشِفُهُ الْمُؤَشِّراتُ الْبيئِيَّةُ في الْإِماراتِ مِنْ إِنْجازاتٍ وَتَحَدِّياتٍ.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ إِنْجازَ الْإِماراتِ في مُؤَشِّرِ الْأَراضي الْمُغَطّاةِ بِالْغاباتِ.',1),('أَقْرَأُ مُؤَشِّرَيِ السُّكّانِ السّاحِلِيّينَ وَالْحَصيلَةِ السَّنَوِيَّةِ لِصَيْدِ الْأَسْماكِ.',2),('أَسْتَنْتِجُ التَّحَدِّيَ الَّذي يَكْشِفُهُ مُؤَشِّرُ السَّحْبِ السَّنَوِيِّ لِلْمِياهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُؤَشِّراتُ الْبيئِيَّةُ', 'يَقيسُ مُؤَشِّرُ الْمَسْحوباتِ مِنَ الْمِياهِ الْمُتاحَةِ الطَّلَبَ عَلَى الْمِياهِ في الدَّوْلَةِ، وَيَكْشِفُ عَنْ مَدى تَعَرُّضِها لِخَطَرِ حُدوثِ عَجْزٍ في الْمِياهِ. وَقَدْ شَهِدَ مُؤَشِّرُ السَّحْبِ السَّنَوِيِّ مِنَ الْمِياهِ الْجَوْفِيَّةِ وَالسَّطْحِيَّةِ كَنِسْبَةٍ مِئَوِيَّةٍ مِنَ الِاحْتِياطِيّاتِ الْمُتَجَدِّدَةِ ارْتِفاعًا كَبيرًا خِلالَ الْعَقْدِ الْأَخيرِ مِنَ الْقَرْنِ الْعِشْرينَ؛ إِذِ ارْتَفَعَ مِنْ (604%) في عامِ 1990 م إِلى (1407%) في عامِ 2000 م. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 86)', 'الْكِتابُ ص 80–98', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('ارْتَفَعَتْ نِسْبَةُ الْأَراضي الْمُغَطّاةِ بِالْغاباتِ عامَ 2005 م إِلى:','[{"id": "a", "text": "3.7%"}, {"id": "b", "text": "2.9%"}, {"id": "c", "text": "10%"}]'),('نِسْبَةُ سُكّانِ الْإِماراتِ الْقاطِنينَ في الْمَناطِقِ السّاحِلِيَّةِ:','[{"id": "a", "text": "58.3%"}, {"id": "b", "text": "39%"}, {"id": "c", "text": "100%"}]'),('ارْتَفَعَ السَّحْبُ السَّنَوِيُّ لِلْمِياهِ عامَ 2000 م إِلى:','[{"id": "a", "text": "1407%"}, {"id": "b", "text": "604%"}, {"id": "c", "text": "58.3%"}]'),('تَأْتي الْإِماراتُ في مُعَدَّلاتِ السَّحْبِ السَّنَوِيِّ لِلْمِياهِ خَليجِيًّا في الْمَرْتَبَةِ:','[{"id": "a", "text": "الثّالِثَةِ بَعْدَ قَطَرَ وَالسُّعودِيَّةِ"}, {"id": "b", "text": "الْأولى"}, {"id": "c", "text": "الْأَخيرَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 2, 3, 'الْوَحْدَةُ الثّالِثَةُ: تَحَدِّياتُ التَّنْمِيَةِ الْمُسْتَدامَةِ في دَوْلَةِ الْإِماراتِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=2
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T2-L10', 'الرُّؤْيَةُ الرّابِعَةُ: التَّحَدِّياتُ الْمُؤَسَّسِيَّةُ', 3, 'الْكِتابُ ص 118–122', true, '🎯 أُبَيِّنُ تَحَدِّياتِ مَنْظومَةِ الْبَحْثِ وَالتَّطْويرِ في الْإِماراتِ، وَأَقْتَرِحُ سُبُلَ تَجاوُزِها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ ضَعْفَ مَدْخَلاتِ الْبَحْثِ وَالتَّطْويرِ مِنَ الْبَشَرِ وَالْمالِ.',1),('أَقْرَأُ مُؤَشِّرَيِ الْبُحوثِ الْمَنْشورَةِ وَبَراءاتِ الِاخْتِراعِ.',2),('أَقْتَرِحُ وَسائِلَ لِتَطْويرِ مَنْظومَةِ الْبَحْثِ وَالتَّطْويرِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: التَّحَدِّياتُ الْمُؤَسَّسِيَّةُ', 'تُعَدُّ الْمَواردُ الْبَشَرِيَّةُ الْمُؤَهَّلَةُ تَأْهيلًا عالِيًا مِنْ أَهَمِّ مَدْخَلاتِ وَمُقَوِّماتِ الْعَمَلِ في مَجالِ الْبَحْثِ الْعِلْمِيِّ وَالتَّطْويرِ التِّكْنولوجِيِّ، كَما أَنَّها تُسْتَخْدَمُ أَحَدَ الْمَعايِرِ الْمُهِمَّةِ في تَقْييمِ مَسيرَةِ التَّنْمِيَةِ التِّكْنولوجِيَّةِ؛ وَذٰلِكَ لِسَبَبَيْنِ: أَوَّلُهُما أَنَّ الْجُهْدَ الْمَبْذولَ في الْبَحْثِ وَالتَّطْويرِ هُوَ الَّذي يُحَدِّدُ مُسْتَقْبَلَ تَطْويرِ الْقُدُراتِ التِّكْنولوجِيَّةِ الذّاتِيَّةِ، وَثانيهِما أَنَّ هٰذَا النَّشاطَ يَعْكِسُ لَنا وُجودَ نَقْلٍ عَمودِيٍّ حَقيقِيٍّ لِلتِّكْنولوجْيا قِوامُهُ الْإِمْكاناتُ الذّاتِيَّةُ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 119)', 'الْكِتابُ ص 118–122', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الْباحِثينَ الْمُتَفَرِّغينَ لِكُلِّ 100 أَلْفٍ مِنَ السُّكّانِ في الْإِماراتِ:','[{"id": "a", "text": "4.5 باحِثينَ"}, {"id": "b", "text": "370 باحِثًا"}, {"id": "c", "text": "8.6 باحِثينَ"}]'),('نِسْبَةُ الْإِنْفاقِ عَلَى الْبَحْثِ وَالتَّطْويرِ خِلالَ الْفَتْرَةِ 1996–2003 م:','[{"id": "a", "text": "0.02%"}, {"id": "b", "text": "2.5%"}, {"id": "c", "text": "1%"}]'),('بَلَغَ مَجْموعُ بَراءاتِ الِاخْتِراعِ الْمُسَجَّلَةِ خِلالَ ثَلاثينَ سَنَةً:','[{"id": "a", "text": "54 بَراءَةً"}, {"id": "b", "text": "159 بَراءَةً"}, {"id": "c", "text": "150 بَراءَةً"}]'),('تَتَطَلَّبُ الْمُواجَهَةُ رَفْعَ نِسْبَةِ الْإِنْفاقِ في عامِ 2020 م إِلى:','[{"id": "a", "text": "1.5%"}, {"id": "b", "text": "0.03%"}, {"id": "c", "text": "70%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T2-L7', 'الرُّؤْيَةُ الْأولى: التَّحَدِّياتُ الِاقْتِصادِيَّةُ', 3, 'الْكِتابُ ص 99–106', true, '🎯 أُحَدِّدُ أَبْرَزَ التَّحَدِّياتِ الِاقْتِصادِيَّةِ الَّتي تُواجِهُ التَّنْمِيَةَ الْمُسْتَدامَةَ في الْإِماراتِ، وَأُفَسِّرُ أَسْبابَها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أَقْرَأُ تَصاعُدَ مُعَدَّلاتِ التَّضَخُّمِ وَأُبَيِّنُ أَسْبابَهُ.',1),('أُفَسِّرُ ظاهِرَةَ الْبِطالَةِ وَأَذْكُرُ عَوامِلَها.',2),('أُوَضِّحُ تَحَدِّيَ التَّنْويعِ الِاقْتِصادِيِّ وَأَهَمِّيَّتَهُ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: التَّحَدِّياتُ الِاقْتِصادِيَّةُ', 'تُمَثِّلُ سِياسَةُ التَّنْويعِ الِاقْتِصادِيِّ — وَهِيَ عَمَلِيَّةٌ تَدْريجِيَّةٌ لِتَنْويعِ مَصادِرِ الدَّخْلِ — إِحْدَى الْأَدَواتِ الْمُهِمَّةِ في عَمَلِيَّةِ التَّنْمِيَةِ الْمُسْتَدامَةِ، وَتُعَدُّ أَحَدَ أَهَمِّ التَّحَدِّياتِ الَّتي تُواجِهُ الِاقْتِصاداتِ الْخَليجِيَّةَ، وَمِنْهَا الِاقْتِصادُ الْإِماراتِيُّ، وَالَّتي تَعْتَمِدُ إِلى حَدٍّ كَبيرٍ عَلى تَصْديرِ سِلْعَةٍ واحِدَةٍ ناضِبَةٍ هِيَ النَّفْطُ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 105)', 'الْكِتابُ ص 99–106', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَلَغَ مُعَدَّلُ التَّضَخُّمِ في الِاقْتِصادِ الْإِماراتِيِّ عامَ 2007 م:','[{"id": "a", "text": "10.9%"}, {"id": "b", "text": "1.4%"}, {"id": "c", "text": "6.1%"}]'),('تَصاعَدَ مُعَدَّلُ الْبِطالَةِ عامَ 2004 م إِلى:','[{"id": "a", "text": "3%"}, {"id": "b", "text": "1.8%"}, {"id": "c", "text": "9%"}]'),('انْخَفَضَتْ مُساهَمَةُ قِطاعِ النَّفْطِ في النّاتِجِ الْمَحَلِّيِّ عامَ 2007 م إِلى:','[{"id": "a", "text": "35%"}, {"id": "b", "text": "41.7%"}, {"id": "c", "text": "76.6%"}]'),('مِنْ أَسْبابِ الْبِطالَةِ في الدَّوْلَةِ كَما ذَكَرَ الْكِتابُ:','[{"id": "a", "text": "عَدَمُ الْمُواءَمَةِ بَيْنَ التَّعْليمِ وَسوقِ الْعَمَلِ"}, {"id": "b", "text": "قِلَّةُ عَدَدِ السُّكّانِ"}, {"id": "c", "text": "انْخِفاضُ النُّمُوِّ الِاقْتِصادِيِّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T2-L8', 'الرُّؤْيَةُ الثّانِيَةُ: التَّحَدِّياتُ الِاجْتِماعِيَّةُ', 3, 'الْكِتابُ ص 107–112', true, '🎯 أُبَيِّنُ تَحَدِّيَيِ التَّرْكيبَةِ السُّكّانِيَّةِ وَمُشارَكَةِ الْمَرْأَةِ، وَأَقْتَرِحُ سِياساتٍ لِمُعالَجَتِهِما.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أَقْرَأُ بَياناتِ التَّعْدادِ وَأَسْتَنْتِجُ الْخَلَلَ في التَّرْكيبَةِ السُّكّانِيَّةِ.',1),('أُبَيِّنُ ضَعْفَ مُشارَكَةِ الْمَرْأَةِ في الْقِطاعاتِ الْإِنْتاجِيَّةِ وَأَسْبابَهُ.',2),('أَقْتَرِحُ سِياساتٍ لِمُعالَجَةِ التَّحَدِّيَيْنِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: التَّحَدِّياتُ الِاجْتِماعِيَّةُ', 'إِنَّ تَحَدِّيَ الْخَلَلِ في التَّرْكيبَةِ السُّكّانِيَّةِ لِصالِحِ الْوافِدينَ يَتَطَلَّبُ مِنَ الدَّوْلَةِ وَضْعَ سِياساتٍ اجْتِماعِيَّةٍ مُتَكامِلَةٍ تَشْمَلُ السِّياسَةَ السُّكّانِيَّةَ وَسِياساتِ سوقِ الْعَمَلِ وَاسْتِقْدامِ الْعِمالَةِ الْوافِدَةِ إِلى دَوْلَةِ الْإِماراتِ بِصورَةٍ واضِحَةٍ وَمُحَدَّدَةٍ، وَرَبْطِها بِالسِّياسَةِ الِاقْتِصادِيَّةِ وَمُعَدَّلاتِ النُّمُوِّ الِاقْتِصادِيِّ الْمَطْلوبِ تَحْقيقُها في الْقِطاعِ غَيْرِ النَّفْطِيِّ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 110)', 'الْكِتابُ ص 107–112', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَلَغَ إِجْمالِيُّ سُكّانِ الدَّوْلَةِ وَفْقَ تَعْدادِ 2005 م:','[{"id": "a", "text": "3,769,080 نَسَمَةً"}, {"id": "b", "text": "824,921 نَسَمَةً"}, {"id": "c", "text": "2,944,159 نَسَمَةً"}]'),('نِسْبَةُ الْمُواطِنينَ مِنْ إِجْمالِيِّ السُّكّانِ وَفْقَ التَّعْدادِ:','[{"id": "a", "text": "21.9%"}, {"id": "b", "text": "78.1%"}, {"id": "c", "text": "50.6%"}]'),('لَمْ تَتَخَطَّ مُساهَمَةُ الْمَرْأَةِ في الْقِطاعاتِ الْإِنْتاجِيَّةِ:','[{"id": "a", "text": "12%"}, {"id": "b", "text": "30%"}, {"id": "c", "text": "66%"}]'),('انْخَفَضَ مُعَدَّلُ الْخُصوبَةِ الْكُلِّيَّةِ عامَ 2007 م إِلى:','[{"id": "a", "text": "2.36"}, {"id": "b", "text": "4.76"}, {"id": "c", "text": "3.00"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T2-L9', 'الرُّؤْيَةُ الثّالِثَةُ: التَّحَدِّياتُ الْبيئِيَّةُ', 3, 'الْكِتابُ ص 113–118', true, '🎯 أُحَلِّلُ التَّحَدِّياتِ الْبيئِيَّةَ الثَّلاثَةَ، وَأَقْتَرِحُ وَسائِلَ لِمُواجَهَتِها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ شُحَّ الْمَواردِ الْمائِيَّةِ وَمَوْقِعَ الدَّوْلَةِ خَليجِيًّا وَعالَمِيًّا.',1),('أَذْكُرُ أَسْبابَ التَّصَحُّرِ وَتَدَهْوُرِ الْأَراضي.',2),('أَقْرَأُ مُؤَشِّرَ انْبِعاثاتِ ثاني أُكْسيدِ الْكَرْبونِ وَأَسْتَنْتِجُ خُطورَتَهُ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: التَّحَدِّياتُ الْبيئِيَّةُ', 'تُشيرُ التَّقاريرُ الدَّوْلِيَّةُ الصّادِرَةُ عَنْ مُنَظَّماتِ الْأُمَمِ الْمُتَّحِدَةِ الْمَعْنِيَّةِ بِقَضايَا الْمِياهِ إِلى أَنَّ دَوْلَةَ الْإِماراتِ تُصَنَّفُ ضِمْنَ الدُّوَلِ الَّتي تُعاني فَقْرًا مائِيًّا حادًّا — وَهِيَ الدُّوَلُ الَّتي يَقِلُّ نَصيبُ الْفَرْدِ فيها عَنْ (500) مِتْرٍ مُكَعَّبٍ سَنَوِيًّا — حَيْثُ يَبْلُغُ نَصيبُ الْفَرْدِ فيها (5) أَمْتارٍ مُكَعَّبَةٍ في السَّنَةِ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 113)', 'الْكِتابُ ص 113–118', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَصيبُ الْفَرْدِ في الْإِماراتِ مِنَ الْمَواردِ الْمائِيَّةِ الْمُتَجَدِّدَةِ سَنَوِيًّا:','[{"id": "a", "text": "5 أَمْتارٍ مُكَعَّبَةٍ"}, {"id": "b", "text": "500 مِتْرٍ مُكَعَّبٍ"}, {"id": "c", "text": "570 لِتْرًا"}]'),('نِسْبَةُ الْأَراضي الْمُتَدَهْوِرَةِ في الدَّوْلَةِ:','[{"id": "a", "text": "83%"}, {"id": "b", "text": "77%"}, {"id": "c", "text": "67%"}]'),('ارْتَفَعَ نَصيبُ الْفَرْدِ مِنِ انْبِعاثاتِ ثاني أُكْسيدِ الْكَرْبونِ عامَ 2004 م إِلى:','[{"id": "a", "text": "34.1 طَنًّا"}, {"id": "b", "text": "27.2 طَنًّا"}, {"id": "c", "text": "13.1 طَنًّا"}]'),('احْتَلَّتِ الدَّوْلَةُ في مُؤَشِّرِ الِاسْتِدامَةِ الْبيئِيَّةِ لِعامِ 2004 م الْمَرْكَزَ:','[{"id": "a", "text": "110 مِنْ بَيْنِ 146 دَوْلَةً"}, {"id": "b", "text": "39 مِنْ بَيْنِ 146 دَوْلَةً"}, {"id": "c", "text": "الْأَوَّلَ خَليجِيًّا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 2, 4, 'الْوَحْدَةُ الرّابِعَةُ: جُهودُ دَوْلَةِ الْإِماراتِ في تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=2
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T2-L11', 'الرُّؤْيَةُ الْأولى: التَّطَوُّراتُ التَّشْريعِيَّةُ وَالْمُؤَسَّسِيَّةُ', 3, 'الْكِتابُ ص 123–134', true, '🎯 أَسْتَعْرِضُ أَبْرَزَ الْقَوانينِ وَالْمُؤَسَّساتِ الَّتي أَنْشَأَتْهَا الدَّوْلَةُ لِخِدْمَةِ التَّنْمِيَةِ الْمُسْتَدامَةِ.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أَذْكُرُ أَبْرَزَ الْقَوانينِ الِاتِّحادِيَّةِ الْمُنَظِّمَةِ لِلْبيئَةِ وَالثَّرَواتِ.',1),('أُبَيِّنُ مَهامَّ الْهَيْئَةِ الِاتِّحادِيَّةِ لِلْبيئَةِ وَوِزارَةِ الْبيئَةِ وَالْمِياهِ.',2),('أُعَدِّدُ اللِّجانَ الْوَطَنِيَّةَ الْمَعْنِيَّةَ بِالتَّنْمِيَةِ الْمُسْتَدامَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: التَّطَوُّراتُ التَّشْريعِيَّةُ وَالْمُؤَسَّسِيَّةُ', 'تُشَكِّلُ الْقَوانينُ وَالتَّشْريعاتُ إِطارًا قانونِيًّا لِكُلِّ الْبَرامِجِ وَالْأَنْشِطَةِ الْمَحَلِّيَّةِ الَّتي يَجِبُ أَنْ يُعْمَلَ بِها لِتَحْقيقِ التَّوازُنِ بَيْنَ الْمُتَطَلَّباتِ التَّنْمَوِيَّةِ وَالْمُحافَظَةِ عَلَى الْمَواردِ الطَّبيعِيَّةِ. وَفي هٰذَا السِّياقِ، أَصْدَرَتِ الدَّوْلَةُ عَدَدًا مِنَ الْقَوانينِ وَالتَّشْريعاتِ الَّتي تُنَظِّمُ ذٰلِكَ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 124)', 'الْكِتابُ ص 123–134', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْقانونُ الِاتِّحادِيُّ بِشَأْنِ حِمايَةِ الْبيئَةِ وَتَنْمِيَتِها هُوَ:','[{"id": "a", "text": "رَقْمُ 24 لِسَنَةِ 1999 م"}, {"id": "b", "text": "رَقْمُ 23 لِسَنَةِ 1999 م"}, {"id": "c", "text": "رَقْمُ 11 لِسَنَةِ 2002 م"}]'),('تَأَسَّسَتِ الْهَيْئَةُ الِاتِّحادِيَّةُ لِلْبيئَةِ في عامِ:','[{"id": "a", "text": "1993 م"}, {"id": "b", "text": "1992 م"}, {"id": "c", "text": "2006 م"}]'),('تَأَسَّسَتْ وِزارَةُ الْبيئَةِ وَالْمِياهِ في عامِ:','[{"id": "a", "text": "2006 م"}, {"id": "b", "text": "1996 م"}, {"id": "c", "text": "2002 م"}]'),('أُنْشِئَتِ اللَّجْنَةُ الْوَطَنِيَّةُ لِمُكافَحَةِ التَّصَحُّرِ في عامِ:','[{"id": "a", "text": "2003 م"}, {"id": "b", "text": "2002 م"}, {"id": "c", "text": "2004 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T2-L12', 'الرُّؤْيَةُ الثّانِيَةُ: الِاسْتْراتيجِيّاتُ وَالْخُطَطُ', 3, 'الْكِتابُ ص 135–154', true, '🎯 أُبَيِّنُ أَبْرَزَ الِاسْتْراتيجِيّاتِ الْوَطَنِيَّةِ الْمَعْنِيَّةِ بِالتَّنْمِيَةِ الْمُسْتَدامَةِ وَمَجالاتِها.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ قِطاعاتِ اسْتْراتيجِيَّةِ حُكومَةِ الدَّوْلَةِ وَمَبادِئَها.',1),('أُبَيِّنُ أَوْلَوِيّاتِ الِاسْتْراتيجِيَّةِ الْوَطَنِيَّةِ الْبيئِيَّةِ وَخُطَّةِ الْعَمَلِ.',2),('أُلَخِّصُ أَهْدافَ اسْتْراتيجِيَّتَيْ مُكافَحَةِ التَّصَحُّرِ وَتَقَدُّمِ الْمَرْأَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الِاسْتْراتيجِيّاتُ وَالْخُطَطُ', 'أَنْجَزَتِ الدَّوْلَةُ في عامِ 2000 م — وَبَعْدَ ثَلاثِ سَنَواتٍ مِنَ الْعَمَلِ الْمُسْتَمِرِّ — الِاسْتْراتيجِيَّةَ الْوَطَنِيَّةَ الْبيئِيَّةَ وَخُطَّةَ الْعَمَلِ الْبيئِيِّ، وَالَّتي جاءَ إِعْدادُها لِتَعْزيزِ الْتِزامِ الدَّوْلَةِ بِالْحِفاظِ عَلَى الْبيئَةِ وَمَنْعِ تَدَهْوُرِها، وَهُوَ ما أَكَّدَ عَلَيْهِ مُؤْتَمَرُ الْأُمَمِ الْمُتَّحِدَةِ لِلْبيئَةِ وَالتَّنْمِيَةِ (قِمَّةُ الْأَرْضِ) الَّذي انْعَقَدَ بِالْبْرازيلِ عامَ 1992 م. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 142)', 'الْكِتابُ ص 135–154', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُعْلِنَتِ اسْتْراتيجِيَّةُ حُكومَةِ الدَّوْلَةِ في:','[{"id": "a", "text": "نيسانَ/ أَبْريلَ 2007 م"}, {"id": "b", "text": "شُباطَ/ فِبْرايَرَ 2006 م"}, {"id": "c", "text": "كانونَ الْأَوَّلِ 2002 م"}]'),('عَدَدُ الْقِطاعاتِ الرَّئيسَةِ في اسْتْراتيجِيَّةِ الْحُكومَةِ:','[{"id": "a", "text": "سِتَّةُ قِطاعاتٍ"}, {"id": "b", "text": "عَشَرَةُ قِطاعاتٍ"}, {"id": "c", "text": "ثَمانِيَةُ قِطاعاتٍ"}]'),('أُنْجِزَتِ الِاسْتْراتيجِيَّةُ الْوَطَنِيَّةُ الْبيئِيَّةُ وَخُطَّةُ الْعَمَلِ الْبيئِيِّ في عامِ:','[{"id": "a", "text": "2000 م"}, {"id": "b", "text": "2003 م"}, {"id": "c", "text": "2007 م"}]'),('عَدَدُ الْمَيادينِ الرَّئيسَةِ في اسْتْراتيجِيَّةِ تَقَدُّمِ الْمَرْأَةِ:','[{"id": "a", "text": "ثَمانِيَةُ مَيادينَ"}, {"id": "b", "text": "سِتَّةُ مَيادينَ"}, {"id": "c", "text": "أَرْبَعَةُ مَيادينَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T2-L13', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُبادَراتُ الْمَعْنِيَّةُ بِالتَّنْمِيَةِ الْمُسْتَدامَةِ', 3, 'الْكِتابُ ص 155–162', true, '🎯 أَعْرِضُ أَبْرَزَ الْمُبادَراتِ الْوَطَنِيَّةِ وَأُبَيِّنُ أَثَرَها في التَّنْمِيَةِ الْمُسْتَدامَةِ.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ مُبادَرَةَ مَدينَةِ دُبَيَّ لِلْإِنْتِرْنِتِ وَأَثَرَها.',1),('أَذْكُرُ أَهْدافَ مُؤَسَّسَةِ مُحَمَّدِ بْنِ راشِدٍ آلِ مَكْتومٍ لِلتَّنْمِيَةِ الْإِنْسانِيَّةِ.',2),('أُوَضِّحُ مُبادَرَتَيْ مَصْدَرَ وَالْمَباني الْخُضْرِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُبادَراتُ الْمَعْنِيَّةُ بِالتَّنْمِيَةِ الْمُسْتَدامَةِ', 'تَأَسَّسَتْ شَرِكَةُ مَصْدَرَ في عامِ 2006 م بِهَدَفِ إِرْساءِ دَعائِمِ قِطاعٍ اقْتِصادِيٍّ جَديدٍ كُلِّيًّا مِنْ شَأْنِهِ أَنْ يُحَوِّلَ إِمارَةَ أَبوظَبْيَ إِلى مَقَرٍّ لِتَصْديرِ التِّكْنولوجْيا؛ وَقَدْ خَصَّصَتْ حُكومَةُ أَبوظَبْيَ أَرْضًا مِساحَتُها أَرْبَعَةُ كيلومِتْراتٍ مُرَبَّعَةٍ، وَاسْتِثْمارًا يَبْلُغُ حَجْمُهُ (100) مِلْيونِ دولارٍ لِدَعْمِ هٰذَا الْمَشْروعِ الرِّيادِيِّ مِنْ أَجْلِ تَطْويرِ مَصادِرِ الطّاقَةِ الْبَديلَةِ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 158)', 'الْكِتابُ ص 155–162', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُنْشِئَتْ مَدينَةُ دُبَيَّ لِلْإِنْتِرْنِتِ في عامِ:','[{"id": "a", "text": "2000 م"}, {"id": "b", "text": "2006 م"}, {"id": "c", "text": "2008 م"}]'),('تَبْلُغُ قيمَةُ وَقْفِ مُؤَسَّسَةِ مُحَمَّدِ بْنِ راشِدٍ آلِ مَكْتومٍ:','[{"id": "a", "text": "10 مِلْياراتِ دولارٍ"}, {"id": "b", "text": "100 مِلْيونِ دولارٍ"}, {"id": "c", "text": "22 مِلْيارَ دولارٍ"}]'),('خَصَّصَتْ حُكومَةُ أَبوظَبْيَ لِمَصْدَرَ اسْتِثْمارًا قيمَتُهُ:','[{"id": "a", "text": "100 مِلْيونِ دولارٍ"}, {"id": "b", "text": "رُبْعُ مِلْيارِ دولارٍ"}, {"id": "c", "text": "10 مِلْياراتِ دولارٍ"}]'),('بَدَأَ الْعَمَلُ بِمَعاييرِ الْمَباني الْخُضْرِ في دُبَيَّ في:','[{"id": "a", "text": "يَنايِرَ 2008 م"}, {"id": "b", "text": "أَبْريلَ 2007 م"}, {"id": "c", "text": "فِبْرايَرَ 2006 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T2-L14', 'الرُّؤْيَةُ الرّابِعَةُ: الدَّوْرُ الدَّوْلِيُّ لِدَوْلَةِ الْإِماراتِ', 3, 'الْكِتابُ ص 163–171', true, '🎯 أُبَيِّنُ دَوْرَ الْإِماراتِ في الْجُهودِ الدَّوْلِيَّةِ لِتَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ.' from u
  on conflict (code) do update set title_ar = excluded.title_ar,
       objective_ar = excluded.objective_ar, book_pages = excluded.book_pages,
       unit_id = excluded.unit_id, sort_order = excluded.sort_order
  returning id),
l as (select id from ins),
d1 as (delete from success_criteria where lesson_id in (select id from l)),
d2 as (delete from lesson_resources where lesson_id in (select id from l)),
d3 as (delete from lesson_book_texts where lesson_id in (select id from l)),
d4 as (delete from question_keys where question_id in
        (select q2.id from questions q2 where q2.lesson_id in (select id from l))),
d5 as (delete from questions where lesson_id in (select id from l)),
c1 as (insert into success_criteria (lesson_id, statement_ar, sort_order)
       select l.id, v.s, v.n from l, (values ('أَذْكُرُ أَبْرَزَ الِاتِّفاقِيّاتِ الدَّوْلِيَّةِ وَالْإِقْليمِيَّةِ الَّتِي انْضَمَّتْ إِلَيْهَا الدَّوْلَةُ.',1),('أُعَدِّدُ الْمُبادَراتِ وَالْإِعْلاناتِ الْبيئِيَّةَ الَّتي أَطْلَقَتْها.',2),('أُبَيِّنُ أَهْدافَ الْجَوائِزِ الْمَعْنِيَّةِ بِالتَّنْمِيَةِ الْمُسْتَدامَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الدَّوْرُ الدَّوْلِيُّ لِدَوْلَةِ الْإِماراتِ', 'أَسْهَمَتِ الْجُهودُ الْكَبيرَةُ الَّتي قامَتْ بِها دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في مَجالِ تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ في احْتِلالِها مَوْقِعًا مُتَمَيِّزًا عَلى خَريطَةِ الْعَمَلِ في مَجالِ التَّنْمِيَةِ الْمُسْتَدامَةِ عَلَى الصَّعيدَيْنِ الْعالَمِيِّ وَالْإِقْليمِيِّ؛ فَقَدْ قامَتْ بِالِانْضِمامِ لِلْعَديدِ مِنَ الِاتِّفاقِيّاتِ الدَّوْلِيَّةِ وَالْإِقْليمِيَّةِ الْمَعْنِيَّةِ بِالْمُحافَظَةِ عَلَى الْبيئَةِ وَتَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ. (التَّنْمِيَةُ الْمُسْتَدامَةُ، ص 163)', 'الْكِتابُ ص 163–171', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T2-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('انْضَمَّتِ الْإِماراتُ إِلَى اتِّفاقِيَّةِ الْأُمَمِ الْمُتَّحِدَةِ حَوْلَ الْقانونِ الدَّوْلِيِّ لِلْبِحارِ لِعامِ:','[{"id": "a", "text": "1982 م"}, {"id": "b", "text": "1972 م"}, {"id": "c", "text": "1992 م"}]'),('بْروتوكولُ كْيوتو الْمُتَعَلِّقُ بِتَغَيُّرِ الْمُناخِ لِعامِ:','[{"id": "a", "text": "1997 م"}, {"id": "b", "text": "1992 م"}, {"id": "c", "text": "1994 م"}]'),('أُطْلِقَتْ مُبادَرَةُ أَبوظَبْيَ الْعالَمِيَّةُ لِلْبَياناتِ الْبيئِيَّةِ في مُؤْتَمَرِ:','[{"id": "a", "text": "قِمَّةِ جوهانِسْبِرْغَ 2002 م"}, {"id": "b", "text": "قِمَّةِ ريو 1992 م"}, {"id": "c", "text": "مُؤْتَمَرِ بَكّينَ 1995 م"}]'),('تُشْرِفُ عَلى إِدارَةِ جائِزَةِ دُبَيَّ الدَّوْلِيَّةِ لِأَفْضَلِ الْمُمارَساتِ:','[{"id": "a", "text": "بَلَدِيَّةُ دُبَيَّ"}, {"id": "b", "text": "الْهَيْئَةُ الِاتِّحادِيَّةُ لِلْبيئَةِ"}, {"id": "c", "text": "وِزارَةُ الْبيئَةِ وَالْمِياهِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;