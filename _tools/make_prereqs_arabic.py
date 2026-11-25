# يولّد data/prereqs-arabic.json من أزواج متتابعة لنفس المخرج الحلزوني (نفس الجذع) بين الصفوف ١–٤.
# المصدر: learning_outcomes (مادة arabic، مسار native) بحيث يكون لكل طرف ٣ أسئلة MCQ فعّالة على الأقل (دون المعيارية).
# كل الروابط conf=l (استدلال من التكرار الحلزوني) وتحتاج حكم المعلم. العناوين تُجلب وقت التشغيل من statement_ar.
import json, re, os
E = """AR-1.1.2.2.G3>AR-1.1.2.2.G4 AR-1.1.2.2.G2>AR-1.1.2.2.G3 AR-4.2.2.6.G2>AR-4.2.2.6.G3 AR-1.1.3.3.G3>AR-1.1.3.3.G4
AR-1.1.3.3.G2>AR-1.1.3.3.G3 AR-1.2.1.5.G2>AR-1.2.1.5.G3 AR-1.1.1.2.G2>AR-1.1.1.2.G4 AR-1.1.1.2.G1>AR-1.1.1.2.G2
AR-2.3.1.6.G1>AR-2.3.1.6.G2 AR-3.1.2.2.G2>AR-3.1.2.2.G3 AR-3.1.2.2.G1>AR-3.1.2.2.G2 AR-2.1.3.3.G3>AR-2.1.3.3.G4
AR-2.1.3.3.G2>AR-2.1.3.3.G3 AR-5.1.3.2.G2>AR-5.1.3.2.G3 AR-5.1.3.2.G1>AR-5.1.3.2.G2 AR-1.3.1.6.G2>AR-1.3.1.6.G3
AR-2.1.1.2.G3>AR-2.1.1.2.G4 AR-2.1.1.2.G2>AR-2.1.1.2.G3 AR-2.2.2.4.G2>AR-2.2.2.4.G3 AR-5.2.2.6.G2>AR-5.2.2.6.G3
AR-1.1.1.3.G3>AR-1.1.1.3.G4 AR-1.1.1.3.G2>AR-1.1.1.3.G3 AR-1.1.1.3.G1>AR-1.1.1.3.G2 AR-2.1.1.3.G3>AR-2.1.1.3.G4
AR-2.1.1.3.G2>AR-2.1.1.3.G3 AR-2.1.1.3.G1>AR-2.1.1.3.G2 AR-2.2.1.5.G3>AR-2.2.1.5.G4 AR-2.2.1.5.G2>AR-2.2.1.5.G3
AR-2.4.1.5.G2>AR-2.4.1.5.G3 AR-1.2.2.6.G2>AR-1.2.2.6.G3 AR-3.1.3.2.G2>AR-3.1.3.2.G4 AR-2.2.3.1.G1>AR-2.2.3.1.G3
AR-2.1.2.2.G2>AR-2.1.2.2.G3 AR-2.1.2.2.G1>AR-2.1.2.2.G2 AR-3.1.1.2.G1>AR-3.1.1.2.G3 AR-1.4.1.5.G2>AR-1.4.1.5.G3
AR-1.1.3.2.G2>AR-1.1.3.2.G3 AR-1.1.3.2.G1>AR-1.1.3.2.G2 AR-1.2.3.1.G1>AR-1.2.3.1.G2 AR-3.4.1.5.G2>AR-3.4.1.5.G3
AR-3.1.2.4.G2>AR-3.1.2.4.G3 AR-6.1.2.2.G1>AR-6.1.2.2.G3 AR-3.1.3.3.G1>AR-3.1.3.3.G2 AR-1.1.2.3.G2>AR-1.1.2.3.G3
AR-3.2.1.5.G3>AR-3.2.1.5.G4 AR-3.2.1.5.G2>AR-3.2.1.5.G3"""
pairs=[p.split('>') for p in E.split()]
codes=sorted({c for p in pairs for c in p}, key=lambda c:(int(c.rsplit('.G',1)[1]),c))
nodes=[{"code":c,"year":int(c.rsplit('.G',1)[1]),"strand":re.sub(r'\.G\d+$','',c),"t":["",""]} for c in codes]
edges=[{"from":a,"to":b,"conf":"l"} for a,b in pairs]
out={"version":1,"status":"draft",
 "note":"مسوّدة: روابط استدلالية من التكرار الحلزوني لنفس المخرج بين الصفوف ١–٤ (مسار الناطقين بالعربية). لم يعتمدها معلم. conf=l لكل الروابط. العناوين تُجلب من statement_ar وقت التشغيل.",
 "untestable":"لا توجد أسئلة كافية للصفوف ٥–٨ في العربية؛ فطلاب هذه الصفوف يُختبرون على أسس الصفوف ١–٤ فقط. مسار غير الناطقين (NN-) والمسارات الأخرى غير مشمولة.",
 "nodes":nodes,"edges":edges}
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data','prereqs-arabic.json')
json.dump(out,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(len(nodes),'nodes',len(edges),'edges')
