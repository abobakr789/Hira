
insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 2, 1, 'الْوَحْدَةُ الثّالِثَةُ: تاريخُنا حاضِرٌ — مِنَ الْأُمَوِيّينَ إِلى زايِدٍ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=2
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y8-T2-L1', 'الدَّوْلَةُ الْأُمَوِيَّةُ', 3, 'ص 12–23', true, '🎯 أُبَيِّنُ كَيْفَ قامَتِ الدَّوْلَةُ الْأُمَوِيَّةُ، وَأَهَمَّ أَعْمالِ عَبْدِ الْمَلِكِ بْنِ مَرْوانَ، وَعَوامِلَ ضَعْفِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ سَنَةَ قِيامِ الدَّوْلَةِ الْأُمَوِيَّةِ وَمُدَّتَها وَعَدَدَ خُلَفائِها.',1),('أُبَيِّنُ أَهَمَّ أَعْمالِ الْخَليفَةِ عَبْدِ الْمَلِكِ بْنِ مَرْوانَ.',2),('أُحَلِّلُ عَوامِلَ ضَعْفِ الدَّوْلَةِ الْأُمَوِيَّةِ وَنِهايَتَها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الدَّوْلَةُ الْأُمَوِيَّةُ', 'أَمَرَ عَبْدُ الْمَلِكِ بْنُ مَرْوانَ عُمّالَ الْأَقاليمِ في الْعِراقِ وَمِصْرَ بِتَعْريبِ الدَّواوينِ، أَيْ جَعْلِها تُكْتَبُ بِالْعَرَبِيَّةِ بَدَلًا مِنَ الْيونانِيَّةِ وَالْفارِسِيَّةِ وَالْقِبْطِيَّةِ الَّتي كانَتْ تُكْتَبُ بِها مِنْ قَبْلُ، مِمّا أَدّى إِلَى انْتِشارِ اللُّغَةِ الْعَرَبِيَّةِ في الْأَقاليمِ الْجَديدَةِ. وَكانَ يُفَكِّرُ مُنْذُ زَمَنٍ في إيجادِ عُمْلَةٍ نَقْدِيَّةٍ لِلدَّوْلَةِ الْمُتَرامِيَةِ الْأَطْرافِ، فَقَدْ كانَ الْمُسْلِمونَ يَسْتَعْمِلونَ نُقودَ الْفُرْسِ وَالرّومِ، وَلا يُعْقَلُ أَنْ تَعْتَمِدَ دَوْلَةٌ في نَقْدِها عَلى دَوْلَةٍ مُعادِيَةٍ؛ وَهٰكَذا أَنْشَأَ دارًا لِسَكِّ الْعُمْلَةِ عامَ 74 هـ، فَأَصْبَحَ لِلدَّوْلَةِ عُمْلَةٌ نَقْدِيَّةٌ.', 'ص 12–23', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('قامَتِ الدَّوْلَةُ الْأُمَوِيَّةُ سَنَةَ:','[{"id": "a", "text": "41 هـ"}, {"id": "b", "text": "132 هـ"}, {"id": "c", "text": "74 هـ"}]'),('لُقِّبَ بِالْمُؤَسِّسِ الثّاني لِلدَّوْلَةِ الْأُمَوِيَّةِ:','[{"id": "a", "text": "عَبْدُ الْمَلِكِ بْنُ مَرْوانَ"}, {"id": "b", "text": "عُمَرُ بْنُ عَبْدِ الْعَزيزِ"}, {"id": "c", "text": "مَرْوانُ بْنُ مُحَمَّدٍ"}]'),('كانَتِ الدَّواوينُ قَبْلَ تَعْريبِها تُكْتَبُ بِاللُّغاتِ:','[{"id": "a", "text": "الْيونانِيَّةِ وَالْفارِسِيَّةِ وَالْقِبْطِيَّةِ"}, {"id": "b", "text": "الْأَلْمانِيَّةِ"}, {"id": "c", "text": "اللّاتينِيَّةِ وَحْدَها"}]'),('انْتَهَتِ الدَّوْلَةُ الْأُمَوِيَّةُ بِمَعْرَكَةِ:','[{"id": "a", "text": "الزّابِ سَنَةَ 132 هـ"}, {"id": "b", "text": "الْقادِسِيَّةِ"}, {"id": "c", "text": "حِطّينَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y8-T2-L2', 'الدَّوْلَةُ الْعَبّاسِيَّةُ', 3, 'ص 24–33', true, '🎯 أُقارِنُ بَيْنَ الْعَصْرِ الْعَبّاسِيِّ الْأَوَّلِ وَالثّاني، وَأُناقِشُ أَسْبابَ ظُهورِ الدُّوَيْلاتِ الِانْفِصالِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ كَيْفَ قامَتِ الدَّوْلَةُ الْعَبّاسِيَّةُ وَإِلامَ يَنْتَسِبُ الْعَبّاسِيّونَ.',1),('أُقارِنُ في جَدْوَلٍ بَيْنَ الْعَصْرِ الْعَبّاسِيِّ الْأَوَّلِ وَالْعَصْرِ الثّاني.',2),('أُناقِشُ أَسْبابَ ظُهورِ الدُّوَيْلاتِ الِانْفِصالِيَّةِ وَسُقوطِ بَغْدادَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الدَّوْلَةُ الْعَبّاسِيَّةُ', 'يَخْتَلِفُ الْعَصْرُ الْعَبّاسِيُّ الثّاني في كَثيرٍ مِنْ مَظاهِرِهِ عَنِ الْعَصْرِ الْعَبّاسِيِّ الْأَوَّلِ، حَيْثُ انْتَقَلَتِ الدَّوْلَةُ مِنَ الْمَرْكَزِيَّةِ إِلَى اللّامَرْكَزِيَّةِ في نِظامِ الْحُكْمِ، وَقامَتْ دُوَلٌ انْفِصالِيَّةٌ مُسْتَقِلَّةٌ اسْتِقْلالًا تامًّا أَوْ جُزْئِيًّا، وَدَخَلَتْ شُعوبٌ جَديدَةٌ في الْمُجْتَمَعِ الْإِسْلامِيِّ تَمَكَّنَتْ مِنَ الْوُصولِ إِلَى الْحُكْمِ، وَوَقَعَ الْخُلَفاءُ تَحْتَ نُفوذِهِمْ مِمّا أَدّى إِلى تَحْجيمِ دَوْرِهِمُ السِّياسِيِّ الَّذي كانَ يَتَمَتَّعُ بِهِ أَسْلافُهُمْ خُلَفاءُ الْعَصْرِ الْعَبّاسِيِّ الْأَوَّلِ.', 'ص 24–33', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَنْتَسِبُ الْعَبّاسِيّونَ إِلى:','[{"id": "a", "text": "الْعَبّاسِ بْنِ عَبْدِ الْمُطَّلِبِ"}, {"id": "b", "text": "أَبي سُفْيانَ"}, {"id": "c", "text": "الزُّبَيْرِ بْنِ الْعَوّامِ"}]'),('بَنى الْمُعْتَصِمُ بِاللهِ لِجُنودِهِ الْأَتْراكِ مَدينَةَ:','[{"id": "a", "text": "سامُرّاءَ"}, {"id": "b", "text": "بَغْدادَ"}, {"id": "c", "text": "الْكوفَةِ"}]'),('كانَتِ الْوِزارَةُ في الْعَصْرِ الْعَبّاسِيِّ الْأَوَّلِ وِزارَةَ:','[{"id": "a", "text": "تَنْفيذٍ"}, {"id": "b", "text": "تَفْويضٍ"}, {"id": "c", "text": "انْفِصالٍ"}]'),('سَقَطَتْ بَغْدادُ عَلى يَدِ الْمَغولِ عامَ:','[{"id": "a", "text": "656 هـ / 1258 م"}, {"id": "b", "text": "132 هـ / 750 م"}, {"id": "c", "text": "41 هـ / 661 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y8-T2-L3', 'الْحَضارَةُ الْعَرَبِيَّةُ الْإِسْلامِيَّةُ', 3, 'ص 34–43', true, '🎯 أُوَضِّحُ خَصائِصَ الْحَضارَةِ الْعَرَبِيَّةِ الْإِسْلامِيَّةِ وَعَوامِلَ ازْدِهارِها وَمَعابِرَ انْتِقالِها إِلى أوروبّا.' from u
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
       select l.id, v.s, v.n from l, (values ('أُعَدِّدُ خَصائِصَ الْحَضارَةِ الْعَرَبِيَّةِ الْإِسْلامِيَّةِ.',1),('أُحَدِّدُ مَعابِرَ انْتِقالِ الْحَضارَةِ الْإِسْلامِيَّةِ إِلى أوروبّا.',2),('أُقَدِّرُ دَوْرَ الْعُلَماءِ الْمُسْلِمينَ في الِارْتِقاءِ بِالْحَضارَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْحَضارَةُ الْعَرَبِيَّةُ الْإِسْلامِيَّةُ', 'مِنْ مُقَوِّماتِ النَّهْضَةِ الْفِكْرِيَّةِ في الْعالَمِ الْإِسْلامِيِّ حَرَكَةُ النَّقْلِ وَالتَّرْجَمَةِ، وَالَّتِي اسْتَطاعَ الْمُسْلِمونَ مِنْ خِلالِها أَنْ يَقِفوا عَلى كَثيرٍ مِنَ الْعُلومِ، وَأَنْ يَتَعَرَّفوا تُراثَ الْأُمَمِ الْأُخْرى، كَما تَمَكَّنوا بِفَضْلِها مِنْ نَقْلِ ثَقافاتِهِمْ إِلَى الشُّعوبِ الْأُخْرى؛ فَساعَدَ ذٰلِكَ عَلَى انْتِشارِ الْإِسْلامِ وَعالَمِيَّتِهِ. وَيُمْكِنُ الْقَوْلُ إِنَّ حَرَكَةَ التَّرْجَمَةِ بَدَأَتْ في الْعَصْرِ الْأُمَوِيِّ وَازْدَهَرَتْ في الْعَصْرِ الْعَبّاسِيِّ.', 'ص 34–43', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْأَنْدَلُسُ هِيَ:','[{"id": "a", "text": "أَسْبانْيا وَالْبُرْتُغالُ حالِيًّا"}, {"id": "b", "text": "إيطالْيا وَفَرَنْسا"}, {"id": "c", "text": "تُرْكِيا وَالْيونانُ"}]'),('ظَهَرَتْ حَرَكَةُ التَّرْجَمَةِ في الْعَصْرِ الْأُمَوِيِّ عَلى يَدِ:','[{"id": "a", "text": "خالِدِ بْنِ يَزيدَ بْنِ مُعاوِيَةَ"}, {"id": "b", "text": "الْمَأْمونِ"}, {"id": "c", "text": "ابْنِ الْمُقَفَّعِ"}]'),('ابْتَكَرَ عِلْمَ الْجَبْرِ:','[{"id": "a", "text": "الْخَوارِزْمِيُّ"}, {"id": "b", "text": "جابِرُ بْنُ حَيّانَ"}, {"id": "c", "text": "الْإِدْريسِيُّ"}]'),('الْأَداةُ الْمُسْتَخْدَمَةُ في تَحْديدِ الْجِهاتِ هِيَ:','[{"id": "a", "text": "الْإِسْطُرْلابُ"}, {"id": "b", "text": "الْمِزْوَلَةُ"}, {"id": "c", "text": "الْمِرْآةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y8-T2-L4', 'زايِدٌ وَحُلْمُ الشَّبابِ', 3, 'ص 44–53', true, '🎯 أَصِفُ مَظاهِرَ اهْتِمامِ الشَّيْخِ زايِدٍ — رَحِمَهُ اللهُ — بِالشَّبابِ وَدَوْرَهُمْ في بِناءِ الْوَطَنِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَظاهِرَ اهْتِمامِ دَوْلَةِ الْإِماراتِ بِقِطاعِ الشَّبابِ.',1),('أُناقِشُ دَوْرَ الشَّبابِ في مَسيرَةِ التَّنْمِيَةِ وَالْبِناءِ.',2),('أُثَمِّنُ أَهَمَّ الْمُبادَراتِ الْحُكومِيَّةِ الَّتي مَكَّنَتِ الشَّبابَ مِنِ اتِّخاذِ الْقَراراتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'زايِدٌ وَحُلْمُ الشَّبابِ', 'كانَ الشَّيْخُ زايِدُ بْنُ سُلْطانَ آلِ نَهْيانَ — رَحِمَهُ اللهُ — يُدْرِكُ ما يَتَعَرَّضُ إِلَيْهِ الشَّبابُ مِنْ تَحَدِّياتٍ تُبْعِدُهُمْ عَنِ الطَّريقِ الْقَويمِ، وَتُبْعِدُهُمْ عَنْ دَوْرِهِمُ الرِّيادِيِّ في النُّهوضِ بِالْوَطَنِ وَالْمُجْتَمَعِ؛ لِذٰلِكَ كانَ يَتَوَجَّهُ إِلَيْهِمْ بِالْخِطابِ وَالنُّصْحِ وَالْحَضِّ عَلَى الِالْتِزامِ بِقَضايا الْوَطَنِ وَالْمُجْتَمَعِ، وَيَفْسَحُ لَهُمُ الْمَجالَ لِلْعَمَلِ وَإِبْداءِ الْآراءِ وَالْمُساهَمَةِ في الْبِناءِ وَالتَّطْويرِ. وَقالَ — رَحِمَهُ اللهُ —: «إِنَّني أُومِنُ بِالشَّبابِ وَلا بُدَّ أَنْ يَتَوَلَّى الْمَسْؤولِيَّةَ الشَّبابُ الْمُثَقَّفُ وَأَبْناءُ الْبِلادِ».', 'ص 44–53', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('السَّجِيَّةُ تَعْني:','[{"id": "a", "text": "الطَّبيعَةَ وَالْخُلُقَ"}, {"id": "b", "text": "الثَّرْوَةَ"}, {"id": "c", "text": "الْمَنْصِبَ"}]'),('يُوافِقُ يَوْمُ النَّخْوَةِ:','[{"id": "a", "text": "17 يَنايِرَ"}, {"id": "b", "text": "2 ديسَمْبِرَ"}, {"id": "c", "text": "1 مارِسَ"}]'),('بَرْنامَجُ «سُفَراءِ وَطَني الْإِماراتِ» يَحْمِلُ اسْمَ:','[{"id": "a", "text": "قِيادِيّو 2020"}, {"id": "b", "text": "مِئَوِيَّةُ 2071"}, {"id": "c", "text": "رُؤْيَةُ 2031"}]'),('أَوَّلُ وَزيرَةِ دَوْلَةٍ لِشُؤونِ الشَّبابِ هِيَ مَعالي:','[{"id": "a", "text": "شَمّا بِنْتُ سُهَيْلٍ الْمَزْروعِيُّ"}, {"id": "b", "text": "سارَةُ الْأَميرِيُّ"}, {"id": "c", "text": "عَليا الْمَنْصورِيُّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 2, 2, 'الْوَحْدَةُ الرّابِعَةُ: آفاقٌ مُسْتَقْبَلِيَّةٌ — نَقْلٌ وَاقْتِصادٌ وَرِيادَةٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=2
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y8-T2-L5', 'الْإِماراتُ: مِنْ سَفينَةِ الصَّحْراءِ إِلى مِسْبارِ الْفَضاءِ', 3, 'ص 56–69', true, '🎯 أُقارِنُ بَيْنَ النَّقْلِ وَالْمُواصَلاتِ قَبْلَ قِيامِ الِاتِّحادِ وَبَعْدَهُ، وَأَتَتَبَّعُ انْطِلاقَ الْإِماراتِ نَحْوَ الْفَضاءِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُقارِنُ بَيْنَ وَسائِلِ النَّقْلِ قَبْلَ قِيامِ الِاتِّحادِ وَبَعْدَهُ.',1),('أُوَضِّحُ أَثَرَ شَبَكاتِ النَّقْلِ الْمُتَطَوِّرَةِ في تَشْجيعِ النُّمُوِّ الِاقْتِصادِيِّ.',2),('أَتَتَبَّعُ قِصَّةَ انْطِلاقِ الْإِماراتِ نَحْوَ الْفَضاءِ وَأَعْتَزُّ بِجُهودِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْإِماراتُ: مِنْ سَفينَةِ الصَّحْراءِ إِلى مِسْبارِ الْفَضاءِ', 'يُعَدُّ قِطاعُ النَّقْلِ وَالْمُواصَلاتِ مِنَ الْقِطاعاتِ الْمُهِمَّةِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ، فَهُوَ يُؤَثِّرُ بِشَكْلٍ مُباشِرٍ وَغَيْرِ مُباشِرٍ عَلَى الْقِطاعاتِ الِاقْتِصادِيَّةِ الْأُخْرى، وَلَقَدْ تَطَوَّرَتْ طُرُقُ النَّقْلِ وَالْمُواصَلاتِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ الَّتي كانَتْ تَعْتَمِدُ قَبْلَ قِيامِ الِاتِّحادِ عَلى مَسالِكِ الْجِمالِ، ثُمَّ انْتَشَرَتْ وَسائِلُ النَّقْلِ وَالْمُواصَلاتِ الْحَديثَةُ بَعْدَ قِيامِ الِاتِّحادِ، وَوَظَّفَتِ التِّكْنولوجْيا في اسْتِكْشافِ الْفَضاءِ وَالْوُصولِ إِلى كَوْكَبِ الْمِرّيخِ.', 'ص 56–69', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('السُّفُنُ الصَّغيرَةُ الَّتي كانَتْ تَرْسو عِنْدَ مَراسٍ حَجَرِيَّةٍ تُسَمّى:','[{"id": "a", "text": "الدَّهْوَ"}, {"id": "b", "text": "الْبومَ"}, {"id": "c", "text": "الشّوعِيَّ"}]'),('افْتُتِحَ مِتْرو دُبَيٍّ عامَ:','[{"id": "a", "text": "2009 م"}, {"id": "b", "text": "2020 م"}, {"id": "c", "text": "1971 م"}]'),('يَبْلُغُ طولُ شَبَكَةِ الِاتِّحادِ لِلسِّكَكِ الْحَديدِيَّةِ نَحْوَ:','[{"id": "a", "text": "1200 كم"}, {"id": "b", "text": "120 كم"}, {"id": "c", "text": "12 كم"}]'),('أُطْلِقَ مِسْبارُ الْأَمَلِ في:','[{"id": "a", "text": "20 يولْيو 2020 م"}, {"id": "b", "text": "2 ديسَمْبِرَ 1971 م"}, {"id": "c", "text": "17 يَنايِرَ 2021 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'SS-Y8-T2-L6', 'الِاقْتِصادُ الْأَخْضَرُ الْإِماراتِيُّ', 3, 'ص 70–79', true, '🎯 أُوَضِّحُ مَفْهومَ الِاقْتِصادِ الْأَخْضَرِ وَأَهَمِّيَّتَهُ، وَأُناقِشُ التَّجارِبَ الْإِماراتِيَّةَ فيهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ مَفْهومَ الِاقْتِصادِ الْأَخْضَرِ وَالِاقْتِصادِ الْبُنِّيِّ.',1),('أُبَيِّنُ أَدْوارَ الْجِهاتِ الْأَرْبَعِ في تَحْقيقِ الِاقْتِصادِ الْأَخْضَرِ.',2),('أُثَمِّنُ جُهودَ الْقادَةِ نَحْوَ الْحِفاظِ عَلَى الِاقْتِصادِ الْأَخْضَرِ وَتَنْمِيَتِهِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الِاقْتِصادُ الْأَخْضَرُ الْإِماراتِيُّ', 'يُعَرِّفُ بَرْنامَجُ الْأُمَمِ الْمُتَّحِدَةِ لِلْبيئَةِ الِاقْتِصادَ الْأَخْضَرَ بِأَنَّهُ الِاقْتِصادُ الَّذي يُؤَدّي إِلى تَحْسينِ رَفاهِيَةِ الْإِنْسانِ وَالْمُساواةِ الِاجْتِماعِيَّةِ، وَالْحَدِّ مِنَ الْمَخاطِرِ الْبيئِيَّةِ وَتَحْقيقِ الِاسْتِدامَةِ مِنَ النَّواحي الِاقْتِصادِيَّةِ وَالِاجْتِماعِيَّةِ وَالْبيئِيَّةِ. إِنَّ الِاقْتِصادَ الْأَخْضَرَ لا يَحُلُّ مَحَلَّ الِاسْتِدامَةِ، بَلْ هُوَ السَّبيلُ إِلى تَحْقيقِ الِاسْتِدامَةِ، وَلِلِانْتِقالِ إِلَى الِاقْتِصادِ الْأَخْضَرِ سَيَتَطَلَّبُ الْأَمْرُ فَرْضَ السِّياساتِ وَالْقَوانينِ الدَّوْلِيَّةِ وَتَقْديمَ الدَّعْمِ وَالْحَوافِزِ الْمادِّيَّةِ، وَتَقْليلَ الدَّعْمِ لِلْأَنْشِطَةِ الضّارَّةِ بِالْبيئَةِ، وَتَوْجيهَ الِاسْتِثْماراتِ الْعامَّةِ نَحْوَ قِطاعاتٍ خَضْراءَ.', 'ص 70–79', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الِاقْتِصادُ الَّذي يَعْتَمِدُ عَلَى الْوَقودِ الْأَحْفورِيِّ بِشِدَّةٍ هُوَ:','[{"id": "a", "text": "الِاقْتِصادُ الْبُنِّيُّ"}, {"id": "b", "text": "الِاقْتِصادُ الْأَخْضَرُ"}, {"id": "c", "text": "الِاقْتِصادُ الْإِسْلامِيُّ"}]'),('بُدِئَ بِتَشْييدِ مَدينَةِ مَصْدَرَ عامَ:','[{"id": "a", "text": "2008 م"}, {"id": "b", "text": "1971 م"}, {"id": "c", "text": "2021 م"}]'),('اعْتَمَدَ مَجْلِسُ الْوُزَراءِ مَعاييرَ الْبِناءِ الْأَخْضَرِ عامَ:','[{"id": "a", "text": "2010 م"}, {"id": "b", "text": "2000 م"}, {"id": "c", "text": "2020 م"}]'),('نِظامُ التَّقْييمِ في أَبوظَبي يُعْرَفُ بِـ:','[{"id": "a", "text": "دَرَجاتِ اللُّؤْلُؤِ"}, {"id": "b", "text": "دَرَجاتِ النَّخيلِ"}, {"id": "c", "text": "دَرَجاتِ الصَّقْرِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 7, 'SS-Y8-T2-L7', 'الْإِماراتُ عاصِمَةُ الِاقْتِصادِ الْإِسْلامِيِّ', 3, 'ص 80–89', true, '🎯 أَتَعَرَّفُ خَصائِصَ النِّظامِ الِاقْتِصادِيِّ الْإِسْلامِيِّ وَرَكائِزَ مُبادَرَةِ دُبَيٍّ عاصِمَةِ الِاقْتِصادِ الْإِسْلامِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ النِّظامَ الِاقْتِصادِيَّ الْإِسْلامِيَّ وَخَصائِصَهُ الْأَساسِيَّةَ.',1),('أُوَضِّحُ الْمُرابَحَةَ وَالْمُضارَبَةَ وَالْمُشارَكَةَ.',2),('أَسْتَخْلِصُ رَكائِزَ اسْتِراتيجِيَّةِ مُبادَرَةِ دُبَيٍّ عاصِمَةِ الِاقْتِصادِ الْإِسْلامِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْإِماراتُ عاصِمَةُ الِاقْتِصادِ الْإِسْلامِيِّ', 'الْمُشارَكَةُ في الْمَخاطِرِ صِفَةٌ مُمَيِّزَةٌ لِلِاقْتِصادِ الْإِسْلامِيِّ عَنْ غَيْرِهِ مِنَ النُّظُمِ الِاقْتِصادِيَّةِ الْأُخْرى، حَيْثُ يَتِمُّ مِنْ خِلالِهِ الْمُشارَكَةُ في الرِّبْحِ وَالْخَسارَةِ الَّتي تُعَدُّ قاعِدَةً لِتَوْزيعِ الثَّرْوَةِ بَيْنَ رَأْسِ الْمالِ وَالْعَمَلِ، وَهِيَ الْأَساسُ الَّذي يُحَقِّقُ عَدالَةَ التَّوْزيعِ. وَالصَّيْرَفَةُ الْإِسْلامِيَّةُ هِيَ الْمُعامَلاتُ الشَّرْعِيَّةُ السَّليمَةُ الَّتي يَقومُ بِهَا النِّظامُ أَوِ النَّشاطُ الْمَصْرِفِيُّ، وَتَكونُ بَعيدَةً عَنِ الرِّبا الْمُحَرَّمِ وَالْكَسْبِ الْحَرامِ، وَتَتَوافَقُ مَعَ الشَّريعَةِ الْإِسْلامِيَّةِ.', 'ص 80–89', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T2-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْأَداةُ الَّتي تَقومُ عَلى سِعْرِ التَّكْلِفَةِ مُضافًا إِلَيْهِ رِبْحٌ مُحَدَّدٌ هِيَ:','[{"id": "a", "text": "الْمُرابَحَةُ"}, {"id": "b", "text": "الْمُضارَبَةُ"}, {"id": "c", "text": "الْمُشارَكَةُ"}]'),('أُطْلِقَتْ مُبادَرَةُ دُبَيٍّ عاصِمَةِ الِاقْتِصادِ الْإِسْلامِيِّ في بِدايَةِ عامِ:','[{"id": "a", "text": "2013 م"}, {"id": "b", "text": "2008 م"}, {"id": "c", "text": "2021 م"}]'),('مِنْ مُرْتَكَزاتِ الْإِطارِ الْهَيْكَلِيِّ لِلِاقْتِصادِ الْإِسْلامِيِّ:','[{"id": "a", "text": "التَّكافُلُ الِاجْتِماعِيُّ"}, {"id": "b", "text": "الرِّبا"}, {"id": "c", "text": "الِاحْتِكارُ"}]'),('أَهَمُّ أَدَواتِ التَّمْويلِ الْإِسْلامِيِّ هِيَ:','[{"id": "a", "text": "الصُّكوكُ الْإِسْلامِيَّةُ"}, {"id": "b", "text": "السَّنَداتُ بِفائِدَةٍ"}, {"id": "c", "text": "الْقُروضُ الرِّبَوِيَّةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;