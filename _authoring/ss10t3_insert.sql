begin;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 3, 1, 'الْوَحْدَةُ الْأولى: الِاتِّجاهاتُ الْمُسْتَقْبَلِيَّةُ لِلطّاقَةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=3
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T3-L1', 'الرُّؤْيَةُ الْأولى: اتِّجاهاتٌ في أَسْواقِ الطّاقَةِ وَالْجُغْرافْيا السِّياسِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 24–27', true, '🎯 أُناقِشُ الْعَلاقَةَ بَيْنَ أَسْواقِ الطّاقَةِ وَالْجُغْرافْيَا السِّياسِيَّةِ، وَأُقَدِّرُ جُهودَ الْإِماراتِ الْمُسْتَقْبَلِيَّةَ في مَجالِ الطّاقَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ الْعَلاقَةَ بَيْنَ أَسْواقِ الطّاقَةِ وَالْجُغْرافْيَا السِّياسِيَّةِ في الْوَقْتِ الْحاضِرِ.',1),('أُقَدِّرُ جُهودَ دَوْلَةِ الْإِماراتِ الْمُسْتَقْبَلِيَّةَ في مَجالِ الطّاقَةِ.',2),('أُوَضِّحُ أَثَرَ اسْتِغْلالِ الْمَصادِرِ غَيْرِ التَّقْليدِيَّةِ وَدَوْرَ مُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: اتِّجاهاتٌ في أَسْواقِ الطّاقَةِ وَالْجُغْرافْيا السِّياسِيَّةِ', 'يَشْهَدُ الْعالَمُ في الْوَقْتِ الْحاضِرِ تَفاعُلًا بَيْنَ أَسْواقِ الطّاقَةِ وَالْعَوامِلِ الْجْيوسِياسِيَّةِ، وَخاصَّةً في مِنْطَقَةِ الشَّرْقِ الْأَوْسَطِ؛ نَتيجَةً لِلتَّنافُسِ الدَّوْلِيِّ عَلى مَصادِرِ الطّاقَةِ، وَسَعَتْ بَعْضُ الدُّوَلِ لِتَحْقيقِ اسْتِقْلالِها في هٰذَا الْمَجالِ عَنْ طَريقِ اسْتِغْلالِ مَصادِرَ غَيْرِ تَقْليدِيَّةٍ لِلطّاقَةِ، في حينِ تَغَيَّرَتْ أَنْماطُ اسْتِغْلالِ الطّاقَةِ في دُوَلٍ أُخْرى. (كِتابُ النَّشاطِ، ص 24)', 'كِتابُ النَّشاطِ ص 24–27', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نَصيبُ الشَّرْقِ الْأَوْسَطِ مِنِ احْتِياطِيّاتِ النَّفْطِ الْخامِ عامَ 2015 م:','[{"id": "a", "text": "47.7%"}, {"id": "b", "text": "19.4%"}, {"id": "c", "text": "13.7%"}]'),('يَبْلُغُ طولُ خَطِّ أَنابيبِ الْغازِ نابوكو:','[{"id": "a", "text": "3300 كم"}, {"id": "b", "text": "1700 كم"}, {"id": "c", "text": "600 كم"}]'),('أُنْشِئَ مُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ عَلى غِرارِ:','[{"id": "a", "text": "مُنَظَّمَةِ الْأوبِكِ"}, {"id": "b", "text": "وَكالَةِ إيرينا"}, {"id": "c", "text": "الِاتِّحادِ الْأوروبّيِّ"}]'),('مَجْموعُ احْتِياطِيّاتِ الْعالَمِ مِنَ النَّفْطِ الْخامِ عامَ 2015 م:','[{"id": "a", "text": "1.7 تْريليونِ بَرْميلٍ"}, {"id": "b", "text": "10.9 مِلْيارِ بَرْميلٍ"}, {"id": "c", "text": "31 مِلْيارَ بَرْميلٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T3-L2', 'الرُّؤْيَةُ الثّانِيَةُ: تَوَجُّهاتُ الطّاقَةِ في الْمُسْتَقْبَلِ وَتَطَوُّراتُ السّوقِ', 3, 'كِتابُ النَّشاطِ ص 28–31', true, '🎯 أَتَعَرَّفُ الْمَفاهيمَ الِاقْتِصادِيَّةَ لِلطّاقَةِ، وَأُوَضِّحُ مَشْروعاتِ الْإِماراتِ لِتَلْبِيَةِ احْتِياجاتِهَا الْمُسْتَقْبَلِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الْمَفاهيمَ الِاقْتِصادِيَّةَ: الطّاقَةُ الْأَحْفورِيَّةُ وَالْغازُ الْمُسالُ وَالطّاقَةُ الْمُتَجَدِّدَةُ.',1),('أُناقِشُ جُهودَ شَخْصِيَّةٍ إِماراتِيَّةٍ أَسْهَمَتْ في تَطْويرِ الِاقْتِصادِ الْوَطَنِيِّ وَالْعالَمِيِّ.',2),('أُوَضِّحُ جُهودَ الدَّوْلَةِ في إيجادِ حُلولٍ عَمَلِيَّةٍ لِقَضايا مُجْتَمَعِهَا التَّنْمَوِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: تَوَجُّهاتُ الطّاقَةِ في الْمُسْتَقْبَلِ وَتَطَوُّراتُ السّوقِ', 'شَهِدَ إِنْتاجُ وَتَوْزيعُ مَواردِ الطّاقَةِ في الْعالَمِ تَحَوُّلًا فِعْلِيًّا، أَحْدَثَهُ التَّطَوُّرُ التِّجارِيُّ لِلْمَصادِرِ غَيْرِ الْمُسْتَغَلَّةِ في السّابِقِ، وَباتَتْ آثارُ هٰذِهِ التَّطَوُّراتِ في الْأَسْواقِ وَإِنْتاجِ الطّاقَةِ التَّقْليدِيَّةِ مَحْسوسَةً بِشَكْلٍ جَذْرِيٍّ؛ لِذا سَعَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ لِوَضْعِ اسْتِراتيجِيّاتٍ بَعيدَةِ الْمَدى لِلطّاقَةِ، لِلْمُحافَظَةِ عَلَى النُّمُوِّ الِاقْتِصادِيِّ الْمُسْتَدامِ. (كِتابُ النَّشاطِ، ص 28)', 'كِتابُ النَّشاطِ ص 28–31', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('نِسْبَةُ الْغازِ الطَّبيعِيِّ في خَليطِ الطّاقَةِ الْمُسْتَهْدَفِ عامَ 2020 م:','[{"id": "a", "text": "70%"}, {"id": "b", "text": "25%"}, {"id": "c", "text": "5%"}]'),('عُقِدَتِ الْخَلْوَةُ الْوِزارِيَّةُ الَّتي أُطْلِقَتْ فيها اسْتِراتيجِيَّةُ ما بَعْدَ النَّفْطِ في:','[{"id": "a", "text": "يَنايِرَ 2016 م"}, {"id": "b", "text": "أَبْريلَ 2016 م"}, {"id": "c", "text": "يَنايِرَ 2020 م"}]'),('يُسْهِمُ مُجَمَّعُ الْغازِ الْحامِضِ في شاهٍ بِنَحْوِ:','[{"id": "a", "text": "10% مِنْ إِنْتاجِ الدَّوْلَةِ مِنَ الْغازِ"}, {"id": "b", "text": "25%"}, {"id": "c", "text": "70%"}]'),('الطّاقَةُ الَّتي يَتِمُّ الْحُصولُ عَلَيْها بِالتَّنْقيبِ في باطِنِ الْأَرْضِ هِيَ:','[{"id": "a", "text": "الطّاقَةُ الْأَحْفورِيَّةُ"}, {"id": "b", "text": "الطّاقَةُ الْمُتَجَدِّدَةُ"}, {"id": "c", "text": "الطّاقَةُ النَّوَوِيَّةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T3-L3', 'الرُّؤْيَةُ الثّالِثَةُ: تَحَدِّياتُ الطّاقَةِ الْعالَمِيَّةِ وَالْفُرَصُ النّاشِئَةُ', 3, 'كِتابُ النَّشاطِ ص 32–35', true, '🎯 أُناقِشُ التَّحَدِّياتِ الَّتي تُواجِهُ صِناعَةَ الطّاقَةِ الْعالَمِيَّةَ، وَأُبَيِّنُ اسْتِجابَتَها وَالْفُرَصَ النّاشِئَةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُناقِشُ التَّحَدِّياتِ الَّتي تُواجِهُ صِناعَةَ الطّاقَةِ الْعالَمِيَّةَ في الْمُسْتَقْبَلِ الْقَريبِ.',1),('أُبَيِّنُ أَثَرَ تَذَبْذُبِ أَسْعارِ النَّفْطِ الْعالَمِيَّةِ في خُطَطِ التَّنْمِيَةِ في الْإِماراتِ.',2),('أُبْدي رَأْيًا حَوْلَ خُطَطِ الِاتِّحادِ الْأوروبّيِّ لِتَأْمينِ احْتِياجاتِهِ مِنْ مَصادِرِ الطّاقَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: تَحَدِّياتُ الطّاقَةِ الْعالَمِيَّةِ وَالْفُرَصُ النّاشِئَةُ', 'يَتَطَلَّبُ مَشْهَدُ الطّاقَةِ الْجَديدُ دِبْلوماسِيَّةً أَكْثَرَ مُرونَةً مِمّا كانَ عَلَيْهِ الْأَمْرُ في الْماضي؛ وَذٰلِكَ لِضَمانِ أَمْنِ الطّاقَةِ بِوَجْهٍ خاصٍّ، وَالْأَمْنِ الْعالَمِيِّ بِوَجْهٍ عامٍّ؛ لِأَنَّ قَضايَا الطّاقَةِ تَسْتَنِدُ بِشَكْلٍ واضِحٍ إِلَى الْجُغْرافْيا السِّياسِيَّةِ. (كِتابُ النَّشاطِ، ص 32)', 'كِتابُ النَّشاطِ ص 32–35', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تُسْهِمُ الْقِطاعاتُ غَيْرُ النَّفْطِيَّةِ في النّاتِجِ الْمَحَلِّيِّ لِلْإِماراتِ بِقَرابَةِ:','[{"id": "a", "text": "69%"}, {"id": "b", "text": "47.7%"}, {"id": "c", "text": "25%"}]'),('«إيرينا» هِيَ:','[{"id": "a", "text": "الْوَكالَةُ الدَّوْلِيَّةُ لِلطّاقَةِ الْمُتَجَدِّدَةِ"}, {"id": "b", "text": "مُنَظَّمَةُ الْأوبِكِ"}, {"id": "c", "text": "صُنْدوقُ النَّقْدِ الدَّوْلِيِّ"}]'),('الْمُشْكِلَةُ الرَّئيسَةُ الَّتي تَنْبَثِقُ مِنْها تَحَدِّياتُ صِناعَةِ الطّاقَةِ:','[{"id": "a", "text": "زِيادَةُ الطَّلَبِ الْعالَمِيِّ عَلَى الطّاقَةِ"}, {"id": "b", "text": "نُدْرَةُ الْمِياهِ"}, {"id": "c", "text": "تَراجُعُ عَدَدِ السُّكّانِ"}]'),('مِنْ مَفاهيمِ تَحَدِّياتِ الطّاقَةِ الْأَرْبَعَةِ:','[{"id": "a", "text": "أَمْنُ الْعَرْضِ وَأَمْنُ الطَّلَبِ"}, {"id": "b", "text": "الْبِطالَةُ وَالتَّضَخُّمُ"}, {"id": "c", "text": "الْخُصوبَةُ وَالْهِجْرَةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 3, 2, 'الْوَحْدَةُ الثّانِيَةُ: طَفْرَةُ النَّفْطِ وَالْغازِ غَيْرِ التَّقْليدِيِّ في الْوِلاياتِ الْمُتَّحِدَةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=3
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T3-L4', 'الرُّؤْيَةُ الْأولى: عَوامِلُ الِاسْتِقْلالِ في مَجالِ الطّاقَةِ', 3, 'كِتابُ النَّشاطِ ص 38–43', true, '🎯 أَتَعَرَّفُ مَصادِرَ الطّاقَةِ الْمُتَوافِرَةَ في قارَّةِ أَمْريكا الشَّمالِيَّةِ، وَأُلَخِّصُ أَسْبابَ عَدَمِ تَحْقيقِ الِاسْتِقْلالِ في مَجالِ الطّاقَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَصادِرَ الطّاقَةِ الْمُتَوافِرَةَ في قارَّةِ أَمْريكا الشَّمالِيَّةِ.',1),('أُقارِنُ بَيْنَ التَّجْرِبَةِ الِاتِّحادِيَّةِ في كُلٍّ مِنْ دَوْلَةِ الْإِماراتِ وَالْوِلاياتِ الْمُتَّحِدَةِ.',2),('أُلَخِّصُ عَوامِلَ عَدَمِ تَحْقيقِ مُسْتَقْبَلٍ مُسْتَقِلٍّ في مَجالِ الطّاقَةِ هُناكَ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: عَوامِلُ الِاسْتِقْلالِ في مَجالِ الطّاقَةِ', 'أَمْريكا الشَّمالِيَّةُ قارَّةٌ مِنْ قارّاتِ الْعالَمِ الْجَديدِ، تَحْتَوي أَراضيها وَالْمُسَطَّحاتُ الْمائِيَّةُ الْمُحيطَةُ بِها عَلَى الْكَثيرِ مِنَ الثَّرَواتِ الطَّبيعِيَّةِ، وَتَتَشَكَّلُ مِنْ ثَلاثِ دُوَلٍ تَرْتَبِطُ فيما بَيْنَها بِرَوابِطَ اقْتِصادِيَّةٍ عَديدَةٍ مِنْ خِلالِ التَّبادُلِ التِّجارِيِّ. (كِتابُ النَّشاطِ، ص 38)', 'كِتابُ النَّشاطِ ص 38–43', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَدَدُ الدُّوَلِ الَّتي تَتَشَكَّلُ مِنْها قارَّةُ أَمْريكا الشَّمالِيَّةِ:','[{"id": "a", "text": "ثَلاثُ دُوَلٍ"}, {"id": "b", "text": "دَوْلَتانِ"}, {"id": "c", "text": "خَمْسُ دُوَلٍ"}]'),('يُسْتَخْدَمُ خامُ بِرِنْتَ مِعْيارًا لِتَسْعيرِ:','[{"id": "a", "text": "ثُلُثَيْ إِنْتاجِ النَّفْطِ الْعالَمِيِّ"}, {"id": "b", "text": "ثُلُثِ الْإِنْتاجِ"}, {"id": "c", "text": "الْإِنْتاجِ كُلِّهِ"}]'),('نِسْبَةُ الْكِبْريتِ في خامِ بِرِنْتَ:','[{"id": "a", "text": "0.37%"}, {"id": "b", "text": "3.8%"}, {"id": "c", "text": "15%"}]'),('مِنْ أَمْثِلَةِ النِّظامِ الْفيدِرالِيِّ الِاتِّحادِيِّ:','[{"id": "a", "text": "الْإِماراتُ وَالْوِلاياتُ الْمُتَّحِدَةُ وَكَنَدا"}, {"id": "b", "text": "فَرَنْسا وَالْيابانُ"}, {"id": "c", "text": "قَطَرُ وَالْكُوَيْتُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T3-L5', 'الرُّؤْيَةُ الثّانِيَةُ: الْأَسْواقُ وَالْحُكومَةُ في حالَةِ تَطَوُّرِ النَّفْطِ وَالْغازِ غَيْرِ التَّقْليدِيَّيْنِ', 3, 'كِتابُ النَّشاطِ ص 44–47', true, '🎯 أَسْتَخْلِصُ دَوْرَ الْقِطاعِ الْخاصِّ وَالْحُكومَةِ الْفيدِرالِيَّةِ في مَجالِ الطّاقَةِ، وَأُلَخِّصُ الْمُعَوِّقاتِ الَّتي تَعْتَرِضُ بُحوثَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَخْلِصُ دَوْرَ كُلٍّ مِنَ الْقِطاعِ الْخاصِّ وَالْحُكومَةِ الْفيدِرالِيَّةِ في مَجالِ الطّاقَةِ.',1),('أُلَخِّصُ الْمُعَوِّقاتِ الَّتي تَعْتَرِضُ بُحوثَ الطّاقَةِ في الْوِلاياتِ الْمُتَّحِدَةِ.',2),('أُفَسِّرُ التَّقَلُّباتِ الْمُتَأَصِّلَةَ في مَنْظومَةِ الطّاقَةِ الْأَمْريكِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: الْأَسْواقُ وَالْحُكومَةُ في حالَةِ تَطَوُّرِ النَّفْطِ وَالْغازِ غَيْرِ التَّقْليدِيَّيْنِ', 'يُؤَثِّرُ السّوقُ بِقِطاعَيِ النَّفْطِ وَالْغازِ في الْكَثيرِ مِنْ دُوَلِ الْعالَمِ، وَخاصَّةً الْوِلاياتِ الْمُتَّحِدَةِ الْأَمْريكِيَّةِ وَكَنَدا، سَواءٌ عَلى مُسْتَوَى الْقِطاعِ الْخاصِّ أَوِ الْحُكومَةِ الْفيدِرالِيَّةِ؛ لِما لَهُما مِنْ دَوْرٍ بارِزٍ في التَّنْقيبِ وَالْبَحْثِ عَنْ مَصادِرِ الطّاقَةِ خاصَّةً غَيْرِ التَّقْليدِيَّةِ مِنْها. (كِتابُ النَّشاطِ، ص 44)', 'كِتابُ النَّشاطِ ص 44–47', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْقِطاعُ الْخاصُّ هُوَ:','[{"id": "a", "text": "الْمُؤَسَّساتُ الْخاضِعَةُ لِرَأْسَمالِ الْأَفْرادِ وَالشَّرِكاتِ"}, {"id": "b", "text": "الْمُؤَسَّساتُ الْحُكومِيَّةُ"}, {"id": "c", "text": "الْمُنَظَّماتُ الدَّوْلِيَّةُ"}]'),('سَيُنْتِجُ مَشْروعُ «شَمْسٍ 1» عِنْدَ اكْتِمالِهِ:','[{"id": "a", "text": "100 ميغاواتٍ"}, {"id": "b", "text": "1000 ميغاواتٍ"}, {"id": "c", "text": "50 ميغاواتٍ"}]'),('سَيوَفِّرُ مَجْمَعُ الشَّيْخِ مُحَمَّدِ بْنِ راشِدٍ لِلطّاقَةِ الشَّمْسِيَّةِ:','[{"id": "a", "text": "1000 ميغاواتٍ"}, {"id": "b", "text": "100 ميغاواتٍ"}, {"id": "c", "text": "500 ميغاواتٍ"}]'),('عَدَدُ سُكّانِ مَدينَةِ مَصْدَرَ الْمُتَوَقَّعُ:','[{"id": "a", "text": "50 أَلْفَ نَسَمَةٍ"}, {"id": "b", "text": "500 أَلْفِ نَسَمَةٍ"}, {"id": "c", "text": "مِلْيونُ نَسَمَةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T3-L6', 'الرُّؤْيَةُ الثّالِثَةُ: تَأْثيراتُ الْعَصْرِ غَيْرِ التَّقْليدِيِّ في مَجالِ الطّاقَةِ', 3, 'كِتابُ النَّشاطِ ص 48–53', true, '🎯 أُحَدِّدُ مَناطِقَ النَّفْطِ الصَّخْرِيِّ وَالْغازِ الصَّخْرِيِّ، وَأَفْخَرُ بِدَوْرِ الْخَليجِ الْعَرَبِيِّ في دَعْمِ الْأَمْنِ الِاقْتِصادِيِّ الْعالَمِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُصَنِّفُ الْمَواردَ الطَّبيعِيَّةَ في مَجالِ الطّاقَةِ بِقارَّةِ أَمْريكا الشَّمالِيَّةِ.',1),('أُحَدِّدُ مَناطِقَ النَّفْطِ الصَّخْرِيِّ وَالْغازِ الصَّخْرِيِّ في الْوِلاياتِ الْمُتَّحِدَةِ وَكَنَدا.',2),('أَفْخَرُ بِدَوْرِ مِنْطَقَةِ الْخَليجِ الْعَرَبِيِّ في دَعْمِ الْأَمْنِ الِاقْتِصادِيِّ الْعالَمِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: تَأْثيراتُ الْعَصْرِ غَيْرِ التَّقْليدِيِّ في مَجالِ الطّاقَةِ', 'وَهَبَ اللهُ سُبْحانَهُ وَتَعالى قارَّةَ أَمْريكا الشَّمالِيَّةِ الْكَثيرَ مِنَ الثَّرَواتِ الْمُتَنَوِّعَةِ، وَمِنْها مَصادِرُ الطّاقَةِ، سَواءٌ التَّقْليدِيَّةُ أَوْ غَيْرُ التَّقْليدِيَّةِ؛ مِمّا جَعَلَ دُوَلَها تَمْتَلِكُ مَخْزونًا كَبيرًا وَمُتَنَوِّعًا لِلطّاقَةِ فيها. (كِتابُ النَّشاطِ، ص 48)', 'كِتابُ النَّشاطِ ص 48–53', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الْهيدْروكَرْبوناتُ الْغازِيَّةُ تُسَمّى:','[{"id": "a", "text": "الْغازَ الطَّبيعِيَّ"}, {"id": "b", "text": "النَّفْطَ الْخامَ"}, {"id": "c", "text": "الْفَحْمَ الْحَجَرِيَّ"}]'),('بيعَتْ أَلاسْكا لِلْوِلاياتِ الْمُتَّحِدَةِ بِمَبْلَغِ:','[{"id": "a", "text": "7,200,000 دولارٍ"}, {"id": "b", "text": "72,000,000 دولارٍ"}, {"id": "c", "text": "720,000 دولارٍ"}]'),('مُتَوَقَّعٌ أَنْ تَنْمُوَ حِصَّةُ سوقِ الْخَليجِ الْعَرَبِيِّ مِنْ وارِداتِ الْوِلاياتِ الْمُتَّحِدَةِ عامَ 2025 م إِلى:','[{"id": "a", "text": "30%"}, {"id": "b", "text": "20.4%"}, {"id": "c", "text": "68%"}]'),('مِنْ أَسْبابِ تَزايُدِ الِاسْتِهْلاكِ في الْوِلاياتِ الْمُتَّحِدَةِ:','[{"id": "a", "text": "التَّوَسُّعُ الصِّناعِيُّ وَزِيادَةُ السُّكّانِ"}, {"id": "b", "text": "نُدْرَةُ الْمَواردِ"}, {"id": "c", "text": "انْخِفاضُ عَدَدِ السُّكّانِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T3-L7', 'الرُّؤْيَةُ الرّابِعَةُ: الِاسْتِغْلالُ التِّجارِيُّ لِمَصادِرِ الطّاقَةِ غَيْرِ التَّقْليدِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 54–59', true, '🎯 أَسْتَنْتِجُ أَثَرَ الطّاقَةِ في بِناءِ الْحَضاراتِ، وَأُحَلِّلُ جَداوِلَ النُّمُوِّ وَالتَّصْنيفِ الْعالَمِيِّ لِلدُّوَلِ الْمُنْتِجَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ أَثَرَ الطّاقَةِ في بِناءِ الْحَضاراتِ الْإِنْسانِيَّةِ عَبْرَ الْعُصورِ.',1),('أُحَلِّلُ الْجَداوِلَ وَالْبَياناتِ حَوْلَ النُّمُوِّ في إِنْتاجِ النَّفْطِ وَالْغازِ الصَّخْرِيَّيْنِ.',2),('أُلَخِّصُ الْمَشاهِدَ الْمُتَوَقَّعَةَ لِتَلْبِيَةِ الِاحْتِياجاتِ الْعالَمِيَّةِ مِنَ الْغازِ الطَّبيعِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: الِاسْتِغْلالُ التِّجارِيُّ لِمَصادِرِ الطّاقَةِ غَيْرِ التَّقْليدِيَّةِ', 'لِلطّاقَةِ دَوْرٌ كَبيرٌ في قِيامِ الْحَضاراتِ الْإِنْسانِيَّةِ وَتَطَوُّرِها مُنْذُ أَنْ بَدَأَ اللهُ الْخَلْقَ حَتَّى الْوَقْتِ الْحاضِرِ؛ لِذٰلِكَ تَسْعَى الدُّوَلُ الْكُبْرى لِامْتِلاكِ مَصادِرِها، وَالْبَحْثِ عَنْ مَصادِرَ جَديدَةٍ لَها؛ لِتَسْتَمِرَّ في رِيادَةِ الْعالَمِ حَضارِيًّا. (كِتابُ النَّشاطِ، ص 54)', 'كِتابُ النَّشاطِ ص 54–59', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَصَدَّرَتْ قائِمَةَ أَكْبَرِ مُنْتِجي النَّفْطِ عامَ 2021 م:','[{"id": "a", "text": "الْوِلاياتُ الْمُتَّحِدَةُ"}, {"id": "b", "text": "روسْيا"}, {"id": "c", "text": "السُّعودِيَّةُ"}]'),('مَرْتَبَةُ دَوْلَةِ الْإِماراتِ بَيْنَ أَكْبَرِ مُنْتِجي النَّفْطِ عامَ 2021 م:','[{"id": "a", "text": "السّابِعَةُ"}, {"id": "b", "text": "الْأولى"}, {"id": "c", "text": "الْخامِسَةَ عَشْرَةَ"}]'),('بَدَأَتِ الزِّراعَةُ لِغَرَضِ الْإِنْتاجِ بِاسْتِخْدامِ:','[{"id": "a", "text": "طاقَةِ الْحَيَوانِ"}, {"id": "b", "text": "طاقَةِ الْبُخارِ"}, {"id": "c", "text": "الطّاقَةِ النَّوَوِيَّةِ"}]'),('الثَّوْرَةُ الَّتي اعْتَمَدَتْ عَلى أَجْهِزَةٍ مُصَغَّرَةٍ بِطاقَةٍ صَغيرَةٍ:','[{"id": "a", "text": "الْمَعْلوماتِيَّةُ"}, {"id": "b", "text": "الصِّناعِيَّةُ"}, {"id": "c", "text": "الزِّراعِيَّةُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 3, 3, 'الْوَحْدَةُ الثّالِثَةُ: إِسْتْراتيجِيّاتُ الطّاقَةِ الْمُتَغَيِّرَةُ وَديناميّاتُها في آسْيا', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=3
                  and sort_order=3 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T3-L10', 'الرُّؤْيَةُ الثّالِثَةُ: دَوْرُ النَّفْطِ وَالْغازِ وَالْفَحْمِ الْحَجَرِيِّ', 3, 'كِتابُ النَّشاطِ ص 70–75', true, '🎯 أُفَسِّرُ رَغْبَةَ الْحُكوماتِ في اسْتِخْدامِ النَّفْطِ وَالْغازِ في تَوْليدِ الطّاقَةِ، وَأُناقِشُ الْآثارَ السَّلْبِيَّةَ لِلْفَحْمِ الْحَجَرِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُفَسِّرُ رَغْبَةَ الْحُكوماتِ في اسْتِخْدامِ النَّفْطِ وَالْغازِ في تَوْليدِ الطّاقَةِ.',1),('أُناقِشُ الْآثارَ السَّلْبِيَّةَ لِاسْتِخْدامِ الْفَحْمِ الْحَجَرِيِّ عَلَى الْبيئَةِ.',2),('أَسْتَنْتِجُ الْعَلاقَةَ بَيْنَ التَّطَوُّرِ التِّقْنِيِّ وَآثارِهِ السَّلْبِيَّةِ عَلَى الْبيئَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: دَوْرُ النَّفْطِ وَالْغازِ وَالْفَحْمِ الْحَجَرِيِّ', 'تُحاوِلُ كُلُّ دُوَلِ الْعالَمِ تَقْريبًا زِيادَةَ حِصَّةِ الْغازِ الطَّبيعِيِّ لِتَوْليدِ الطّاقَةِ الْكَهْرَبائِيَّةِ؛ لِما يَتَمَيَّزُ بِهِ مِنْ مُمَيِّزاتٍ مِنْ حَيْثُ التَّكْلِفَةِ، وَسُهولَةِ النَّقْلِ، وَقِلَّةِ الْمَخاوِفِ الْأَمْنِيَّةِ، في نَفْسِ الْوَقْتِ الَّذي بَدَأَتِ الدُّوَلُ في التَّراجُعِ في اسْتِخْدامِ الْفَحْمِ الْحَجَرِيِّ لِنَفْسِ الْغَرَضِ؛ لِأَسْبابٍ تَتَعَلَّقُ بِتَغَيُّرِ الْمُناخِ وَانْتِشارِ الْأَمْراضِ. (كِتابُ النَّشاطِ، ص 70)', 'كِتابُ النَّشاطِ ص 70–75', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L10/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مِنْ مُمَيِّزاتِ الْغازِ الطَّبيعِيِّ الَّتي دَفَعَتِ الدُّوَلَ لِزِيادَةِ حِصَّتِهِ:','[{"id": "a", "text": "قِلَّةُ التَّكْلِفَةِ وَسُهولَةُ النَّقْلِ"}, {"id": "b", "text": "كَثْرَةُ انْبِعاثاتِهِ"}, {"id": "c", "text": "صُعوبَةُ اسْتِخْراجِهِ"}]'),('مِنَ الْآثارِ السَّلْبِيَّةِ لِلطّاقَةِ النَّوَوِيَّةِ:','[{"id": "a", "text": "صُعوبَةُ التَّخَلُّصِ مِنَ النِّفاياتِ النَّوَوِيَّةِ"}, {"id": "b", "text": "ارْتِفاعُ انْبِعاثِ الْكَرْبونِ"}, {"id": "c", "text": "نُدْرَةُ الْوَقودِ"}]'),('الْمُشْكِلَةُ الَّتي تُعَرْقِلُ قِطاعَيِ النَّفْطِ وَالْغازِ في آسْيا:','[{"id": "a", "text": "النِّزاعاتُ عَلَى الِاحْتِياطاتِ في قاعِ الْبَحْرِ"}, {"id": "b", "text": "قِلَّةُ الْعُمّالِ"}, {"id": "c", "text": "ارْتِفاعُ الْأَسْعارِ"}]'),('آخِرُ مَراحِلِ آلِيَّةِ احْتِجازِ الْكَرْبونِ:','[{"id": "a", "text": "التَّخْزينُ الْجْيولوجِيُّ"}, {"id": "b", "text": "النَّقْلُ الْبَرِّيُّ"}, {"id": "c", "text": "الِاحْتِجازُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T3-L11', 'الرُّؤْيَةُ الرّابِعَةُ: دَوْرُ الطّاقَةِ النَّوَوِيَّةِ وَالطّاقَةِ الْمُتَجَدِّدَةِ', 3, 'كِتابُ النَّشاطِ ص 76–79', true, '🎯 أَسْتَنْتِجُ أَهَمِّيَّةَ بِناءِ الْمُفاعِلاتِ النَّوَوِيَّةِ لِلدُّوَلِ الْآسْيَوِيَّةِ، وَأُفَسِّرُ اهْتِمامَها بِإيجادِ بَدائِلَ مُتَعَدِّدَةٍ لِلطّاقَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ الْمَفاهيمَ الِاقْتِصادِيَّةَ: الطّاقَةُ الْكَهْرَومائِيَّةُ وَالْوَقودُ الْحَيَوِيُّ وَكَفاءَةُ الطّاقَةِ.',1),('أُفَسِّرُ اهْتِمامَ الْحُكوماتِ الْآسْيَوِيَّةِ بِإيجادِ بَدائِلَ مُتَعَدِّدَةٍ لِلطّاقَةِ.',2),('أُناقِشُ قَضايا سُكّانِيَّةً مُعاصِرَةً في دَوْلَتي مُفَسِّرًا أَسْبابَها وَنَتائِجَها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: دَوْرُ الطّاقَةِ النَّوَوِيَّةِ وَالطّاقَةِ الْمُتَجَدِّدَةِ', 'تُراقِبُ الْحُكوماتُ في جَميعِ أَنْحاءِ الْعالَمِ بِشَغَفٍ نَتائِجَ اخْتِباراتِ تِكْنولوجْيَا الطّاقَةِ الَّتي يُمْكِنُ أَنْ تَحُدَّ مِنْ صُعوبَةِ وَتَكْلِفَةِ تَوْليدِ الْكَهْرَباءِ، مِنْ تِكْنولوجْيَا الطّاقَةِ النَّوَوِيَّةِ وَالطّاقَةِ الْمُتَجَدِّدَةِ كَالشَّمْسِ وَالرِّياحِ وَالْأَمْواجِ وَالطّاقَةِ الْحَرارِيَّةِ الْأَرْضِيَّةِ وَغَيْرِها. (كِتابُ النَّشاطِ، ص 76)', 'كِتابُ النَّشاطِ ص 76–79', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L11/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('دُشِّنَ الْبَرْنامَجُ النَّوَوِيُّ السِّلْمِيُّ لِدَوْلَةِ الْإِماراتِ في:','[{"id": "a", "text": "ديسِمْبَرَ 2009 م"}, {"id": "b", "text": "عامِ 2012 م"}, {"id": "c", "text": "عامِ 2020 م"}]'),('بَدَأَ الْبِناءُ الْفِعْلِيُّ لِلْمَحَطّاتِ النَّوَوِيَّةِ في عامِ:','[{"id": "a", "text": "2012 م"}, {"id": "b", "text": "2009 م"}, {"id": "c", "text": "2011 م"}]'),('يَرْتَكِزُ الْبَرْنامَجُ النَّوَوِيُّ لِلدَّوْلَةِ عَلى:','[{"id": "a", "text": "السَّلامَةِ وَحَظْرِ الِانْتِشارِ النَّوَوِيِّ"}, {"id": "b", "text": "التَّخْصيبِ الْمَحَلِّيِّ"}, {"id": "c", "text": "الْأَغْراضِ غَيْرِ السِّلْمِيَّةِ"}]'),('الطّاقَةُ الْكَهْرَومائِيَّةُ هِيَ الَّتي تُوَلَّدُ مِنْ:','[{"id": "a", "text": "حَرَكَةِ الْمِياهِ"}, {"id": "b", "text": "حَرْقِ الْفَحْمِ"}, {"id": "c", "text": "تَفاعُلاتِ النَّوى"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T3-L8', 'الرُّؤْيَةُ الْأولى: تَأْمينُ طاقَةٍ وافِرَةٍ وَمَوْثوقٍ بِها وَبِأَسْعارٍ مَقْبولَةٍ', 3, 'كِتابُ النَّشاطِ ص 62–65', true, '🎯 أُوَضِّحُ دَوْرَ الْمُؤَسَّساتِ في تَلْبِيَةِ احْتِياجاتِ الْمُواطِنينَ، وَأُقارِنُ بَيْنَ دُوَلِ آسْيا في طُرُقِ اسْتِهْلاكِ الْكَهْرَباءِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ دَوْرَ الْمُؤَسَّساتِ الْمُخْتَلِفَةِ في تَلْبِيَةِ احْتِياجاتِ الْمُواطِنينَ.',1),('أُقارِنُ بَيْنَ دُوَلِ قارَّةِ آسْيا مِنْ حَيْثُ طُرُقُ اسْتِهْلاكِ الْكَهْرَباءِ.',2),('أُبَيِّنُ دَوْرَ الْقِيَمِ وَالْأَخْلاقِ في تَطْويرِ مُواطَنَتي الْمُنْتِجَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: تَأْمينُ طاقَةٍ وافِرَةٍ وَمَوْثوقٍ بِها وَبِأَسْعارٍ مَقْبولَةٍ', 'تَسْعَى الْحُكوماتُ في آسْيا وَغَيْرِها مِنْ مَناطِقِ الْعالَمِ إِلى صَوْغِ اسْتِراتيجِيَّةٍ وَطَنِيَّةٍ لِلطّاقَةِ، تُمَكِّنُها مِنْ تَأْمينِ كَمِّيّاتٍ وافِرَةٍ مِنَ الطّاقَةِ لِمُواطِنيها، بِشَكْلٍ لا يُلْحِقُ ضَرَرًا بِالْبيئَةِ عِنْدَ شِرائِها أَوِ اسْتِخْدامِها. (كِتابُ النَّشاطِ، ص 62)', 'كِتابُ النَّشاطِ ص 62–65', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L8/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('وَحْدَةُ قِياسِ الطّاقَةِ الْمُتَناسِبَةُ مَعَ الِاسْتِهْلاكِ الْمَنْزِلِيِّ السَّنَوِيِّ:','[{"id": "a", "text": "الْكيلو واط/ ساعَةٌ"}, {"id": "b", "text": "الْبَرْميلُ"}, {"id": "c", "text": "الْمِتْرُ الْمُكَعَّبُ"}]'),('الْكُتْلَةُ الْحَيَوِيَّةُ التَّقْليدِيَّةُ هِيَ الطّاقَةُ الْمُسْتَمَدَّةُ مِنَ:','[{"id": "a", "text": "الْكائِناتِ الْحَيَّةِ النَّباتِيَّةِ أَوِ الْحَيَوانِيَّةِ"}, {"id": "b", "text": "باطِنِ الْأَرْضِ"}, {"id": "c", "text": "الشَّمْسِ وَالرِّياحِ"}]'),('بُنِيَتْ أَوَّلُ مَحَطَّةٍ عامَّةٍ لِلطّاقَةِ عامَ:','[{"id": "a", "text": "1882 م"}, {"id": "b", "text": "1982 م"}, {"id": "c", "text": "1782 م"}]'),('الْوِزارَةُ الَّتي تَقومُ بِدَوْرِ تَنْويعِ مَصادِرِ الطّاقَةِ وَالْمِياهِ في الدَّوْلَةِ:','[{"id": "a", "text": "وِزارَةُ الطّاقَةِ وَالْبُنْيَةِ التَّحْتِيَّةِ"}, {"id": "b", "text": "وِزارَةُ الْبيئَةِ وَالْمِياهِ"}, {"id": "c", "text": "وِزارَةُ الِاقْتِصادِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=3 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T3-L9', 'الرُّؤْيَةُ الثّانِيَةُ: اسْتِراتيجِيّاتُ الطّاقَةِ لَدَى الْحُكوماتِ الْآسْيَوِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 66–69', true, '🎯 أُفَسِّرُ اهْتِمامَ الْحُكوماتِ في آسْيا بِتَنْويعِ أَنْماطِ الِاسْتِثْمارِ في الطّاقَةِ، وَأُناقِشُ اسْتِراتيجِيّاتِ التَّخْفيفِ مِنْ تَغَيُّرِ الْمُناخِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَشْرَحُ الْمَفاهيمَ الِاقْتِصادِيَّةَ ذاتَ الْعَلاقَةِ بِأَمْنِ الطّاقَةِ.',1),('أُفَسِّرُ اهْتِمامَ الْحُكوماتِ في آسْيا بِتَنْويعِ أَنْماطِ الِاسْتِثْمارِ في الطّاقَةِ.',2),('أُقَدِّمُ مُقْتَرَحًا لِلْحَدِّ مِنْ ظاهِرَةِ الِاحْتِباسِ الْحَرارِيِّ في دَوْلَتي.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: اسْتِراتيجِيّاتُ الطّاقَةِ لَدَى الْحُكوماتِ الْآسْيَوِيَّةِ', 'تَرْتَكِزُ الْخُطَطُ الْوَطَنِيَّةُ لِبُلْدانِ آسْيا الصِّناعِيَّةِ عَلى هَدَفِ تَطْويرِ طاقَةٍ مُسْتَدامَةٍ بيئِيًّا؛ الْأَمْرُ الَّذي يَعْني تَوْليدَ الْكَهْرَباءِ وَاسْتِخْدامَ الطّاقَةِ بِأَدْنى حَدٍّ مِنَ الْآثارِ السَّلْبِيَّةِ عَلَى الْأَرْضِ وَالْهَواءِ وَالْماءِ وَالنُّظُمِ الْبيئِيَّةِ، وَعَلى صِحَّةِ الْإِنْسانِ أَيْضًا. (كِتابُ النَّشاطِ، ص 66)', 'كِتابُ النَّشاطِ ص 66–69', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L9/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('السِّلَعُ الْأَساسِيَّةُ ذاتُ الْقيمَةِ وَالنَّوْعِيَّةِ الْمُوَحَّدَةِ تُسَمّى:','[{"id": "a", "text": "السِّلَعَ التَّبادُلِيَّةَ"}, {"id": "b", "text": "السِّلَعَ الِاسْتِراتيجِيَّةَ"}, {"id": "c", "text": "ذُرْوَةَ الْإِنْتاجِ"}]'),('يَتَرَكَّزُ اهْتِمامُ الْحُكوماتِ الْآسْيَوِيَّةِ في مَجالِ الطّاقَةِ عَلى:','[{"id": "a", "text": "الِاسْتِقْلالِيَّةِ وَتَنْويعِ الْمَصادِرِ"}, {"id": "b", "text": "خَفْضِ عَدَدِ السُّكّانِ"}, {"id": "c", "text": "إِغْلاقِ الْأَسْواقِ"}]'),('مِنْ مَصادِرِ انْبِعاثِ ثاني أُكْسيدِ الْكَرْبونِ:','[{"id": "a", "text": "إِنْتاجُ الْكَهْرَباءِ وَتَكْريرُ النَّفْطِ"}, {"id": "b", "text": "زِراعَةُ الْأَشْجارِ"}, {"id": "c", "text": "تَحْلِيَةُ الْمِياهِ بِالشَّمْسِ"}]'),('تَعْتَمِدُ عَلَى اسْتيرادِ الطّاقَةِ اعْتِمادًا كَبيرًا:','[{"id": "a", "text": "سِنْغافورَةُ وَالْيابانُ"}, {"id": "b", "text": "إِنْدونيسْيا وَمالِيزْيا"}, {"id": "c", "text": "السُّعودِيَّةُ وَالْإِماراتُ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 3, 4, 'الْوَحْدَةُ الرّابِعَةُ: إِمْداداتُ الْغازِ الرّوسِيِّ إِلى أوروبّا', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=3
                  and sort_order=4 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T3-L12', 'الرُّؤْيَةُ الْأولى: إِمْداداتُ الْغازِ الرّوسِيِّ إِلى أوروبّا', 3, 'كِتابُ النَّشاطِ ص 82–85', true, '🎯 أَسْتَنْتِجُ طَبيعَةَ الْعَلاقاتِ التِّجارِيَّةِ الِاقْتِصادِيَّةِ بَيْنَ روسْيا وَأوكْرانْيا، وَأُناقِشُ عَلاقاتِ الْإِماراتِ الدَّوْلِيَّةَ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَسْتَنْتِجُ طَبيعَةَ الْعَلاقاتِ التِّجارِيَّةِ الِاقْتِصادِيَّةِ بَيْنَ روسْيا وَأوكْرانْيا.',1),('أَطْرَحُ وَجْهَةَ نَظَرٍ شَخْصِيَّةٍ حَوْلَ إِحْدَى الْقَضايَا الِاقْتِصادِيَّةِ.',2),('أُناقِشُ طَبيعَةَ الْعَلاقاتِ الدَّوْلِيَّةِ بَيْنَ الْإِماراتِ وَالصّينِ في جَميعِ الْمَجالاتِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: إِمْداداتُ الْغازِ الرّوسِيِّ إِلى أوروبّا', 'لا تَزالُ دُوَلُ وَسَطِ شَرْقِ وَجَنوبِ أوروبّا أَكْثَرَ اعْتِمادًا عَلى إِمْداداتِ الْغازِ الرّوسِيِّ بِشَكْلٍ عامٍّ، وَعَلى نَقْلِ الْغازِ عَبْرَ أوكْرانْيا بِشَكْلٍ خاصٍّ، مِنْ نَظيراتِهَا الْأوروبّيَّةِ الْأُخْرى؛ لِذٰلِكَ فَإِنَّ نُمُوَّ الْعَلاقاتِ الِاقْتِصادِيَّةِ وَالتِّجارِيَّةِ بَيْنَ روسْيا وَأوكْرانْيا ذاتُ مُسْتَوًى عالٍ مِنَ الْأَهَمِّيَّةِ لِهٰذِهِ الدُّوَلِ؛ لِضَمانِ عَدَمِ انْقِطاعِ أَوْ تَعْليقِ وارِداتِها مِنَ الْغازِ الرّوسِيِّ. (كِتابُ النَّشاطِ، ص 82)', 'كِتابُ النَّشاطِ ص 82–85', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L12/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الدُّوَلُ الْأَكْثَرُ اعْتِمادًا عَلى نَقْلِ الْغازِ الرّوسِيِّ عَبْرَ أوكْرانْيا:','[{"id": "a", "text": "دُوَلُ وَسَطِ شَرْقِ وَجَنوبِ أوروبّا"}, {"id": "b", "text": "دُوَلُ غَرْبِ أوروبّا"}, {"id": "c", "text": "دُوَلُ شَمالِ إِفْريقْيا"}]'),('مُدِّدَ إيجارُ قاعِدَةِ سيفاسْتوبولَ الْبَحْرِيَّةِ لِروسْيا عامَ:','[{"id": "a", "text": "2010 م"}, {"id": "b", "text": "2013 م"}, {"id": "c", "text": "2005 م"}]'),('الثَّوْرَةُ الَّتي حَدَثَتْ في أوكْرانْيا هِيَ:','[{"id": "a", "text": "الثَّوْرَةُ الْبُرْتُقالِيَّةُ"}, {"id": "b", "text": "ثَوْرَةُ الْوَرْدِ"}, {"id": "c", "text": "الثَّوْرَةُ الْبيضاءُ"}]'),('سِلاحُ الطّاقَةِ يَعْني:','[{"id": "a", "text": "اسْتِخْدامَ النَّفْطِ أَوِ الْغازِ كَسِلاحٍ بِمَنْعِ التَّصْديرِ أَوْ رَفْعِ الْأَسْعارِ"}, {"id": "b", "text": "اسْتِخْدامَ الطّاقَةِ في التَّصْنيعِ الْحَرْبِيِّ"}, {"id": "c", "text": "تَخْزينَ الْغازِ لِلشِّتاءِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=4 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T3-L13', 'الرُّؤْيَةُ الثّانِيَةُ: أَهَمِّيَّةُ تَخْزينِ الْغازِ', 3, 'كِتابُ النَّشاطِ ص 86–89', true, '🎯 أُبَيِّنُ أَهَمِّيَّةَ تَخْزينِ الْغازِ لِدُوَلِ وَسَطِ أوروبّا وَجَنوبِ شَرْقِها، وَأُقَدِّمُ حُلولًا اقْتِصادِيَّةً لِلْمَشاكِلِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ أَهَمِّيَّةَ تَخْزينِ الْغازِ بِالنِّسْبَةِ لِدُوَلِ وَسَطِ أوروبّا وَجَنوبِ شَرْقِها.',1),('أُقَدِّمُ حُلولًا اقْتِصادِيَّةً لِلْمَشاكِلِ الِاقْتِصادِيَّةِ.',2),('أُثَمِّنُ دَوْرَ دَوْلَةِ الْإِماراتِ في الْوُقوفِ إِلى جانِبِ الدُّوَلِ الشَّقيقَةِ وَالصَّديقَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: أَهَمِّيَّةُ تَخْزينِ الْغازِ', 'تَحْتاجُ دُوَلُ الِاتِّحادِ الْأوروبّيِّ إِلَى الِاسْتِمْرارِ في تَحْقيقِ التَّكامُلِ لِسوقِ الْغازِ، وَتَطْويرِ مَخْزوناتِهِ؛ اسْتِجابَةً لِلْأَزَماتِ الْمُخْتَلِفَةِ، وَخاصَّةً في مِنْطَقَةِ وَسَطِ وَجَنوبِ شَرْقِها؛ وَذٰلِكَ عَنْ طَريقِ الْإِدْماجِ الْكامِلِ لِسوقِ الْغازِ؛ لِتَحْقيقِ أَمْنِ طاقَةٍ طَويلِ الْأَمَدِ لِجَميعِ الْأَعْضاءِ في الِاتِّحادِ الْأوروبّيِّ. (كِتابُ النَّشاطِ، ص 86)', 'كِتابُ النَّشاطِ ص 86–89', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L13/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الطَّريقَةُ الَّتي يُخَزَّنُ بِهَا الْغازُ داخِلَ خُطوطِ الْأَنابيبِ تُسَمّى:','[{"id": "a", "text": "حَشْوَ الْخَطِّ"}, {"id": "b", "text": "التَّسْييلَ"}, {"id": "c", "text": "الضَّغْطَ الْعالِيَ"}]'),('مِنَ الْقَضايَا الَّتي تُبْرِزُ أَهَمِّيَّةَ تَخْزينِ الْغازِ:','[{"id": "a", "text": "تَزايُدُ الطَّلَبِ في فَصْلِ الشِّتاءِ"}, {"id": "b", "text": "انْخِفاضُ الطَّلَبِ صَيْفًا"}, {"id": "c", "text": "كَثْرَةُ مَرافِقِ التَّخْزينِ"}]'),('تَحْتاجُ دُوَلُ الِاتِّحادِ الْأوروبّيِّ لِأَمْنِ طاقَةٍ طَويلِ الْأَمَدِ إِلى:','[{"id": "a", "text": "التَّكامُلِ لِسوقِ الْغازِ وَالْإِدْماجِ الْكامِلِ"}, {"id": "b", "text": "إِغْلاقِ الْحُدودِ"}, {"id": "c", "text": "وَقْفِ التَّخْزينِ"}]'),('يَتِمُّ تَخْزينُ الْغازِ بِطَريقَةِ حَشْوِ الْخَطِّ عَنْ طَريقِ:','[{"id": "a", "text": "رَفْعِ ضَغْطِهِ تَدْريجِيًّا"}, {"id": "b", "text": "تَبْريدِهِ إِلى سائِلٍ"}, {"id": "c", "text": "حَرْقِهِ جُزْئِيًّا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 3, 5, 'الْوَحْدَةُ الْخامِسَةُ: أَسْواقُ الْغازِ الدَّوْلِيَّةُ وَمُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=3
                  and sort_order=5 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T3-L14', 'الرُّؤْيَةُ الْأولى: أَسْعارُ النَّفْطِ وَالِاقْتِصادُ الْعالَمِيُّ', 3, 'كِتابُ النَّشاطِ ص 92–95', true, '🎯 أُقارِنُ بَيْنَ تَغَيُّراتِ أَسْعارِ النَّفْطِ وَأَثَرِها عَلى أَنْواعِ الطّاقَةِ التَّنافُسِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُقارِنُ بَيْنَ تَغَيُّراتِ أَسْعارِ النَّفْطِ وَأَثَرِها عَلى أَنْواعِ الطّاقَةِ التَّنافُسِيَّةِ.',1),('أَصِفُ الرَّكائِزَ الْأَساسِيَّةَ الَّتي تَقومُ عَلَيْهَا الْعَلاقاتُ بَيْنَ الدُّوَلِ الصِّناعِيَّةِ.',2),('أُبَيِّنُ عَلاقَةَ دَوْلَتي بِالْمُنَظَّماتِ الْعَرَبِيَّةِ وَالْعالَمِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: أَسْعارُ النَّفْطِ وَالِاقْتِصادُ الْعالَمِيُّ', 'دَخَلَتْ أَسْواقُ الْغازِ الْعالَمِيَّةُ في الْعَقْدَيْنِ الْماضِيَيْنِ مَرْحَلَةً جَديدَةً مِنَ التَّطَوُّرِ، تَتَمَيَّزُ بِاشْتِدادِ الْمُنافَسَةِ بَيْنَ الْمُوَرِّدينَ، وَالتَّسْييسِ الْمُتَزايِدِ بَيْنَ الْمُنْتِجينَ وَالْمُسْتَهْلِكينَ؛ فَحَفَّزَ ذٰلِكَ الدُّوَلَ وَالشَّرِكاتِ في جَميعِ أَنْحاءِ الْعالَمِ عَلَى الِابْتِعادِ عَنْ رَبْطِ سِعْرِ الْغازِ بِسِعْرِ النَّفْطِ. (كِتابُ النَّشاطِ، ص 92)', 'كِتابُ النَّشاطِ ص 92–95', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L14/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَأَسَّسَتْ مُنَظَّمَةُ الْأوبِكِ في:','[{"id": "a", "text": "بَغْدادَ عامَ 1960 م"}, {"id": "b", "text": "فيينّا عامَ 1967 م"}, {"id": "c", "text": "الرِّياضِ عامَ 1970 م"}]'),('انْضَمَّتْ دَوْلَةُ الْإِماراتِ إِلَى الْأوبِكِ عامَ:','[{"id": "a", "text": "1967 م"}, {"id": "b", "text": "1960 م"}, {"id": "c", "text": "1971 م"}]'),('تَمْلِكُ دُوَلُ الْأوبِكِ مِنَ الِاحْتِياطِيِّ الْعالَمِيِّ لِلنَّفْطِ:','[{"id": "a", "text": "70%"}, {"id": "b", "text": "40%"}, {"id": "c", "text": "12%"}]'),('مِنْ مَلامِحِ الْمَرْحَلَةِ الْجَديدَةِ لِأَسْواقِ الْغازِ:','[{"id": "a", "text": "الِابْتِعادُ عَنْ رَبْطِ سِعْرِ الْغازِ بِسِعْرِ النَّفْطِ"}, {"id": "b", "text": "تَثْبيتُ الْأَسْعارِ عالَمِيًّا"}, {"id": "c", "text": "إِلْغاءُ الْمُنافَسَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T3-L15', 'الرُّؤْيَةُ الثّانِيَةُ: أَسْعارُ الْغازِ — الْمَزيدُ مِنَ التَّدْويلِ وَالْمُنافَسَةِ', 3, 'كِتابُ النَّشاطِ ص 96–99', true, '🎯 أُبَيِّنُ الْأَهَمِّيَّةَ الْعَمَلِيَّةَ لِأَسْواقِ الْغازِ الْعالَمِيَّةِ، وَأَسْتَنْتِجُ أَثَرَ الْغازِ الصَّخْرِيِّ في الِاقْتِصادِ الْعالَمِيِّ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُبَيِّنُ الْأَهَمِّيَّةَ الْعَمَلِيَّةَ لِأَسْواقِ الْغازِ الْعالَمِيَّةِ.',1),('أَتَعَرَّفُ الْمَفاهيمَ الِاقْتِصادِيَّةَ: الِابْتِكارُ التِّكْنولوجِيُّ وَالْغازُ الصَّخْرِيُّ.',2),('أَسْتَنْتِجُ أَثَرَ الْغازِ الصَّخْرِيِّ في الِاقْتِصادِ الْعالَمِيِّ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: أَسْعارُ الْغازِ — الْمَزيدُ مِنَ التَّدْويلِ وَالْمُنافَسَةِ', 'طَوَّرَتِ الْأَسْواقُ الْمالِيَّةُ أَسْواقَ غازٍ أَكْثَرَ سيولَةً، لِلتَّداوُلاتِ الِافْتِراضِيَّةِ بَيْنَ التُّجّارِ الَّذينَ لَهُمُ الْحَقُّ في حِيازَةِ الْغازِ الطَّبيعِيِّ، وَتَشْمَلُ الْأَسْواقُ الِافْتِراضِيَّةُ شَتَّى الْعُقودِ الْآجِلَةِ وَالْمُسْتَقْبَلِيَّةِ، كَما ظَهَرَ بَعْدَ ذٰلِكَ تَسْعيرُ الْغازِ وَفْقًا لِلْعَرْضِ وَالطَّلَبِ، وَالَّذي شَكَّلَ عامِلًا جَديدًا في ديناميّاتِ أَسْواقِ الْغازِ الْعالَمِيَّةِ. (كِتابُ النَّشاطِ، ص 96)', 'كِتابُ النَّشاطِ ص 96–99', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L15/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('اسْتُخْدِمَتْ تِقْنِيَّةُ التَّكْسيرِ الْهيدْروليكِيِّ مُنْذُ عامِ:','[{"id": "a", "text": "1947 م"}, {"id": "b", "text": "2008 م"}, {"id": "c", "text": "1980 م"}]'),('بَدَأَ تَأْثيرُ تِقْنِيَّةِ الصَّخْرِ الزَّيْتِيِّ عَلى إِمْداداتِ الطّاقَةِ الْأَمْريكِيَّةِ يُصْبِحُ مَلْحوظًا عامَ:','[{"id": "a", "text": "2008 م"}, {"id": "b", "text": "1998 م"}, {"id": "c", "text": "1947 م"}]'),('أَكْبَرُ احْتِياطيٍّ عالَمِيٍّ مِنَ الْغازِ الصَّخْرِيِّ لِـ:','[{"id": "a", "text": "الصّينِ"}, {"id": "b", "text": "الْوِلاياتِ الْمُتَّحِدَةِ"}, {"id": "c", "text": "الْجَزائِرِ"}]'),('طَرْحُ مُنْتَجٍ جَديدٍ أَوْ مُحَسَّنٍ بِدَرَجَةٍ كَبيرَةٍ إِلَى السّوقِ يُسَمّى:','[{"id": "a", "text": "ابْتِكارَ الْمُنْتَجِ"}, {"id": "b", "text": "ابْتِكارَ الْعَمَلِيَّةِ"}, {"id": "c", "text": "سيولَةَ السّوقِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=5 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T3-L16', 'الرُّؤْيَةُ الثّالِثَةُ: الدَّوْرُ الْمُحْتَمَلُ لِمُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ', 3, 'كِتابُ النَّشاطِ ص 100–103', true, '🎯 أُناقِشُ الظُّروفَ الِاقْتِصادِيَّةَ الَّتي أَدَّتْ إِلى مُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ، وَأُبْرِزُ دَوْري في الْمُحافَظَةِ عَلى ثَرَواتِ بِلادي.' from u
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
       select l.id, v.s, v.n from l, (values ('أُناقِشُ الظُّروفَ الِاقْتِصادِيَّةَ الَّتي أَدَّتْ إِلى مُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ.',1),('أُعْطي رَأْيًا حَوْلَ السَّيْطَرَةِ الَّتي تَفْرِضُها بَعْضُ الدُّوَلِ عَلَى الِاقْتِصادِ الْعالَمِيِّ.',2),('أُبْرِزُ دَوْري في الْمُحافَظَةِ عَلَى الثَّرَواتِ الِاقْتِصادِيَّةِ لِبِلادي.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: الدَّوْرُ الْمُحْتَمَلُ لِمُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ', 'انْبَثَقَتْ فِكْرَةُ تَأْسيسِ مُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ مِنْ فِكْرَةِ تَشْكيلِ تَجَمُّعٍ يَضُمُّ مُنْتِجي الْغازِ يُماثِلُ أوبِكَ، لٰكِنَّهُ يَفْتَقِدُ الْقُوَّةَ الْمُباشِرَةَ وَغَيْرَ الْمُباشِرَةِ في السّوقِ، وَالَّتي تَحْتاجُ إِلَيْهَا الدُّوَلُ الْأَعْضاءُ لِضَبْطِ الْأَسْعارِ وَتَعْزيزِ أَمْنِ الطَّلَبِ. (كِتابُ النَّشاطِ، ص 100)', 'كِتابُ النَّشاطِ ص 100–103', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L16/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('يَفْتَقِدُ مُنْتَدَى الدُّوَلِ الْمُصَدِّرَةِ لِلْغازِ:','[{"id": "a", "text": "الْقُوَّةَ الْمُباشِرَةَ وَغَيْرَ الْمُباشِرَةِ في السّوقِ"}, {"id": "b", "text": "عَدَدَ الْأَعْضاءِ"}, {"id": "c", "text": "الِاحْتِياطيَّ مِنَ الْغازِ"}]'),('سوقُ الْغازِ في الْوَقْتِ الْحاضِرِ:','[{"id": "a", "text": "مَناطِقِيَّةٌ لا عالَمِيَّةٌ"}, {"id": "b", "text": "عالَمِيَّةٌ بِسِعْرٍ واحِدٍ"}, {"id": "c", "text": "مُغْلَقَةٌ أَمامَ التِّجارَةِ"}]'),('حَصَلَتْ شَرِكَةُ الْإِماراتِ لِلْغازِ الْمُسالِ عَلَى الْمُوافَقَةِ عَلى مَشْروعِ الْفُجَيْرَةِ في:','[{"id": "a", "text": "نوفِمْبِرَ 2013 م"}, {"id": "b", "text": "نوفِمْبِرَ 2008 م"}, {"id": "c", "text": "يَنايِرَ 2016 م"}]'),('سَيَتَّجِهُ مُعْظَمُ غازِ مَشْروعِ الْفُجَيْرَةِ إِلى:','[{"id": "a", "text": "قِطاعِ الْكَهْرَباءِ"}, {"id": "b", "text": "قِطاعِ النَّقْلِ"}, {"id": "c", "text": "التَّصْديرِ إِلى أوروبّا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 10, 3, 6, 'الْوَحْدَةُ السّادِسَةُ: تَطَوُّرُ الْمُدُنِ الذَّكِيَّةِ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=10 and term=3
                  and sort_order=6 and track='native');

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y10-T3-L17', 'الرُّؤْيَةُ الْأولى: أَهَمِّيَّةُ الْمورْفولوجْيا الْعُمْرانِيَّةِ في تَرْسيخِ دَعائِمِ الْمَناطِقِ الْكَفْؤَةِ طاقِيًّا وَكَرْبونِيًّا', 3, 'كِتابُ النَّشاطِ ص 106–111', true, '🎯 أَتَعَرَّفُ مَفْهومَ الْمورْفولوجْيا الْعُمْرانِيَّةِ، وَأُوَضِّحُ كَيْفِيَّةَ تَأْثيرِ التَّطَوُّرِ التِّقَنِيِّ في تَصْميمِ الْمُدُنِ الذَّكِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَفْهومَ الْمورْفولوجْيا الْعُمْرانِيَّةِ.',1),('أُوَضِّحُ كَيْفِيَّةَ تَأْثيرِ التَّطَوُّرِ التِّقَنِيِّ في تَصْميمِ الْمُدُنِ الذَّكِيَّةِ.',2),('أُقَدِّمُ مُقْتَرَحاتٍ لِتَحْقيقِ بيئَةٍ مُسْتَدامَةٍ وَبُنْيَةٍ تَحْتِيَّةٍ مُتَكامِلَةٍ وَفْقًا لِمُؤَشِّراتِ الْأَجِنْدَةِ الْوَطَنِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الْأولى: أَهَمِّيَّةُ الْمورْفولوجْيا الْعُمْرانِيَّةِ في تَرْسيخِ دَعائِمِ الْمَناطِقِ الْكَفْؤَةِ طاقِيًّا وَكَرْبونِيًّا', 'تَضُمُّ الْمُدُنُ بَيْنَ ثَناياهَا الْعَديدَ مِنَ الْأَسْرارِ وَالْكُنوزِ الثَّمينَةِ الَّتي قَدْ لا تُقَدَّرُ بِثَمَنٍ، وَلَعَلَّ مِنْ بَيْنِ هٰذِهِ الْكُنوزِ هِيَ الْأَشْكالُ وَالنَّماذِجُ وَالصُّوَرُ الْعُمْرانِيَّةُ الَّتي شَكَّلَتْهَا الْمَدينَةُ خِلالَ عُمْرِهَا الطَّويلِ، إِنَّ ما يُمْكِنُ التَّرْكيزُ عَلَيْهِ هُنا هُوَ أَنَّ لِعَوامِلِ التَّطَوُّرِ الْعُمْرانِيِّ وَالْحَضارِيِّ في الْمَدينَةِ دَوْرًا بارِزًا في تَشْكيلِ بُنْيَتِهَا الْعُمْرانِيَّةِ. (كِتابُ النَّشاطِ، ص 106)', 'كِتابُ النَّشاطِ ص 106–111', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L17/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عِلْمُ دِراسَةِ التّاريخِ الْعُمْرانِيِّ الْحَضَرِيِّ لِأَيِّ مَدينَةٍ هُوَ:','[{"id": "a", "text": "الْمورْفولوجْيا الْعُمْرانِيَّةُ"}, {"id": "b", "text": "النِّظامُ الْأَيْكولوجِيُّ"}, {"id": "c", "text": "الِابْتِكارُ التَّشارُكِيُّ"}]'),('أُطْلِقَتِ الْأَجِنْدَةُ الْوَطَنِيَّةُ في عامِ:','[{"id": "a", "text": "2014 م"}, {"id": "b", "text": "2030 م"}, {"id": "c", "text": "2021 م"}]'),('عَدَدُ الْجِهاتِ الَّتي عَمِلَتْ عَلَى الْأَجِنْدَةِ الْوَطَنِيَّةِ:','[{"id": "a", "text": "90 جِهَةً"}, {"id": "b", "text": "300 جِهَةٍ"}, {"id": "c", "text": "30 جِهَةً"}]'),('مِنْ مُحَدِّداتِ الْقيمَةِ الْعُمْرانِيَّةِ عِنْدَ الشَّبَكَةِ الْأوروبّيَّةِ لِمُخْتَبَراتِ الْمَعيشَةِ:','[{"id": "a", "text": "الْبُنْيَةُ الْماديَّةُ وَغَيْرُ الْماديَّةِ"}, {"id": "b", "text": "عَدَدُ السُّكّانِ"}, {"id": "c", "text": "مِساحَةُ الْمَدينَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y10-T3-L18', 'الرُّؤْيَةُ الثّانِيَةُ: مُواصَفاتُ الْمُدُنِ الذَّكِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 112–117', true, '🎯 أَتَعَرَّفُ مَفْهومَ ثُلاثِيَّةِ الْإِبْداعِ لِلْمُدُنِ الذَّكِيَّةِ، وَأَسْتَنْتِجُ الْعَلاماتِ الْمُمَيِّزَةَ الْمُعْتَمَدَةَ لَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَفْهومَ ثُلاثِيَّةِ الْإِبْداعِ لِلْمُدُنِ الذَّكِيَّةِ.',1),('أُثَمِّنُ جُهودَ الْقِيادَةِ الرَّشيدَةِ في دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ في دَعْمِ خُطَطِ التَّنْمِيَةِ الْبَشَرِيَّةِ.',2),('أَسْتَنْتِجُ الْعَلاماتِ الْمُمَيِّزَةَ الْمُعْتَمَدَةَ لِلْمُدُنِ الذَّكِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّانِيَةُ: مُواصَفاتُ الْمُدُنِ الذَّكِيَّةِ', 'قامَ الْكَثيرُ مِنَ الْمُخَطِّطينَ الْمِعْمارِيّينَ بِإِبْداعِ نَماذِجَ مُبْتَكَرَةٍ لِتَخْطيطِ الْمُدُنِ الذَّكِيَّةِ، وَمِنْها رُؤْيَةُ «ثُلاثِيَّةِ الْإِبْداعِ لِلْمُدُنِ الذَّكِيَّةِ»، وَالَّتي أَكَّدَتْ ثَلاثَ ديناميّاتٍ تَشْمَلُ: رَأْسَ الْمالِ الْفِكْرِيِّ، وَصِناعَةَ تَكْوينِ الثَّرْوَةِ، وَالْحُكْمَ التَّشارُكِيَّ. (كِتابُ النَّشاطِ، ص 112)', 'كِتابُ النَّشاطِ ص 112–117', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L18/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('مِنْ ديناميّاتِ ثُلاثِيَّةِ الْإِبْداعِ لِلْمُدُنِ الذَّكِيَّةِ:','[{"id": "a", "text": "رَأْسُ الْمالِ الْفِكْرِيِّ"}, {"id": "b", "text": "عَدَدُ الْأَبْراجِ"}, {"id": "c", "text": "مِساحَةُ الْمَدينَةِ"}]'),('قاعِدَةُ هَرَمِ الْعَلاماتِ الْمُمَيِّزَةِ عِنْدَ كاراجْليو:','[{"id": "a", "text": "الِاسْتِثْمارُ في رَأْسِ الْمالِ الْبَشَرِيِّ وَالِاجْتِماعِيِّ"}, {"id": "b", "text": "تَوْسيعُ الطُّرُقِ"}, {"id": "c", "text": "زِيادَةُ الْإِنْفاقِ الْعَسْكَرِيِّ"}]'),('مِنَ الْمُدُنِ الرّائِدَةِ في إِسْتْراتيجِيَّةِ النُّمُوِّ الذَّكِيِّ وَالْمُسْتَدامِ:','[{"id": "a", "text": "مالْمو"}, {"id": "b", "text": "طوكْيو"}, {"id": "c", "text": "الْقاهِرَةُ"}]'),('رَأْسُ الْمالِ الْفِكْرِيِّ يُشيرُ إِلى:','[{"id": "a", "text": "الْعَلاقاتِ الْمُكَثَّفَةِ الْمَبْنِيَّةِ عَلَى الْمَعْرِفَةِ وَالْكَفاءاتِ"}, {"id": "b", "text": "الْأَرْصِدَةِ الْبَنْكِيَّةِ"}, {"id": "c", "text": "الْمَصانِعِ وَالْآلاتِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y10-T3-L19', 'الرُّؤْيَةُ الثّالِثَةُ: تَوْسِعَةُ الشَّبَكاتِ الرَّئيسَةِ الْمُعْتَمِدَةِ عَلَى الْمُكَوِّناتِ', 3, 'كِتابُ النَّشاطِ ص 118–123', true, '🎯 أُقارِنُ بَيْنَ النَّموذَجِ الْمورْفولوجِيِّ الْقِياسِيِّ وَالنَّموذَجِ الْمورْفولوجِيِّ الْمُوائِمِ مِنْ حَيْثُ أَوْجُهُ الشَّبَهِ وَالِاخْتِلافِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُقارِنُ بَيْنَ النَّموذَجِ الْمورْفولوجِيِّ الْقِياسِيِّ وَالنَّموذَجِ الْمورْفولوجِيِّ الْمُوائِمِ.',1),('أُقَدِّرُ جُهودَ الْباني الْمُؤَسِّسِ وَالْقِيادَةِ الرَّشيدَةِ في مَجالِ الزِّراعَةِ.',2),('أُشيدُ بِمُبادَراتِ الشَّيْخِ مُحَمَّدِ بْنِ راشِدٍ آلِ مَكْتومٍ — رَعاهُ اللهُ — لِتَحْويلِ دُبَيَّ إِلَى الْمَدينَةِ الْأَذْكى في الْعالَمِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الثّالِثَةُ: تَوْسِعَةُ الشَّبَكاتِ الرَّئيسَةِ الْمُعْتَمِدَةِ عَلَى الْمُكَوِّناتِ', 'تَتَعَدَّدُ النَّماذِجُ لِلْمُدُنِ الذَّكِيَّةِ، وَمِنْهَا النَّموذَجُ الْمورْفولوجِيُّ الْقِياسِيُّ الَّذي أَكَّدَ عَلَى الْعَلاقَةِ بَيْنَ الْمُناخِ وَالْمُكَوِّناتِ الْأَرْبَعَةِ لِأَداءِ الطّاقَةِ، وَقَدْ عَمِلَ الْبَعْضُ عَلى مُواءَمَةِ هٰذِهِ النَّماذِجِ مِنْ خِلالِ إِجْراءِ التَّعْديلِ التَّحْديثِيِّ الشّامِلِ عَلَيْهِ لِمِنْطَقَةٍ كَفْؤَةٍ طاقِيًّا وَكَرْبونِيًّا. (كِتابُ النَّشاطِ، ص 118)', 'كِتابُ النَّشاطِ ص 118–123', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L19/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('أَكَّدَ النَّموذَجُ الْمورْفولوجِيُّ الْقِياسِيُّ عَلَى الْعَلاقَةِ بَيْنَ:','[{"id": "a", "text": "الْمُناخِ وَالْمُكَوِّناتِ الْأَرْبَعَةِ لِأَداءِ الطّاقَةِ"}, {"id": "b", "text": "السُّكّانِ وَالْمِساحَةِ"}, {"id": "c", "text": "الصِّناعَةِ وَالتِّجارَةِ"}]'),('مُبادَرَةُ «الشّاحِنِ الْأَخْضَرِ» لِـ:','[{"id": "a", "text": "إِنْشاءِ بُنْيَةٍ تَحْتِيَّةٍ وَمَحَطّاتِ شَحْنٍ لِلسَّيّاراتِ الْكَهْرَبائِيَّةِ"}, {"id": "b", "text": "تَرْكيبِ لَوْحاتٍ كَهْروَضَوْئِيَّةٍ"}, {"id": "c", "text": "تَحْلِيَةِ مِياهِ الْبَحْرِ"}]'),('يَوْمُ الْأَرْضِ الْعالَمِيُّ في:','[{"id": "a", "text": "22 أَبْريلَ"}, {"id": "b", "text": "5 يونْيو"}, {"id": "c", "text": "1 يَنايِرَ"}]'),('قالَ الشَّيْخُ زايِدٌ — رَحِمَهُ اللهُ: «أَرِني بَلَدًا يَتَمَتَّعُ بِقاعِدَةٍ … قَوِيَّةٍ، أُرِكَ بَلَدًا قَوِيًّا راسِخًا»:','[{"id": "a", "text": "زِراعِيَّةٍ"}, {"id": "b", "text": "عَسْكَرِيَّةٍ"}, {"id": "c", "text": "تِجارِيَّةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=10 and term=3
                 and sort_order=6 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y10-T3-L20', 'الرُّؤْيَةُ الرّابِعَةُ: تَرْسيخُ دَعائِمِ الِاسْتِدامَةِ في الْمُدُنِ الذَّكِيَّةِ', 3, 'كِتابُ النَّشاطِ ص 124–129', true, '🎯 أَتَعَرَّفُ مَفْهومَ الِاسْتِدامَةِ وَأَهَمِّيَّتَها في حِفْظِ حُقوقِ الْأَجْيالِ الْقادِمَةِ في الثَّرْوَةِ وَالْحَياةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَعَرَّفُ مَفْهومَ الِاسْتِدامَةِ وَأَهَمِّيَّتَها في حِفْظِ حُقوقِ الْأَجْيالِ الْقادِمَةِ.',1),('أَسْتَنْتِجُ أَثَرَ التَّعْديلِ التَّحْديثِيِّ في تَرْشيدِ اسْتِهْلاكِ الطّاقَةِ وَخَفْضِ الِانْبِعاثاتِ الْكَرْبونِيَّةِ.',2),('أُدْرِكُ أَهَمِّيَّةَ الْمُحافَظَةِ عَلَى الْمَباني التُّراثِيَّةِ في تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الرُّؤْيَةُ الرّابِعَةُ: تَرْسيخُ دَعائِمِ الِاسْتِدامَةِ في الْمُدُنِ الذَّكِيَّةِ', 'تَسْعَى الدُّوَلُ لِتَحْقيقِ تَنْمِيَةٍ مُسْتَدامَةٍ في كافَّةِ الْمَجالاتِ، مِنْهَا الِاسْتِدامَةُ الْعُمْرانِيَّةُ الَّتي تَسْعى إِلى تَحْقيقِ مَناطِقَ كَفْؤَةٍ طاقِيًّا وَكَرْبونِيًّا، وَقَدْ أَثْبَتَتْ هٰذِهِ الدِّراسَةُ الْعَلاقَةَ الْوَثيقَةَ بَيْنَ الطّاقَةِ وَالتَّنْمِيَةِ الْمُسْتَدامَةِ مِنْ خِلالِ تَكامُلِ عَناصِرِ الْبيئَةِ وَالْمُجْتَمَعِ وَالِاقْتِصادِ في تَحْقيقِها. (كِتابُ النَّشاطِ، ص 124)', 'كِتابُ النَّشاطِ ص 124–129', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y10-T3-L20/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 10, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('عَرَّفَ التَّنْمِيَةَ الْمُسْتَدامَةَ تَقْريرُ لَجْنَةِ:','[{"id": "a", "text": "بْرونْتْلانْد"}, {"id": "b", "text": "ساتونَ"}, {"id": "c", "text": "كاراجْليو"}]'),('مِنْ عَناصِرِ تَحْقيقِ التَّنْمِيَةِ الْمُسْتَدامَةِ:','[{"id": "a", "text": "الْبيئَةُ وَالْمُجْتَمَعُ وَالِاقْتِصادُ"}, {"id": "b", "text": "الطُّرُقُ وَالْمَطاراتُ"}, {"id": "c", "text": "السِّياحَةُ وَحْدَها"}]'),('رُؤْيَةُ أَبوظَبِيَ:','[{"id": "a", "text": "2030 م"}, {"id": "b", "text": "2021 م"}, {"id": "c", "text": "2016 م"}]'),('الطّاقَةُ — في مُثَلَّثِ الِاسْتِدامَةِ — تُشَكِّلُ:','[{"id": "a", "text": "مَصْدَرًا رَئيسًا لِلضُّغوطِ الْبيئِيَّةِ"}, {"id": "b", "text": "مَطْلَبًا مُسْبَقًا اجْتِماعِيًّا"}, {"id": "c", "text": "الْمُحَرِّكَ الِاقْتِصادِيَّ الْكُلِّيَّ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;
commit;