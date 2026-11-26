"""رحلة القنديل للصف الثالث (لغة عربية): يبني student-journey.html من بيانات g2/g3t*u* ونصوص الكتاب المخزّنة.
الاستعمال: python3 _tools/journey/y3_journeys.py [CODE ...]"""
import sys,os,json,glob,re
HERE0=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE0)
import build_journeys as bj
ROOT=bj.ROOT
bt=json.load(open(HERE0+'/y3_book_texts.json',encoding='utf8'))
# stage Y3 K/L
K={};L={}
for d in sorted(glob.glob(ROOT+'/_tools/arabic/g2/g3t*u*')):
    for f in glob.glob(d+'/L*.deck.json'):
        k=json.load(open(f,encoding='utf8')); K[k['code']]=k
        L[k['code']]=json.load(open(f.replace('.deck.json','.json'),encoding='utf8'))
# highlights from stored book text
HL={}
for c,v in bt.items():
    HL[c]=re.findall(r'\[\[(.+?)\]\]',v['body'])
bj.HIGHLIGHTS.update(HL)
# pool of words from all Y3 lessons
bj.POOL=None
pool={}
for c,k in K.items():
    for w in k['words']: pool.setdefault(bj.norm(w[0]),[w[0],w[1],w[2] if len(w)>2 else '✨'])
for w in json.load(open(bj.HERE+'/glossary.json',encoding='utf8'))['words']: pool.setdefault(bj.norm(w[0]),list(w))
for c in list(K)[:0]: pass
for w in json.load(open(HERE0+'/glossary_y3.json',encoding='utf8'))['words']: pool.setdefault(bj.norm(w[0]),list(w))
bj.POOL=pool
def fix_order(k):
    items=k.get('order',[])
    if not all(it[1].strip().startswith('(') for it in items): return
    for it in items:
        tiles=[x.strip() for x in it[1].strip().strip('()').split('–')]; ans=it[2]; toks=ans.replace('.','').split()
        new=[]
        for t in tiles:
            if t in ans: new.append(t); continue
            m=[w for w in toks if bj.norm(w)==bj.norm(t) or bj.skel(w)==bj.skel(t) or bj.norm(w)==bj.norm(t)+'ي']
            new.append(m[0] if len(m)==1 else t)
        it[1]='('+' – '.join(new)+')'
def run(codes):
    bad={}
    tpl=bj.make_template()
    all_learned=[(c,k['learned']) for c,k in K.items()]
    out=[]
    for code in codes:
        fix_order(K[code])
        try: D=bj.build_data(code,L[code],K[code],all_learned)
        except Exception as e:
            bad[code]=str(e)[:120]; continue
        D=bj.drop_pages(D)
        data=json.dumps(D,ensure_ascii=False).replace('</','<\\/')
        html=tpl.replace('__DATA__',data).replace('__TITLEPLAIN__',D['titlePlain']).replace('__TITLE__',D['title'])
        html=html.replace('اللغة العربية · الصف الأول','اللغة العربية · الصف الثالث')
        p=f'{ROOT}/resources/ar/{code}/student-journey.html'
        open(p,'w',encoding='utf8').write(html); out.append(code)
    for c,e in bad.items(): print('FAIL',c,e)
    return out
if __name__=='__main__':
    print(run(sys.argv[1:] or sorted(K)))
