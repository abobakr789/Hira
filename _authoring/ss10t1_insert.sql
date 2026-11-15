begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 1, 1, 'الْوَحْدَةُ الْأولى: الْفِكْرُ الِاتِّحادِيُّ في الْإِماراتِ — جُذورٌ وَأَطْوارٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=1
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T1-L1', 'الرُّؤْيَةُ الْأولى: الْفِكْرُ الِاتِّحادِيُّ في مِنْطَقَةِ الْإِماراتِ', 3, 'ص 24–31 · وَالْكِتابُ ص 19–31', true, '🎯 أُحَلِّلُ النَّظْرَةَ الْعامَّةَ لِلْفِكْرِ الِاتِّحادِيِّ في مِنْطَقَةِ الْإِماراتِ، وَأَتَتَبَّعُ الْأَطْوارَ الَّتي مَرَّ بِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ.',1),('أَسْتَنْتِجُ الْخَلْفِيَّةَ الْعامَّةَ لِلْفِكْرِ الِاتِّحادِيِّ في مِنْطَقَةِ الْإِماراتِ.',2),('أَتَتَبَّعُ الْأَطْوارَ الَّتي مَرَّ بِهَا الْفِكْرُ الِاتِّحادِيُّ، وَأُثَمِّنُ قيمَةَ الِاكْتِشافاتِ الْأَثَرِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْفِكْرُ الِاتِّحادِيُّ في مِنْطَقَةِ الْإِماراتِ', 'إِنَّ مَبْدَأَ الِاتِّحادِ يَمْتَلِكُ جُذورًا تاريخِيَّةً في الْواقِعِ، حَيْثُ تَكْتَسِبُ إِماراتُ السّاحِلِ — بِحَسَبِ تَسْمِيَتِهَا الْقَديمَةِ — قَدْرًا كَبيرًا وَمُتَوارَثًا مِنَ الْخُصوصِيَّةِ الَّتي لَمْ تَتَغَيَّرْ وَلَمْ تَتَبَدَّلْ، كَشاهِدٍ أَصيلٍ عَلى وَحْدَةِ الْإِماراتِ تاريخِيًّا وَجُغْرافِيًّا وَثَقافِيًّا. وَهُوَ ما يَعْني أَنَّ إِعْلانَ قِيامِ الِاتِّحادِ وَتَشَكُّلَ الدَّوْلَةِ الْإِماراتِيَّةِ الْحَديثَةِ، جاءَ لِيَلْبِيَ وَيُعَزِّزَ مُقَوِّماتٍ وَعَوامِلَ الْوَحْدَةِ الْإِماراتِيَّةِ الْمُتَجَذِّرَةِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 20)', 'ص 24–31 · وَالْكِتابُ ص 19–31', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الْأَطْوارِ الَّتي مَرَّ بِهَا الْفِكْرُ الِاتِّحادِيُّ في الْإِماراتِ:','[{"id": "a", "text": "ثَلاثَةُ أَطْوارٍ"}, {"id": "b", "text": "طَوْرانِ"}, {"id": "c", "text": "أَرْبَعَةُ أَطْوارٍ"}]'),('حَكَمَ الشَّيْخُ زايِدُ بْنُ خَليفَةَ (زايِدٌ الْكَبيرُ) أَبوظَبي بَيْنَ:','[{"id": "a", "text": "1855 م وَ1909 م"}, {"id": "b", "text": "1906 م وَ1971 م"}, {"id": "c", "text": "1819 م وَ1820 م"}]'),('عُقِدَ اجْتِماعُ حُكّامِ الْإِماراتِ الَّذي دَعا إِلَيْهِ زايِدٌ الْكَبيرُ في مِنْطَقَةِ:','[{"id": "a", "text": "الْخَوانيجِ أَوائِلَ أَبْريلَ 1906 م"}, {"id": "b", "text": "الرَّمْسِ 1819 م"}, {"id": "c", "text": "لِنْجَةَ 1899 م"}]'),('الْفيدِرالِيَّةُ تَعْني:','[{"id": "a", "text": "اسْتِقْلالًا داخِلِيًّا ضِمْنَ الدَّوْلَةِ الْواحِدَةِ"}, {"id": "b", "text": "انْفِصالَ الْإِماراتِ"}, {"id": "c", "text": "إِلْغاءَ السُّلْطَةِ الْمَرْكَزِيَّةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T1-L2', 'الرُّؤْيَةُ الثّانِيَةُ: مَوْقِعُ الْإِماراتِ الْإِسْتْراتيجِيُّ وَالْأَطْماعُ الِاسْتِعْمارِيَّةُ', 3, 'ص 32–45 · وَالْكِتابُ ص 32–48', true, '🎯 أَسْتَخْلِصُ أَسْبابَ طَمَعِ الدُّوَلِ الِاسْتِعْمارِيَّةِ في الْإِماراتِ، وَأُقَدِّرُ جُهودَ سُكّانِها في مُواجَهَتِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَخْلِصُ أَسْبابَ طَمَعِ الدُّوَلِ الِاسْتِعْمارِيَّةِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',1),('أُقَدِّرُ جُهودَ سُكّانِ دَوْلَةِ الْإِماراتِ في مُواجَهَةِ الْبُرْتُغالِيّينَ، وَأَتَتَبَّعُ الْعُدْوانَ الْفارِسِيَّ عَلى إِماراتِ السّاحِلِ.',2),('أُحَلِّلُ أَحْداثَ حَمْلَةِ 1819 م الْبِريطانِيَّةِ وَأُحَدِّدُ خَطَّ سَيْرِ حَمْلَةِ 1809 م.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: مَوْقِعُ الْإِماراتِ الْإِسْتْراتيجِيُّ وَالْأَطْماعُ الِاسْتِعْمارِيَّةُ', 'وَنَسْتَنْتِجُ مِنْ هٰذَا الِاسْتِهْدافِ الَّذي طالَ كامِلَ جُغْرافْيا الْإِماراتِ وَشَعْبِها في ذٰلِكَ الْوَقْتِ الْمُبَكِّرِ وَحْدَةَ مَصيرِ الْإِماراتِيّينَ وَمُواجَهَتِهِمُ الْجَماعِيَّةَ لِلْأَخْطارِ، الَّتي كانَتْ تُؤَكِّدُ وَحْدَةَ الْإِماراتِ وَتُعَزِّزُ في ضَميرِ كُلِّ إِماراتِيٍّ الْمَشاعِرَ الْوَطَنِيَّةَ وَالِالْتِحامَ بِتُرْبَةِ الْوَطَنِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 45)', 'ص 32–45 · وَالْكِتابُ ص 32–48', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَدَأَ الْعُدْوانُ الْبُرْتُغالِيُّ عَلى سَواحِلِ الْإِماراتِ عامَ:','[{"id": "a", "text": "1507 م"}, {"id": "b", "text": "1631 م"}, {"id": "c", "text": "1819 م"}]'),('قائِدُ الْحَمْلَةِ الْبِريطانِيَّةِ عَلى رَأْسِ الْخَيْمَةِ 1819 م:','[{"id": "a", "text": "الْجِنْرالُ وِلْيامْ جْرانْتْ كير"}, {"id": "b", "text": "نادِرُ شاه"}, {"id": "c", "text": "أَلْفونْسو دي البوكيرْك"}]'),('بَلَغَ عَدَدُ شُهَداءِ رَأْسِ الْخَيْمَةِ في حَمْلَةِ 1819 م:','[{"id": "a", "text": "أَكْثَرَ مِنْ 1000 شَهيدٍ"}, {"id": "b", "text": "نَحْوَ 177 شَهيدًا"}, {"id": "c", "text": "نَحْوَ 400 شَهيدٍ"}]'),('مِنْ بُنودِ مُعاهَدَةِ 1820 م:','[{"id": "a", "text": "مَنْعُ صِناعَةِ السُّفُنِ الْحَرْبِيَّةِ"}, {"id": "b", "text": "تَسْليحُ الْإِماراتِ"}, {"id": "c", "text": "إِنْشاءُ أُسْطولٍ مُشْتَرَكٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 1, 2, 'الْوَحْدَةُ الثّانِيَةُ: انْطِلاقُ الرّوحِ الْوَطَنِيَّةِ الْإِماراتِيَّةِ وَالْحُلْمُ الْمُبَكِّرُ بِالِاتِّحادِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=1
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T1-L3', 'الرُّؤْيَةُ الْأولى: بَوادِرُ الْفِكْرِ الِاتِّحادِيِّ', 3, 'ص 52–59 · وَالْكِتابُ ص 49–61', true, '🎯 أَسْتَنْتِجُ بَوادِرَ الْفِكْرِ الِاتِّحادِيِّ، وَأُقَدِّرُ جُهودَ زايِدٍ الْأَوَّلِ وَسَعيدِ بْنِ مَكْتومٍ في تَوْحيدِ الْكَلِمَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ بَوادِرَ الْفِكْرِ الِاتِّحادِيِّ وَمَلامِحَهُ الْأولى.',1),('أُقَدِّرُ جُهودَ الشَّيْخِ زايِدِ بْنِ خَليفَةَ في تَوْحيدِ الْكَلِمَةِ وَمُواجَهَةِ النُّفوذِ الْأَجْنَبِيِّ.',2),('أُبَيِّنُ دَوْرَ الشَّيْخِ سَعيدِ بْنِ مَكْتومٍ في مَجْلِسِ حُكّامِ إِماراتِ السّاحِلِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: بَوادِرُ الْفِكْرِ الِاتِّحادِيِّ', 'لٰكِنَّ هٰذَا الْفِكْرَ وَالتَّوَجُّهَ الِاتِّحادِيَّ هُوَ الَّذي تَغَلَّبَ في النِّهايَةِ، مُسْتَنِدًا لَيْسَ فَقَطْ إِلَى النُّزوعِ الْوَحْدَوِيِّ في رُؤوسِ الْحُكّامِ، بَلْ مُسْتَنِدًا في الْأَصْلِ إِلى وَحْدَةِ الْإِماراتِ الَّتي تَتَحَدَّثُ عَنْ نَفْسِها مِنْ خِلالِ الْبيئَةِ الْواحِدَةِ وَالرّوحِ الْوَطَنِيَّةِ الْمُتَلاحِمَةِ وَالْخُصوصِيّاتِ الَّتي تُشَكِّلُ هُوِيَّةَ الْإِماراتِ وَتُمَيِّزُها وَتَرْسِمُ مَلامِحَها كَوَطَنٍ مُكْتَمِلِ الشَّخْصِيَّةِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 49)', 'ص 52–59 · وَالْكِتابُ ص 49–61', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('حَكَمَ الشَّيْخُ سَعيدُ بْنُ مَكْتومٍ إِمارَةَ دُبَيٍّ مِنْ:','[{"id": "a", "text": "ديسَمْبِرَ 1912 م حَتّى 1958 م"}, {"id": "b", "text": "1855 م حَتّى 1909 م"}, {"id": "c", "text": "1878 م حَتّى 1912 م"}]'),('مَرْكَزُ مَجْلِسِ الْإِماراتِ الْمُتَصالِحَةِ كانَ في مَدينَةِ:','[{"id": "a", "text": "دُبَيٍّ"}, {"id": "b", "text": "أَبوظَبي"}, {"id": "c", "text": "الشّارِقَةِ"}]'),('مِنْ مَناطِقِ إِمارَةِ أَبوظَبي في عَهْدِ زايِدٍ الْكَبيرِ:','[{"id": "a", "text": "جَزيرَةُ دَلْما مَرْكَزُ تِجارَةِ اللُّؤْلُؤِ"}, {"id": "b", "text": "ميناءُ لِنْجَةَ"}, {"id": "c", "text": "جَزيرَةُ قِشْمَ"}]'),('رَفَعَ زايِدٌ الْكَبيرُ بَدَلًا مِنَ الْعَلَمِ الْمَفْروضِ عَلَمًا:','[{"id": "a", "text": "أَخْضَرَ اللَّوْنِ"}, {"id": "b", "text": "أَبْيَضَ بِمُرَبَّعٍ أَحْمَرَ"}, {"id": "c", "text": "أَحْمَرَ بِحاشِيَةٍ بَيْضاءَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T1-L4', 'الرُّؤْيَةُ الثّانِيَةُ: مَظاهِرُ الْفِكْرِ الِاتِّحادِيِّ في إِماراتِ السّاحِلِ', 3, 'ص 60–65 · وَالْكِتابُ ص 62–76', true, '🎯 أُوَضِّحُ مَظاهِرَ الْفِكْرِ الِاتِّحادِيِّ في مَرْحَلَةِ إِماراتِ السّاحِلِ، وَأُبَيِّنُ أَثَرَ الْمَدِّ الْقَوْمِيِّ الْعَرَبِيِّ فيهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ سَبَبَ تَسْمِيَةِ الْإِماراتِ قَديمًا بِاسْمِ «السّاحِلِ».',1),('أُعَدِّدُ رَكائِزَ اقْتِصادِ الْإِماراتِ قَبْلَ قِيامِ الِاتِّحادِ.',2),('أُبَيِّنُ دَوْرَ مَجْلِسِ الْإِماراتِ الْمُتَصالِحَةِ، وَأَثَرَ الْمَدِّ الْقَوْمِيِّ الْعَرَبِيِّ في تَوازُنِ الْفِكْرِ الِاتِّحادِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: مَظاهِرُ الْفِكْرِ الِاتِّحادِيِّ في إِماراتِ السّاحِلِ', 'لَقَدْ كانَ لِلْفِكْرِ الَّذي سادَ الْإِماراتِ في الْخَمْسينِيّاتِ دَوْرٌ مُهِمٌّ في تَغْذِيَةِ الشُّعورِ الْوَحْدَوِيِّ وَالْقَوْمِيِّ، الَّذي كانَ أَكْبَرَ حافِزٍ وَمُهَيِّئٍ لِلظُّروفِ الَّتي أَدَّتْ إِلى قِيامِ اتِّحادِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في عامِ 1971 م. دونَ أَنْ نَنْسى أَنْ نَضَعَ في الِاعْتِبارِ الْخُصوصِيّاتِ الْإِماراتِيَّةَ وَالنُّزوعَ الْفِطْرِيَّ نَحْوَ التَّكاتُفِ وَالْوَحْدَةِ، وَامْتِلاكَ الْبيئَةِ السِّياسِيَّةِ في الْإِماراتِ لِفِكْرٍ اتِّحادِيٍّ مُتَجَذِّرٍ وَنابِعٍ مِنْ عُمْقِ الْمُجْتَمَعِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 73)', 'ص 60–65 · وَالْكِتابُ ص 62–76', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يُقَدَّرُ طولُ ساحِلِ الْإِماراتِ بِحَوالَيْ:','[{"id": "a", "text": "700 كلم"}, {"id": "b", "text": "400 كلم"}, {"id": "c", "text": "1000 كلم"}]'),('مِنْ رَكائِزِ اقْتِصادِ الْإِماراتِ قَبْلَ الِاتِّحادِ:','[{"id": "a", "text": "الْغَوْصُ لِاسْتِخْراجِ اللُّؤْلُؤِ"}, {"id": "b", "text": "صِناعَةُ السَّيّاراتِ"}, {"id": "c", "text": "السِّياحَةُ الْجَبَلِيَّةُ"}]'),('زارَتْ بَعْثَةُ الْجامِعَةِ الْعَرَبِيَّةِ الْإِماراتِ عامَ:','[{"id": "a", "text": "1964 م"}, {"id": "b", "text": "1958 م"}, {"id": "c", "text": "1971 م"}]'),('مَجْلِسُ الْإِماراتِ الْمُتَصالِحَةِ كانَ يَهْدِفُ إِلى:','[{"id": "a", "text": "مُناقَشَةِ الْأُمورِ الْمُشْتَرَكَةِ وَتَنْسيقِ خُطَطِ التَّنْمِيَةِ"}, {"id": "b", "text": "فَرْضِ الِاتِّفاقِيّاتِ الْبِريطانِيَّةِ"}, {"id": "c", "text": "تَقْسيمِ الْإِماراتِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T1-L5', 'الرُّؤْيَةُ الثّالِثَةُ: مُقَوِّماتُ الِاتِّحادِ', 3, 'ص 66–73 · وَالْكِتابُ ص 77–97', true, '🎯 أَسْتَخْلِصُ مُقَوِّماتِ وَحْدَةِ الْإِماراتِ، وَأُبَيِّنُ دَوْرَ الِاكْتِشافاتِ النَّفْطِيَّةِ في قِيامِ الِاتِّحادِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَخْلِصُ مُقَوِّماتِ وَحْدَةِ الْإِماراتِ وَأُصَنِّفُها.',1),('أُبَيِّنُ أَثَرَ وَحْدَةِ الْجُغْرافْيا وَتَرابُطِ السُّكّانِ في تَماسُكِ الْمُجْتَمَعِ.',2),('أُقَيِّمُ دَوْرَ الِاكْتِشافاتِ النَّفْطِيَّةِ في قِيامِ الدَّوْلَةِ الِاتِّحادِيَّةِ وَاسْتِقْرارِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: مُقَوِّماتُ الِاتِّحادِ', 'كَما أَنَّ الْوَحْدَةَ الطَّبيعِيَّةَ لِلْإِماراتِ عَلى مُسْتَوَى الْبيئَةِ وَالسُّكّانِ وَخُصوصِيّاتِها وَمَلامِحِها الَّتي تُمَيِّزُها عَلى كافَّةِ الْمُسْتَوَياتِ، تَبْقى هِيَ الْمُحَرِّكَ الْأَوَّلَ وَأَساسَ الْمُقَوِّماتِ الَّتِي ارْتَكَزَ عَلَيْهَا الِاتِّحادُ. وَقَدْ مَرَّ الْفِكْرُ الِاتِّحادِيُّ بِمَراحِلَ ظَلَّ يَتَبَلْوَرُ خِلالَها إِلى أَنْ أَفْضى إِلى إِعْلانِ قِيامِ الدَّوْلَةِ، بِإِرادَةٍ سِياسِيَّةٍ واعِيَةٍ وَمُسْتَنِدَةٍ إِلى عَوامِلَ تُشَكِّلُ ضَمانَةً أَساسِيَّةً لِنَجاحِ خُطْوَةِ قِيامِ الدَّوْلَةِ الِاتِّحادِيَّةِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 79)', 'ص 66–73 · وَالْكِتابُ ص 77–97', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ مُقَوِّماتِ وَحْدَةِ الْإِماراتِ كَما سَرَدَهَا الْكِتابُ:','[{"id": "a", "text": "عَشْرَةُ مُقَوِّماتٍ"}, {"id": "b", "text": "سِتَّةُ مُقَوِّماتٍ"}, {"id": "c", "text": "أَرْبَعَةُ مُقَوِّماتٍ"}]'),('حُكّامُ الشّارِقَةِ وَرَأْسِ الْخَيْمَةِ هُمْ:','[{"id": "a", "text": "الْقَواسِمُ"}, {"id": "b", "text": "آلُ الْمُعَلّا"}, {"id": "c", "text": "النُّعَيْمُ"}]'),('أُطْلِقَ لَقَبُ «النِّزارِيّينَ» عَلى:','[{"id": "a", "text": "أَوَّلِ هِجْرَةٍ عَرَبِيَّةٍ قادِمَةٍ مِنَ الْيَمَنِ"}, {"id": "b", "text": "حُكّامِ عَجْمانَ"}, {"id": "c", "text": "سُكّانِ جَزيرَةِ دَلْما"}]'),('أَسْهَمَتِ الِاكْتِشافاتُ النَّفْطِيَّةُ في قِيامِ الِاتِّحادِ بِـ:','[{"id": "a", "text": "تَعْميمِ الْخَيْرِ عَلى جَميعِ مَناطِقِ الْإِماراتِ"}, {"id": "b", "text": "تَرْكيزِ الثَّرْوَةِ في إِمارَةٍ واحِدَةٍ"}, {"id": "c", "text": "إِلْغاءِ الْحاجَةِ إِلَى الِاتِّحادِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 1, 3, 'الْوَحْدَةُ الثّالِثَةُ: الْفِكْرُ الِاتِّحادِيُّ عِنْدَ الشَّيْخِ زايِدٍ — مُؤَسِّسِ الِاتِّحادِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=1
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y10-T1-L10', 'الرُّؤْيَةُ الْخامِسَةُ: تَفْعيلُ الْفِكْرِ الِاتِّحادِيِّ بَعْدَ قِيامِ الدَّوْلَةِ', 3, 'ص 96–99 · وَالْكِتابُ ص 130–140', true, '🎯 أَتَعَرَّفُ السِّماتِ الْعامَّةَ لِأَقْوالِ الشَّيْخِ زايِدٍ، وَأَسْتَنْتِجُ مَجالاتِ التَّنْمِيَةِ في عَهْدِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ السِّماتِ الْعامَّةَ لِلْأَقْوالِ الْمَأْثورَةِ لِلشَّيْخِ زايِدٍ.',1),('أَسْتَنْتِجُ مَجالاتِ التَّنْمِيَةِ وَالتَّطْويرِ في عَهْدِ الْبَاني الْمُؤَسِّسِ.',2),('أَسْتَخْلِصُ الدُّروسَ وَالْعِبَرَ الْمُسْتَفادَةَ مِنْ مَسيرَةِ إِنْجازاتِهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْخامِسَةُ: تَفْعيلُ الْفِكْرِ الِاتِّحادِيِّ بَعْدَ قِيامِ الدَّوْلَةِ', 'إِنَّ الْجيلَ الْجَديدَ يَجِبُ أَنْ يَعْرِفَ كَمْ قاسى الْجيلُ الَّذي سَبَقَهُ؛ لِأَنَّ ذٰلِكَ يَزيدُهُ صَلابَةً وَصَبْرًا وَجِهادًا لِمُواصَلَةِ الْمَسيرَةِ الَّتي بَدَأَهَا الْآباءُ وَالْأَجْدادُ، وَهِيَ الْمَسيرَةُ الَّتي جَسَّدَتْ في النِّهايَةِ الْأَماني الْقَوْمِيَّةَ بَعْدَ فَتْرَةٍ طَويلَةٍ مِنَ الْمُعاناةِ ضِدَّ التَّجْزِئَةِ وَالتَّخَلُّفِ وَالْحِرْمانِ. (مِنْ أَقْوالِ الشَّيْخِ زايِدٍ، الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 136)', 'ص 96–99 · وَالْكِتابُ ص 130–140', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('قالَ الشَّيْخُ زايِدٌ إِنَّ الدَّوْلَةَ مِثْلُ:','[{"id": "a", "text": "الشَّجَرَةِ"}, {"id": "b", "text": "السَّفينَةِ"}, {"id": "c", "text": "الْقَلْعَةِ"}]'),('مِنْ مُرْتَكَزاتِ فَلْسَفَةِ الشَّيْخِ زايِدٍ لِلْحُكْمِ:','[{"id": "a", "text": "تَطْويرُ التَّنْمِيَةِ الْبَشَرِيَّةِ"}, {"id": "b", "text": "تَرْكيزُ الثَّرْوَةِ"}, {"id": "c", "text": "إِغْلاقُ الْحِوارِ"}]'),('أَكْمِلْ: «الثَّرْوَةُ لَيْسَتْ ثَرْوَةَ الْمالِ، بَلْ هِيَ ثَرْوَةُ …».','[{"id": "a", "text": "الرِّجالِ"}, {"id": "b", "text": "الْأَرْضِ"}, {"id": "c", "text": "التِّجارَةِ"}]'),('دَشَّنَ الشَّيْخُ زايِدٌ مُنْذُ بِدايَةِ عَهْدِ الدَّوْلَةِ الِاتِّحادِيَّةِ:','[{"id": "a", "text": "تَوْفيرَ الْمَساكِنِ وَتَوْزيعَ قِطَعِ الْأَرْضِ مَجّانًا"}, {"id": "b", "text": "إِلْغاءَ الْمَدارِسِ"}, {"id": "c", "text": "تَقْييدَ سَفَرِ الطَّلَبَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'SS-Y10-T1-L11', 'الرُّؤْيَةُ السّادِسَةُ: ثِمارُ الْفِكْرِ الِاتِّحادِيِّ', 3, 'ص 100–103 · وَالْكِتابُ ص 141–156', true, '🎯 أَتَعَرَّفُ مَجالاتِ الْفِكْرِ الِاتِّحادِيِّ في دَوْلَةِ الْإِماراتِ، وَأَسْتَنْتِجُ أَهَمِّيَّةَ الِاتِّحادِ لِشَعْبِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَجالاتِ الْفِكْرِ الِاتِّحادِيِّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',1),('أَسْتَنْتِجُ أَهَمِّيَّةَ الِاتِّحادِ لِشَعْبِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',2),('أُثَمِّنُ جُهودَ الشَّيْخِ زايِدٍ لِخِدْمَةِ الْأُمَّةِ الْعَرَبِيَّةِ وَالْإِسْلامِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ السّادِسَةُ: ثِمارُ الْفِكْرِ الِاتِّحادِيِّ', 'وَأَخيرًا تَطَرَّقْنا لِنَماذِجَ مِنْ ثِمارِ الْفِكْرِ الِاتِّحادِيِّ في الْإِماراتِ، وَالَّتي سَتَظَلُّ تُذَكِّرُنا بِأَنَّ كُلَّ ما تَحَقَّقَ هُوَ بِفَضْلِ اللهِ ثُمَّ بِفَضْلِ الشَّيْخِ زايِدٍ الَّذي زَرَعَ بَذْرَةَ الِاتِّحادِ في تُرْبَةِ الْإِماراتِ وَفي عُقولِ أَبْنائِها، فَأَثْمَرَتْ شُموخًا وَمُكْتَسَباتٍ وَإِنْجازاتٍ، لَمْ وَلَنْ تَتَوَقَّفَ عَنِ الِارْتِقاءِ بِالْإِماراتِ في كافَّةِ مَجالاتِ الْحَياةِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 156)', 'ص 100–103 · وَالْكِتابُ ص 141–156', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('قالَ الشَّيْخُ زايِدٌ سَنَةَ 1973 م: «النَّفْطُ الْعَرَبِيُّ لَيْسَ أَغْلى مِنَ …».','[{"id": "a", "text": "الدَّمِ الْعَرَبِيِّ"}, {"id": "b", "text": "الذَّهَبِ"}, {"id": "c", "text": "الْأَرْضِ"}]'),('أَهَمُّ حَصادٍ لِلْفِكْرِ الِاتِّحادِيِّ بَعْدَ قِيامِ الِاتِّحادِ هُوَ تَرَسُّخُ:','[{"id": "a", "text": "مَداميكِ الدَّوْلَةِ الْحَديثَةِ"}, {"id": "b", "text": "الْوَلاءاتِ الضَّيِّقَةِ"}, {"id": "c", "text": "التَّشَظّي"}]'),('وُقِّعَ النِّظامُ الْأَساسِيُّ لِمَجْلِسِ التَّعاوُنِ عامَ:','[{"id": "a", "text": "1981 م"}, {"id": "b", "text": "1971 م"}, {"id": "c", "text": "1973 م"}]'),('الْخِدْمَةُ الْوَطَنِيَّةُ تَسْتَنِدُ إِلَى الْقانونِ الِاتِّحادِيِّ رَقْمِ:','[{"id": "a", "text": "(6) لِسَنَةِ 2014 م"}, {"id": "b", "text": "(1) لِسَنَةِ 1971 م"}, {"id": "c", "text": "(9) لِسَنَةِ 1981 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T1-L6', 'الرُّؤْيَةُ الْأولى: الشَّيْخُ زايِدٌ بَطَلُ تَحْويلِ الْفِكْرِ الِاتِّحادِيِّ إِلى واقِعٍ', 3, 'ص 78–81 · وَالْكِتابُ ص 102–108', true, '🎯 أَسْتَنْتِجُ جُهودَ الشَّيْخِ زايِدٍ في قِيامِ دَوْلَةِ الْإِماراتِ، وَأُلَخِّصُ فَلْسَفَتَهُ تُجاهَ إِسْعادِ الْمُواطِنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ جُهودَ الشَّيْخِ زايِدٍ في قِيامِ دَوْلَةِ الْإِماراتِ.',1),('أُفَسِّرُ أَهَمَّ الْمَفاهيمِ وَالْمُصْطَلَحاتِ الْوارِدَةِ في الرُّؤْيَةِ.',2),('أُلَخِّصُ فَلْسَفَةَ الشَّيْخِ زايِدٍ تُجاهَ إِسْعادِ الْمُواطِنِ الْإِماراتِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الشَّيْخُ زايِدٌ بَطَلُ تَحْويلِ الْفِكْرِ الِاتِّحادِيِّ إِلى واقِعٍ', 'سَوْفَ يَشْهَدُ التّاريخُ عَلى جُهودِ الشَّيْخِ زايِدٍ، وَعَلى تَعَلُّقِهِ بِالْفِكْرِ الِاتِّحادِيِّ الَّذي جَعَلَهُ يَتَجاوَزُ الْإِماراتِ إِلَى الْمُسْتَوَى الْإِقْليمِيِّ وَالْمُحيطِ الْعَرَبِيِّ الْأَوْسَعِ. وَأَيِ اسْتِحْضارٍ لِدَوْرِ الشَّيْخِ زايِدٍ في تَرْجَمَةِ الْفِكْرِ الِاتِّحادِيِّ، لا بُدَّ أَنْ يَسْتَحْضِرَ دَوْرَهُ الْجَوْهَرِيَّ وَالْأَساسِيَّ في إِقامَةِ مَجْلِسِ التَّعاوُنِ الْخَليجِيِّ. لِذٰلِكَ يَحْضُرُ اسْمُ الشَّيْخِ زايِدٍ في الْوِجْدانِ الْعَرَبِيِّ دَوْمًا مَقْرونًا بِالْحِكْمَةِ وَبِالْحَديثِ عَنْ حَكيمِ الْعَرَبِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 108)', 'ص 78–81 · وَالْكِتابُ ص 102–108', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('وُقِّعَ النِّظامُ الْأَساسِيُّ لِمَجْلِسِ التَّعاوُنِ في أَبوظَبي يَوْمَ:','[{"id": "a", "text": "25 مايو 1981 م"}, {"id": "b", "text": "2 ديسَمْبِرَ 1971 م"}, {"id": "c", "text": "18 فِبْرايِرَ 1968 م"}]'),('انْتَقَلَ الْفِكْرُ الِاتِّحادِيُّ عَلى يَدَيِ الشَّيْخِ زايِدٍ إِلى طَوْرِ:','[{"id": "a", "text": "التَّنْفيذِ وَالْعَمَلِ وَالدَّيْمومَةِ"}, {"id": "b", "text": "الْحُلْمِ وَالْأَمَلِ"}, {"id": "c", "text": "التَّحالُفاتِ الْقَبَلِيَّةِ"}]'),('وَصْفُ «حَكيمِ الْعَرَبِ» حَضَرَ مَقْرونًا بِاسْمِ:','[{"id": "a", "text": "الشَّيْخِ زايِدِ بْنِ سُلْطانَ"}, {"id": "b", "text": "الشَّيْخِ سَعيدِ بْنِ مَكْتومٍ"}, {"id": "c", "text": "الشَّيْخِ زايِدِ بْنِ خَليفَةَ"}]'),('الطَّبيعَةُ الْأَبَوِيَّةُ لِلْمُجْتَمَعِ الْإِماراتِيِّ تَعْني أَنَّ النّاسَ عَدّوا قائِدَهُمْ في مَقامِ:','[{"id": "a", "text": "الْأَبِ الْكَبيرِ"}, {"id": "b", "text": "الْمُوَظَّفِ الْإِدارِيِّ"}, {"id": "c", "text": "الضَّيْفِ الزّائِرِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T1-L7', 'الرُّؤْيَةُ الثّانِيَةُ: الْعَوامِلُ الَّتي شَكَّلَتْ شَخْصِيَّةَ زايِدٍ الْقِيادِيَّةَ', 3, 'ص 82–85 · وَالْكِتابُ ص 110–116', true, '🎯 أَتَعَرَّفُ السّيرَةَ الذّاتِيَّةَ لِلشَّيْخِ زايِدٍ، وَأُلَخِّصُ أَهَمَّ الْمَحَطّاتِ السِّياسِيَّةِ في حَياتِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ السّيرَةَ الذّاتِيَّةَ لِلشَّيْخِ زايِدِ بْنِ سُلْطانَ آلِ نَهْيانَ.',1),('أُلَخِّصُ أَهَمَّ الْمَحَطّاتِ السِّياسِيَّةِ في حَياتِهِ.',2),('أُثَمِّنُ إِنْجازاتِهِ في الْمِنْطَقَةِ الشَّرْقِيَّةِ لِإِمارَةِ أَبوظَبي.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْعَوامِلُ الَّتي شَكَّلَتْ شَخْصِيَّةَ زايِدٍ الْقِيادِيَّةَ', 'لَكِنَّ زايِدًا وَريثُ آلِ نَهْيانَ وَالْمُتَّصِلُ بِسِلْسِلَةٍ مُتَّصِلَةٍ مِنَ الْحُكّامِ الَّذينَ قادوا إِمارَةَ أَبوظَبي، لَمْ يولَدْ «وَفي فَمِهِ مِلْعَقَةٌ مِنْ ذَهَبٍ»، كَما يوصَفُ عادَةً أَنْجالُ الْحُكّامِ وَالْمُلوكِ وَالْأُمَراءِ، فَزايِدٌ هُوَ أَيْضًا ابْنُ الْبيئَةِ الْعَرَبِيَّةِ وَالْمُجْتَمَعِ الْقَبَلِيِّ، وَفي تَكْوينِ شَخْصِيَّتِهِ أَثَرٌ كَبيرٌ لِلصَّحْراءِ وَحَياةِ الْكَرَمِ وَالشَّهامَةِ وَتَقْديرِ الْآخَرينَ وَانْتِزاعِ تَقْديرِهِمْ بِفِطْنَةٍ وَعَدْلٍ وَفَهْمٍ مُتَبادَلٍ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 112)', 'ص 82–85 · وَالْكِتابُ ص 110–116', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَأَسَّسَتِ الْمَدْرَسَةُ النَّهْيانِيَّةُ في مَدينَةِ الْعَيْنِ عامَ:','[{"id": "a", "text": "1955 م"}, {"id": "b", "text": "1971 م"}, {"id": "c", "text": "1982 م"}]'),('مِنْ أَعْمالِ الشَّيْخِ زايِدٍ في إِدارَةِ شُؤونِ الْعَيْنِ:','[{"id": "a", "text": "إِعادَةُ تَنْظيمِ الرَّيِّ وَتَوْزيعِ الْمِياهِ"}, {"id": "b", "text": "إِنْشاءُ مَجْلِسِ التَّعاوُنِ"}, {"id": "c", "text": "تَوْقيعُ مُعاهَدَةِ الصَّداقَةِ"}]'),('بَدَأَ اهْتِمامُ الشَّيْخِ زايِدٍ بِما يَدورُ في مِنْطَقَتِهِ مُنْذُ:','[{"id": "a", "text": "أَوائِلِ الْأَرْبَعينِيّاتِ"}, {"id": "b", "text": "أَوائِلِ السَّبْعينِيّاتِ"}, {"id": "c", "text": "أَوائِلِ الثَّمانينِيّاتِ"}]'),('«الْمِنْطَقَةُ الشَّرْقِيَّةُ» لِإِمارَةِ أَبوظَبي هِيَ:','[{"id": "a", "text": "الْعَيْنُ"}, {"id": "b", "text": "الظَّفْرَةُ"}, {"id": "c", "text": "دَلْما"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T1-L8', 'الرُّؤْيَةُ الثّالِثَةُ: الشَّخْصِيَّةُ الْقِيادِيَّةُ لِلشَّيْخِ زايِدٍ', 3, 'ص 86–89 · وَالْكِتابُ ص 113–115', true, '🎯 أُلَخِّصُ أَهَمَّ الصِّفاتِ الَّتِي اكْتَسَبَهَا الشَّيْخُ زايِدٌ، وَأُناقِشُ الْمُرْتَكَزاتِ الَّتي شَكَّلَتْ أَعْماقَ شَخْصِيَّتِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُلَخِّصُ أَهَمَّ الصِّفاتِ الشَّخْصِيَّةِ الَّتِي اكْتَسَبَها نَتيجَةَ تَأَثُّرِهِ بِالْبيئَةِ وَالْمُجْتَمَعِ الْقَبَلِيِّ.',1),('أُناقِشُ أَهَمَّ الْعَناصِرِ الَّتي شَكَّلَتِ الْمُرْتَكَزاتِ الْأَساسِيَّةَ في أَعْماقِهِ.',2),('أُثَمِّنُ جُهودَهُ وَإِنْجازاتِهِ في التَّحَوُّلِ الْكَبيرِ لِلدَّوْلَةِ الِاتِّحادِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الشَّخْصِيَّةُ الْقِيادِيَّةُ لِلشَّيْخِ زايِدٍ', 'مَعَ مُلاحَظَةِ أَنَّ الطَّبيعَةَ الْأَبَوِيَّةَ لِلْعَلاقَةِ بَيْنَ الشَّعْبِ وَالْقادَةِ الْكِبارِ في الْإِماراتِ، لا تَتَعارَضُ عَلَى الْإِطْلاقِ مَعَ حَداثَةِ بُنْيانِ الدَّوْلَةِ، لِأَنَّ الْأُبُوَّةَ مِنْ مُمَيِّزاتِ التَّكْوينِ الْقَبَلِيِّ الَّذي يَرْجِعُ إِلَيْهِ أَصْلُ الْإِماراتِيّينَ الَّذينَ يَنْحَدِرونَ مِنَ الْقَبائِلِ الَّتِي اسْتَوْطَنَتْ هٰذَا الْجُزْءَ مِنَ الْجَزيرَةِ الْعَرَبِيَّةِ. بَيْنَما تُوَلِّدُ الْمَسْحَةُ الْأَبَوِيَّةُ الَّتي تَسْري بَيْنَ الْقِيادَةِ وَالشَّعْبِ طاقَةً مُضاعَفَةً وَقَدْرًا كَبيرًا مِنَ الِاهْتِمامِ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 114)', 'ص 86–89 · وَالْكِتابُ ص 113–115', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْعُنْصُرُ الْأَوَّلُ مِنْ مُرْتَكَزاتِ شَخْصِيَّةِ الشَّيْخِ زايِدٍ هُوَ:','[{"id": "a", "text": "طَبيعَةُ الْمَكانِ وَالْبيئَةُ الطَّبيعِيَّةُ"}, {"id": "b", "text": "الْبِنْيَةُ الْأَخْلاقِيَّةُ"}, {"id": "c", "text": "الْبِنْيَةُ السِّياسِيَّةُ"}]'),('الْبِنْيَةُ الْأَخْلاقِيَّةُ تَتَمَثَّلُ إِلى حَدٍّ بَعيدٍ في:','[{"id": "a", "text": "مَبْدَإِ الشَّرَفِ"}, {"id": "b", "text": "الزَّعامَةِ الْقَبَلِيَّةِ"}, {"id": "c", "text": "طَبيعَةِ الْمَكانِ"}]'),('أَدَّتِ الْقَبيلَةُ في حالَةِ الشَّيْخِ زايِدٍ وَظيفَةً:','[{"id": "a", "text": "مُزْدَوِجَةً"}, {"id": "b", "text": "واحِدَةً مَحْدودَةً"}, {"id": "c", "text": "عابِرَةً"}]'),('مِنَ الثُّنائِيّاتِ الَّتي وَفَّقَ بَيْنَها الشَّيْخُ زايِدٌ:','[{"id": "a", "text": "التُّراثُ وَالْمُعاصَرَةُ"}, {"id": "b", "text": "الشَّرْقُ وَالْغَرْبُ"}, {"id": "c", "text": "الْبَرُّ وَالْبَحْرُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T1-L9', 'الرُّؤْيَةُ الرّابِعَةُ: الشَّيْخُ زايِدٌ وَمَرْحَلَةُ التَّمْهيدِ لِلِاتِّحادِ', 3, 'ص 90–95 · وَالْكِتابُ ص 117–128', true, '🎯 أَسْتَنْتِجُ الْجَوانِبَ الَّتي أَثَّرَتْ في قِيامِ الدَّوْلَةِ، وَأُلَخِّصُ الْخَطَّ الزَّمَنِيَّ لِخُطُواتِ قِيامِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ أَهَمَّ الْجَوانِبِ الَّتي أَثَّرَتْ في قِيامِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',1),('أُلَخِّصُ الْخَطَّ الزَّمَنِيَّ لِخُطُواتِ قِيامِ الدَّوْلَةِ.',2),('أُقَدِّرُ جُهودَ الشَّيْخِ زايِدٍ وَالشَّيْخِ راشِدِ بْنِ سَعيدٍ آلِ مَكْتومٍ في قِيامِ الدَّوْلَةِ الِاتِّحادِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الشَّيْخُ زايِدٌ وَمَرْحَلَةُ التَّمْهيدِ لِلِاتِّحادِ', 'لَقَدِ اسْتَثْمَرَ الشَّيْخُ زايِدٌ كُلَّ الْمُعْطَياتِ التّاريخِيَّةِ وَالْمَوْضوعِيَّةِ لِكَيْ يُحَصِّنَ سَعْيَهُ الْجادَّ لِلْعَمَلِ مِنْ أَجْلِ إِقامَةِ الدَّوْلَةِ الِاتِّحادِيَّةِ، مُعَزَّزًا بِفِكْرٍ اتِّحادِيٍّ تَبَلْوَرَ عِنْدَهُ بِشَكْلٍ أَوْضَحَ وَامْتَلَكَ في مُخَيِّلَتِهِ وَتَفْكيرِهِ قُوَّةً وَطاقَةً تَجاوَزَتِ الْإِبْقاءَ عَلَى الْفِكْرِ الِاتِّحادِيِّ حَبيسَ الذّاكِرَةِ، وُصولًا إِلَى الْإِقْدامِ عَلى تَفْعيلِهِ وَتَجْسيدِهِ في الْواقِعِ بِإِقامَةِ الِاتِّحادِ عَبْرَ خُطُواتٍ تَمْهيدِيَّةٍ جَريئَةٍ. (الْعُمْقُ التّاريخِيُّ لِلْفِكْرِ الِاتِّحادِيِّ، ص 119)', 'ص 90–95 · وَالْكِتابُ ص 117–128', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عُقِدَ اجْتِماعُ الشَّيْخِ زايِدٍ وَالشَّيْخِ راشِدٍ يَوْمَ:','[{"id": "a", "text": "18 فِبْرايِرَ 1968 م"}, {"id": "b", "text": "2 ديسَمْبِرَ 1971 م"}, {"id": "c", "text": "25 مايو 1981 م"}]'),('أَعْلَنَتْ حُكومَةُ حِزْبِ الْعُمّالِ في بِريطانْيا نِيَّةَ الِانْسِحابِ مِنَ الْخَليجِ عامَ:','[{"id": "a", "text": "1968 م"}, {"id": "b", "text": "1958 م"}, {"id": "c", "text": "1979 م"}]'),('مِنَ الْخُطُواتِ الْكُبْرى في سَنَواتِ الدَّوْلَةِ الْأولى:','[{"id": "a", "text": "تَوْحيدُ الْقُوّاتِ الْمُسَلَّحَةِ"}, {"id": "b", "text": "إِنْشاءُ مَجْلِسِ الْإِماراتِ الْمُتَصالِحَةِ"}, {"id": "c", "text": "تَوْقيعُ مُعاهَدَةِ 1820 م"}]'),('انْسَحَبَتْ مِنْ مَشْروعِ الِاتِّحادِ التُّساعِيِّ:','[{"id": "a", "text": "الْبَحْرَيْنُ وَقَطَرُ"}, {"id": "b", "text": "الْفُجَيْرَةُ وَعَجْمانُ"}, {"id": "c", "text": "الشّارِقَةُ وَرَأْسُ الْخَيْمَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;