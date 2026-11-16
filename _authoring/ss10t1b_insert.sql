begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 1, 4, 'الْوَحْدَةُ الرّابِعَةُ: نَظَرِيَّةُ الْفيدْرالِيَّةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=1
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T1-L12', 'الرُّؤْيَةُ الْأولى: مَفْهومُ الْفيدْرالِيَّةِ وَتاريخُها', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 15–20', true, '🎯 أُعَرِّفُ الْفيدْرالِيَّةَ، وَأُمَيِّزُ بَيْنَهَا وَبَيْنَ الدَّوْلَةِ الْمُوَحَّدَةِ وَالنِّظامِ الْكونْفيدْرالِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُعَرِّفُ الْفيدْرالِيَّةَ وَأَذْكُرُ مُسْتَوَيَيِ الْحُكْمِ فيها.',1),('أُمَيِّزُ بَيْنَ النِّظامِ الْفيدْرالِيِّ وَالدَّوْلَةِ الْمُوَحَّدَةِ وَالنِّظامِ الْكونْفيدْرالِيِّ.',2),('أَتَتَبَّعُ تاريخَ فِكْرَةِ الْفيدْرالِيَّةِ عِنْدَ مُفَكِّريها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: مَفْهومُ الْفيدْرالِيَّةِ وَتاريخُها', 'تَعْني الْفيدْرالِيَّةُ وُجودَ مُسْتَوَيَيْنِ مِنَ الْحُكْمِ في الدَّوْلَةِ، هُما: الْحُكْمُ الْمَرْكَزِيُّ عَلَى الْمُسْتَوَى الِاتِّحادِيِّ لِلدَّوْلَةِ، وَالْحُكْمُ الْمَحَلِّيُّ عَلى مُسْتَوَى الْوَحَداتِ السِّياسِيَّةِ الْمُكَوِّنَةِ لِلدَّوْلَةِ الْفيدْرالِيَّةِ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 15)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 15–20', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ مُسْتَوَياتِ الْحُكْمِ في الدَّوْلَةِ الْفيدْرالِيَّةِ:','[{"id": "a", "text": "مُسْتَوَيانِ"}, {"id": "b", "text": "مُسْتَوًى واحِدٌ"}, {"id": "c", "text": "ثَلاثَةُ مُسْتَوَياتٍ"}]'),('يُعْتَبَرُ أَبَا الْفيدْرالِيَّةِ الْمُعاصِرَةِ:','[{"id": "a", "text": "جوهانيس أَلْثوسْيوس"}, {"id": "b", "text": "ديفيد هيوم"}, {"id": "c", "text": "إيمانْويل كانْط"}]'),('تُسَمَّى الْوَحَداتُ السِّياسِيَّةُ في سويسْرا:','[{"id": "a", "text": "كانْتوناتٍ"}, {"id": "b", "text": "مُقاطَعاتٍ"}, {"id": "c", "text": "لانْدَر"}]'),('النِّظامُ الَّذي تَفوقُ فيهِ صَلاحِيّاتُ الْأَعْضاءِ صَلاحِيّاتِ الْمَرْكَزِ:','[{"id": "a", "text": "الْكونْفيدْرالِيُّ"}, {"id": "b", "text": "الْفيدْرالِيُّ"}, {"id": "c", "text": "الْمُوَحَّدُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T1-L13', 'الرُّؤْيَةُ الثّانِيَةُ: السُّلُطاتُ الثَّلاثُ وَالْفَصْلُ بَيْنَها وَواقِعُ الْفيدْرالِيَّةِ الْيَوْمَ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 21–28', true, '🎯 أَصِفُ مَهامَّ السُّلُطاتِ الثَّلاثِ في الدَّوْلَةِ الْفيدْرالِيَّةِ، وَأُفَسِّرُ مَبْدَأَ الْفَصْلِ بَيْنَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ مَهامَّ السُّلُطاتِ الثَّلاثِ عَلَى الْمُسْتَوَيَيْنِ الِاتِّحادِيِّ وَالْمَحَلِّيِّ.',1),('أُفَسِّرُ مَبْدَأَ الْفَصْلِ بَيْنَ السُّلُطاتِ وَأَهَمِّيَّتَهُ.',2),('أَقْرَأُ واقِعَ الْفيدْرالِيَّةِ في الْعالَمِ الْيَوْمَ مِنْ خِلالِ الْجَداوِلِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: السُّلُطاتُ الثَّلاثُ وَالْفَصْلُ بَيْنَها وَواقِعُ الْفيدْرالِيَّةِ الْيَوْمَ', 'يُعْتَبَرُ مَبْدَأُ الْفَصْلِ بَيْنَ السُّلُطاتِ واحِدًا مِنْ أَهَمِّ سِماتِ الدُّوَلِ الْحَديثَةِ وَالْمُعاصِرَةِ. فَهٰذَا الْمَبْدَأُ يَقومُ عَلى أَساسِ أَنَّ السُّلُطاتِ الثَّلاثَ الرَّئيسَةَ (التَّنْفيذِيَّةَ وَالتَّشْريعِيَّةَ وَالْقَضائِيَّةَ) لا بُدَّ أَلّا تَتَواجَدَ كُلُّ واحِدَةٍ مِنْها في فَرْعٍ مُسْتَقِلٍّ، بِحَيْثُ لا يَكونُ هُناكَ تَداخُلٌ في الصَّلاحِيّاتِ بَيْنَ تِلْكَ السُّلُطاتِ الثَّلاثِ؛ حَتّى لا تُسَيْطِرَ إِحْداها عَلَى الْأُخْرى. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 25)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 21–28', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('السُّلْطَةُ الْمَسْؤولَةُ عَنْ تَفْسيرِ الْقَوانينِ:','[{"id": "a", "text": "الْقَضائِيَّةُ"}, {"id": "b", "text": "التَّنْفيذِيَّةُ"}, {"id": "c", "text": "التَّشْريعِيَّةُ"}]'),('عَدَدُ الدُّوَلِ الَّتي تَتْبَعُ النِّظامَ الْفيدْرالِيَّ في الْعالَمِ:','[{"id": "a", "text": "24 دَوْلَةً"}, {"id": "b", "text": "40 دَوْلَةً"}, {"id": "c", "text": "13 دَوْلَةً"}]'),('الدَّوْلَتانِ في مَرْحَلَةِ التَّحَوُّلِ نَحْوَ الْفيدْرالِيَّةِ:','[{"id": "a", "text": "الْعِراقُ وَالسّودانُ"}, {"id": "b", "text": "سويسْرا وَكَنَدا"}, {"id": "c", "text": "الْهِنْدُ وَالْبْرازيلُ"}]'),('مِنْ مَهامِّ السُّلْطَةِ التَّشْريعِيَّةِ:','[{"id": "a", "text": "تَشْريعُ الْقَوانينِ الِاتِّحادِيَّةِ"}, {"id": "b", "text": "إِدارَةُ الْأَزَماتِ"}, {"id": "c", "text": "تَفْسيرُ الدُّسْتورِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T1-L14', 'الرُّؤْيَةُ الثّالِثَةُ: مُكَوِّناتُ الْفيدْرالِيَّةِ وَعَوامِلُ نَشْأَتِها وَأَنْواعُها وَمُمَيِّزاتُها', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 29–36', true, '🎯 أَسْتَنْتِجُ مُكَوِّناتِ النِّظامِ الْفيدْرالِيِّ وَعَوامِلَ نَشْأَتِهِ، وَأُقَوِّمُ مُمَيِّزاتِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ الْمُكَوِّناتِ الَّتي يَجِبُ أَنْ تَتَوافَرَ في النُّظُمِ الْفيدْرالِيَّةِ.',1),('أُعَدِّدُ الْعَوامِلَ الْمُساعِدَةَ عَلى نَشْأَةِ النُّظُمِ الْفيدْرالِيَّةِ وَطُرُقَ نَشْأَتِها.',2),('أُقَوِّمُ مُمَيِّزاتِ النِّظامِ الْفيدْرالِيِّ وَأُمَيِّزُ بَيْنَ نَوْعَيْهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: مُكَوِّناتُ الْفيدْرالِيَّةِ وَعَوامِلُ نَشْأَتِها وَأَنْواعُها وَمُمَيِّزاتُها', 'عادَةً ما تَنْشَأُ الدُّوَلُ الْفيدْرالِيَّةُ مِنْ خِلالِ إِحْدَى الطَّريقَتَيْنِ الْآتِيَتَيْنِ: الْمَجيءُ مَعًا، وَذٰلِكَ مِنْ خِلالِ قِيامِ دُوَلٍ مُسْتَقِلَّةٍ مَعًا بِالِانْضِمامِ في نِظامٍ فيدْرالِيٍّ تَتَنازَلُ مِنْ خِلالِهِ عَنْ بَعْضٍ مِنْ سُلُطاتِها وَصَلاحِيّاتِها لِحُكومَةٍ اتِّحادِيَّةٍ في الْمَرْكَزِ… وَهُوَ الْأُسْلوبُ الَّذي اتَّبَعَتْهُ الْوِلاياتُ الْمُتَّحِدَةُ وَسويسْرا وَأُسْتْرالْيا، وَكَذٰلِكَ الْإِماراتُ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 32)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 29–36', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَشَأَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ بِطَريقَةِ:','[{"id": "a", "text": "الْمَجيءِ مَعًا"}, {"id": "b", "text": "الْبَقاءِ مَعًا"}, {"id": "c", "text": "الِانْفِصالِ"}]'),('عَدَدُ اللُّغاتِ الَّتي دَمَجَتْهَا الْفيدْرالِيَّةُ السويسْرِيَّةُ:','[{"id": "a", "text": "أَرْبَعُ لُغاتٍ"}, {"id": "b", "text": "لُغَتانِ"}, {"id": "c", "text": "106 لُغاتٍ"}]'),('النَّوْعُ الَّذي تَكونُ فيهِ السُّلُطاتُ مُتَداخِلَةً وَيُشَجِّعُ التَّعاوُنَ:','[{"id": "a", "text": "الْفيدْرالِيَّةُ التَّعاوُنِيَّةُ"}, {"id": "b", "text": "الْفيدْرالِيَّةُ الْمُزْدَوَجَةُ"}, {"id": "c", "text": "الْكونْفيدْرالِيَّةُ"}]'),('مِنْ مُكَوِّناتِ الْفيدْرالِيَّةِ وُجودُ:','[{"id": "a", "text": "دُسْتورٍ مَكْتوبٍ وَمَحْكَمَةٍ اتِّحادِيَّةٍ عُلْيا"}, {"id": "b", "text": "حِزْبٍ واحِدٍ حاكِمٍ"}, {"id": "c", "text": "عاصِمَةٍ مُتَنَقِّلَةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 1, 5, 'الْوَحْدَةُ الْخامِسَةُ: الْفيدْرالِيَّةُ الْإِماراتِيَّةُ — النَّشْأَةُ وَالسِّماتُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=1
                  and sort_order=5 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T1-L15', 'الرُّؤْيَةُ الْأولى: تاريخُ الْإِماراتِ السِّياسِيُّ وَالِانْسِحابُ الْبْريطانِيُّ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 37–46', true, '🎯 أَتَتَبَّعُ مَسارَ قِيامِ دَوْلَةِ الْإِماراتِ مِنَ الْمُعاهَداتِ الْبْريطانِيَّةِ إِلى إِعْلانِ الِاتِّحادِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ طَبيعَةَ الْعَلاقَةِ بَيْنَ بْريطانْيا وَالْإِماراتِ الْمُتَصالِحَةِ.',1),('أُعَلِّلُ الْقَرارَ الْبْريطانِيَّ بِالِانْسِحابِ وَرَدَّ فِعْلِ الْمَشايِخِ عَلَيْهِ.',2),('أُرَتِّبُ مَحَطّاتِ قِيامِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: تاريخُ الْإِماراتِ السِّياسِيُّ وَالِانْسِحابُ الْبْريطانِيُّ', 'لَقَدْ أَيْقَنَ حاكِمُ أَبوظَبِيَ الشَّيْخُ زايِدُ بْنُ سُلْطانَ آلِ نَهْيانَ وَحاكِمُ دُبَيَّ الشَّيْخُ راشِدُ بْنُ سَعيدٍ آلِ مَكْتومٍ أَنَّ الظُّروفَ لا تَسيرُ لِصالِحِهِمْ، وَأَنَّ مُواجَهَةَ التَّحَدِّياتِ لا يُمْكِنُ أَنْ تَتِمَّ بِشَكْلٍ فَرْدِيٍّ مِنْ قِبَلِ كُلِّ إِمارَةٍ وَحْدَها، بَلْ كانَتِ الْقَناعَةُ الْمُتَوافِرَةُ لَدَيْهِمْ في ذٰلِكَ الْوَقْتِ هِيَ ضَرورَةَ تَحْقيقِ الْأَمْنِ مِنْ خِلالِ الْعَمَلِ الْمُشْتَرَكِ بَيْنَ مَشايِخِ الْإِماراتِ لِمُواجَهَةِ ظُروفِ ما بَعْدَ الِانْسِحابِ الْبْريطانِيِّ مِنَ الْمِنْطَقَةِ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 43)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 37–46', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L15/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('سُمِّيَتِ الْمِنْطَقَةُ بِالْإِماراتِ الْمُتَصالِحَةِ مُنْذُ عامِ:','[{"id": "a", "text": "1820 م"}, {"id": "b", "text": "1892 م"}, {"id": "c", "text": "1971 م"}]'),('عُقِدَ الِاتِّحادُ الثُّنائِيُّ بَيْنَ أَبوظَبِيَ وَدُبَيَّ في:','[{"id": "a", "text": "18 فِبْرايِرَ 1968 م"}, {"id": "b", "text": "26 فِبْرايِرَ 1968 م"}, {"id": "c", "text": "18 يولْيو 1971 م"}]'),('أَعْلَنَتْ بْريطانْيا عَزْمَها الِانْسِحابَ في:','[{"id": "a", "text": "يَنايِرَ 1968 م"}, {"id": "b", "text": "يَنايِرَ 1971 م"}, {"id": "c", "text": "مارِسَ 1892 م"}]'),('عَدَدُ الْإِماراتِ الَّتي تَأَسَّسَتْ بِهَا الدَّوْلَةُ في 18 يولْيو 1971 م:','[{"id": "a", "text": "سِتُّ إِماراتٍ"}, {"id": "b", "text": "سَبْعُ إِماراتٍ"}, {"id": "c", "text": "تِسْعُ إِماراتٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T1-L16', 'الرُّؤْيَةُ الثّانِيَةُ: النِّظامُ السِّياسِيُّ وَشَكْلُ الدَّوْلَةِ وَعَوامِلُ قِيامِ الْفيدْرالِيَّةِ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 47–51', true, '🎯 أَصِفُ النِّظامَ السِّياسِيَّ في دَوْلَةِ الْإِماراتِ، وَأَسْتَنْتِجُ الْعَوامِلَ الَّتي ساعَدَتْ عَلى قِيامِ الْفيدْرالِيَّةِ فيها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ النِّظامَ السِّياسِيَّ في دَوْلَةِ الْإِماراتِ وَطَريقَةَ تَداوُلِ السُّلْطَةِ فيهِ.',1),('أُبَيِّنُ شَكْلَ الدَّوْلَةِ وَمُسْتَوَيَيِ الْحُكْمِ فيها.',2),('أَسْتَنْتِجُ الْعَوامِلَ الثَّلاثَةَ الَّتي ساعَدَتْ عَلَى اتِّباعِ النَّهْجِ الْفيدْرالِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: النِّظامُ السِّياسِيُّ وَشَكْلُ الدَّوْلَةِ وَعَوامِلُ قِيامِ الْفيدْرالِيَّةِ', 'دَوْلَةُ الْإِماراتِ دَوْلَةٌ فيدْرالِيَّةٌ دُسْتورِيَّةٌ قائِمَةٌ عَلى أَساسِ اتِّحادٍ بَيْنَ وَحَداتٍ سِياسِيَّةٍ هِيَ الْإِماراتُ السَّبْعُ، الَّتي قَرَّرَتِ التَّخَلِّيَ عَنْ بَعْضِ صَلاحِيّاتِهَا التَّنْفيذِيَّةِ وَالتَّشْريعِيَّةِ وَالْقَضائِيَّةِ وَبَعْضِ مَلامِحِ سِيادَتِها لِصالِحِ دَوْلَةِ الِاتِّحادِ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 49)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 47–51', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L16/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('النِّظامُ السِّياسِيُّ في دَوْلَةِ الْإِماراتِ:','[{"id": "a", "text": "وِراثِيٌّ مَشْيَخِيٌّ"}, {"id": "b", "text": "جُمْهورِيٌّ"}, {"id": "c", "text": "حِزْبِيٌّ"}]'),('الْأُسْرَةُ الْحاكِمَةُ في إِمارَةِ الْفُجَيْرَةِ:','[{"id": "a", "text": "الشَّرْقِيُّ"}, {"id": "b", "text": "الْمُعَلّا"}, {"id": "c", "text": "النُّعَيْمِيُّ"}]'),('مِنَ الْعَوامِلِ الثَّلاثَةِ الَّتي ساعَدَتْ عَلى قِيامِ الْفيدْرالِيَّةِ:','[{"id": "a", "text": "قِلَّةُ الْإِمْكاناتِ"}, {"id": "b", "text": "كَثْرَةُ السُّكّانِ"}, {"id": "c", "text": "اتِّساعُ الْمِساحَةِ"}]'),('حَقُّ انْتِخابِ رَئيسِ الِاتِّحادِ وَنائِبِهِ لِـ:','[{"id": "a", "text": "أَعْضاءِ الْمَجْلِسِ الْأَعْلَى السَّبْعَةِ"}, {"id": "b", "text": "الْمَجْلِسِ الْوَطَنِيِّ الِاتِّحادِيِّ"}, {"id": "c", "text": "مَجْلِسِ الْوُزَراءِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T1-L17', 'الرُّؤْيَةُ الثّالِثَةُ: سِماتُ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 51–63', true, '🎯 أُحَلِّلُ سِماتِ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ الثَّلاثَ مُسْتَنِدًا إِلى مَوادِّ الدُّسْتورِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ مَعْنى كَوْنِ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ مُزْدَوَجَةً.',1),('أُفَسِّرُ مَعْنى كَوْنِها عَمودِيَّةً مُسْتَنِدًا إِلى تَوْزيعِ الْمَقاعِدِ.',2),('أَصِفُ مَعْنى كَوْنِها أُفُقِيَّةً عَلَى الْمُسْتَوَى الْمَحَلِّيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: سِماتُ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ', 'الْفيدْرالِيَّةُ الْإِماراتِيَّةُ وَإِنْ كانَتْ عَمودِيَّةً عَلَى الْمُسْتَوَى الِاتِّحادِيِّ إِلّا أَنَّها فيدْرالِيَّةٌ أُفُقِيَّةٌ عَلى مُسْتَوَى الْوَحَداتِ السِّياسِيَّةِ الْمُكَوِّنَةِ لِلِاتِّحادِ، حَيْثُ إِنَّ الْإِماراتِ الْأَعْضاءَ في الِاتِّحادِ مُتَساوِيَةٌ فيما تَتَمَتَّعُ بِهِ مِنْ صَلاحِيّاتٍ وَسُلُطاتٍ عَلَى الْمُسْتَوَى الْمَحَلِّيِّ، وَفْقًا لِما مَنَحَهَا الدُّسْتورُ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 63)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 51–63', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L17/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تُحَدِّدُ الْمادَّةُ 121 مِنَ الدُّسْتورِ:','[{"id": "a", "text": "ما يَنْفَرِدُ الِاتِّحادُ بِتَشْريعِهِ فَقَطْ"}, {"id": "b", "text": "ما يَنْفَرِدُ بِتَشْريعِهِ وَتَنْفيذِهِ"}, {"id": "c", "text": "مِلْكِيَّةَ الثَّرَواتِ الطَّبيعِيَّةِ"}]'),('عَدَدُ مَقاعِدِ إِمارَةِ الشّارِقَةِ في الْمَجْلِسِ الْوَطَنِيِّ:','[{"id": "a", "text": "سِتَّةٌ"}, {"id": "b", "text": "ثَمانِيَةٌ"}, {"id": "c", "text": "أَرْبَعَةٌ"}]'),('تَعْني الْفيدْرالِيَّةُ الْأُفُقِيَّةُ في الْإِماراتِ:','[{"id": "a", "text": "تَساوِيَ الْإِماراتِ في الصَّلاحِيّاتِ الْمَحَلِّيَّةِ"}, {"id": "b", "text": "تَفاوُتَها في الْمَقاعِدِ"}, {"id": "c", "text": "انْفِرادَ الِاتِّحادِ بِالتَّشْريعِ"}]'),('نَصَّتْ عَلى مِلْكِيَّةِ الْإِمارَةِ لِثَرَواتِها الطَّبيعِيَّةِ الْمادَّةُ:','[{"id": "a", "text": "23"}, {"id": "b", "text": "120"}, {"id": "c", "text": "121"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T1-L18', 'الرُّؤْيَةُ الرّابِعَةُ: خُطُواتُ الِانْدِماجِ الْفيدْرالِيِّ في الْإِماراتِ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 63–70', true, '🎯 أُرَتِّبُ خُطُواتِ الِانْدِماجِ الْفيدْرالِيِّ، وَأُقَدِّرُ أَثَرَ كُلٍّ مِنْها في تَرْسيخِ الِاتِّحادِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُرَتِّبُ خُطُواتِ الِانْدِماجِ الْفيدْرالِيِّ في دَوْلَةِ الْإِماراتِ.',1),('أُقَدِّرُ أَثَرَ كُلِّ خُطْوَةٍ في تَعْزيزِ الْعَمَلِ الِاتِّحادِيِّ.',2),('أُثَمِّنُ جُهودَ الْقِيادَةِ في تَرْسيخِ النَّهْجِ الِاتِّحادِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: خُطُواتُ الِانْدِماجِ الْفيدْرالِيِّ في الْإِماراتِ', 'لَمْ تَكُنْ عَمَلِيَّةُ السَّيْرِ نَحْوَ الِانْدِماجِ الْفيدْرالِيِّ في الْإِماراتِ بِالْعَمَلِيَّةِ السَّلِسَةِ عَلَى الْإِطْلاقِ، وَإِنَّما سارَتْ عَمَلِيَّةُ الِانْدِماجِ الْفيدْرالِيِّ وَتَطْبيقِ مَبادِئِ الْفيدْرالِيَّةِ في الْمُمارَسَةِ الْإِماراتِيَّةِ بِعِدَّةِ خُطُواتٍ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 63)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 63–70', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L18/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أُنْشِئَ مَجْلِسُ نَقْدِ الْإِماراتِ في:','[{"id": "a", "text": "مايو 1973 م"}, {"id": "b", "text": "مايو 1976 م"}, {"id": "c", "text": "عامِ 1980 م"}]'),('عَدَدُ وُزَراءِ الْوِزارَةِ الِاتِّحادِيَّةِ الثّانِيَةِ:','[{"id": "a", "text": "26 وَزيرًا"}, {"id": "b", "text": "19 وَزيرًا"}, {"id": "c", "text": "40 وَزيرًا"}]'),('تَمَّ تَحْويلُ الدُّسْتورِ إِلى دائِمٍ وَتَحْديدُ الْعاصِمَةِ في:','[{"id": "a", "text": "مايو 1996 م"}, {"id": "b", "text": "مايو 1992 م"}, {"id": "c", "text": "ديسِمْبِرَ 1971 م"}]'),('نِسْبَةُ ما خَصَّصَتْهُ أَبوظَبِي مِنْ إيراداتِهَا الْعامَّةِ لِلِاتِّحادِ عامَ 1975 م:','[{"id": "a", "text": "50%"}, {"id": "b", "text": "25%"}, {"id": "c", "text": "70%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 1, 6, 'الْوَحْدَةُ السّادِسَةُ: السُّلُطاتُ الِاتِّحادِيَّةُ وَمُسْتَقْبَلُ الْفيدْرالِيَّةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=1
                  and sort_order=6 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T1-L19', 'الرُّؤْيَةُ الْأولى: السُّلْطَتانِ التَّنْفيذِيَّةُ وَالتَّشْريعِيَّةُ الِاتِّحادِيَّتانِ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 71–106', true, '🎯 أَصِفُ تَكْوينَ السُّلْطَتَيْنِ التَّنْفيذِيَّةِ وَالتَّشْريعِيَّةِ في دَوْلَةِ الْإِماراتِ وَصَلاحِيّاتِ كُلٍّ مِنْهُما.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ تَكْوينَ الْمَجْلِسِ الْأَعْلى لِلِاتِّحادِ وَصَلاحِيّاتِهِ.',1),('أُبَيِّنُ صَلاحِيّاتِ رَئيسِ الِاتِّحادِ وَنائِبِهِ.',2),('أَصِفُ دَوْرَ مَجْلِسِ الْوُزَراءِ بِوَصْفِهِ الْهَيْئَةَ التَّنْفيذِيَّةَ لِلِاتِّحادِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: السُّلْطَتانِ التَّنْفيذِيَّةُ وَالتَّشْريعِيَّةُ الِاتِّحادِيَّتانِ', 'يُعْتَبَرُ الْمَجْلِسُ الْأَعْلى لِلِاتِّحادِ أَعْلى سُلْطَةٍ اتِّحادِيَّةٍ في دَوْلَةِ الْإِماراتِ، وَهُوَ يَتَكَوَّنُ مِنْ سَبْعَةِ أَعْضاءٍ، هُمْ حُكّامُ الْإِماراتِ السَّبْعِ الْمُكَوِّنَةِ لِدَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ… وَيَنْتَخِبُ الْمَجْلِسُ مِنْ بَيْنِ أَعْضائِهِ رَئيسًا لِلِاتِّحادِ وَنائِبًا لِلرَّئيسِ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 74–75)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 71–106', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L19/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ أَعْضاءِ الْمَجْلِسِ الْأَعْلى لِلِاتِّحادِ:','[{"id": "a", "text": "سَبْعَةٌ"}, {"id": "b", "text": "خَمْسَةٌ"}, {"id": "c", "text": "أَرْبَعونَ"}]'),('مُدَّةُ وِلايَةِ رَئيسِ الِاتِّحادِ:','[{"id": "a", "text": "خَمْسُ سَنَواتٍ"}, {"id": "b", "text": "أَرْبَعُ سَنَواتٍ"}, {"id": "c", "text": "سَنَتانِ"}]'),('وَصَفَ الدُّسْتورُ مَجْلِسَ الْوُزَراءِ بِأَنَّهُ:','[{"id": "a", "text": "الْهَيْئَةُ التَّنْفيذِيَّةُ لِلِاتِّحادِ"}, {"id": "b", "text": "السُّلْطَةُ التَّشْريعِيَّةُ"}, {"id": "c", "text": "أَعْلى سُلْطَةٍ اتِّحادِيَّةٍ"}]'),('نِصابُ انْعِقادِ الْمَجْلِسِ الْأَعْلى:','[{"id": "a", "text": "خَمْسَةُ أَعْضاءٍ مِنْهُمْ أَبوظَبِي وَدُبَيُّ"}, {"id": "b", "text": "ثَلاثَةُ أَعْضاءٍ"}, {"id": "c", "text": "الْأَعْضاءُ السَّبْعَةُ جَميعًا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T1-L20', 'الرُّؤْيَةُ الثّانِيَةُ: الْهَيْئاتُ الِاتِّحادِيَّةُ وَالسُّلْطَةُ الْقَضائِيَّةُ وَالسُّلُطاتُ الْمَحَلِّيَّةُ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 107–134', true, '🎯 أَصِفُ دَوْرَ الْهَيْئاتِ الِاتِّحادِيَّةِ وَالسُّلْطَةِ الْقَضائِيَّةِ، وَأُقارِنُ بَيْنَ الْمُسْتَوَيَيْنِ الِاتِّحادِيِّ وَالْمَحَلِّيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ دَوْرَ الْهَيْئاتِ وَالْمُؤَسَّساتِ الِاتِّحادِيَّةِ الْعامَّةِ.',1),('أُبَيِّنُ اخْتِصاصاتِ الْمَحْكَمَةِ الِاتِّحادِيَّةِ الْعُلْيا.',2),('أُقارِنُ بَيْنَ السُّلُطاتِ عَلَى الْمُسْتَوَيَيْنِ الِاتِّحادِيِّ وَالْمَحَلِّيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْهَيْئاتُ الِاتِّحادِيَّةُ وَالسُّلْطَةُ الْقَضائِيَّةُ وَالسُّلُطاتُ الْمَحَلِّيَّةُ', 'لَقَدْ نَصَّ الدُّسْتورُ في مادَّتِهِ 101 أَنَّ أَحْكامَ الْمَحْكَمَةِ الِاتِّحادِيَّةِ الْعُلْيا هِيَ أَحْكامٌ نِهائِيَّةٌ وَمُلْزِمَةٌ لِلْجَميعِ، فَإِذا ما قَرَّرَتِ الْمَحْكَمَةُ الِاتِّحادِيَّةُ الْعُلْيا اعْتِبارَ تَشْريعٍ اتِّحادِيٍّ أَوْ تَشْريعٍ مَحَلِّيٍّ مُخالِفًا لِدُسْتورِ الِاتِّحادِ تَعَيَّنَ عَلَى السُّلُطاتِ الْمَعْنِيَّةِ الْمُبادَرَةُ لِاتِّخاذِ ما يَلْزَمُ مِنْ تَدابيرَ لِإِزالَةِ الْمُخالَفَةِ الدُّسْتورِيَّةِ أَوْ تَصْحيحِها. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 132)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 107–134', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L20/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَعْلى سُلْطَةٍ قَضائِيَّةٍ في الدَّوْلَةِ:','[{"id": "a", "text": "الْمَحْكَمَةُ الِاتِّحادِيَّةُ الْعُلْيا"}, {"id": "b", "text": "مَحاكِمُ الِاسْتِئْنافِ"}, {"id": "c", "text": "الْمَحاكِمُ الِابْتِدائِيَّةُ"}]'),('تَحَوَّلَ مَجْلِسُ النَّقْدِ إِلى مَصْرِفٍ مَرْكَزِيٍّ عامَ:','[{"id": "a", "text": "1980 م"}, {"id": "b", "text": "1973 م"}, {"id": "c", "text": "1982 م"}]'),('الْهَيْئَةُ الْمُسْتَقِلَّةُ الَّتي تَلْحَقُ بِالْمَجْلِسِ الْوَطَنِيِّ الِاتِّحادِيِّ:','[{"id": "a", "text": "ديوانُ الْمُحاسَبَةِ"}, {"id": "b", "text": "الْهَيْئَةُ الْعامَّةُ لِلْمَعْلوماتِ"}, {"id": "c", "text": "صُنْدوقُ الزَّكاةِ"}]'),('في كُلِّ إِمارَةٍ صاحِبُ الْقُوَّةِ التَّشْريعِيَّةِ وَالتَّنْفيذِيَّةِ هُوَ:','[{"id": "a", "text": "الْحاكِمُ"}, {"id": "b", "text": "الْمَجْلِسُ الْوَطَنِيُّ"}, {"id": "c", "text": "مَجْلِسُ الْوُزَراءِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T1-L21', 'الرُّؤْيَةُ الثّالِثَةُ: الْمَجْلِسُ الْوَطَنِيُّ الِاتِّحادِيُّ وَالتَّجْرِبَةُ الِانْتِخابِيَّةُ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 135–150', true, '🎯 أَصِفُ تَكْوينَ الْمَجْلِسِ الْوَطَنِيِّ الِاتِّحادِيِّ وَصَلاحِيَّتَهُ، وَأُقَوِّمُ التَّجْرِبَةَ الِانْتِخابِيَّةَ الْأولى.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ صَلاحِيَّةَ الْمَجْلِسِ الْوَطَنِيِّ الِاتِّحادِيِّ وَعُضْوِيَّتَهُ.',1),('أُبَيِّنُ مَرْحَلَتَيِ اخْتِيارِ أَعْضاءِ الْمَجْلِسِ.',2),('أُقَوِّمُ التَّجْرِبَةَ الِانْتِخابِيَّةَ الْأولى مِنْ نَواحيها الثَّلاثِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْمَجْلِسُ الْوَطَنِيُّ الِاتِّحادِيُّ وَالتَّجْرِبَةُ الِانْتِخابِيَّةُ', 'الْمَجْلِسُ الْوَطَنِيُّ الِاتِّحادِيُّ هُوَ أَحَدُ أَجْهِزَةِ الْحُكومَةِ الِاتِّحادِيَّةِ. إِلّا أَنَّ الْمَجْلِسَ لا يُعْتَبَرُ مَجْلِسًا تَشْريعِيًّا أَوْ رَقابِيًّا يَقومُ بِعَمَلِيَّةِ وَضْعِ التَّشْريعاتِ وَالْقَوانينِ وَمُراقَبَةِ مَدَى الِالْتِزامِ بِها، وَإِنَّما هُوَ جِهَةٌ اسْتِشارِيَّةٌ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 135)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 135–150', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L21/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ أَعْضاءِ الْمَجْلِسِ الْوَطَنِيِّ الِاتِّحادِيِّ:','[{"id": "a", "text": "أَرْبَعونَ عُضْوًا"}, {"id": "b", "text": "سَبْعَةٌ"}, {"id": "c", "text": "عِشْرونَ"}]'),('أَوَّلُ امْرَأَةٍ انْتُخِبَتْ في الْمَجْلِسِ الْوَطَنِيِّ:','[{"id": "a", "text": "الدُّكْتورَةُ أَمَلُ الْقُبَيْسِيُّ"}, {"id": "b", "text": "الدُّكْتورَةُ مَرْيَمُ"}, {"id": "c", "text": "لَمْ تَفُزْ أَيَّةُ امْرَأَةٍ"}]'),('عَدَدُ أَعْضاءِ الْهَيْئَةِ الِانْتِخابِيَّةِ عامَ 2006 م:','[{"id": "a", "text": "6689 شَخْصًا"}, {"id": "b", "text": "439 شَخْصًا"}, {"id": "c", "text": "58 شَخْصًا"}]'),('الْحَدُّ الْأَدْنى لِعُمْرِ عُضْوِ الْمَجْلِسِ:','[{"id": "a", "text": "25 سَنَةً"}, {"id": "b", "text": "21 سَنَةً"}, {"id": "c", "text": "30 سَنَةً"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=1
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T1-L22', 'الرُّؤْيَةُ الرّابِعَةُ: مُسْتَقْبَلُ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ', 3, 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 151–169', true, '🎯 أَسْتَشْرِفُ مُسْتَقْبَلَ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ مِنْ خِلالِ مَراحِلِها وَمَحاوِرِ تَمْكينِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُرَتِّبُ مَراحِلَ الدَّوْلَةِ الِاتِّحادِيَّةِ الثَّلاثَ.',1),('أَسْتَنْتِجُ مُؤَشِّراتِ دُخولِ مَرْحَلَةِ النُّضْجِ وَالتَّمْكينِ.',2),('أَصِفُ مَحاوِرَ التَّمْكينِ الِاتِّحادِيِّ الْأَرْبَعَةَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: مُسْتَقْبَلُ الْفيدْرالِيَّةِ الْإِماراتِيَّةِ', 'فَمِنْ مَرْحَلَةِ الْبِناءِ الَّتي كانَتْ سِمَةَ السَّبْعينيّاتِ وَالثَّمانينيّاتِ مِنَ الْقَرْنِ الْماضي، إِلى مَرْحَلَةِ الرُّسوخِ الَّتي شَهِدَتْهَا الدَّوْلَةُ الِاتِّحادِيَّةُ في التِّسْعينيّاتِ وَبِداياتِ هٰذَا الْقَرْنِ، فَإِنَّ التَّطَلُّعاتِ تَذْهَبُ إِلى مَرْحَلَةِ النُّضْجِ الِاتِّحادِيِّ الَّتي نَأْمَلُ أَنْ تَكونَ عُنْوانًا لِلسَّنَواتِ الْمُقْبِلَةِ مِنْ عُمْرِ الدَّوْلَةِ الِاتِّحادِيَّةِ في الْإِماراتِ. (الْفيدْرالِيَّةُ في الْإِماراتِ، ص 153)', 'الْفيدْرالِيَّةُ في الْإِماراتِ ص 151–169', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T1-L22/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مَرْحَلَةُ الرُّسوخِ الِاتِّحادِيِّ شَهِدَتْهَا الدَّوْلَةُ في:','[{"id": "a", "text": "التِّسْعينيّاتِ وَبِداياتِ هٰذَا الْقَرْنِ"}, {"id": "b", "text": "السَّبْعينيّاتِ وَالثَّمانينيّاتِ"}, {"id": "c", "text": "السَّنَواتِ الْمُقْبِلَةِ"}]'),('عَدَدُ مَحاوِرِ التَّمْكينِ الِاتِّحادِيِّ:','[{"id": "a", "text": "أَرْبَعَةٌ"}, {"id": "b", "text": "ثَلاثَةٌ"}, {"id": "c", "text": "سَبْعَةٌ"}]'),('مِنْ مُؤَشِّراتِ دُخولِ مَرْحَلَةِ النُّضْجِ:','[{"id": "a", "text": "إِدْخالُ الِانْتِخاباتِ في اخْتِيارِ نِصْفِ أَعْضاءِ الْمَجْلِسِ الْوَطَنِيِّ"}, {"id": "b", "text": "إِلْغاءُ الدُّسْتورِ"}, {"id": "c", "text": "تَقْليصُ الْميزانِيَّةِ الِاتِّحادِيَّةِ"}]'),('تَطْويرُ الْمَجْلِسِ الْوَطَنِيِّ يَعْني تَحْويلَهُ مِنْ طَبيعَتِهِ الِاسْتِشارِيَّةِ إِلى:','[{"id": "a", "text": "مَجْلِسٍ تَشْريعِيٍّ يُساهِمُ في صُنْعِ الْقَرارِ"}, {"id": "b", "text": "مَجْلِسٍ قَضائِيٍّ"}, {"id": "c", "text": "هَيْئَةٍ تَنْفيذِيَّةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;