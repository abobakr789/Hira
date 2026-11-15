
insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 3, 1, 'الْوَحْدَةُ الْخامِسَةُ: الْإِماراتُ وَالْعالَمُ الْحَديثُ — بيئَةٌ وَدَوْلَةٌ وَقِيادَةٌ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=3
                  and sort_order=1 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 1, 'SS-Y8-T3-L1', 'النَّباتاتُ الطَّبيعِيَّةُ (السّاحِلِيَّةُ وَالْجَبَلِيَّةُ)', 3, 'ص 14–25', true, '🎯 أَسْتَنْتِجُ صِفاتِ النَّباتاتِ السّاحِلِيَّةِ وَالْجَبَلِيَّةِ، وَأُقارِنُ بَيْنَ فَوائِدِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ عَلَى الْخارِطَةِ مَناطِقَ انْتِشارِ النَّباتاتِ السّاحِلِيَّةِ وَالْجَبَلِيَّةِ.',1),('أَسْتَنْتِجُ صِفاتِ النَّباتاتِ السّاحِلِيَّةِ وَالْجَبَلِيَّةِ.',2),('أُقَدِّمُ مُقْتَرَحاتٍ تُسْهِمُ في الْحِفاظِ عَلَى الْحَياةِ النَّباتِيَّةِ في الدَّوْلَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'النَّباتاتُ الطَّبيعِيَّةُ (السّاحِلِيَّةُ وَالْجَبَلِيَّةُ)', 'تَتَمَيَّزُ بيئَةُ دَوْلَةِ الْإِماراتِ الْعَرَبِيَّةِ الْمُتَّحِدَةِ بِالتَّنَوُّعِ الْكَبيرِ في أَشْجارِها وَشُجَيْراتِها وَنَباتاتِها، وَأَغْلَبُها يَتَمَيَّزُ بِشَكْلِهِ الْجَمالِيِّ وَفائِدَتِهِ الطِّبِّيَّةِ. وَيُعَدُّ نَباتُ الْقُرْمِ أَحَدَ النَّباتاتِ السّاحِلِيَّةِ (الشّاطِئِيَّةِ) الَّتي تَنْمو عِنْدَ الْحَدِّ الْفاصِلِ بَيْنَ الْبَحْرِ وَالْيابِسَةِ في الْمَناطِقِ الْحارَّةِ وَالْمَدارِيَّةِ، وَيَتَمَيَّزُ بِقُدْرَتِهِ عَلى مُقاوَمَةِ الظُّروفِ الْبيئِيَّةِ الصَّعْبَةِ الَّتي تَعْجِزُ عَنْ مُواجَهَتِها مُعْظَمُ النَّباتاتِ الْأُخْرى، وَهُوَ نَباتٌ يُشارِكُ في تَشْكيلِ نِظامٍ بيئِيٍّ وَحَيَوِيٍّ مُتَكامِلٍ.', 'ص 14–25', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L1/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الِاسْمُ الْعِلْمِيُّ لِنَباتِ الْقُرْمِ هُوَ:','[{"id": "a", "text": "Avicennia marina"}, {"id": "b", "text": "Acacia tortilis"}, {"id": "c", "text": "Phoenix dactylifera"}]'),('تَمْتَلِكُ أَكْبَرَ نِسْبَةٍ مِنْ أَشْجارِ الْقُرْمِ في الدَّوْلَةِ إِمارَةُ:','[{"id": "a", "text": "أَبوظَبي"}, {"id": "b", "text": "الشّارِقَةِ"}, {"id": "c", "text": "الْفُجَيْرَةِ"}]'),('تُوصَفُ شَجَرَةُ السَّمُرِ بِشَجَرَةِ:','[{"id": "a", "text": "الْمِظَلَّةِ الشّائِكَةِ"}, {"id": "b", "text": "الْحَياةِ"}, {"id": "c", "text": "الْعَنْبَرِ"}]'),('تَمْتَدُّ جُذورُ السَّمُرِ في التُّرْبَةِ الرَّمْلِيَّةِ إِلى ما يُقارِبُ:','[{"id": "a", "text": "17 مِتْرًا"}, {"id": "b", "text": "7 أَمْتارٍ"}, {"id": "c", "text": "70 مِتْرًا"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 2, 'SS-Y8-T3-L2', 'أَمْريكا اللّاتينِيَّةُ', 3, 'ص 27–44', true, '🎯 أُحَدِّدُ السِّماتِ الطَّبيعِيَّةَ وَالْبَشَرِيَّةَ لِقارَّةِ أَمْريكا اللّاتينِيَّةِ، وَأُبَيِّنُ أَوْجُهَ التَّعاوُنِ مَعَ دَوْلَةِ الْإِماراتِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ السِّماتِ الطَّبيعِيَّةَ لِقارَّةِ أَمْريكا اللّاتينِيَّةِ.',1),('أَسْتَنْتِجُ السِّماتِ الْبَشَرِيَّةَ لِسُكّانِ الْقارَّةِ وَمَواردَها.',2),('أُبَيِّنُ أَوْجُهَ التَّعاوُنِ بَيْنَ دَوْلَةِ الْإِماراتِ وَالْبَرازيلِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'أَمْريكا اللّاتينِيَّةُ', 'يَعْتَمِدُ اقْتِصادُ دُوَلِ قارَّةِ أَمْريكا اللّاتينِيَّةِ عَلَى الْمَوارِدِ الطَّبيعِيَّةِ، وَهِيَ: ما هَيَّأَهُ اللهُ لِلْإِنْسانِ مِنْ ماءٍ وَهَواءٍ وَنَباتٍ وَحَيَوانٍ وَطاقَةٍ بِمُخْتَلِفِ صُوَرِها، إِضافَةً إِلى ما تَحْوِيهِ الْأَرْضُ وَالْبِحارُ مِنْ ثَرَواتٍ طَبيعِيَّةٍ. فَدُوَلُ أَمْريكا اللّاتينِيَّةِ بَعْضُها تَعْتَمِدُ اعْتِمادًا كَبيرًا عَلَى الْغاباتِ الْواسِعَةِ، وَالْبَعْضُ يَعْتَمِدُ عَلَى الثَّرْوَةِ الْحَيَوانِيَّةِ لِوُجودِ الْمَراعي الطَّبيعِيَّةِ؛ وَتَتَّسِمُ الْقارَّةُ بِالتَّنَوُّعِ الطَّبيعِيِّ الْهائِلِ.', 'ص 27–44', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L2/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('تَبْلُغُ مِساحَةُ أَمْريكا اللّاتينِيَّةِ:','[{"id": "a", "text": "21.069.5 كم²"}, {"id": "b", "text": "2.106 كم²"}, {"id": "c", "text": "210.695 كم²"}]'),('مِنْ أَهَمِّ جِبالِ أَمْريكا اللّاتينِيَّةِ:','[{"id": "a", "text": "الْأَنْديزُ"}, {"id": "b", "text": "الْأَلْبُ"}, {"id": "c", "text": "الْهيمالايا"}]'),('أَكْبَرُ دَوْلَةٍ في أَمْريكا اللّاتينِيَّةِ مِساحَةً وَسُكّانًا:','[{"id": "a", "text": "الْبَرازيلُ"}, {"id": "b", "text": "الْمَكْسيكُ"}, {"id": "c", "text": "الْأَرْجِنْتينُ"}]'),('الْكَهْرَباءُ الْموَلَّدَةُ بِاسْتِخْدامِ الْمِياهِ الْمُتَحَرِّكَةِ تُسَمَّى الطّاقَةَ:','[{"id": "a", "text": "الْكَهْرومائِيَّةَ"}, {"id": "b", "text": "النَّوَوِيَّةَ"}, {"id": "c", "text": "الشَّمْسِيَّةَ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 3, 'SS-Y8-T3-L3', 'الدَّوْلَةُ وَالْحُكومَةُ', 3, 'ص 45–57', true, '🎯 أَشْرَحُ مُقَوِّماتِ قِيامِ الدَّوْلَةِ، وَأُحَدِّدُ وَظائِفَ الْحُدودِ السِّياسِيَّةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أوَضِّحُ أُسُسَ قِيامِ الدَّوْلَةِ وَأَرْكانَها الثَّلاثَةَ.',1),('أَشْرَحُ مُقَوِّماتِ قِيامِ الدَّوْلَةِ وَعَوامِلَ قُوَّتِها.',2),('أُحَدِّدُ وَظائِفَ الْحُدودِ السِّياسِيَّةِ وَأُمَيِّزُ أَشْكالَ الدُّوَلِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الدَّوْلَةُ وَالْحُكومَةُ', 'وَيُقْصَدُ بِالدَّوْلَةِ: مَجْموعَةٌ مُنَظَّمَةٌ مِنَ الْأَفْرادِ تَعيشُ عَلى مِساحَةٍ مُحَدَّدَةٍ مِنَ الْأَرْضِ تَجْمَعُها سُلْطَةٌ حاكِمَةٌ واحِدَةٌ تَتَوَلّى إِدارَةَ شُؤونِها. وَلِتَحَقُّقِ قِيامِ الدَّوْلَةِ لا بُدَّ مِنْ وُجودِ سُلْطَةٍ عُلْيا عَلى رَأْسِها الْحاكِمُ، وَيَخْضَعُ لَها جَميعُ الْأَفْرادِ الَّذينَ يَكونونَ الْمَجْموعَةَ السِّياسِيَّةَ، وَالسُّلْطَةُ السِّياسِيَّةُ (تُمَثِّلُهَا الْحُكومَةُ) هِيَ الَّتي تُشَرِّعُ الْقَوانينَ وَتوَفِّرُ الْخَدَماتِ وَتَكْفُلُ سِيادَةَ الدَّوْلَةِ وَتُحافِظُ عَلَيْها.', 'ص 45–57', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L3/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('الدَّوْلَةُ الَّتي تَكونُ الْحُكومَةُ فيها واحِدَةً تُسَمَّى الدَّوْلَةَ:','[{"id": "a", "text": "الْبَسيطَةَ"}, {"id": "b", "text": "الْمُرَكَّبَةَ"}, {"id": "c", "text": "الِاتِّحادِيَّةَ"}]'),('مِنْ وَظائِفِ الْحُدودِ السِّياسِيَّةِ:','[{"id": "a", "text": "ضَبْطُ عَمَلِيّاتِ التَّسَلُّلِ وَالتَّهْريبِ"}, {"id": "b", "text": "زِيادَةُ الْأَمْطارِ"}, {"id": "c", "text": "تَوْليدُ الطّاقَةِ"}]'),('مِنَ الْعَوامِلِ الْبَشَرِيَّةِ في قِيامِ الدُّوَلِ:','[{"id": "a", "text": "الْمَوارِدُ الِاقْتِصادِيَّةُ"}, {"id": "b", "text": "التَّضاريسُ"}, {"id": "c", "text": "الْمُناخُ"}]'),('قامَتْ دَوْلَةُ الْإِماراتِ الْعَرَبِيَّةُ الْمُتَّحِدَةُ عامَ:','[{"id": "a", "text": "1971 م"}, {"id": "b", "text": "2004 م"}, {"id": "c", "text": "1992 م"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=1 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 4, 'SS-Y8-T3-L4', 'صاحِبُ السُّمُوِّ الشَّيْخُ مُحَمَّدُ بْنُ زايِدٍ آلُ نَهْيانَ… قِيادَةٌ وَإِنْجازاتٌ', 3, 'ص 58–75', true, '🎯 أُوَضِّحُ السّيرَةَ الذّاتِيَّةَ لِصاحِبِ السُّمُوِّ رَئيسِ الدَّوْلَةِ، وَأَعْتَزُّ بِمَواقِفِهِ وَمُبادَراتِهِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أُوَضِّحُ السّيرَةَ الذّاتِيَّةَ لِصاحِبِ السُّمُوِّ الشَّيْخِ مُحَمَّدِ بْنِ زايِدٍ آلِ نَهْيانَ.',1),('أُناقِشُ الْمَسْؤولِيّاتِ وَالْأَدْوارَ الْقِيادِيَّةَ الَّتي يُمارِسُها سُمُوُّهُ.',2),('أَعْتَزُّ بِالْمَواقِفِ وَالْمُبادَراتِ الْمُشْرِقَةِ الَّتي أَطْلَقَها سُمُوُّهُ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'صاحِبُ السُّمُوِّ الشَّيْخُ مُحَمَّدُ بْنُ زايِدٍ آلُ نَهْيانَ… قِيادَةٌ وَإِنْجازاتٌ', 'صاحِبُ السُّمُوِّ الشَّيْخُ مُحَمَّدُ بْنُ زايِدٍ آلُ نَهْيانَ رَئيسُ الدَّوْلَةِ — حَفِظَهُ اللهُ — قائِدٌ تاريخِيٌّ مِنْ طِرازٍ رَفيعٍ، صَنَعَ الْفارِقَ عَلَى الْمُسْتَوَى الْمَحَلِّيِّ، سَطَّرَ مَواقِفَ وَإِنْجازاتٍ يُشارُ إِلَيْها بِالْبَنانِ عَلى مُسْتَوى تَعْزيزِ السَّلْمِ وَالْأَمْنِ في الْمِنْطَقَةِ وَالْعالَمِ، وَيُسْهِمُ في نَشْرِ مَفاهيمِ التَّسامُحِ وَالتَّعايُشِ السِّلْمِيِّ بَيْنَ الْأَدْيانِ وَالْمُجْتَمَعاتِ، وَرائِدٌ مِنْ روّادِ الْعَمَلِ الْإِنْسانِيِّ وَالْخَيْرِيِّ عَلى مُسْتَوَى الْعالَمِ.', 'ص 58–75', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L4/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('وُلِدَ صاحِبُ السُّمُوِّ الشَّيْخُ مُحَمَّدُ بْنُ زايِدٍ آلُ نَهْيانَ عامَ:','[{"id": "a", "text": "1961 م"}, {"id": "b", "text": "1971 م"}, {"id": "c", "text": "1951 م"}]'),('تَخَرَّجَ سُمُوُّهُ مِنْ أَكاديمِيَّةِ ساندهيرْسْتَ الْعَسْكَرِيَّةِ عامَ:','[{"id": "a", "text": "1979 م"}, {"id": "b", "text": "2004 م"}, {"id": "c", "text": "1992 م"}]'),('تَوَلّى سُمُوُّهُ وِلايَةَ عَهْدِ إِمارَةِ أَبوظَبي في:','[{"id": "a", "text": "نوفَمْبِرَ 2004 م"}, {"id": "b", "text": "مايو 2022 م"}, {"id": "c", "text": "يَنايِرَ 2005 م"}]'),('«تَحَدّي مُحَمَّدِ بْنِ زايِدٍ الْعالَمِيُّ» يَخْتَصُّ بِمَجالِ:','[{"id": "a", "text": "الرّوبوتِ وَالْأَنْظِمَةِ ذاتِيَّةِ التَّحَكُّمِ"}, {"id": "b", "text": "الزِّراعَةِ"}, {"id": "c", "text": "السِّياحَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select 3, 8, 3, 2, 'الْوَحْدَةُ السّادِسَةُ: النَّهْضَةُ الْأوروبِّيَّةُ وَالثَّوْرَةُ الصِّناعِيَّةُ الرّابِعَةُ', true, 'native'
where not exists (select 1 from units where subject_id=3 and year_group=8 and term=3
                  and sort_order=2 and track='native');

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 5, 'SS-Y8-T3-L5', 'النَّهْضَةُ الْأوروبِّيَّةُ', 3, 'ص 78–90', true, '🎯 أَسْتَنْتِجُ عَوامِلَ قِيامِ النَّهْضَةِ الْأوروبِّيَّةِ، وَأَتَعَرَّفُ أَبْرَزَ روّادِها.' from u
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
       select l.id, v.s, v.n from l, (values ('أَصِفُ الْحالَةَ الْعامَّةَ في أوروبّا قَبْلَ عَصْرِ النَّهْضَةِ.',1),('أَسْتَنْتِجُ عَوامِلَ قِيامِ النَّهْضَةِ الْأوروبِّيَّةِ.',2),('أَتَعَرَّفُ قِصَصًا وَمَعْلوماتٍ لِشَخْصِيّاتٍ مِنْ روّادِ عَصْرِ النَّهْضَةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'النَّهْضَةُ الْأوروبِّيَّةُ', 'أَمّا «عَصْرُ النَّهْضَةِ»، فَهِيَ تَسْمِيَةٌ أَطْلَقَهَا الْمُؤَرِّخونَ عَلَى الْمَرْحَلَةِ الِانْتِقالِيَّةِ ما بَيْنَ الْعُصورِ الْوُسْطى وَالْعُصورِ الْحَديثَةِ مِنَ الْقَرْنِ الثّالِثَ عَشَرَ حَتَّى الْقَرْنِ السّادِسَ عَشَرَ، وَهُوَ عَصْرُ تَحَرُّرِ الْعَقْلِ الْإِنْسانِيِّ مِنْ قُيودِ الْقُرونِ الْوُسْطى. وَقَدْ قامَ هٰذا الْعَصْرُ عَلى أَكْتافِ رِجالٍ أَرادوا الْخُروجَ مِنْ حالَةِ الْجُمودِ وَالْجَهْلِ وَبَعْثِ عالَمٍ جَديدٍ، وَلَمْ تَقُمْ هٰذِهِ النَّهْضَةُ في أوروبّا كُلِّها في وَقْتٍ واحِدٍ وَإِنَّما بَدَأَتْ في إيطالْيا وَانْتَشَرَتْ في بَقِيَّةِ أوروبّا مُنْذُ الْقَرْنِ السّادِسَ عَشَرَ الْميلادِيِّ.', 'ص 78–90', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L5/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('كَلِمَةُ (Renaissance) تَرْجَمَتُها الْحَرْفِيَّةُ:','[{"id": "a", "text": "الْبَعْثُ أَوِ الْإِحْياءُ"}, {"id": "b", "text": "الْحَرْبُ"}, {"id": "c", "text": "الْعُزْلَةُ"}]'),('ظَهَرَتْ حَرَكَةُ النَّهْضَةِ بِدايَةً في:','[{"id": "a", "text": "إيطالْيا"}, {"id": "b", "text": "فَرَنْسا"}, {"id": "c", "text": "إِنْجِلْتِرا"}]'),('صاحِبُ كِتابِ «الْكوميدْيا الْإِلٰهِيَّةِ» هُوَ:','[{"id": "a", "text": "دانْتي أَليجييري"}, {"id": "b", "text": "ميكافيلّي"}, {"id": "c", "text": "أَراسْموسُ"}]'),('كِتابُ «الْأَميرِ» في نُظُمِ الْحُكْمِ كَتَبَهُ:','[{"id": "a", "text": "ميكافيلّي"}, {"id": "b", "text": "مايْكَلُ أَنْجِلو"}, {"id": "c", "text": "ليوناردو دافينْشي"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 6, 'SS-Y8-T3-L6', 'اسْتِكْشافُ الْبِحارِ', 3, 'ص 91–103', true, '🎯 أَتَتَبَّعُ التَّطَوُّرَ التّاريخِيَّ لِحَرَكَةِ الْكَشْفِ الْجُغْرافِيِّ وَأَسْتَخْلِصُ نَتائِجَها.' from u
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
       select l.id, v.s, v.n from l, (values ('أُحَدِّدُ الْمَقْصودَ بِمَفْهومِ الْكُشوفِ الْجُغْرافِيَّةِ.',1),('أَتَتَبَّعُ التَّطَوُّرَ التّاريخِيَّ لِحَرَكَةِ الْكَشْفِ الْجُغْرافِيِّ وَدَوافِعَها.',2),('أَسْتَخْلِصُ نَتائِجَ حَرَكَةِ الْكُشوفِ الْجُغْرافِيَّةِ.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'اسْتِكْشافُ الْبِحارِ', 'الْكُشوفُ الْجُغْرافِيَّةُ هِيَ مُحاوَلاتُ الدُّوَلِ الْأوروبِّيَّةِ الْكَشْفَ عَنْ مَناطِقَ جَديدَةٍ عَنْ طَريقِ الْبَحْرِ، مِمّا أَدّى إِلى زِيادَةِ التَّنافُسِ الِاسْتِعْمارِيِّ بَيْنَ هٰذِهِ الدُّوَلِ عَلَى اسْتيطانِ وَاسْتِعْمارِ الْأَراضي الْمُكْتَشَفَةِ. وَقَدْ بَدَأَتْ مُحاوَلاتُ الدُّوَلِ الْأوروبِّيَّةِ في الْقَرْنِ الْخامِسَ عَشَرَ لِاكْتِشافِ مَناطِقَ جَديدَةٍ لَمْ تَكُنْ مَعْروفَةً لَهُمْ مِنْ قَبْلُ، إِذْ كانَتْ مَعْرِفَةُ الْأوروبِّيّينَ بِالْعالَمِ الْخارِجِيِّ لا تَتَجاوَزُ مَعْرِفَةَ السَّواحِلِ الشَّمالِيَّةِ مِنْ قارَّةِ أَفْريقْيا.', 'ص 91–103', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L6/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('بَدَأَتْ مُحاوَلاتُ الْكُشوفِ الْجُغْرافِيَّةِ الْأوروبِّيَّةِ في الْقَرْنِ:','[{"id": "a", "text": "الْخامِسَ عَشَرَ"}, {"id": "b", "text": "الْعِشْرينَ"}, {"id": "c", "text": "الثّامِنِ"}]'),('كَشَفَ طَريقَ رَأْسِ الرَّجاءِ الصّالِحِ:','[{"id": "a", "text": "بارْثَلْميو ديازٌ"}, {"id": "b", "text": "ماجِلّانُ"}, {"id": "c", "text": "جيمْسُ كوكٌ"}]'),('لُقِّبَ شِهابُ الدّينِ أَحْمَدُ بْنُ ماجِدٍ بِـ:','[{"id": "a", "text": "أَسَدِ الْبِحارِ"}, {"id": "b", "text": "أَميرِ الشُّعَراءِ"}, {"id": "c", "text": "شَيْخِ الْجُغْرافِيّينَ"}]'),('بَلَغَ عَدَدُ الْخَرائِطِ الَّتي رُسِمَتْ في عَصْرِ الْحَضارَةِ الْإِسْلامِيَّةِ نَحْوَ:','[{"id": "a", "text": "450 خَريطَةً"}, {"id": "b", "text": "45 خَريطَةً"}, {"id": "c", "text": "4500 خَريطَةٍ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;

with u as (select id from units where subject_id=3 and year_group=8 and term=3
                 and sort_order=2 and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, 7, 'SS-Y8-T3-L7', 'الثَّوْرَةُ الصِّناعِيَّةُ الرّابِعَةُ', 3, 'ص 104–111', true, '🎯 أَتَتَبَّعُ مَراحِلَ تَطَوُّرِ الثَّوْراتِ الصِّناعِيَّةِ، وَأُقَدِّرُ جُهودَ الدَّوْلَةِ في تَبَنّي تِكْنولوجْيا الثَّوْرَةِ الرّابِعَةِ.' from u
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
       select l.id, v.s, v.n from l, (values ('أَتَتَبَّعُ مَراحِلَ تَطَوُّرِ الثَّوْراتِ الصِّناعِيَّةِ الْعالَمِيَّةِ عَبْرَ التّاريخِ.',1),('أَسْتَخْلِصُ مُمَيِّزاتِ الثَّوْرَةِ الصِّناعِيَّةِ الرّابِعَةِ.',2),('أُمَيِّزُ بَيْنَ إِيجابِيّاتِ وَسَلْبِيّاتِ الثَّوْرَةِ الصِّناعِيَّةِ الرّابِعَةِ وَتَحَدِّياتِها.',3)) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', 'الثَّوْرَةُ الصِّناعِيَّةُ الرّابِعَةُ', 'الثَّوْرَةُ الصِّناعِيَّةُ الرّابِعَةُ هِيَ ثَوْرَةٌ لَمْ يَشْهَدِ التّاريخُ الْبَشَرِيُّ مِثْلَها إِطْلاقًا، سَواءٌ مِنْ حَيْثُ السُّرْعَةُ أَوِ النِّطاقُ أَوْ مُسْتَوَى التَّعْقيداتِ، وَهِيَ تَعْني جَمْعَ تِكْنولوجْيا الْجيلِ الْقادِمِ وَالْتِقاءَ الْعالَمِ الْحِسِّيِّ بِالْعالَمِ الرَّقَمِيِّ، تَقودُها مُحَرِّكاتٌ رَئيسَةٌ تَتَمَثَّلُ في: الذَّكاءِ الِاصْطِناعِيِّ، وَالرّوبوتاتِ، وَالسَّيّاراتِ ذاتِيَّةِ الْقِيادَةِ، وَالطّابِعاتِ ثُلاثِيَّةِ الْأَبْعادِ، وَالْبَياناتِ الْعِمْلاقَةِ وَالْعُمْلاتِ الِافْتِراضِيَّةِ، وَإِنْتِرْنِتِ الْأَشْياءِ، وَالنّانو تِكْنولوجي، وَتَخْزينِ الطّاقَةِ، وَالْحَوْسَبَةِ الْكَمِّيَّةِ لِلْأَشْياءِ.', 'ص 104–111', '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/SS-Y8-T3-L7/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values ('slides','عرض المعلم','teacher-deck.html','teacher',0),('worksheet','أوراق المستويات الأربعة (A4)','worksheets-A4.html','student',1),('worksheet','نَشاطُ أَصْحابِ الْهِمَمِ','pod-sheet.html','student',2),('worksheet','مفتاح الإجابة للمعلم','answer-key.html','teacher',3),('file','وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ','sources-concept-card.html','student',4),('group_pack','العمل الجماعي: بطاقات المجموعات الأربع','group-work.html','teacher',5)) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select 3, 8, 3, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values ('اسْتَنَدَتِ الثَّوْرَةُ الصِّناعِيَّةُ الثّانِيَةُ إِلى:','[{"id": "a", "text": "الطّاقَةِ الْكَهْرَبائِيَّةِ"}, {"id": "b", "text": "الْمُحَرِّكاتِ الْبُخارِيَّةِ"}, {"id": "c", "text": "الذَّكاءِ الِاصْطِناعِيِّ"}]'),('مِنْ مُحَرِّكاتِ الثَّوْرَةِ الصِّناعِيَّةِ الرّابِعَةِ:','[{"id": "a", "text": "الذَّكاءُ الِاصْطِناعِيُّ وَالرّوبوتاتُ"}, {"id": "b", "text": "الْآلَةُ الْبُخارِيَّةُ"}, {"id": "c", "text": "الْمُقايَضَةُ"}]'),('مِنْ سَلْبِيّاتِ الثَّوْرَةِ الصِّناعِيَّةِ الرّابِعَةِ:','[{"id": "a", "text": "انْتِشارُ الْبَطالَةِ عَلى نِطاقٍ واسِعٍ"}, {"id": "b", "text": "خَفْضُ تَكاليفِ الْإِنْتاجِ"}, {"id": "c", "text": "تَحْسينُ الرِّعايَةِ الصِّحِّيَّةِ"}]'),('أَنْشَأَتْ دَوْلَةُ الْإِماراتِ أَوَّلَ مَجْلِسٍ في الْعالَمِ لِـ:','[{"id": "a", "text": "الثَّوْرَةِ الصِّناعِيَّةِ الرّابِعَةِ"}, {"id": "b", "text": "الْأَمْنِ الْغِذائِيِّ"}, {"id": "c", "text": "الْقُوَّةِ النّاعِمَةِ"}]')) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;