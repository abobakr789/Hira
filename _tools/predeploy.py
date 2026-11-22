#!/usr/bin/env python3
"""فحص ما قبل النشر لمنصة حراء — شغّله قبل كل commit:  python3 _tools/predeploy.py

1. يبني index.html من المصدر ويتأكد أن النسخة المرفوعة تطابقه (لا يُنشر مصدر بلا بناء).
2. يفحص صياغة كل سكربت داخل index.html بـ node --check.
3. إن تغيّر index.html عن آخر نسخة على origin/main فلا بد من رفع رقم نسخة الكاش في sw.js.
4. يمنع ما نصصتَ على منعه: رمز قوس قزح، وصور الخنزير، ومفتاح service_role.
يخرج برمز 1 عند أي فشل، فيمكن ربطه بخطاف git أو تشغيله يدويًا.
"""
import os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")
bad = []


def sh(*cmd, check=False):
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, check=check)


def ok(msg): print("✓", msg)
def fail(msg): bad.append(msg); print("✗", msg)


# 1) البناء ومطابقة المصدر
before = open(INDEX, encoding="utf-8").read() if os.path.exists(INDEX) else ""
b = sh(sys.executable, os.path.join("hiraa", "build.py"))
if b.returncode != 0:
    fail("فشل البناء:\n" + (b.stderr or b.stdout)[-800:])
    sys.exit(1)
after = open(INDEX, encoding="utf-8").read()
if before == after:
    ok("index.html يطابق المصدر")
else:
    print("! كان index.html قديمًا عن المصدر وأُعيد بناؤه الآن — أضِفه إلى الـcommit (git add index.html)")

# 2) صياغة السكربتات
scripts = re.findall(r"<script(?![^>]*\bsrc=)(?![^>]*type=\"(?:application/(?:ld\+)?json|text/template)\")[^>]*>(.*?)</script>", after, re.S)
bad_js = 0
for n, code in enumerate(scripts, 1):
    if not code.strip():
        continue
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(code); p = f.name
    r = sh("node", "--check", p)
    os.unlink(p)
    if r.returncode != 0:
        bad_js += 1
        fail(f"خطأ صياغة في السكربت رقم {n}:\n" + r.stderr[:600])
if not bad_js:
    ok(f"صياغة {len(scripts)} سكربتًا سليمة")

# 3) رقم نسخة الكاش
def sw_ver(text):
    m = re.search(r'VERSION\s*=\s*"([^"]+)"', text or "")
    return m.group(1) if m else None

cur = sw_ver(open(os.path.join(ROOT, "sw.js"), encoding="utf-8").read())
rem_idx = sh("git", "show", "origin/main:index.html")
rem_sw = sh("git", "show", "origin/main:sw.js")
if rem_idx.returncode != 0 or rem_sw.returncode != 0:
    print("! تعذّرت مقارنة origin/main (نفّذ git fetch origin main أولًا) — تخطّيت فحص الكاش")
elif rem_idx.stdout != after and sw_ver(rem_sw.stdout) == cur:
    fail(f"تغيّر index.html لكن رقم الكاش في sw.js ما زال {cur} — ارفعه ليصل التحديث للمستخدمين")
else:
    ok(f"رقم الكاش {cur} متّسق مع التغيير")

# 4) ممنوعات المشروع
for name, pat in [("رمز قوس قزح 🌈", "\U0001F308"), ("صور الخنزير 🐖🐷🐗", "[\U0001F416\U0001F437\U0001F417\U0001F43D]"), ("مفتاح service_role", "service_role")]:
    for m in re.finditer(pat, after):
        ctx = after[max(0, m.start() - 40):m.end() + 40].replace("\n", " ")
        # التعليقات التحذيرية في config لا تُعدّ مخالفة
        if name.startswith("مفتاح") and "لا تضع" in ctx:
            continue
        fail(f"وُجد {name} في index.html قرب: …{ctx}…")
        break
if not [x for x in bad if "وُجد" in x]:
    ok("لا ممنوعات في index.html")

print()
if bad:
    print(f"فشل {len(bad)} فحص(ًا) — لا تنشر قبل الإصلاح")
    sys.exit(1)
print("اجتاز كل الفحوص — آمن للنشر")
