# -*- coding: utf-8 -*-
"""توليدُ أمرِ الإدراجِ لدروسِ الفصلِ الثالثِ للصفِّ السابع."""
import json

SUBJ_ID = 3
UNITS = [('eh-y7-t1.json', 'الْإِماراتُ تاريخُنا (1): مِنْ تَشَكُّلِ الْأَرْضِ إِلى أَوَّلِ مُجْتَمَعٍ', 4, 1),
         ('eh-y7-t2.json', 'الْإِماراتُ تاريخُنا (2): الْعَصْرُ الْبِرونْزِيُّ — واحاتٌ وَحَضارَةٌ', 7, 2),
         ('eh-y7-t3.json', 'الْإِماراتُ تاريخُنا (3): الْفَلَجُ وَالْإِبِلُ وَالْإِمْبِراطورِيّاتُ', 9, 3)]
RES = [('slides', 'عرض المعلم', 'teacher-deck.html', 'teacher', 0),
       ('worksheet', 'أوراق المستويات الأربعة (A4)', 'worksheets-A4.html', 'student', 1),
       ('worksheet', 'نَشاطُ أَصْحابِ الْهِمَمِ', 'pod-sheet.html', 'student', 2),
       ('worksheet', 'مفتاح الإجابة للمعلم', 'answer-key.html', 'teacher', 3),
       ('file', 'وَرَقَةُ الْمَصادِرِ وَالْمَفاهيمِ', 'sources-concept-card.html', 'student', 4),
       ('group_pack', 'العمل الجماعي: بطاقات المجموعات الأربع', 'group-work.html', 'teacher', 5)]


def q(s):
    return "'" + s.replace("'", "''") + "'"


def vals(rows):
    return ','.join('(' + ','.join(r) + ')' for r in rows)


out = ['begin;']
for js, title, sort, term in UNITS:
    L = json.load(open(f'/home/claude/hira/_authoring/{js}', encoding='utf-8'))
    out.append(f"""
insert into units (subject_id, year_group, term, sort_order, title_ar, is_published, track)
select {SUBJ_ID}, 7, {term}, {sort}, {q(title)}, true, 'native'
where not exists (select 1 from units where subject_id={SUBJ_ID} and year_group=7 and term={term}
                  and sort_order={sort} and track='native');""")
    for x in L:
        c, t = x['code'], x['title']
        crit = vals([[q(s), str(i + 1)] for i, s in enumerate(x['lev'])])
        res = vals([[q(k), q(tt), q(f), q(a), str(n)] for k, tt, f, a, n in RES])
        qs = vals([[q(st), q(json.dumps(
            [{'id': chr(97 + j), 'text': o} for j, o in enumerate(ops)], ensure_ascii=False))]
            for st, ops, _ in x['qs']])
        out.append(f"""
with u as (select id from units where subject_id={SUBJ_ID} and year_group=7 and term={term}
                 and sort_order={sort} and track='native' limit 1),
ins as (
  insert into lessons (unit_id, sort_order, code, title_ar, periods, book_pages,
                       is_published, objective_ar)
  select u.id, {x['sort']}, {q(c)}, {q(t)}, 3, {q(x['pages'])}, true, {q(x['obj'])} from u
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
       select l.id, v.s, v.n from l, (values {crit}) v(s,n)),
b1 as (insert into lesson_book_texts (lesson_id, kind, title, body, pages, glossary)
       select l.id, 'prose', {q(t)}, {q(x['bt'])}, {q(x['pages'])}, '[]'::jsonb from l),
r1 as (insert into lesson_resources (lesson_id, kind, title_ar, url, is_public, sort_order, audience)
       select l.id, v.k::resource_kind, v.t, 'resources/ssd/{c}/'||v.f,
              (v.a <> 'teacher'), v.n, v.a
       from l, (values {res}) v(k,t,f,a,n)),
q1 as (insert into questions (subject_id, year_group, term, qtype, stem_ar, options,
                              difficulty, is_active, track, lesson_id)
       select {SUBJ_ID}, 7, {term}, 'mcq', v.s, v.o::jsonb, 1, true, 'native', l.id
       from l, (values {qs}) v(s,o)
       returning id)
insert into question_keys (question_id, correct)
select q1.id, '"a"'::jsonb from q1;""")
out.append('commit;')
open('/home/claude/g7/insert_eh.sql', 'w', encoding='utf-8').write('\n'.join(out))
print('ok')
