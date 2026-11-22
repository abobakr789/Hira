begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 1, 'الْوَحْدَةُ الْأولى: الْأَمْنُ الْمائِيُّ في عالَمٍ مُتَغَيِّرٍ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L1', 'الرُّؤْيَةُ الْأولى: الْأَمْنُ الْمائِيُّ وَالْأَمْنُ الْغِذائِيُّ في الْخَليجِ الْعَرَبِيِّ', 3, 'كِتابُ النَّشاطِ ص 28–31', true, '🎯 أَسْتَنْتِجُ الْآثارَ الْمُتَرَتِّبَةَ عَلَى اخْتِلافِ مُعَدَّلاتِ هُطولِ الْأَمْطارِ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ.',1),('يَسْتَنْتِجُ الْآثارَ الْمُتَرَتِّبَةَ عَلَى اخْتِلافِ مُعَدَّلاتِ هُطولِ الْأَمْطارِ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ.',2),('يُبْرِزُ احْتِياجاتِ الْمَناطِقِ الْحَضَرِيَّةِ مِنَ الْماءِ وَالْغِذاءِ، وَيُعَدِّدُ أَنْواعَ مَصادِرِ الْغُموضِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْأَمْنُ الْمائِيُّ وَالْأَمْنُ الْغِذائِيُّ في الْخَليجِ الْعَرَبِيِّ', 'لَقَدْ أَصْبَحَتِ الْعَلاقَةُ بَيْنَ الْماءِ وَالْغِذاءِ مَصْدَرَ قَلَقٍ عالَمِيٍّ كَبيرٍ مَعَ تَزايُدِ عَدَدِ سُكّانِ الْعالَمِ وَنُمُوِّ ثَرَواتِهِ، وَهٰذا أَمْرٌ يُثيرُ الْقَلَقَ عَلى نَحْوٍ خاصٍّ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 28)', 'كِتابُ النَّشاطِ ص 28–31', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْأَمْنُ الْمائِيُّ هُوَ الْمُحافَظَةُ عَلَى الْمَوارِدِ الْمائِيَّةِ وَ:','[{"id": "a", "text": "تَرْشيدُ اسْتِخْدامِها"}, {"id": "b", "text": "زِيادَةُ اسْتِهْلاكِها"}, {"id": "c", "text": "تَصْديرُها لِلْخارِجِ"}]'),('يُقْصَدُ بِالْغُموضِ:','[{"id": "a", "text": "نَقْصُ الْمَعْرِفَةِ وَصُعوبَةُ الْفَهْمِ"}, {"id": "b", "text": "وُفْرَةُ الْبَياناتِ"}, {"id": "c", "text": "كَثْرَةُ الْأَمْطارِ"}]'),('مِنْ أَنْواعِ مَصادِرِ الْغُموضِ الْوارِدَةِ في الرُّؤْيَةِ:','[{"id": "a", "text": "الْغُموضُ الْمَعْرِفِيُّ"}, {"id": "b", "text": "الْغُموضُ الزِّراعِيُّ"}, {"id": "c", "text": "الْغُموضُ الصِّناعِيُّ"}]'),('يُثيرُ الْأَمْنُ الْمائِيُّ وَالْغِذائِيُّ الْقَلَقَ في الْخَليجِ خاصَّةً لِـ:','[{"id": "a", "text": "تَسارُعِ النُّمُوِّ السُّكّانِيِّ بِشِدَّةٍ"}, {"id": "b", "text": "قِلَّةِ عَدَدِ السُّكّانِ"}, {"id": "c", "text": "كَثْرَةِ الْأَنْهارِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L2', 'الرُّؤْيَةُ الثّانِيَةُ: حالَةُ الْغُموضِ الْهيدْرولوجِيِّ وَالتَّغَيُّراتُ الْمُناخِيَّةُ', 3, 'كِتابُ النَّشاطِ ص 32–35', true, '🎯 أُصَنِّفُ دُوَلَ الْخَليجِ الْعَرَبِيَّةَ عَلى أَساسِ الْوَضْعِ الْمائِيِّ فيها.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ.',1),('يُصَنِّفُ دُوَلَ الْخَليجِ الْعَرَبِيَّةَ عَلى أَساسِ الْوَضْعِ الْمائِيِّ فيها.',2),('يوَضِّحُ خُطُواتِ تَعْزيزِ الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: حالَةُ الْغُموضِ الْهيدْرولوجِيِّ وَالتَّغَيُّراتُ الْمُناخِيَّةُ', 'الْجَفافُ: يُعْرَفُ بِالْقَحْطِ وَهُوَ جَفافُ الْمِنْطَقَةِ وَخُلُوُّها مِنَ الْمَوارِدِ الْمائِيَّةِ وَقِلَّتُها، وَهٰذَا الْجَفافُ لَهُ أَسْبابٌ عَديدَةٌ مِنْها قِلَّةُ مِياهِ الْأَمْطارِ الْمُتَساقِطَةِ. (كِتابُ النَّشاطِ، مَفاهيمُ وَمُصْطَلَحاتٌ، ص 33)', 'كِتابُ النَّشاطِ ص 32–35', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يُعْرَفُ الْجَفافُ أَيْضًا بِـ:','[{"id": "a", "text": "الْقَحْطِ"}, {"id": "b", "text": "الْغُموضِ"}, {"id": "c", "text": "التَّحْلِيَةِ"}]'),('مِنْ أَمْثِلَةِ مَناطِقِ الْمِياهِ الْعابِرَةِ لِلْحُدودِ:','[{"id": "a", "text": "مِصْرُ وَالْعِراقُ وَسورْيا"}, {"id": "b", "text": "الْإِماراتُ وَعُمانُ"}, {"id": "c", "text": "أَفْريقْيا وَآسْيا"}]'),('ارْتَفَعَتْ كَمِّيَّةُ الْمِياهِ الْمُعالَجَةِ في الدَّوْلَةِ بَيْنَ 2012م وَ2017م بِنِسْبَةِ:','[{"id": "a", "text": "32%"}, {"id": "b", "text": "67%"}, {"id": "c", "text": "40%"}]'),('تُوَفِّرُ مَحَطّاتُ التَّحْلِيَةِ احْتِياجاتِ السُّكّانِ بِنِسَبٍ تَصِلُ إِلى:','[{"id": "a", "text": "40% مِنِ اسْتِهْلاكِهِمِ الْيَوْمِيِّ"}, {"id": "b", "text": "67%"}, {"id": "c", "text": "100%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T3-L3', 'الرُّؤْيَةُ الثّالِثَةُ: التَّحَدِّياتُ الَّتي تُواجِهُ إِدارَةَ مَوارِدِ الْمِياهِ', 3, 'كِتابُ النَّشاطِ ص 36–39', true, '🎯 أَسْتَنْتِجُ التَّحَدِّياتِ الَّتي تُواجِهُ إِدارَةَ مَوارِدِ الْمِياهِ في دُوَلِ الْخَليجِ الْعَرَبِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُسَجِّلُ أَضْرارَ وَمَخاطِرَ الْمِياهِ الْمُلَوَّثَةِ عَلى صِحَّةِ الْإِنْسانِ وَالْبيئَةِ.',1),('يُحَلِّلُ بَياناتِ جَدْوَلِ السِّياسَةِ الْمائِيَّةِ الْوَطَنِيَّةِ في الدُّوَلِ النّامِيَةِ.',2),('يَبْحَثُ السِّياسَةَ الَّتي تَتَّبِعُها دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في الْمُحافَظَةِ عَلى مَوارِدِها الْمائِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: التَّحَدِّياتُ الَّتي تُواجِهُ إِدارَةَ مَوارِدِ الْمِياهِ', 'يُعَدُّ الْماءُ شِرْيانَ الْحَياةِ عَلى كَوْكَبِنا، وَالْمِياهُ لَيْسَتْ ضَرورِيَّةً فَقَطْ لِلْحِفاظِ عَلى حَياةِ الْإِنْسانِ، وَلٰكِنَّها مُهِمَّةٌ لِلصِّحَّةِ الْعامَّةِ، وَإِنْتاجِ الْغِذاءِ وَالطّاقَةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 36)', 'كِتابُ النَّشاطِ ص 36–39', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('السِّياسَةُ الْمائِيَّةُ تُتَّبَعُ غالِبًا في الدُّوَلِ الَّتي:','[{"id": "a", "text": "تُعاني مِنْ شُحٍّ في مَوارِدِهَا الْمائِيَّةِ"}, {"id": "b", "text": "تَفيضُ بِالْأَنْهارِ"}, {"id": "c", "text": "لا تَحْتاجُ إِلَى الْماءِ"}]'),('حَوْكَمَةُ الْمِياهِ تُشيرُ إِلى:','[{"id": "a", "text": "النُّظُمِ السِّياسِيَّةِ وَالِاجْتِماعِيَّةِ وَالِاقْتِصادِيَّةِ وَالْإِدارِيَّةِ"}, {"id": "b", "text": "شَبَكَةِ الْأَنابيبِ وَحْدَها"}, {"id": "c", "text": "سِعْرِ الْماءِ فَقَطْ"}]'),('يَتَكَوَّنُ الْمَطَرُ الْحَمْضِيُّ بِفِعْلِ:','[{"id": "a", "text": "الْكِبْريتِ وَمَداخِنِ الْمَصانِعِ"}, {"id": "b", "text": "مِياهِ الْبَحْرِ"}, {"id": "c", "text": "الرِّياحِ الْمَوْسِمِيَّةِ"}]'),('عَدَدُ الثَّغَراتِ الَّتي يُطْلَبُ إِعْدادُها في جَدْوَلِ التَّحَدِّياتِ:','[{"id": "a", "text": "أَرْبَعُ ثَغَراتٍ"}, {"id": "b", "text": "ثَغْرَتانِ"}, {"id": "c", "text": "سِتُّ ثَغَراتٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T3-L4', 'الرُّؤْيَةُ الرّابِعَةُ: إِدارَةُ الْمِياهِ في الْمَناطِقِ الْحَضَرِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 40–43', true, '🎯 أَسْتَخْرِجُ عَناصِرَ النَّموذَجِ النّاجِحِ لِإِدارَةِ الْمَرافِقِ الْمائِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ.',1),('يَسْتَكْمِلُ الْمُخَطَّطَ الذِّهْنِيَّ لِمَجالاتِ التَّحَدِّياتِ الْمائِيَّةِ لِمُؤَشِّرِ كِفايَةِ الْمِياهِ، وَيُعَدِّدُ الْإِجْراءاتِ الَّتي تَتَّخِذُها مَمْلَكَةُ تايْلَنْدَ لِلْحَدِّ مِنْ فَقْدِ الْمِياهِ.',2),('يَسْتَخْرِجُ عَناصِرَ النَّموذَجِ النّاجِحِ لِإِدارَةِ الْمَرافِقِ الْمائِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: إِدارَةُ الْمِياهِ في الْمَناطِقِ الْحَضَرِيَّةِ', 'فَقْدُ الْمِياهِ: هُوَ اسْتِنْزافُ الْمِياهِ مِنْ قِبَلِ الْبَشَرِ عِنْدَ اسْتِهْلاكِها، وَلِلْحَدِّ مِنْهُ يَجِبُ إِجْراءُ مُقارَنَةٍ بَيْنَ كَمِّيّاتِ الْمِياهِ الْمُنْتَجَةِ وَكَمِّيّاتِ الْمِياهِ الْمُسْتَهْلَكَةِ. (كِتابُ النَّشاطِ، مَفاهيمُ وَمُصْطَلَحاتٌ، ص 41)', 'كِتابُ النَّشاطِ ص 40–43', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('فَقْدُ الْمِياهِ هُوَ:','[{"id": "a", "text": "اسْتِنْزافُ الْمِياهِ عِنْدَ اسْتِهْلاكِها"}, {"id": "b", "text": "تَحْلِيَةُ مِياهِ الْبَحْرِ"}, {"id": "c", "text": "جَمْعُ مِياهِ الْأَمْطارِ"}]'),('عَدَدُ مَجالاتِ التَّحَدِّياتِ الْمائِيَّةِ لِمُؤَشِّرِ كِفايَةِ الْمِياهِ:','[{"id": "a", "text": "خَمْسَةُ مَجالاتٍ"}, {"id": "b", "text": "ثَلاثَةُ مَجالاتٍ"}, {"id": "c", "text": "سَبْعَةُ مَجالاتٍ"}]'),('الدَّوْلَةُ الَّتي تُدْرَسُ إِجْراءاتُها لِلْحَدِّ مِنْ فَقْدِ الْمِياهِ:','[{"id": "a", "text": "مَمْلَكَةُ تايْلَنْدَ"}, {"id": "b", "text": "سِنْغافورَةُ"}, {"id": "c", "text": "الْيابانُ"}]'),('عَدَدُ مَشاريعِ «دارِ الْبِرِّ» لِتَوْفيرِ الْمِياهِ مُنْذُ عامِ 2004م:','[{"id": "a", "text": "62,294 مَشْروعًا"}, {"id": "b", "text": "133 مَشْروعًا"}, {"id": "c", "text": "828 مَشْروعًا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 2, 'الْوَحْدَةُ الثّانِيَةُ: حالَةُ الْأَمْنِ الْمائِيِّ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L5', 'الرُّؤْيَةُ الْأولى: نُدْرَةُ الْمِياهِ في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 48–53', true, '🎯 أُحَلِّلُ الْبَياناتِ الْإِحْصائِيَّةَ لِمُشْكِلَةِ نُدْرَةِ الْمِياهِ في دُوَلِ مَجْلِسِ التَّعاوُنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُناقِشُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُحَلِّلُ الْبَياناتِ الْإِحْصائِيَّةَ لِمُشْكِلَةِ نُدْرَةِ الْمِياهِ في دُوَلِ مَجْلِسِ التَّعاوُنِ لِدُوَلِ الْخَليجِ الْعَرَبِيَّةِ.',1),('يُفَسِّرُ أَسْبابَ مُشْكِلَةِ الْمِياهِ مُقْتَرِحًا حُلولًا لَها.',2),('يُبْرِزُ دَوْرَ الْباني الْمُؤَسِّسِ الشَّيْخِ زايِدِ بْنِ سُلْطانٍ آلِ نَهْيانَ -رَحِمَهُ اللهُ- في تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: نُدْرَةُ الْمِياهِ في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ', 'إِنَّ الْماءَ الْعَذْبَ ثَرْوَةٌ نادِرَةٌ في الْعالَمِ الْعَرَبِيِّ، وَهٰذِهِ النُّدْرَةُ أَكْثَرُ سوءًا في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 48)', 'كِتابُ النَّشاطِ ص 48–53', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَصيبُ الْفَرْدِ الْعَرَبِيِّ مِنَ الْمِياهِ الْمُتَجَدِّدَةِ عامَ 2018م:','[{"id": "a", "text": "575 م³"}, {"id": "b", "text": "1,312 م³"}, {"id": "c", "text": "3,430 م³"}]'),('تَقَعُ عَتَبَةُ النُّدْرَةِ الْمُطْلَقَةِ في الشَّكْلِ الْبَيانِيِّ عِنْدَ:','[{"id": "a", "text": "500 م³"}, {"id": "b", "text": "1,000 م³"}, {"id": "c", "text": "1,700 م³"}]'),('أَعْلى دُوَلِ الْمَجْلِسِ نَصيبًا لِلْفَرْدِ مِنَ الْمِياهِ الْمُتَجَدِّدَةِ:','[{"id": "a", "text": "عُمانُ"}, {"id": "b", "text": "الْكُوَيْتُ"}, {"id": "c", "text": "الْبَحْرَيْنُ"}]'),('الْحَرَسُ وِعاءٌ تَقْليدِيٌّ مَصْنوعٌ مِنَ:','[{"id": "a", "text": "الْفَخّارِ"}, {"id": "b", "text": "النُّحاسِ"}, {"id": "c", "text": "سَعَفِ النَّخيلِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L6', 'الرُّؤْيَةُ الثّانِيَةُ: الْأَبْعادُ الْجيوسِياسِيَّةُ لِنُدْرَةِ الْمِياهِ', 3, 'كِتابُ النَّشاطِ ص 54–59', true, '🎯 أُفَسِّرُ تَوَجُّهَ دُوَلِ الْخَليجِ الْعَرَبِيَّةِ نَحْوَ تَحْلِيَةِ مِياهِ الْبَحْرِ بَدَلًا مِنِ اسْتيرادِ الْمِياهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُناقِشُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُعَدِّدُ أَنْواعَ التَّهْديداتِ الَّتي تُواجِهُ مَحَطّاتِ تَحْلِيَةِ الْمِياهِ.',1),('يُفَسِّرُ تَوَجُّهَ دُوَلِ الْخَليجِ الْعَرَبِيَّةِ نَحْوَ تَحْلِيَةِ مِياهِ الْبَحْرِ بَدَلًا مِنِ اسْتيرادِ الْمِياهِ.',2),('يُناقِشُ الرُّؤْيَةَ الْمُسْتَقْبَلِيَّةَ الَّتي تَنْظُرُ لَها حُكومَةُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ لِمُسْتَقْبَلِ الْمِياهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْأَبْعادُ الْجيوسِياسِيَّةُ لِنُدْرَةِ الْمِياهِ', 'إِنَّ مَحَطّاتِ تَحْلِيَةِ مِياهِ الْبَحْرِ مَصْدَرٌ مائِيٌّ مُهِمٌّ في الْمَناطِقِ الْجافَّةِ مِنَ الْعالَمِ، مِثْلِ مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ؛ حَيْثُ إِنَّ الْكَمِّيّاتِ الْمُتَوافِرَةَ بِشَكْلٍ طَبيعِيٍّ مِنَ الْمِياهِ الْعَذْبَةِ غَيْرُ كافِيَةٍ لِتَغْطِيَةِ الطَّلَبِ. (كِتابُ النَّشاطِ، ص 56)', 'كِتابُ النَّشاطِ ص 54–59', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْجيوسِياسِيَّةُ عِلْمُ دِراسَةِ تَأْثيرِ:','[{"id": "a", "text": "الْأَرْضِ عَلَى السِّياسَةِ"}, {"id": "b", "text": "السِّياسَةِ عَلَى الِاقْتِصادِ"}, {"id": "c", "text": "الْمُناخِ عَلَى الزِّراعَةِ"}]'),('أَنْواعُ الْخَطَرِ الَّتي تُهَدِّدُ مَحَطّاتِ التَّحْلِيَةِ:','[{"id": "a", "text": "تِقْنِيٌّ وَسِياسِيٌّ وَطَبيعِيٌّ"}, {"id": "b", "text": "طَبيعِيٌّ فَقَطْ"}, {"id": "c", "text": "اقْتِصادِيٌّ فَقَطْ"}]'),('تَحُدُّ مَدينَةُ «مَصْدَرَ» مِنِ اسْتِهْلاكِ الْمِياهِ في مَبانيها بِنِسْبَةِ:','[{"id": "a", "text": "45%"}, {"id": "b", "text": "12%"}, {"id": "c", "text": "85.5%"}]'),('تِقْنِيَةُ مَحَطَّةِ التَّحْلِيَةِ بِالطّاقَةِ الشَّمْسِيَّةِ في دُبَيَّ:','[{"id": "a", "text": "التَّناضُحُ الْعَكْسِيُّ"}, {"id": "b", "text": "التَّقْطيرُ بِالْفَحْمِ"}, {"id": "c", "text": "الِاسْتِمْطارُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T3-L7', 'الرُّؤْيَةُ الثّالِثَةُ: الْمَوارِدُ الْمائِيَّةُ وَاسْتِخْداماتُ الْمِياهِ في دُوَلِ مَجْلِسِ التَّعاوُنِ', 3, 'كِتابُ النَّشاطِ ص 60–65', true, '🎯 أَشْرَحُ الْعَلاقَةَ بَيْنَ النُّمُوِّ الِاقْتِصادِيِّ وَاسْتِهْلاكِ الْمِياهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُناقِشُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ.',1),('يُبْرِزُ جُهودَ دَوْلَتِهِ في إيجادِ حُلولٍ عَمَلِيَّةٍ مُناسِبَةٍ لِلْقَضايا الْبيئِيَّةِ وَتَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ.',2),('يَشْرَحُ الْعَلاقَةَ بَيْنَ النُّمُوِّ الِاقْتِصادِيِّ وَاسْتِهْلاكِ الْمِياهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْمَوارِدُ الْمائِيَّةُ وَاسْتِخْداماتُ الْمِياهِ في دُوَلِ مَجْلِسِ التَّعاوُنِ', 'تَقَعُ دُوَلُ مَجْلِسِ التَّعاوُنِ لِدُوَلِ الْخَليجِ الْعَرَبِيَّةِ في مِنْطَقَةٍ تُعْتَبَرُ مِنْ أَكْثَرِ مَناطِقِ الْعالَمِ جَفافًا؛ فَهِيَ بِالْأَساسِ صَحْراءُ ذاتُ بيئَةٍ قاسِيَةٍ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 60)', 'كِتابُ النَّشاطِ ص 60–65', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ الْمِياهِ الْجَوْفِيَّةِ مِنْ مَصادِرِ الْمِياهِ في دُوَلِ الْمَجْلِسِ:','[{"id": "a", "text": "89%"}, {"id": "b", "text": "43%"}, {"id": "c", "text": "9%"}]'),('نِسْبَةُ مِياهِ التَّحْلِيَةِ في دَوْلَةِ الْإِماراتِ:','[{"id": "a", "text": "42%"}, {"id": "b", "text": "9%"}, {"id": "c", "text": "1%"}]'),('أَكْثَرُ الْقِطاعاتِ اسْتِهْلاكًا لِلْمِياهِ في دُوَلِ الْمَجْلِسِ:','[{"id": "a", "text": "الزِّراعِيُّ"}, {"id": "b", "text": "الصِّناعِيُّ"}, {"id": "c", "text": "الْبَلَدِيُّ"}]'),('تَكْلِفَةُ مَحَطَّةِ جَبَلِ عَلِيٍّ لِمُعالَجَةِ الصَّرْفِ الصِّحِّيِّ:','[{"id": "a", "text": "مِلْيارٌ وَ300 مِلْيونِ دِرْهَمٍ"}, {"id": "b", "text": "130 مِلْيونَ دِرْهَمٍ"}, {"id": "c", "text": "45 مِلْيونَ دِرْهَمٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T3-L8', 'الرُّؤْيَةُ الرّابِعَةُ: أَهَمُّ التَّحَدِّياتِ وَالْقَضايا الْمائِيَّةِ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ', 3, 'كِتابُ النَّشاطِ ص 66–71', true, '🎯 أُوَضِّحُ التَّحَدِّياتِ الْمائِيَّةَ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ، وَأَقْتَرِحُ حُلولًا لَها.' from u
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
       select l.id, v.s, v.n from l, (values ('يُناقِشُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُوَضِّحُ التَّحَدِّياتِ الْمائِيَّةَ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ.',1),('يَقْتَرِحُ الْحُلولَ لِلْقَضايا الْمائِيَّةِ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ.',2),('يُقَدِّرُ جُهودَ الدَّوْلَةِ في الْمُحافَظَةِ عَلَى الْمَوارِدِ الْمائِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: أَهَمُّ التَّحَدِّياتِ وَالْقَضايا الْمائِيَّةِ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ', 'تُواجِهُ دُوَلُ مَجْلِسِ التَّعاوُنِ لِدُوَلِ الْخَليجِ الْعَرَبِيَّةِ تَحَدِّيًا بالِغَ الصُّعوبَةِ بِشَأْنِ تَزْويدِ الْمِياهِ بِشَكْلٍ مُسْتَدامٍ لِلْأَنْشِطَةِ التَّنْمَوِيَّةِ الْمُخْتَلِفَةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 66)', 'كِتابُ النَّشاطِ ص 66–71', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ التَّحَدِّياتِ الْمائِيَّةِ في مُخَطَّطِ الرُّؤْيَةِ:','[{"id": "a", "text": "سَبْعَةٌ"}, {"id": "b", "text": "ثَلاثَةٌ"}, {"id": "c", "text": "خَمْسَةٌ"}]'),('يُسْهِمُ الْقِطاعُ الزِّراعِيُّ في النّاتِجِ الْمَحَلِّيِّ الْإِجْمالِيِّ بِـ:','[{"id": "a", "text": "أَقَلَّ مِنْ 1%"}, {"id": "b", "text": "50%"}, {"id": "c", "text": "85.5%"}]'),('الزِّراعَةُ الْمائِيَّةُ أُسْلوبٌ لِاسْتِزْراعِ النَّباتاتِ:','[{"id": "a", "text": "بِدونِ تُرْبَةٍ"}, {"id": "b", "text": "في الصَّحْراءِ الْمَكْشوفَةِ"}, {"id": "c", "text": "بِمِياهِ الْبَحْرِ الْمالِحَةِ"}]'),('صَدَرَ قانونٌ لِحِمايَةِ الْمِياهِ الْجَوْفِيَّةِ في إِمارَةِ دُبَيَّ عامَ:','[{"id": "a", "text": "2008م"}, {"id": "b", "text": "2006م"}, {"id": "c", "text": "2014م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 3, 'الْوَحْدَةُ الثّالِثَةُ: إِدارَةُ الْمَوارِدِ الْمائِيَّةِ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L10', 'الرُّؤْيَةُ الثّانِيَةُ: سِياساتُ الْأَمْنِ الْمائِيِّ الْوَطَنِيَّةُ وَالْإِقْليمِيَّةُ', 3, 'كِتابُ النَّشاطِ ص 80–83', true, '🎯 أُسَجِّلُ الْجُهودَ الَّتي تَبْذُلُها الْإِماراتُ في مَجالِ مُعالَجَةِ مِياهِ الصَّرْفِ الصِّحِّيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيَذْكُرُ التِّقْنِياتِ الْمُسْتَعْمَلَةَ ضِمْنَ سِياسَةِ زِيادَةِ الْكَمِّيّاتِ الْمَعْروضَةِ مِنَ الْمِياهِ لِمُواجَهَةِ حالاتِ الْعَجْزِ الْمائِيِّ.',1),('يُبْرِزُ مَخاطِرَ تَصْريفِ مِياهِ الصَّرْفِ الصِّحِّيِّ في الْبِحارِ وَالْخُلْجانِ.',2),('يُسَجِّلُ الْجُهودَ الَّتي تَبْذُلُها دَوْلَةُ الْإِماراتِ في مَجالِ مُعالَجَةِ مِياهِ الصَّرْفِ الصِّحِّيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: سِياساتُ الْأَمْنِ الْمائِيِّ الْوَطَنِيَّةُ وَالْإِقْليمِيَّةُ', 'يُمْكِنُ الْقَوْلُ بِأَنَّ دُوَلَ الْخَليجِ الْعَرَبِيَّةَ لا تُعاني مِنْ أَيَّةِ مُشْكِلاتٍ عَلى صَعيدِ الْمُؤَشِّرِ الِاقْتِصادِيِّ لِلْأَمْنِ الْمائِيِّ، حَيْثُ تَمْتَلِكُ تِلْكَ الدُّوَلُ الْإِمْكاناتِ الْمالِيَّةَ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 80)', 'كِتابُ النَّشاطِ ص 80–83', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('طولُ النَّفَقِ الْعَميقِ في مَشْروعِ STEP:','[{"id": "a", "text": "41 كيلومِتْرًا"}, {"id": "b", "text": "43 كيلومِتْرًا"}, {"id": "c", "text": "800 كيلومِتْرٍ"}]'),('الْقُدْرَةُ النِّهائِيَّةُ لِلنَّفَقِ الِاسْتِراتيجِيِّ بِحُلولِ 2030م يَوْمِيًّا:','[{"id": "a", "text": "1.7 مِلْيونِ م³"}, {"id": "b", "text": "800 أَلْفِ م³"}, {"id": "c", "text": "675 أَلْفِ م³"}]'),('دُوَلُ الْخَليجِ عَلى صَعيدِ الْمُؤَشِّرِ الِاقْتِصادِيِّ لِلْأَمْنِ الْمائِيِّ:','[{"id": "a", "text": "لا تُعاني مِنْ أَيَّةِ مُشْكِلاتٍ"}, {"id": "b", "text": "تُعاني عَجْزًا مالِيًّا"}, {"id": "c", "text": "تَعْتَمِدُ عَلَى الْمُساعَداتِ"}]'),('الطّاقَةُ الِاسْتيعابِيَّةُ لِمَحَطَّةِ جَبَلِ عَلِيٍّ بَعْدَ الْمَرْحَلَةِ الثّانِيَةِ يَوْمِيًّا:','[{"id": "a", "text": "675 أَلْفَ م³"}, {"id": "b", "text": "300 أَلْفِ م³"}, {"id": "c", "text": "1.7 مِلْيونِ م³"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T3-L11', 'الرُّؤْيَةُ الثّالِثَةُ: مُسْتَقْبَلُ إِمْداداتِ الْمِياهِ وَالطَّلَبِ عَلَيْها في دُوَلِ مَجْلِسِ التَّعاوُنِ', 3, 'كِتابُ النَّشاطِ ص 84–87', true, '🎯 أَسْتَنْتِجُ التَّهْديداتِ الَّتي يَتَعَرَّضُ لَها مَوْرِدُ الْمِياهِ بِمُخْتَلِفِ مَصادِرِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيَسْتَخْرِجُ الْحَقائِقَ مِنْ جَدْوَلِ تَوافُرِ الْمِياهِ في الْمَناطِقِ الْأَشَدِّ نُدْرَةً لِلْمِياهِ.',1),('يُعَدِّدُ حاجاتِ الزِّيادَةِ في الطَّلَبِ عَلَى الْمِياهِ النّاجِمَةِ عَنِ النُّمُوِّ السُّكّانِيِّ.',2),('يَسْتَنْتِجُ التَّهْديداتِ الَّتي يَتَعَرَّضُ لَها مَوْرِدُ الْمِياهِ بِمُخْتَلِفِ مَصادِرِهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: مُسْتَقْبَلُ إِمْداداتِ الْمِياهِ وَالطَّلَبِ عَلَيْها في دُوَلِ مَجْلِسِ التَّعاوُنِ', 'يُعَدُّ الْماءُ عُنْصُرًا حَيَوِيًّا لِلْحَياةِ، وَتَعْتَبِرُ جَميعُ الدُّوَلِ الْحُصولَ عَلَيْهِ أَحَدَ حُقوقِ الْإِنْسانِ الْأَساسِيَّةِ؛ فَإِذا كانَ الْماءُ مَحْدودًا كانَتِ التَّنْمِيَةُ مُقَيَّدَةً. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 84)', 'كِتابُ النَّشاطِ ص 84–87', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ الْماءِ الْعَذْبِ مِنْ مِياهِ الْأَرْضِ:','[{"id": "a", "text": "3%"}, {"id": "b", "text": "30%"}, {"id": "c", "text": "97%"}]'),('أَكْبَرُ مُسْتَوْدَعٍ لِلْماءِ الْعَذْبِ عَلَى الْأَرْضِ:','[{"id": "a", "text": "الْكُتَلُ الْجَليدِيَّةُ"}, {"id": "b", "text": "الْأَنْهارُ"}, {"id": "c", "text": "الْبُحَيْراتُ"}]'),('الْهِجْرَةُ مِنَ الرّيفِ إِلَى الْمَدينَةِ مِثالٌ عَلَى:','[{"id": "a", "text": "الْهِجْرَةِ الدّاخِلِيَّةِ"}, {"id": "b", "text": "الْهِجْرَةِ الْخارِجِيَّةِ"}, {"id": "c", "text": "الْمَقيظِ"}]'),('افْتُتِحَ سَدُّ مَأْرِبَ بَعْدَ إِعادَةِ بِنائِهِ عَلى نَفَقَةِ الشَّيْخِ زايِدٍ عامَ:','[{"id": "a", "text": "1986م"}, {"id": "b", "text": "1971م"}, {"id": "c", "text": "2008م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L9', 'الرُّؤْيَةُ الْأولى: الْمُؤَشِّرُ الِاقْتِصادِيُّ لِلْأَمْنِ الْمائِيِّ في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 76–79', true, '🎯 أُقَسِّمُ مَصادِرَ الْمِياهِ الرَّئيسَةَ في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ، وَأُسَجِّلُ مَصادِرَ تَهْديدِها.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُقَسِّمُ مَصادِرَ الْمِياهِ الرَّئيسَةَ في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ.',1),('يُحَلِّلُ جَدْوَلَ الْمِياهِ الْعَذْبَةِ الْمُتَجَدِّدَةِ وَنَصيبِ الْفَرْدِ سَنَوِيًّا في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ، وَيُسَجِّلُ الْمَصادِرَ الْأَساسِيَّةَ لِتَهْديدِ مِياهِ الْخَليجِ الْعَرَبِيِّ.',2),('يُقَدِّمُ مُقْتَرَحاتٍ لِلْحَدِّ مِنْ ظاهِرَةِ الِاحْتِباسِ الْحَرارِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْمُؤَشِّرُ الِاقْتِصادِيُّ لِلْأَمْنِ الْمائِيِّ في دُوَلِ الْخَليجِ الْعَرَبِيَّةِ', 'مِمّا لا شَكَّ فيهِ أَنَّ الزِّيادَةَ السُّكّانِيَّةَ تُؤَدّي إِلى زِيادَةِ الْمَحْدودِيَّةِ في الْمَوارِدِ الْمائِيَّةِ، حَيْثُ يَقودُ النُّمُوُّ السُّكّانِيُّ إِلى تَزايُدِ الطَّلَبِ عَلَى الْمِياهِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 76)', 'كِتابُ النَّشاطِ ص 76–79', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يُعانِي الْبَلَدُ الْفَقْرَ الْمائِيَّ إِذا قَلَّ نَصيبُ الْفَرْدِ السَّنَوِيُّ عَنْ:','[{"id": "a", "text": "1,000 م³"}, {"id": "b", "text": "1,700 م³"}, {"id": "c", "text": "500 م³"}]'),('الزِّيادَةُ السُّكّانِيَّةُ تُؤَدّي إِلى:','[{"id": "a", "text": "زِيادَةِ الْمَحْدودِيَّةِ في الْمَوارِدِ الْمائِيَّةِ"}, {"id": "b", "text": "وَفْرَةِ الْمِياهِ"}, {"id": "c", "text": "انْخِفاضِ الطَّلَبِ"}]'),('تَنْقَسِمُ مَصادِرُ الْمِياهِ في دُوَلِ الْخَليجِ إِلى:','[{"id": "a", "text": "ثَلاثَةِ أَقْسامٍ رَئيسَةٍ"}, {"id": "b", "text": "قِسْمَيْنِ"}, {"id": "c", "text": "خَمْسَةِ أَقْسامٍ"}]'),('الْإِنْتاجُ الْمُتَوَقَّعُ لِمَحَطَّةِ الْحَمْرِيَّةِ في الْبِدايَةِ يَوْمِيًّا:','[{"id": "a", "text": "20 مِلْيونَ غالونٍ"}, {"id": "b", "text": "140 مِلْيونَ غالونٍ"}, {"id": "c", "text": "1,000 غالونٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 4, 'الْوَحْدَةُ الرّابِعَةُ: الْأَمْنُ الْغِذائِيُّ عالَمِيًّا وَإِقْليمِيًّا', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L12', 'الرُّؤْيَةُ الْأولى: الدَّوافِعُ الرَّئيسَةُ لِإِمْداداتِ الْغِذاءِ الْعالَمِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 92–95', true, '🎯 أُناقِشُ مُشْكِلَةَ الْأَمْنِ الْغِذائِيِّ وَأُفَسِّرُ أَسْبابَها، وَأَقْتَرِحُ لَها حُلولًا.' from u
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
       select l.id, v.s, v.n from l, (values ('يُفَسِّرُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيَذْكُرُ الدَّوافِعَ الْأَرْبَعَةَ الَّتي تُضْعِفُ الْإِمْداداتِ الْغِذائِيَّةَ الْعالَمِيَّةَ.',1),('يُناقِشُ مُشْكِلَةَ الْأَمْنِ الْغِذائِيِّ وَيُفَسِّرُ أَسْبابَها، وَيُحَلِّلُ شَكْلَ اسْتِخْداماتِ الْمَحاصيلِ الزِّراعِيَّةِ.',2),('يَقْتَرِحُ الْحُلولَ لِمُشْكِلَةِ الْأَمْنِ الْغِذائِيِّ، وَيُقَدِّرُ جُهودَ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في تَحْقيقِ الْأَمْنِ الْغِذائِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الدَّوافِعُ الرَّئيسَةُ لِإِمْداداتِ الْغِذاءِ الْعالَمِيَّةِ', 'وَيُمْكِنُ لِهٰذِهِ الْعَوامِلِ أَنْ تُضيفَ إِلَى الْمُسْتَقْبَلِ الْمَجْهولِ مَزيدًا مِنْ عَدَمِ التَّيَقُّنِ بِالنِّسْبَةِ لِأَمْنِ الْغِذاءِ الْعالَمِيِّ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 92)', 'كِتابُ النَّشاطِ ص 92–95', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ الْمَحاصيلِ الزِّراعِيَّةِ الَّتي تَذْهَبُ لِعَلَفِ الْحَيَواناتِ:','[{"id": "a", "text": "35%"}, {"id": "b", "text": "62%"}, {"id": "c", "text": "3%"}]'),('الطّاقَةُ الْمُسْتَمَدَّةُ مِنَ الْكائِناتِ الْحَيَّةِ النَّباتِيَّةِ أَوِ الْحَيَوانِيَّةِ هِيَ:','[{"id": "a", "text": "الْوَقودُ الْحَيَوِيُّ"}, {"id": "b", "text": "الْوَقودُ الْأُحْفورِيُّ"}, {"id": "c", "text": "الْوَقودُ النَّوَوِيُّ"}]'),('مِنْ عَناصِرِ التَّغَيُّرِ الْمُناخِيِّ في الرُّؤْيَةِ:','[{"id": "a", "text": "ذَوَبانُ الْجَليدِ"}, {"id": "b", "text": "تَوْحيدُ الْمُشْتَرَياتِ"}, {"id": "c", "text": "الْبَصْمَةُ الْمائِيَّةُ"}]'),('تَقَعُ أَوَّلُ مُنْشَأَةٍ بَحْثِيَّةٍ في الْعالَمِ لِإِنْتاجِ الْوَقودِ الْحَيَوِيِّ وَالْغِذاءِ في الصَّحْراءِ في:','[{"id": "a", "text": "مَدينَةِ مَصْدَرٍ بِأَبوظَبي"}, {"id": "b", "text": "دُبَيٍّ"}, {"id": "c", "text": "الشّارِقَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L13', 'الرُّؤْيَةُ الثّانِيَةُ: الْأَمْنُ الْغِذائِيُّ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ', 3, 'كِتابُ النَّشاطِ ص 96–100', true, '🎯 أُلَخِّصُ أَسْبابَ ضَعْفِ الْأَمْنِ الْغِذائِيِّ في دُوَلِ مَجْلِسِ التَّعاوُنِ، وَأَقْتَرِحُ إِسْتِراتيجِيّاتٍ لِتَحْقيقِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُفَسِّرُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيَذْكُرُ مَصْدَرَيِ الْغِذاءِ: الْإِنْتاجَ الزِّراعِيَّ وَالْوارِداتِ الْغِذائِيَّةَ.',1),('يُلَخِّصُ أَسْبابَ ضَعْفِ الْأَمْنِ الْغِذائِيِّ في دُوَلِ مَجْلِسِ التَّعاوُنِ لِدُوَلِ الْخَليجِ الْعَرَبِيَّةِ، وَيُطَبِّقُ مَهاراتِ التَّفْكيرِ النّاقِدِ وَاتِّخاذِ الْقَراراتِ.',2),('يَقْتَرِحُ إِسْتِراتيجِيّاتٍ لِتَحْقيقِ الْأَمْنِ الْغِذائِيِّ، وَيُثَمِّنُ جُهودَ الْباني الْمُؤَسِّسِ الشَّيْخِ زايِدِ بْنِ سُلْطانٍ آلِ نَهْيانَ -رَحِمَهُ اللهُ- في دَعْمِ الْإِنْتاجِ الزِّراعِيِّ وَتَطْويرِهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْأَمْنُ الْغِذائِيُّ في مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ', 'وَلِتَلْبِيَةِ الِاحْتِياجاتِ الْغِذائِيَّةِ لِدُوَلِ الْخَليجِ يَتَعَيَّنُ عَلَيْهَا الِاعْتِمادُ عَلَى الْأَسْواقِ الدَّوْلِيَّةِ، مِمّا يَجْعَلُها عُرْضَةً لِتَقَلُّباتِ الْإِنْتاجِ الْعالَمِيِّ لِلْأَغْذِيَةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 96)', 'كِتابُ النَّشاطِ ص 96–100', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَجْعَلُ الِاعْتِمادُ عَلَى الْأَسْواقِ الدَّوْلِيَّةِ دُوَلَ الْخَليجِ عُرْضَةً لِـ:','[{"id": "a", "text": "تَقَلُّباتِ الْإِنْتاجِ الْعالَمِيِّ لِلْأَغْذِيَةِ"}, {"id": "b", "text": "زِيادَةِ الْأَمْطارِ"}, {"id": "c", "text": "نَقْصِ السُّكّانِ"}]'),('مِنْ أَسْبابِ ازْدِيادِ الِاعْتِمادِ عَلَى الْوارِداتِ الْغِذائِيَّةِ:','[{"id": "a", "text": "التَّزايُدُ السَّريعُ في عَدَدِ السُّكّانِ"}, {"id": "b", "text": "وَفْرَةُ الْأَنْهارِ"}, {"id": "c", "text": "قِلَّةُ التَّنْمِيَةِ"}]'),('مَصْدَرا الْغِذاءِ في الرُّؤْيَةِ هُما:','[{"id": "a", "text": "الْإِنْتاجُ الزِّراعِيُّ وَالْوارِداتُ الْغِذائِيَّةُ"}, {"id": "b", "text": "الصَّيْدُ وَالرَّعْيُ"}, {"id": "c", "text": "التَّحْلِيَةُ وَالسُّدودُ"}]'),('مِنَ الْكَلِماتِ الْمُسانِدَةِ لِإِسْتِراتيجِيّاتِ تَحْقيقِ الْأَمْنِ الْغِذائِيِّ:','[{"id": "a", "text": "مَخْزونٌ غِذائِيٌّ احْتِياطِيٌّ"}, {"id": "b", "text": "الْوَقودُ الْأُحْفورِيُّ"}, {"id": "c", "text": "ذَوَبانُ الْجَليدِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T3-L14', 'الرُّؤْيَةُ الثّالِثَةُ: نِظامُ الْبَحْثِ وَالتَّطْويرِ الزِّراعِيِّ', 3, 'كِتابُ النَّشاطِ ص 101–105', true, '🎯 أَسْتَنْتِجُ أَهَمِّيَّةَ الِاسْتِثْمارِ في الْعُلومِ وَالْأَبْحاثِ، وَأُبَيِّنُ نَهْجَ الْإِماراتِ في دَعْمِ الْبَحْثِ وَالِابْتِكارِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُفَسِّرُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُعَرِّفُ مُؤَشِّرَ الِابْتِكارِ الْعالَمِيِّ بِمُدْخَلاتِهِ وَمُخْرَجاتِهِ.',1),('يَسْتَنْتِجُ أَهَمِّيَّةَ الِاسْتِثْمارِ في الْعُلومِ وَالتِّكْنولوجْيا وَالْأَبْحاثِ في تَنْمِيَةِ الْمَوارِدِ، وَيُحَلِّلُ الْبَياناتِ الْإِحْصائِيَّةَ الْوارِدَةَ في الرُّؤْيَةِ.',2),('يُبَيِّنُ نَهْجَ حُكومَةِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في دَعْمِ الْبَحْثِ الْعِلْمِيِّ وَالِابْتِكارِ، وَيَذْكُرُ إيجابِيّاتِ التَّعاوُنِ الْإِقْليمِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: نِظامُ الْبَحْثِ وَالتَّطْويرِ الزِّراعِيِّ', 'فَعَلى دُوَلِ مَجْلِسِ التَّعاوُنِ لِدُوَلِ الْخَليجِ الْعَرَبِيَّةِ وَضْعُ وَتَبَنّي خُطَطٍ مُشْتَرَكَةٍ مَعَ الْهَيْئاتِ الدَّوْلِيَّةِ لِتَنْمِيَةِ الْقُوى الْبَشَرِيَّةِ وَالْكَوادِرِ الْوَطَنِيَّةِ الْعامِلَةِ في مَجالِ الْبَحْثِ الزِّراعِيِّ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 101)', 'كِتابُ النَّشاطِ ص 101–105', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ الْإِنْفاقِ الْحُكومِيِّ لِلْإِماراتِ عَلَى الْبَحْثِ وَالتَّطْويرِ في الرُّؤْيَةِ:','[{"id": "a", "text": "0.5%"}, {"id": "b", "text": "3.6%"}, {"id": "c", "text": "1%"}]'),('تُقاسُ مُخْرَجاتُ الِابْتِكارِ بِناءً عَلى:','[{"id": "a", "text": "مُخْرَجاتِ الْمَعْرِفَةِ وَالتِّكْنولوجْيا وَالْإِبْداعِ"}, {"id": "b", "text": "الْمُؤَسَّساتِ وَالْقُوى الْعامِلَةِ"}, {"id": "c", "text": "تَطَوُّرِ الْأَسْواقِ"}]'),('تَسْعَى الْإِماراتُ أَنْ تَكونَ في مُؤَشِّرِ الِابْتِكارِ مِنْ بَيْنِ أَفْضَلِ:','[{"id": "a", "text": "عَشْرِ دُوَلٍ عالَمِيًّا"}, {"id": "b", "text": "مِئَةِ دَوْلَةٍ"}, {"id": "c", "text": "خَمْسينَ دَوْلَةً"}]'),('عُقِدَ الِاجْتِماعُ الـ27 لِلَجْنَةِ التَّعاوُنِ الزِّراعِيِّ بِدُوَلِ الْمَجْلِسِ في:','[{"id": "a", "text": "الرِّياضِ"}, {"id": "b", "text": "أَبوظَبي"}, {"id": "c", "text": "الدَّوْحَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T3-L15', 'الرُّؤْيَةُ الرّابِعَةُ: الْعَلاقَةُ بَيْنَ الْمِياهِ وَالْأَمْنِ الْغِذائِيِّ', 3, 'كِتابُ النَّشاطِ ص 106–111', true, '🎯 أُوَضِّحُ التَّحَدِّياتِ الْمائِيَّةَ وَالْغِذائِيَّةَ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ، وَأَقْتَرِحُ لَها حُلولًا.' from u
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
       select l.id, v.s, v.n from l, (values ('يُفَسِّرُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ: الْبَصْمَةَ الْمائِيَّةَ وَالْمِياهَ الِافْتِراضِيَّةَ.',1),('يُوَضِّحُ التَّحَدِّياتِ الْمائِيَّةَ وَالْغِذائِيَّةَ الَّتي تُواجِهُ دُوَلَ مَجْلِسِ التَّعاوُنِ، وَيُحَلِّلُ جَدْوَلَ الْمِياهِ الِافْتِراضِيَّةِ.',2),('يَقْتَرِحُ الْحُلولَ لِلْقَضايَا الْمائِيَّةِ، وَيُقَدِّرُ جُهودَ الدَّوْلَةِ في الْمُحافَظَةِ عَلَى الْمَوارِدِ الْمائِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الْعَلاقَةُ بَيْنَ الْمِياهِ وَالْأَمْنِ الْغِذائِيِّ', 'وَالْحُصولُ عَلى مِياهٍ كافِيَةٍ وَمَضْمونَةٍ يَرْفَعُ الْغَلّاتِ الزِّراعِيَّةَ وَيَزيدُ مِنَ الْأَغْذِيَةِ، وَلَيْسَ مِنَ الْمُسْتَغْرَبِ أَنْ تَكونَ الْبُلْدانُ الَّتي تَحْصُلُ عَلَى الْماءِ بِسُهولَةٍ هِيَ أَيْضًا أَقَلَّ الْبُلْدانِ في نَقْصِ الْأَغْذِيَةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 106)', 'كِتابُ النَّشاطِ ص 106–111', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L15/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ ما تَحْصُلُ عَلَيْهِ الزِّراعَةُ مِنَ الْمِياهِ الْمَسْحوبَةِ في الْعالَمِ:','[{"id": "a", "text": "69%"}, {"id": "b", "text": "20%"}, {"id": "c", "text": "3%"}]'),('كَمِّيَّةُ الْمِياهِ الْكُلِّيَّةُ الَّتِي اسْتُخْدِمَتْ في إِنْتاجِ مادَّةٍ غِذائِيَّةٍ هِيَ:','[{"id": "a", "text": "الْمِياهُ الِافْتِراضِيَّةُ"}, {"id": "b", "text": "الْبَصْمَةُ الْمائِيَّةُ"}, {"id": "c", "text": "الْمِياهُ الْجَوْفِيَّةُ"}]'),('تَسْعَى الْإِماراتُ إِلى تَخْفيضِ بَصْمَتِها الْمائِيَّةِ بِحُلولِ 2020م بِنِسْبَةِ:','[{"id": "a", "text": "20%"}, {"id": "b", "text": "50%"}, {"id": "c", "text": "69%"}]'),('أَدْخَلَ مَفْهومَ «الْمِياهِ الِافْتِراضِيَّةِ» عالِمُ الْجُغْرافْيا الْبَريطانِيُّ:','[{"id": "a", "text": "طوني أَلَن"}, {"id": "b", "text": "آدَم سْميث"}, {"id": "c", "text": "تْشارْلِز دارْوِن"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 5, 'الْوَحْدَةُ الْخامِسَةُ: الْأَمْنُ الْمائِيُّ وَالْغِذائِيُّ وَالتَّنْمِيَةُ الْمُسْتَدامَةُ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=5 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L16', 'الرُّؤْيَةُ الْأولى: الْأَمْنُ الْمائِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ: الْفُرَصُ وَالتَّحَدِّياتُ', 3, 'كِتابُ النَّشاطِ ص 116–118', true, '🎯 أُقَسِّمُ مَصادِرَ الْمِياهِ في دَوْلَةِ الْإِماراتِ، وَأُعَدِّدُ أَغْراضَ اسْتِخْدامِ الْمِياهِ الْمُعالَجَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ الْوارِدَةَ في الرُّؤْيَةِ، وَيُقَسِّمُ مَصادِرَ الْمِياهِ التَّقْليدِيَّةِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ.',1),('يُسَجِّلُ الْأَهْدافَ الَّتي تُحَقِّقُها دَوْلَةُ الْإِماراتِ مِنْ مَشاريعِ إِنْشاءِ السُّدودِ، وَيَذْكُرُ الطُّرُقَ الْمُسْتَخْدَمَةَ لِتَحْلِيَةِ الْمِياهِ.',2),('يُعَدِّدُ الْأَغْراضَ الَّتي تَسْعى دَوْلَةُ الْإِماراتِ لِتَحْقيقِ الْفائِدَةِ مِنْها في اسْتِخْدامِ الْمِياهِ الْمُعالَجَةِ بِنِسْبَةِ 100%، وَيُقَدِّمُ مُقْتَرَحاتٍ لِلتَّوَسُّعِ فيها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْأَمْنُ الْمائِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ: الْفُرَصُ وَالتَّحَدِّياتُ', 'لِذا فَقَدْ أَدْرَكَتْ حُكومَةُ دَوْلَةِ الْإِماراتِ مُنْذُ قِيامِ الِاتِّحادِ عامَ 1971م أَهَمِّيَّةَ الْمِياهِ وَدَوْرَها في التَّنْمِيَةِ الِاقْتِصادِيَّةِ وَالزِّراعِيَّةِ وَالسُّكّانِيَّةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 116)', 'كِتابُ النَّشاطِ ص 116–118', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L16/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَكْبَرُ مَصادِرِ الْمِياهِ في الْإِماراتِ نِسْبَةً وَفْقَ الشَّكْلِ:','[{"id": "a", "text": "الْمِياهُ الْجَوْفِيَّةُ"}, {"id": "b", "text": "الْمِياهُ السَّطْحِيَّةُ"}, {"id": "c", "text": "مِياهُ الصَّرْفِ الْمُعالَجَةُ"}]'),('مِنْ مَصادِرِ الْمِياهِ غَيْرِ التَّقْليدِيَّةِ في الْإِماراتِ:','[{"id": "a", "text": "مِياهُ التَّحْلِيَةِ"}, {"id": "b", "text": "الْأَوْدِيَةُ"}, {"id": "c", "text": "الْيَنابيعُ"}]'),('تَمْتازُ صُخورُ الْأَفْيوليتِ النّارِيَّةُ بِأَنَّها:','[{"id": "a", "text": "صَمّاءُ لا مَسامِيَّةَ فيها وَلا نَفاذِيَّةَ"}, {"id": "b", "text": "عالِيَةُ النَّفاذِيَّةِ"}, {"id": "c", "text": "رَمْلِيَّةٌ مَسامِيَّةٌ"}]'),('تَسْعَى الدَّوْلَةُ لِاسْتِخْدامِ الْمِياهِ الْمُعالَجَةِ بِنِسْبَةِ:','[{"id": "a", "text": "100%"}, {"id": "b", "text": "14%"}, {"id": "c", "text": "50%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L17', 'الرُّؤْيَةُ الثّانِيَةُ: الطَّلَبُ عَلى مَوارِدِ الْمِياهِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 3, 'كِتابُ النَّشاطِ ص 119–121', true, '🎯 أُعَدِّدُ أَهَمَّ الْقِطاعاتِ الْمُسْتَهْلِكَةِ لِلْمِياهِ، وَأُرَتِّبُ إِجْراءاتِ سَدِّ الْفَجْوَةِ بَيْنَ الطَّلَبِ وَالْمُتاحِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْمَفاهيمَ الْوارِدَةَ في الرُّؤْيَةِ، وَيُعَدِّدُ أَهَمَّ الْقِطاعاتِ الْمُسْتَهْلِكَةِ لِمَوْرِدِ الْمِياهِ في دَوْلَةِ الْإِماراتِ.',1),('يُرَتِّبُ الْإِجْراءاتِ حَسَبَ أَهَمِّيَّتِها لِسَدِّ الْفَجْوَةِ بَيْنَ الطَّلَبِ عَلَى الْمِياهِ وَالْمَوارِدِ الْمُتاحَةِ مِنَ التَّحْلِيَةِ، وَيُحَلِّلُ شَكْلَ الطَّلَبِ الْمُتَوَقَّعِ حَتّى عامِ 2030م.',2),('يُعَدِّدُ الْجُهودَ الَّتي تَبْذُلُهَا الْحُكومَةُ في سَبيلِ الْوُصولِ لِإِدارَةٍ مُتَكامِلَةٍ وَتَنْمِيَةٍ مُسْتَدامَةٍ لِمَوارِدِ الْمِياهِ الشَّحيحَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الطَّلَبُ عَلى مَوارِدِ الْمِياهِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 'وَتُسْتَخْدَمُ مُعْظَمُ الْمِياهِ الْمُحَلّاةِ لِتَلْبِيَةِ الطَّلَبِ عَلى مِياهِ الشُّرْبِ أَوِ الِاسْتِهْلاكِ الْحَضَرِيِّ لِلْأَغْراضِ الْمَنْزِلِيَّةِ وَالصِّناعِيَّةِ. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 119)', 'كِتابُ النَّشاطِ ص 119–121', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L17/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الدَّوْلَةُ الْأولى عالَمِيًّا في إِنْتاجِ الْمِياهِ الْمُحَلّاةِ وَفْقَ الرُّؤْيَةِ:','[{"id": "a", "text": "الْمَمْلَكَةُ الْعَرَبِيَّةُ السَّعودِيَّةُ"}, {"id": "b", "text": "الْإِماراتُ"}, {"id": "c", "text": "كَنَدا"}]'),('تُسْتَخْدَمُ مُعْظَمُ الْمِياهِ الْمُحَلّاةِ في الْإِماراتِ لِـ:','[{"id": "a", "text": "مِياهِ الشُّرْبِ وَالِاسْتِهْلاكِ الْحَضَرِيِّ"}, {"id": "b", "text": "رَيِّ الْمَحاصيلِ الْكَبيرَةِ"}, {"id": "c", "text": "التَّصْديرِ"}]'),('سِياسَةُ الِاعْتِمادِ عَلَى الْمَوارِدِ الذّاتِيَّةِ فَقَطْ هِيَ:','[{"id": "a", "text": "الِاكْتِفاءُ الذّاتِيُّ"}, {"id": "b", "text": "الْوارِداتُ"}, {"id": "c", "text": "التَّحْلِيَةُ"}]'),('يَبْلُغُ عَدَدُ مَحاضِرِ ليوا نَحْوَ:','[{"id": "a", "text": "52 واحَةً"}, {"id": "b", "text": "25 واحَةً"}, {"id": "c", "text": "100 واحَةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T3-L18', 'الرُّؤْيَةُ الثّالِثَةُ: أَزْمَةُ الْغِذاءِ الْعالَمِيَّةُ عامَ 2008م وَرَدُّ فِعْلِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 3, 'كِتابُ النَّشاطِ ص 122–125', true, '🎯 أُطَبِّقُ مَهارَةَ حَلِّ الْمُشْكِلاتِ عَلى أَزْمَةِ الْغِذاءِ، وَأَرْبِطُ بَيْنَ الطَّلَبِ عَلَى الْوَقودِ الْحَيَوِيِّ وَالْأَزْمَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُناقِشُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيُعَرِّفُ الْمَخْزونَ الْإِسْتِراتيجِيَّ الْغِذائِيَّ.',1),('يُطَبِّقُ مَهارَةَ التَّفْكيرِ النّاقِدِ وَحَلِّ الْمُشْكِلاتِ وَاتِّخاذِ الْقَراراتِ، وَيَرْبِطُ بَيْنَ الطَّلَبِ عَلَى الْوَقودِ الْحَيَوِيِّ وَأَزْمَةِ الْغِذاءِ.',2),('يَسْتَكْشِفُ آثارَ الِاسْتِثْماراتِ الزِّراعِيَّةِ عَلَى الْأَمْنِ الْغِذائِيِّ الْمَحَلِّيِّ لِلدُّوَلِ، وَيَقْتَرِحُ لِمُراقَبَةِ ارْتِفاعِ الْأَسْعارِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: أَزْمَةُ الْغِذاءِ الْعالَمِيَّةُ عامَ 2008م وَرَدُّ فِعْلِ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ', 'وَلٰكِنَّ الْقُيودَ الْمَفْروضَةَ عَلَى التِّجارَةِ مِنْ طَرَفِ الدُّوَلِ الْمُصَدِّرَةِ لِلْغِذاءِ كانَتْ مُقْلِقَةً. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 122)', 'كِتابُ النَّشاطِ ص 122–125', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L18/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('كانَ الْمُقْلِقُ في أَزْمَةِ الْغِذاءِ عامَ 2008م لِدَوْلَةٍ كَالْإِماراتِ:','[{"id": "a", "text": "الْقُيودَ الْمَفْروضَةَ عَلَى التِّجارَةِ مِنَ الدُّوَلِ الْمُصَدِّرَةِ"}, {"id": "b", "text": "قِلَّةَ الْأَمْوالِ"}, {"id": "c", "text": "كَثْرَةَ الْأَمْطارِ"}]'),('يُحْتَفَظُ بِالْمَخْزونِ الْإِسْتِراتيجِيِّ الْغِذائِيِّ تَحْتَ إِشْرافٍ مُباشِرٍ مِنْ:','[{"id": "a", "text": "الْحُكوماتِ"}, {"id": "b", "text": "التُّجّارِ الْأَفْرادِ"}, {"id": "c", "text": "الْمُسْتَهْلِكينَ"}]'),('مِنْ مَحاوِرِ رَدِّ فِعْلِ الْإِماراتِ عَلى أَزْمَةِ 2008م:','[{"id": "a", "text": "التَّخْزينُ الْإِسْتِراتيجِيُّ"}, {"id": "b", "text": "إِيقافُ الِاسْتيرادِ"}, {"id": "c", "text": "تَصْديرُ الْغِذاءِ"}]'),('عَدَدُ أَعْضاءِ الْهَيْئَةِ الْعَرَبِيَّةِ لِلِاسْتِثْمارِ وَالْإِنْماءِ الزِّراعِيِّ وَفْقَ كِتابِ النَّشاطِ:','[{"id": "a", "text": "21 دَوْلَةً عَرَبِيَّةً"}, {"id": "b", "text": "6 دُوَلٍ"}, {"id": "c", "text": "52 دَوْلَةً"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T3-L19', 'الرُّؤْيَةُ الرّابِعَةُ: الْأَمْنُ الْغِذائِيُّ وَالْمائِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ، بَعْضُ الِاقْتِراحاتِ وَخُطَّةُ الْعَمَلِ', 3, 'كِتابُ النَّشاطِ ص 126–131', true, '🎯 أَشْرَحُ دَوْرَ حُكومَةِ الْإِماراتِ في تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ، وَأُشارِكُ في اقْتِراحِ حُلولٍ لِقَضايَا الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُناقِشُ الْمَفاهيمَ وَالْمُصْطَلَحاتِ الْوارِدَةَ في الرُّؤْيَةِ، وَيَتَعَرَّفُ عَلَى الْمُنَظَّماتِ الدَّوْلِيَّةِ: مُنَظَّمَةِ التِّجارَةِ الْعالَمِيَّةِ وَمُنَظَّمَةِ الْفاوِ.',1),('يَشْرَحُ دَوْرَ حُكومَةِ الْإِماراتِ في تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ، وَيُعَدِّدُ وَسائِلَ الْمُحافَظَةِ عَلَى الْمَوارِدِ الْمائِيَّةِ.',2),('يُشارِكُ في اقْتِراحِ الْحُلولِ لِقَضايَا الْأَمْنِ الْمائِيِّ وَالْغِذائِيِّ: السُّمْنَةِ وَالتَّنْويعِ الِاقْتِصادِيِّ وَتَوافُرِ الْإِحْصاءاتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الْأَمْنُ الْغِذائِيُّ وَالْمائِيُّ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ، بَعْضُ الِاقْتِراحاتِ وَخُطَّةُ الْعَمَلِ', 'وَلا يوجَدُ ما يَكْفي مِنَ الْمِياهِ لِلْمُحافَظَةِ عَلى مُسْتَوَى الزِّراعَةِ الْحالِيَّةِ، فَضْلًا عَنِ التَّوَسُّعِ فيها. (كِتابُ النَّشاطِ، الْفِكْرَةُ الرَّئيسَةُ، ص 126)', 'كِتابُ النَّشاطِ ص 126–131', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L19/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('انْضَمَّتِ الْإِماراتُ إِلى مُنَظَّمَةِ التِّجارَةِ الْعالَمِيَّةِ عامَ:','[{"id": "a", "text": "1996م"}, {"id": "b", "text": "1971م"}, {"id": "c", "text": "2008م"}]'),('تَرَى الرُّؤْيَةُ أَنَّ الزِّراعَةَ في الْإِماراتِ تَضُرُّ بِالْأَمْنِ الْمائِيِّ لِأَنَّها:','[{"id": "a", "text": "أَكْبَرُ مُسْتَهْلِكٍ لِلْمِياهِ في الْبِلادِ"}, {"id": "b", "text": "أَكْبَرُ مُصَدِّرٍ لِلْغِذاءِ"}, {"id": "c", "text": "لا تَسْتَهْلِكُ ماءً"}]'),('مَنَحَتِ الْفاو الشَّيْخَ زايِدًا -رَحِمَهُ اللهُ- ميدالِيَّةَ الْيَوْمِ الْعالَمِيِّ لِلْأَغْذِيَةِ عامَ:','[{"id": "a", "text": "2001م"}, {"id": "b", "text": "1995م"}, {"id": "c", "text": "2015م"}]'),('مِنْ مَعاييرِ الْمُؤَشِّرِ السَّنَوِيِّ لِلْأَمْنِ الْغِذائِيِّ الْعالَمِيِّ:','[{"id": "a", "text": "الْقُدْرَةُ عَلى تَحَمُّلِ تَكاليفِ الْغِذاءِ"}, {"id": "b", "text": "عَدَدُ الْمَصانِعِ"}, {"id": "c", "text": "طولُ السَّواحِلِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;