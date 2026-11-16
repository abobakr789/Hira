begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 1, 2, 'الْوَحْدَةُ الثّانِيَةُ: الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=1
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T1-L10', 'الرُّؤْيَةُ الثّانِيَةُ: الْجُزُرُ خِلالَ عَهْدِ الْحِمايَةِ الْبَريطانِيَّةِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 18–20 · 87–134', true, '🎯 أُرَتِّبُ الْوَثائِقَ الَّتي تُثْبِتُ مِلْكِيَّةَ الْقَواسِمِ لِلْجُزُرِ، وَأُحَلِّلُ بِدايَةَ الْمُطالَباتِ الْفارِسِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَذْكُرُ مَضْمونَ اتِّفاقِ 1835م في تَقْسيمِ اسْتِخْدامِ الْجُزُرِ.',1),('أُحَلِّلُ رِسالَةَ الشَّيْخِ سُلْطانِ بْنِ صَقْرٍ الْقاسِمِيِّ عامَ 1864م وَدَلالَتَها.',2),('أَتَتَبَّعُ بِدايَةَ الْمُطالَباتِ الْفارِسِيَّةِ وَحادِثَةَ الْأَعْلامِ عامَ 1904م.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْجُزُرُ خِلالَ عَهْدِ الْحِمايَةِ الْبَريطانِيَّةِ', 'وَحينَ طَلَبَتْ بَريطانِيا مِنْ فارِسَ أَنْ تُقَدِّمَ دَليلًا لِدَعْمِ مُطالَباتِها بِالْجُزُرِ، فَشِلَتْ فارِسُ في تَقْديمِ أَيِّ دَليلٍ. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 20)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 18–20 · 87–134', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَصَّ اتِّفاقُ 1835م عَلى أَنْ تَكونَ أَبوموسى وَطُنْبُ الْكُبْرى تَحْتَ حُكْمِ:','[{"id": "a", "text": "قَواسِمِ رَأْسِ الْخَيْمَةِ وَالشّارِقَةِ"}, {"id": "b", "text": "قَواسِمِ لِنْجَةَ"}, {"id": "c", "text": "الْحُكومَةِ الْفارِسِيَّةِ"}]'),('وُجِّهَتْ رِسالَةُ 1864م إِلَى الْمُقيمِ الْبَريطانِيِّ:','[{"id": "a", "text": "الْكولونيل بيلي"}, {"id": "b", "text": "سير جِفْري آرْثَر"}, {"id": "c", "text": "دوجلاس هيرد"}]'),('اسْتَوْلَتْ فارِسُ عَلى لِنْجَةَ وَأَنْهَتْ حُكْمَ الْقَواسِمِ لَها عامَ:','[{"id": "a", "text": "1887م"}, {"id": "b", "text": "1835م"}, {"id": "c", "text": "1904م"}]'),('وُقِّعَتْ «مُعاهَداتُ الْحِمايَةِ» مَعَ بَريطانِيا في عامِ:','[{"id": "a", "text": "1892م"}, {"id": "b", "text": "1864م"}, {"id": "c", "text": "1922م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T1-L11', 'الرُّؤْيَةُ الثّالِثَةُ: الِانْسِحابُ الْبَريطانِيُّ وَالِاحْتِلالُ الْإيرانِيُّ لِلْجُزُرِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 21–22 · 135–162', true, '🎯 أُرَتِّبُ أَحْداثَ احْتِلالِ الْجُزُرِ الثَّلاثِ، وَأُقَدِّرُ تَضْحِيَةَ أَوَّلِ شَهيدٍ في تاريخِ الدَّوْلَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ أَثَرَ إِعْلانِ بَريطانِيا الِانْسِحابَ عامَ 1968م في مَصيرِ الْجُزُرِ.',1),('أُحَلِّلُ ظُروفَ تَوْقيعِ مُذَكِّرَةِ التَّفاهُمِ بِشَأْنِ أَبوموسى.',2),('أَسْتَنْتِجُ دَلالَةَ اسْتِشْهادِ سالِمِ سُهَيْلٍ خَميسِ بْنِ زُعَيْلٍ الدِّهْمانيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الِانْسِحابُ الْبَريطانِيُّ وَالِاحْتِلالُ الْإيرانِيُّ لِلْجُزُرِ', 'وَفي 30 تِشْرينَ الثّاني/ نوفَمْبَرَ 1971 وَبَعْدَ أَنْ رَفَضَتْ رَأْسُ الْخَيْمَةِ الْمُطالَبَةَ الْإيرانِيَّةَ بِجَزيرَتَيْ طُنْبَ الْكُبْرى وَطُنْبَ الصُّغْرى، وَرَفَضَتْ عُروضًا بِالتَّعْويضِ مِنْ خِلالِ وُسَطاءَ بَريطانِيّينَ، احْتَلَّتْ إيرانُ الْجَزيرَتَيْنِ بِالْقُوَّةِ. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 21)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 21–22 · 135–162', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَعْلَنَتْ بَريطانِيا نِيَّتَها الِانْسِحابَ مِنَ الْخَليجِ عامَ:','[{"id": "a", "text": "1968م"}, {"id": "b", "text": "1971م"}, {"id": "c", "text": "1892م"}]'),('اسْتُشْهِدَ سالِمُ سُهَيْلٍ الدِّهْمانيُّ وَهُوَ يَحْرُسُ جَزيرَةَ:','[{"id": "a", "text": "طُنْبَ الْكُبْرى"}, {"id": "b", "text": "أَبوموسى"}, {"id": "c", "text": "طُنْبَ الصُّغْرى"}]'),('وُقِّعَتْ مُذَكِّرَةُ التَّفاهُمِ بِشَأْنِ أَبوموسى في:','[{"id": "a", "text": "نوفَمْبَرَ 1971م"}, {"id": "b", "text": "ديسَمْبَرَ 1971م"}, {"id": "c", "text": "يَنايِرَ 1968م"}]'),('يَوْمُ الشَّهيدِ في دَوْلَةِ الْإِماراتِ:','[{"id": "a", "text": "30 نوفَمْبَرَ"}, {"id": "b", "text": "2 ديسَمْبَرَ"}, {"id": "c", "text": "18 يولْيو"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T1-L12', 'الرُّؤْيَةُ الرّابِعَةُ: الْجُزُرُ مُنْذُ قِيامِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 22–23 · 163–206', true, '🎯 أَتَتَبَّعُ مَوْقِفَ دَوْلَةِ الْإِماراتِ مِنْ قَضِيَّةِ الْجُزُرِ مُنْذُ عامِ 1971م، وَأُحَلِّلُ مَسارَ الْمُفاوَضاتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَذْكُرُ ما نَصَّ عَلَيْهِ الدُّسْتورُ في شَأْنِ سِيادَةِ الدَّوْلَةِ عَلى أَراضيها.',1),('أَصِفُ ما جَرى في جَزيرَةِ أَبوموسى في عامِ 1992م.',2),('أُقَوِّمُ نَتائِجَ جَوْلاتِ الْمُفاوَضاتِ الثُّنائِيَّةِ في 1992م وَ1995م.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الْجُزُرُ مُنْذُ قِيامِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 'وَمُنْذُ ذٰلِكَ التّاريخِ أَكَّدَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ مِرارًا وَتَكْرارًا حَقَّها في مِلْكِيَّةِ الْجُزُرِ وَرَغْبَتَها في تَسْوِيَةِ الْخِلافِ مَعَ إيرانَ بِالسُّبُلِ السِّلْمِيَّةِ وَبِما يَتَّفِقُ مَعَ الْقَوانينِ وَالْأَعْرافِ الدَّوْلِيَّةِ. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 22)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 22–23 · 163–206', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَظَرَ مَجْلِسُ الْأَمْنِ في قَضِيَّةِ الْجُزُرِ أَوَّلَ مَرَّةٍ في:','[{"id": "a", "text": "9 ديسَمْبَرَ 1971م"}, {"id": "b", "text": "2 ديسَمْبَرَ 1971م"}, {"id": "c", "text": "30 نوفَمْبَرَ 1971م"}]'),('اسْتَمَرَّتْ «حَرْبُ النّاقِلاتِ» في الْفَتْرَةِ:','[{"id": "a", "text": "1986–1988م"}, {"id": "b", "text": "1980–1982م"}, {"id": "c", "text": "1990–1991م"}]'),('عُقِدَتْ أَوَّلُ جَوْلَةِ مُفاوَضاتٍ ثُنائِيَّةٍ في:','[{"id": "a", "text": "أَبوظَبِي سِبْتَمْبَرَ 1992م"}, {"id": "b", "text": "طَهْرانَ 1995م"}, {"id": "c", "text": "جُدَّةَ 1994م"}]'),('عَدَدُ سُكّانِ أَبوموسى الَّذينَ مُنِعوا مِنَ الدُّخولِ عامَ 1992م:','[{"id": "a", "text": "104"}, {"id": "b", "text": "40"}, {"id": "c", "text": "1000"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y11-T1-L13', 'الرُّؤْيَةُ الْخامِسَةُ: وِجْهَةُ نَظَرٍ قانونِيَّةٍ حَوْلَ قَضِيَّةِ الْجُزُرِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 24–27 · 207–276', true, '🎯 أُقَوِّمُ الْأَدِلَّةَ الْقانونِيَّةَ الَّتي تَدْعَمُ حَقَّ دَوْلَةِ الْإِماراتِ، وَأُفَنِّدُ الِادِّعاءاتِ الْمُقابِلَةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ مَبْدَأَ حَقِّ التَّقادُمِ وَالْحَقِّ الْقائِمِ عَلَى الْحِيازَةِ الْمُتَواصِلَةِ وَالسِّلْمِيَّةِ.',1),('أُبَيِّنُ أَسْبابَ بُطْلانِ مُذَكِّرَةِ التَّفاهُمِ بِشَأْنِ أَبوموسى.',2),('أُفَنِّدُ ثَلاثَةً مِنَ الِادِّعاءاتِ الْمُقابِلَةِ بِحُجَجٍ قانونِيَّةٍ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْخامِسَةُ: وِجْهَةُ نَظَرٍ قانونِيَّةٍ حَوْلَ قَضِيَّةِ الْجُزُرِ', 'إِنَّ أَهَمَّ عُنْصُرٍ مِنْ عَناصِرِ التَّرْسيخِ التّاريخِيِّ لِلْحَقِّ هُوَ الْمِلْكِيَّةُ السِّلْمِيَّةُ وَالْمُتَواصِلَةُ؛ فَلَيْسَ هُناكَ شَكٌّ في أَنَّ مِلْكِيَّةَ الشّارِقَةِ لِجَزيرَةِ أَبوموسى كانَتْ سِلْمِيَّةً. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 25)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 24–27 · 207–276', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْمَبْدَأُ الْقانونِيُّ الْقائِمُ عَلَى الْحِيازَةِ الْمُتَواصِلَةِ وَالسِّلْمِيَّةِ هُوَ:','[{"id": "a", "text": "حَقُّ التَّقادُمِ"}, {"id": "b", "text": "الْقُرْبُ الْجُغْرافِيُّ"}, {"id": "c", "text": "حَقُّ الْفَتْحِ"}]'),('تُبْطِلُ الْمُعاهَدَةَ الْمُبْرَمَةَ تَحْتَ التَّهْديدِ الْمادَّةُ:','[{"id": "a", "text": "52 مِنِ اتِّفاقِيَّةِ فِيِنّا 1969م"}, {"id": "b", "text": "33 مِنْ ميثاقِ الْأُمَمِ الْمُتَّحِدَةِ"}, {"id": "c", "text": "101 مِنَ الدُّسْتورِ"}]'),('خَريطَةُ إيرانَ الْعَسْكَرِيَّةُ الْبَريطانِيَّةُ الَّتي تَسْتَنِدُ إِلَيْها تَعودُ إِلى عامِ:','[{"id": "a", "text": "1886م"}, {"id": "b", "text": "1904م"}, {"id": "c", "text": "1835م"}]'),('بَدَأَتْ إيرانُ مُطالَبَتَها بِجَزيرَةِ أَبوموسى في:','[{"id": "a", "text": "أَوائِلِ الْقَرْنِ الْعِشْرينَ"}, {"id": "b", "text": "الْقَرْنِ السّابِعِ لِلْميلادِ"}, {"id": "c", "text": "مُنْتَصَفِ الْقَرْنِ الثّامِنَ عَشَرَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'SS-Y11-T1-L14', 'الرُّؤْيَةُ السّادِسَةُ: احْتِلالُ الْجُزُرِ وَعَدَمُ الِاسْتِقْرارِ الْإِقْليمِيُّ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 28–31 · 277–348', true, '🎯 أُحَلِّلُ أَثَرَ احْتِلالِ الْجُزُرِ في أَمْنِ الْمِنْطَقَةِ، وَأَصِفُ سِياسَةَ دَوْلَةِ الْإِماراتِ في مُعالَجَةِ الْمُشْكِلَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ الْأَهَمِّيَّةَ الْإِسْتْراتيجِيَّةَ لِمِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ بِالْأَرْقامِ.',1),('أُحَدِّدُ الْمَخاوِفَ الْأَمْنِيَّةَ النّاتِجَةَ عَنِ احْتِلالِ الْجُزُرِ.',2),('أَصِفُ التَّدابيرَ الدِّبْلوماسِيَّةَ وَالْقانونِيَّةَ الَّتي تَتَبَنّاها الدَّوْلَةُ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ السّادِسَةُ: احْتِلالُ الْجُزُرِ وَعَدَمُ الِاسْتِقْرارِ الْإِقْليمِيُّ', 'وَلا تَعْتَبِرُ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ الْقُوَّةَ خِيارًا مَطْروحًا، وَتَتَطَلَّعُ إِلى أَنْ تُؤْتِيَ سِياسَةُ التَّعايُشِ السِّلْمِيِّ مَعَ إيرانَ ثِمارَها في نِهايَةِ الْمَطافِ. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 31)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 28–31 · 277–348', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ ما تُزَوِّدُ بِهِ مِنْطَقَةُ الْخَليجِ الْعالَمَ مِنِ احْتِياجِهِ الْيَوْمِيِّ مِنَ النِّفْطِ:','[{"id": "a", "text": "30%"}, {"id": "b", "text": "66%"}, {"id": "c", "text": "12%"}]'),('طولُ الْمِياهِ الْإِقْليمِيَّةِ الَّتي يُشارُ إِلى أَنَّ إيرانَ تُريدُها حَوْلَ الْجُزُرِ:','[{"id": "a", "text": "12 ميلًا"}, {"id": "b", "text": "75 ميلًا"}, {"id": "c", "text": "3 أَمْيالٍ"}]'),('تُفَضِّلُ دَوْلَةُ الْإِماراتِ لِحَلِّ النِّزاعِ:','[{"id": "a", "text": "الْمُفاوَضاتِ الثُّنائِيَّةَ أَوْ مَحْكَمَةَ الْعَدْلِ الدَّوْلِيَّةَ"}, {"id": "b", "text": "الْمُواجَهَةَ الْعَسْكَرِيَّةَ"}, {"id": "c", "text": "الصَّمْتَ"}]'),('يُوصَفُ مَضيقُ هُرْمُزَ بِأَنَّهُ:','[{"id": "a", "text": "مَمَرٌّ ضَيِّقٌ وَغَيْرُ مَنيعٍ"}, {"id": "b", "text": "مَمَرٌّ واسِعٌ آمِنٌ"}, {"id": "c", "text": "خَليجٌ مُغْلَقٌ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 7, 'SS-Y11-T1-L15', 'الرُّؤْيَةُ السّابِعَةُ: رُدودُ فِعْلِ الْعالَمِ الْعَرَبِيِّ عَلَى احْتِلالِ الْجُزُرِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 31–33 · 349–454', true, '🎯 أُرَتِّبُ رُدودَ فِعْلِ الدُّوَلِ الْعَرَبِيَّةِ عَلَى الِاحْتِلالِ، وَأُقَوِّمُ أَثَرَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَذْكُرُ الدُّوَلَ الَّتي قَدَّمَتْ شَكْوى إِلى مَجْلِسِ الْأَمْنِ في ديسَمْبَرَ 1971م.',1),('أُحَلِّلُ مَضْمونَ رِسالَةِ الدُّوَلِ الْعَرَبِيَّةِ الْخَمْسَ عَشْرَةَ في يولْيو 1972م.',2),('أُقَوِّمُ مَوْقِفَ مَجْلِسِ التَّعاوُنِ وَجامِعَةِ الدُّوَلِ الْعَرَبِيَّةِ مِنَ الْقَضِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ السّابِعَةُ: رُدودُ فِعْلِ الْعالَمِ الْعَرَبِيِّ عَلَى احْتِلالِ الْجُزُرِ', 'إِنَّ جُزُرَ أَبوموسى وَطُنْبَ الْكُبْرى وَطُنْبَ الصُّغْرى عَرَبِيَّةٌ وَتُعَدُّ جُزْءًا لا يَتَجَزَّأُ مِنْ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ وَالْوَطَنِ الْعَرَبِيِّ. (رِسالَةُ خَمْسَ عَشْرَةَ دَوْلَةً عَرَبِيَّةً، 18 يولْيو 1972م — الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 32)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 31–33 · 349–454', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L15/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('قَدَّمَتْ شَكْوى إِلى مَجْلِسِ الْأَمْنِ في 3 ديسَمْبَرَ 1971م:','[{"id": "a", "text": "الْعِراقُ وَالْجَزائِرُ وَلِيبِيا وَالْيَمَنُ الدّيمُقْراطِيَّةُ"}, {"id": "b", "text": "الْكُوَيْتُ وَقَطَرُ"}, {"id": "c", "text": "مِصْرُ وَسورِيَّةُ"}]'),('أَصْبَحَتْ دَوْلَةُ الْإِماراتِ عُضْوًا في جامِعَةِ الدُّوَلِ الْعَرَبِيَّةِ في:','[{"id": "a", "text": "6 ديسَمْبَرَ 1971م"}, {"id": "b", "text": "2 ديسَمْبَرَ 1971م"}, {"id": "c", "text": "18 يولْيو 1972م"}]'),('عَدَدُ الدُّوَلِ الْعَرَبِيَّةِ الَّتي وَقَّعَتْ رِسالَةَ يولْيو 1972م:','[{"id": "a", "text": "خَمْسَ عَشْرَةَ"}, {"id": "b", "text": "أَرْبَعٌ"}, {"id": "c", "text": "اثْنَتانِ وَعِشْرونَ"}]'),('مِنْ تَبِعاتِ احْتِلالِ الْجُزُرِ عَلى إيرانَ:','[{"id": "a", "text": "تَراجُعُ احْتِمالِ إِقامَةِ حِلْفٍ أَمْنِيٍّ في الْخَليجِ"}, {"id": "b", "text": "انْضِمامُها لِمَجْلِسِ التَّعاوُنِ"}, {"id": "c", "text": "زِيادَةُ الْمُساعَداتِ لَها"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 8, 'SS-Y11-T1-L16', 'الرُّؤْيَةُ الثّامِنَةُ: الْمُجْتَمَعُ الدَّوْلِيُّ وَنِزاعُ الْجُزُرِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 33–38 · 455–614', true, '🎯 أُقَوِّمُ دَوْرَ الْمُجْتَمَعِ الدَّوْلِيِّ في مُعالَجَةِ قَضِيَّةِ الْجُزُرِ، وَأَصِفُ خِياراتِ التَّسْوِيَةِ الْمُتاحَةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَلِّلُ دَوْرَ بَريطانِيا في أَثْناءِ انْسِحابِها وَبَعْدَهُ.',1),('أَتَتَبَّعُ مَسارَ الْقَضِيَّةِ في مَجْلِسِ الْأَمْنِ وَالْأُمَمِ الْمُتَّحِدَةِ.',2),('أُقارِنُ بَيْنَ الْحُكْمِ الْقَضائِيِّ الْمُلْزِمِ وَالرَّأْيِ الِاسْتِشارِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّامِنَةُ: الْمُجْتَمَعُ الدَّوْلِيُّ وَنِزاعُ الْجُزُرِ', 'وَمِنَ الْخِياراتِ الْمُمْكِنَةِ الْأُخْرى أَنْ تُصْدِرَ مَحْكَمَةُ الْعَدْلِ الدَّوْلِيَّةِ رَأْيًا اسْتِشارِيًّا حَوْلَ النِّزاعِ، وَهِيَ الْخُطْوَةُ الَّتي لَنْ تَقْتَضِيَ مُوافَقَةَ طَرَفَيِ النِّزاعِ كِلَيْهِما عَلى طَلَبِ الرَّأْيِ الِاسْتِشارِيِّ مِنَ الْمَحْكَمَةِ، وَلٰكِنَّها لَنْ تَكونَ مُلْزِمَةً لِلطَّرَفَيْنِ أَيْضًا. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 36)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 33–38 · 455–614', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L16/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَسْقَطَتْ إيرانُ مُطالَبَتَها بِالْبَحْرَيْنِ في عامِ:','[{"id": "a", "text": "1970م"}, {"id": "b", "text": "1971م"}, {"id": "c", "text": "1968م"}]'),('اقْتَرَحَ مَجْلِسُ الْأَمْنِ وَضْعَ قَضِيَّةِ الْجُزُرِ ضِمْنَ «الْقَضايا الْمَيِّتَةِ» عامَ:','[{"id": "a", "text": "1995م"}, {"id": "b", "text": "1994م"}, {"id": "c", "text": "1971م"}]'),('الرَّأْيُ الِاسْتِشارِيُّ لِمَحْكَمَةِ الْعَدْلِ الدَّوْلِيَّةِ:','[{"id": "a", "text": "لا يَتَطَلَّبُ مُوافَقَةَ الطَّرَفَيْنِ وَلَيْسَ مُلْزِمًا"}, {"id": "b", "text": "مُلْزِمٌ لِلطَّرَفَيْنِ"}, {"id": "c", "text": "يَصْدُرُ عَنْ مَجْلِسِ الْأَمْنِ"}]'),('وَزيرُ الْخارِجِيَّةِ الْبَريطانِيُّ الْأَسْبَقُ الَّذي أَيَّدَ مُطالَبَةَ الدَّوْلَةِ:','[{"id": "a", "text": "دوجلاس هيرد"}, {"id": "b", "text": "وارِن كِريسْتوفِر"}, {"id": "c", "text": "سير جِفْري آرْثَر"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T1-L9', 'الرُّؤْيَةُ الْأولى: الْجُزُرُ مُنْذُ التّاريخِ الْقَديمِ وَحَتّى حُكْمِ الْقَواسِمِ', 3, 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 11–18 · 43–86', true, '🎯 أَصِفُ مَوْقِعَ الْجُزُرِ الثَّلاثِ وَأَهَمِّيَّتَها الْإِسْتْراتيجِيَّةَ، وَأَتَتَبَّعُ مِلْكِيَّةَ الْعَرَبِ لَها عَبْرَ التّاريخِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ عَلَى الْخَريطَةِ مَواقِعَ الْجُزُرِ الثَّلاثِ وَمَساحاتِها وَأَبْعادَها.',1),('أُوَضِّحُ الْأَهَمِّيَّةَ الْإِسْتْراتيجِيَّةَ لِمَوْقِعِ الْجُزُرِ في الْخَليجِ الْعَرَبِيِّ.',2),('أَتَتَبَّعُ حِيازَةَ الْعَرَبِ لِلْجُزُرِ مِنْ مَمْلَكَةِ هُرْمُزَ إِلى حُكْمِ الْقَواسِمِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْجُزُرُ مُنْذُ التّاريخِ الْقَديمِ وَحَتّى حُكْمِ الْقَواسِمِ', 'وَكانَتْ جُزُرُ طُنْبَ الْكُبْرى وَطُنْبَ الصُّغْرى وَأَبوموسى جُزْءًا مِنْ مَمْلَكَةِ هُرْمُزَ الَّتي حَكَمَها الْعَرَبُ… وَبَعْدَ سُقوطِ هٰذِهِ الْمَمْلَكَةِ في عامِ 1622م بَقِيَتِ الْجُزُرُ مِلْكًا لِلْعَرَبِ وَيَسْتَخْدِمُها الْعَرَبُ. (الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ، ص 17)', 'الْجُزُرُ الثَّلاثُ الْمُحْتَلَّةُ ص 11–18 · 43–86', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T1-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مِساحَةُ جَزيرَةِ طُنْبَ الْكُبْرى:','[{"id": "a", "text": "11 كم²"}, {"id": "b", "text": "13 كم²"}, {"id": "c", "text": "1.5 كم²"}]'),('سَقَطَتْ مَمْلَكَةُ هُرْمُزَ في عامِ:','[{"id": "a", "text": "1622م"}, {"id": "b", "text": "1720م"}, {"id": "c", "text": "1500م"}]'),('أَسَّسَ الْقَواسِمُ حُكْمَهُمْ في رَأْسِ الْخَيْمَةِ بِحُلولِ عامِ:','[{"id": "a", "text": "1720م"}, {"id": "b", "text": "1622م"}, {"id": "c", "text": "1835م"}]'),('تَبْعُدُ جَزيرَةُ أَبوموسى عَنِ الشّارِقَةِ:','[{"id": "a", "text": "60 كم"}, {"id": "b", "text": "75 كم"}, {"id": "c", "text": "13 كم"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;