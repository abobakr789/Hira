begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 1, 1, 'الْوَحْدَةُ الْأولى: نَهْجُ زايِدٍ الْأَخْلاقِيُّ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=1
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T1-L1', 'الرُّؤْيَةُ الْأولى: الْبَراعَةُ السِّياسِيَّةُ — حاكِمًا لِلْعَيْنِ ثُمَّ لِأَبوظَبِيَ', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 13–22', true, '🎯 أَتَعَرَّفُ الْجُهودَ الَّتي بَذَلَها الشَّيْخُ زايِدٌ في الْمِنْطَقَةِ الشَّرْقِيَّةِ، وَأُحَلِّلُ رُؤْيَتَهُ مُنْذُ بِدايَةِ حُكْمِهِ إِمارَةَ أَبوظَبِي.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الْجُهودَ الْمُضْنِيَةَ الَّتي بَذَلَها الشَّيْخُ زايِدٌ في الْمِنْطَقَةِ الشَّرْقِيَّةِ 1946–1966م.',1),('أُحَلِّلُ رُؤْيَةَ الشَّيْخِ زايِدٍ وَجُهودَهُ مُنْذُ بِدايَةِ حُكْمِهِ إِمارَةَ أَبوظَبِي في أُغُسْطُسَ 1966م.',2),('أَسْتَنْتِجُ وَمَضاتٍ وَمَواقِفَ مِنْ حَياةِ الشَّيْخِ زايِدٍ وَنَظْرَتِهِ لِلتُّراثِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْبَراعَةُ السِّياسِيَّةُ — حاكِمًا لِلْعَيْنِ ثُمَّ لِأَبوظَبِيَ', 'سَلَّمَ كُلَّ رَبِّ عائِلَةٍ مَبْلَغًا وَقالَ: «اصْرِفوهُ بِحَقِّ اللهِ عَلى عِيالِكُمْ»؛ وَقَدْ أَعْطى لِأَبْناءِ شَعْبِهِ قُرابَةَ عِشْرينَ مِلْيونَ دولارٍ في أُسْبوعَيْنِ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 18)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 13–22', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَمَّتْ تَسْمِيَةُ الشَّيْخِ زايِدٍ مُمَثِّلًا لِلْحاكِمِ في الْمِنْطَقَةِ الشَّرْقِيَّةِ عامَ:','[{"id": "a", "text": "1946م"}, {"id": "b", "text": "1962م"}, {"id": "c", "text": "1971م"}]'),('انْتَقَلَ الشَّيْخُ زايِدٌ إِلى أَبوظَبِي حاكِمًا في:','[{"id": "a", "text": "أُغُسْطُسَ 1966م"}, {"id": "b", "text": "ديسَمْبَرَ 1971م"}, {"id": "c", "text": "فِبْرايِرَ 1968م"}]'),('بَدَأَ تَصْديرُ النِّفْطِ مِنْ أَبوظَبِي عامَ:','[{"id": "a", "text": "1962م"}, {"id": "b", "text": "1946م"}, {"id": "c", "text": "1976م"}]'),('قَلْعَةُ الْمُوَيْجِعي تَقَعُ في مَدينَةِ:','[{"id": "a", "text": "الْعَيْنِ"}, {"id": "b", "text": "أَبوظَبِي"}, {"id": "c", "text": "دُبَيَّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T1-L2', 'الرُّؤْيَةُ الثّانِيَةُ: الثّاني مِنْ ديسَمْبَرَ 1971م — الصَّفْحَةُ الْمُشْرِقَةُ الْأولى', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 23–40', true, '🎯 أُحَدِّدُ خُطُواتِ قِيامِ اتِّحادِ دَوْلَةِ الْإِماراتِ، وَأُحَلِّلُ الْقَراراتِ الِاتِّحادِيَّةَ الصّادِرَةَ عَنِ الِاجْتِماعِ الْأَوَّلِ لِلْمَجْلِسِ الْأَعْلى.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الظُّروفَ وَالْعَوامِلَ الَّتي عَجَّلَتْ بِالدَّعْوَةِ لِقِيامِ اتِّحادٍ تُساعِيٍّ.',1),('أُحَدِّدُ خُطُواتِ قِيامِ اتِّحادِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',2),('أُحَلِّلُ الْقَراراتِ الِاتِّحادِيَّةَ الصّادِرَةَ عَنِ الِاجْتِماعِ الْأَوَّلِ لِلْمَجْلِسِ الْأَعْلى.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الثّاني مِنْ ديسَمْبَرَ 1971م — الصَّفْحَةُ الْمُشْرِقَةُ الْأولى', 'وَإِذْ نَزُفُّ الْبُشْرى السّارَّةَ إِلَى الشَّعْبِ الْعَرَبِيِّ نَرْجو مِنَ اللهِ تَعالى أَنْ يَكونَ هٰذا الِاتِّحادُ نَواةً لِاتِّحادٍ شامِلٍ يَضُمُّ باقِيَ أَفْرادِ الْأُسْرَةِ مِنَ الْإِماراتِ الشَّقيقَةِ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 29)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 23–40', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْتَقى الشَّيْخُ زايِدٌ وَالشَّيْخُ راشِدٌ في 18 فِبْرايِرَ 1968م في:','[{"id": "a", "text": "عَرْقوبِ السَّديرَةِ"}, {"id": "b", "text": "قَلْعَةِ الْحِصْنِ"}, {"id": "c", "text": "دارِ الضِّيافَةِ"}]'),('اسْتَغْرَقَتْ مَسيرَةُ الِاتِّحادِ:','[{"id": "a", "text": "1384 يَوْمًا"}, {"id": "b", "text": "365 يَوْمًا"}, {"id": "c", "text": "700 يَوْمٍ"}]'),('أَعْلَنَ بَيانَ الِاجْتِماعِ التّاريخِيِّ في دُبَيَّ مَعالي:','[{"id": "a", "text": "أَحْمَدُ خَليفَةَ السُّوَيْديُّ"}, {"id": "b", "text": "عَدْنانُ الْباجَه جي"}, {"id": "c", "text": "مُحَمَّدُ حَبْروش"}]'),('أَصْبَحَتِ الْإِماراتُ في جامِعَةِ الدُّوَلِ الْعَرَبِيَّةِ الْعُضْوَ:','[{"id": "a", "text": "الثّامِنَ عَشَرَ"}, {"id": "b", "text": "الثّاني وَالثَّلاثينَ بَعْدَ الْمِئَةِ"}, {"id": "c", "text": "السّابِعَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T1-L3', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُبادِرُ في تَأْسيسِ مَجْلِسِ التَّعاوُنِ الْخَليجِيِّ', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 43–52', true, '🎯 أُناقِشُ جُهودَ الشَّيْخِ زايِدٍ في قِيامِ مَجْلِسِ التَّعاوُنِ الْخَليجِيِّ، وَأُحَدِّدُ الدُّوَلَ الْأَعْضاءَ عَلَى الْخَريطَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ أُولى الْخُطُواتِ الَّتي قامَ بِهَا الشَّيْخُ زايِدٌ قَبْلَ قِيامِ الْمَجْلِسِ بِخَمْسِ سَنَواتٍ.',1),('أُناقِشُ جُهودَ الشَّيْخِ زايِدٍ في قِيامِ مَجْلِسِ التَّعاوُنِ الْخَليجِيِّ.',2),('أُحَدِّدُ عَلى خَريطَةِ شِبْهِ الْجَزيرَةِ الْعَرَبِيَّةِ الدُّوَلَ الْأَعْضاءَ في الْمَجْلِسِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُبادِرُ في تَأْسيسِ مَجْلِسِ التَّعاوُنِ الْخَليجِيِّ', 'إِنَّني عَلى أَمَلٍ كَبيرٍ في أَنْ يَنْجَحَ هٰذا الْمُؤْتَمَرُ، وَأَنْ يَتَطَوَّرَ مَجْلِسُ التَّعاوُنِ الْخَليجِيِّ لِيُصْبِحَ مُنَظَّمَةً فَعّالَةً وَمُنْتِجَةً تَسْتَفيدُ مِنْها كُلُّ دَوْلَةٍ مِنْ دُوَلِنَا السِّتِّ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 48)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 43–52', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُعْلِنَ قِيامُ مَجْلِسِ التَّعاوُنِ الْخَليجِيِّ في:','[{"id": "a", "text": "25 مايو 1981م"}, {"id": "b", "text": "2 ديسَمْبَرَ 1971م"}, {"id": "c", "text": "18 فِبْرايِرَ 1968م"}]'),('كانَ اللِّقاءُ الْأَوَّلُ لِنَحْتِ التَّعاوُنِ الْخَليجِيِّ عامَ:','[{"id": "a", "text": "1976م"}, {"id": "b", "text": "1980م"}, {"id": "c", "text": "1983م"}]'),('تَشَكَّلَتْ قُوَّةُ دِرْعِ الْجَزيرَةِ ابْتِداءً مِنْ عامِ:','[{"id": "a", "text": "1983م"}, {"id": "b", "text": "1971م"}, {"id": "c", "text": "1990م"}]'),('عَدَدُ الدُّوَلِ الْأَعْضاءِ في مَجْلِسِ التَّعاوُنِ:','[{"id": "a", "text": "سِتٌّ"}, {"id": "b", "text": "سَبْعٌ"}, {"id": "c", "text": "تِسْعٌ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T1-L4', 'الرُّؤْيَةُ الرّابِعَةُ: إِطْلالاتٌ شامِخَةٌ في أَحْداثٍ عاشَها الْوَطَنُ الْعَرَبِيُّ', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 55–76', true, '🎯 أُوَضِّحُ السِّماتِ الَّتي أَعْطَتِ الشَّيْخَ زايِدًا لَقَبَ «الرَّجُلِ الَّذي صَنَعَ التّاريخَ»، وَأَعْتَزُّ بِمَواقِفِهِ خَليجِيًّا وَعَرَبِيًّا.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ السِّماتِ الَّتي أَعْطَتِ الشَّيْخَ زايِدًا لَقَبَ «الرَّجُلِ الَّذي صَنَعَ التّاريخَ».',1),('أَكْتَسِبُ مَهارَةَ قِراءَةِ الْخَرائِطِ وَأُحَدِّدُ عَلَيْها الْمَواقِعَ ذاتَ الْعَلاقَةِ بِمَواقِفِهِ.',2),('أُقَدِّرُ النَّهْجَ الْأَخْلاقِيَّ وَالسِّياسِيَّ الَّذي اتَّبَعَهُ خَليجِيًّا وَعَرَبِيًّا.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: إِطْلالاتٌ شامِخَةٌ في أَحْداثٍ عاشَها الْوَطَنُ الْعَرَبِيُّ', 'لَيْسَ الْبِتْرولُ الْعَرَبِيُّ بِأَغْلى مِنَ الدَّمِ الْعَرَبِيِّ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 67)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 55–76', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَلِمَ الشَّيْخُ زايِدٌ بِخَبَرِ غَزْوِ الْكُوَيْتِ وَهُوَ في:','[{"id": "a", "text": "الْإِسْكَنْدَرِيَّةِ"}, {"id": "b", "text": "لَنْدَنَ"}, {"id": "c", "text": "جُدَّةَ"}]'),('قالَ الشَّيْخُ زايِدٌ: «لَيْسَ الْبِتْرولُ الْعَرَبِيُّ بِأَغْلى مِنَ…»:','[{"id": "a", "text": "الدَّمِ الْعَرَبِيِّ"}, {"id": "b", "text": "الْمالِ الْعَرَبِيِّ"}, {"id": "c", "text": "الْأَرْضِ الْعَرَبِيَّةِ"}]'),('شارَكَتْ قُوّاتُ الْإِماراتِ بِقُوّاتِ الرَّدْعِ الْعَرَبِيَّةِ في لُبْنانَ مِنْ:','[{"id": "a", "text": "1976م إِلى 1979م"}, {"id": "b", "text": "1973م إِلى 1976م"}, {"id": "c", "text": "1990م إِلى 1991م"}]'),('قَرَّرَ قَطْعَ النَّفْطِ عَنِ الْوِلاياتِ الْمُتَّحِدَةِ في:','[{"id": "a", "text": "16 أُكْتوبَرَ 1973م"}, {"id": "b", "text": "2 أُغُسْطُسَ 1990م"}, {"id": "c", "text": "25 مايو 1981م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y11-T1-L5', 'الرُّؤْيَةُ الْخامِسَةُ: وَقَفاتٌ في النِّزاعاتِ إِحْقاقًا لِلْحَقِّ وَالْعَدالَةِ', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 79–86', true, '🎯 أَسْتَنْتِجُ الْجُذورَ الْأَصيلَةَ لِمَنْهَجِ الشَّيْخِ زايِدٍ في حَلِّ النِّزاعاتِ وَإِصْلاحِ ذاتِ الْبَيْنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ الْجُذورَ الْأَصيلَةَ لِلشَّيْخِ زايِدٍ في حَلِّ النِّزاعاتِ وَإِصْلاحِ ذاتِ الْبَيْنِ.',1),('أُحَلِّلُ مَوْقِفَ الشَّيْخِ زايِدٍ حَوْلَ الْعاصِمَةِ الْإِماراتِيَّةِ الْمُقْتَرَحَةِ لِلِاتِّحادِ.',2),('أُناقِشُ مُتابَعَةَ الشَّيْخِ زايِدٍ لِلْقَضايا وَالْأَحْداثِ الْعَرَبِيَّةِ ضَمانًا لِتَحْقيقِ الْهَدَفِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْخامِسَةُ: وَقَفاتٌ في النِّزاعاتِ إِحْقاقًا لِلْحَقِّ وَالْعَدالَةِ', 'لَقَدْ أَصْبَحْنا جَسَدًا واحِدًا، وَإِذا ما أَعْطَتِ الْيَدُ الْيُمْنى شَيْئًا لِلْيَدِ الْيُسْرى،… ما ضاعَ شَيْءٌ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 85)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 79–86', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْحَدُّ التَّحَرِّيُّ مِنْطَقَةٌ تَمْتَدُّ عَلَى السّاحِلِ بِـ:','[{"id": "a", "text": "عَشَرَةِ كيلومِتْراتٍ"}, {"id": "b", "text": "مِئَةِ كيلومِتْرٍ"}, {"id": "c", "text": "كيلومِتْرٍ واحِدٍ"}]'),('رَأى الشَّيْخُ زايِدٌ أَنَّ مِلْياراتِ الْعاصِمَةِ الْمُقْتَرَحَةِ تُنْفَقُ في:','[{"id": "a", "text": "مَشاريعَ وَمَزارِعَ وَمَصانِعَ"}, {"id": "b", "text": "قُصورٍ جَديدَةٍ"}, {"id": "c", "text": "مَصارِفَ خارِجِيَّةٍ"}]'),('احْتَوى الشَّيْخُ زايِدٌ الْخِلافَ بَيْنَ مِصْرَ وَلِيبِيا عامَ:','[{"id": "a", "text": "1974م"}, {"id": "b", "text": "1987م"}, {"id": "c", "text": "1991م"}]'),('مُشْكِلَةُ «حَلايِبَ» الْحُدودِيَّةُ بَيْنَ:','[{"id": "a", "text": "مِصْرَ وَالسّودانِ"}, {"id": "b", "text": "الْمَغْرِبِ وَالْجَزائِرِ"}, {"id": "c", "text": "الْيَمَنِ وَعُمانَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'SS-Y11-T1-L6', 'الرُّؤْيَةُ السّادِسَةُ: تَعْزيزُ مَسيرَةِ الِاتِّحادِ في مَجالاتٍ حَيَوِيَّةٍ', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 89–100', true, '🎯 أُناقِشُ جُهودَ الشَّيْخِ زايِدٍ في تَوْفيرِ مُتَطَلَّباتِ الْحَياةِ وَفي تَوْحيدِ الْقُوّاتِ الْمُسَلَّحَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الْجُهودَ الَّتي بَذَلَها الشَّيْخُ زايِدٌ لِتَوْفيرِ مُتَطَلَّباتِ الْحَياةِ كافَّةً.',1),('أُناقِشُ جُهودَهُ وَإِخْوانِهِ في تَوْحيدِ الْقُوّاتِ الْمُسَلَّحَةِ وَإِقامَةِ الْمُؤَسَّساتِ الْعَسْكَرِيَّةِ.',2),('أُحَلِّلُ دَوْرَ الْقُوّاتِ الْمُسَلَّحَةِ الْإِماراتِيَّةِ وَإِسْهاماتِها الْخارِجِيَّةَ مَيْدانِيًّا وَإِنْسانِيًّا.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ السّادِسَةُ: تَعْزيزُ مَسيرَةِ الِاتِّحادِ في مَجالاتٍ حَيَوِيَّةٍ', 'إِنَّنا دَوْلَةٌ تَسْعى إِلَى السَّلامِ، وَتَحْتَرِمُ حَقَّ الْجِوارِ، وَتَرْعى الصَّديقَ، لٰكِنَّنا بِحاجَةٍ لِجَيْشٍ قَوِيٍّ قادِرٍ عَلى حِمايَةِ الْبِلادِ لِتَبْقى قائِمَةً وَمُسْتَقِرَّةً. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 92)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 89–100', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('صَدَرَ قَرارُ تَوْحيدِ الْقُوّاتِ الْمُسَلَّحَةِ في:','[{"id": "a", "text": "6 مايو 1976م"}, {"id": "b", "text": "2 ديسَمْبَرَ 1971م"}, {"id": "c", "text": "25 مايو 1981م"}]'),('عَدَدُ الْمَساكِنِ الشَّعْبِيَّةِ الَّتي طُلِبَتْ في رَأْسِ الْخَيْمَةِ:','[{"id": "a", "text": "8000"}, {"id": "b", "text": "5000"}, {"id": "c", "text": "500"}]'),('الْتَقى وَزيرُ الدِّفاعِ بِالشَّيْخِ زايِدٍ قَبْلَ الْقَرارِ في مِنْطَقَةِ:','[{"id": "a", "text": "مَلاقِطَ في الْعَيْنِ"}, {"id": "b", "text": "جَزيرَةِ زَرْكوهَ"}, {"id": "c", "text": "أَبوظَبِي"}]'),('مِنْ إِسْهاماتِ قُوّاتِنَا الْمُسَلَّحَةِ الْخارِجِيَّةِ:','[{"id": "a", "text": "نَزْعُ الْأَلْغامِ في لُبْنانَ"}, {"id": "b", "text": "بِناءُ الْمَطاراتِ"}, {"id": "c", "text": "تَوْحيدُ الْعُمْلَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 7, 'SS-Y11-T1-L7', 'الرُّؤْيَةُ السّابِعَةُ: مَعالِمُ الدَّوْلَةِ الْمُتَقَدِّمَةِ في الْمَجالاتِ كافَّةً', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 103–112', true, '🎯 أُقارِنُ بَيْنَ دَوْلَةِ الْإِماراتِ قَديمًا وَحَديثًا، وَأُقَدِّرُ جُهودَ الشَّيْخِ زايِدٍ في بِناءِ الْمُواطِنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُقارِنُ بَيْنَ دَوْلَةِ الْإِماراتِ وَمَعالِمِها قَديمًا وَحَديثًا مِنْ جَوانِبِ الْحَياةِ كافَّةً.',1),('أُقَدِّرُ الْجُهودَ الَّتي بَذَلَها الشَّيْخُ زايِدٌ في بِناءِ الْمُواطِنِ: الرَّجُلِ وَالْمَرْأَةِ.',2),('أَتَعَرَّفُ وَمَضاتٍ في حَياتِهِ وَجُهودِهِ في مُتابَعَتِهِ الدَّقيقَةِ لِكُلِّ عَمَلٍ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ السّابِعَةُ: مَعالِمُ الدَّوْلَةِ الْمُتَقَدِّمَةِ في الْمَجالاتِ كافَّةً', 'لا فائِدَةَ في الْمالِ إِذا لَمْ يُسَخَّرْ لِخِدْمَةِ الشَّعْبِ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 108)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 103–112', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الْمَدارِسِ في إِمارَةِ أَبوظَبِي عامَ 1966م:','[{"id": "a", "text": "مَدْرَسَتانِ"}, {"id": "b", "text": "سِتٌّ وَعِشْرونَ"}, {"id": "c", "text": "سَبْعُمِئَةٍ"}]'),('أُقيمَ أَكْبَرُ مَشْروعٍ لِتَوْطينِ الْبَدْوِ في مِنْطَقَةِ:','[{"id": "a", "text": "الظَّفْرَةِ"}, {"id": "b", "text": "الْعَيْنِ"}, {"id": "c", "text": "الْخَوانيجِ"}]'),('قَرارُ اسْتِثْمارِ 486 مِلْيارَ دِرْهَمٍ في الصِّناعاتِ التَّحْويلِيَّةِ كانَ في:','[{"id": "a", "text": "نوفَمْبَرَ 2018م"}, {"id": "b", "text": "مايو 1976م"}, {"id": "c", "text": "أَبْريلَ 1975م"}]'),('نِسْبَةُ الْمَرْأَةِ في الْقُوى الْعامِلَةِ في الدَّوْلَةِ تَجاوَزَتْ:','[{"id": "a", "text": "60%"}, {"id": "b", "text": "20%"}, {"id": "c", "text": "90%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 8, 'SS-Y11-T1-L8', 'الرُّؤْيَةُ الثّامِنَةُ: التُّراثُ في حَياةِ الشَّيْخِ زايِدٍ', 3, 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 115–123', true, '🎯 أُقَدِّرُ حِرْصَ الشَّيْخِ زايِدٍ عَلى حِفْظِ التُّراثِ وَنَقْلِهِ مِنْ جيلٍ إِلى جيلٍ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الصِّفاتِ الَّتي مَيَّزَتْ شَخْصِيَّةَ الشَّيْخِ زايِدٍ وَجَعَلَتْهُ رَمْزًا لِلتُّراثِ بَيْنَ أَبْناءِ شَعْبِهِ.',1),('أُحَلِّلُ ثَقافَةَ الشَّيْخِ زايِدٍ الْواسِعَةَ في الْمَعارِفِ وَالثَّقافَةِ الشَّعْبِيَّةِ.',2),('أَسْتَنْتِجُ مَظاهِرَ اهْتِمامِهِ بِالْفُنونِ الشَّعْبِيَّةِ وَالرِّياضاتِ وَالْمُسابَقاتِ التُّراثِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّامِنَةُ: التُّراثُ في حَياةِ الشَّيْخِ زايِدٍ', 'مَنْ لا ماضِيَ لَهُ، لا حاضِرَ لَهُ، وَلا مُسْتَقْبَلَ. (نَهْجُ زايِدٍ الْأَخْلاقِيُّ، ص 119)', 'نَهْجُ زايِدٍ الْأَخْلاقِيُّ ص 115–123', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عُقِدَ الْمُؤْتَمَرُ الْعالَمِيُّ عَنِ الصُّقورِ تَحْتَ رِعايَةِ الشَّيْخِ زايِدٍ في:','[{"id": "a", "text": "أَبوظَبِي عامَ 1976م"}, {"id": "b", "text": "الْعَيْنِ عامَ 1966م"}, {"id": "c", "text": "دُبَيَّ عامَ 1981م"}]'),('اللَّوْحَةُ الشَّعْبِيَّةُ الْأولى لِلْفِرَقِ الشَّعْبِيَّةِ في الدَّوْلَةِ:','[{"id": "a", "text": "الْعَيّالَةُ"}, {"id": "b", "text": "الرَّزْفَةُ"}, {"id": "c", "text": "الْمالِدُ"}]'),('جَمَعَ ديوانَ شِعْرِ الشَّيْخِ زايِدٍ الشّاعِرُ:','[{"id": "a", "text": "حَمَدُ بو شِهابٍ"}, {"id": "b", "text": "أَحْمَدُ بْنُ حامِدٍ"}, {"id": "c", "text": "عَلِيٌّ الشَّرَفاءُ"}]'),('قالَ الشَّيْخُ زايِدٌ: «مَنْ لا ماضِيَ لَهُ، لا حاضِرَ لَهُ، وَلا…»:','[{"id": "a", "text": "مُسْتَقْبَلَ"}, {"id": "b", "text": "هُوِيَّةَ"}, {"id": "c", "text": "وَطَنَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;