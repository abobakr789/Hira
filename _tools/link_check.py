#!/usr/bin/env python3
"""فاحص الروابط والملفات قبل النشر (قراءة فقط، لا يكتب شيئًا في القاعدة ولا في المستودع).

يفحص:
  1) lesson_resources.url: كل مسار نسبي يجب أن يوجد ملفه في المستودع (resources/...).
  2) lesson_book_texts.audio: ملف الصوت موجود في حاوية reader-audio (HEAD على الرابط العام).
  3) competition_files.url: الروابط المطلقة (HEAD).
  4) مراجع art/ و resources/ الحرفية داخل مصدر التطبيق (hiraa/assets): يجب أن يوجد الملف.

يقرأ من Supabase بالمفتاح العام (anon) المضمَّن في hiraa/build.py، فيرى ما تسمح به سياسات القراءة فقط؛
يطبع عدد الصفوف التي رآها ليُقارَن بعدد القاعدة. إن كانت الشبكة محجوبة عن مضيف ما يُسجَّل «تعذّر الفحص» ولا يُعدّ كسرًا.

الاستعمال:  python3 _tools/link_check.py [--limit N] [--no-net]      (رمز الخروج 1 إن وُجد ملف مكسور)
"""
import json, os, re, sys, urllib.request, urllib.error, urllib.parse
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIMIT = int(sys.argv[sys.argv.index('--limit') + 1]) if '--limit' in sys.argv else 15
NO_NET = '--no-net' in sys.argv

build = open(os.path.join(ROOT, 'hiraa', 'build.py'), encoding='utf-8').read()
KEY = re.search(r'eyJ[\w.-]+', build).group(0)
BASE = 'https://vsbktjbwjykgtkkqfblj.supabase.co'


def rest(table, select, page=1000):
    out, start = [], 0
    while True:
        req = urllib.request.Request(f'{BASE}/rest/v1/{table}?select={select}', headers={
            'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Range-Unit': 'items', 'Range': f'{start}-{start + page - 1}'})
        with urllib.request.urlopen(req, timeout=60) as r:
            rows = json.loads(r.read().decode('utf-8'))
        out += rows
        if len(rows) < page:
            return out
        start += page


def head(url):
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'hiraa-link-check'})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        return str(e)[:60]


report, broken = [], 0


def section(title, total, bad, skipped=0, note=''):
    global broken
    broken += len(bad)
    report.append(f'\n== {title}: فُحص {total}، مكسور {len(bad)}' + (f'، تعذّر فحصه {skipped}' if skipped else '') + (f'  ({note})' if note else ''))
    for b in bad[:LIMIT]:
        report.append('   ✗ ' + b)
    if len(bad) > LIMIT:
        report.append(f'   … و{len(bad) - LIMIT} أخرى')


# 1) موارد الدروس (ملفات المستودع)
UF = sys.argv[sys.argv.index('--urls-file') + 1] if '--urls-file' in sys.argv else None
try:
    if UF:   # تصدير كامل من لوحة Supabase:  select url from public.lesson_resources;  (ملف نصي، رابط في كل سطر؛ يقبل CSV بعمود واحد)
        urls = sorted({l.strip().strip('"') for l in open(UF, encoding='utf-8') if l.strip() and l.strip().lower() != 'url'})
        bad = [u for u in urls if not u.startswith('http') and not os.path.exists(os.path.join(ROOT, urllib.parse.unquote(u)))]
        section('lesson_resources.url (تصدير كامل من ملف)', len(urls), bad)
        raise StopIteration
    # الجدول بطيء بالمسح الكامل (سياسة القراءة تُقيَّم لكل صف فتنتهي المهلة)، فنقرأه على دفعات من ١٠ دروس.
    ids = [r['id'] for r in rest('lessons', 'id')]
    batches = [ids[i:i + 10] for i in range(0, len(ids), 10)]
    def one(b):
        for _ in range(3):
            try:
                return rest('lesson_resources', 'url&lesson_id=in.(' + ','.join(b) + ')')
            except Exception:
                pass
        return None
    with ThreadPoolExecutor(6) as ex:
        res = list(ex.map(one, batches))
    failed = sum(1 for r in res if r is None)
    rows = [x for r in res if r for x in r]
    if failed:
        report.append(f'\n!! تعذّرت قراءة {failed} دفعة من موارد الدروس؛ النتيجة ناقصة.')
    urls = sorted({r['url'] for r in rows if r.get('url')})
    bad = [u for u in urls if not u.startswith('http') and not os.path.exists(os.path.join(ROOT, urllib.parse.unquote(u)))]
    section('lesson_resources.url (ملفات المستودع)', len(urls), bad, note=f'رأى المفتاح العام {len(rows)} صفًّا')
except StopIteration:
    pass
except Exception as e:
    report.append(f'\n== lesson_resources: تعذّرت القراءة: {e}')
if not UF:
    report.append('   ملاحظة: المفتاح العام يرى جزءًا صغيرًا فقط من موارد الدروس (سياسة القراءة)؛ للفحص الكامل مرّر --urls-file بتصدير القاعدة.')

# 2) صوت نصوص الكتاب (حاوية reader-audio)
try:
    rows = rest('lesson_book_texts', 'audio')
    aud = sorted({r['audio'] for r in rows if r.get('audio')})
    if NO_NET:
        report.append('\n== lesson_book_texts.audio: تخطّي (--no-net)')
    else:
        pub = lambda p: f'{BASE}/storage/v1/object/public/reader-audio/' + urllib.parse.quote(p)
        with ThreadPoolExecutor(12) as ex:
            st = list(ex.map(lambda p: head(pub(p)), aud))
        bad = [f'{p} ({s})' for p, s in zip(aud, st) if s in (404, 400)]
        skipped = sum(1 for s in st if s not in (200, 404, 400))
        section('lesson_book_texts.audio (reader-audio)', len(aud), bad, skipped)
except Exception as e:
    report.append(f'\n== lesson_book_texts.audio: تعذّرت القراءة: {e}')

# 3) روابط مطلقة في ملفات المسابقات
try:
    rows = rest('competition_files', 'url')
    ab = sorted({r['url'] for r in rows if r.get('url', '').startswith('http')})
    if NO_NET or not ab:
        report.append('\n== competition_files.url: لا شيء للفحص' if not ab else '\n== competition_files.url: تخطّي (--no-net)')
    else:
        with ThreadPoolExecutor(8) as ex:
            st = list(ex.map(head, ab))
        bad = [f'{u} ({s})' for u, s in zip(ab, st) if s in (404, 410)]
        section('competition_files.url', len(ab), bad, sum(1 for s in st if s not in (200, 404, 410)))
except Exception as e:
    report.append(f'\n== competition_files.url: تعذّرت القراءة: {e}')

# 4) مراجع حرفية داخل مصدر التطبيق
pat = re.compile(r'''["'(](?:\./)?((?:art|resources)/[\w./%-]+\.(?:webp|png|jpe?g|svg|gif|mp3|mp4|pdf|html|json|woff2?))["')?#]''')
refs = {}
src = os.path.join(ROOT, 'hiraa')
for dp, _, fs in os.walk(src):
    for f in fs:
        if f.endswith(('.js', '.css', '.html')):
            p = os.path.join(dp, f)
            for m in pat.finditer(open(p, encoding='utf-8', errors='ignore').read()):
                ln = open(p, encoding='utf-8', errors='ignore').read()[:m.start()].count('\n') + 1
                refs.setdefault(m.group(1), f'{os.path.relpath(p, ROOT)}:{ln}')
refs = {r: w for r, w in refs.items() if not re.search(r'/[A-Z]\.\w+$', r)}   # مثل art/x/N.json في تعليق: ليس ملفًّا فعليًّا
bad = [f'{r}  ← {w}' for r, w in sorted(refs.items()) if not os.path.exists(os.path.join(ROOT, urllib.parse.unquote(r)))]
section('مراجع art/ و resources/ في المصدر', len(refs), bad)

print('\n'.join(report))
print('\n' + ('✓ لا ملفات مكسورة' if not broken else f'✗ {broken} ملفًّا/رابطًا مكسورًا'))
sys.exit(1 if broken else 0)
