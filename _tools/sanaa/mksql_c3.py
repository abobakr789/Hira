import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import c3_meta as M
q = lambda s: "$q$" + s + "$q$"
def sql(y):
    U = ',\n'.join("(5,%d,%d,%d,%s,'native',false)" % (y, t, so, q(u)) for t, so, u in M.units())
    cnt = {}; L = []
    for s in M.LES:
        k = s['unit']; cnt[k] = cnt.get(k, 0) + 1
        L.append("(%d,%s,%d,%s,%s,%s,%s)" % (M.term(s['stem']), q(s['unit']), cnt[k], q(M.code(y, s['stem'])), q(s['title']), q(s['pages']), q(s['obj'])))
    R = [(0,'slides','teacher-deck.html','عرض المعلم','teacher'),(1,'worksheet','worksheets-A4.html','أوراق المستويات الأربعة (A4)','student'),
         (2,'worksheet','pod-sheet.html','نشاط أصحاب الهمم','student'),(3,'worksheet','answer-key.html','مفتاح الإجابة للمعلم','teacher'),
         (4,'file','sources-concept-card.html','ورقة المصادر والمفاهيم','student'),(5,'group_pack','group-work.html','العمل الجماعي: بطاقات المجموعات الأربع','teacher')]
    K = ',\n'.join("(%d,'%s','%s',%s,'%s')" % (a, b, c, q(d), e) for a, b, c, d, e in R)
    return f"""with u as (insert into units(subject_id,year_group,term,sort_order,title_ar,track,is_published) values
{U} returning id,term,title_ar),
l as (insert into lessons(unit_id,sort_order,code,title_ar,periods,book_pages,objective_ar,is_published)
select u.id,v.so,v.code,v.t,1,v.bp,v.ob,false from (values
{',\n'.join(L)}) v(term,ut,so,code,t,bp,ob) join u on u.term=v.term and u.title_ar=v.ut returning id,code)
insert into lesson_resources(lesson_id,kind,title_ar,url,is_public,sort_order,audience)
select l.id,k.kind::resource_kind,k.t,'resources/ssd/'||l.code||'/'||k.f,false,k.so,k.aud from l cross join (values
{K}) k(so,kind,f,t,aud);"""
y = int(sys.argv[1]); open('/tmp/c3_y%d.sql' % y, 'w', encoding='utf8').write(sql(y)); print(len(sql(y)), len(M.units()), len(M.LES))
