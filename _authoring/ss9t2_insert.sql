
insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 2, 1, 'الْوَحْدَةُ الْخامِسَةُ: الْمَلامِحُ الْبَشَرِيَّةُ لِلْوَطَنِ الْعَرَبِيِّ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=2
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T2-L1', 'سُكّانُ الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 12–23', true, '🎯 أَشْرَحُ الْعَوامِلَ الْمُؤَثِّرَةَ في نُمُوِّ السُّكّانِ وَتَوْزيعِهِمْ في الْوَطَنِ الْعَرَبِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَشْرَحُ الْعَوامِلَ الْمُؤَثِّرَةَ في نُمُوِّ السُّكّانِ وَتَوْزيعِهِمْ في الْوَطَنِ الْعَرَبِيِّ.',1),('أُمَيِّزُ بَيْنَ التَّرْكيبِ الْعُمْرِيِّ وَالتَّرْكيبِ النَّوْعِيِّ لِلسُّكّانِ.',2),('أَسْتَنْتِجُ مِنَ الْخَرائِطِ وَالْجَداوِلِ الْحَقائِقَ ذاتَ الْعَلاقَةِ بِتَرْكيبِ السُّكّانِ وَتَوْزيعِهِمْ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'سُكّانُ الْوَطَنِ الْعَرَبِيِّ', 'يَعودُ الْعَرَبُ في أُصولِهِمْ إِلى شِبْهِ الْجَزيرَةِ الْعَرَبِيَّةِ، حَيْثُ هاجَروا مِنْها إِلى جَميعِ أَنْحاءِ الْوَطَنِ الْعَرَبِيِّ، وَهُمْ يَرْتَبِطونَ بِرَوابِطَ مُتَعَدِّدَةٍ، وَيَتَّصِفونَ بِخَصائِصَ وَسِماتٍ مُشْتَرَكَةٍ، وَتَتَبايَنُ الدُّوَلُ الْعَرَبِيَّةُ مِنْ حَيْثُ عَدَدُ سُكّانِها وَمُعَدَّلاتُ نُمُوِّهِمْ، وَتَنَوُّعُ تَرْكيبِهِمُ الْعُمْرِيِّ وَالنَّوْعِيِّ، وَاخْتِلافُ تَوْزيعِهِمْ مِنْ مِنْطَقَةٍ لِأُخْرى.', 'ص 12–23', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَلَغَ عَدَدُ سُكّانِ الْوَطَنِ الْعَرَبِيِّ عامَ 2018 م حَوالَيْ:','[{"id": "a", "text": "415 مِلْيونَ نَسَمَةٍ"}, {"id": "b", "text": "406.5 مِلْيونَ نَسَمَةٍ"}, {"id": "c", "text": "31 مِلْيونَ نَسَمَةٍ"}]'),('الزِّيادَةُ الطَّبيعِيَّةُ لِلسُّكّانِ هِيَ:','[{"id": "a", "text": "الْفَرْقُ بَيْنَ مُعَدَّلِ الْمَواليدِ وَمُعَدَّلِ الْوَفَياتِ"}, {"id": "b", "text": "النّاتِجَةُ عَنِ الْهِجْرَةِ"}, {"id": "c", "text": "نِسْبَةُ الذُّكورِ إِلَى الْإِناثِ"}]'),('بَلَغَتِ الْكَثافَةُ السُّكّانِيَّةُ الْعامَّةُ في الْوَطَنِ الْعَرَبِيِّ عامَ 2017 م:','[{"id": "a", "text": "31 نَسَمَةً/كم²"}, {"id": "b", "text": "1924 نَسَمَةً/كم²"}, {"id": "c", "text": "4 نَسَماتٍ/كم²"}]'),('مِنَ الْعَوامِلِ الْبَشَرِيَّةِ الْمُؤَثِّرَةِ في تَوْزيعِ السُّكّانِ:','[{"id": "a", "text": "الْمُواصَلاتُ"}, {"id": "b", "text": "التُّرْبَةُ"}, {"id": "c", "text": "التَّضاريسُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T2-L2', 'قَضايا سُكّانِيَّةٌ مُعاصِرَةٌ في الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 24–31', true, '🎯 أُناقِشُ الْقَضايَا السُّكّانِيَّةَ الْمُعاصِرَةَ، وَأُقَدِّمُ حُلولًا وَمُقْتَرَحاتٍ مُناسِبَةً لَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُناقِشُ الْقَضايَا السُّكّانِيَّةَ الْمُعاصِرَةَ: الِازْدِحامَ السُّكّانِيَّ وَالْبَطالَةَ.',1),('أَسْتَنْتِجُ أَسْبابَ الْمُشْكِلاتِ السُّكّانِيَّةِ في الْوَطَنِ الْعَرَبِيِّ.',2),('أُقَدِّمُ حُلولًا وَمُقْتَرَحاتٍ مُناسِبَةً لِلْمُشْكِلاتِ السُّكّانِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'قَضايا سُكّانِيَّةٌ مُعاصِرَةٌ في الْوَطَنِ الْعَرَبِيِّ', 'يُواجِهُ السُّكّانُ في الدُّوَلِ الْعَرَبِيَّةِ بَعْضَ الْمُشْكِلاتِ السُّكّانِيَّةِ الَّتي تَتَبايَنُ مِنْ دَوْلَةٍ إِلى أُخْرى، وَتُؤَثِّرُ تَأْثيرًا كَبيرًا عَلى خُطَطِ التَّنْمِيَةِ الِاجْتِماعِيَّةِ وَالِاقْتِصادِيَّةِ، وَخاصَّةً في مَجالِ اسْتِثْمارِ الْمَوارِدِ الطَّبيعِيَّةِ، وَحِمايَتِها مِنَ التَّدَهْوُرِ.', 'ص 24–31', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الِازْدِحامُ السُّكّانِيُّ يُقْصَدُ بِهِ:','[{"id": "a", "text": "ارْتِفاعُ عَدَدِ السُّكّانِ في الْكيلومِتْرِ الْمُرَبَّعِ الْواحِدِ"}, {"id": "b", "text": "زِيادَةُ عَدَدِ الْمُدُنِ"}, {"id": "c", "text": "ارْتِفاعُ مُعَدَّلِ الْوَفَياتِ"}]'),('مِنْ نَتائِجِ الِازْدِحامِ السُّكّانِيِّ:','[{"id": "a", "text": "الْأَحْياءُ الْعَشْوائِيَّةُ"}, {"id": "b", "text": "تَنْمِيَةُ الرّيفِ"}, {"id": "c", "text": "تَطْويرُ التَّعْليمِ"}]'),('الْبَطالَةُ الْمُقَنَّعَةُ هِيَ:','[{"id": "a", "text": "الْعُمّالُ الَّذينَ يَحْصُلونَ عَلى أُجورٍ دونَ احْتِياجٍ حَقيقِيٍّ لِأَعْمالِهِمْ"}, {"id": "b", "text": "الْعاطِلونَ عَنِ الْعَمَلِ"}, {"id": "c", "text": "الْعُمّالُ الْوافِدونَ"}]'),('مِنْ حُلولِ الْقَضايَا السُّكّانِيَّةِ:','[{"id": "a", "text": "تَنْمِيَةُ الرّيفِ وَالْحَدُّ مِنَ الْهِجْرَةِ إِلَى الْمُدُنِ"}, {"id": "b", "text": "زِيادَةُ الْهِجْرَةِ إِلَى الْمُدُنِ"}, {"id": "c", "text": "تَرْكيزُ الْخَدَماتِ في الْعاصِمَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 2, 2, 'الْوَحْدَةُ السّادِسَةُ: تاريخُ الْوَطَنِ الْعَرَبِيِّ الْحَديثُ وَالْمُعاصِرُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=2
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T2-L3', 'خَليجُنا عَرَبِيٌّ', 3, 'ص 34–41', true, '🎯 أَسْتَنْتِجُ أَهَمِّيَّةَ مَوْقِعِ الْخَليجِ الْعَرَبِيِّ، وَأُقَدِّمُ أَدِلَّةً تاريخِيَّةً تُثْبِتُ عُروبَتَهُ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ أَهَمِّيَّةَ مَوْقِعِ الْخَليجِ الْعَرَبِيِّ.',1),('أُحَدِّدُ التَّسْمِياتِ الْمُخْتَلِفَةَ لِلْخَليجِ الْعَرَبِيِّ عَبْرَ الْعُصورِ التّاريخِيَّةِ.',2),('أُقَدِّمُ أَدِلَّةً تاريخِيَّةً تُثْبِتُ عُروبَةَ الْخَليجِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'خَليجُنا عَرَبِيٌّ', 'اسْتَقَرَّ الْعَرَبُ عَلى ضِفافِ الْخَليجِ الْعَرَبِيِّ بِساحِلَيْهِ الشَّرْقِيِّ وَالْغَرْبِيِّ وَجُزُرِهِ، وَأَقاموا حَضاراتٍ عَريقَةً ضارِبَةً الْعُمْقَ في الْقِدَمِ؛ فَأَسَّسُوا الْمُدُنَ وَالْمَمالِكَ الْعَرَبِيَّةَ وَتَحَكَّموا في طُرُقِ التِّجارَةِ الْعالَمِيَّةِ بَيْنَ الشَّرْقِ وَالْغَرْبِ عَبْرَ مِياهِ الْخَليجِ الْعَرَبِيِّ.', 'ص 34–41', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الدُّوَلِ الْعَرَبِيَّةِ الْمُطِلَّةِ عَلَى الْخَليجِ الْعَرَبِيِّ:','[{"id": "a", "text": "سَبْعُ دُوَلٍ"}, {"id": "b", "text": "خَمْسُ دُوَلٍ"}, {"id": "c", "text": "تِسْعُ دُوَلٍ"}]'),('(ماجانُ) اسْمٌ سومَرِيٌّ يَدُلُّ عَلى:','[{"id": "a", "text": "حَضارَةِ مِنْطَقَةِ الْإِماراتِ وَعُمانَ قَديمًا"}, {"id": "b", "text": "الْبَحْرَيْنِ"}, {"id": "c", "text": "الْبَصْرَةِ"}]'),('أَصْبَحَ الْخَليجُ الْعَرَبِيُّ بُحَيْرَةً إِسْلامِيَّةً بَعْدَ:','[{"id": "a", "text": "مَوْقِعَةِ ذاتِ السَّلاسِلِ 634 م"}, {"id": "b", "text": "سُقوطِ بَغْدادَ 1258 م"}, {"id": "c", "text": "الْفَتْحِ الْعُثْمانِيِّ"}]'),('الْإِقْليمُ الْمَدارِيُّ هُوَ الْمِنْطَقَةُ الْمُمْتَدَّةُ بَيْنَ دائِرَتَيْ عَرْضِ:','[{"id": "a", "text": "8 – 18 دَرَجَةً شَمالًا وَجَنوبًا"}, {"id": "b", "text": "22 – 26 دَرَجَةً شَمالًا"}, {"id": "c", "text": "2 – 37 دَرَجَةً"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T2-L4', 'التّاريخُ فِكْرٌ يَتَحَدَّثُ', 3, 'ص 42–53', true, '🎯 أَسْتَنْتِجُ أَهَمِّيَّةَ التّاريخِ في حَياةِ الْأُمَمِ وَالشُّعوبِ، وَأُثَمِّنُ جُهودَ بِلادي في صَوْنِ التُّراثِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ أَهَمِّيَّةَ التّاريخِ في حَياةِ الْأُمَمِ وَالشُّعوبِ.',1),('أُفَسِّرُ تَدْميرَ الْمَغولِ لِبَيْتِ الْحِكْمَةِ في بَغْدادَ.',2),('أُثَمِّنُ جُهودَ حُكومَةِ دَوْلَةِ الْإِماراتِ في مَجالِ صَوْنِ وَحِمايَةِ التُّراثِ الثَّقافِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'التّاريخُ فِكْرٌ يَتَحَدَّثُ', 'الْعِراقُ بَلَدٌ عَرَبِيٌّ مُسْلِمٌ، لَهُ حَضارَةٌ تَضْرِبُ بِجُذورِها في أَعْماقِ التّاريخِ، تَعَرَّضَتْ قَديمًا إِلى تَدْميرِ مَعالِمِها، وَحَرْقِ مَكْتَباتِها، وَسَرِقَةِ آثارِها؛ وَذٰلِكَ أَنَّ أَيادِيَ الْهَدْمِ وَالتَّخَلُّفِ تَسْعى جاهِدَةً لِتَدْميرِ الْحَضاراتِ.', 'ص 42–53', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَنى مَدينَةَ بَغْدادَ الْخَليفَةُ:','[{"id": "a", "text": "أَبو جَعْفَرٍ الْمَنْصورُ"}, {"id": "b", "text": "هارونُ الرَّشيدُ"}, {"id": "c", "text": "الْمَأْمونُ"}]'),('تَقَدَّمَ الْمَغولُ بِاتِّجاهِ بَغْدادَ بِقِيادَةِ:','[{"id": "a", "text": "هولاكو عامَ 656 هـ/1258 م"}, {"id": "b", "text": "الْمُسْتَعْصِمِ"}, {"id": "c", "text": "تيمورْلَنْك"}]'),('أُطْلِقَتْ مُبادَرَةُ عامِ الْقِراءَةِ في دَوْلَةِ الْإِماراتِ عامَ:','[{"id": "a", "text": "2016 م"}, {"id": "b", "text": "2019 م"}, {"id": "c", "text": "1945 م"}]'),('اخْتيرَتِ الشّارِقَةُ عاصِمَةً عالَمِيَّةً لِلْكِتابِ لِعامِ:','[{"id": "a", "text": "2019 م"}, {"id": "b", "text": "2016 م"}, {"id": "c", "text": "2011 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 2, 3, 'الْوَحْدَةُ السّابِعَةُ: الْإِماراتُ — اقْتِصادًا مَعْرِفِيًّا وَمَنارَةً ثَقافِيَّةً وَعاصِمَةً لِلتَّسامُحِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=2
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T2-L5', 'الْإِماراتُ وَالِاقْتِصادُ الْمَعْرِفِيُّ', 3, 'ص 56–70', true, '🎯 أُوَضِّحُ رَكائِزَ الِاقْتِصادِ الْمَعْرِفِيِّ، وَأُقَدِّرُ جُهودَ بِلادي لِلْوُصولِ إِلَى اقْتِصادٍ مَعْرِفِيٍّ تَنافُسِيٍّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ رَكائِزَ الِاقْتِصادِ الْمَعْرِفِيِّ.',1),('أُقارِنُ بَيْنَ الِاقْتِصادِ الْمَعْرِفِيِّ وَالِاقْتِصادِ التَّقْليدِيِّ الْقَديمِ.',2),('أُقَدِّرُ جُهودَ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ لِلْوُصولِ إِلَى اقْتِصادٍ مَعْرِفِيٍّ تَنافُسِيٍّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْإِماراتُ وَالِاقْتِصادُ الْمَعْرِفِيُّ', 'الِاقْتِصادُ الْمَعْرِفِيُّ هُوَ ذٰلِكَ الْفَرْعُ مِنْ عِلْمِ الِاقْتِصادِ الَّذي يَهْتَمُّ بِعَوامِلِ تَحْقيقِ الرَّفاهِيَةِ الْعامَّةِ، وَقَدْ حَظِيَتْ عَمَلِيَّةُ تَحَوُّلِ الِاقْتِصادِ الْإِماراتِيِّ مِنَ الِاقْتِصادِ التَّقْليدِيِّ إِلَى اقْتِصادِ الْمَعْرِفَةِ بِأَوْلَوِيَّةٍ رَئيسَةٍ لَدى قِيادَتِنَا الرَّشيدَةِ وَفْقَ رُؤْيَةِ عامِ 2021 م الَّتي أَكَّدَتْ عَلى أَهَمِّيَّةِ الْمَعْرِفَةِ، وَبِناءِ اقْتِصادٍ مَعْرِفِيٍّ مُسْتَدامٍ، كَما جَدَّدَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ رُؤْيَتَها عَبْرَ مِئَوِيَّةِ الْإِماراتِ 2071 م.', 'ص 56–70', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مِنْ رَكائِزِ الِاقْتِصادِ الْمَعْرِفِيِّ:','[{"id": "a", "text": "الْحاكِمِيَّةُ الرَّشيدَةُ"}, {"id": "b", "text": "الْميكَنَةُ"}, {"id": "c", "text": "الْجُهْدُ الْعَضَلِيُّ"}]'),('الْمُحَرِّكُ الْأَساسِيُّ لِلِاقْتِصادِ الْمَعْرِفِيِّ هُوَ:','[{"id": "a", "text": "الرَّقْمَنَةُ (Digitization)"}, {"id": "b", "text": "الْميكَنَةُ (Mechanisation)"}, {"id": "c", "text": "رَأْسُ الْمالِ الْمادِّيُّ"}]'),('احْتَلَّتْ دَوْلَةُ الْإِماراتِ في مُؤَشِّرِ الْمَعْرِفَةِ الْعالَمِيِّ 2019 م الْمَرْكَزَ:','[{"id": "a", "text": "18 عالَمِيًّا وَالْأَوَّلَ عَرَبِيًّا"}, {"id": "b", "text": "1 عالَمِيًّا"}, {"id": "c", "text": "27 عالَمِيًّا"}]'),('إِنْتاجُ الْمَعْرِفَةِ يُقْصَدُ بِهِ:','[{"id": "a", "text": "الِابْتِكارُ وَالِاكْتِشافُ وَالِاخْتِراعُ"}, {"id": "b", "text": "إِدارَةُ الْمَعْرِفَةِ"}, {"id": "c", "text": "تَخْزينُ الْمَعْرِفَةِ فَقَطْ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T2-L6', 'قُبَّةُ النّورِ', 3, 'ص 71–83', true, '🎯 أَسْتَنْتِجُ أَوْجُهَ التَّعاوُنِ الثَّقافِيِّ بَيْنَ الْإِماراتِ وَفَرَنْسا، وَأُبَيِّنُ رِسالَةَ اللّوفْرِ أَبوظَبي لِلْعالَمِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ أَوْجُهَ التَّعاوُنِ الثَّقافِيِّ بَيْنَ دَوْلَةِ الْإِماراتِ وَالْجُمْهورِيَّةِ الْفَرَنْسِيَّةِ.',1),('أُتابِعُ مَراحِلَ التَّواصُلِ الْحَضارِيِّ بَيْنَ الْأُمَمِ وَالشُّعوبِ عَبْرَ التّاريخِ.',2),('أُبَيِّنُ رِسالَةَ مُتْحَفِ اللّوفْرِ أَبوظَبي لِلْعالَمِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'قُبَّةُ النّورِ', 'مُتْحَفُ اللّوفْرِ أَبوظَبي تُحْفَةٌ مِعْمارِيَّةٌ، وَمَفْخَرَةٌ ثَقافِيَّةٌ، وَمَحَطَّةٌ فَنِّيَّةٌ تَجْمَعُ الشَّرْقَ وَالْغَرْبَ، قَدَّمَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ مِنْ خِلالِهِ رِسالَةً إِلَى الْعالَمِ فَحْواها أَنَّنا نَسْتَطيعُ مُحارَبَةَ الْجَهْلِ بِالْفُنونِ، وَالظَّلامِ بِالنّورِ، وَالتَّطَرُّفِ الْفِكْرِيِّ بِالْجَمالِ الْفَنِّيِّ الَّذي أَبْدَعَهُ الْعَقْلُ الْإِنْسانِيُّ.', 'ص 71–83', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('«قُبَّةُ النّورِ» يُقْصَدُ بِها:','[{"id": "a", "text": "مُتْحَفُ اللّوفْرِ أَبوظَبي"}, {"id": "b", "text": "بُرْجُ إيفِلَ"}, {"id": "c", "text": "مَنارَةُ السَّعْدِيّاتِ"}]'),('افْتُتِحَ مُتْحَفُ اللّوفْرِ أَبوظَبي في:','[{"id": "a", "text": "11 نوفَمْبِرَ 2017 م"}, {"id": "b", "text": "2007 م"}, {"id": "c", "text": "2019 م"}]'),('عَصْرُ النَّهْضَةِ تَسْمِيَةٌ لِلْمَرْحَلَةِ الِانْتِقالِيَّةِ مِنَ الْقَرْنِ:','[{"id": "a", "text": "الثّالِثَ عَشَرَ حَتَّى السّادِسَ عَشَرَ"}, {"id": "b", "text": "الثّامِنِ حَتَّى الْعاشِرِ"}, {"id": "c", "text": "السّابِعَ عَشَرَ حَتَّى التّاسِعَ عَشَرَ"}]'),('يَعيشُ عَلى أَرْضِ دَوْلَةِ الْإِماراتِ أَكْثَرُ مِنْ:','[{"id": "a", "text": "200 جِنْسِيَّةٍ"}, {"id": "b", "text": "50 جِنْسِيَّةً"}, {"id": "c", "text": "20 جِنْسِيَّةً"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y9-T2-L7', 'وَثيقَةُ «مَكَّةَ الْمُكَرَّمَةِ» (2019 م) — دِراسَةٌ تَحْليلِيَّةٌ', 3, 'ص 84–97', true, '🎯 أُحَلِّلُ وَثيقَةَ «مَكَّةَ الْمُكَرَّمَةِ 2019 م» مِنْ حَيْثُ مَفْهومُها وَأَهْدافُها وَأُسُسُها وَمَبادِئُها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَلِّلُ وَثيقَةَ «مَكَّةَ الْمُكَرَّمَةِ 2019 م» مِنْ حَيْثُ مَفْهومُها وَأَهْدافُها وَأُسُسُها وَمَبادِئُها.',1),('أُناقِشُ أَهَمِّيَّةَ الْحِوارِ الْحَضارِيِّ وَالتَّعايُشِ السِّلْمِيِّ وَالْعَيْشِ الْمُشْتَرَكِ بَيْنَ شُعوبِ الْعالَمِ.',2),('أَسْتَخْدِمُ مَهارَةَ تَحْليلِ الْوَثائِقِ مِنْ مَصادِرِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'وَثيقَةُ «مَكَّةَ الْمُكَرَّمَةِ» (2019 م) — دِراسَةٌ تَحْليلِيَّةٌ', 'وَثيقَةُ «مَكَّةَ الْمُكَرَّمَةِ» هِيَ دُسْتورٌ تاريخِيٌّ يُرْسي قِيَمَ التَّعايُشِ بَيْنَ أَتْباعِ الْأَدْيانِ وَالثَّقافاتِ وَالْأَعْراقِ وَالْمَذاهِبِ في الْبُلْدانِ الْإِسْلامِيَّةِ مِنْ جِهَةٍ، وَتَحْقيقِ السِّلْمِ وَالْوِئامِ بَيْنَ مُكَوِّناتِ الْمُجْتَمَعِ الْإِنْسانِيِّ كافَّةً مِنْ جِهَةٍ ثانِيَةٍ.', 'ص 84–97', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَظَّمَ الْمُؤْتَمَرَ الَّذي صَدَرَتْ عَنْهُ وَثيقَةُ مَكَّةَ الْمُكَرَّمَةِ:','[{"id": "a", "text": "رابِطَةُ الْعالَمِ الْإِسْلامِيِّ"}, {"id": "b", "text": "مُنَظَّمَةُ الْيونِسْكو"}, {"id": "c", "text": "جامِعَةُ الدُّوَلِ الْعَرَبِيَّةِ"}]'),('صَدَرَتْ وَثيقَةُ مَكَّةَ الْمُكَرَّمَةِ في:','[{"id": "a", "text": "30 مايو 2019 م"}, {"id": "b", "text": "فَبْرايِرَ 2019 م"}, {"id": "c", "text": "15 يونْيو 2023 م"}]'),('عَدَدُ الدُّوَلِ الَّتي مَثَّلَهَا الْموَقِّعونَ عَلَى الْوَثيقَةِ:','[{"id": "a", "text": "139 دَوْلَةً"}, {"id": "b", "text": "27 دَوْلَةً"}, {"id": "c", "text": "57 دَوْلَةً"}]'),('مِنْ أُسُسِ الْوَثيقَةِ وَمَبادِئِها:','[{"id": "a", "text": "رَفْضُ الْعِباراتِ وَالشِّعاراتِ الْعُنْصُرِيَّةِ"}, {"id": "b", "text": "تَبْريرُ الصِّدامِ الْحَضارِيِّ"}, {"id": "c", "text": "الرَّبْطُ بَيْنَ الدّينِ وَالْمُمارَساتِ السِّياسِيَّةِ الْخاطِئَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 2, 4, 'الْوَحْدَةُ الثّامِنَةُ: زايِدٌ — هُوِيَّةٌ وَمَواقِفُ مَشْهودَةٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=2
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T2-L8', 'زايِدٌ وَالْمَرْأَةُ الْإِماراتِيَّةُ', 3, 'ص 100–111', true, '🎯 أُناقِشُ دَوْرَ الْمَرْأَةِ الْإِماراتِيَّةِ قَبْلَ الِاتِّحادِ وَبَعْدَهُ، وَأُثَمِّنُ مَكانَتَها في مَسيرَةِ التَّنْمِيَةِ وَالْبِناءِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُناقِشُ الْعَوامِلَ الَّتي أَسْهَمَتْ في تَكْوينِ شَخْصِيَّةِ الْمَرْأَةِ الْإِماراتِيَّةِ قَديمًا.',1),('أُمَيِّزُ بَيْنَ الْأَدْوارِ الَّتي قامَتْ بِهَا الْمَرْأَةُ الْإِماراتِيَّةُ قَبْلَ الِاتِّحادِ وَبَعْدَهُ.',2),('أَسْتَخْلِصُ الْمَناصِبَ الْقِيادِيَّةَ الْبارِزَةَ لِلْمَرْأَةِ في حُكومَةِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'زايِدٌ وَالْمَرْأَةُ الْإِماراتِيَّةُ', 'حَظِيَتِ الْمَرْأَةُ الْإِماراتِيَّةُ بِاحْتِرامٍ كَبيرٍ مِنْ قِبَلِ الْمُجْتَمَعِ الْإِماراتِيِّ، امْتِثالًا لِتَعاليمِ الدّينِ الْإِسْلامِيِّ الَّذي حَفِظَ كَرامَتَها، وَصانَ حُقوقَها، وَرَفَعَ مِنْ شَأْنِها؛ فَهِيَ أَساسُ التَّرْبِيَةِ الْأَخْلاقِيَّةِ، وَمَصْنَعُ الرِّجالِ وَالْأَبْطالِ، وَصَلاحُ الْمُجْتَمَعِ وَبِناؤُهُ.', 'ص 100–111', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْكَلَأُ هُوَ:','[{"id": "a", "text": "ما تَرْعاهُ الْماشِيَةُ مِنْ عُشْبٍ أَخْضَرَ"}, {"id": "b", "text": "نَوْعٌ مِنَ السِّلالِ"}, {"id": "c", "text": "بِئْرُ ماءٍ"}]'),('مِنَ الْأَدْوارِ الْإِنْتاجِيَّةِ لِلْمَرْأَةِ الْإِماراتِيَّةِ قَديمًا:','[{"id": "a", "text": "الْغَزْلُ وَالْحِياكَةُ"}, {"id": "b", "text": "تَمْثيلُ الدَّوْلَةِ في الْمَحافِلِ"}, {"id": "c", "text": "الْعَمَلُ في الْوَزاراتِ"}]'),('رُفِعَتْ نِسْبَةُ تَمْثيلِ الْمَرْأَةِ في الْمَجْلِسِ الْوَطَنِيِّ الِاتِّحادِيِّ 2019 م إِلى:','[{"id": "a", "text": "50%"}, {"id": "b", "text": "25%"}, {"id": "c", "text": "30%"}]'),('السِّلالُ شَكْلٌ مِنْ أَشْكالِ:','[{"id": "a", "text": "الْخوصِ"}, {"id": "b", "text": "الصّوفِ"}, {"id": "c", "text": "الْفَخّارِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T2-L9', 'هُوِيَّتي مَسْؤولِيَّتي', 3, 'ص 112–122', true, '🎯 أَسْتَنْتِجُ شُروطَ الْمَسْؤولِيَّةِ وَصِفاتِها، وَأُوَضِّحُ مَسْؤولِيّاتي في أُسْرَتي وَمَدْرَسَتي وَوَطَني.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ شُروطَ الْمَسْؤولِيَّةِ وَأُعَدِّدُ صِفاتِها.',1),('أُوَضِّحُ مَسْؤولِيّاتِ الْفَرْدِ في أُسْرَتِهِ وَمَدْرَسَتِهِ وَوَطَنِهِ.',2),('أَصِفُ دَوْري كَفَرْدٍ في الْمُحافَظَةِ عَلَى الْهُوِيَّةِ الْوَطَنِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'هُوِيَّتي مَسْؤولِيَّتي', 'تُعَدُّ الْمَسْؤولِيَّةُ أَساسَ بِناءِ الْمُجْتَمَعِ، وَيُمْكِنُ تَعْليمُها وَالتَّدَرُّبُ عَلَيْها وَمُمارَسَتُها مُنْذُ الصِّغَرِ؛ فَتَعْليمُ الْأَبْناءِ قِيَمًا حَياتِيَّةً مِنْ شَأْنِهِ أَنْ يُعَزِّزَ قيمَةَ الْمَسْؤولِيَّةِ. إِنَّ الْمَسْؤولِيَّةَ لَيْسَتْ بِالْأَمْرِ السَّهْلِ بَلْ تَأْتي نَتيجَةَ تَرْبِيَةٍ وَإيمانٍ وَاسْتِعْدادٍ وَشُعورٍ وَمُمارَسَةٍ.', 'ص 112–122', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T2-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْمَسْؤولِيَّةُ الِاجْتِماعِيَّةُ هِيَ:','[{"id": "a", "text": "الْتِزامُ الْمَرْءِ بِتَطْبيقِ قَوانينِ الْمُجْتَمَعِ"}, {"id": "b", "text": "الْتِزامُهُ بِأَوامِرِ اللهِ"}, {"id": "c", "text": "تَحَمُّلُ نَتائِجِ تَصَرُّفاتِهِ"}]'),('مِنْ شُروطِ الْمَسْؤولِيَّةِ:','[{"id": "a", "text": "التَّخْطيطُ وَالتَّنْظيمُ الْجَيِّدُ"}, {"id": "b", "text": "الِاعْتِمادُ عَلَى الْآخَرينَ"}, {"id": "c", "text": "تَأْجيلُ الْواجِباتِ"}]'),('مِنْ فَوائِدِ تَحَمُّلِ الْمَسْؤولِيَّةِ:','[{"id": "a", "text": "تَقْوِيَةُ الشَّخْصِيَّةِ"}, {"id": "b", "text": "زِيادَةُ الِاتِّكالِيَّةِ"}, {"id": "c", "text": "قِلَّةُ الْخِبْراتِ"}]'),('مِنْ مَسْؤولِيّاتِكَ تِجاهَ مَدْرَسَتِكَ:','[{"id": "a", "text": "الْمُحافَظَةُ عَلى مَرافِقِ الْمَدْرَسَةِ"}, {"id": "b", "text": "تَنْظيمُ غُرْفَتِكَ"}, {"id": "c", "text": "مُساعَدَةُ الْوالِدَيْنِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;