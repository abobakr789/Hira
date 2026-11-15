
insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 1, 1, 'الْوَحْدَةُ الْأولى: قَضايا وَطَنِيَّةٌ — أَمْنٌ وَتَنْمِيَةٌ وَوَحْدَةٌ وَسِيادَةٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=1
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y8-T1-L1', 'الْأَمْنُ الْوَطَنِيُّ', 3, 'ص 10–25', true, '🎯 أُوَضِّحُ مَفْهومَ الْأَمْنِ الْوَطَنِيِّ وَمَجالاتِهِ، وَأُبَيِّنُ جُهودَ أَجْهِزَةِ الدَّوْلَةِ في حِمايَةِ الْوَطَنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَفْهومَ الْأَمْنِ الْوَطَنِيِّ وَنَشْأَتَهُ عَبْرَ التّاريخِ.',1),('أُوَضِّحُ مَجالاتِ الْأَمْنِ الْوَطَنِيِّ السِّتَّةَ.',2),('أُبَيِّنُ جُهودَ أَجْهِزَةِ الدَّوْلَةِ الدّاخِلِيَّةِ وَالْخارِجِيَّةِ في حِمايَةِ الْوَطَنِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْأَمْنُ الْوَطَنِيُّ', 'فَالْأَمْنُ الْوَطَنِيُّ هُوَ: تَأْمينُ كِيانِ الدَّوْلَةِ لِمُواجَهَةِ الْأَخْطارِ وَالتَّحَدِّياتِ الَّتي تُهَدِّدُها مِنَ الدّاخِلِ وَالْخارِجِ، وَتَأْمينُ مَصالِحِها الْحَيَوِيَّةِ، وَخَلْقُ الْأَوْضاعِ الْمُلائِمَةِ لِتَحْقيقِ أَهْدافِها وَغاياتِها الْوَطَنِيَّةِ. وَقَدْ حَقَّقَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في عُقودٍ وَجيزَةٍ قَفْزَةً هائِلَةً في مَجالِ الْأَمْنِ وَالْعَدالَةِ وَالْقَضاءِ، فَأَصْبَحَتْ واحَةً لِلْأَمْنِ وَالْأَمانِ؛ حَيْثُ اسْتَطاعَتْ حِفْظَ حُقوقِ الْأَفْرادِ وَالْمُؤَسَّساتِ وَتَحْديدَ الْعَلاقاتِ في الْمُجْتَمَعِ مِنْ خِلالِ بِنْيَةٍ تَشْريعِيَّةٍ تَشْمُلُ قَوانينَ واضِحَةً وَصارِمَةً، ما أَدّى في نِهايَةِ الْأَمْرِ إِلى سِيادَةِ الْقانونِ في دَوْلَةِ مُؤَسَّساتٍ تَحْتَرِمُ الْفَرْدَ وَتَصونُ حُقوقَهُ.', 'ص 10–25', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('ظَهَرَ مَفْهومُ الْأَمْنِ الْقَوْمِيِّ عَقِبَ تَوْقيعِ مُعاهَدَةِ:','[{"id": "a", "text": "وِسْتْفالْيا عامَ 1648 م"}, {"id": "b", "text": "فِرْسايَ عامَ 1919 م"}, {"id": "c", "text": "سايْكِسْ بيكو"}]'),('مِنْ أَجْهِزَةِ الْأَمْنِ الْخارِجِيَّةِ في الدَّوْلَةِ:','[{"id": "a", "text": "وِزارَةُ الْخارِجِيَّةِ"}, {"id": "b", "text": "الْهَيْئَةُ الِاتِّحادِيَّةُ لِلْجَمارِكِ"}, {"id": "c", "text": "وِزارَةُ الدّاخِلِيَّةِ"}]'),('تَحْقيقُ أَعْلى مُسْتَوَياتِ السَّلامَةِ لِلدِّفاعِ الْمَدَنِيِّ مِنْ مَهامِّ:','[{"id": "a", "text": "الْهَيْئَةِ الْوَطَنِيَّةِ لِإِدارَةِ الطَّوارِئِ وَالْأَزَماتِ وَالْكَوارِثِ"}, {"id": "b", "text": "الْهَيْئَةِ الِاتِّحادِيَّةِ لِلْجَمارِكِ"}, {"id": "c", "text": "الْهَيْئَةِ الْوَطَنِيَّةِ لِلْأَمْنِ الْإِلِكْتْرونِيِّ"}]'),('حِمايَةُ أَرْضِ الْوَطَنِ وَمُنْجَزاتِهِ مِنْ أَبْعادِ الْأَمْنِ الْوَطَنِيِّ:','[{"id": "a", "text": "الْعَسْكَرِيِّ"}, {"id": "b", "text": "الِاقْتِصادِيِّ"}, {"id": "c", "text": "الْبيئِيِّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y8-T1-L2', 'التَّنْمِيَةُ الْبَشَرِيَّةُ', 3, 'ص 26–37', true, '🎯 أُوَضِّحُ مَفْهومَ التَّنْمِيَةِ الْبَشَرِيَّةِ وَمَجالاتِها، وَأُناقِشُ جُهودَ دَوْلَةِ الْإِماراتِ فيها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُعَرِّفُ التَّنْمِيَةَ الْبَشَرِيَّةَ وَأُعَدِّدُ مَجالاتِها.',1),('أُوَضِّحُ عَناصِرَ دَليلِ التَّنْمِيَةِ الْبَشَرِيَّةِ الثَّلاثَةَ.',2),('أُناقِشُ جُهودَ دَوْلَةِ الْإِماراتِ في مَجالِ التَّنْمِيَةِ الْبَشَرِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'التَّنْمِيَةُ الْبَشَرِيَّةُ', 'فَالتَّنْمِيَةُ الْبَشَرِيَّةُ عِبارَةٌ عَنْ عَمَلِيَّةِ تَوْسيعِ الْقُدُراتِ التَّعْليمِيَّةِ وَالْخِبْراتِ لِلشُّعوبِ بِهَدَفِ أَنْ يَصِلَ الْإِنْسانُ بِجَهْدِهِ إِلى مُسْتَوًى مُرْتَفِعٍ مِنَ الْإِنْتاجِ وَالدَّخْلِ، وَبِحَياةٍ طَويلَةٍ وَصِحِّيَّةٍ بِجانِبِ تَنْمِيَةِ الْقُدُراتِ الْإِنْسانِيَّةِ مِنْ خِلالِ تَوْفيرِ فُرَصٍ مُلائِمَةٍ لِلتَّعْليمِ وَزِيادَةِ الْخِبْراتِ. وَقَدْ بَدَأَ هٰذا الْمَفْهومُ يَتَّضِحُ عَقِبَ انْتِهاءِ الْحَرْبِ الْعالَمِيَّةِ الثّانِيَةِ وَخُروجِ الْبُلْدانِ الَّتي شارَكَتْ في الْحَرْبِ مَصْدومَةً مِنَ الدَّمارِ الْبَشَرِيِّ وَالِاقْتِصادِيِّ الْهائِلِ وَخاصَّةً الدُّوَلَ الْخاسِرَةَ.', 'ص 26–37', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('التَّنْمِيَةُ الْبَشَرِيَّةُ هِيَ:','[{"id": "a", "text": "تَوْسيعُ الْقُدُراتِ التَّعْليمِيَّةِ وَالْخِبْراتِ لِلشُّعوبِ"}, {"id": "b", "text": "بِناءُ الطُّرُقِ وَالْجُسورِ"}, {"id": "c", "text": "زِيادَةُ عَدَدِ السُّكّانِ"}]'),('عَدَدُ عَناصِرِ دَليلِ التَّنْمِيَةِ الْبَشَرِيَّةِ:','[{"id": "a", "text": "ثَلاثَةٌ"}, {"id": "b", "text": "خَمْسَةٌ"}, {"id": "c", "text": "سَبْعَةٌ"}]'),('حَلَّتِ الْإِماراتُ في تَقْريرِ 2019 م في الْمَرْتَبَةِ:','[{"id": "a", "text": "35 عالَمِيًّا"}, {"id": "b", "text": "189 عالَمِيًّا"}, {"id": "c", "text": "15 عالَمِيًّا"}]'),('الْبِطالَةُ وَالْكَسادُ مِنْ مُشْكِلاتِ التَّنْمِيَةِ:','[{"id": "a", "text": "الِاقْتِصادِيَّةِ"}, {"id": "b", "text": "الصِّحِّيَّةِ"}, {"id": "c", "text": "التَّعْليمِيَّةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y8-T1-L3', 'الْبَيْتُ مُتَوَحِّدٌ', 3, 'ص 38–49', true, '🎯 أُناقِشُ أَهَمِّيَّةَ الْوَحْدَةِ الْوَطَنِيَّةِ وَدَوْري في الْمُحافَظَةِ عَلَيْها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ مَفْهومَ الْوَحْدَةِ الْوَطَنِيَّةِ وَعَوامِلَها.',1),('أَسْتَنْتِجُ مَظاهِرَ الْوَحْدَةِ الْوَطَنِيَّةِ في بِلادي.',2),('أُقَدِّرُ جُهودَ الدَّوْلَةِ في تَحْقيقِ الْوَحْدَةِ الْوَطَنِيَّةِ وَأُحَدِّدُ دَوْري.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْبَيْتُ مُتَوَحِّدٌ', 'وَتَعْني الْوَحْدَةُ الْوَطَنِيَّةُ: قِيامَ رابِطَةٍ قَوِيَّةٍ بَيْنَ مُواطِني الدَّوْلَةِ تُحَقِّقُ التَّفاعُلَ وَالتَّلاحُمَ وَالتَّعاضُدَ بَيْنَ جَميعِ أَفْرادِ الشَّعْبِ، وَتَقومُ عَلى عَناصِرَ واضِحَةٍ يَشْعُرُ بِها الْجَميعُ وَيُؤْمِنونَ بِها، وَهُمْ مُسْتَعِدّونَ لِلتَّضْحِيَةِ في سَبيلِها وَالدِّفاعِ عَنْها. وَقَدْ تَفَرَّدَ مُجْتَمَعُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ عَنْ غَيْرِهِ مِنَ الْمُجْتَمَعاتِ بِالْعَلاقَةِ الْحَميمَةِ وَالْأَبَوِيَّةِ بَيْنَ قادَتِهِ وَأَفْرادِ مُجْتَمَعِهِ، فَأَصْبَحَتِ الدَّوْلَةُ نَموذَجًا عالَمِيًّا رائِدًا تَقْتَدي بِهِ الدُّوَلُ.', 'ص 38–49', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الشُّعورُ بِالِانْتِماءِ وَالْوَلاءِ لِلْوَطَنِ هُوَ:','[{"id": "a", "text": "الْوَطَنِيَّةُ"}, {"id": "b", "text": "الْوَحْدَةُ"}, {"id": "c", "text": "التَّنْمِيَةُ"}]'),('مِنْ عَوامِلِ الْوَحْدَةِ الْوَطَنِيَّةِ:','[{"id": "a", "text": "اللُّغَةُ الْعَرَبِيَّةُ"}, {"id": "b", "text": "تَعَدُّدُ الْعُمْلاتِ"}, {"id": "c", "text": "اخْتِلافُ الْقَوانينِ"}]'),('عُقِدَ يَوْمُ عَهْدِ الِاتِّحادِ في:','[{"id": "a", "text": "18 يولْيو 1971 م"}, {"id": "b", "text": "2 ديسَمْبِرَ 1971 م"}, {"id": "c", "text": "6 مايو 1976 م"}]'),('عَدَدُ الْجِنْسِيّاتِ الَّتي تَعيشُ في دَوْلَةِ الْإِماراتِ أَكْثَرُ مِنْ:','[{"id": "a", "text": "200 جِنْسِيَّةٍ"}, {"id": "b", "text": "20 جِنْسِيَّةً"}, {"id": "c", "text": "50 جِنْسِيَّةً"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y8-T1-L4', 'قَضِيَّةُ الْجُزُرِ الْإِماراتِيَّةِ الثَّلاثِ الْمُحْتَلَّةِ', 3, 'ص 50–63', true, '🎯 أُقَدِّمُ أَدِلَّةً تُؤَكِّدُ عُروبَةَ الْجُزُرِ الْإِماراتِيَّةِ الثَّلاثِ، وَأُناقِشُ جُهودَ الدَّوْلَةِ لِاسْتِرْجاعِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ الْمَوْقِعَ الِاسْتِراتيجِيَّ لِلْجُزُرِ الثَّلاثِ وَمَساحاتِها.',1),('أُقَدِّمُ أَدِلَّةً تُؤَكِّدُ عُروبَةَ الْجُزُرِ وَمَظاهِرَ السِّيادَةِ الْإِماراتِيَّةِ عَلَيْها.',2),('أُناقِشُ جُهودَ دَوْلَةِ الْإِماراتِ وَالْحُلولَ السِّلْمِيَّةَ لِحَلِّ الْقَضِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'قَضِيَّةُ الْجُزُرِ الْإِماراتِيَّةِ الثَّلاثِ الْمُحْتَلَّةِ', 'لَقَدْ حَدَّدَ الْباني الْمُؤَسِّسُ الْمَغْفورُ لَهُ — بِإِذْنِ اللهِ — الشَّيْخُ زايِدُ بْنُ سُلْطانَ آلِ نَهْيانَ مَوْقِفَ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ مِنْ قَضِيَّةِ الْجُزُرِ في قَوْلِهِ: «فَإِنَّنا سَنُواصِلُ الْعَمَلَ لِاسْتِرْجاعِ جُزُرِنا الثَّلاثِ طُنْبَ الْكُبْرى وَطُنْبَ الصُّغْرى وَأَبو موسى الَّتي تُشَكِّلُ جُزْءًا لا يَتَجَزَّأُ مِنْ هٰذا الْوَطَنِ، وَحَقًّا مِنْ حُقوقِنا الْوَطَنِيَّةِ الرّاسِخَةِ، وَإِنَّنا في هٰذا السِّياقِ نُجَدِّدُ دَعْوَتَنا لِإيرانَ لِلِاسْتِجابَةِ لِما تَقَدَّمْنا بِهِ مِنْ مُبادَراتٍ وَنِداءاتٍ مِنْ أَجْلِ تَحْقيقِ حَلٍّ سِلْمِيٍّ لِلنِّزاعِ عَلَى الْجُزُرِ الثَّلاثِ».', 'ص 50–63', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَبْلُغُ مِساحَةُ جَزيرَةِ طُنْبَ الْكُبْرى:','[{"id": "a", "text": "11 كم²"}, {"id": "b", "text": "1.5 كم²"}, {"id": "c", "text": "60 كم²"}]'),('تَعودُ مِلْكِيَّةُ الْجُزُرِ الثَّلاثِ تاريخِيًّا إِلى قَبيلَةِ:','[{"id": "a", "text": "الْقَواسِمِ"}, {"id": "b", "text": "بَني ياسٍ"}, {"id": "c", "text": "الْمَناصيرِ"}]'),('مَقَرُّ مَحْكَمَةِ الْعَدْلِ الدَّوْلِيَّةِ في:','[{"id": "a", "text": "لاهايَ بِهولَنْدا"}, {"id": "b", "text": "نْيويورْكَ"}, {"id": "c", "text": "جِنيفَ"}]'),('يُصادِفُ «يَوْمُ الشَّهيدِ» في دَوْلَةِ الْإِماراتِ:','[{"id": "a", "text": "30 نوفَمْبِرَ"}, {"id": "b", "text": "2 ديسَمْبِرَ"}, {"id": "c", "text": "18 يولْيو"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 1, 2, 'الْوَحْدَةُ الثّانِيَةُ: الْإِماراتُ وَالْعالَمُ — قُوَّةٌ ناعِمَةٌ وَسُكّانٌ وَنُظُمٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=1
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y8-T1-L5', 'الْقُوَّةُ النّاعِمَةُ (Soft power)', 3, 'ص 66–76', true, '🎯 أَسْتَخْلِصُ مَفْهومَ الْقُوَّةِ النّاعِمَةِ وَمَصادِرَها، وَأَسْتَنْتِجُ أَهْدافَ تَشْكيلِ مَجْلِسِها في الدَّوْلَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَخْلِصُ مَفْهومَ الْقُوَّةِ النّاعِمَةِ وَمَصادِرَها في الْعالَمِ.',1),('أُوَضِّحُ مَعاييرَ قِياسِ الْقُوَّةِ النّاعِمَةِ لِلدُّوَلِ.',2),('أَسْتَنْتِجُ أَهْدافَ تَشْكيلِ مَجْلِسِ الْقُوَّةِ النّاعِمَةِ لِدَوْلَةِ الْإِماراتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْقُوَّةُ النّاعِمَةُ (Soft power)', 'وَتَعْني الْقُوَّةُ النّاعِمَةُ: الْقُدْرَةَ عَلَى الْحُصولِ عَلى ما تُريدُ مِنْ خِلالِ الْجَذْبِ بَدَلًا مِنَ الْإِجْبارِ أَوْ دَفْعِ الْأَمْوالِ. لِهٰذا لَجَأَتِ الدُّوَلُ الْكُبْرى إِلَى اعْتِمادِ اسْتِراتيجِيَّةِ الْقُوَّةِ النّاعِمَةِ مِنْ خِلالِ التَّأْثيرِ في حَياةِ وَأُسْلوبِ الْآخَرينَ لِاجْتِذابِهِمْ وَإِقْناعِهِمْ بِأَنْ يُريدوا ما تُريدُ. فَعِنْدَما تَكونُ سِياسَتُكَ مَشْروعَةً في عُيونِ الْآخَرينَ تَتَّسِعُ قُوَّتُكَ النّاعِمَةُ.', 'ص 66–76', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('صاغَ مُصْطَلَحَ الْقُوَّةِ النّاعِمَةِ لِأَوَّلِ مَرَّةٍ:','[{"id": "a", "text": "جوزيف ناي"}, {"id": "b", "text": "آدَمُ سْميثُ"}, {"id": "c", "text": "ابْنُ خَلْدونَ"}]'),('الْمَصْدَرُ الْأَوَّلُ لِقُوَّةِ الدُّوَلِ النّاعِمَةِ هُوَ:','[{"id": "a", "text": "الثَّقافَةُ"}, {"id": "b", "text": "الْجَيْشُ"}, {"id": "c", "text": "الْمَوْقِعُ"}]'),('أُعْلِنَ عَنْ تَشْكيلِ مَجْلِسِ الْقُوَّةِ النّاعِمَةِ لِلدَّوْلَةِ في:','[{"id": "a", "text": "أَبْريلَ 2017 م"}, {"id": "b", "text": "يَنايِرَ 2013 م"}, {"id": "c", "text": "ديسَمْبِرَ 1971 م"}]'),('الْقُوَّةُ الصَّلْبَةُ (Hard power) يُقْصَدُ بِها:','[{"id": "a", "text": "الْقُوَّةُ الْعَسْكَرِيَّةُ وَالْحُروبُ"}, {"id": "b", "text": "الْفُنونُ وَالْآدابُ"}, {"id": "c", "text": "السِّياحَةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'SS-Y8-T1-L6', 'سُكّانُ الْعالَمِ', 3, 'ص 77–93', true, '🎯 أَسْتَنْتِجُ الْعَوامِلَ الْمُؤَثِّرَةَ في نُمُوِّ السُّكّانِ وَتَوْزيعِهِمْ، وَأُفَسِّرُ الْخَرائِطَ وَالْأَشْكالَ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ أَهَمِّيَّةَ دِراسَةِ السُّكّانِ.',1),('أَسْتَنْتِجُ الْعَوامِلَ الْمُؤَثِّرَةَ في نُمُوِّ السُّكّانِ وَتَوْزيعِهِمْ.',2),('أُفَسِّرُ الْخَرائِطَ وَالْأَشْكالَ لِدَعْمِ الِاسْتِنْتاجاتِ في قَضايا تَرْكيبِ السُّكّانِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'سُكّانُ الْعالَمِ', 'يُسَمَّى التَّغَيُّرُ السُّكّانِيُّ النّاتِجُ عَنِ الْفَرْقِ بَيْنَ عَدَدِ الْمَواليدِ وَعَدَدِ الْوَفَياتِ في فَتْرَةٍ مُحَدَّدَةٍ لِسُكّانِ مُجْتَمَعٍ مُعَيَّنٍ بِالزِّيادَةِ الطَّبيعِيَّةِ لِلسُّكّانِ، وَيُحْسَبُ مُعَدَّلُ الزِّيادَةِ السُّكّانِيَّةِ وَفْقَ الْمُعادَلَةِ الْآتِيَةِ: مُعَدَّلُ الزِّيادَةِ السُّكّانِيَّةِ يُساوي الْفَرْقَ بَيْنَ عَدَدِ الْمَواليدِ وَعَدَدِ الْوَفَياتِ في سَنَةٍ مُحَدَّدَةٍ مَقْسومًا عَلى مُتَوَسِّطِ عَدَدِ السُّكّانِ في تِلْكَ السَّنَةِ؛ وَيُحْسَبُ الْمُعَدَّلُ عادَةً بِالْأَلْفِ أَوْ بِالْمِئَةِ.', 'ص 77–93', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَمَّ إِجْراءُ أَوَّلِ حَصْرٍ لِلسُّكّانِ في مِصْرَ عامَ:','[{"id": "a", "text": "2000 ق.م"}, {"id": "b", "text": "1650 م"}, {"id": "c", "text": "2020 م"}]'),('يُوافِقُ الْيَوْمُ الْعالَمِيُّ لِلسُّكّانِ:','[{"id": "a", "text": "11 يولْيو"}, {"id": "b", "text": "2 ديسَمْبِرَ"}, {"id": "c", "text": "30 نوفَمْبِرَ"}]'),('أَكْثَرُ قارّاتِ الْعالَمِ سُكّانًا هِيَ:','[{"id": "a", "text": "آسْيا"}, {"id": "b", "text": "أَفْريقْيا"}, {"id": "c", "text": "أوروبّا"}]'),('انْتِقالُ الْأَفْرادِ مِنْ مِنْطَقَةٍ إِلى أُخْرى داخِلَ الدَّوْلَةِ الْواحِدَةِ يُسَمّى:','[{"id": "a", "text": "الْهِجْرَةَ الدّاخِلِيَّةَ"}, {"id": "b", "text": "الْهِجْرَةَ الدَّوْلِيَّةَ"}, {"id": "c", "text": "صافِيَ الْهِجْرَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 7, 'SS-Y8-T1-L7', 'النُّمُوُّ الْحَضَرِيُّ', 3, 'ص 94–105', true, '🎯 أَسْتَنْتِجُ الْعَوامِلَ الَّتي أَدَّتْ إِلَى النُّمُوِّ الْحَضَرِيِّ، وَأُحَدِّدُ مَناطِقَ الِاسْتِقْرارِ السُّكّانِيِّ في الدَّوْلَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ أَهَمِّيَّةَ دِراسَةِ النُّمُوِّ الْحَضَرِيِّ.',1),('أَسْتَنْتِجُ الْعَوامِلَ الَّتي أَدَّتْ إِلَى النُّمُوِّ الْحَضَرِيِّ وَالتَّوَسُّعِ الْعُمْرانِيِّ.',2),('أُحَدِّدُ مَناطِقَ الِاسْتِقْرارِ السُّكّانِيِّ وَأَنْماطَ الْمَسْكَنِ في الدَّوْلَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'النُّمُوُّ الْحَضَرِيُّ', 'تَأَثَّرَ النُّمُوُّ الْحَضَرِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ تَأَثُّرًا كَبيرًا بِالْأَوْضاعِ الِاقْتِصادِيَّةِ وَالِاجْتِماعِيَّةِ وَالثَّقافِيَّةِ لِسُكّانِ الْمِنْطَقَةِ؛ فَلِعُقودٍ طَويلَةٍ قَبْلَ اكْتِشافِ النِّفْطِ كانَ أُسْلوبُ حَياةِ سُكّانِ الْمِنْطَقَةِ يَتَّصِفُ بِالْهُدوءِ وَالْحَياةِ التَّقْليدِيَّةِ الْبَسيطَةِ الْآمِنَةِ، وَانْعَكَسَتْ مَظاهِرُ وَسِماتُ تِلْكَ الْمَرْحَلَةِ عَلَى الْعِمارَةِ الْمَحَلِّيَّةِ بِالْمِنْطَقَةِ، وَساهَمَتِ الْعِمارَةُ في إيجادِ بيئَةٍ مُناسِبَةٍ لِلسُّكّانِ تُقَيِّمُ حَرارَةَ الْجَوِّ عَنْ طَريقِ حُلولٍ مُبْتَكَرَةٍ لِلِاسْتِفادَةِ مِنْ مَوادِّ الْبِناءِ الْمُتَوافِرَةِ وَاسْتِغْلالِ الرِّياحِ الْمُلَطِّفَةِ عَنْ طَريقِ الْبَراجيلِ.', 'ص 94–105', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('النُّمُوُّ الْحَضَرِيُّ هُوَ:','[{"id": "a", "text": "الزِّيادَةُ في مِساحَةِ مَناطِقِ الِاسْتِقْرارِ الْبَشَرِيِّ"}, {"id": "b", "text": "زِيادَةُ عَدَدِ الْمَواليدِ"}, {"id": "c", "text": "ارْتِفاعُ دَرَجَةِ الْحَرارَةِ"}]'),('مِنَ الْعَوامِلِ الَّتي أَدَّتْ إِلَى النُّمُوِّ الْحَضَرِيِّ:','[{"id": "a", "text": "الثَّوْرَةُ الصِّناعِيَّةُ"}, {"id": "b", "text": "ارْتِفاعُ الْأَمْطارِ"}, {"id": "c", "text": "قِلَّةُ السُّكّانِ"}]'),('يَبْلُغُ طولُ السّاحِلِ الْغَرْبِيِّ لِلدَّوْلَةِ:','[{"id": "a", "text": "640 كم"}, {"id": "b", "text": "64 كم"}, {"id": "c", "text": "6400 كم"}]'),('مِنْ أَمْثِلَةِ الْعُمْرانِ في نِطاقِ السَّهْلِ الْحَصَوِيِّ:','[{"id": "a", "text": "الذَّيْدُ"}, {"id": "b", "text": "الطَّوِيّينُ"}, {"id": "c", "text": "ليوا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=1
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 8, 'SS-Y8-T1-L8', 'النُّظُمُ الِاقْتِصادِيَّةُ الْعالَمِيَّةُ', 3, 'ص 106–117', true, '🎯 أُقارِنُ بَيْنَ الْأَنْظِمَةِ الِاقْتِصادِيَّةِ في الْمُجْتَمَعاتِ الْمُخْتَلِفَةِ وَأَسْتَنْتِجُ خَصائِصَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُعَرِّفُ النِّظامَ الِاقْتِصادِيَّ وَأُعَدِّدُ أَنْواعَهُ.',1),('أَسْتَنْتِجُ خَصائِصَ النِّظامَيْنِ الرَّأْسْمالِيِّ وَالِاشْتِراكِيِّ وَسَلْبِيّاتِهِما.',2),('أُقارِنُ بَيْنَ الْأَنْظِمَةِ الِاقْتِصادِيَّةِ وَأُبَيِّنُ مَوْقِعَ الْإِماراتِ مِنْها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'النُّظُمُ الِاقْتِصادِيَّةُ الْعالَمِيَّةُ', 'وَيُعَرَّفُ النِّظامُ الِاقْتِصادِيُّ بِأَنَّهُ: مَجْموعَةُ الْقَواعِدِ وَالْقَوانينِ الَّتي تُنَظِّمُ الْبيئَةَ الِاقْتِصادِيَّةَ في مُجْتَمَعٍ مُعَيَّنٍ. وَيَتَمَيَّزُ النِّظامُ الِاقْتِصادِيُّ الْإِسْلامِيُّ عَنْ غَيْرِهِ مِنَ النُّظُمِ الِاقْتِصادِيَّةِ الْأُخْرى بِأَنَّهُ جُزْءٌ مِنَ الدّينِ الْإِسْلامِيِّ؛ إِنَّ أَهَمَّ ما يُمَيِّزُ النِّظامَ الِاقْتِصادِيَّ الْإِسْلامِيَّ ارْتِباطُهُ التّامُّ بِدينِ الْإِسْلامِ عَقيدَةً وَشَريعَةً، الْأَمْرُ الَّذي يَجْعَلُ لِلنَّشاطِ الِاقْتِصادِيِّ في الْإِسْلامِ طابَعًا تَعَبُّدِيًّا وَهَدَفًا سامِيًا، وَيَجْعَلُ الرَّقابَةَ عَلَيْهِ رَقابَةً ذاتِيَّةً في الْمَقامِ الْأَوَّلِ.', 'ص 106–117', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T1-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَوَّلُ نِظامٍ اقْتِصادِيٍّ عَرَفَهُ الْإِنْسانُ هُوَ:','[{"id": "a", "text": "التَّقْليدِيُّ (الْبِدائِيُّ)"}, {"id": "b", "text": "الرَّأْسْمالِيُّ"}, {"id": "c", "text": "الِاشْتِراكِيُّ"}]'),('تَمْتَلِكُ الدَّوْلَةُ جَميعَ عَوامِلِ الْإِنْتاجِ في النِّظامِ:','[{"id": "a", "text": "الِاشْتِراكِيِّ"}, {"id": "b", "text": "الرَّأْسْمالِيِّ"}, {"id": "c", "text": "الْمُخْتَلَطِ"}]'),('مِنْ مَصادِرِ النِّظامِ الِاقْتِصادِيِّ الْإِسْلامِيِّ:','[{"id": "a", "text": "الْقُرْآنُ وَالسُّنَّةُ وَالْإِجْماعُ وَالْقِياسُ"}, {"id": "b", "text": "آراءُ الْفَلاسِفَةِ"}, {"id": "c", "text": "قَوانينُ السّوقِ"}]'),('حَرَصَتْ دَوْلَةُ الْإِماراتِ عَلَى النِّظامِ الِاقْتِصادِيِّ:','[{"id": "a", "text": "الْمُخْتَلَطِ"}, {"id": "b", "text": "الِاشْتِراكِيِّ"}, {"id": "c", "text": "التَّقْليدِيِّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;