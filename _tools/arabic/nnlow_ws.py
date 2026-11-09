import sys,os,random
sys.path.insert(0,'/tmp/nnlow'); from t15 import TX
CSS=open('/tmp/g6v2/ws.py').read().split('CSS="""')[1].split('"""')[0]
from playwright.sync_api import sync_playwright
G={1:"الصف الأول",2:"الصف الثاني",3:"الصف الثالث",4:"الصف الرابع",5:"الصف الخامس"}
def ln(n): return "".join("<div class='ln'></div>" for _ in range(n))
def page(code,lv,col,body):
    tx=TX[code]; g=int(code.split('-')[1][1:])
    return f"""<div class='hd'><div><div class='t'>قِرَاءَةٌ إِضَافِيَّةٌ: {tx['title']}</div><div class='sm'>العربية للناطقين بغيرها · {G[g]}</div></div><div class='lv' style='background:{col}'>{lv}</div></div>
<div class='meta'><span>الاسم: ....................................</span><span>التاريخ: ..........</span></div>
<div class='box' style='background:#FFF8EC'><span class='q'>📖 {tx['title']}</span><div style='font-size:{22 if g<=2 else 18}px;line-height:2.1'>{'<br>'.join(tx['body'])}</div></div>{body}"""
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    for code,tx in sorted(TX.items()):
        g=int(code.split('-')[1][1:]); h=sum(map(ord,code)); r=random.Random(h)
        tf="<div class='box'><span class='q'>أَضَعُ ✓ أَوْ ✗:</span>"+"".join(f"<div style='font-size:18px'>☐ {s}</div>" for s,_ in tx['tf'])+"</div>"
        qs="<div class='box'><span class='q'>أُجِيبُ مِنَ النَّصِّ:</span>"+"".join(f"<div>{i+1}. {q}</div>{ln(1)}" for i,(q,a) in enumerate(tx['qs']))+"</div>"
        sh=tx['body'][:]; r.shuffle(sh)
        order="<div class='box'><span class='q'>أُرَتِّبُ الْجُمَلَ كَمَا فِي النَّصِّ (١، ٢، ٣…):</span>"+"".join(f"<div>( &nbsp; ) {x}</div>" for x in sh)+"</div>"
        draw="<div class='box'><span class='q'>أَرْسُمُ مَا فَهِمْتُهُ مِنَ النَّصِّ:</span><div style='height:180px;border:2px dashed #CFE3E1;border-radius:10px;margin-top:6px'></div></div>"
        write=f"<div class='box'><span class='q'>أَكْتُبُ {'جُمْلَةً' if g<=2 else 'ثَلَاثَ جُمَلٍ'} عَنِ النَّصِّ بِكَلِمَاتِي:</span>{ln(2 if g<=2 else 4)}</div>"
        acts=[tf,order,qs]; k=h%3
        b1=page(code,"★ دعم أكبر","#A35E24",acts[k]+draw)
        b2=page(code,"★★ دعم متوسط","#5F6C78",acts[(k+1)%3]+qs if acts[(k+1)%3]!=qs else qs+tf)
        b3=page(code,"★★★ استقلالية أكثر","#6B46A8",qs+order+write)
        d=f"/tmp/hira/resources/g{g}/{code}"; os.makedirs(d,exist_ok=True)
        open('/tmp/nnlow/t.html','w').write(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{b1}<div class='pb'></div>{b2}<div class='pb'></div>{b3}</body></html>")
        pg.goto('file:///tmp/nnlow/t.html'); pg.wait_for_timeout(80); pg.pdf(path=f'{d}/reading-sheet.pdf',format='A4',print_background=True)
    b.close()
print('done')
