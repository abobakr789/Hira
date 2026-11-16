begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 2, 1, 'الْوَحْدَةُ الْأولى: الْفَصْلُ التَّمْهيدِيُّ — الْيونِسْكو وَالِاكْتِشافاتُ الْأَثَرِيَّةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=2
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T2-L1', 'الرُّؤْيَةُ الْأولى: مُنَظَّمَةُ الْيونِسْكو وَقائِمَةُ التُّراثِ الْعالَمِيِّ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 13–20', true, '🎯 أَتَعَرَّفُ مُنَظَّمَةَ الْيونِسْكو وَدَوْرَها في حِفْظِ التُّراثِ، وَأُحَدِّدُ مَكانَةَ مَواقِعِ الْعَيْنِ في قائِمَةِ التُّراثِ الْعالَمِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ نَشْأَةَ مُنَظَّمَةِ الْيونِسْكو وَمَهامَّها وَبَرامِجَها الْأَساسِيَّةَ.',1),('أُوَضِّحُ آلِيَّةَ إِدْراجِ الْمَواقِعِ عَلى قائِمَةِ التُّراثِ الْعالَمِيِّ.',2),('أُحَدِّدُ مَواقِعَ الْعَيْنِ الْمُدْرَجَةَ وَمُبَرِّراتِ إِدْراجِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: مُنَظَّمَةُ الْيونِسْكو وَقائِمَةُ التُّراثِ الْعالَمِيِّ', 'وُضِعَتْ عِبارَةٌ شَهيرَةٌ في مَطْلَعِ ديباجَةِ الْميثاقِ التَّأْسيسِيِّ لِمُنَظَّمَةِ الْيونِسْكو تَقولُ: «لَمّا كانَتِ الْحُروبُ تَتَوَلَّدُ في عُقولِ الْبَشَرِ، فَفي عُقولِهِمْ يَجِبُ أَنْ تُبْنى حُصونُ السَّلامِ». (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 14)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 13–20', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَأَسَّسَتْ مُنَظَّمَةُ الْيونِسْكو في عامِ:','[{"id": "a", "text": "1945م"}, {"id": "b", "text": "1972م"}, {"id": "c", "text": "1992م"}]'),('صودِقَ عَلَى اتِّفاقِيَّةِ التُّراثِ الْعالَمِيِّ في عامِ:','[{"id": "a", "text": "1972م"}, {"id": "b", "text": "1945م"}, {"id": "c", "text": "2011م"}]'),('عَدَدُ أَعْضاءِ لَجْنَةِ التُّراثِ الْعالَمِيِّ:','[{"id": "a", "text": "واحِدٌ وَعِشْرونَ عُضْوًا"}, {"id": "b", "text": "خَمْسَةَ عَشَرَ عُضْوًا"}, {"id": "c", "text": "خَمْسونَ عُضْوًا"}]'),('أُدْرِجَتْ مَواقِعُ الْعَيْنِ عَلى قائِمَةِ التُّراثِ الْعالَمِيِّ عامَ:','[{"id": "a", "text": "2011م"}, {"id": "b", "text": "2019م"}, {"id": "c", "text": "1992م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T2-L2', 'الرُّؤْيَةُ الثّانِيَةُ: قِصَّةُ الِاكْتِشافاتِ الْأَثَرِيَّةِ في إِمارَةِ أَبوظَبِي', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 21–29', true, '🎯 أَتَتَبَّعُ بِدايَةَ الِاكْتِشافاتِ الْأَثَرِيَّةِ في إِمارَةِ أَبوظَبِي، وَأُرَتِّبُ الْعُصورَ عَلَى الْخَطِّ الزَّمَنِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ ظُروفَ دَعْوَةِ بَعْثَةِ التَّنْقيبِ الدَّنْماركِيَّةِ إِلى أَبوظَبِي.',1),('أُوَضِّحُ جُهودَ الشَّيْخِ زايِدٍ -رَحِمَهُ اللهُ- في دَعْمِ الْبَحْثِ الْأَثَرِيِّ وَتَنْظيمِهِ.',2),('أُرَتِّبُ الْعُصورَ الْأَثَرِيَّةَ في إِمارَةِ أَبوظَبِي وَأَهَمَّ مَواقِعِ كُلِّ عَصْرٍ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: قِصَّةُ الِاكْتِشافاتِ الْأَثَرِيَّةِ في إِمارَةِ أَبوظَبِي', 'فَأَكَّدَ عِنْدَ رُؤْيَتِهِ لِهٰذِهِ الْأَطْلالِ أَنَّها حَضارَةٌ موغِلَةٌ في الْقِدَمِ، وَأَنَّ هٰذِهِ الْأَطْلالَ تَحْتاجُ إِلى تَنْقيبٍ عِلْمِيٍّ مُنَظَّمٍ لِإِماطَةِ اللِّثامِ عَنْها. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 26)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 21–29', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('دَعا بَعْثَةَ التَّنْقيبِ الدَّنْماركِيَّةَ إِلى أَبوظَبِي الشَّيْخُ:','[{"id": "a", "text": "شَخْبوطُ بْنُ سُلْطانٍ آلُ نَهْيانَ"}, {"id": "b", "text": "زايِدُ بْنُ سُلْطانٍ آلُ نَهْيانَ"}, {"id": "c", "text": "هَزّاعُ بْنُ سُلْطانٍ آلُ نَهْيانَ"}]'),('رَأَسَ فَريقَ الْبَعْثَةِ عالِمُ الْآثارِ:','[{"id": "a", "text": "بيتَر جْلوب"}, {"id": "b", "text": "جِفْري بيبي"}, {"id": "c", "text": "إيرينا بوكوفا"}]'),('قانونُ الْآثارِ وَالْحَفْرِيّاتِ في إِمارَةِ أَبوظَبِي صَدَرَ سَنَةَ:','[{"id": "a", "text": "1970م"}, {"id": "b", "text": "1969م"}, {"id": "c", "text": "2016م"}]'),('يَمْتَدُّ الْعَصْرُ الْحَديدِيُّ في الْخَطِّ الزَّمَنِيِّ مِنْ:','[{"id": "a", "text": "1,300 إِلى 300 قَبْلَ الْميلادِ"}, {"id": "b", "text": "3,200 إِلى 2,700 قَبْلَ الْميلادِ"}, {"id": "c", "text": "2,000,000 إِلى 20,000 قَبْلَ الْميلادِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 2, 2, 'الْوَحْدَةُ الثّانِيَةُ: مَدافِنُ جَبَلِ حَفيتَ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=2
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T2-L3', 'الرُّؤْيَةُ الْأولى: جَبَلُ حَفيتَ — الْمَوْقِعُ وَالْخَصائِصُ الْجيولوجِيَّةُ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 34–36', true, '🎯 أَتَعَرَّفُ مَوْقِعَ جَبَلِ حَفيتَ وَأَهَمِّيَّتَهُ الطَّبيعِيَّةَ، وَأُبَيِّنُ خَصائِصَهُ الْجيولوجِيَّةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ مَوْقِعَ جَبَلِ حَفيتَ وَأَهَمِّيَّتَهُ الطَّبيعِيَّةَ.',1),('يُبَيِّنُ الْخَصائِصَ الْجيولوجِيَّةَ الَّتي يَتَمَيَّزُ بِها جَبَلُ حَفيتَ.',2),('يُوَضِّحُ جُهودَ الشَّيْخِ زايِدِ بْنِ سُلْطانٍ آلِ نَهْيانَ -رَحِمَهُ اللهُ- في دَعْمِ الْفِرَقِ الْمُهْتَمَّةِ بِدِراسَةِ التّاريخِ الطَّبيعِيِّ في إِمارَةِ أَبوظَبِي.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: جَبَلُ حَفيتَ — الْمَوْقِعُ وَالْخَصائِصُ الْجيولوجِيَّةُ', 'حَفيتُ ذٰلِكَ الْجَبَلُ الْأَشَمُّ الَّذي لا يُمْكِنُ أَنْ تُذْكَرَ الْعَيْنُ إِلّا وَيُذْكَرَ مَعَها بِوَصْفِهِ شاهِدًا عَلى أَصالَةِ دَوْلَةِ الْإِماراتِ وَطَبيعَتِهَا الْخَلّابَةِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 34)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 34–36', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَبْلُغُ ارْتِفاعُ جَبَلِ حَفيتَ:','[{"id": "a", "text": "1,249 مِتْرًا"}, {"id": "b", "text": "1,160 مِتْرًا"}, {"id": "c", "text": "300 مِتْرٍ"}]'),('يَمْتَدُّ جَبَلُ حَفيتَ داخِلَ دَوْلَةِ الْإِماراتِ عَلى مَساحَةٍ تُقَدَّرُ بِـ:','[{"id": "a", "text": "15 كيلومِتْرًا"}, {"id": "b", "text": "8 كيلومِتْراتٍ"}, {"id": "c", "text": "300 كيلومِتْرٍ"}]'),('تَعودُ صُخورُ جَبَلِ حَفيتَ إِلَى الْعَصْرِ:','[{"id": "a", "text": "الْجيولوجِيِّ الثّالِثِ"}, {"id": "b", "text": "الْبُرونْزِيِّ"}, {"id": "c", "text": "الْحَديدِيِّ"}]'),('رَشَّحَتْ جَبَلَ حَفيتَ لِيَكونَ تُراثًا وَطَنِيًّا أَوْ مَحْمِيَّةً طَبيعِيَّةً:','[{"id": "a", "text": "هَيْئَةُ الْبيئَةِ في أَبوظَبِي"}, {"id": "b", "text": "مُنَظَّمَةُ الْيونِسْكو"}, {"id": "c", "text": "بَعْثَةُ التَّنْقيبِ الدَّنْماركِيَّةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T2-L4', 'الرُّؤْيَةُ الثّانِيَةُ: آثارُ جَبَلِ حَفيتَ وَمَدافِنُهُ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 37–41', true, '🎯 أَكْتَشِفُ غِنَى الْمُحْتَوى الْحَضارِيِّ لِمَوْقِعِ جَبَلِ حَفيتَ، وَأَتَعَرَّفُ مُمَيِّزاتِ مَدافِنِهِ وَخَصائِصَها.' from u
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
       select l.id, v.s, v.n from l, (values ('يَكْتَشِفُ غِنَى الْمُحْتَوى الْحَضارِيِّ لِمَوْقِعِ جَبَلِ حَفيتَ الْأَثَرِيِّ مِنْ خِلالِ بَقايا حَضارَتِهِ الْخالِدَةِ.',1),('يَتَعَرَّفُ مُمَيِّزاتِ وَخَصائِصَ مَدافِنِ جَبَلِ حَفيتَ.',2),('يَقْتَرِحُ إِجْراءاتٍ عَمَلِيَّةً لِلْحِفاظِ عَلى مَدافِنِ جَبَلِ حَفيتَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: آثارُ جَبَلِ حَفيتَ وَمَدافِنُهُ', 'وَتَتَمَيَّزُ هٰذِهِ الْمَدافِنُ بِأَنَّها أُحادِيَّةُ التَّقْسيمِ، أَيْ أَنَّ كُلَّ مَدْفَنٍ يَتَكَوَّنُ مِنْ حُجْرَةِ دَفْنٍ واحِدَةٍ ذاتِ شَكْلٍ دائِرِيٍّ أَوْ بَيْضَوِيٍّ مَبْنِيَّةٍ مِنَ الْأَحْجارِ الْمَحَلِّيَّةِ غَيْرِ الْمُتَناسِقَةِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 39)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 37–41', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَعودُ مَدافِنُ جَبَلِ حَفيتَ إِلى عامِ:','[{"id": "a", "text": "3,100 قَبْلَ الْميلادِ"}, {"id": "b", "text": "2,700 قَبْلَ الْميلادِ"}, {"id": "c", "text": "1,300 قَبْلَ الْميلادِ"}]'),('عَدَدُ الْمَدافِنِ الْحَجَرِيَّةِ الَّتي دَلَّ عَلَيْها الْمَسْحُ الْأَثَرِيُّ:','[{"id": "a", "text": "أَكْثَرُ مِنْ 500 مَدْفَنٍ"}, {"id": "b", "text": "أَقَلُّ مِنْ 50 مَدْفَنًا"}, {"id": "c", "text": "ثَلاثَةُ مَدافِنَ"}]'),('تَتَمَيَّزُ مَدافِنُ حَفيتَ بِأَنَّها:','[{"id": "a", "text": "أُحادِيَّةُ التَّقْسيمِ"}, {"id": "b", "text": "مُتَعَدِّدَةُ الْحُجُراتِ"}, {"id": "c", "text": "مَبْنِيَّةٌ بِالْأَحْجارِ الْمَنْحوتَةِ"}]'),('تَمْتَدُّ فَتْرَةُ حَفيتَ مِنْ:','[{"id": "a", "text": "3,100 إِلى 2,700 قَبْلَ الْميلادِ"}, {"id": "b", "text": "1,300 إِلى 300 قَبْلَ الْميلادِ"}, {"id": "c", "text": "2,000,000 إِلى 20,000 قَبْلَ الْميلادِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T2-L5', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُكْتَشَفاتُ الْأَثَرِيَّةُ وَالْعَلاقاتُ الْحَضارِيَّةُ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 42–47', true, '🎯 أُبَيِّنُ أَهَمِّيَّةَ الْمُكْتَشَفاتِ الْأَثَرِيَّةِ في مَدافِنِ حَفيتَ، وَأُفَسِّرُ التَّواصُلَ الْحَضارِيَّ مَعَ الْحَضاراتِ الْمُجاوِرَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُبَيِّنُ أَهَمِّيَّةَ الْمُكْتَشَفاتِ الْأَثَرِيَّةِ في مَدافِنِ جَبَلِ حَفيتَ في التَّعَرُّفِ إِلى ماضي مِنْطَقَةِ الْعَيْنِ.',1),('يُفَسِّرُ التَّواصُلَ الْحَضارِيَّ بَيْنَ مَدافِنِ جَبَلِ حَفيتَ وَالْحَضاراتِ الْمُجاوِرَةِ.',2),('يَسْتَخْلِصُ التَّأْثيرَ الْحَضارِيَّ لِبِلادِ الرّافِدَيْنِ عَلى مَوْقِعِ جَبَلِ حَفيتَ الْأَثَرِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْمُكْتَشَفاتُ الْأَثَرِيَّةُ وَالْعَلاقاتُ الْحَضارِيَّةُ', 'وَمِمّا يُمَيِّزُ هٰذِهِ الْأَواني أَنَّ الْبَعْضَ مِنْها مُزَيَّنٌ بِرُسوماتٍ هَنْدَسِيَّةٍ مِنَ النَّوْعِ الَّذي يُطْلَقُ عَلَيْهِ فَخّارُ جَمْدَةِ نَصْرٍ… وَهٰذا يُشيرُ إِلى أَهَمِّيَّةِ التِّجارَةِ الْبَحْرِيَّةِ عَبْرَ الْمَسافاتِ الطَّويلَةِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 42)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 42–47', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('فَخّارُ جَمْدَةِ نَصْرٍ يُنْسَبُ إِلى مَوْقِعٍ أَثَرِيٍّ في:','[{"id": "a", "text": "بِلادِ ما بَيْنَ النَّهْرَيْنِ"}, {"id": "b", "text": "جَزيرَةِ أُمِّ النّارِ"}, {"id": "c", "text": "جَبَلِ حَفيتَ"}]'),('الِاسْمُ الْقَديمُ لِدَوْلَةِ الْإِماراتِ وَسَلْطَنَةِ عُمانَ في نُصوصِ الرّافِدَيْنِ:','[{"id": "a", "text": "ماجانُ"}, {"id": "b", "text": "دِلْمونُ"}, {"id": "c", "text": "جَمْدَةُ نَصْرٍ"}]'),('تَوَسَّعَتِ التِّجارَةُ مَعَ بِلادِ الرّافِدَيْنِ حَوالَيْ عامِ:','[{"id": "a", "text": "2,500 قَبْلَ الْميلادِ"}, {"id": "b", "text": "3,100 قَبْلَ الْميلادِ"}, {"id": "c", "text": "1,300 قَبْلَ الْميلادِ"}]'),('مِنَ السِّلَعِ الَّتي كانَتْ تُصَدَّرُ إِلى بِلادِ الرّافِدَيْنِ:','[{"id": "a", "text": "النُّحاسُ وَأَحْجارُ الدّيورايْتِ وَالتُّمورُ"}, {"id": "b", "text": "النَّسيجُ وَحْدَهُ"}, {"id": "c", "text": "الْأَواني الْخَزَفِيَّةُ وَحْدَها"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 2, 3, 'الْوَحْدَةُ الثّالِثَةُ: مَوْقِعُ هيلي الْأَثَرِيُّ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=2
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T2-L6', 'الرُّؤْيَةُ الْأولى: مَدافِنُ هيلي — الْمَدْفَنُ الْكَبيرُ وَنُقوشُهُ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 52–63', true, '🎯 أَتَعَرَّفُ الْأَهَمِّيَّةَ الْحَضارِيَّةَ لِمَدْفَنِ هيلي الْكَبيرِ، وَأُبَيِّنُ مُمَيِّزاتِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ الْأَهَمِّيَّةَ الْحَضارِيَّةَ لِمَدْفَنِ هيلي الْكَبيرِ.',1),('يُبَيِّنُ مُمَيِّزاتِ مَدْفَنِ هيلي الْكَبيرِ.',2),('يَعي الْأَهَمِّيَّةَ الثَّقافِيَّةَ لِلْمَدافِنِ الْأَثَرِيَّةِ الَّتي تَمَّ تَرْميمُها في مَوْقِعِ هيلي.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: مَدافِنُ هيلي — الْمَدْفَنُ الْكَبيرُ وَنُقوشُهُ', 'تُعَدُّ النُّقوشُ الْمَنْحوتَةُ عَلى مَدْفَنِ هيلي الْكَبيرِ مِنْ أَقْدَمِ نُقوشِ الْعالَمِ الْأَثَرِيَّةِ في مَدينَةِ الْعَيْنِ، وَمِنْ أَكْثَرِ الْأَعْمالِ الْفَنِّيَّةِ تَفَرُّدًا وَتَمَيُّزًا في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 60)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 52–63', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَصِلُ قُطْرُ مَدْفَنِ هيلي الْكَبيرِ إِلى:','[{"id": "a", "text": "اثْنَيْ عَشَرَ مِتْرًا"}, {"id": "b", "text": "عِشْرينَ مِتْرًا"}, {"id": "c", "text": "أَرْبَعَةِ أَمْتارٍ"}]'),('سَمَّى السُّكّانُ الْمَحَلِّيّونَ حِجارَةَ الْمَوْقِعِ قَبْلَ التَّنْقيبِ:','[{"id": "a", "text": "الْحِجارَةَ الْجالِسَةَ"}, {"id": "b", "text": "الْحِجارَةَ الْقائِمَةَ"}, {"id": "c", "text": "الْحِجارَةَ الْمَنْحوتَةَ"}]'),('أُعيدَ بِناءُ مَدْفَنِ هيلي الْكَبيرِ بِشَكْلِهِ الْحالِيِّ عامَ:','[{"id": "a", "text": "1975م"}, {"id": "b", "text": "1973م"}, {"id": "c", "text": "1965م"}]'),('يُمَثِّلُ النَّقْشُ الْبارِزُ فَوْقَ الْمَدْخَلِ الْجَنوبِيِّ:','[{"id": "a", "text": "زَوْجًا مِنَ الْمَها يَقِفُ بَيْنَهُما شَخْصانِ"}, {"id": "b", "text": "إِنْسانًا يَمْتَطي حِمارًا"}, {"id": "c", "text": "فَهْدَيْنِ يَفْتَرِسانِ غَزالًا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T2-L7', 'الرُّؤْيَةُ الثّانِيَةُ: الْمُسْتَوْطَناتُ الْقَديمَةُ وَالتَّواصُلُ الْحَضارِيُّ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 64–71', true, '🎯 أَتَعَرَّفُ مَواقِعَ الْمُسْتَوْطَناتِ الْقَديمَةِ في هيلي وَأَهَمِّيَّتَهَا الْحَضارِيَّةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ مَواقِعَ الْمُسْتَوْطَناتِ الْقَديمَةِ في هيلي، وَأَهَمِّيَّتَهَا الْحَضارِيَّةَ.',1),('يُوَضِّحُ خَصائِصَ الْمُسْتَوْطَناتِ الْقَديمَةِ في هيلي خِلالَ الْعَصْرَيْنِ الْبُرونْزِيِّ وَالْحَديدِيِّ.',2),('يَتَعَرَّفُ الْمُكْتَشَفاتِ الْأَثَرِيَّةَ في هيلي، وَيَفْهَمُ التَّفاعُلاتِ الْحَضارِيَّةَ لِهيلي مَعَ الْحَضاراتِ الْأُخْرى.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْمُسْتَوْطَناتُ الْقَديمَةُ وَالتَّواصُلُ الْحَضارِيُّ', 'لَقَدْ قامَ سُكّانُ هيلي الْقُدَماءُ بِاسْتِخْدامِ مَعْدِنِ النُّحاسِ وَالتِّجارَةِ بِهِ، وَكانَ هٰذَا الْمَعْدِنُ يَتِمُّ تَبادُلُهُ انْطِلاقًا مِنَ الْمَوانِئِ الْبَحْرِيَّةِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 70)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 64–71', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَقَّبَ مُسْتَوْطَنَةَ هيلي (8) عُلَماءُ آثارٍ:','[{"id": "a", "text": "فَرَنْسِيّونَ"}, {"id": "b", "text": "دَنْماركِيّونَ"}, {"id": "c", "text": "بْريطانِيّونَ"}]'),('يَمْتَدُّ الْعَصْرُ الْحَديدِيُّ مِنْ:','[{"id": "a", "text": "1,300 إِلى 300 ق.م"}, {"id": "b", "text": "3,200 إِلى 1,300 ق.م"}, {"id": "c", "text": "2,500 إِلى 2,000 ق.م"}]'),('عَدَدُ الْمَنازِلِ الْمُكْتَشَفَةِ في مُسْتَوْطَنَةِ هيلي (2):','[{"id": "a", "text": "خَمْسَةَ عَشَرَ مَنْزِلًا"}, {"id": "b", "text": "عِشْرونَ مَنْزِلًا"}, {"id": "c", "text": "ثَمانِيَةُ مَنازِلَ"}]'),('أَطْلَقَ سُكّانُ بِلادِ الرّافِدَيْنِ عَلى مِنْطَقَةِ الْإِماراتِ اسْمَ:','[{"id": "a", "text": "ماجانَ"}, {"id": "b", "text": "دِلْمونَ"}, {"id": "c", "text": "جَمْدَةِ نَصْرٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T2-L8', 'الرُّؤْيَةُ الثّالِثَةُ: الْحَياةُ الْقَديمَةُ في هيلي', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 72–74', true, '🎯 أَتَعَرَّفُ جَوانِبَ الْحَياةِ الْقَديمَةِ في هيلي، وَأُبَيِّنُ دَوْرَ الزِّراعَةِ فيها.' from u
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
       select l.id, v.s, v.n from l, (values ('يَتَعَرَّفُ جَوانِبَ الْحَياةِ الْقَديمَةِ في هيلي.',1),('يُبَيِّنُ دَوْرَ الزِّراعَةِ في تَحْقيقِ الِاسْتيطانِ الْبَشَرِيِّ في هيلي.',2),('يَرْبِطُ الْعَلاقَةَ بَيْنَ الْمُعْتَقَداتِ الدّينِيَّةِ وَمَدافِنِ هيلي وَالْقِطَعِ الْأَثَرِيَّةِ الْمُرْتَبِطَةِ بِها، وَأَنْواعِ الْحِرَفِ الَّتي كانَتْ سائِدَةً آنَذاكَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الْحَياةُ الْقَديمَةُ في هيلي', 'كانَتِ الزِّراعَةُ هِيَ أَساسَ الْحَياةِ في هيلي، فَقَدْ قامَ سُكّانُ هيلي بِزِراعَةِ الْقَمْحِ وَالشَّعيرِ تَحْتَ ظِلالِ أَشْجارِ النَّخيلِ، وَحَفَروا آبارَ الْمِياهِ لِاسْتِخْدامِها في رَيِّ الْمَحاصيلِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 72)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 72–74', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('زَرَعَ سُكّانُ هيلي تَحْتَ ظِلالِ أَشْجارِ النَّخيلِ:','[{"id": "a", "text": "الْقَمْحَ وَالشَّعيرَ"}, {"id": "b", "text": "الْأُرْزَ وَالذُّرَةَ"}, {"id": "c", "text": "الْقُطْنَ وَالْكَتّانَ"}]'),('مِنَ الْحَيَواناتِ الَّتي وُجِدَتْ بَقاياها في مَوْقِعِ هيلي:','[{"id": "a", "text": "الْماشِيَةُ وَالْماعِزُ وَالْأَغْنامُ"}, {"id": "b", "text": "الْخُيولُ وَالْبِغالُ"}, {"id": "c", "text": "الْفُهودُ وَالْغِزْلانُ"}]'),('الْمِهْنَةُ الصِّناعِيَّةُ الَّتي مارَسَها مُجْتَمَعُ هيلي:','[{"id": "a", "text": "تَعْدينُ النُّحاسِ"}, {"id": "b", "text": "صِناعَةُ الزُّجاجِ"}, {"id": "c", "text": "نَسْجُ الْحَريرِ"}]'),('بَنى أَهالي الْعَيْنِ بُيوتَهُمْ وَمَبانِيَهُمْ مِنَ:','[{"id": "a", "text": "الطّوبِ الطّينِيِّ"}, {"id": "b", "text": "الْحَجَرِ الْجيرِيِّ"}, {"id": "c", "text": "جُذوعِ النَّخيلِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T2-L9', 'الرُّؤْيَةُ الرّابِعَةُ: النُّحاسُ في الْعَيْنِ خِلالَ الْعَصْرِ الْبُرونْزِيِّ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 75–77', true, '🎯 أُفَسِّرُ أَهَمِّيَّةَ النُّحاسِ في تَطَوُّرِ الْحَياةِ الِاقْتِصادِيَّةِ وَالِاجْتِماعِيَّةِ لِسُكّانِ هيلي.' from u
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
       select l.id, v.s, v.n from l, (values ('يُفَسِّرُ أَهَمِّيَّةَ النُّحاسِ في تَطَوُّرِ الْحَياةِ الِاقْتِصادِيَّةِ وَالِاجْتِماعِيَّةِ لَدى سُكّانِ الْمُسْتَوْطَناتِ في هيلي.',1),('يُحَدِّدُ الْأَماكِنَ الَّتي اكْتُشِفَتْ فيها آثارُ اسْتِخْراجِ النُّحاسِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ.',2),('يُحَلِّلُ دَوْرَ النُّحاسِ في تَنْمِيَةِ التِّجارَةِ مَعَ الْمَراكِزِ الْحَضارِيَّةِ الْمَحَلِّيَّةِ وَالْمُجاوِرَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: النُّحاسُ في الْعَيْنِ خِلالَ الْعَصْرِ الْبُرونْزِيِّ', 'وَكانَ الْعُمّالُ يَقومونَ بِحَفْرِ الْخَنادِقِ لِاسْتِخْراجِ خامِ النُّحاسِ، حَيْثُ يَتِمُّ تَفْتيتُهُ إِلى قِطَعٍ صَغيرَةٍ، وَبَعْدَها تَتِمُّ عَمَلِيَّةُ صَهْرِهِ بِدَرَجَةِ حَرارَةٍ عالِيَةٍ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 77)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 75–77', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَعودُ الدَّلائِلُ الْأولى عَلى تَعْدينِ النُّحاسِ في الْمِنْطَقَةِ إِلى:','[{"id": "a", "text": "3,000 سَنَةٍ قَبْلَ الْميلادِ"}, {"id": "b", "text": "5,000 سَنَةٍ قَبْلَ الْميلادِ"}, {"id": "c", "text": "1,300 سَنَةٍ قَبْلَ الْميلادِ"}]'),('تَبَيَّنَ مِنَ التَّحاليلِ أَنَّ الْعَيِّناتِ الْمَعْدِنِيَّةَ تَشْتَمِلُ عَلى خَليطٍ مِنَ النُّحاسِ وَ:','[{"id": "a", "text": "الزِّرْنيخِ"}, {"id": "b", "text": "الْقَصْديرِ"}, {"id": "c", "text": "الرَّصاصِ"}]'),('يُسْكَبُ الْمَعْدِنُ الْمُنْصَهِرُ في قَوالِبَ خاصَّةٍ لِيُصْنَعَ مِنْهُ:','[{"id": "a", "text": "الْأَسْلِحَةُ وَالْأَدَواتُ الزِّراعِيَّةُ"}, {"id": "b", "text": "الْأَواني الْفَخّارِيَّةُ"}, {"id": "c", "text": "الطّوبُ الطّينِيُّ"}]'),('عَدَدُ أَفْرانِ النُّحاسِ الْإِسْلامِيَّةِ الَّتي عُثِرَ عَلَيْها في مَوْقِعٍ واحِدٍ:','[{"id": "a", "text": "سَبْعونَ فُرْنًا"}, {"id": "b", "text": "خَمْسَةَ عَشَرَ فُرْنًا"}, {"id": "c", "text": "مِئَةُ فُرْنٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 2, 4, 'الْوَحْدَةُ الرّابِعَةُ: مَوْقِعُ بَدْعِ بِنْتِ سَعّودٍ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=2
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T2-L10', 'الرُّؤْيَةُ الْأولى: التَّطَوُّرُ الْحَضارِيُّ في مَوْقِعِ بَدْعِ بِنْتِ سَعّودٍ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 82–88', true, '🎯 أُفَسِّرُ الِازْدِهارَ الْحَضارِيَّ لِمَوْقِعِ بَدْعِ بِنْتِ سَعّودٍ في فَتْرَةِ الْعَصْرِ الْحَديدِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُفَسِّرُ الِازْدِهارَ الْحَضارِيَّ لِمَوْقِعِ بَدْعِ بِنْتِ سَعّودٍ في فَتْرَةِ الْعَصْرِ الْحَديدِيِّ.',1),('يَتَعَرَّفُ الْمُكْتَشَفاتِ الْأَثَرِيَّةَ الَّتي عُثِرَ عَلَيْها في الْمَوْقِعِ.',2),('يُبَيِّنُ أَهَمِّيَّةَ الْأَفْلاجِ في مَوْقِعِ بَدْعِ بِنْتِ سَعّودٍ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: التَّطَوُّرُ الْحَضارِيُّ في مَوْقِعِ بَدْعِ بِنْتِ سَعّودٍ', 'وَبِالرَّغْمِ مِنْ أَنَّ هٰذَا الْمَبْنى يوصَفُ بِأَنَّهُ «بِنايَةٌ عامَّةٌ» إِلّا أَنَّ وَظيفَتَهُ كانَتْ عَلَى الْأَرْجَحِ إِدارَةَ شُؤونِ مِياهِ الْفَلَجِ الَّذي كانَ بِالْقُرْبِ مِنْهُ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 86)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 82–88', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَقَعُ مَوْقِعُ بَدْعِ بِنْتِ سَعّودٍ شَمالَ الْعَيْنِ عَلى بُعْدِ:','[{"id": "a", "text": "اثْنَيْ عَشَرَ كيلومِتْرًا"}, {"id": "b", "text": "أَرْبَعَةَ عَشَرَ كيلومِتْرًا"}, {"id": "c", "text": "خَمْسينَ كيلومِتْرًا"}]'),('عَدَدُ الْمَدافِنِ الَّتي عُثِرَ عَلَيْها في الْمَوْقِعِ:','[{"id": "a", "text": "أَكْثَرُ مِنْ أَرْبَعينَ مَدْفَنًا"}, {"id": "b", "text": "ثَمانِيَةَ عَشَرَ مَدْفَنًا"}, {"id": "c", "text": "خَمْسَةُ مَدافِنَ"}]'),('يَسْتَنِدُ سَقْفُ الْمَبْنَى الْإِدارِيِّ عَلى:','[{"id": "a", "text": "اثْنَيْ عَشَرَ عَمودًا"}, {"id": "b", "text": "أَرْبَعَةِ أَعْمِدَةٍ"}, {"id": "c", "text": "عِشْرينَ عَمودًا"}]'),('تَعودُ آبارُ الْفَلَجِ وَقَنَواتُهُ الْجَوْفِيَّةُ في الْمَوْقِعِ إِلى:','[{"id": "a", "text": "أَلْفِ سَنَةٍ قَبْلَ الْميلادِ"}, {"id": "b", "text": "ثَلاثَةِ آلافِ سَنَةٍ قَبْلَ الْميلادِ"}, {"id": "c", "text": "خَمْسَةِ آلافِ سَنَةٍ قَبْلَ الْميلادِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T2-L11', 'الرُّؤْيَةُ الثّانِيَةُ: الرُّسوماتُ وَالنُّقوشُ الصَّخْرِيَّةُ في بَدْعِ بِنْتِ سَعّودٍ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 89–93', true, '🎯 أُحَلِّلُ أَهَمِّيَّةَ الرُّسوماتِ وَالنُّقوشِ في كُهوفِ بَدْعِ بِنْتِ سَعّودٍ.' from u
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
       select l.id, v.s, v.n from l, (values ('يُحَلِّلُ أَهَمِّيَّةَ الرُّسوماتِ وَالنُّقوشِ في كُهوفِ بَدْعِ بِنْتِ سَعّودٍ.',1),('يُوَضِّحُ مُمَيِّزاتِ وَخَصائِصَ الرُّسوماتِ وَالنُّقوشِ الصَّخْرِيَّةِ في بَدْعِ بِنْتِ سَعّودٍ.',2),('يُقَدِّرُ قيمَةَ النُّقوشِ الْقَديمَةِ بِوَصْفِها مَصْدَرًا مِنَ الْمَصادِرِ التّاريخِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الرُّسوماتُ وَالنُّقوشُ الصَّخْرِيَّةُ في بَدْعِ بِنْتِ سَعّودٍ', 'تَكْتَسِبُ النُّقوشُ الْقَديمَةُ أَهَمِّيَّةً كَبيرَةً مِنْ حَيْثُ إِنَّها ثَرْوَةٌ تاريخِيَّةٌ مُفيدَةٌ مَهْما كانَ مَوْضوعُها، فَهِيَ تُسَجِّلُ حَياةَ أَصْحابِها وَطُرُقَ مَعيشَتِهِمْ وَعاداتِهِمْ وَعَقائِدِهِمْ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 93)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 89–93', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَتَمَيَّزُ رُسوماتُ بَدْعِ بِنْتِ سَعّودٍ بِاللَّوْنِ:','[{"id": "a", "text": "الْأَحْمَرِ أَوِ الرَّمادِيِّ الْغامِقِ"}, {"id": "b", "text": "الْأَزْرَقِ وَالْأَخْضَرِ"}, {"id": "c", "text": "الْأَبْيَضِ وَحْدَهُ"}]'),('مِنَ الْحَيَواناتِ الَّتي صُوِّرَتْ في النُّقوشِ الصَّخْرِيَّةِ:','[{"id": "a", "text": "الثَّوْرُ وَالْمَها وَالْأَغْنامُ"}, {"id": "b", "text": "الْخَيْلُ وَالْجِمالُ"}, {"id": "c", "text": "الْأَسَدُ وَالنَّمِرُ"}]'),('تَتَكَرَّرُ نُقوشُ الْأَفاعي أَيْضًا في مَوْقِعِ:','[{"id": "a", "text": "الْقُصَيْصِ في دُبَيَّ"}, {"id": "b", "text": "تَلِّ أَبْرَقَ في أُمِّ الْقَيْوَيْنِ"}, {"id": "c", "text": "جَزيرَةِ أُمِّ النّارِ"}]'),('يَعودُ تاريخُ نُقوشِ الْأَسْلِحَةِ في الْمَوْقِعِ عَلَى الْأَرْجَحِ إِلَى الْعَصْرِ:','[{"id": "a", "text": "الْحَديدِيِّ"}, {"id": "b", "text": "الْبُرونْزِيِّ"}, {"id": "c", "text": "الْحَجَرِيِّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 11, 2, 5, 'الْوَحْدَةُ الْخامِسَةُ: الْواحاتُ وَالْأَفْلاجُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=11 and term=2
                  and sort_order=5 and track='native');

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y11-T2-L12', 'الرُّؤْيَةُ الْأولى: واحاتُ الْعَيْنِ — تاريخُها وَمُكَوِّناتُها', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 98–109', true, '🎯 أَسْتَنْتِجُ الْأَهَمِّيَّةَ التّاريخِيَّةَ لِواحاتِ الْعَيْنِ، وَأُوَضِّحُ كَيْفِيَّةَ بِناءِ الْأَفْلاجِ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَسْتَنْتِجُ الْأَهَمِّيَّةَ التّاريخِيَّةَ لِواحاتِ الْعَيْنِ.',1),('يُوَضِّحُ كَيْفِيَّةَ بِناءِ الْأَفْلاجِ في واحاتِ الْعَيْنِ.',2),('يُدَلِّلُ عَلى أَهَمِّيَّةِ أَشْجارِ النَّخيلِ في النِّظامِ الزِّراعِيِّ في واحاتِ الْعَيْنِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: واحاتُ الْعَيْنِ — تاريخُها وَمُكَوِّناتُها', 'وَيَعْتَمِدُ نِظامُ الْفَلَجِ عَلى نَقْلِ الْمِياهِ الْجَوْفِيَّةِ مِنْ تَحْتِ الْأَرْضِ إِلَى السَّطْحِ عَبْرَ الْأَنْفاقِ الْأُفُقِيَّةِ الطَّويلَةِ. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 100)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 98–109', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَعْني الْفَلَجُ في اللُّغَةِ:','[{"id": "a", "text": "الْجَدْوَلَ الصَّغيرَ أَوِ النَّبْعَ"}, {"id": "b", "text": "الْبِئْرَ الْعَميقَةَ"}, {"id": "c", "text": "الْحَوْضَ الْمَكْشوفَ"}]'),('تَبْدَأُ مَراحِلُ بِناءِ الْفَلَجِ بِحَفْرِ:','[{"id": "a", "text": "أُمِّ الْفَلَجِ"}, {"id": "b", "text": "الثُّقابِ"}, {"id": "c", "text": "الْقَناةِ الرَّئيسَةِ"}]'),('يُسَمَّى الْحَوْضُ الْمَكْشوفُ الَّذي تَنْتَهي إِلَيْهِ الْقَناةُ الرَّئيسَةُ:','[{"id": "a", "text": "الشَّريعَةَ"}, {"id": "b", "text": "الْعامِدَ"}, {"id": "c", "text": "الثُّقْبَ"}]'),('عَدَدُ طَبَقاتِ النِّظامِ الزِّراعِيِّ في الْواحَةِ:','[{"id": "a", "text": "ثَلاثُ طَبَقاتٍ"}, {"id": "b", "text": "طَبَقَتانِ"}, {"id": "c", "text": "أَرْبَعُ طَبَقاتٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y11-T2-L13', 'الرُّؤْيَةُ الثّانِيَةُ: الْعَيْنُ مَدينَةُ الْواحاتِ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 110–115', true, '🎯 أُبَيِّنُ الْبُعْدَ التّاريخِيَّ وَالتُّراثِيَّ لِواحاتِ الْعَيْنِ، وَأُناقِشُ جُهودَ الْقِيادَةِ في الْحِفاظِ عَلَيْها.' from u
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
       select l.id, v.s, v.n from l, (values ('يُبَيِّنُ الْبُعْدَ التّاريخِيَّ وَالتُّراثِيَّ لِواحاتِ الْعَيْنِ.',1),('يُفَسِّرُ أَثَرَ واحاتِ الْعَيْنِ في تَحْقيقِ التَّفاعُلِ وَالِانْسِجامِ بَيْنَ أَفْرادِ مُجْتَمَعِ مَدينَةِ الْعَيْنِ.',2),('يُناقِشُ جُهودَ الشَّيْخِ زايِدِ بْنِ سُلْطانٍ آلِ نَهْيانَ -رَحِمَهُ اللهُ- في مَجالِ الْحِفاظِ عَلى أَفْلاجِ وَواحاتِ مَدينَةِ الْعَيْنِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْعَيْنُ مَدينَةُ الْواحاتِ', 'إِنَّ مِياهَ الْأَفْلاجِ الْآتِيَةَ مِنْ جَوْفِ الْأَرْضِ حَقٌّ لِكُلِّ النّاسِ؛ أُريدُ أَنْ تُصْبِحَ السِّقايَةُ مِنْ مِياهِ الْأَفْلاجِ مَشاعًا لِلْجَميعِ، فُقَراءَ وَأَغْنِياءَ. (الشَّيْخُ زايِدُ بْنُ سُلْطانٍ آلُ نَهْيانَ -رَحِمَهُ اللهُ-، حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 113)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 110–115', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَسَلَّمَ الشَّيْخُ زايِدٌ مَنْصِبَ مُمَثِّلِ الْحاكِمِ في مِنْطَقَةِ الْعَيْنِ عامَ:','[{"id": "a", "text": "1946م"}, {"id": "b", "text": "1993م"}, {"id": "c", "text": "2005م"}]'),('عَدَدُ الْمَباني التّاريخِيَّةِ الْقائِمَةِ في واحاتِ الْعَيْنِ:','[{"id": "a", "text": "68 مَبْنًى"}, {"id": "b", "text": "23 مَبْنًى"}, {"id": "c", "text": "17 مَبْنًى"}]'),('اسْتَغْرَقَ الْعَمَلُ في فَلَجِ الصّاروجِ قُرابَةَ:','[{"id": "a", "text": "ثَمانِيَةَ عَشَرَ عامًا"}, {"id": "b", "text": "ثَمانِيَةِ أَعْوامٍ"}, {"id": "c", "text": "ثَلاثينَ عامًا"}]'),('صَدَرَ الْقَرارُ رَقْمُ (38) بِشَأْنِ الْحِفاظِ عَلى واحاتِ النَّخيلِ سَنَةَ:','[{"id": "a", "text": "2005م"}, {"id": "b", "text": "1993م"}, {"id": "c", "text": "2016م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y11-T2-L14', 'الرُّؤْيَةُ الثّالِثَةُ: واحاتُ الْعَيْنِ السِّتُّ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 116–133', true, '🎯 أَعْتَزُّ بِافْتِتاحِ واحَةِ الْعَيْنِ أَوَّلَ مَوْقِعٍ إِماراتِيٍّ مُدْرَجٍ عَلى لائِحَةِ التُّراثِ الْعالَمِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('يَعْتَزُّ بِافْتِتاحِ واحَةِ الْعَيْنِ كَأَوَّلِ مَوْقِعٍ مِنْ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ الْمُدْرَجَةِ عَلى لائِحَةِ التُّراثِ الْعالَمِيِّ في الْيونِسْكو.',1),('يُبَيِّنُ أَهْدافَ الْمَرْكَزِ الْبيئِيِّ في واحَةِ الْعَيْنِ.',2),('يَتَعَرَّفُ أَهَمَّ الْمَباني التُّراثِيَّةِ في واحاتِ الْعَيْنِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: واحاتُ الْعَيْنِ السِّتُّ', 'افْتَتَحَتْ دائِرَةُ الثَّقافَةِ وَالسِّياحَةِ «واحَةَ الْعَيْنِ» كَأَوَّلِ مَوْقِعٍ مِنْ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ الْمُدْرَجَةِ عَلى قائِمَةِ الْيونِسْكو لِلتُّراثِ الْعالَمِيِّ في الدَّوْلَةِ رَسْمِيًّا في نوفَمْبَرَ عامَ 2016م. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 116)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 116–133', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ النَّخيلِ في واحَةِ الْعَيْنِ يَزيدُ عَلى:','[{"id": "a", "text": "143,000 نَخْلَةٍ"}, {"id": "b", "text": "60,000 نَخْلَةٍ"}, {"id": "c", "text": "120,000 نَخْلَةٍ"}]'),('ثاني أَكْبَرِ واحَةٍ في مَدينَةِ الْعَيْنِ:','[{"id": "a", "text": "واحَةُ هيلي"}, {"id": "b", "text": "واحَةُ الْقَطّارَةِ"}, {"id": "c", "text": "واحَةُ الْجيمي"}]'),('تُسَمَّى الْواحَةُ الَّتي يَخْتَرِقُها فَلَجٌ بِامْتِدادِ 6 كم تَحْتَ الْأَرْضِ:','[{"id": "a", "text": "الْمُعْتَرِضَ"}, {"id": "b", "text": "الْمُوَيْجِعي"}, {"id": "c", "text": "الْقَطّارَةَ"}]'),('تَمَّ تَحْويلُ الْحِصْنِ الشَّرْقِيِّ إِلى مُتْحَفٍ في عامِ:','[{"id": "a", "text": "1969م"}, {"id": "b", "text": "1922م"}, {"id": "c", "text": "1971م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=11 and term=2
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y11-T2-L15', 'الرُّؤْيَةُ الرّابِعَةُ: الْحَياةُ الِاقْتِصادِيَّةُ وَالِاجْتِماعِيَّةُ في واحاتِ الْعَيْنِ', 3, 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 134–152', true, '🎯 أَسْتَعْرِضُ نِظامَ الْعَمَلِ الزِّراعِيِّ في واحاتِ الْعَيْنِ، وَأُوَضِّحُ الْمَظاهِرَ الِاجْتِماعِيَّةَ فيها.' from u
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
       select l.id, v.s, v.n from l, (values ('يُحَلِّلُ الْخَصائِصَ الطَّبيعِيَّةَ لِواحاتِ الْعَيْنِ، وَمَدى تَأْثيرِها عَلى حَياةِ أَهالي مَدينَةِ الْعَيْنِ.',1),('يَسْتَعْرِضُ نِظامَ الْعَمَلِ الزِّراعِيِّ في واحاتِ الْعَيْنِ.',2),('يُوَضِّحُ الْمَظاهِرَ الِاجْتِماعِيَّةَ الَّتي كانَتْ سائِدَةً في مُجْتَمَعِ واحاتِ الْعَيْنِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الْحَياةُ الِاقْتِصادِيَّةُ وَالِاجْتِماعِيَّةُ في واحاتِ الْعَيْنِ', 'إِنَّ مِنْ أَبْرَزِ أَنْواعِ التَّكافُلِ الِاجْتِماعِيِّ الَّتي كانَتْ سائِدَةً في مُجْتَمَعِ واحاتِ الْعَيْنِ، ما يُعْرَفُ بِنِظامِ الْفَزْعَةِ الَّذي يَقومُ بِهِ الْأَفْرادُ لِرِعايَةِ بَعْضِهِمْ بَعْضًا. (حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ، ص 142)', 'حَقيبَةُ مَواقِعِ الْعَيْنِ الثَّقافِيَّةِ ص 134–152', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y11-T2-L15/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 11, 2, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ مُسْتَوَياتِ الزِّراعَةِ في مَزارِعِ الْواحاتِ:','[{"id": "a", "text": "ثَلاثَةُ مُسْتَوَياتٍ"}, {"id": "b", "text": "مُسْتَوَيانِ"}, {"id": "c", "text": "أَرْبَعَةُ مُسْتَوَياتٍ"}]'),('يُسَمَّى مَنْ تُسْنَدُ إِلَيْهِ مَسْؤولِيَّةُ تَوْزيعِ مِياهِ الْفَلَجِ:','[{"id": "a", "text": "الْعَريفَ"}, {"id": "b", "text": "الْبَيْدارَ"}, {"id": "c", "text": "قاضيَ الْأَعْرافِ"}]'),('يُعْرَفُ نِظامُ التَّكافُلِ الِاجْتِماعِيِّ في واحاتِ الْعَيْنِ بِـ:','[{"id": "a", "text": "الْفَزْعَةِ"}, {"id": "b", "text": "الْمَقيظِ"}, {"id": "c", "text": "التَّنْبيتِ"}]'),('تَتِمُّ عَمَلِيَّةُ تَلْقيحِ النَّخيلِ في فَصْلِ:','[{"id": "a", "text": "الصَّيْفِ"}, {"id": "b", "text": "الشِّتاءِ"}, {"id": "c", "text": "الْخَريفِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;