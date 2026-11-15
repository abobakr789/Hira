insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 5, 7, 1, 1, 'الْوَحْدَةُ الْأولى: مِنْ تَشَكُّلِ الْأَرْضِ إِلى أَوَّلِ مُجْتَمَعٍ', true, 'native'
where not exists (select 1 from units where subject_id=5 and year_group=7 and term=1
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=5 and year_group=7 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'EH-Y7-T1-L01', 'مَراحِلُ تَشَكُّلِ التَّضاريسِ الطَّبيعِيَّةِ', 3, 'ص 1–8', true, '🎯 أَسْتَنْتِجُ مَراحِلَ تَشَكُّلِ تَضاريسِ دَوْلَةِ الْإِماراتِ، وَأُفَسِّرُ أَثَرَ الْمُناخِ الْقَديمِ فيها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ كَيْفَ تَشَكَّلَتْ جِبالُ الْحَجَرِ مِنْ قاعِ الْمُحيطِ.',1),('أُوَضِّحُ مَعْنَى الْمُسْتَحاثّاتِ وَأَهَمِّيَّتَها في مَعْرِفَةِ الْماضي.',2),('أَرْبِطُ بَيْنَ تَغَيُّرِ الْمُناخِ وَنَشْأَةِ الصَّحْراءِ وَالْأَوْدِيَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'مَراحِلُ تَشَكُّلِ التَّضاريسِ الطَّبيعِيَّةِ', 'عِنْدَما كانَتْ تَرْتَفِعُ نِسْبَةُ هُطولِ الْأَمْطارِ، كانَتِ الْأَنْهارُ تَتَدَفَّقُ عَبْرَ أَجْزاءٍ مِنْ أَرْضِ الْإِماراتِ وَتَتَّجِهُ نَحْوَ الْخَليجِ الْعَرَبِيِّ. وَمِمّا يَدُلُّ عَلى ذٰلِكَ وُجودُ سَبْخَةٍ مِلْحِيَّةٍ في مِنْطَقَةِ الظَّفْرَةِ مِنْ إِمارَةِ أَبوظَبي كانَتْ تَحْتَوي عَلى مَجْرًى نَهْرِيٍّ ضَخْمٍ وَمَجْموعَةٍ مِنَ الْبُحَيْراتِ، بِالْإِضافَةِ إِلَى الْأَوْدِيَةِ الَّتي تَشَكَّلَتْ بِفِعْلِ هُطولِ الْأَمْطارِ في جِبالِ الْحَجَرِ. وَقَدْ لَعِبَتْ هٰذِهِ الْأَوْدِيَةُ دَوْرًا مُهِمًّا في حَياةِ الشُّعوبِ الَّتي عاشَتْ في تِلْكَ الْمِنْطَقَةِ؛ فَقَدِ اسْتَخْدَمَها النّاسُ مَعْبَرًا لِلتَّنَقُّلِ بَيْنَ الْجِبالِ، وَاسْتَفادوا مِنْ تُرْبَتِها الْخَصْبَةِ في زِراعَةِ الْمَحاصيلِ.', 'ص 1–8', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T1-L01/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْكُتْلَةُ الْأَرْضِيَّةُ الضَّخْمَةُ الَّتي كانَتْ مِنْها أَرْضُ الْإِماراتِ تُسَمّى:','[{"id": "a", "text": "غُنْدُوانا"}, {"id": "b", "text": "التيثِسَ"}, {"id": "c", "text": "بَيْنونَةَ"}]'),('الْبَقايا الْعُضْوِيَّةُ الْقَديمَةُ الَّتي تَحَجَّرَتْ تُسَمّى:','[{"id": "a", "text": "الْمُسْتَحاثّاتِ"}, {"id": "b", "text": "السَّبْخَةَ"}, {"id": "c", "text": "الْكُثْبانَ"}]'),('تَشَكَّلَتْ جِبالُ الْإِماراتِ مِنْ:','[{"id": "a", "text": "قاعِ الْمُحيطِ الْمَدْفوعِ نَحْوَ الْأَعْلى"}, {"id": "b", "text": "تَراكُمِ الرِّمالِ"}, {"id": "c", "text": "جَفافِ الْبُحَيْراتِ"}]'),('كانَ الْخَليجُ الْعَرَبِيُّ جافًّا تَقْريبًا مُنْذُ نَحْوِ:','[{"id": "a", "text": "20,000 سَنَةٍ"}, {"id": "b", "text": "260 مِلْيونَ سَنَةٍ"}, {"id": "c", "text": "500 سَنَةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=5 and year_group=7 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'EH-Y7-T1-L02', 'جَبَلُ الْفايَةِ وَهِجْرَةُ الْبَشَرِ', 3, 'ص 9–12', true, '🎯 أَسْتَنْتِجُ مِنِ اكْتِشافاتِ جَبَلِ الْفايَةِ كَيْفَ وَصَلَ الْإِنْسانُ الْأَوَّلُ إِلى أَرْضِنا.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَتى ظَهَرَتْ سُلالَةُ الْإِنْسانِ الْحَديثِ وَمِنْ أَيْنَ انْتَشَرَتْ.',1),('أُبَيِّنُ ما كَشَفَهُ التَّنْقيبُ في جَبَلِ الْفايَةِ وَأَثَرَهُ في تَغْييرِ رَأْيِ الْعُلَماءِ.',2),('أَرْبِطُ بَيْنَ تَغَيُّرِ الْمُناخِ وَمَساراتِ هِجْرَةِ الْبَشَرِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'جَبَلُ الْفايَةِ وَهِجْرَةُ الْبَشَرِ', 'لَقَدْ وَفَّرَتِ الْأَدَواتُ الْحَجَرِيَّةُ الْمُكْتَشَفَةُ في جَبَلِ الْفايَةِ أَدِلَّةً مُهِمَّةً عَلى حَرَكَةِ انْتِقالِ الْبَشَرِ عَبْرَ شِبْهِ الْجَزيرَةِ الْعَرَبِيَّةِ، حَيْثُ كانَ النّاسُ يَنْتَقِلونَ مِنْها إِلى آسِيا فَأوروبّا وَمِنْ ثَمَّ أَمْريكا. وَهٰذا يَدُلُّ عَلى أَنَّ اكْتِشافاتِ جَبَلِ الْفايَةِ قَدْ وَضَعَتْ دَوْلَةَ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةَ عَلى خَريطَةِ الْمَواقِعِ الْعالَمِيَّةِ الَّتي تُشَكِّلُ مِفْتاحًا أَساسِيًّا لِمَعْرِفَةِ الْمَراحِلِ الْأولى مِنْ تاريخِ الْإِماراتِ. لٰكِنْ يَجِبُ التَّنْويهُ هُنا إِلى أَنَّ هٰذِهِ الْمَعْرِفَةَ لَيْسَتْ ثابِتَةً، بَلْ إِنَّها تَتَغَيَّرُ عَلَى الدَّوامِ مَعَ اكْتِشافِ عُلَماءِ الْآثارِ لِمَواقِعَ أَثَرِيَّةٍ جَديدَةٍ، وَتَطْويرِهِمْ مَنْهَجِيّاتٍ جَديدَةً لِدِراسَةِ الْأَدِلَّةِ.', 'ص 9–12', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T1-L02/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَقَعُ مَوْقِعُ جَبَلِ الْفايَةِ الْأَثَرِيُّ في إِمارَةِ:','[{"id": "a", "text": "الشّارِقَةِ"}, {"id": "b", "text": "أَبوظَبي"}, {"id": "c", "text": "الْفُجَيْرَةِ"}]'),('ظَهَرَتْ سُلالَةُ الْإِنْسانِ الْحَديثِ قَبْلَ نَحْوِ:','[{"id": "a", "text": "200,000 سَنَةٍ"}, {"id": "b", "text": "20,000 سَنَةٍ"}, {"id": "c", "text": "2,000 سَنَةٍ"}]'),('قُدِّرَ دَفْنُ أَدَواتِ جَبَلِ الْفايَةِ الْحَجَرِيَّةِ بَيْنَ:','[{"id": "a", "text": "130,000 وَ95,000 سَنَةٍ"}, {"id": "b", "text": "10,000 وَ8,000 سَنَةٍ"}, {"id": "c", "text": "500 وَ300 سَنَةٍ"}]'),('دَفَعَ النّاسَ إِلَى الْهِجْرَةِ الثّانِيَةِ قَبْلَ نَحْوِ 75,000 سَنَةٍ:','[{"id": "a", "text": "جَفافُ الْمُناخِ"}, {"id": "b", "text": "كَثْرَةُ الْأَمْطارِ"}, {"id": "c", "text": "ارْتِفاعُ الْبَحْرِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=5 and year_group=7 and term=1
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'EH-Y7-T1-L03', 'تَطَوُّرُ الْمُجْتَمَعِ', 3, 'ص 13–22', true, '🎯 أَسْتَنْتِجُ كَيْفَ غَيَّرَ الْمَطَرُ وَالتَّدْجينُ وَالْبَحْرُ حَياةَ النّاسِ في أَرْضِنا.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ أَثَرَ التَّغَيُّرِ الْمُناخِيِّ في عامِ 8000 ق.م عَلى أَرْضِ الْإِماراتِ.',1),('أُبَيِّنُ مَعْنَى التَّدْجينِ وَالْبَداوَةِ الرَّعَوِيَّةِ وَأَثَرَهُما في الْمُجْتَمَعِ.',2),('أَسْتَنْتِجُ مَظاهِرَ الْحَياةِ السّاحِلِيَّةِ وَبِداياتِ التِّجارَةِ الْبَحْرِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'تَطَوُّرُ الْمُجْتَمَعِ', 'وَجَدَ عُلَماءُ الْآثارِ صُعوبَةً مُتَزايِدَةً في الْعُثورِ عَلى أَدِلَّةٍ تُثْبِتُ أَنَّ النّاسَ كانوا يَعيشونَ في الْإِماراتِ في تِلْكَ الْفَتْرَةِ الزَّمَنِيَّةِ، حَيْثُ يُرَجِّحُ الْعُلَماءُ أَنَّهُ كانَ مِنَ الصَّعْبِ عَلَى النّاسِ آنَذاكَ أَنْ يُقيموا لِوَقْتٍ طَويلٍ في الْمَناطِقِ الدّاخِلِيَّةِ. وَتُشيرُ الْأَدِلَّةُ الَّتي عُثِرَ عَلَيْها إِلى أَنَّ سُكّانَ الْإِماراتِ قَدْ طَوَّروا طُقوسًا يَتِمُّ فيها تَقاسُمُ الْغِذاءِ مَعَ مَجْموعاتٍ سُكّانِيَّةٍ أُخْرى، وَهٰكَذا تَعاوَنَتِ الْمُجْتَمَعاتُ مَعَ بَعْضِها مِنْ أَجْلِ تَجاوُزِ الْمِحَنِ؛ وَبَقِيَ ذٰلِكَ التَّضامُنُ الِاجْتِماعِيُّ جُزْءًا مُهِمًّا مِنْ مُجْتَمَعِ الْإِماراتِ.', 'ص 13–22', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T1-L03/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 1, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يُسَمّي الْعُلَماءُ الْحِقْبَةَ الْمُمْتَدَّةَ مِنْ نَحْوِ 8000 إِلى 3000 ق.م:','[{"id": "a", "text": "الْعَصْرَ الْحَجَرِيَّ الْحَديثَ"}, {"id": "b", "text": "الْحِقْبَةَ الْميوسينِيَّةَ"}, {"id": "c", "text": "الْعَصْرَ الْبُرونْزِيَّ"}]'),('الْمَوْقِعُ الَّذي عُثِرَ فيهِ عَلى مَقْبَرَةٍ ضَخْمَةٍ وَمَواقِدَ في الشّارِقَةِ:','[{"id": "a", "text": "جَبَلُ بُحَيْصٍ"}, {"id": "b", "text": "جَزيرَةُ دَلْما"}, {"id": "c", "text": "مِنْطَقَةُ عَوافي"}]'),('يُمارِسُ سُكّانُ الْإِماراتِ الْغَوْصَ بَحْثًا عَنِ اللُّؤْلُؤِ مُنْذُ نَحْوِ:','[{"id": "a", "text": "7,000 سَنَةٍ"}, {"id": "b", "text": "700 سَنَةٍ"}, {"id": "c", "text": "70 سَنَةً"}]'),('الْأَرْضُ الْخَصْبَةُ بَيْنَ دِجْلَةَ وَالْفُراتِ تُسَمّى:','[{"id": "a", "text": "بِلادَ ما بَيْنَ النَّهْرَيْنِ"}, {"id": "b", "text": "بِلادَ الشّامِ"}, {"id": "c", "text": "شِبْهَ الْجَزيرَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 5, 7, 2, 2, 'الْوَحْدَةُ الثّانِيَةُ: الْعَصْرُ الْبِرونْزِيُّ — واحاتٌ وَحَضارَةٌ وَتَغْييرٌ', true, 'native'
where not exists (select 1 from units where subject_id=5 and year_group=7 and term=2
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=5 and year_group=7 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'EH-Y7-T2-L04', 'بِدايَةُ الْعَصْرِ الْبِرونْزِيِّ وَظُهورُ الْواحاتِ', 3, 'ص 23–32', true, '🎯 أَسْتَنْتِجُ كَيْفَ غَيَّرَ تَغَيُّرُ الْمُناخِ حَياةَ النّاسِ، فَظَهَرَتِ الْواحاتُ وَالزِّراعَةُ وَالتِّجارَةُ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَتى بَدَأَ الْعَصْرُ الْبِرونْزِيُّ وَلِمَ سُمِّيَتْ حِقْبَتُهُ الْأولى بِـ«حَفيتٍ».',1),('أُوَضِّحُ ما تَدُلُّ عَلَيْهِ الْأَواني الْمُكْتَشَفَةُ في مَدافِنِ حَفيتٍ.',2),('أَرْبِطُ بَيْنَ نُدْرَةِ الْأَمْطارِ وَحَفْرِ الْآبارِ وَنَشْأَةِ الْواحاتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'بِدايَةُ الْعَصْرِ الْبِرونْزِيِّ وَظُهورُ الْواحاتِ', 'في الْوَقْتِ الْحاضِرِ يَبْلُغُ مُعَدَّلُ هُطولِ الْأَمْطارِ في دَوْلَةِ الْإِماراتِ نَحْوَ مِئَةِ مِلِّيمِتْرٍ سَنَوِيًّا، وَيَحْدُثُ مُعْظَمُ هٰذِهِ الْهُطولاتِ الْمَطَرِيَّةِ خِلالَ شُهورِ الشِّتاءِ. وَعَلَى الرَّغْمِ مِنْ وُجودِ بَعْضِ الِاخْتِلافِ في مُعَدَّلِ هُطولِ الْأَمْطارِ بَيْنَ أَجْزاءِ الدَّوْلَةِ الْمُخْتَلِفَةِ، فَإِنَّ مَناخَها يُوصَفُ عُمومًا بِأَنَّهُ صَحْراوِيٌّ. وَبِالنِّسْبَةِ لِلنّاسِ الَّذينَ عاشوا في الْمِنْطَقَةِ قَديمًا خَلَقَتْ نُدْرَةُ الْأَمْطارِ صُعوباتٍ كَثيرَةً، وَمِنْ أَبْرَزِها اسْتِحالَةُ زِراعَةِ الْمَحاصيلِ الْحَقْلِيَّةِ إِلّا إِذا بَلَغَ مُعَدَّلُ الْأَمْطارِ نَحْوَ ثَلاثِمِئَةِ مِلِّيمِتْرٍ سَنَوِيًّا، وَهٰذا ما لا يَحْصُلُ في دَوْلَةِ الْإِماراتِ.', 'ص 23–32', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T2-L04/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('سُمِّيَتْ حِقْبَةُ حَفيتٍ بِهٰذا الِاسْمِ نِسْبَةً إِلى:','[{"id": "a", "text": "جَبَلٍ قُرْبَ مَدينَةِ الْعَيْنِ"}, {"id": "b", "text": "نَهْرٍ في الْعِراقِ"}, {"id": "c", "text": "جَزيرَةٍ في أَبوظَبي"}]'),('أَقْدَمُ دَليلٍ عَلى زِراعَةِ الْمَحاصيلِ في الْإِماراتِ في مَوْقِعِ:','[{"id": "a", "text": "هيلي 8 بِالْعَيْنِ"}, {"id": "b", "text": "جَبَلِ الْفايَةِ"}, {"id": "c", "text": "أُمِّ النّارِ"}]'),('يَبْلُغُ مُعَدَّلُ هُطولِ الْأَمْطارِ في الدَّوْلَةِ نَحْوَ:','[{"id": "a", "text": "100 مِلِّيمِتْرٍ سَنَوِيًّا"}, {"id": "b", "text": "300 مِلِّيمِتْرٍ سَنَوِيًّا"}, {"id": "c", "text": "700 مِلِّيمِتْرٍ سَنَوِيًّا"}]'),('السّائِلُ الَّذي يُصْنَعُ مِنَ التَّمْرِ يُسَمّى:','[{"id": "a", "text": "الدِّبْسَ"}, {"id": "b", "text": "الْعَريشَ"}, {"id": "c", "text": "الْفَلَجَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=5 and year_group=7 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'EH-Y7-T2-L05', 'حَضارَةُ أُمِّ النّارِ', 3, 'ص 33–42', true, '🎯 أَسْتَنْتِجُ مَلامِحَ حَضارَةِ أُمِّ النّارِ مِنْ مَدافِنِها وَتِجارَتِها وَسُفُنِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ زَمَنَ حَضارَةِ أُمِّ النّارِ وَسَبَبَ تَسْمِيَتِها.',1),('أُوَضِّحُ مَكانَةَ النُّحاسِ وَاسْمَ «مَجانَ» في تِجارَةِ تِلْكَ الْحِقْبَةِ.',2),('أَسْتَنْتِجُ مِنْ شَكْلِ الْمَدافِنِ ما يَدُلُّ عَلى طَبيعَةِ الْمُجْتَمَعِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'حَضارَةُ أُمِّ النّارِ', 'مِنْ أَبْرَزِ الْمَعالِمِ الْأَثَرِيَّةِ الَّتي كانَتْ تَتَمَيَّزُ بِها حَضارَةُ أُمِّ النّارِ الْمَدافِنُ الدّائِرِيَّةُ الضَّخْمَةُ الَّتي عُثِرَ عَلَيْها عَلَى السّاحِلِ وَفي الدّاخِلِ وَفي مُخْتَلَفِ أَنْحاءِ الْإِماراتِ. بُنِيَتْ هٰذِهِ الْمَدافِنُ مِنْ كُتَلٍ حَجَرِيَّةٍ اقْتُلِعَتْ مِنَ الْجِبالِ. وَرَغْمَ اخْتِلافِها في الْحَجْمِ، يَتَراوَحُ قُطْرُ مُعْظَمِ هٰذِهِ الْمَدافِنِ بَيْنَ خَمْسَةٍ وَعَشَرَةِ أَمْتارٍ، تَحْمِلُ بَعْضُ تِلْكَ الْأَحْجارِ الضَّخْمَةِ رُسومًا وَأَشْكالًا مَنْقوشَةً عَلى سَطْحِها الْخارِجِيِّ. وَيُمْكِنُ مُشاهَدَةُ ذٰلِكَ في الْمَدْفَنِ الْكَبيرِ الْكائِنِ في مَوْقِعِ الْهيلي في الْعَيْنِ.', 'ص 33–42', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T2-L05/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('امْتَدَّتْ حَضارَةُ أُمِّ النّارِ مِنْ:','[{"id": "a", "text": "2500 إِلى 2000 ق.م"}, {"id": "b", "text": "3000 إِلى 2500 ق.م"}, {"id": "c", "text": "1000 إِلى 500 ق.م"}]'),('الِاسْمُ الَّذي أَطْلَقَهُ أَهْلُ الْعِراقِ الْقَديمُ عَلى أَرْضِنا هُوَ:','[{"id": "a", "text": "مَجانُ"}, {"id": "b", "text": "التيثِسُ"}, {"id": "c", "text": "غُنْدُوانا"}]'),('كانَ عِمادُ تِجارَةِ تِلْكَ الْحِقْبَةِ مَعْدِنَ:','[{"id": "a", "text": "النُّحاسِ"}, {"id": "b", "text": "الْحَديدِ"}, {"id": "c", "text": "الْأَلومِنْيومِ"}]'),('يَتَراوَحُ قُطْرُ مُعْظَمِ مَدافِنِ أُمِّ النّارِ بَيْنَ:','[{"id": "a", "text": "5 وَ10 أَمْتارٍ"}, {"id": "b", "text": "30 وَ40 مِتْرًا"}, {"id": "c", "text": "50 سَنْتيمِتْرًا وَمِتْرٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=5 and year_group=7 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'EH-Y7-T2-L06', 'زَمَنُ التَّغْييرِ', 3, 'ص 43–50', true, '🎯 أُفَسِّرُ تَفْسيرَيِ الْعُلَماءِ لِنِهايَةِ حَضارَةِ أُمِّ النّارِ، وَأَصِفُ ما تَغَيَّرَ بَعْدَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ مَتَى انْتَهَتْ حَضارَةُ أُمِّ النّارِ وَما اسْمُ الْمَرْحَلَةِ الَّتي تَلَتْها.',1),('أُقارِنُ بَيْنَ تَفْسيرِ تَراجُعِ التِّجارَةِ وَتَفْسيرِ تَغَيُّرِ الْمُناخِ.',2),('أَصِفُ التَّغَيُّرَ في الْمَدافِنِ وَالْأَواني وَالْأَسْلِحَةِ بَعْدَ 2000 ق.م.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'زَمَنُ التَّغْييرِ', 'ظَلَّتِ التَّغَيُّراتُ الْكَبيرَةُ الَّتي حَدَثَتْ حَوالَيْ عامِ 2000 ق.م لُغْزًا حَيَّرَ عُلَماءَ الْآثارِ لِسَنَواتٍ عَديدَةٍ، فَقَدْ هَجَرَ النّاسُ الْقُرى وَالْبَلَداتِ الَّتي قَطَنوا فيها أَثْناءَ فَتْرَةِ أُمِّ النّارِ. وَقَدْ رَجَّحَ الْعُلَماءُ سَبَبَيْنِ رَئيسَيْنِ وَراءَ تِلْكَ الْهِجْرَةِ: الْأَوَّلُ هُوَ تَراجُعُ التِّجارَةِ الَّتي كانَتْ تَرْبِطُ الْإِماراتِ مَعَ بِلادِ ما بَيْنَ النَّهْرَيْنِ وَالْخَليجِ الْعَرَبِيِّ وَجَنوبِ آسِيا. وَالثّاني هُوَ تَغَيُّرُ الْمُناخِ؛ إِذْ يَعْتَقِدُ بَعْضُ عُلَماءِ الْآثارِ أَنَّ التَّغَيُّراتِ في مُعَدَّلِ هُطولِ الْأَمْطارِ مَنَعَتِ السُّكّانَ مِنْ مُواصَلَةِ زِراعَةِ الْمَحاصيلِ.', 'ص 43–50', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T2-L06/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('انْتَهَتْ حَضارَةُ أُمِّ النّارِ نَحْوَ عامِ:','[{"id": "a", "text": "2000 ق.م"}, {"id": "b", "text": "3000 ق.م"}, {"id": "c", "text": "500 ق.م"}]'),('اسْمُ الْمَرْحَلَةِ الَّتي تَلَتْ حَضارَةَ أُمِّ النّارِ:','[{"id": "a", "text": "فَتْرَةُ وادي سوقٍ"}, {"id": "b", "text": "حِقْبَةُ حَفيتٍ"}, {"id": "c", "text": "الْعَصْرُ الْحَجَرِيُّ"}]'),('سَبيكَةُ الذَّهَبِ وَالْفِضَّةِ تُسَمّى:','[{"id": "a", "text": "الْإِلِكْتْروم"}, {"id": "b", "text": "الْبِرونْزَ"}, {"id": "c", "text": "النُّحاسَ"}]'),('تَفْسيرا نِهايَةِ حَضارَةِ أُمِّ النّارِ هُما:','[{"id": "a", "text": "تَراجُعُ التِّجارَةِ وَتَغَيُّرُ الْمُناخِ"}, {"id": "b", "text": "الْحَرْبُ وَالزِّلْزالُ"}, {"id": "c", "text": "الطّاعونُ وَالْفَيَضانُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 5, 7, 3, 3, 'الْوَحْدَةُ الثّالِثَةُ: الْفَلَجُ وَالْإِبِلُ وَقِيامُ الْإِمْبِراطورِيّاتِ', true, 'native'
where not exists (select 1 from units where subject_id=5 and year_group=7 and term=3
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=5 and year_group=7 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 7, 'EH-Y7-T3-L07', 'الْفَلَجُ وَنُمُوُّ الْقُرى وَالْمُدُنِ', 3, 'ص 51–58', true, '🎯 أُفَسِّرُ كَيْفَ أَتاحَ ابْتِكارُ الْفَلَجِ نُمُوَّ الْقُرى وَالْمُدُنِ في أَرْضِ الْإِماراتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُعَرِّفُ الْفَلَجَ وَأَصِفُ طَريقَةَ عَمَلِهِ.',1),('أُبَيِّنُ لِمَ عُدَّ الْفَلَجُ مِفْتاحَ فَهْمِ الْعَصْرِ الْحَديدِيِّ في الْإِماراتِ.',2),('أَصِفُ مَلامِحَ الْمُدُنِ وَالْبُيوتِ وَالْحِرَفِ الَّتي نَشَأَتْ مَعَ الْفَلَجِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْفَلَجُ وَنُمُوُّ الْقُرى وَالْمُدُنِ', 'الْفَلَجُ تِقْنِيَةٌ لِسَحْبِ الْمِياهِ الْجَوْفِيَّةِ وَرَفْعِها إِلَى السَّطْحِ مِنْ خِلالِ نَفَقٍ طَويلٍ، وَيُمْكِنُ اسْتِخْدامُ مِياهِ الْأَفْلاجِ لِأَغْراضِ الشُّرْبِ وَزِراعَةِ الْمَحاصيلِ. وَقَدْ كَشَفَتْ أَعْمالُ التَّنْقيبِ الَّتي أَجْراها عُلَماءُ الْآثارِ الْإِماراتِيّونَ في الْعَيْنِ عَنْ وُجودِ الْعَديدِ مِنَ الْأَفْلاجِ الَّتي تَعودُ إِلى عامِ أَلْفٍ قَبْلَ الْميلادِ، وَتُعْتَبَرُ هٰذِهِ الْأَفْلاجُ الْأَقْدَمَ في الْعالَمِ حَتّى هٰذِهِ اللَّحْظَةِ. وَلَيْسَ مِنَ الْمُسْتَغْرَبِ أَنْ يَكونَ سُكّانُ الْإِماراتِ هُمْ أَوَّلَ مَنْ طَوَّرَ الْفَلَجَ؛ فَقَدْ قَطَنوا هٰذِهِ الْمِنْطَقَةَ الْقاحِلَةَ لِآلافِ السِّنينَ، وَعَرَفوا مَواقِعَ الْمِياهِ الْجَوْفِيَّةِ.', 'ص 51–58', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T3-L07/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْفَلَجُ تِقْنِيَةٌ لِـ:','[{"id": "a", "text": "سَحْبِ الْمِياهِ الْجَوْفِيَّةِ عَبْرَ نَفَقٍ"}, {"id": "b", "text": "تَخْزينِ مِياهِ الْمَطَرِ في خَزّانٍ"}, {"id": "c", "text": "تَحْلِيَةِ مِياهِ الْبَحْرِ"}]'),('تَعودُ أَقْدَمُ الْأَفْلاجِ الْمُكْتَشَفَةِ في الْعَيْنِ إِلى عامِ:','[{"id": "a", "text": "1000 ق.م"}, {"id": "b", "text": "2500 ق.م"}, {"id": "c", "text": "300 م"}]'),('تَمْتَدُّ الْفَتْرَةُ الْمُسَمّاةُ بِالْعَصْرِ الْحَديدِيِّ مِنْ:','[{"id": "a", "text": "1300 إِلى 300 ق.م"}, {"id": "b", "text": "3000 إِلى 2500 ق.م"}, {"id": "c", "text": "2000 إِلى 1600 ق.م"}]'),('مادَّةُ الْبِناءِ الَّتي تُسَدُّ بِها الْفَراغاتُ بَيْنَ الْأَحْجارِ تُسَمّى:','[{"id": "a", "text": "الْمَلاطَ"}, {"id": "b", "text": "الْفَلَجَ"}, {"id": "c", "text": "الْعَريشَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=5 and year_group=7 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 8, 'EH-Y7-T3-L08', 'الْإِبِلُ وَتَحَوُّلُ الصَّحْراءِ', 3, 'ص 59–66', true, '🎯 أَسْتَنْتِجُ أَثَرَ تَدْجينِ الْإِبِلِ في تِجارَةِ الْإِماراتِ وَحَياةِ أَهْلِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَرِّقُ بَيْنَ الْإِبِلِ الْبَرِّيَّةِ وَالْمُدَجَّنَةِ وَالْوَحْشِيَّةِ.',1),('أُبَيِّنُ فائِدَتَيْنِ كَبيرَتَيْنِ لِتَدْجينِ الْإِبِلِ.',2),('أَرْبِطُ بَيْنَ تَدْجينِ الْإِبِلِ وَاتِّساعِ التِّجارَةِ وَنُشوءِ قُرًى كَمُوَيْلِحَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الْإِبِلُ وَتَحَوُّلُ الصَّحْراءِ', 'ما إِنْ بَدَأَتْ تَرْبِيَةُ الْإِبِلِ في أَرْضِ الْإِماراتِ حَتّى غَيَّرَتْ حَياةَ سُكّانِها إِلَى الْأَبَدِ. أَوَّلًا، كانَتِ الْإِبِلُ مَصْدَرًا لِلْحَليبِ الَّذي كانوا يَحْتاجونَهُ، وَقَدْ قَدَّمَتْ كَمِّيّاتٍ مِنْهُ أَكْبَرَ بِكَثيرٍ مِمّا قَدَّمَتْهُ الْأَغْنامُ أَوِ الْماعِزُ. ثانِيًا، تَسْتَطيعُ الْإِبِلُ أَنْ تَعيشَ في الصَّحْراءِ وَتَكْبُرَ فيها؛ فَمُنْذُ آلافِ السِّنينَ تَرَكَّزَتْ حَياةُ النّاسِ في الْواحاتِ الدّاخِلِيَّةِ مِثْلَ الْعَيْنِ، وَفي الْجِبالِ، أَوْ عَلَى السّاحِلِ. لٰكِنْ بَعْدَ تَدْجينِ الْإِبِلِ أَصْبَحوا قادِرينَ عَلَى الْعَيْشِ في الصَّحْراءِ وَاسْتِغْلالِ مَوارِدِها.', 'ص 59–66', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T3-L08/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('كانَتِ الْإِبِلُ الْمُدَجَّنَةُ مَوْجودَةً في أَرْضِ الْإِماراتِ بِحُلولِ عامِ:','[{"id": "a", "text": "1000 ق.م"}, {"id": "b", "text": "3000 ق.م"}, {"id": "c", "text": "500 م"}]'),('الْحَيَوانُ الْمُدَجَّنُ الَّذي عادَ إِلَى الْحَياةِ الْبَرِّيَّةِ يُسَمّى:','[{"id": "a", "text": "وَحْشِيًّا"}, {"id": "b", "text": "بَرِّيًّا"}, {"id": "c", "text": "أَليفًا"}]'),('أَوَّلُ فَوائِدِ الْإِبِلِ الَّتي ذَكَرَها الْكِتابُ:','[{"id": "a", "text": "الْحَليبُ"}, {"id": "b", "text": "الصّوفُ"}, {"id": "c", "text": "الْحِراثَةُ"}]'),('قَرْيَةُ مُوَيْلِحَ تَقَعُ في إِمارَةِ:','[{"id": "a", "text": "الشّارِقَةِ"}, {"id": "b", "text": "الْفُجَيْرَةِ"}, {"id": "c", "text": "عَجْمانَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=5 and year_group=7 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 9, 'EH-Y7-T3-L09', 'قِيامُ الْإِمْبِراطورِيّاتِ', 3, 'ص 67–76', true, '🎯 أُقَوِّمُ ما تَقولُهُ النُّصوصُ الْقَديمَةُ عَنْ عَلاقَةِ الْإِمْبِراطورِيّاتِ بِأَرْضِ الْإِماراتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُسَمّي الْإِمْبِراطورِيّاتِ الثَّلاثَ الَّتي اتَّجَهَتْ أَنْظارُها نَحْوَ الْخَليجِ الْعَرَبِيِّ.',1),('أُبَيِّنُ لِمَ لا تَعْني الْإِشاراتُ الْمَوْجَزَةُ سَيْطَرَةً فِعْلِيَّةً عَلى أَرْضِنا.',2),('أُفَسِّرُ لِمَ ظَلَّ النُّحاسُ وَالتِّجارَةُ سَبَبَ اهْتِمامِ الْإِمْبِراطورِيّاتِ بِالْمِنْطَقَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'قِيامُ الْإِمْبِراطورِيّاتِ', 'لا تَعْني الْإِشاراتُ الْمَوْجَزَةُ الْوارِدَةُ في النُّصوصِ التّاريخِيَّةِ أَنَّ الْإِمْبِراطورِيَّةَ الْآشورِيَّةَ قَدْ بَسَطَتْ سَيْطَرَتَها عَلى أَيِّ جُزْءٍ مِنَ الْإِماراتِ أَوْ مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ في ذٰلِكَ الْوَقْتِ، إِنَّما تُشيرُ إِلى أَنَّ سُكّانَ هٰذِهِ الْمَناطِقِ كانوا يَعْمَلونَ بِالتِّجارَةِ عَبْرَ الْخَليجِ الْعَرَبِيِّ. وَكانَ لِلنُّحاسِ الْمُسْتَوْرَدِ مِنَ الْإِماراتِ أَهَمِّيَّةٌ خاصَّةٌ؛ إِذْ ظَلَّ النُّحاسُ سِلْعَةً حَيَوِيَّةً عَلَى الرَّغْمِ مِنْ أَنَّ اسْتِخْدامَ الْحَديدِ كانَ يَزْدادُ انْتِشارًا في جَميعِ أَنْحاءِ الشَّرْقِ الْأَوْسَطِ.', 'ص 67–76', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/EH-Y7-T3-L09/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 5, 7, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('سَقَطَتِ الْإِمْبِراطورِيَّةُ الْآشورِيَّةُ عامَ:','[{"id": "a", "text": "612 ق.م"}, {"id": "b", "text": "539 ق.م"}, {"id": "c", "text": "330 ق.م"}]'),('الِاسْمُ الَّذي أَطْلَقَهُ مُلوكُ الْفُرْسِ عَلى مِنْطَقَةِ الْإِماراتِ:','[{"id": "a", "text": "ماكا"}, {"id": "b", "text": "مَجانُ"}, {"id": "c", "text": "دِلْمونُ"}]'),('أَسَّسَ الْإِمْبِراطورِيَّةَ الْفارِسِيَّةَ الْمَلِكُ:','[{"id": "a", "text": "قورَشُ"}, {"id": "b", "text": "سِنْحاريبُ"}, {"id": "c", "text": "داريوسُ"}]'),('الْإِشاراتُ الْمَوْجَزَةُ في النُّصوصِ الْآشورِيَّةِ تَدُلُّ عَلى:','[{"id": "a", "text": "عَمَلِ السُّكّانِ بِالتِّجارَةِ"}, {"id": "b", "text": "سَيْطَرَةِ آشورَ عَلَى الْإِماراتِ"}, {"id": "c", "text": "هِجْرَةِ أَهْلِ الْإِماراتِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
