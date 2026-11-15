
insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 1, 1, 'الْوَحْدَةُ الْأولى: الْإِماراتُ نَبْضُ الْعالَمِ — دُسْتورٌ وَتَضامُنٌ وَأُخُوَّةٌ وَشَراكَةٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=1
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T1-L1', 'دُسْتورُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 3, 'ص 10–19', true, '🎯 أُوَضِّحُ بُنودَ الدُّسْتورِ وَمَوادَّهُ، وَأُبَيِّنُ أَهَمِّيَّتَهُ لِلدَّوْلَةِ وَلِلْمُواطِنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ مَفْهومَ الدُّسْتورِ وَبُنودَهُ وَمَوادَّهُ.',1),('أُبَيِّنُ أَهَمِّيَّةَ الدُّسْتورِ وَالْقانونِ لِلْمُجْتَمَعِ في دَوْلَةِ الْإِماراتِ.',2),('أُوَضِّحُ الِاتِّجاهاتِ الْعامَّةَ لِدُسْتورِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'دُسْتورُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 'الدُّسْتورُ هُوَ مَجْموعَةُ الْقَواعِدِ وَالْقَوانينِ الَّتي تُحَدِّدُ نِظامَ الْحُكْمِ في الدَّوْلَةِ، وَتُنَظِّمُ السُّلُطاتِ الْعامَّةَ في الدَّوْلَةِ وَتُحَدِّدُ مَهامَّها، وَتُبَيِّنُ ما لِلْأَفْرادِ مِنْ حُرِّيّاتٍ عامَّةٍ وَحُقوقٍ وَواجِباتٍ. وَيُعَدُّ الدُّسْتورُ الْمَرْجِعَ الْأَساسَ لِلْقَوانينِ وَالتَّشْريعاتِ كافَّةً، وَيَجِبُ أَنْ تَتَوافَقَ الْقَوانينُ مَعَ مَبادِئِ الدُّسْتورِ فَهُوَ يَقَعُ في قِمَّةِ الْهَرَمِ الْقانونِيِّ لِلدَّوْلَةِ.', 'ص 10–19', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('صَدَرَ دُسْتورُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في:','[{"id": "a", "text": "2 ديسَمْبِرَ 1971 م"}, {"id": "b", "text": "18 يولْيو 1971 م"}, {"id": "c", "text": "1996 م"}]'),('عَدَدُ مَوادِّ الدُّسْتورِ:','[{"id": "a", "text": "152 مادَّةً"}, {"id": "b", "text": "52 مادَّةً"}, {"id": "c", "text": "10 مَوادَّ"}]'),('الْمادَّةُ الَّتي تَنُصُّ عَلى تَكْوينِ السُّلُطاتِ الِاتِّحادِيَّةِ هِيَ:','[{"id": "a", "text": "الْمادَّةُ 45"}, {"id": "b", "text": "الْمادَّةُ 1"}, {"id": "c", "text": "الْمادَّةُ 14"}]'),('مِنَ الْواجِباتِ الْعامَّةِ في الدُّسْتورِ:','[{"id": "a", "text": "الدِّفاعُ عَنِ الِاتِّحادِ"}, {"id": "b", "text": "كَفالَةُ الْحُرِّيَّةِ الشَّخْصِيَّةِ"}, {"id": "c", "text": "اسْتِقْلالُ الْقَضاءِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T1-L2', 'التَّضامُنُ الْعَرَبِيُّ', 3, 'ص 20–30', true, '🎯 أَسْتَخْلِصُ عَوامِلَ التَّضامُنِ الْعَرَبِيِّ وَأَهْدافَهُ، وَأُوَضِّحُ نَماذِجَ مِنْهُ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَخْلِصُ عَوامِلَ التَّضامُنِ الْعَرَبِيِّ وَأَهْدافَهُ.',1),('أُوَضِّحُ نَماذِجَ مِنَ التَّضامُنِ الْعَرَبِيِّ وَدَوْرَهُ في حَرْبِ أُكْتوبَرَ 1973 م.',2),('أُقَدِّرُ الْجُهودَ الَّتي تَبْذُلُها قِيادَةُ الدَّوْلَةِ وَالسُّعودِيَّةُ لِحِمايَةِ الْمِنْطَقَةِ الْعَرَبِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'التَّضامُنُ الْعَرَبِيُّ', 'إِنَّ الْأُمَّةَ الْعَرَبِيَّةَ هَدَفُهَا التَّضامُنُ الْعَرَبِيُّ، وَيُقْصَدُ بِالتَّضامُنِ: تَعاوُنُ وَمُساندَةُ الدُّوَلِ بَعْضِها بَعْضًا لِما فيهِ مَصْلَحَتُها الْمُشْتَرَكَةُ، عَنْ طَريقِ الِاتِّفاقِيّاتِ الثُّنائِيَّةِ أَوِ الْجَماعِيَّةِ في شَتّى مَيادينِ التَّضامُنِ السِّياسِيَّةِ أَوِ الْعَسْكَرِيَّةِ أَوِ الثَّقافِيَّةِ. وَقَدْ عَبَّرَ الشَّيْخُ زايِدُ بْنُ سُلْطانَ آلِ نَهْيانَ — رَحِمَهُ اللهُ — عَنْ أَهَمِّيَّةِ تَحْقيقِ التَّضامُنِ الْعَرَبِيِّ وَكَيْفِيَّتِهِ بِقَوْلِهِ: «إِنَّ الْحَلَّ الْوَحيدَ لِلْخُروجِ مِنْ أَيِّ مَأْزِقٍ تَعيشُهُ الْأُمَّةُ الْعَرَبِيَّةُ يَكْمُنُ في تَحالُفِها وَاتِّحادِ كَلِمَتِها، وَتَوْحيدِ سِياساتِها، لِأَنَّ الْمَصيرَ واحِدٌ، وَالْهَدَفَ واحِدٌ».', 'ص 20–30', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('التَّضامُنُ الْعَرَبِيُّ هُوَ:','[{"id": "a", "text": "تَعاوُنُ وَمُساندَةُ الدُّوَلِ بَعْضِها بَعْضًا"}, {"id": "b", "text": "تَوْحيدُ الْعُمْلَةِ"}, {"id": "c", "text": "إِلْغاءُ الْحُدودِ"}]'),('مِنْ عَوامِلِ التَّضامُنِ الْعَرَبِيِّ:','[{"id": "a", "text": "اللُّغَةُ الْعَرَبِيَّةُ"}, {"id": "b", "text": "اخْتِلافُ الْمَصيرِ"}, {"id": "c", "text": "تَعَدُّدُ الْأَدْيانِ"}]'),('اسْتُخْدِمَ سِلاحُ النَّفْطِ لِصالِحِ الْقَضِيَّةِ الْعَرَبِيَّةِ في حَرْبِ:','[{"id": "a", "text": "أُكْتوبَرَ 1973 م"}, {"id": "b", "text": "يونْيو 1967 م"}, {"id": "c", "text": "الْخَليجِ 1991 م"}]'),('انْطَلَقَتْ عاصِفَةُ الْحَزْمِ عامَ:','[{"id": "a", "text": "2015 م"}, {"id": "b", "text": "2011 م"}, {"id": "c", "text": "1991 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y9-T1-L3', 'وَثيقَةُ «الْأُخُوَّةِ الْإِنْسانِيَّةِ» (دِراسَةٌ تَحْليلِيَّةٌ)', 3, 'ص 31–48', true, '🎯 أُناقِشُ أَهَمِّيَّةَ الْحِوارِ الْحَضارِيِّ وَالتَّعايُشِ السِّلْمِيِّ، وَأُقَدِّرُ الْقِيَمَ الْإِنْسانِيَّةَ في وَثيقَةِ الْأُخُوَّةِ الْإِنْسانِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ وَثيقَةَ الْأُخُوَّةِ الْإِنْسانِيَّةِ وَمَراحِلَها.',1),('أُقَدِّرُ الْقِيَمَ الْإِنْسانِيَّةَ الْوارِدَةَ في الْوَثيقَةِ.',2),('أَكْتَسِبُ مَهارَةَ دِراسَةِ الْوَثائِقِ وَتَحْليلِها مِنْ مَصادِرِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'وَثيقَةُ «الْأُخُوَّةِ الْإِنْسانِيَّةِ» (دِراسَةٌ تَحْليلِيَّةٌ)', 'وَثيقَةُ «الْأُخُوَّةِ الْإِنْسانِيَّةِ» وَثيقَةٌ عالَمِيَّةٌ، أَوْ إِعْلانٌ مُشْتَرَكٌ يُبْرِزُ النَّوايا الصّادِقَةَ مِنْ أَجْلِ دَعْوَةِ كُلِّ مَنْ يَحْمِلونَ في قُلوبِهِمْ إيمانًا بِاللهِ وَإيمانًا بِالْأُخُوَّةِ الْإِنْسانِيَّةِ أَنْ يَتَوَحَّدوا، وَيَعْمَلوا مَعًا مِنْ أَجْلِ أَنْ تُصْبِحَ هٰذِهِ الْوَثيقَةُ دَليلًا لِلْأَجْيالِ الْقادِمَةِ، يَأْخُذُهُمْ إِلى ثَقافَةِ الِاحْتِرامِ الْمُتَبادَلِ. وَقَدْ جَسَّدَ هٰذا التَّجَمُّعُ الْفِكْرِيُّ السُّمُوَّ الْأَخْلاقِيَّ وَالتَّسامُحَ وَاحْتِرامَ الْآخَرِ وَالتَّعايُشَ السِّلْمِيَّ لِإِقْرارِ الْوَثيقَةِ.', 'ص 31–48', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('وُقِّعَتْ وَثيقَةُ الْأُخُوَّةِ الْإِنْسانِيَّةِ في:','[{"id": "a", "text": "أَبوظَبي فَبْرايِرَ 2019 م"}, {"id": "b", "text": "روما 2021 م"}, {"id": "c", "text": "الْقاهِرَةِ 2015 م"}]'),('أَوَّلُ وَثيقَةٍ لِلتَّسامُحِ بَيْنَ الْأَدْيانِ هِيَ:','[{"id": "a", "text": "صَحيفَةُ الْمَدينَةِ"}, {"id": "b", "text": "وَثيقَةُ الْأُخُوَّةِ الْإِنْسانِيَّةِ"}, {"id": "c", "text": "مَعاهَدَةُ وِسْتْفالْيا"}]'),('التَّطَرُّفُ مُرادِفٌ لِـ:','[{"id": "a", "text": "الْغُلُوِّ وَالْفِكْرِ الْمُتَشَدِّدِ"}, {"id": "b", "text": "الِاعْتِدالِ"}, {"id": "c", "text": "التَّسامُحِ"}]'),('يُوافِقُ الْيَوْمُ الدَّوْلِيُّ لِحُقوقِ الْإِنْسانِ:','[{"id": "a", "text": "10 ديسَمْبِرَ"}, {"id": "b", "text": "7 إِبْريلَ"}, {"id": "c", "text": "21 مارِسَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y9-T1-L4', 'شَراكَةٌ إِماراتِيَّةٌ سُعودِيَّةٌ راسِخَةٌ', 3, 'ص 49–63', true, '🎯 أَسْتَخْلِصُ أُسُسَ الْعَلاقاتِ الْإِماراتِيَّةِ السُّعودِيَّةِ وَعَوامِلَها، وَأُوَضِّحُ نَماذِجَ الشَّراكَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَخْلِصُ أُسُسَ الْعَلاقاتِ الْأَخَوِيَّةِ بَيْنَ الدَّوْلَتَيْنِ.',1),('أَسْتَنْتِجُ عَوامِلَ الشَّراكَةِ بَيْنَ الْبَلَدَيْنِ.',2),('أُوَضِّحُ نَماذِجَ مِنَ الشَّراكَةِ في الْمَجالاتِ الِاقْتِصادِيَّةِ وَالْأَمْنِيَّةِ وَالسِّياسِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'شَراكَةٌ إِماراتِيَّةٌ سُعودِيَّةٌ راسِخَةٌ', 'تُعَدُّ الْعَلاقاتُ بَيْنَ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ وَالْمَمْلَكَةِ الْعَرَبِيَّةِ السُّعودِيَّةِ عَلاقاتٍ أُخُوَّةٍ مُتَمَيِّزَةً، خَطَتْ خَطَواتٍ اسْتِراتيجِيَّةً مُهِمَّةً خِلالَ الْعَقْدِ الْأَخيرِ، جَعَلَتْ مِنْها نَموذَجًا لِما يَجِبُ أَنْ تَكونَ عَلَيْهِ الْعَلاقاتُ بَيْنَ الدُّوَلِ الْعَرَبِيَّةِ كافَّةً، وَمِثالًا عَلَى الْوَعْيِ الْمُشْتَرَكِ بِطَبيعَةِ الْمُتَغَيِّراتِ الْإِقْليمِيَّةِ وَالدَّوْلِيَّةِ وَأَهَمِّيَّةِ التَّعامُلِ مَعَها بِسِياساتٍ وَمَواقِفَ مُنَسَّقَةٍ وَمُتَكامِلَةٍ وَحَكيمَةٍ. وَقَدْ تَمَّتْ تَرْجَمَتُها إِلى خَطَواتٍ مَلْموسَةٍ في جَميعِ الْمَجالاتِ السِّياسِيَّةِ وَالِاقْتِصادِيَّةِ وَالْأَمْنِيَّةِ وَالِاجْتِماعِيَّةِ.', 'ص 49–63', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('وُقِّعَ مَحْضَرُ إِنْشاءِ الْمَجْلِسِ التَّنْسيقِيِّ الْإِماراتِيِّ السُّعودِيِّ في:','[{"id": "a", "text": "مايو 2016 م"}, {"id": "b", "text": "يونْيو 2018 م"}, {"id": "c", "text": "ديسَمْبِرَ 1971 م"}]'),('أُعْلِنَ عَنِ «اسْتِراتيجِيَّةِ الْعَزْمِ» في مَدينَةِ:','[{"id": "a", "text": "جُدَّةَ"}, {"id": "b", "text": "أَبوظَبي"}, {"id": "c", "text": "الرِّياضِ"}]'),('عَدَدُ الْمَشاريعِ الَّتي تَضُمُّهَا اسْتِراتيجِيَّةُ الْعَزْمِ:','[{"id": "a", "text": "44 مَشْروعًا"}, {"id": "b", "text": "14 مَشْروعًا"}, {"id": "c", "text": "144 مَشْروعًا"}]'),('مِنَ الرَّوابِطِ الْمُشْتَرَكَةِ بَيْنَ الْبَلَدَيْنِ:','[{"id": "a", "text": "وَحْدَةُ الدّينِ وَاللُّغَةِ"}, {"id": "b", "text": "اخْتِلافُ الْعاداتِ"}, {"id": "c", "text": "تَبايُنُ الْمَصيرِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 1, 2, 'الْوَحْدَةُ الثّانِيَةُ: الْمَلامِحُ الطَّبيعِيَّةُ لِلْوَطَنِ الْعَرَبِيِّ — مَوْقِعٌ وَتَضاريسُ وَمَناخٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=1
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T1-L5', 'مَوْقِعُ الْوَطَنِ الْعَرَبِيِّ وَأَهَمِّيَّتُهُ', 3, 'ص 66–79', true, '🎯 أَتَعَرَّفُ الْوَطَنَ الْعَرَبِيَّ مِنْ حَيْثُ خَصائِصُهُ الْجُغْرافِيَّةُ، وَأُفَسِّرُ الْأَهَمِّيَّةَ الِاسْتِراتيجِيَّةَ لِمَوْقِعِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الْمَوْقِعَ الْجُغْرافِيَّ لِلْوَطَنِ الْعَرَبِيِّ وَمِساحَتَهُ.',1),('أُوَضِّحُ حُدودَ الْوَطَنِ الْعَرَبِيِّ وَأَنْواعَها.',2),('أُفَسِّرُ الْأَهَمِّيَّةَ الِاسْتِراتيجِيَّةَ لِلْمَكانِ وَما قَدْ يَنْتُجُ عَنْهُ مِنْ قَضايا.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'مَوْقِعُ الْوَطَنِ الْعَرَبِيِّ وَأَهَمِّيَّتُهُ', 'الْوَطَنُ الْعَرَبِيُّ هُوَ تِلْكَ الْمِساحَةُ مِنَ الْأَرْضِ الَّتي تَقَعُ في جَنوبِ غَرْبِ قارَّةِ آسْيا وَشَمالِ قارَّةِ أَفْريقْيا، مُمْتَدَّةً مِنَ الْمُحيطِ الْأَطْلَنْطِيِّ إِلَى الْخَليجِ الْعَرَبِيِّ وَبَحْرِ عُمانَ، تَجْمَعُ سُكّانَهُ رَوابِطُ وَمَصالِحُ مُشْتَرَكَةٌ، وَاكْتَسَبَ عَلى مَرِّ الْعُصورِ مَكانَةً بارِزَةً بَيْنَ دُوَلِ الْعالَمِ مِمّا جَعَلَهُ مِنْطَقَةَ الْتِقاءٍ وَاتِّصالٍ بَيْنَ قاراتِ الْعالَمِ وَدُوَلِهِ.', 'ص 66–79', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَمْتَدُّ الْوَطَنُ الْعَرَبِيُّ بَيْنَ دائِرَتَيْ عَرْضٍ:','[{"id": "a", "text": "2° جَنوبًا وَ37° شَمالًا"}, {"id": "b", "text": "17° غَرْبًا وَ60° شَرْقًا"}, {"id": "c", "text": "22° وَ26.5° شَمالًا"}]'),('نِسْبَةُ مِساحَةِ الْجَناحِ الْعَرَبِيِّ الْأَفْريقِيِّ:','[{"id": "a", "text": "71.1%"}, {"id": "b", "text": "90.9%"}, {"id": "c", "text": "28.9%"}]'),('مِنَ الْمَمَرّاتِ الْمائِيَّةِ الَّتي يَتَحَكَّمُ بِهَا الْوَطَنُ الْعَرَبِيُّ:','[{"id": "a", "text": "مَضيقُ هُرْمُزَ"}, {"id": "b", "text": "مَضيقُ جَبَلِ طارِقٍ فَقَطْ"}, {"id": "c", "text": "قَناةُ بَنَما"}]'),('الْحُدودُ الَّتي تُسايِرُ الظَّواهِرَ الْبَشَرِيَّةَ تَعْتَمِدُ عَلى:','[{"id": "a", "text": "التَّرْكيبِ اللُّغَوِيِّ وَالْعِرْقِ"}, {"id": "b", "text": "السَّلاسِلِ الْجَبَلِيَّةِ"}, {"id": "c", "text": "الْأَنْهارِ وَالْبُحَيْراتِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T1-L6', 'تَضاريسُ الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 80–89', true, '🎯 أَسْتَنْتِجُ الْعَوامِلَ الرَّئيسَةَ الَّتي أَسْهَمَتْ في تَشْكيلِ تَضاريسِ الْوَطَنِ الْعَرَبِيِّ، وَأُحَدِّدُ أَشْكالَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ الْعَوامِلَ الرَّئيسَةَ الَّتي أَسْهَمَتْ في تَشْكيلِ تَضاريسِ الْوَطَنِ الْعَرَبِيِّ.',1),('أُحَدِّدُ عَلى خَريطَةِ الْوَطَنِ الْعَرَبِيِّ أَشْكالَ التَّضاريسِ.',2),('أَتَعَرَّفُ الْخَصائِصَ وَالتَّحَدِّياتِ الَّتي تَفْرِضُها طَبيعَةُ الْوَطَنِ الْعَرَبِيِّ الْجُغْرافِيَّةُ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'تَضاريسُ الْوَطَنِ الْعَرَبِيِّ', 'لَعِبَتْ تَضاريسُ الْوَطَنِ الْعَرَبِيِّ دَوْرًا فاعِلًا في تاريخِهِ وَسُهولَةِ الِاتِّصالِ بَيْنَ أَجْزائِهِ وَمَناطِقِهِ، وَعَزَّزَتْ عَوامِلَ التَّكامُلِ الْجُغْرافِيِّ بَيْنَ جَناحَيْهِ، مِمّا كانَ لَهُ أَثَرٌ كَبيرٌ في حَياةِ وَتَوْزيعِ سُكّانِ الْوَطَنِ الْعَرَبِيِّ وَنُمُوِّهِمُ الْحَضارِيِّ وَتَوْجيهِ أَنْشِطَتِهِمْ.', 'ص 80–89', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَعْلى قِمَّةٍ في الْوَطَنِ الْعَرَبِيِّ هِيَ:','[{"id": "a", "text": "جَبَلُ طوبْقالَ 4165 م"}, {"id": "b", "text": "جَبَلُ النَّبِيِّ شُعَيْبٍ 3766 م"}, {"id": "c", "text": "جَبَلُ جيسٍ 1934 م"}]'),('مِنَ الْعَوامِلِ الْخارِجِيَّةِ الْمُشَكِّلَةِ لِلتَّضاريسِ:','[{"id": "a", "text": "الرِّياحُ وَالْمِياهُ"}, {"id": "b", "text": "الزَّلازِلُ وَالْبَراكينُ"}, {"id": "c", "text": "الْحَرَكاتُ الِالْتِوائِيَّةُ"}]'),('السُّهولُ الَّتي تَكَوَّنَتْ بِفِعْلِ الْإِرْساباتِ النَّهْرِيَّةِ هِيَ:','[{"id": "a", "text": "الْفَيَضِيَّةُ"}, {"id": "b", "text": "السّاحِلِيَّةُ"}, {"id": "c", "text": "الْهِضابُ"}]'),('تُشَكِّلُ جِبالُ دَوْلَةِ الْإِماراتِ مِنْ مِساحَتِها نَحْوَ:','[{"id": "a", "text": "2.8%"}, {"id": "b", "text": "28%"}, {"id": "c", "text": "80%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y9-T1-L7', 'الْمَناخُ وَالنَّباتُ الطَّبيعِيُّ في الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 90–99', true, '🎯 أُمَيِّزُ بَيْنَ الْخَصائِصِ الطَّبيعِيَّةِ وَالْبَشَرِيَّةِ، وَأُوَزِّعُ عَلَى الْخَريطَةِ الْأَقاليمَ الْمَناخِيَّةَ وَالنَّباتِيَّةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُمَيِّزُ بَيْنَ الْخَصائِصِ الطَّبيعِيَّةِ وَالْبَشَرِيَّةِ لِمَناطِقَ جُغْرافِيَّةٍ.',1),('أُوَزِّعُ عَلى خَريطَةِ الْوَطَنِ الْعَرَبِيِّ الْأَقاليمَ الْمَناخِيَّةَ وَالنَّباتِيَّةَ.',2),('أَصِفُ مَناخَ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ وَنَباتَها الطَّبيعِيَّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْمَناخُ وَالنَّباتُ الطَّبيعِيُّ في الْوَطَنِ الْعَرَبِيِّ', 'يَتَنَوَّعُ مَناخُ الْوَطَنِ الْعَرَبِيِّ وَنَباتُهُ الطَّبيعِيُّ وَيَخْتَلِفُ مِنْ مَكانٍ لِآخَرَ، لٰكِنَّ الصِّفَةَ الْبارِزَةَ لَهُ هِيَ ارْتِفاعُ دَرَجاتِ الْحَرارَةِ وَسَيْطَرَةُ الْجَفافِ، حَيْثُ يَسودُ الْمَناخُ الْمَدارِيُّ الصَّحْراوِيُّ الْحارُّ مَساحاتٍ واسِعَةً وَسَطَ الْوَطَنِ الْعَرَبِيِّ.', 'ص 90–99', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مِنْ عَناصِرِ الْمَناخِ:','[{"id": "a", "text": "دَرَجَةُ الْحَرارَةِ وَالرِّياحُ وَالْأَمْطارُ"}, {"id": "b", "text": "التَّضاريسُ وَالْمَوْقِعُ"}, {"id": "c", "text": "النَّخيلُ وَالْغافُ"}]'),('تَسودُ حَشائِشُ السّافانا في الْإِقْليمِ:','[{"id": "a", "text": "الْمَدارِيِّ"}, {"id": "b", "text": "الصَّحْراوِيِّ الْحارِّ"}, {"id": "c", "text": "إِقْليمِ الْبَحْرِ الْمُتَوَسِّطِ"}]'),('مِنَ الرِّياحِ الْمَحَلِّيَّةِ في الْوَطَنِ الْعَرَبِيِّ:','[{"id": "a", "text": "الْخَماسينُ"}, {"id": "b", "text": "الرِّياحُ التِّجارِيَّةُ"}, {"id": "c", "text": "الرِّياحُ الْعَكْسِيَّةُ"}]'),('مِنَ النَّباتاتِ الْمُعَمَّرَةِ:','[{"id": "a", "text": "النَّخيلُ وَالْغافُ"}, {"id": "b", "text": "الْخُبّازُ وَالْحُمَّيْضُ"}, {"id": "c", "text": "الْبَلّوطُ وَالْأَرْزُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 1, 3, 'الْوَحْدَةُ الثّالِثَةُ: تاريخُ الْوَطَنِ الْعَرَبِيِّ الْحَديثُ وَالْمُعاصِرُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=1
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T1-L8', 'قِيامُ الدَّوْلَةِ الْعُثْمانِيَّةِ', 3, 'ص 102–110', true, '🎯 أُناقِشُ مَجْرَياتِ الْأَحْداثِ في فَتْرَةِ التَّوَسُّعِ الْعُثْمانِيِّ، وَأَتَعَرَّفُ أَوْضاعَ الْوَطَنِ الْعَرَبِيِّ قَبْلَهُ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ نَشْأَةَ الدَّوْلَةِ الْعُثْمانِيَّةِ وَتَوَسُّعَها.',1),('أَتَعَرَّفُ أَوْضاعَ الْوَطَنِ الْعَرَبِيِّ قَبْلَ التَّوَسُّعِ الْعُثْمانِيِّ.',2),('أُحَلِّلُ الْأَطْماعَ الِاسْتِعْمارِيَّةَ لِلْعُثْمانِيّينَ في الْبِلادِ الْعَرَبِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'قِيامُ الدَّوْلَةِ الْعُثْمانِيَّةِ', 'يَنْتَسِبُ الْعُثْمانِيّونَ إِلى إِحْدَى الْقَبائِلِ التُّرْكِيَّةِ، الَّتي هاجَرَتْ مِنْ أَواسِطِ آسْيا في الْقَرْنِ الثّالِثَ عَشَرَ الْميلادِيِّ، وَتَحَوَّلوا في عَهْدِ عُثْمانَ بْنِ أَرْطُغْرُلَ إِلى قُوًى تَوَسُّعِيَّةٍ كُبْرى، امْتَدَّتْ أَراضيها إِلى آسْيا الصُّغْرى، وَالْبَلْقانِ وَوَصَلَتْ جُيوشُهُمْ أَبْوابَ فيينا عاصِمَةِ النِّمْسا، وَضَمّوا الْبِلادَ الْعَرَبِيَّةَ.', 'ص 102–110', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَنْتَسِبُ الْأَتْراكُ الْعُثْمانِيّونَ إِلى إِحْدى قَبائِلِ:','[{"id": "a", "text": "الْغُزِّ التُّرْكِيَّةِ"}, {"id": "b", "text": "الْمَغولِ"}, {"id": "c", "text": "السَّلاجِقَةِ"}]'),('الْعاصِمَةُ الَّتي اتَّخَذَهَا الْعُثْمانِيّونَ ابْتِداءً مِنْ سَنَةِ 1366 م:','[{"id": "a", "text": "أَدْرَنَةُ"}, {"id": "b", "text": "بورْصَةُ"}, {"id": "c", "text": "قَرَهْ حِصارُ"}]'),('عاصَرَتِ الدَّوْلَةَ الْعُثْمانِيَّةَ دَوْلَتانِ إِسْلامِيَّتانِ هُما:','[{"id": "a", "text": "الصَّفَوِيَّةُ وَالْمَماليكُ"}, {"id": "b", "text": "الْبيزَنْطِيَّةُ وَالصَّفَوِيَّةُ"}, {"id": "c", "text": "الْمَماليكُ وَالْبُرْتُغالُ"}]'),('مِنْ أَوْضاعِ الْوَطَنِ الْعَرَبِيِّ قُبَيْلَ التَّوَسُّعِ الْعُثْمانِيِّ:','[{"id": "a", "text": "تَجْزِئَتُهُ إِلى دُوَيْلاتٍ مُتَناحِرَةٍ"}, {"id": "b", "text": "قُوَّةُ اقْتِصادِهِ"}, {"id": "c", "text": "ازْدِهارُ تِجارَتِهِ الْبَحْرِيَّةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T1-L9', 'الِاسْتِعْمارُ الْأوروبِّيُّ في الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 111–122', true, '🎯 أُحَلِّلُ الِاسْتِعْمارَ الْأوروبِّيَّ لِدُوَلِ الْوَطَنِ الْعَرَبِيِّ، وَأُناقِشُ التَّطَوُّرَ التّاريخِيَّ لِحَرَكاتِ التَّحَرُّرِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَلِّلُ الِاسْتِعْمارَ الْأوروبِّيَّ لِدُوَلِ الْوَطَنِ الْعَرَبِيِّ وَأَشْكالَهُ.',1),('أَسْتَنْتِجُ دَوافِعَ الِاسْتِعْمارِ الْأوروبِّيِّ في الْوَطَنِ الْعَرَبِيِّ.',2),('أَتَعَرَّفُ الِاسْتِعْمارَ الْبُرْتُغالِيَّ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الِاسْتِعْمارُ الْأوروبِّيُّ في الْوَطَنِ الْعَرَبِيِّ', 'تَزامَنَ ظُهورُ الِاسْتِعْمارِ الْحَديثِ مَعَ بِدايَةِ الْكُشوفِ الْجُغْرافِيَّةِ، حَيْثُ تَسابَقَتِ الدُّوَلُ الِاسْتِعْمارِيَّةُ الْأوروبِّيَّةُ فيما بَيْنَها لِفَرْضِ سَيْطَرَتِها عَلَى الْبِلادِ الْمُكْتَشَفَةِ، وَاحْتِلالِها بِالْقُوَّةِ الْمُسَلَّحَةِ، وَبَعْدَ الْحَرْبِ الْعالَمِيَّةِ الثّانِيَةِ أَخَذَ الِاسْتِعْمارُ شَكْلًا مُغايِرًا عَمّا كانَ عَلَيْهِ، مِنْ غَيْرِ أَنْ يَطْرَأَ أَيُّ تَغْييرٍ عَلى أَهْدافِهِ.', 'ص 111–122', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الِاسْتِعْمارُ هُوَ:','[{"id": "a", "text": "سَيْطَرَةُ دَوْلَةٍ قَوِيَّةٍ عَلى أُخْرى ضَعيفَةٍ"}, {"id": "b", "text": "تَبادُلٌ تِجارِيٌّ"}, {"id": "c", "text": "تَعاوُنٌ ثَقافِيٌّ"}]'),('مِنْ أَمْثِلَةِ الِاسْتيطانِ:','[{"id": "a", "text": "الِاحْتِلالُ الْإيطالِيُّ لِليبْيا"}, {"id": "b", "text": "الِانْتِدابُ الْفَرَنْسِيُّ عَلى سورِيا"}, {"id": "c", "text": "احْتِلالُ بِريطانْيا لِمِصْرَ"}]'),('أَسْوَأُ مُسْتَعْمِرٍ بُرْتُغالِيٍّ عَرَفَتْهُ الْمِنْطَقَةُ:','[{"id": "a", "text": "أَلْفونْسو دي البوكيرْك"}, {"id": "b", "text": "فْرانْسيسْكو دي الْميدا"}, {"id": "c", "text": "ڤاسْكو دي چاما"}]'),('مِنْ دَوافِعِ الِاسْتِعْمارِ الْأوروبِّيِّ:','[{"id": "a", "text": "ضَعْفُ الدَّوْلَةِ الْعُثْمانِيَّةِ"}, {"id": "b", "text": "قُوَّةُ الْوَحْدَةِ الْعَرَبِيَّةِ"}, {"id": "c", "text": "قِلَّةُ ثَرَواتِ الْوَطَنِ الْعَرَبِيِّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 1, 4, 'الْوَحْدَةُ الرّابِعَةُ: قَضايا اقْتِصادِيَّةٌ — تِجارَةٌ دَوْلِيَّةٌ وَتَكَتُّلاتٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=1
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T1-L10', 'التِّجارَةُ الدَّوْلِيَّةُ', 3, 'ص 125–136', true, '🎯 أُفَسِّرُ قِيامَ التِّجارَةِ الدَّوْلِيَّةِ وَظاهِرَةَ التَّخَصُّصِ، وَأُناقِشُ صُوَرَ التَّبادُلِ التِّجارِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ قِيامَ التِّجارَةِ الدَّوْلِيَّةِ وَظاهِرَةَ التَّخَصُّصِ.',1),('أُناقِشُ صُوَرَ التَّبادُلِ التِّجارِيِّ.',2),('أَسْتَنْتِجُ صِفاتِ التِّجارَةِ الْإِلِكْتْرونِيَّةِ وَأَشْكالَها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'التِّجارَةُ الدَّوْلِيَّةُ', 'تَتَخَصَّصُ الدُّوَلُ في إِنْتاجِ بَعْضِ السِّلَعِ وَالْخَدَماتِ الَّتي تُؤَهِّلُها ظُروفُهَا الطَّبيعِيَّةُ وَالْبَشَرِيَّةُ لِإِنْتاجِها، وَمِنْ ثَمَّ تَبادُلُها بِمُنْتَجاتِ دَوْلَةٍ أُخْرى لا تَسْتَطيعُ إِنْتاجَها إِمّا لِعَدَمِ تَوَفُّرِ ظُروفِ إِنْتاجِها أَوْ لِارْتِفاعِ تَكْلِفَةِ الْإِنْتاجِ فيها، فَأَيُّ دَوْلَةٍ لا تَسْتَطيعُ أَنْ تَعيشَ بِعُزْلَةٍ عَنِ الدُّوَلِ الْأُخْرى لِتَعَذُّرِ إِنْتاجِ كُلِّ ما تَحْتاجُ إِلَيْهِ مِنَ السِّلَعِ وَالْخَدَماتِ لِسَدِّ حاجاتِهَا الْمُتَعَدِّدَةِ وَالْمُتَزايِدَةِ.', 'ص 125–136', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('التِّجارَةُ الدَّوْلِيَّةُ هِيَ:','[{"id": "a", "text": "تَبادُلُ السِّلَعِ وَالْخَدَماتِ عَبْرَ الْحُدودِ الدَّوْلِيَّةِ"}, {"id": "b", "text": "تَبادُلُها داخِلَ الدَّوْلَةِ الْواحِدَةِ"}, {"id": "c", "text": "إِنْتاجُ السِّلَعِ مَحَلِّيًّا"}]'),('مِنْ مَزايَا التِّجارَةِ الدّاخِلِيَّةِ:','[{"id": "a", "text": "وَحْدَةُ النِّظامِ النَّقْدِيِّ"}, {"id": "b", "text": "اخْتِلافُ الْقَوانينِ"}, {"id": "c", "text": "ارْتِفاعُ الرُّسومِ الْجُمْرُكِيَّةِ"}]'),('الْخَدَماتُ الَّتي تُؤَدّى لِلْغَيْرِ تُسَمّى:','[{"id": "a", "text": "الصّادِراتِ غَيْرَ الْمَنْظورَةِ"}, {"id": "b", "text": "الْوارِداتِ غَيْرَ الْمَنْظورَةِ"}, {"id": "c", "text": "الْبَضائِعَ الدَّوْلِيَّةَ"}]'),('مِنْ عَوامِلِ التَّخَصُّصِ في الْإِنْتاجِ:','[{"id": "a", "text": "اخْتِلافُ تَوْزيعِ الْمَوارِدِ الطَّبيعِيَّةِ"}, {"id": "b", "text": "وَحْدَةُ الْعُمْلَةِ"}, {"id": "c", "text": "قِلَّةُ التَّكاليفِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=1
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T1-L11', 'التَّكَتُّلاتُ الِاقْتِصادِيَّةُ', 3, 'ص 137–146', true, '🎯 أُوَضِّحُ دَوْرَ التَّكَتُّلاتِ الِاقْتِصادِيَّةِ في مُواجَهَةِ الْمُشْكِلاتِ الِاقْتِصادِيَّةِ الْعالَمِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَفْهومَ التَّكَتُّلاتِ الِاقْتِصادِيَّةِ وَأَهَمِّيَّتَها.',1),('أُوَضِّحُ أَشْكالَ التَّكَتُّلاتِ الِاقْتِصادِيَّةِ.',2),('أُناقِشُ نَماذِجَ مِنَ التَّكَتُّلاتِ الِاقْتِصادِيَّةِ وَأَثَرَها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'التَّكَتُّلاتُ الِاقْتِصادِيَّةُ', 'التَّكَتُّلُ الِاقْتِصادِيُّ شَكْلٌ مِنْ أَشْكالِ التَّكامُلِ الِاقْتِصادِيِّ بَيْنَ مَجْموعَةٍ مِنَ الدُّوَلِ الْمُتَجانِسَةِ لِتَحْقيقِ مَصْلَحَةٍ اقْتِصادِيَّةٍ مُشْتَرَكَةٍ وَدَرَجَةِ رِبْحٍ عالِيَةٍ لِلدُّوَلِ الْأَعْضاءِ، وَيُمْكِنُ اعْتِبارُ التَّكَتُّلاتِ الِاقْتِصادِيَّةِ كَأَحَدِ النَّماذِجِ التَّنْمَوِيَّةِ تَتَّخِذُها مَجْموعَةٌ مِنَ الدُّوَلِ الَّتي تَدْخُلُ في اتِّفاقٍ فيما بَيْنَها، مِنْ خِلالِ تَنْسيقِ السِّياساتِ الِاقْتِصادِيَّةِ في جَوانِبِهَا الْمُخْتَلِفَةِ وَإِلْغاءِ الْحَواجِزِ الْجُمْرُكِيَّةِ بُغْيَةَ تَحْقيقِ مُعَدَّلاتِ نُمُوٍّ سَريعَةٍ في اقْتِصادِها.', 'ص 137–146', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T1-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('ظَهَرَتِ التَّكَتُّلاتُ الِاقْتِصادِيَّةُ بَعْدَ:','[{"id": "a", "text": "الْحَرْبِ الْعالَمِيَّةِ الثّانِيَةِ 1945 م"}, {"id": "b", "text": "الْحَرْبِ الْعالَمِيَّةِ الْأولى"}, {"id": "c", "text": "الْكُشوفِ الْجُغْرافِيَّةِ"}]'),('مِنْ أَشْكالِ التَّكَتُّلاتِ الِاقْتِصادِيَّةِ:','[{"id": "a", "text": "السّوقُ الْمُشْتَرَكَةُ"}, {"id": "b", "text": "التِّجارَةُ الدّاخِلِيَّةُ"}, {"id": "c", "text": "الصّادِراتُ غَيْرُ الْمَنْظورَةِ"}]'),('أُقِرَّتِ الِاتِّفاقِيَّةُ الِاقْتِصادِيَّةُ الْموَحَّدَةُ لِدُوَلِ الْخَليجِ في:','[{"id": "a", "text": "الرِّياضِ عامَ 1981 م"}, {"id": "b", "text": "أَبوظَبي عامَ 1981 م"}, {"id": "c", "text": "جُدَّةَ عامَ 1991 م"}]'),('وُقِّعَتْ مُعاهَدَةُ (ماسْتْريخْتَ) عامَ:','[{"id": "a", "text": "1991 م"}, {"id": "b", "text": "2002 م"}, {"id": "c", "text": "1945 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;