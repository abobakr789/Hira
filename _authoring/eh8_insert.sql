insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 1, 9, 'الْإِماراتُ تاريخُنا (1): مَليحَةُ وَالدُّورُ — مُدُنٌ وَتِجارَةٌ قَبْلَ الْإِسْلامِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=1
                  and sort_order=9 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 10, 'EH-Y8-T1-L10', 'فَجْرُ الْإِسْلامِ يُشْرِقُ عَلَى الْإِماراتِ وَشِبْهِ الْجَزيرَةِ الْعَرَبِيَّةِ', 3, 'ص 77–86', true, '🎯 أَسْتَنْتِجُ مِنْ آثارِ مَليحَةَ كَيْفَ صارَتْ مَدينَةً مُنَظَّمَةً لَها حاكِمٌ وَعُمْلَةٌ وَتِجارَةٌ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَوْقِعَ مَليحَةَ وَزَمَنَ نَشْأَتِها وَأَبْرَزَ ما يُمَيِّزُها.',1),('أُوَضِّحُ ما تَدُلُّ عَلَيْهِ عُمْلَةُ مَليحَةَ وَنُقوشُها.',2),('أُقَوِّمُ التَّفْسيرَ الْجَديدَ الَّذي يَرى أَنَّ مَلِكَةً حَكَمَتْ مَليحَةَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'فَجْرُ الْإِسْلامِ يُشْرِقُ عَلَى الْإِماراتِ وَشِبْهِ الْجَزيرَةِ الْعَرَبِيَّةِ', 'تُشَكِّلُ مَليحَةُ نُقْطَةَ تَحَوُّلٍ إِلى أُسْلوبِ حَياةٍ جَديدٍ في الْإِماراتِ؛ فَقَدْ تَنَوَّعَ سُكّانُ الْمَدينَةِ الَّتي تَقَعُ في سَهْلٍ داخِلِيٍّ خَصْبٍ بَيْنَ مُزارِعينَ وَتُجّارٍ وَجُنودٍ كانوا تَحْتَ إِمْرَةِ قائِدٍ واحِدٍ، إِمّا مَلِكٍ أَوْ مَلِكَةٍ. ازْدَهَرَتِ الْمَدينَةُ لِقُرونٍ عَديدَةٍ كَما تُواصِلُ الِاكْتِشافاتُ الْجَديدَةُ إِغْناءَ مَعْلوماتِنا عَنْ هٰذا الْمَكانِ الْمُدْهِشِ. لٰكِنْ بَعْدَ الْقَرْنِ الرّابِعِ أَصْبَحَتْ مَليحَةُ مَهْجورَةً، لا نَعْلَمُ عَلى وَجْهِ الدِّقَّةِ سَبَبَ ذٰلِكَ أَوْ مَنْ كانَ الْمَسْؤولَ عَنْهُ، وَلٰكِنَّ ذٰلِكَ الْحَدَثَ التّاريخِيَّ يَخْتَتِمُ فَصْلًا رائِعًا مِنْ فُصولِ تاريخِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.', 'ص 77–86', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T1-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَقَعُ مَليحَةُ في:','[{"id": "a", "text": "الْجُزْءِ الدّاخِلِيِّ مِنَ الشّارِقَةِ"}, {"id": "b", "text": "ساحِلِ أُمِّ الْقَيْوَيْنِ"}, {"id": "c", "text": "جَزيرَةٍ في أَبوظَبي"}]'),('بُنِيَتْ قَرْيَةُ مَليحَةَ حَوالَيْ عامِ:','[{"id": "a", "text": "250 ق.م"}, {"id": "b", "text": "2500 ق.م"}, {"id": "c", "text": "632 م"}]'),('تَبادُلُ الْبَضائِعِ بِقيمَةٍ مُتَساوِيَةٍ دونَ نَقْدٍ يُسَمّى:','[{"id": "a", "text": "الْمُقايَضَةَ"}, {"id": "b", "text": "الْمُضارَبَةَ"}, {"id": "c", "text": "الْمُرابَحَةَ"}]'),('كُتِبَ اسْمُ «أَبِيئيلَ» عَلَى الْعُمْلَةِ بِحُروفٍ:','[{"id": "a", "text": "آرامِيَّةٍ"}, {"id": "b", "text": "إِغْريقِيَّةٍ"}, {"id": "c", "text": "لاتينِيَّةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 11, 'EH-Y8-T1-L11', 'التِّجارَةُ الْبَحْرِيَّةُ في دَوْلَةِ الْإِماراتِ مُنْذُ فَجْرِ الْإِسْلامِ', 3, 'ص 87–98', true, '🎯 أَرْبِطُ بَيْنَ التِّجارَةِ الْبَحْرِيَّةِ وَما جَلَبَتْهُ مِنْ بَضائِعَ وَأَفْكارٍ وَقِيَمٍ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَوْقِعَ الدُّورِ وَدِبا وَصيرِ بَني ياسٍ وَدَوْرَ كُلٍّ مِنْها.',1),('أَسْتَدِلُّ بِاللُّقى عَلى مَدى اتِّساعِ تِجارَةِ الْإِماراتِ الْبَحْرِيَّةِ.',2),('أُفَسِّرُ كَيْفَ رَسَّخَتِ التِّجارَةُ قيمَةَ التَّسامُحِ عِنْدَ أَهْلِ الْإِماراتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'التِّجارَةُ الْبَحْرِيَّةُ في دَوْلَةِ الْإِماراتِ مُنْذُ فَجْرِ الْإِسْلامِ', 'سَاهَمَتِ التِّجارَةُ الْبَحْرِيَّةُ وَالْبَرِّيَّةُ في قُدومِ بَضائِعَ جَديدَةٍ وَثَمينَةٍ إِلَى الْإِماراتِ، لٰكِنَّها في الْوَقْتِ نَفْسِهِ جَلَبَتْ مَعَها لُغاتٍ جَديدَةً وَدِياناتٍ جَديدَةً تَفاعَلَتْ مَعَ مَنْظومَةِ الْمُعْتَقَداتِ الَّتي كانَتْ سائِدَةً قَديمًا في هٰذِهِ الْمِنْطَقَةِ. لَقَدْ أَسْفَرَتْ أَعْمالُ التَّنْقيبِ في مُخْتَلَفِ الْمَواقِعِ الْأَثَرِيَّةِ عَنِ الْعَديدِ مِنَ الِاكْتِشافاتِ الْقَيِّمَةِ، وَيَتَمَثَّلُ أَحَدُ أَكْثَرِ هٰذِهِ الِاكْتِشافاتِ قيمَةً في كَيْفَ ساعَدَتْ هٰذِهِ التِّجارَةُ عَلى تَرْسيخِ قيمَةِ التَّسامُحِ لَدى سُكّانِ الْإِماراتِ.', 'ص 87–98', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T1-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('كانَتْ مُسْتَوْطَنَةُ الدُّورِ تَقَعُ عَلى ساحِلِ:','[{"id": "a", "text": "أُمِّ الْقَيْوَيْنِ"}, {"id": "b", "text": "الْفُجَيْرَةِ"}, {"id": "c", "text": "رَأْسِ الْخَيْمَةِ"}]'),('أَوَّلُ مَعْبَدٍ اكْتُشِفَ في دَوْلَةِ الْإِماراتِ كانَ مُخَصَّصًا لِـ:','[{"id": "a", "text": "إِلٰهِ الشَّمْسِ"}, {"id": "b", "text": "إِلٰهِ الْمَطَرِ"}, {"id": "c", "text": "إِلٰهِ الْبَحْرِ"}]'),('الْأَمْشاطُ الْعاجِيَّةُ الْمُكْتَشَفَةُ في دِبا صُنِعَتْ في:','[{"id": "a", "text": "الْهِنْدِ"}, {"id": "b", "text": "روما"}, {"id": "c", "text": "الْيَمَنِ"}]'),('تَبْعُدُ جَزيرَةُ صيرِ بَني ياسٍ عَنْ أَبوظَبي نَحْوَ:','[{"id": "a", "text": "200 كم"}, {"id": "b", "text": "20 كم"}, {"id": "c", "text": "2000 كم"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 2, 9, 'الْإِماراتُ تاريخُنا (2): مِنْ فَجْرِ الْإِسْلامِ إِلى تَشَكُّلِ الْهُوِيَّةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=2
                  and sort_order=9 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 12, 'EH-Y8-T2-L12', 'بُزوغُ فَجْرِ الْإِسْلامِ', 3, 'ص 99–108', true, '🎯 أُبَيِّنُ كَيْفَ دَخَلَ أَهْلُ الْإِماراتِ في الْإِسْلامِ، وَكَيْفَ غَيَّرَ حَياتَهُمْ وَتِجارَتَهُمْ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَنْ كانَ يَحْكُمُ الْمِنْطَقَةَ قَبْلَ الْإِسْلامِ وَمَتى وَصَلَ إِلَيْها.',1),('أَذْكُرُ أَثَرَ الْإِسْلامِ في حَياةِ النّاسِ وَزِراعَتِهِمْ وَعِمارَتِهِمْ.',2),('أُفَسِّرُ كَيْفَ نَمَتْ جَلْفارُ وَغَيْرُها مَعَ ازْدِهارِ التِّجارَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'بُزوغُ فَجْرِ الْإِسْلامِ', 'وَرَغْمَ أَنَّ غالِبِيَّةَ سُكّانِ الْإِماراتِ قَدِ اعْتَنَقوا الْإِسْلامَ بِسُهولَةٍ، إِلّا أَنَّهُمْ لَمْ يَعْمِدوا إِلى إِقْصاءِ أَتْباعِ الدِّياناتِ الْأُخْرى أَوْ إِجْبارِهِمْ عَلى تَغْييرِ دينِهِمْ وَدُخولِ الْإِسْلامِ، فَقَدِ اسْتَمَرَّ وُجودُ الْكَنيسَةِ في جَزيرَةِ صيرِ بَني ياسٍ وَازْدِهارُها لِفَتْرَةٍ طَويلَةٍ خِلالَ الْعَصْرِ الْإِسْلامِيِّ، وَهٰذا يُظْهِرُ بِوُضوحٍ بِدايَةَ التَّسامُحِ الدّينِيِّ الَّذي لا يَزالُ مِنَ الصِّفاتِ الْأَساسِيَّةِ لِدَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في الْوَقْتِ الْحاضِرِ.', 'ص 99–108', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T2-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('السُّلالَةُ الَّتي كانَتْ تَحْكُمُ الْمِنْطَقَةَ قُبَيْلَ الْإِسْلامِ هِيَ:','[{"id": "a", "text": "آلُ الْجُلَنْدى"}, {"id": "b", "text": "آلُ نَهْيانَ"}, {"id": "c", "text": "الْقَواسِمُ"}]'),('جَرَتْ مَعْرَكَةُ «يَوْمِ دِبا» في عامِ:','[{"id": "a", "text": "633م (11 هـ)"}, {"id": "b", "text": "1507م"}, {"id": "c", "text": "1820م"}]'),('أَقْدَمُ مَسْجِدٍ اكْتُشِفَ في الدَّوْلَةِ بُنِيَ مِنْ:','[{"id": "a", "text": "الطّوبِ الطّينِيِّ"}, {"id": "b", "text": "الرُّخامِ"}, {"id": "c", "text": "الْحَديدِ"}]'),('أَداةُ الْمِلاحَةِ الَّتي يُحَدَّدُ بِها خَطُّ الْعَرْضِ تُسَمّى:','[{"id": "a", "text": "الْكَمالَ"}, {"id": "b", "text": "الْفَلَجَ"}, {"id": "c", "text": "الْمَلاطَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 13, 'EH-Y8-T2-L13', 'ظُهورُ بَني ياسٍ وَالْقَواسِمِ وَوُصولُ الْقُوى الْأَجْنَبِيَّةِ', 3, 'ص 109–122', true, '🎯 أُقَوِّمُ مَزاعِمَ الْقُوى الْأَجْنَبِيَّةِ، وَأُبَيِّنُ كَيْفَ قامَ حِلْفا بَني ياسٍ وَالْقَواسِمِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَتى وَصَلَ الْبُرْتُغالِيّونَ وَما فَعَلوهُ في مُدُنِنا.',1),('أَتَتَبَّعُ مَراحِلَ الْمُقاوَمَةِ حَتّى تَحْريرِ الْمَوانِئِ.',2),('أُقَوِّمُ مَزاعِمَ «الْقَرْصَنَةِ» بِالْأَرْقامِ وَالْمَصادِرِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'ظُهورُ بَني ياسٍ وَالْقَواسِمِ وَوُصولُ الْقُوى الْأَجْنَبِيَّةِ', 'يُشيرُ الشَّيْخُ سُلْطانٌ في أَحَدِ كُتُبِهِ الْعِلْمِيَّةِ قائِلًا: «إِنَّ جَميعَ الِاتِّهاماتِ الَّتي طالَتِ الْقَواسِمَ كانَتْ خادِعَةً وَمُضَلِّلَةً. ساقَ الْبُرْتُغالِيّونَ اتِّهامَهُمْ لِلْقَواسِمِ بِالْقَرْصَنَةِ لِلْمَرَّةِ الْأولى في ديسَمْبِرَ 1804م وَاسْتَمَرّوا بِذٰلِكَ لِغايَةِ عامِ 1821م. وَلٰكِنْ في الْفَتْرَةِ الْمُمْتَدَّةِ بَيْنَ 1801م وَ1821م، ارْتَفَعَتِ الْوارِداتُ مِنَ الْخَليجِ الْعَرَبِيِّ إِلَى الْهِنْدِ لِأَكْثَرَ مِنَ الضِّعْفِ، وَازْدادَتِ الصّادِراتُ مِنْ مومْباي إِلَى الْخَليجِ الْعَرَبِيِّ بِأَكْثَرَ مِنْ ثَلاثَةِ أَضْعافٍ».', 'ص 109–122', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T2-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('هاجَمَ أَلْفونْسو دي أَلْبوكيرْك صُحارَ في عامِ:','[{"id": "a", "text": "1507م"}, {"id": "b", "text": "1650م"}, {"id": "c", "text": "1820م"}]'),('تَمَّ تَحْريرُ جَلْفارَ مِنَ الْبُرْتُغالِيّينَ حَوالَيْ عامِ:','[{"id": "a", "text": "1632م"}, {"id": "b", "text": "1507م"}, {"id": "c", "text": "1761م"}]'),('انْتَقَلَ بَنو ياسٍ لِيُقيموا في جَزيرَةِ أَبوظَبي عامَ:','[{"id": "a", "text": "1761م"}, {"id": "b", "text": "1580م"}, {"id": "c", "text": "1892م"}]'),('وُقِّعَتْ مُعاهَدَةُ السَّلامِ الْعامَّةِ في:','[{"id": "a", "text": "يَنايِرَ 1820م"}, {"id": "b", "text": "ديسَمْبِرَ 1804م"}, {"id": "c", "text": "نوفَمْبِرَ 1809م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 14, 'EH-Y8-T2-L14', 'تَشَكُّلُ الْهُوِيَّةِ الْوَطَنِيَّةِ', 3, 'ص 123–136', true, '🎯 أُفَسِّرُ كَيْفَ تَماسَكَتْ هُوِيَّتُنا الْوَطَنِيَّةُ في أَصْعَبِ الْأَوْقاتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ أَبْرَزَ الْمُعاهَداتِ وَلِمَ سُمِّيَتْ بِلادُنا «الْإِماراتِ الْمُتَصالِحَةَ».',1),('أُفَسِّرُ سَبَبَ انْهِيارِ تِجارَةِ اللُّؤْلُؤِ وَأَثَرَهُ.',2),('أَتَتَبَّعُ طَريقَ اكْتِشافِ النَّفْطِ وَأَثَرَهُ في حَياةِ النّاسِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'تَشَكُّلُ الْهُوِيَّةِ الْوَطَنِيَّةِ', 'باتَ الْفَقْرُ الْمُدْقِعُ حَقيقَةً حَياتِيَّةً لِلْكَثيرِ مِنَ النّاسِ. كانَتْ تِلْكَ مِنْ أَصْعَبِ الْأَوْقاتِ الَّتي مَرَّتْ بِها الْإِماراتُ عَبْرَ تاريخِها الطَّويلِ. الْيَوْمَ، نَعْتَبِرُ الْكَثيرَ مِنَ الْأَشْياءِ أَمْرًا طَبيعِيًّا في دَوْلَةِ الْإِماراتِ، وَخاصَّةً الْوَسائِلَ التِّكْنولوجِيَّةَ وَالْكَمالِيّاتِ الَّتي نَجِدُها في مُتَناوَلِ أَيْدينا بِسُهولَةٍ. إِلّا أَنَّ الْجيلَ الْأَقْدَمَ مِمَّنْ يَتَذَكَّرونَ تِلْكَ الْأَوْقاتِ الْعَصيبَةَ هُمْ أَكْثَرُ وَعْيًا بِالتَّغَيُّراتِ الَّتي طَرَأَتْ عَلَى الْبِلادِ خِلالَ فَتْرَةٍ وَجيزَةٍ مِنَ الزَّمَنِ.', 'ص 123–136', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T2-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('وُقِّعَتْ مُعاهَدَةُ السَّلامِ الْبَحْرِيِّ الدّائِمِ في عامِ:','[{"id": "a", "text": "1853م"}, {"id": "b", "text": "1820م"}, {"id": "c", "text": "1892م"}]'),('بَدَأَتِ الْيابانُ بِإِنْتاجِ اللُّؤْلُؤِ الصِّناعِيِّ في عامِ:','[{"id": "a", "text": "1928م"}, {"id": "b", "text": "1908م"}, {"id": "c", "text": "1948م"}]'),('عُثِرَ عَلى كَمِّيّاتٍ تِجارِيَّةٍ مِنَ النَّفْطِ أَوَّلَ مَرَّةٍ في:','[{"id": "a", "text": "أُمِّ الشَّيْفِ قُبالَةَ أَبوظَبي"}, {"id": "b", "text": "جَبَلِ عَلِيٍّ بِدُبَيَّ"}, {"id": "c", "text": "حَقْلِ مُبارَكَ بِالشّارِقَةِ"}]'),('ارْتَفَعَ عَدَدُ الْإِماراتِ إِلى سَبْعٍ بَعْدَ الِاعْتِرافِ بِإِمارَةِ:','[{"id": "a", "text": "الْفُجَيْرَةِ"}, {"id": "b", "text": "عَجْمانَ"}, {"id": "c", "text": "أُمِّ الْقَيْوَيْنِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 3, 9, 'الْإِماراتُ تاريخُنا (3): زايِدٌ وَالِاتِّحادُ وَبِناءُ الدَّوْلَةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=3
                  and sort_order=9 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 15, 'EH-Y8-T3-L15', 'الشَّيْخُ زايِدٌ وَتَأْسيسُ دَوْلَةِ الْإِماراتِ', 3, 'ص 137–140', true, '🎯 أُرَتِّبُ خُطُواتِ قِيامِ الِاتِّحادِ، وَأُبَيِّنُ دَوْرَ الشَّيْخِ زايِدٍ — رَحِمَهُ اللهُ — فيهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ ما أَعْلَنَتْهُ بَريطانْيا سَنَةَ 1968م وَأَثَرَهُ.',1),('أُرَتِّبُ خُطُواتِ قِيامِ الِاتِّحادِ حَتّى 2 ديسَمْبِرَ 1971م.',2),('أَسْتَخْلِصُ مِنْ أَقْوالِ الشَّيْخِ زايِدٍ رُؤْيَتَهُ لِلتّاريخِ وَالْهُوِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الشَّيْخُ زايِدٌ وَتَأْسيسُ دَوْلَةِ الْإِماراتِ', 'لَقَدْ كانَ قِيامُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في عامِ 1971م ثَمَرَةَ مَسيرَةٍ طَويلَةٍ مِنَ الْجُهودِ تَكَلَّلَتْ بِاتِّحادِ الْإِماراتِ السَّبْعِ في كِيانٍ واحِدٍ يَجْمَعُ شَمْلَ الْأُمَّةِ وَيُحَقِّقُ الِازْدِهارَ لِجَميعِ أَفْرادِها. لٰكِنَّ تِلْكَ الْمَسيرَةَ لَمْ تَكُنْ لِتَنْجَحَ لَوْ لَمْ يَتَوَفَّرْ لَها قُبْطانٌ ذو رُؤْيَةٍ ثاقِبَةٍ يَقودُ دَفَّتَها حَتّى يَصِلَ بِها إِلى غايَتِها الْمَنْشودَةِ. لَقَدْ كانَ الْمَغْفورُ لَهُ — بِإِذْنِ اللهِ — الشَّيْخُ زايِدُ بْنُ سُلْطانٍ آلُ نَهْيانَ هُوَ ذٰلِكَ الْقائِدَ الَّذي أَدْرَكَ مُنْذُ الْبِدايَةِ أَهَمِّيَّةَ التّاريخِ في حَياةِ الْأُمَمِ.', 'ص 137–140', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T3-L15/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُعْلِنَ قِيامُ دَوْلَةِ الِاتِّحادِ في:','[{"id": "a", "text": "2 ديسَمْبِرَ 1971م"}, {"id": "b", "text": "30 مارِسَ 1968م"}, {"id": "c", "text": "13 يَنايِرَ 1968م"}]'),('الْتَقى الشَّيْخُ زايِدٌ وَالشَّيْخُ راشِدٌ سَنَةَ 1968م في:','[{"id": "a", "text": "عَرْقوبِ السُّدَيْرَةِ"}, {"id": "b", "text": "قَصْرِ الْحِصْنِ"}, {"id": "c", "text": "جَزيرَةِ صيرِ بَني ياسٍ"}]'),('وُلِدَ الشَّيْخُ زايِدُ بْنُ سُلْطانٍ آلُ نَهْيانَ في عامِ:','[{"id": "a", "text": "1918م"}, {"id": "b", "text": "1946م"}, {"id": "c", "text": "1966م"}]'),('الْمَجْلِسُ الَّذي انْتَخَبَ أَوَّلَ رَئيسٍ لِلدَّوْلَةِ هُوَ:','[{"id": "a", "text": "الْمَجْلِسُ الْأَعْلى لِلِاتِّحادِ"}, {"id": "b", "text": "الْمَجْلِسُ الْوَطَنِيُّ الِاتِّحادِيُّ"}, {"id": "c", "text": "مَجْلِسُ الْوُزَراءِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 16, 'EH-Y8-T3-L16', 'بِناءُ الدَّوْلَةِ الْحَديثَةِ', 3, 'ص 141–148', true, '🎯 أُبَيِّنُ كَيْفَ حَوَّلَتِ الْقِيادَةُ عائِداتِ النَّفْطِ إِلى إِنْسانٍ وَبُنْيَةٍ وَمُؤَسَّساتٍ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُسَمّي الْمُؤَسَّساتِ الَّتي قامَتْ بَعْدَ الِاتِّحادِ.',1),('أُفَسِّرُ كَيْفَ أُنْفِقَتْ عائِداتُ النَّفْطِ عَلَى الْإِنْسانِ.',2),('أَرْبِطُ بَيْنَ الْمَوانِئِ وَالْمَطاراتِ وَنُمُوِّ الِاقْتِصادِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'بِناءُ الدَّوْلَةِ الْحَديثَةِ', '«إِنَّ الثَّرْوَةَ لَيْسَتْ ثَرْوَةَ الْمالِ بَلْ هِيَ ثَرْوَةُ الرِّجالِ، فَهُمُ الْقُوَّةُ الْحَقيقِيَّةُ الَّتي نَعْتَزُّ بِها، وَهُمُ الزَّرْعُ الَّذي نَسْتَظِلُّ بِظِلالِهِ. وَالْقَناعَةُ الرّاسِخَةُ بِهٰذِهِ الْحَقيقَةِ هِيَ الَّتي مَكَّنَتْنا مِنْ تَوْجيهِ كُلِّ الْجُهودِ لِبِناءِ الْإِنْسانِ وَتَسْخيرِ الثَّرَواتِ الَّتي مَنَّ اللهُ عَلَيْنا بِها لِخِدْمَةِ أَبْناءِ هٰذا الْوَطَنِ، حَتّى يَنْهَضوا بِالْمَسْؤولِيّاتِ الَّتي تَقَعُ عَلى عاتِقِهِمْ».', 'ص 141–148', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T3-L16/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُسِّسَتْ شَرِكَةُ بِتْرولِ أَبوظَبي الْوَطَنِيَّةُ (أَدْنوك) في عامِ:','[{"id": "a", "text": "1971م"}, {"id": "b", "text": "1976م"}, {"id": "c", "text": "1981م"}]'),('افْتُتِحَ ميناءُ جَبَلِ عَلِيٍّ في عامِ:','[{"id": "a", "text": "1979م"}, {"id": "b", "text": "1972م"}, {"id": "c", "text": "1983م"}]'),('وُلِدَ مَجْلِسُ التَّعاوُنِ الْخَليجِيِّ في عامِ:','[{"id": "a", "text": "1981م"}, {"id": "b", "text": "1973م"}, {"id": "c", "text": "1971م"}]'),('أَوَّلُ جامِعَةٍ في دَوْلَةِ الْإِماراتِ افْتُتِحَتْ في مَدينَةِ:','[{"id": "a", "text": "الْعَيْنِ"}, {"id": "b", "text": "دُبَيَّ"}, {"id": "c", "text": "الشّارِقَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 17, 'EH-Y8-T3-L17', 'مِنْ تِسْعينِيّاتِ الْقَرْنِ الْعِشْرينَ إِلَى الْيَوْمِ', 3, 'ص 149–162', true, '🎯 أُقَوِّمُ ما بَلَغَتْهُ الدَّوْلَةُ، وَأَرْبِطُ بَيْنَ قِيَمِ زايِدٍ وَمَسيرَةِ الْيَوْمِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَذْكُرُ أَبْرَزَ أَدْوارِ الْإِماراتِ في حِفْظِ السَّلامِ وَالْعَمَلِ الْإِنْسانِيِّ.',1),('أُبَيِّنُ جُهودَ الدَّوْلَةِ في الْبيئَةِ وَالِاسْتِدامَةِ.',2),('أَصِفُ دَوْرَ الْمَرْأَةِ الْإِماراتِيَّةِ الْيَوْمَ وَجُذورَ هٰذا الدَّوْرِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'مِنْ تِسْعينِيّاتِ الْقَرْنِ الْعِشْرينَ إِلَى الْيَوْمِ', '«إِنَّنا نُحِبُّ بيئَتَنا لِأَنَّها جُزْءٌ عُضْوِيٌّ مِنْ بِلادِنا وَتاريخِنا وَتُراثِنا. لَقَدْ عاشَ آباؤُنا وَأَجْدادُنا عَلى هٰذِهِ الْأَرْضِ، وَتَعايَشوا مَعَ بيئَتِها في الْبَرِّ وَالْبَحْرِ، وَأَدْرَكوا بِالْفِطْرَةِ وَالْحِسِّ الْمُرْهَفِ الْحاجَةَ لِلْمُحافَظَةِ عَلَيْها فَلَمْ يَأْخُذوا مِنْها قَدْرَ احْتِياجِهِمْ فَقَطْ، وَيَتْرُكوا ما فيها لِلْأَجْيالِ الْقادِمَةِ لِتَكونَ مَصْدَرًا لِلْخَيْرِ وَنَبْعًا لِلْعَطاءِ، وَكَما أَجْدادُنا كَذٰلِكَ نَحْنُ الَّذينَ نَعيشُ الْآنَ فَوْقَ هٰذِهِ الْأَرْضِ الْمُبارَكَةِ، يَجِبُ عَلَيْنَا الِاهْتِمامُ بِبيئَتِنا وَالْحَياةِ الْبَرِّيَّةِ».', 'ص 149–162', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y8-T3-L17/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('شارَكَتْ قُوّاتُ الْإِماراتِ في حَمْلَةِ تَحْريرِ الْكُوَيْتِ في:','[{"id": "a", "text": "فِبْرايِرَ 1991م"}, {"id": "b", "text": "أَغُسْطُسَ 1990م"}, {"id": "c", "text": "مارِسَ 1993م"}]'),('تَأَسَّسَتْ شَرِكَةُ أَبوظَبي لِطاقَةِ الْمُسْتَقْبَلِ (مَصْدَرُ) في عامِ:','[{"id": "a", "text": "2006م"}, {"id": "b", "text": "1996م"}, {"id": "c", "text": "2016م"}]'),('انْتَقَلَ الشَّيْخُ زايِدٌ — رَحِمَهُ اللهُ — إِلى رَحْمَةِ اللهِ في:','[{"id": "a", "text": "2 نوفَمْبِرَ 2004م"}, {"id": "b", "text": "2 ديسَمْبِرَ 2004م"}, {"id": "c", "text": "2 نوفَمْبِرَ 2010م"}]'),('يَعيشُ عَلَى السّاحِلِ مِنْ سُكّانِ الدَّوْلَةِ أَكْثَرُ مِنْ:','[{"id": "a", "text": "80%"}, {"id": "b", "text": "50%"}, {"id": "c", "text": "30%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
