begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 3, 1, 'الْوَحْدَةُ التّاسِعَةُ: الْوَطَنُ الْعَرَبِيُّ وَإِدارَةُ الْمَوارِدِ وَالطّاقَةِ وَالدَّخْلِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=3
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T3-L1', 'إِدارَةُ الْمَواردِ وَالْأَنْشِطَةِ الِاقْتِصادِيَّةِ في الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 14–29', true, '🎯 أُناقِشُ تَوْزيعَ الْمَواردِ وَالْأَنْشِطَةِ الِاقْتِصادِيَّةِ، وَأَسْتَخْلِصُ الْعَلاقَةَ بَيْنَ الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُناقِشُ تَوْزيعَ الْمَواردِ وَالْأَنْشِطَةِ الِاقْتِصادِيَّةِ في الْوَطَنِ الْعَرَبِيِّ.',1),('أَسْتَخْلِصُ الْعَلاقَةَ بَيْنَ الْأَمْنِ الْمائِيِّ وَالْأَمْنِ الْغِذائِيِّ وَالْعَوامِلَ الْمُؤَثِّرَةَ فيهِما.',2),('أُفَسِّرُ ارْتِفاعَ قيمَةِ الْفَجْوَةِ الْغِذائِيَّةِ في بَعْضِ السِّلَعِ الْعَرَبِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'إِدارَةُ الْمَواردِ وَالْأَنْشِطَةِ الِاقْتِصادِيَّةِ في الْوَطَنِ الْعَرَبِيِّ', 'وَيُقْصَدُ بِالْأَمْنِ الْمائِيِّ الْعَرَبِيِّ: «الْمُحافَظَةُ عَلَى الْمَواردِ الْمائِيَّةِ الْمُتاحَةِ في الْوَطَنِ الْعَرَبِيِّ، وَتَرْشيدُ اسْتِخْدامِها، وَعَدَمُ تَلْويثِها، وَالْبَحْثُ عَنْ مَصادِرَ مائِيَّةٍ جَديدَةٍ وَتَطْويرُها». وَالْأَمْنُ الْمائِيُّ هُوَ الْكَمِّيَّةُ الْمُتَوافِرَةُ مِنَ الْماءِ الْجَيِّدِ، وَالْكافي لِلصِّحَّةِ وَالْإِنْتاجِ وَمُتَطَلَّباتِ الْحَياةِ. وَلا يُمْكِنُ تَحْقيقُ التَّنْمِيَةِ الْمُسْتَدامَةِ بِدونِ أَمْنٍ مائِيٍّ في الْعالَمِ. (كِتابُ الطّالِبِ، ص 25)', 'ص 14–29', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يُقَدَّرُ الْإِنْتاجُ الْعَرَبِيُّ مِنَ الْأَسْماكِ عامَ 2018 م بِنَحْوِ:','[{"id": "a", "text": "5.4 مِلْيونِ طَنٍّ"}, {"id": "b", "text": "25.3 مِلْيونِ طَنٍّ"}, {"id": "c", "text": "352.3 مِلْيونِ طَنٍّ"}]'),('تُشَكِّلُ مِساحَةُ الْغاباتِ في الْوَطَنِ الْعَرَبِيِّ نِسْبَةَ:','[{"id": "a", "text": "3.2%"}, {"id": "b", "text": "28%"}, {"id": "c", "text": "44%"}]'),('عَدَدُ الدُّوَلِ الْعَرَبِيَّةِ الَّتي تَقْتَرِبُ مِنْ حَدِّ الْفَقْرِ وَالْعَجْزِ الْمائِيِّ:','[{"id": "a", "text": "15 دَوْلَةً"}, {"id": "b", "text": "5 دُوَلٍ"}, {"id": "c", "text": "22 دَوْلَةً"}]'),('الْفَجْوَةُ الْغِذائِيَّةُ هِيَ الْفَرْقُ بَيْنَ:','[{"id": "a", "text": "الطَّلَبِ عَلَى السِّلَعِ الْغِذائِيَّةِ وَالْإِنْتاجِ الْمَحَلِّيِّ"}, {"id": "b", "text": "الصّادِراتِ وَالْوارِداتِ"}, {"id": "c", "text": "الدَّخْلِ وَالْإِنْفاقِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T3-L2', 'الْأَمْنُ الْمائِيُّ وَالْغِذائِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 3, 'ص 30–45', true, '🎯 أُناقِشُ أَهَمِّيَّةَ مَنْظومَةِ الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ في الْإِماراتِ، وَأَسْتَنْتِجُ التَّحَدِّياتِ وَالْإِسْتْراتيجِيّاتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُناقِشُ أَهَمِّيَّةَ مَنْظومَةِ الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ في دَوْلَةِ الْإِماراتِ.',1),('أَسْتَنْتِجُ الْعَوامِلَ وَالتَّحَدِّياتِ الَّتي تُؤَثِّرُ في تَحْقيقِ الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ.',2),('أُناقِشُ إِسْتْراتيجِيّاتِ الدَّوْلَةِ لِتَحْقيقِ أَمْنِهَا الْمائِيِّ وَالْغِذائِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْأَمْنُ الْمائِيُّ وَالْغِذائِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 'وَانْطِلاقًا مِنْ رُؤْيَةِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ وَأَجِنْدَتِهَا الْوَطَنِيَّةِ وَمِئَوِيَّتِها 2071 في اسْتِشْرافِ الْمُسْتَقْبَلِ، وَمَقولَةِ صاحِبِ السُّمُوِّ الشَّيْخِ مُحَمَّدِ بْنِ راشِدٍ آلِ مَكْتومٍ: «أَمْنُنَا الْغِذائِيُّ وَالْمائِيُّ جُزْءٌ مِنْ أَمْنِنَا الْوَطَنِيِّ»، وَاسْتِدامَةُ مَواردِنا الْغِذائِيَّةِ وَالْمائِيَّةِ ضَمانٌ لِاسْتِدامَةِ التَّنْمِيَةِ في بَلَدِنا؛ توَلِي الدَّوْلَةُ جُهودًا كَبيرَةً لِتَحْقيقِ مَنْظومَةِ أَمْنِهَا الْمائِيِّ وَالْغِذائِيِّ. (كِتابُ الطّالِبِ، ص 31)', 'ص 30–45', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُطْلِقَتْ إِسْتْراتيجِيَّةُ الْأَمْنِ الْمائِيِّ لِدَوْلَةِ الْإِماراتِ لِعامِ:','[{"id": "a", "text": "2036 م"}, {"id": "b", "text": "2051 م"}, {"id": "c", "text": "2071 م"}]'),('تَمَّ إِنْشاءُ مَرْكَزِ الْأَمْنِ الْغِذائِيِّ بِأَبوظَبي عامَ:','[{"id": "a", "text": "2010 م"}, {"id": "b", "text": "2008 م"}, {"id": "c", "text": "2017 م"}]'),('عَدَدُ أَنْواعِ سَلَّةِ الْغِذاءِ الْوَطَنِيَّةِ:','[{"id": "a", "text": "18 نَوْعًا"}, {"id": "b", "text": "38 نَوْعًا"}, {"id": "c", "text": "30 نَوْعًا"}]'),('قالَ الشَّيْخُ زايِدٌ: «مَنْ لا يَمْلِكُ غِذاءَهُ لا يَمْلِكُ …».','[{"id": "a", "text": "قَرارَهُ أَوْ مُسْتَقْبَلَهُ"}, {"id": "b", "text": "أَرْضَهُ أَوْ ماءَهُ"}, {"id": "c", "text": "تِجارَتَهُ أَوْ مالَهُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y9-T3-L3', 'الطّاقَةُ في الْوَطَنِ الْعَرَبِيِّ', 3, 'ص 46–61', true, '🎯 أُمَيِّزُ بَيْنَ مَصادِرِ الطّاقَةِ، وَأُناقِشُ مُسْتَقْبَلَ الطّاقَةِ في دَوْلَةِ الْإِماراتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُمَيِّزُ بَيْنَ مَصادِرِ الطّاقَةِ التَّقْليدِيَّةِ وَالْمُتَجَدِّدَةِ في الْوَطَنِ الْعَرَبِيِّ.',1),('أُوَضِّحُ مَصادِرَ الطّاقَةِ الْمُتَجَدِّدَةِ وَأَهَمَّ مَشْروعاتِها في الْوَطَنِ الْعَرَبِيِّ.',2),('أُناقِشُ مُسْتَقْبَلَ الطّاقَةِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الطّاقَةُ في الْوَطَنِ الْعَرَبِيِّ', 'الطّاقَةُ: الْقُدْرَةُ عَلى أَداءِ عَمَلٍ، أَوِ الْقُدْرَةُ عَلى أَداءِ شُغْلٍ، وَهٰذِهِ الْقُدْرَةُ لا يُمْكِنُ مُشاهَدَتُها، بَلْ يُمْكِنُ مُلاحَظَةُ التَّأْثيرِ الَّذي تُحْدِثُهُ عَلَى الْمادَّةِ، وَقَدْ تَكونُ الطّاقَةُ حَرَكِيَّةً أَوْ كامِنَةً. وَمَصادِرُ الطّاقَةِ التَّقْليدِيَّةِ (غَيْرِ الْمُتَجَدِّدَةِ): هِيَ الَّتي توجَدُ في الطَّبيعَةِ بِكَمِّيّاتٍ مَحْدودَةٍ، وَيَتَناقَصُ حَجْمُها بِسَبَبِ الِاسْتِمْرارِ في اسْتِهْلاكِها. (كِتابُ الطّالِبِ، ص 47)', 'ص 46–61', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَلَغَ إِنْتاجُ الْوَطَنِ الْعَرَبِيِّ مِنَ النَّفْطِ لِعامِ 2018 م:','[{"id": "a", "text": "25.3 مِلْيونَ بَرْميلٍ يَوْمِيًّا"}, {"id": "b", "text": "5.4 مِلْيونِ بَرْميلٍ يَوْمِيًّا"}, {"id": "c", "text": "88 مِلْيونَ بَرْميلٍ يَوْمِيًّا"}]'),('يُغَطّي الْغازُ الطَّبيعِيُّ مِنِ اسْتِهْلاكِ سُكّانِ الْوَطَنِ الْعَرَبِيِّ:','[{"id": "a", "text": "50.5%"}, {"id": "b", "text": "27.0%"}, {"id": "c", "text": "15.5%"}]'),('أُطْلِقَتْ إِسْتْراتيجِيَّةُ الْإِماراتِ لِلطّاقَةِ 2050 م في عامِ:','[{"id": "a", "text": "2017 م"}, {"id": "b", "text": "2010 م"}, {"id": "c", "text": "2021 م"}]'),('نِسْبَةُ الطّاقَةِ النَّظيفَةِ في خَليطِ طاقَةِ الْإِماراتِ 2050 م:','[{"id": "a", "text": "44%"}, {"id": "b", "text": "38%"}, {"id": "c", "text": "12%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y9-T3-L4', 'الدَّخْلُ وَالضَّرائِبُ (الِانْتِقائِيَّةُ وَالْقيمَةُ الْمُضافَةُ في الْإِماراتِ)', 3, 'ص 62–77', true, '🎯 أُوَضِّحُ مَصادِرَ الدَّخْلِ، وَأَسْتَنْتِجُ الْأَهْدافَ الرَّئيسَةَ مِنْ فَرْضِ الدُّوَلِ لِلضَّرائِبِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ أَهَمَّ مَصادِرِ الدَّخْلِ الشَّخْصِيِّ.',1),('أُمَيِّزُ بَيْنَ الدَّخْلِ الْحَقيقِيِّ وَالدَّخْلِ النَّقْدِيِّ، وَأَشْرَحُ مَصادِرَ الْإِيراداتِ الْعامَّةِ لِلدُّوَلِ.',2),('أَسْتَنْتِجُ الْأَهْدافَ الرَّئيسَةَ مِنْ فَرْضِ الدُّوَلِ لِلضَّرائِبِ، وَأُقارِنُ بَيْنَ الضَّريبَةِ الِانْتِقائِيَّةِ وَضَريبَةِ الْقيمَةِ الْمُضافَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الدَّخْلُ وَالضَّرائِبُ (الِانْتِقائِيَّةُ وَالْقيمَةُ الْمُضافَةُ في الْإِماراتِ)', 'الْإِيراداتُ الْعامَّةُ: هِيَ مَصادِرُ الدَّخْلِ الَّتي تَحْصُلُ عَلَيْهَا الدَّوْلَةُ عَلى شَكْلِ أَرْصِدَةٍ مالِيَّةٍ لِتَغْطِيَةِ نَفَقاتِها بِهَدَفِ إِشْباعِ الْحاجاتِ الْعامَّةِ لِلسُّكّانِ. وَالضَّرائِبُ: وَهِيَ عِبارَةٌ عَنْ مَبالِغَ نَقْدِيَّةٍ تَفْرِضُهَا الدُّوَلُ عَلى أَنْواعٍ مِنَ السِّلَعِ أَوْ تَقْتَطِعُها مِنْ دُخولٍ وَثَرَواتِ أَفْرادِ الْمُجْتَمَعِ، دونَ أَيِّ مَنْفَعَةٍ مُباشِرَةٍ تَعودُ عَلى دافِعِ الضَّريبَةِ، وَتُخَصَّصُ لِتَغْطِيَةِ تَكاليفِ الْخَدَماتِ الْعامَّةِ. (كِتابُ الطّالِبِ، ص 67–69)', 'ص 62–77', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الدَّخْلُ الَّذي يَعْتَمِدُ عَلى قُدُراتِ الْفَرْدِ وَجُهْدِهِ يُسَمّى:','[{"id": "a", "text": "الدَّخْلَ الْمُكْتَسَبَ"}, {"id": "b", "text": "الدَّخْلَ غَيْرَ الْمُكْتَسَبِ"}, {"id": "c", "text": "الْإيرادَ الْعامَّ"}]'),('مِنْ مَصادِرِ الْإِيراداتِ الْعامَّةِ لِلدُّوَلِ:','[{"id": "a", "text": "الرُّسومُ وَالْقُروضُ وَالْغَراماتُ"}, {"id": "b", "text": "الْأَجْرُ وَالرّاتِبُ"}, {"id": "c", "text": "الْمُدَّخَراتُ الشَّخْصِيَّةُ"}]'),('بَدَأَ الْعَمَلُ بِالضَّريبَةِ الِانْتِقائِيَّةِ في الْإِماراتِ اعْتِبارًا مِنْ:','[{"id": "a", "text": "الْأَوَّلِ مِنْ أُكْتوبِرَ 2017 م"}, {"id": "b", "text": "الْأَوَّلِ مِنْ يَنايِرَ 2010 م"}, {"id": "c", "text": "الْأَوَّلِ مِنْ مايو 2021 م"}]'),('تَقَلَّصَتْ مُساهَمَةُ الْقِطاعِ النَّفْطِيِّ في النّاتِجِ الْإِجْمالِيِّ لِلْإِماراتِ إِلى:','[{"id": "a", "text": "30% حالِيًّا"}, {"id": "b", "text": "90% حالِيًّا"}, {"id": "c", "text": "5% حالِيًّا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 9, 3, 2, 'الْوَحْدَةُ الْعاشِرَةُ: الْإِماراتُ — تاريخٌ وَمُسْتَقْبَلٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=9 and term=3
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y9-T3-L5', 'الرِّياحُ الْمَوْسِمِيَّةُ وَتِجارَةُ أَهْلِ الْإِماراتِ', 3, 'ص 80–93', true, '🎯 أُفَسِّرُ أَثَرَ الرِّياحِ الْمَوْسِمِيَّةِ في تِجارَةِ أَهْلِ الْإِماراتِ، وَأَسْتَنْتِجُ عَوامِلَ ازْدِهارِ التَّبادُلِ التِّجارِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ نَشْأَةَ الرِّياحِ الْمَوْسِمِيَّةِ وَأَثَرَها في حَرَكَةِ التِّجارَةِ.',1),('أُوَضِّحُ الْعَلاقَةَ التِّجارِيَّةَ بَيْنَ الْإِماراتِ وَالْهِنْدِ عَبْرَ التّاريخِ وَالْيَوْمَ.',2),('أَسْتَنْتِجُ الْعَوامِلَ الَّتي ساعَدَتْ عَلَى ازْدِهارِ التَّبادُلِ التِّجارِيِّ بَيْنَ الْخَليجِ الْعَرَبِيِّ وَشَرْقِ أَفْريقْيا.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرِّياحُ الْمَوْسِمِيَّةُ وَتِجارَةُ أَهْلِ الْإِماراتِ', 'وَيَأْتي في مُقَدِّمَةِ ذٰلِكَ الرِّياحُ الْمَوْسِمِيَّةُ الَّتي تُمَيِّزُ الْمُحيطَ الْهِنْدِيَّ، وَبِاللُّغَةِ الْإِنْجِليزِيَّةِ (monsoon) تَرْجَمَةُ الرِّياحِ الْمَوْسِمِيَّةِ، مُشْتَقَّةٌ مِنَ الْكَلِمَةِ الْعَرَبِيَّةِ (مَوْسِم). تَهُبُّ الرِّياحُ الْمَوْسِمِيَّةُ في اتِّجاهٍ واحِدٍ عَلى مَدى سِتَّةِ أَشْهُرٍ، ثُمَّ تَهُبُّ في الِاتِّجاهِ الْمُعاكِسِ خِلالَ النِّصْفِ الثّاني مِنَ الْعامِ، حَيْثُ انْدَفَعَتْ بِواسِطَتِهَا السُّفُنُ مِنَ الْخَليجِ الْعَرَبِيِّ إِلَى الْهِنْدِ وَبِالْعَكْسِ. (كِتابُ الطّالِبِ، ص 81)', 'ص 80–93', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('كَلِمَةُ (monsoon) مُشْتَقَّةٌ مِنَ الْكَلِمَةِ الْعَرَبِيَّةِ:','[{"id": "a", "text": "مَوْسِم"}, {"id": "b", "text": "ميناء"}, {"id": "c", "text": "مِلاحَة"}]'),('كانَتْ بِلادُ (ماجانَ) تُصَدِّرُ إِلى أَرْضِ الرّافِدَيْنِ:','[{"id": "a", "text": "النُّحاسَ"}, {"id": "b", "text": "اللُّؤْلُؤَ"}, {"id": "c", "text": "الْقِرْفَةَ"}]'),('زارَ الشَّيْخُ زايِدٌ الْهِنْدَ زِيارَةً تاريخِيَّةً عامَ:','[{"id": "a", "text": "1975 م"}, {"id": "b", "text": "1971 م"}, {"id": "c", "text": "1985 م"}]'),('سُمِّيَتْ زَنْجِبارُ (تَنْزانِيا حالِيًّا) بِجَزيرَةِ:','[{"id": "a", "text": "الْقَرَنْفُلِ"}, {"id": "b", "text": "اللُّؤْلُؤِ"}, {"id": "c", "text": "الْمَنْغْروفِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y9-T3-L6', 'الْإِماراتُ: الرُّؤْيَةُ وَالْمِئَوِيَّةُ', 3, 'ص 94–107', true, '🎯 أَسْتَنْتِجُ مَحاوِرَ رُؤْيَةِ «نَحْنُ الْإِماراتُ 2031 م»، وَأُقَدِّرُ جُهودَ الدَّوْلَةِ في اسْتِشْرافِ الْمُسْتَقْبَلِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ مَحاوِرَ رُؤْيَةِ «نَحْنُ الْإِماراتُ 2031 م» وَأَهَمَّ مُؤَشِّراتِها.',1),('أُوَضِّحُ مَحاوِرَ الْأَجِنْدَةِ الْوَطَنِيَّةِ وَأَهْدافَ الْأَجِنْدَةِ الْخَضْراءِ 2030.',2),('أُقَدِّرُ جُهودَ الدَّوْلَةِ في اسْتِشْرافِ الْمُسْتَقْبَلِ مِنْ خِلالِ مِئَوِيَّةِ الْإِماراتِ 2071 م.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْإِماراتُ: الرُّؤْيَةُ وَالْمِئَوِيَّةُ', 'وَتُعَدُّ «نَحْنُ الْإِماراتُ 2031» بِمَثابَةِ بَرْنامَجٍ تَنْمَوِيٍّ مُتَكامِلٍ لِلسَّنَواتِ الْعَشْرِ الْمُقْبِلَةِ يَرْتَكِزُ عَلَى الْجَوانِبِ الِاجْتِماعِيَّةِ وَالِاقْتِصادِيَّةِ وَالِاسْتِثْمارِيَّةِ وَالتَّنْمَوِيَّةِ في دَوْلَةِ الْإِماراتِ ضِمْنَ مِلَفٍّ شامِلٍ وَرُؤْيَةٍ واضِحَةِ الْمَعالِمِ، تَسْعى إِلى تَعْزيزِ مَكانَةِ الْإِماراتِ كَشَريكٍ عالَمِيٍّ وَمَرْكَزٍ اقْتِصادِيٍّ جاذِبٍ وَمُؤَثِّرٍ، إِلى جانِبِ إِبْرازِ النَّموذَجِ الِاقْتِصادِيِّ النّاجِحِ لِلدَّوْلَةِ. (كِتابُ الطّالِبِ، ص 95)', 'ص 94–107', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الْمَحاوِرِ الرَّئيسَةِ لِرُؤْيَةِ «نَحْنُ الْإِماراتُ 2031 م»:','[{"id": "a", "text": "أَرْبَعَةُ مَحاوِرَ"}, {"id": "b", "text": "خَمْسَةُ مَحاوِرَ"}, {"id": "c", "text": "سِتَّةُ مَحاوِرَ"}]'),('تَسْتَهْدِفُ الرُّؤْيَةُ رَفْعَ النّاتِجِ الْمَحَلِّيِّ الْإِجْمالِيِّ إِلى:','[{"id": "a", "text": "3 تْريلْيوناتِ دِرْهَمٍ"}, {"id": "b", "text": "800 مِلْيارِ دِرْهَمٍ"}, {"id": "c", "text": "450 مِلْيارَ دِرْهَمٍ"}]'),('عَدَدُ الْأَهْدافِ الْإِسْتْراتيجِيَّةِ لِلْأَجِنْدَةِ الْوَطَنِيَّةِ الْخَضْراءِ 2030:','[{"id": "a", "text": "خَمْسَةُ أَهْدافٍ"}, {"id": "b", "text": "ثَلاثَةُ أَهْدافٍ"}, {"id": "c", "text": "سَبْعَةُ أَهْدافٍ"}]'),('الْقُوَّةُ النّاعِمَةُ هِيَ الْقُدْرَةُ عَلَى الْحُصولِ عَلى ما تُريدُ مِنْ خِلالِ:','[{"id": "a", "text": "الْجَذْبِ"}, {"id": "b", "text": "الْإِجْبارِ"}, {"id": "c", "text": "دَفْعِ الْأَمْوالِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=9 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y9-T3-L7', '(إِكْسْبو 2020 دُبَيٌّ): تَواصُلُ الْعُقولِ وَصُنْعُ الْمُسْتَقْبَلِ', 3, 'ص 108–120', true, '🎯 أَسْتَكْشِفُ الْأَهَمِّيَّةَ الِاقْتِصادِيَّةَ وَالثَّقافِيَّةَ لِـ(إِكْسْبو 2020 دُبَيٍّ)، وَأُحَلِّلُ شِعارَهُ لِتَحْديدِ دَلالَتِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَكْشِفُ الْأَهَمِّيَّةَ الِاقْتِصادِيَّةَ لِـ(إِكْسْبو 2020 دُبَيٍّ).',1),('أُحَلِّلُ شِعارَ (إِكْسْبو 2020 دُبَيٍّ) لِتَحْديدِ دَلالَتِهِ.',2),('أَسْتَنْتِجُ الْأَهَمِّيَّةَ الثَّقافِيَّةَ وَالسِّياحِيَّةَ، وَأُقَدِّرُ جُهودَ الدَّوْلَةِ في إِرْساءِ قَواعِدِ التَّسامُحِ وَالتَّعايُشِ السِّلْمِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', '(إِكْسْبو 2020 دُبَيٌّ): تَواصُلُ الْعُقولِ وَصُنْعُ الْمُسْتَقْبَلِ', 'تَمَّ أَخْذُ تَصْميمِ شِعارِ (إِكْسْبو 2020 دُبَيٍّ) مِنْ مَشْغولاتِ مَصْنَعٍ أَثَرِيٍّ لِلذَّهَبِ اكْتَشَفَهُ صاحِبُ السُّمُوِّ الشَّيْخُ مُحَمَّدُ بْنُ راشِدٍ آلُ مَكْتومٍ في مِنْطَقَةِ الْمَرْموم، وَأُطْلِقَ عَلَيْهِ اسْمُ ساروقِ الْحَديدِ. وَالشِّعارُ عِبارَةٌ عَنْ تَجْميعٍ لِأَنْماطٍ مِنْ نُقوشٍ وَمَشْغولاتٍ أَبْدَعَتْها حَضارَةٌ إِماراتِيَّةٌ قَبْلَ (4000) عامٍ، وَنَسَجَتْ خُيوطَ تَواصُلِها مَعَ حَضارَةِ دِلْمونَ وَالْفَراعِنَةِ وَالرّافِدَيْنِ وَالسِّنْدِ وَالْهِنْدِ. (كِتابُ الطّالِبِ، ص 114)', 'ص 108–120', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y9-T3-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 9, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('انْطَلَقَ إِكْسْبو الدَّوْلِيُّ مِنْ مَدينَةِ:','[{"id": "a", "text": "لَنْدَنَ عامَ 1851 م"}, {"id": "b", "text": "ميلانو عامَ 2015 م"}, {"id": "c", "text": "دُبَيٍّ عامَ 2021 م"}]'),('شِعارُ (إِكْسْبو 2020 دُبَيٍّ) هُوَ:','[{"id": "a", "text": "تَواصُلُ الْعُقولِ وَصُنْعُ الْمُسْتَقْبَلِ"}, {"id": "b", "text": "الْمَعْرِضُ الْعَظيمُ"}, {"id": "c", "text": "الْفُرَصُ وَالِاسْتِدامَةُ"}]'),('عَدَدُ فُرَصِ الْعَمَلِ الَّتي وَفَّرَها (إِكْسْبو 2020 دُبَيٌّ):','[{"id": "a", "text": "227 أَلْفَ فُرْصَةٍ"}, {"id": "b", "text": "50 أَلْفَ فُرْصَةٍ"}, {"id": "c", "text": "164 أَلْفَ فُرْصَةٍ"}]'),('أُخِذَ تَصْميمُ شِعارِ إِكْسْبو مِنْ مَشْغولاتِ مَوْقِعِ:','[{"id": "a", "text": "ساروقِ الْحَديدِ"}, {"id": "b", "text": "أُمِّ النّارِ"}, {"id": "c", "text": "جَبَلِ بَراكَةَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;