begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 6, 'الْوَحْدَةُ السّادِسَةُ: الْحُقوقُ وَالْواجِباتُ الْإِلِكْتْرونِيَّةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=6 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L20', 'الرُّؤْيَةُ الْأولى: الْوُصولُ الْعادِلُ لِلْمَعْلوماتِ وَالتَّغَلُّبُ عَلَى الْفَجْوَةِ الرَّقْمِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 14–16', true, '🎯 أُبَيِّنُ فائِدَةَ الْمَعْلوماتِ الرَّقْمِيَّةِ عَلَى الصَّعيدِ الِاجْتِماعِيِّ، وَأُقَيِّمُ طَرائِقَ الْوُصولِ إِلَى الْإِنْتَرْنِتْ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ الْوُصولَ، وَيَذْكُرُ نِسْبَةَ مُسْتَخْدِمي الْإِنْتَرْنِتْ في دَوْلَةِ الْإِماراتِ وَفي الْعالَمِ.',1),('يُبَيِّنُ فائِدَةَ اسْتِخْدامِ الْمَعْلوماتِ الرَّقْمِيَّةِ عَلَى الصَّعيدِ الِاجْتِماعِيِّ، وَيُعَدِّدُ أَماكِنَ الْحُصولِ عَلَى اتِّصالٍ بِالْإِنْتَرْنِتْ.',2),('يُقَيِّمُ طَرائِقَ الْوُصولِ إِلَى الْإِنْتَرْنِتْ بِخَصائِصِها وَعُيوبِها، وَيَخْتارُ أَنْسَبَها لِحاجَتِهِ مُعَلِّلًا.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْوُصولُ الْعادِلُ لِلْمَعْلوماتِ وَالتَّغَلُّبُ عَلَى الْفَجْوَةِ الرَّقْمِيَّةِ', 'كَما تُمَكِّنُ الْأَفْرادَ مِنَ الْحُصولِ عَلَى الْمَعْلوماتِ في أَيِّ زَمانٍ وَمَكانٍ وَحَوْلَ أَيِّ مَوْضوعٍ يُمْكِنُهُمُ اسْتِغْلالُهُ لِتَطْويرِ أَنْفُسِهِمُ اجْتِماعِيًّا وَثَقافِيًّا وَاقْتِصادِيًّا. (كِتابُ النَّشاطِ، ص 14)', 'كِتابُ النَّشاطِ ص 14–16', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L20/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ مُسْتَخْدِمي الْإِنْتَرْنِتْ في الْإِماراتِ عامَ 2020م لِكُلِّ 100 نَسَمَةٍ:','[{"id": "a", "text": "99"}, {"id": "b", "text": "50"}, {"id": "c", "text": "62"}]'),('الطَّريقَةُ الْأَقْدَمُ لِلْوُصولِ إِلَى الْإِنْتَرْنِتْ:','[{"id": "a", "text": "الْمودِمُ"}, {"id": "b", "text": "الْواي فاي"}, {"id": "c", "text": "الْهاتِفُ الذَّكِيُّ"}]'),('مِنْ مَشاريعِ الْإِماراتِ الرِّيادِيَّةِ لِلتَّغَلُّبِ عَلَى الْفَجْوَةِ الرَّقْمِيَّةِ:','[{"id": "a", "text": "الْمَدينَةُ الذَّكِيَّةُ في دُبَيٍّ 2014م"}, {"id": "b", "text": "مَقاهِي الْإِنْتَرْنِتْ"}, {"id": "c", "text": "الْمودِمُ الْمُدْمَجُ"}]'),('مِنْ مَزايا الْهَواتِفِ الْمَحْمولَةِ لِلِاتِّصالِ بِالْإِنْتَرْنِتْ:','[{"id": "a", "text": "التَّكاليفُ الزَّهيدَةُ وَسُهولَةُ الْحَمْلِ"}, {"id": "b", "text": "الْحاجَةُ إِلى مَكْتَبٍ ثابِتٍ"}, {"id": "c", "text": "ارْتِفاعُ ثَمَنِها عَنِ الْحاسوبِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L21', 'الرُّؤْيَةُ الثّانِيَةُ: تَكافُؤُ الْفُرَصِ لِأَصْحابِ الْهِمَمِ وَمَسْؤولِيّاتُنا الرَّقْمِيَّةُ', 3, 'كِتابُ النَّشاطِ ص 17–20', true, '🎯 أُسَجِّلُ الصُّعوباتِ الَّتي تُواجِهُ أَصْحابَ الْهِمَمِ وَحُلولَها، وَأُوَضِّحُ مَسْؤولِيّاتي عِنْدَ مُشارَكَةِ الْمَعْلوماتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَذْكُرُ الْفِئاتِ الْأَرْبَعَ لِأَصْحابِ الْهِمَمِ في الْوُصولِ إِلَى الْمَعْلوماتِ، وَجِهودَ وِزارَةِ تَمْكينِ الْمُجْتَمَعِ.',1),('يَرْبِطُ كُلَّ نَوْعٍ مِنَ الصُّعوباتِ بِالْحُلولِ الْمُناسِبَةِ لَهُ، وَيُعَدِّدُ صُوَرَ إِساءَةِ اسْتِخْدامِ الْمَرافِقِ الرَّقْمِيَّةِ.',2),('يُوَضِّحُ الْمَسْؤولِيّاتِ الَّتي تَتَرَتَّبُ عَلَيْهِ عِنْدَ مُشارَكَةِ الْمَعْلوماتِ وَالْمَعْرِفَةِ، وَيَلْتَزِمُ بِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: تَكافُؤُ الْفُرَصِ لِأَصْحابِ الْهِمَمِ وَمَسْؤولِيّاتُنا الرَّقْمِيَّةُ', 'عَدَمُ إِطْلاقِ الْأَحْكامِ عَلَى الْآخَرينَ مِنْ خِلالِ الْمُدَوَّناتِ وَمَواقِعِ الْإِنْتَرْنِتْ وَالْبَوّاباتِ الِاجْتِماعِيَّةِ؛ لِأَنَّ هٰذا مِنْ شَأْنِهِ إِثارَةُ الْمَشاعِرِ السَّلْبِيَّةِ. (كِتابُ النَّشاطِ، ص 19)', 'كِتابُ النَّشاطِ ص 17–20', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L21/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْحَلُّ الْمُناسِبُ لِأَصْحابِ التَّحَدِّياتِ الْحَرَكِيَّةِ:','[{"id": "a", "text": "اسْتِخْدامُ اخْتِصاراتِ لَوْحَةِ الْمَفاتيحِ"}, {"id": "b", "text": "إِدْراجُ أَشْكالٍ مَرْئِيَّةٍ"}, {"id": "c", "text": "زِيادَةُ حَجْمِ الصَّوْتِ"}]'),('الْجِهَةُ الَّتي تَضَعُ إِسْتِراتيجِيّاتٍ لِتَمْكينِ أَصْحابِ الْهِمَمِ مِنَ الْمَعْرِفَةِ:','[{"id": "a", "text": "وِزارَةُ تَمْكينِ الْمُجْتَمَعِ"}, {"id": "b", "text": "الْمَقاهي"}, {"id": "c", "text": "الْمَطاراتُ"}]'),('مِنْ صُوَرِ تَقْديرِ الْمَرافِقِ الرَّقْمِيَّةِ:','[{"id": "a", "text": "عَدَمُ تَحْميلِ مَلَفّاتٍ ضَخْمَةٍ في ساعاتِ الذُّرْوَةِ"}, {"id": "b", "text": "اخْتِراقُ الشَّبَكاتِ"}, {"id": "c", "text": "نَشْرُ الْمُحْتَوَياتِ"}]'),('مِنَ الْمَسْؤولِيّاتِ عِنْدَ مُشارَكَةِ الْمَعْلوماتِ:','[{"id": "a", "text": "عَدَمُ نَشْرِ الْأَخْبارِ الْمُضَلِّلَةِ"}, {"id": "b", "text": "إِطْلاقُ الْأَحْكامِ عَلَى الْآخَرينَ"}, {"id": "c", "text": "نَقْلُ كُلِّ ما يَصِلُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 7, 'الْوَحْدَةُ السّابِعَةُ: الثَّوْرَةُ الرَّقْمِيَّةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=7 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=7 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L22', 'الرُّؤْيَةُ الْأولى: تَطَوُّرُ التِّقْنِيّاتِ الرَّقْمِيَّةِ وَأَدَواتُ الثَّقافَةِ الرَّقْمِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 24–25', true, '🎯 أَصِفُ تَطَوُّرَ الْأَجْهِزَةِ التَّقْليدِيَّةِ إِلى رَقْمِيَّةٍ، وَأُبَيِّنُ اسْتِخْداماتِ أَدَواتِ الثَّقافَةِ الرَّقْمِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَذْكُرُ أَمْثِلَةً عَلى تَطَوُّرِ الْأَجْهِزَةِ التَّقْليدِيَّةِ إِلى أَجْهِزَةٍ رَقْمِيَّةٍ.',1),('يُبَيِّنُ اسْتِخْداماتِ الْهَواتِفِ الْمَحْمولَةِ وَالْمُكَوِّناتِ الذَّكِيَّةِ وَتِلْفازِ الْأَقْمارِ الصِّناعِيَّةِ، وَيُعَرِّفُ الْمُكَوِّناتِ الذَّكِيَّةَ.',2),('يُقَدِّرُ أَهَمِّيَّةَ الْإِرْشاداتِ الْمُلائِمَةِ لِمَنْعِ إِساءَةِ اسْتِخْدامِ الْأَجْهِزَةِ الرَّقْمِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: تَطَوُّرُ التِّقْنِيّاتِ الرَّقْمِيَّةِ وَأَدَواتُ الثَّقافَةِ الرَّقْمِيَّةِ', 'لَقَدْ أَدَّتْ هٰذِهِ الْأَجْهِزَةُ الرَّقْمِيَّةُ ذاتُ الِاسْتِعْمالاتِ الْمُتَعَدِّدَةِ إِلى تَسْهيلِ أَنْشِطَتِنَا الْيَوْمِيَّةِ، وَلٰكِنْ دونَ الْإِرْشاداتِ الْمُلائِمَةِ فَقَدْ تَتِمُّ إِساءَةُ اسْتِخْدامِ هٰذِهِ الْأَجْهِزَةِ مِنْ قِبَلِ أَصْحابِها. (كِتابُ النَّشاطِ، ص 24)', 'كِتابُ النَّشاطِ ص 24–25', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L22/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَطَوَّرَتِ الْكُتُبُ وَالْمَراجِعُ في الْعَصْرِ الرَّقْمِيِّ لِتُصْبِحَ:','[{"id": "a", "text": "مُحَرِّكاتٍ لِلْبَحْثِ عَبْرَ الْإِنْتَرْنِتْ"}, {"id": "b", "text": "هَواتِفَ مَحْمولَةً"}, {"id": "c", "text": "أَقْمارًا صِناعِيَّةً"}]'),('التَّطْبيقاتُ الرَّقْمِيَّةُ الصَّغيرَةُ الَّتي تَعْتَمِدُ عَلَى الْحاسوبِ هِيَ:','[{"id": "a", "text": "الْمُكَوِّناتُ الذَّكِيَّةُ"}, {"id": "b", "text": "الْمودِمُ"}, {"id": "c", "text": "مِنَصّاتُ الْأَلْعابِ"}]'),('تُسْتَخْدَمُ بِطاقَةُ الْهُوِيَّةِ الْإِماراتِيَّةُ وَثيقَةَ سَفَرٍ لِلتَّنَقُّلِ بَيْنَ:','[{"id": "a", "text": "دُوَلِ مَجْلِسِ التَّعاوُنِ"}, {"id": "b", "text": "دُوَلِ الْعالَمِ كُلِّها"}, {"id": "c", "text": "الْإِماراتِ السَّبْعِ فَقَطْ"}]'),('يَسْتَخْدِمُ الْعُلَماءُ الْمُكَوِّناتِ الذَّكِيَّةَ في:','[{"id": "a", "text": "تَتَبُّعِ حَرَكَةِ الْحيتانِ في الْمُحيطاتِ"}, {"id": "b", "text": "تَحْليَةِ الْمِياهِ"}, {"id": "c", "text": "زِراعَةِ الْقَمْحِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=7 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L23', 'الرُّؤْيَةُ الثّانِيَةُ: تَطْبيقاتُ الثَّقافَةِ الرَّقْمِيَّةِ وَالتَّطْبيقاتُ عَبْرَ الْإِنْتَرْنِتْ', 3, 'كِتابُ النَّشاطِ ص 26–30', true, '🎯 أُعَرِّفُ تَطْبيقاتِ الثَّقافَةِ الرَّقْمِيَّةِ، وَأُوَضِّحُ أَهَمِّيَّةَ الْحُكومَةِ الْإِلِكْتْرونِيَّةِ وَالتَّعَلُّمِ الْإِلِكْتْرونِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ وِيبْ 2.0 وَالرَّسائِلَ الْفَوْرِيَّةَ وَمَواقِعَ التَّواصُلِ الِاجْتِماعِيِّ وَالتَّعَلُّمَ الْإِلِكْتْرونِيَّ.',1),('يُوَضِّحُ أَهَمِّيَّتَيْنِ لِكُلٍّ مِنْ مَواقِعِ التَّواصُلِ، وَالْبَوّاباتِ الْحُكومِيَّةِ، وَالتَّعَلُّمِ الْإِلِكْتْرونِيِّ.',2),('يَصِفُ الطَّريقَةَ الْأَخْلاقِيَّةَ لِاسْتِخْدامِ الرَّسائِلِ الْفَوْرِيَّةِ، وَيَنْصَحُ مَنْ يَنْشُرُ الشّائِعاتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: تَطْبيقاتُ الثَّقافَةِ الرَّقْمِيَّةِ وَالتَّطْبيقاتُ عَبْرَ الْإِنْتَرْنِتْ', 'يُتيحُ التَّحَوُّلُ مِنْ صُفوفِ الدِّراسَةِ التَّقْليدِيَّةِ إِلَى التَّعَلُّمِ الْإِلِكْتْرونِيِّ تَجْرِبَةً تَعْليمِيَّةً مُمْتِعَةً تُمَكِّنُ الطّالِبَ وَالْمُعَلِّمَ عَلى حَدٍّ سَواءٍ مِنَ الِاسْتِفادَةِ مِنَ الْأَدَواتِ وَالْمَهاراتِ الْجَديدَةِ. (كِتابُ النَّشاطِ، ص 28)', 'كِتابُ النَّشاطِ ص 26–30', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L23/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْجيلُ الثّاني مِنَ الْإِنْتَرْنِتْ الَّذي يُنْشِئُ فيهِ الْمُسْتَخْدِمونَ الْمُحْتَوى:','[{"id": "a", "text": "وِيبْ 2.0"}, {"id": "b", "text": "الْمودِمُ"}, {"id": "c", "text": "الْبَثُّ الرَّقْمِيُّ"}]'),('تُعْرَفُ الرَّسائِلُ الْفَوْرِيَّةُ غالِبًا بِالِاخْتِصارِ:','[{"id": "a", "text": "IM"}, {"id": "b", "text": "GPS"}, {"id": "c", "text": "SSL"}]'),('مِنْ خِدْماتِ الْبَوّاباتِ الْحُكومِيَّةِ عَبْرَ الْإِنْتَرْنِتْ:','[{"id": "a", "text": "دَفْعُ الرُّسومِ وَالضَّرائِبِ"}, {"id": "b", "text": "شِراءُ الْأَلْعابِ"}, {"id": "c", "text": "تَحْميلُ الْأَفْلامِ"}]'),('مِنْ أَنْظِمَةِ التَّعَلُّمِ الْإِلِكْتْرونِيِّ الْوارِدَةِ في الْكِتابِ:','[{"id": "a", "text": "مودِل وَبْلاك بورْد وَإِدْمودو"}, {"id": "b", "text": "فيسْبوك وَتْويتَر"}, {"id": "c", "text": "WPA وَWEP"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 8, 'الْوَحْدَةُ الثّامِنَةُ: التَّسَوُّقُ عَبْرَ الْإِنْتَرْنِتْ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=8 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=8 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L24', 'الرُّؤْيَةُ الْأولى: التِّجارَةُ الرَّقْمِيَّةُ وَالشِّراءُ الْآمِنُ عَبْرَ الْإِنْتَرْنِتْ', 3, 'كِتابُ النَّشاطِ ص 34–38', true, '🎯 أُعَرِّفُ التِّجارَةَ الرَّقْمِيَّةَ وَأُوازِنُ بَيْنَ مَزاياها وَعُيوبِها، وَأُطَبِّقُ طَرائِقَ حِمايَةِ نَفْسي في أَثْناءِ التَّسَوُّقِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ التِّجارَةَ الرَّقْمِيَّةَ، وَيَذْكُرُ الْمَعْلوماتِ الضَّرورِيَّةَ قَبْلَ تَنْفيذِ التَّعامُلاتِ الْمالِيَّةِ.',1),('يُسَجِّلُ ثَلاثَ طَرائِقَ لِحِمايَةِ نَفْسِهِ في أَثْناءِ التَّسَوُّقِ، وَيُحَدِّدُ الْإِجْراءاتِ عِنْدَ وُصولِ الرَّسائِلِ الِاحْتِيالِيَّةِ.',2),('يُصَمِّمُ مُخَطَّطًا ذِهْنِيًّا يُوَضِّحُ أَبْرَزَ مَزايا التِّجارَةِ الرَّقْمِيَّةِ وَعُيوبِها، وَيُناقِشُ قَراراتِ الشِّراءِ بِوَعْيٍ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: التِّجارَةُ الرَّقْمِيَّةُ وَالشِّراءُ الْآمِنُ عَبْرَ الْإِنْتَرْنِتْ', 'وَلِلْأَسَفِ، فَقَدْ تَتَسَبَّبُ عَمَلِيّاتُ الشِّراءِ عَبْرَ الْإِنْتَرْنِتْ أَحْيانًا في إِقْلاقِ الْمُشْتَري حِيالَ بَعْضِ الْأُمورِ، وَخاصَّةً في حالِ تَأَخُّرِ عَمَلِيَّةِ تَوْصيلِ الْمُنْتَجِ. (كِتابُ النَّشاطِ، ص 34)', 'كِتابُ النَّشاطِ ص 34–38', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L24/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَنْفيذُ الْأَعْمالِ التِّجارِيَّةِ الَّتي تَتَضَمَّنُ بَيْعَ وَشِراءَ الْمُنْتَجاتِ عَبْرَ الْإِنْتَرْنِتْ:','[{"id": "a", "text": "التِّجارَةُ الرَّقْمِيَّةُ"}, {"id": "b", "text": "الْحُكومَةُ الْإِلِكْتْرونِيَّةُ"}, {"id": "c", "text": "الْحَوْسَبَةُ السَّحابِيَّةُ"}]'),('لِماذا يُنْصَحُ بِاسْتِخْدامِ بِطاقَةِ الِائْتِمانِ في الدَّفْعِ؟','[{"id": "a", "text": "لِتَكونَ قادِرًا عَلى تَتَبُّعِ تَعامُلاتِكَ"}, {"id": "b", "text": "لِأَنَّها أَرْخَصُ"}, {"id": "c", "text": "لِتَجَنُّبِ الشَّحْنِ"}]'),('مِنْ نَصائِحِ الشِّراءِ عَبْرَ الْإِنْتَرْنِتْ:','[{"id": "a", "text": "ابْحَثْ عَنِ الْمَواقِعِ الَّتي تُوَفِّرُ عَمَلِيَّةَ دَفْعٍ آمِنَةً"}, {"id": "b", "text": "ثِقْ بِنَتائِجِ مُحَرِّكاتِ الْبَحْثِ"}, {"id": "c", "text": "اسْتَخْدِمِ الشَّبَكاتِ الْعامَّةَ"}]'),('قَبْلَ التَّعامُلاتِ الْمَصْرِفِيَّةِ عَبْرَ الْإِنْتَرْنِتْ يَجِبُ التَّأَكُّدُ مِنْ أَنَّ الْمَوْقِعَ:','[{"id": "a", "text": "يَسْتَخْدِمُ بْروتوكولًا آمِنًا لِلِاتِّصالِ"}, {"id": "b", "text": "يَعْرِضُ إِعْلاناتٍ كَثيرَةً"}, {"id": "c", "text": "يُقَدِّمُ خَصْمًا 50%"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 9, 'الْوَحْدَةُ التّاسِعَةُ: التِّقْنِيَةُ وَالْجَريمَةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=9 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L25', 'الرُّؤْيَةُ الْأولى: الْجَرائِمُ الْإِلِكْتْرونِيَّةُ: مَفْهومُها وَأَمْثِلَتُها', 3, 'كِتابُ النَّشاطِ ص 42–49', true, '🎯 أُعَرِّفُ الْجَرائِمَ الْإِلِكْتْرونِيَّةَ، وَأُمَيِّزُ أَنْواعَها، وَأَتَّخِذُ مَوْقِفًا أَخْلاقِيًّا مِنْها.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ الْجَرائِمَ الْإِلِكْتْرونِيَّةَ وَالتَّحَرُّشَ وَالِابْتِزازَ.',1),('يُمَيِّزُ أَنْواعَ الْجَرائِمِ الْإِلِكْتْرونِيَّةِ: التَّعَدِّيَ عَلَى الْمِلْكِيَّةِ الْفِكْرِيَّةِ، وَقَرْصَنَةَ الْبَرامِجِ، وَالْوُصولَ غَيْرَ الْمُصَرَّحِ بِهِ، وَالتَّسَلُّلَ، وَالتَّعَدِّيَ.',2),('يَتَّخِذُ مَوْقِفًا أَخْلاقِيًّا عِنْدَ التَّعَرُّضِ لِلْإِهانَةِ أَوِ الْإِساءَةِ، وَيَسْتَخْدِمُ الْمَوارِدَ الْمُشْتَرَكَةَ دونَ انْتِهاكِ حُقوقِ الْمُؤَلِّفِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْجَرائِمُ الْإِلِكْتْرونِيَّةُ: مَفْهومُها وَأَمْثِلَتُها', 'هُناكَ فِعْلِيًّا الْعَديدُ مِنَ الْجَرائِمِ الَّتي تُرْتَكَبُ في الْعالَمِ الِافْتِراضِيِّ، وَمِنْها ما تَزيدُ خُطورَتُهُ عَنْ تِلْكَ الَّتي تُرْتَكَبُ في الْعالَمِ الْحَقيقِيِّ. (كِتابُ النَّشاطِ، ص 42)', 'كِتابُ النَّشاطِ ص 42–49', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L25/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تُعْرَفُ الْجَرائِمُ الَّتي تُرْتَكَبُ بِاسْتِخْدامِ التِّقْنِيّاتِ بِـ:','[{"id": "a", "text": "الْجَرائِمِ الْإِلِكْتْرونِيَّةِ"}, {"id": "b", "text": "الْجَرائِمِ التَّقْليدِيَّةِ"}, {"id": "c", "text": "الْأَخْطاءِ التِّقْنِيَّةِ"}]'),('التَّهْديداتُ غَيْرُ الْمُبَرَّرَةِ لِلْحُصولِ عَلى مَكاسِبَ ما لَمْ تُحَقَّقْ مَطالِبُ الْفاعِلِ:','[{"id": "a", "text": "الِابْتِزازُ"}, {"id": "b", "text": "التَّسَلُّلُ"}, {"id": "c", "text": "التَّصَيُّدُ"}]'),('تَثْبيتُ نُسْخَةٍ مُرَخَّصَةٍ لِجِهازٍ واحِدٍ عَلى عِدَّةِ أَجْهِزَةٍ يُسَمّى:','[{"id": "a", "text": "قَرْصَنَةَ الْبَرامِجِ"}, {"id": "b", "text": "النَّسْخَ الِاحْتِياطِيَّ"}, {"id": "c", "text": "التَّحْديثَ التِّلْقائِيَّ"}]'),('الدُّخولُ غَيْرُ الْقانونِيِّ أَوْ غَيْرُ الْمُصَرَّحِ بِهِ إِلى مُنْشَأَةٍ أَوْ نِظامٍ:','[{"id": "a", "text": "التَّسَلُّلُ"}, {"id": "b", "text": "التَّحَرُّشُ"}, {"id": "c", "text": "الْمُطارَدَةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=9 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L26', 'الرُّؤْيَةُ الثّانِيَةُ: أَسْبابُ الْجَرائِمِ الْإِلِكْتْرونِيَّةِ وَالْحِمايَةُ مِنْها وَمِصْداقِيَّةُ الْمَصادِرِ', 3, 'كِتابُ النَّشاطِ ص 50–54', true, '🎯 أُبَيِّنُ أَسْبابَ الْجَرائِمِ الْإِلِكْتْرونِيَّةِ، وَأُوَضِّحُ طُرُقَ الْحِمايَةِ مِنَ الْوُقوعِ ضَحِيَّةً، وَأُمَيِّزُ الْمَصادِرَ الْمَوْثوقَةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَذْكُرُ أَسْبابَ ارْتِكابِ الْجَرائِمِ الْإِلِكْتْرونِيَّةِ الثَّمانِيَةَ.',1),('يُوَضِّحُ أَبْرَزَ الطُّرُقِ الَّتي تُوَفِّرُ لَهُ الْحِمايَةَ مِنَ الْوُقوعِ ضَحِيَّةً لِجَريمَةٍ إِلِكْتْرونِيَّةٍ.',2),('يُطَبِّقُ الطَّرائِقَ الشّائِعَةَ لِلتَّمْييزِ بَيْنَ الْمَصادِرِ الْجَيِّدَةِ وَالسَّيِّئَةِ عَلَى الْإِنْتَرْنِتْ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: أَسْبابُ الْجَرائِمِ الْإِلِكْتْرونِيَّةِ وَالْحِمايَةُ مِنْها وَمِصْداقِيَّةُ الْمَصادِرِ', 'فَإِنَّ إِجْراءاتِ الْحِمايَةِ الَّتي يَتِمُّ اتِّخاذُها، إِضافَةً إِلَى الْوَعْيِ عِنْدَ تَصَفُّحِ الْمَواقِعِ، يَلْعَبانِ دَوْرًا هامًّا لِضَمانِ حِمايَةِ مَعْلوماتِنَا الشَّخْصِيَّةِ. (كِتابُ النَّشاطِ، ص 51)', 'كِتابُ النَّشاطِ ص 50–54', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L26/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مِنْ أَسْبابِ ارْتِكابِ الْجَرائِمِ الْإِلِكْتْرونِيَّةِ:','[{"id": "a", "text": "الْبَحْثُ عَنِ الشُّهْرَةِ وَتَحْقيقِ سُمْعَةٍ بِالذَّكاءِ"}, {"id": "b", "text": "تَحْديثُ الْبَرامِجِ"}, {"id": "c", "text": "النَّسْخُ الِاحْتِياطِيُّ"}]'),('الطَّريقَةُ الصَّحيحَةُ لِلدُّخولِ إِلى مَوْقِعٍ وَصَلَكَ رابِطُهُ مِنْ بَريدٍ لا تَعْرِفُهُ:','[{"id": "a", "text": "كِتابَةُ اسْمِ الْمَوْقِعِ بِنَفْسِكَ في الْمُتَصَفِّحِ"}, {"id": "b", "text": "الضَّغْطُ عَلَى الرّابِطِ"}, {"id": "c", "text": "الرَّدُّ عَلَى الرِّسالَةِ"}]'),('يُنْصَحُ بِتَحْديثِ بَرْنامَجِ الْحِمايَةِ مِنَ الْفَيْروساتِ:','[{"id": "a", "text": "مَرَّةً واحِدَةً أُسْبوعِيًّا عَلَى الْأَقَلِّ"}, {"id": "b", "text": "مَرَّةً كُلَّ سَنَةٍ"}, {"id": "c", "text": "عِنْدَ شِراءِ الْجِهازِ فَقَطْ"}]'),('غالِبًا ما تُعْتَبَرُ الْمَواقِعُ الَّتي تَنْتَهي بِالنِّطاقِ الْآتي مَصْدَرًا لِلْبَياناتِ الْحُكومِيَّةِ:','[{"id": "a", "text": "gov"}, {"id": "b", "text": "com"}, {"id": "c", "text": "exe"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 10, 'الْوَحْدَةُ الْعاشِرَةُ: الِاسْتِخْدامُ الْآمِنُ وَالْأَخْلاقِيُّ لِلتِّقْنِيّاتِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=10 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=10 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L27', 'الرُّؤْيَةُ الْأولى: الْأَنْماطُ الشّائِعَةُ لِلِانْتِهاكاتِ الرَّقْمِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 58–63', true, '🎯 أُمَيِّزُ الْأَنْماطَ الشّائِعَةَ لِلِانْتِهاكاتِ الرَّقْمِيَّةِ، وَأُطَبِّقُ النَّصائِحَ الَّتي تَحْميني مِنْها.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ سَرِقَةَ الْهُوِيَّةِ، وَالتَّصَيُّدَ، وَالْمُطارَدَةَ الْإِلِكْتْرونِيَّةَ.',1),('يُوَضِّحُ الْفُروقَ بَيْنَ الْمُخْتَرِقِ وَالْمُخَرِّبِ، وَيُبَيِّنُ كَيْفَ يَعْمَلُ التَّصَيُّدُ وَأَحْصِنَةُ طُرْوادَةَ.',2),('يُطَبِّقُ نَصائِحَ تَجَنُّبِ سَرِقَةِ الْهُوِيَّةِ، وَيَحْذَرُ مِنَ الْغُرَباءِ عَلَى الْإِنْتَرْنِتْ، وَيَلْجَأُ إِلى أَهْلِهِ عِنْدَ الْخَطَرِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: الْأَنْماطُ الشّائِعَةُ لِلِانْتِهاكاتِ الرَّقْمِيَّةِ', 'إِنَّ الضَّرَرَ النّاجِمَ عَنْ سَرِقَةِ الْهُوِيَّةِ لَيْسَ مادِّيًّا فَقَطْ، إِذْ قَدْ يَتِمُّ إِشْراكُ الضَّحايا في أَنْشِطَةٍ إِجْرامِيَّةٍ لَمْ يَقوموا بِها أَساسًا. (كِتابُ النَّشاطِ، ص 58)', 'كِتابُ النَّشاطِ ص 58–63', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L27/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('اسْتِخْدامُ مَعْلوماتِكَ الشَّخْصِيَّةِ بِشَكْلٍ غَيْرِ قانونِيٍّ لِتَحْقيقِ مَكاسِبَ يُسَمّى:','[{"id": "a", "text": "سَرِقَةَ الْهُوِيَّةِ"}, {"id": "b", "text": "التَّنَمُّرَ"}, {"id": "c", "text": "الْحَوْسَبَةَ السَّحابِيَّةَ"}]'),('رَسائِلُ بَريدٍ احْتِيالِيَّةٌ تَبْدو شَرْعِيَّةً لِجَمْعِ الْمَعْلوماتِ الْمالِيَّةِ:','[{"id": "a", "text": "التَّصَيُّدُ"}, {"id": "b", "text": "جِدارُ الْحِمايَةِ"}, {"id": "c", "text": "النَّسْخُ الِاحْتِياطِيُّ"}]'),('الشَّخْصُ الَّذي يَصِلُ إِلى أَنْظِمَةِ الْآخَرينَ بِنِيَّةِ نَشْرِ الْبَرْمَجِيّاتِ الضّارَّةِ:','[{"id": "a", "text": "الْمُخَرِّبُ"}, {"id": "b", "text": "الْمُبَرْمِجُ الْأَمينُ"}, {"id": "c", "text": "الْمُتَصَفِّحُ"}]'),('مِنَ النَّصائِحِ لِتَجَنُّبِ الْمُطارَدَةِ الْإِلِكْتْرونِيَّةِ:','[{"id": "a", "text": "عَدَمُ اسْتِخْدامِ الِاسْمِ الْحَقيقِيِّ في الْمُنْتَدَياتِ"}, {"id": "b", "text": "نَشْرُ رَقْمِ الْهاتِفِ"}, {"id": "c", "text": "قَبولُ كُلِّ صَداقَةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=10 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L28', 'الرُّؤْيَةُ الثّانِيَةُ: الْحَوْسَبَةُ السَّحابِيَّةُ وَمَواقِعُ التَّواصُلِ الِاجْتِماعِيِّ', 3, 'كِتابُ النَّشاطِ ص 64–67', true, '🎯 أُوَضِّحُ إيجابِيّاتِ الْحَوْسَبَةِ السَّحابِيَّةِ وَسَلْبِيّاتِها، وَأُبَيِّنُ الْقَضايا الْأَخْلاقِيَّةَ وَالْقانونِيَّةَ لِمَواقِعِ التَّواصُلِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ الْحَوْسَبَةَ السَّحابِيَّةَ وَمَواقِعَ التَّواصُلِ الِاجْتِماعِيِّ.',1),('يُوَضِّحُ إيجابِيّاتِ الْحَوْسَبَةِ السَّحابِيَّةِ وَسَلْبِيّاتِها، وَمَخاطِرَ مُشارَكَةِ الْبَياناتِ عَلى مَواقِعِ التَّواصُلِ.',2),('يَلْتَزِمُ بِالْقَضايا الْأَخْلاقِيَّةِ وَالْقانونِيَّةِ: حُقوقِ النَّشْرِ، وَقِراءَةِ الشُّروطِ وَالْأَحْكامِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْحَوْسَبَةُ السَّحابِيَّةُ وَمَواقِعُ التَّواصُلِ الِاجْتِماعِيِّ', 'إِنَّ الْأَساسَ لِلْقِيامِ بِمِثْلِ هٰذَا الْأَمْرِ يَتَمَثَّلُ في تَذَكُّرِ أَنَّ الْقَوانينَ وَالسِّياساتِ وَالْقَواعِدَ الِاجْتِماعِيَّةَ الَّتي تَنْطَبِقُ عَلى حَياتِنَا الْحَقيقِيَّةِ تَنْطَبِقُ كَذٰلِكَ عَلى حَياتِنا عَلَى الْإِنْتَرْنِتْ. (كِتابُ النَّشاطِ، ص 67)', 'كِتابُ النَّشاطِ ص 64–67', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L28/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَقْديمُ الْخِدْماتِ الْحاسوبِيَّةِ عَبْرَ الْإِنْتَرْنِتْ بِإِدارَةِ طَرَفٍ ثالِثٍ:','[{"id": "a", "text": "الْحَوْسَبَةُ السَّحابِيَّةُ"}, {"id": "b", "text": "التِّجارَةُ الرَّقْمِيَّةُ"}, {"id": "c", "text": "الْمُطارَدَةُ الْإِلِكْتْرونِيَّةُ"}]'),('مِنْ إيجابِيّاتِ الْحَوْسَبَةِ السَّحابِيَّةِ:','[{"id": "a", "text": "الْمُرونَةُ وَقِلَّةُ التَّكْلِفَةِ"}, {"id": "b", "text": "سُهولَةُ التَّحْويلِ بَيْنَ الْمُزَوِّدينَ"}, {"id": "c", "text": "التَّحَكُّمُ الْكامِلُ بِمَكانِ الْبَياناتِ"}]'),('مِنْ سَلْبِيّاتِ الْحَوْسَبَةِ السَّحابِيَّةِ:','[{"id": "a", "text": "تَوَقُّفُ الْخِدْمَةِ عَنِ الْعَمَلِ"}, {"id": "b", "text": "الْخِدْمَةُ السَّريعَةُ"}, {"id": "c", "text": "الْمَساحاتُ الْإِضافِيَّةُ"}]'),('عِنْدَ التَّسْجيلِ في مَوْقِعِ تَواصُلٍ اجْتِماعِيٍّ يَجِبُ:','[{"id": "a", "text": "قِراءَةُ الشُّروطِ وَالْأَحْكامِ"}, {"id": "b", "text": "نَشْرُ الِاسْمِ الْكامِلِ وَالْهاتِفِ"}, {"id": "c", "text": "نَسْخُ مُحْتَوى الْآخَرينَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=10 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T3-L29', 'الرُّؤْيَةُ الثّالِثَةُ: التَّنَمُّرُ الْإِلِكْتْرونِيُّ وَالتَّواصُلُ الْمُلائِمُ', 3, 'كِتابُ النَّشاطِ ص 67–75', true, '🎯 أُعَرِّفُ التَّنَمُّرَ الْإِلِكْتْرونِيَّ وَأُمَيِّزُ عَلاماتِهِ، وَأَتَعامَلُ مَعَهُ بِطُرُقٍ آمِنَةٍ، وَأَلْتَزِمُ آدابَ التَّواصُلِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ التَّنَمُّرَ الْإِلِكْتْرونِيَّ، وَيَذْكُرُ الْأَنْشِطَةَ الَّتي يَتَمَثَّلُ فيها.',1),('يُبَيِّنُ أَبْرَزَ الْأَعْراضِ الَّتي تَظْهَرُ عَلى مَنْ يَتَعَرَّضُ لِلتَّنَمُّرِ، وَكَيْفَ يُقَدِّمُ الْمُساعَدَةَ لَهُ.',2),('يَتَعامَلُ مَعَ التَّنَمُّرِ بِخُطُواتٍ آمِنَةٍ، وَيَلْتَزِمُ اقْتِراحاتِ التَّواصُلِ الْمُلائِمِ عَبْرَ الْإِنْتَرْنِتْ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: التَّنَمُّرُ الْإِلِكْتْرونِيُّ وَالتَّواصُلُ الْمُلائِمُ', 'لا فَرْقَ سَواءٌ أَكُنْتَ تَتَواصَلُ بِاسْتِخْدامِ الْإِنْتَرْنِتْ أَمْ وَجْهًا لِوَجْهٍ، إِنَّهُ أَمْرٌ ذو عَلاقَةٍ بِالْفِطْرَةِ السَّليمَةِ، وَإِنَّ الْأَساسَ هُوَ (عامِلِ النّاسَ كَما تُحِبُّ أَنْ يُعامِلوكَ). (كِتابُ النَّشاطِ، ص 75)', 'كِتابُ النَّشاطِ ص 67–75', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L29/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('التَّحَرُّشُ الْمُتَكَرِّرُ بِالْغَيْرِ وَجَعْلُهُ مادَّةً لِلسُّخْرِيَةِ عَبْرَ الْوَسائِلِ الرَّقْمِيَّةِ:','[{"id": "a", "text": "التَّنَمُّرُ الْإِلِكْتْرونِيُّ"}, {"id": "b", "text": "التَّصَيُّدُ"}, {"id": "c", "text": "الْحَوْسَبَةُ السَّحابِيَّةُ"}]'),('أَوَّلُ ما يَتَعَيَّنُ عَلَيْكَ فِعْلُهُ إِذا تَعَرَّضْتَ لِلتَّنَمُّرِ:','[{"id": "a", "text": "إِبْلاغُ أَحَدِ الْبالِغينَ الَّذينَ تَثِقُ بِهِمْ"}, {"id": "b", "text": "الرَّدُّ بِالْمِثْلِ"}, {"id": "c", "text": "حَذْفُ كُلِّ الرَّسائِلِ"}]'),('مِنْ عَلاماتِ التَّعَرُّضِ لِلتَّنَمُّرِ الْإِلِكْتْرونِيِّ:','[{"id": "a", "text": "الِابْتِعادُ عَنِ الْعائِلَةِ وَالْأَصْدِقاءِ وَالنَّشاطاتِ"}, {"id": "b", "text": "زِيادَةُ الْمُشارَكَةِ في الصَّفِّ"}, {"id": "c", "text": "تَحَسُّنُ النَّوْمِ"}]'),('الْأَساسُ في التَّواصُلِ الْمُلائِمِ عَبْرَ الْإِنْتَرْنِتْ:','[{"id": "a", "text": "عامِلِ النّاسَ كَما تُحِبُّ أَنْ يُعامِلوكَ"}, {"id": "b", "text": "اكْتُبْ ما تَشاءُ ما دُمْتَ مَجْهولًا"}, {"id": "c", "text": "اسْتَخْدِمِ الِاخْتِصاراتِ دائِمًا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=10 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T3-L30', 'الرُّؤْيَةُ الرّابِعَةُ: تَبادُلُ الْمَعْلوماتِ بِشَكْلٍ أَخْلاقِيٍّ وَاتِّخاذُ الْقَراراتِ الْأَخْلاقِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 76–79', true, '🎯 أُقارِنُ بَيْنَ الْمَوارِدِ الْمُشْتَرَكَةِ وَالْمُخَصَّصَةِ، وَأَتَجَنَّبُ السُّلوكِيّاتِ غَيْرَ الْأَخْلاقِيَّةِ فيها، وَأَتَّخِذُ قَراراتٍ أَخْلاقِيَّةً.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ الْمَوارِدَ الْمُشْتَرَكَةَ وَالْمَوارِدَ الْمُخَصَّصَةَ، وَيَذْكُرُ أَمْثِلَةً عَلى كُلٍّ مِنْهُما.',1),('يُعَدِّدُ السُّلوكِيّاتِ غَيْرَ الْأَخْلاقِيَّةِ عِنْدَ اسْتِخْدامِ الْمَوارِدِ الْمُشْتَرَكَةِ.',2),('يُطَبِّقُ أَسْئِلَةَ اتِّخاذِ الْقَرارِ الْأَخْلاقِيِّ الثَّلاثَ عَلى مَواقِفَ رَقْمِيَّةٍ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: تَبادُلُ الْمَعْلوماتِ بِشَكْلٍ أَخْلاقِيٍّ وَاتِّخاذُ الْقَراراتِ الْأَخْلاقِيَّةِ', 'إِنَّ اتِّخاذَ قَرارٍ أَخْلاقِيٍّ لَيْسَ بِالْأَمْرِ السَّهْلِ، وَلٰكِنْ يَتَعَيَّنُ عَلَى الشَّخْصِ أَنْ يَكونَ قادِرًا عَلَى اتِّخاذِهِ، وَقَدْ يَتِمُّ اتِّخاذُ الْقَراراتِ الْأَخْلاقِيَّةِ بِطَريقَةٍ مَوْضوعِيَّةٍ لِأَبْعَدِ حَدٍّ. (كِتابُ النَّشاطِ، ص 79)', 'كِتابُ النَّشاطِ ص 76–79', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L30/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْأَجْهِزَةُ أَوِ الْمَعْلوماتُ الَّتي يُمْكِنُ الْوُصولُ إِلَيْها بِحَواسيبَ أُخْرى عَبْرَ شَبَكَةٍ:','[{"id": "a", "text": "الْمَوارِدُ الْمُشْتَرَكَةُ"}, {"id": "b", "text": "الْمَوارِدُ الْمُخَصَّصَةُ"}, {"id": "c", "text": "الْمُكَوِّناتُ الذَّكِيَّةُ"}]'),('مِنْ أَمْثِلَةِ الْمَوارِدِ الْمُخَصَّصَةِ:','[{"id": "a", "text": "اسْتِخْدامُ الْبَصْمَةِ لِلدُّخولِ إِلى أَحَدِ الْمَرافِقِ"}, {"id": "b", "text": "مُجَلَّدُ الصَّفِّ عَلَى الشَّبَكَةِ"}, {"id": "c", "text": "جِهازٌ عامٌّ في الْمَكْتَبَةِ"}]'),('مِنَ السُّلوكِيّاتِ غَيْرِ الْأَخْلاقِيَّةِ عِنْدَ اسْتِخْدامِ الْمَوارِدِ الْمُشْتَرَكَةِ:','[{"id": "a", "text": "تَحْميلُ الْبَرامِجِ الْمُقَرْصَنَةِ"}, {"id": "b", "text": "إِكْمالُ مَشْروعٍ جَماعِيٍّ"}, {"id": "c", "text": "طِباعَةُ الْواجِباتِ الْمَدْرَسِيَّةِ"}]'),('مِنْ أَسْئِلَةِ «قَيِّمْ كافَّةَ الْخِياراتِ» قَبْلَ الْقَرارِ الْأَخْلاقِيِّ:','[{"id": "a", "text": "أَيُّ الْخِياراتِ يَحْتَرِمُ حُقوقَ كافَّةِ الْأَطْرافِ؟"}, {"id": "b", "text": "أَيُّها أَسْرَعُ لي؟"}, {"id": "c", "text": "أَيُّها يُعْجِبُ أَصْدِقائي؟"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=10 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y11-T3-L31', 'الرُّؤْيَةُ الْخامِسَةُ: الْوِقايَةُ عَلَى الْإِنْتَرْنِتْ', 3, 'كِتابُ النَّشاطِ ص 80–88', true, '🎯 أَحْمي سُمْعَتي الرَّقْمِيَّةَ وَبَياناتي، وَأُطَبِّقُ وَسائِلَ الْوِقايَةِ التِّقْنِيَّةَ وَتَأْمينَ الشَّبَكاتِ اللّاسِلْكِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ الْبَصْمَةَ الرَّقْمِيَّةَ، وَيَذْكُرُ خُطُواتِ مُراقَبَةِ السُّمْعَةِ الرَّقْمِيَّةِ وَحِمايَتِها.',1),('يُبَيِّنُ نَصائِحَ تَأْمينِ الْبَياناتِ السَّحابِيَّةِ، وَدَوْرَ بَرامِجِ مُكافَحَةِ الْفَيْروساتِ وَالتَّجَسُّسِ وَجِدارِ الْحِمايَةِ.',2),('يُطَبِّقُ إِجْراءاتِ النَّسْخِ الِاحْتِياطِيِّ وَتَأْمينِ الشَّبَكاتِ اللّاسِلْكِيَّةِ، وَيُصَحِّحُ الْأَخْطاءَ الشّائِعَةَ فيها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْخامِسَةُ: الْوِقايَةُ عَلَى الْإِنْتَرْنِتْ', 'الْبَصْمَةُ الرَّقْمِيَّةُ هِيَ الْمَعْلوماتُ الَّتي يُمْكِنُ تَتَبُّعُها، وَالَّتي نَتْرُكُها خَلْفَنا عِنْدَ اسْتِخْدامِ الْإِنْتَرْنِتْ، وَقَدْ تَتَسَبَّبُ هٰذِهِ الْمَعْلوماتُ في مَشاكِلَ لِلَّذينَ يَقومونَ بِنَشْرِ تَعْليقاتٍ وَصُوَرٍ وَأُمورٍ خاصَّةٍ بِهِمْ. (كِتابُ النَّشاطِ، ص 80)', 'كِتابُ النَّشاطِ ص 80–88', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L31/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْمَعْلوماتُ الَّتي يُمْكِنُ تَتَبُّعُها وَنَتْرُكُها خَلْفَنا عِنْدَ اسْتِخْدامِ الْإِنْتَرْنِتْ:','[{"id": "a", "text": "الْبَصْمَةُ الرَّقْمِيَّةُ"}, {"id": "b", "text": "الْحَوْسَبَةُ السَّحابِيَّةُ"}, {"id": "c", "text": "الْمَوارِدُ الْمُخَصَّصَةُ"}]'),('إِذا كانَ عُنْوانُ الْمَوْقِعِ يَبْدَأُ بِالْأَحْرُفِ (https) فَهٰذا يَعْني أَنَّ الْمَوْقِعَ:','[{"id": "a", "text": "يُوَفِّرُ حِمايَةً لِلْمُسْتَخْدِمينَ"}, {"id": "b", "text": "مَوْقِعٌ تِجارِيٌّ"}, {"id": "c", "text": "غَيْرُ آمِنٍ"}]'),('الْبْروتوكولُ الَّذي يَجِبُ تَجَنُّبُهُ في الشَّبَكاتِ اللّاسِلْكِيَّةِ لِتَدَنّي حِمايَتِهِ:','[{"id": "a", "text": "WEP"}, {"id": "b", "text": "WPA2"}, {"id": "c", "text": "WPA"}]'),('مِنْ نَصائِحِ تَأْمينِ الْبَياناتِ السَّحابِيَّةِ:','[{"id": "a", "text": "تَشْفيرُ الْبَياناتِ قَبْلَ رَفْعِها"}, {"id": "b", "text": "تَخْزينُ كَلِماتِ الْمُرورِ في السَّحابَةِ"}, {"id": "c", "text": "مُشارَكَةُ الْحِسابِ مَعَ الْأَصْدِقاءِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 3, 11, 'الْوَحْدَةُ الْحاديَةَ عَشْرَةَ: الصِّحَّةُ وَالسَّلامَةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=3
                  and sort_order=11 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=11 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T3-L32', 'الرُّؤْيَةُ الْأولى: بيئَةُ الْعَمَلِ الصِّحِّيَّةُ وَالصِّحَّةُ الْجَسَدِيَّةُ', 3, 'كِتابُ النَّشاطِ ص 92–98', true, '🎯 أُطَبِّقُ قَوانينَ بيئَةِ الْعَمَلِ الصِّحِّيَّةِ، وَأَتَّخِذُ إِجْراءاتٍ تَقيني إِجْهادَ الْعَيْنِ وَآلامَ الظَّهْرِ وَإِصاباتِ الْإِجْهادِ الْمُتَكَرِّرِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُعَرِّفُ قَوانينَ بيئَةِ الْعَمَلِ الصِّحِّيَّةِ، وَيُبَيِّنُ أَهَمِّيَّتَها.',1),('يَصِفُ الْوَضْعِيَّةَ الصَّحيحَةَ لِلْكُرْسِيِّ وَلَوْحَةِ الْمَفاتيحِ وَالشّاشَةِ وَالْفَأْرَةِ، وَيُوَضِّحُ أَعْراضَ إِجْهادِ الْعَيْنِ.',2),('يَقْتَرِحُ طَرائِقَ لِتَجَنُّبِ آلامِ الظَّهْرِ وَإِجْهادِ الْعَيْنِ، وَيُطَبِّقُها في جَلْسَتِهِ أَمامَ الْحاسوبِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: بيئَةُ الْعَمَلِ الصِّحِّيَّةُ وَالصِّحَّةُ الْجَسَدِيَّةُ', 'وَعِنْدَ شُعورِ الْأَشْخاصِ بِالرّاحَةِ، فَإِنَّ إِنْتاجِيَّتَهُمْ سَوْفَ تَتَحَسَّنُ طالَما أَنَّهُمْ قادِرونَ عَلَى الْعَمَلِ بِسُهولَةٍ كَبيرَةٍ، وَالتَّفْكيرِ بِصَفاءٍ أَكْثَرَ. (كِتابُ النَّشاطِ، ص 92)', 'كِتابُ النَّشاطِ ص 92–98', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L32/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْعِلْمُ الَّذي يُصَمِّمُ الْأَجْهِزَةَ لِتَتَلاءَمَ مَعَ أَجْسادِ الْمُسْتَخْدِمينَ:','[{"id": "a", "text": "قَوانينُ بيئَةِ الْعَمَلِ الصِّحِّيَّةِ"}, {"id": "b", "text": "الْحَوْسَبَةُ السَّحابِيَّةُ"}, {"id": "c", "text": "التِّجارَةُ الرَّقْمِيَّةُ"}]'),('أَقَلُّ مَسافَةٍ يُنْصَحُ بِها بَيْنَ الْعَيْنَيْنِ وَالشّاشَةِ:','[{"id": "a", "text": "45 سَنْتيمِتْرًا"}, {"id": "b", "text": "10 سَنْتيمِتْراتٍ"}, {"id": "c", "text": "20 سَنْتيمِتْرًا"}]'),('تَحْدُثُ مُتَلازِمَةُ النَّفَقِ الرُّسْغِيِّ نَتيجَةَ:','[{"id": "a", "text": "حَرَكَةِ الْيَدَيْنِ الْمُتَكَرِّرَةِ في الطِّباعَةِ وَاسْتِخْدامِ الْفَأْرَةِ"}, {"id": "b", "text": "كَثْرَةِ الْمَشْيِ"}, {"id": "c", "text": "الْإِضاءَةِ الْقَوِيَّةِ"}]'),('مِنْ نَصائِحِ تَجَنُّبِ إِجْهادِ الْعَيْنِ:','[{"id": "a", "text": "أَخْذُ اسْتِراحَةٍ لِمُدَّةِ 5 دَقائِقَ كُلَّ ساعَةٍ"}, {"id": "b", "text": "وَضْعُ الشّاشَةِ أَمامَ النّافِذَةِ"}, {"id": "c", "text": "اسْتِخْدامُ شاشاتٍ تَهْتَزُّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=3
                 and sort_order=11 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T3-L33', 'الرُّؤْيَةُ الثّانِيَةُ: الْمَشاكِلُ الِاجْتِماعِيَّةُ لِلِاسْتِخْدامِ الزّائِدِ وَالتَّخَلُّصُ مِنْ مُعَدّاتِ الْحاسوبِ', 3, 'كِتابُ النَّشاطِ ص 98–106', true, '🎯 أُبَيِّنُ الْمَشاكِلَ الِاجْتِماعِيَّةَ الْمُرْتَبِطَةَ بِالِاسْتِخْدامِ الزّائِدِ لِلْحاسوبِ، وَأَتَخَلَّصُ مِنَ الْمُعَدّاتِ الْقَديمَةِ بِطَريقَةٍ تَحْمي الْبيئَةَ وَبَياناتي.' from u
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
       select l.id, v.s, v.n from l, (values ('يَذْكُرُ الْمَشاكِلَ الِاجْتِماعِيَّةَ الْمُرْتَبِطَةَ بِالِاسْتِخْدامِ الزّائِدِ لِلْحاسوبِ وَالْإِنْتَرْنِتْ.',1),('يُبَيِّنُ أَعْراضَ الْإِدْمانِ عَلَى الْإِنْتَرْنِتْ، وَسَلْبِيّاتِ إِدْمانِ اللَّعِبِ عَبْرَ الْإِنْتَرْنِتْ.',2),('يَتَّخِذُ إِجْراءاتٍ تُراعي الْبيئَةَ عِنْدَ اسْتِخْدامِ التِّقْنِيّاتِ وَالتَّخَلُّصِ مِنْها، وَيَمْسَحُ بَياناتِهِ نِهائِيًّا مِنَ الْجِهازِ الْقَديمِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْمَشاكِلُ الِاجْتِماعِيَّةُ لِلِاسْتِخْدامِ الزّائِدِ وَالتَّخَلُّصُ مِنْ مُعَدّاتِ الْحاسوبِ', 'إِنَّ الْأَشْخاصَ الَّذينَ يَقْضونَ ساعاتٍ طَويلَةً مُنْعَزِلينَ عَمَّنْ حَوْلَهُمْ في أَثْناءِ اسْتِخْدامِ الْكُمْبْيوتَرِ يَميلونَ إِلى إِهْمالِ عَلاقاتِهِمْ مَعَ الْآخَرينَ، وَلا سِيَّما أُسَرُهُمْ وَأَصْدِقاؤُهُمْ. (كِتابُ النَّشاطِ، ص 99)', 'كِتابُ النَّشاطِ ص 98–106', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T3-L33/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَوَّلُ الْعَلاماتِ التَّحْذيرِيَّةِ لِلْإِدْمانِ عَلَى الْإِنْتَرْنِتْ في الْكِتابِ:','[{"id": "a", "text": "قَضاءُ أَوْقاتٍ طَويلَةٍ لِدَرَجَةِ فُقْدانِ الْإِحْساسِ بِالْوَقْتِ"}, {"id": "b", "text": "اسْتِخْدامُ الْبَريدِ لِلْعَمَلِ"}, {"id": "c", "text": "تَحْديثُ الْبَرامِجِ"}]'),('الشِّراءُ الْعَفْوِيُّ الْفَوْرِيُّ غَيْرُ الْمُخَطَّطِ لَهُ عَبْرَ الْإِنْتَرْنِتْ يُسَمّى:','[{"id": "a", "text": "التَّسَوُّقَ الْقَهْرِيَّ"}, {"id": "b", "text": "التِّجارَةَ الرَّقْمِيَّةَ"}, {"id": "c", "text": "النَّسْخَ الِاحْتِياطِيَّ"}]'),('مِنَ الْمَوادِّ الْمُؤْذِيَةِ في مُعَدّاتِ الْحاسوبِ:','[{"id": "a", "text": "الزِّئْبَقُ في مَصابيحِ الْإِنارَةِ"}, {"id": "b", "text": "الْماءُ في الْمُبَرِّداتِ"}, {"id": "c", "text": "الْخَشَبُ في الطّاوِلاتِ"}]'),('الْخُطْوَةُ الثّالِثَةُ لِلتَّخَلُّصِ النِّهائِيِّ مِنَ الْبَياناتِ عَلَى الْجِهازِ الْقَديمِ:','[{"id": "a", "text": "تَحْطيمُ الْقُرْصِ الصُّلْبِ فِعْلِيًّا"}, {"id": "b", "text": "إِعادَةُ تَشْغيلِ الْجِهازِ"}, {"id": "c", "text": "حَذْفُ الْمَلَفّاتِ إِلى سَلَّةِ الْمُحْذوفاتِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;