# يولّد data/prereqs-social.json: روابط منتقاة يدويًّا (لا آلية) بين مخرجات الدراسات الاجتماعية ص١–٣ التي لكل منها ٣ أسئلة MCQ فعّالة فأكثر.
# لم أعتمد التكرار الحلزوني للجذع كما في العربية لأن مخرجات الدراسات متباينة بين الصفوف (تحت الجذع نفسه موضوعات مختلفة).
# الروابط المنتقاة: مهارات الزمن والخريطة والموقع، ومفاهيم الاقتصاد الأولى، والقواعد والمسؤوليات. كلها conf=l وتحتاج حكم المعلم.
import json, re, os
E = """SS-1.1.1.1.G1>SS-1.1.1.1.G2 SS-1.1.1.1.G2>SS-1.1.1.1.G3
SS-1.1.2.1.G1>SS-1.1.2.1.G2 SS-1.1.2.1.G2>SS-1.1.2.1.G3
SS-2.1.2.1.G1>SS-2.1.2.1.G2
SS-1.1.4.1.G1>SS-1.1.4.1.G2 SS-2.1.4.1.G1>SS-2.1.4.1.G2 SS-3.1.4.1.G1>SS-3.1.4.1.G3
SS-7.1.3.1.G1>SS-7.1.3.1.G3"""
pairs = [p.split('>') for p in E.split()]
codes = sorted({c for p in pairs for c in p}, key=lambda c: (int(c.rsplit('.G', 1)[1]), c))
nodes = [{"code": c, "year": int(c.rsplit('.G', 1)[1]), "strand": re.sub(r'\.G\d+$', '', c), "t": ["", ""]} for c in codes]
out = {"version": 1, "status": "draft",
       "note": "مسوّدة: ٩ روابط منتقاة بين مخرجات الدراسات الاجتماعية ص١–٣ (الزمن، الخريطة والموقع، الاقتصاد، القواعد والمسؤوليات). لم يعتمدها معلم. conf=l لكل الروابط. العناوين تُجلب من statement_ar وقت التشغيل.",
       "untestable": "لا أسئلة للدراسات الاجتماعية من ص٤ فما فوق، ولا لمسار غير الناطقين (SS-NN-). وبقية مخرجات ص١–٣ مستقلة عن بعضها فلا رابط لها.",
       "nodes": nodes, "edges": [{"from": a, "to": b, "conf": "l"} for a, b in pairs]}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'prereqs-social.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(nodes), 'nodes', len(pairs), 'edges')
