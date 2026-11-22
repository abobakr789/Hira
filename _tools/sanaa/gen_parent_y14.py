#!/usr/bin/env python3
# Parent note (A4, one page) for Sanaa Y1-4, all 29 lessons x 4 grades. Text is for adults: no tashkeel, no emoji, no platform-game link.
import sys, os, re, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = '/home/claude/hira'
import lessons_y1_t1 as A, lessons_y1_t1_b as B, lessons_t2t3 as L
TASH = re.compile('[ً-ْٰـ]')
def nt(s): return TASH.sub('', s or '')
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
SPECS = {}
for m in (A, B):
    for n in dir(m):
        if re.fullmatch(r'L\d\d', n):
            sp = getattr(m, n); SPECS[sp['code'].split('-', 2)[2]] = sp
for k, sp in L.build().items(): SPECS[sp['code'].split('-', 2)[2]] = sp
ROWS = json.load(open(os.path.join(HERE, 'y14_lessons.json'), encoding='utf8'))   # code -> [title, objective, pages]
SRC = open(ROOT + '/resources/ssd/SN-Y5-T1-L01/parent-note.html', encoding='utf8').read()
CSS = re.search(r'<style>(.*?)</style>', SRC, re.S).group(1)
FIT = re.search(r'(<script>document\.fonts.*?</script>)', SRC, re.S).group(1)
GN = {1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع'}
LEV = {1: 'يحكي ما تعلّمه ويرسم مثالًا عليه',
       2: 'يحكي ما تعلّمه بجملتين ويذكر مثالًا من بيته',
       3: 'يكتب جملة كاملة عمّا تعلّمه ويذكر مثالًا من بيئته',
       4: 'يكتب فقرة قصيرة عمّا تعلّمه، ويقترح مبادرة صغيرة يطبّقها'}
H = lambda t: "<h2 style='font-size:15pt;color:#2F6A9A;margin:12px 0 4px'>%s</h2>" % t
P = lambda t: "<p style='font-size:12.5pt;line-height:1.9;margin:4px 0'>%s</p>" % t
def tick(t): return "<p style='font-size:12.5pt;line-height:1.9;margin:4px 0'><span style='display:inline-block;width:16px;height:16px;border:2px solid #6B7585;border-radius:4px;vertical-align:middle;margin-left:8px'></span>%s</p>" % esc(t)
def lines(n): return ''.join("<div style='border-bottom:1px solid #B8C0CC;height:11mm'></div>" for _ in range(n))
def note(code):
    y = int(code[4]); key = code.split('-', 2)[2]
    title, obj, pages = ROWS[code]
    title = re.sub(r'^(أولًا|ثانيًا|ثالثًا|رابعًا)\s*:\s*', '', title)
    sp = SPECS.get(key)
    terms = [nt(v[1]) for v in sp['vocab']][:5] if sp else []
    checks = [nt(c) for c in sp['home']['checks'][:-1]] if sp else []
    task = nt(sp['home']['task']) if sp else ''
    if not checks: checks = ['اسألوه: ماذا تعلّمنا اليوم عن «%s»؟' % title]
    if not task: task = 'يحكي لأسرته ما تعلّمه عن «%s» ويعرضه في الحصة القادمة.' % title
    h = ("<div class='hd' style='background:#DDEBF7'><div><div class='t'>ملاحظة لأولياء الأمور: %s</div><div class='m'>السنع الإماراتي · الصف %s · كتاب الطالب %s</div></div>"
         "<div style='display:flex;align-items:center;gap:10px'><span class='pill' style='background:#2F6A9A'>للأسرة</span><img src='../../../art/brand/hiraa-lockup-light.svg' alt='حراء' style='width:120px;height:48px;object-fit:contain'></div></div>") % (esc(title), GN[y], esc(pages))
    b = H('ماذا تعلّم ابنكم/ابنتكم؟')
    b += P('هدف الدرس: ' + esc(obj))
    b += P('المطلوب من الطالب في هذا الصف: ' + LEV[y] + '.')
    if terms:
        b += H('كلمات من الدرس')
        b += "<div style='display:flex;gap:8px;flex-wrap:wrap;margin:4px 0'>" + ''.join("<span style='border:2px solid #2F6A9A;border-radius:20px;padding:3px 16px;font-weight:700;font-size:13pt'>%s</span>" % esc(w) for w in terms) + "</div>"
    b += H('أنشطة قصيرة يقوم بها معكم')
    b += ''.join(tick(c) for c in checks)
    b += tick('شجّعوه حين يطبّق ما تعلّمه، وامدحوا سلوكه الحسن أمام الأسرة.')
    b += H('مهمة البيت (يؤدّيها الطالب)')
    b += P(esc(task))
    b += "<p style='font-size:12pt;margin:6px 0'>ما فعله ابني/ابنتي:</p>" + lines(3 if y <= 2 else 5)
    b += "<p style='margin-top:14px;font-size:12.5pt'>توقيع ولي الأمر: ......................... &nbsp;&nbsp; شكرًا لتعاونكم في تعليم أبنائنا. — معلم/معلمة المادة</p>"
    body = "<div class='page'><div class='fit'>" + h + b + "</div></div>"
    html = ('<!doctype html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ملاحظة لأولياء الأمور · ' + esc(title) + ' · Hiraa</title><style>' + CSS + '</style></head><body>' + body + FIT + '</body></html>')
    d = ROOT + '/resources/ssd/' + code; os.makedirs(d, exist_ok=True)
    open(d + '/parent-note.html', 'w', encoding='utf8').write(html)
if __name__ == '__main__':
    for c in sorted(ROWS): note(c)
    print(len(ROWS), 'notes; specs for', len(SPECS), 'lessons; missing:', sorted({c.split('-',2)[2] for c in ROWS} - set(SPECS)))
