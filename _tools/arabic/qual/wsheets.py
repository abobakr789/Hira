# Worksheets aligned with the qualification teacher decks (A Level 9AA0, GCSE 1AA0, IGCSE 4AA1).
# For every lesson built by qdeck / gdeck / wdeck / rdeck / revision builders, writes 4 PDFs that replace the old generic ones:
#   worksheets-A4.pdf (reading page + three levels), pod-sheet.pdf, concept-card.pdf, answer-key.pdf
# All content comes from the lesson's deck data, so the sheet uses the same text, questions and model answers as the deck.
# usage: python3 wsheets.py [CODE ...]      (no codes = all lessons)
import sys, os, re, html, importlib, hashlib
sys.path.insert(0, os.path.dirname(__file__))
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
MODS = ["al_y11_t1", "al_y11_t2", "al_y12_t1", "al_y12_t2", "al_y11_t3_res", "al_works_asfour", "al_works_sayed", "al_works_bakhila", "al_works_films",
        "al_y12_t3_rev", "gc_y9_t1", "gc_y9_t2", "gc_y9_t3", "gc_y10", "q_rev"]
ST_GC = None

def lessons():
    global ST_GC
    out = []
    argv = sys.argv; sys.argv = ["x"]
    for m in MODS:
        M = importlib.import_module(m)
        lst = getattr(M, "LS", None) or M.L
        for C in lst:
            C = dict(C)
            if C.get("starter") is None and hasattr(M, "ST"): C["starter"] = M.ST
            out.append(C)
    sys.argv = argv
    return out

E = lambda s: html.escape(str(s if s is not None else ""))
ISO = re.compile("[⁦-⁩]")
def X(s): return E(ISO.sub("", str(s if s is not None else "")))
def fam(C):
    if "listen" in C: return "gc"
    if "map" in C: return "rev"
    if "work" in C: return "work"
    if "ido1" in C: return "res"
    return "top"
def qual(C):
    c = C["code"]
    return "AL" if "-AL-" in c else "GC" if "-GC-" in c else "IG"
def yearline(C):
    c = C["code"]; n = int(re.search(r"AR-Y(\d+)", c).group(1)); q = qual(C)
    first = (q == "AL" and n == 11) or (q != "AL" and n == 9)
    name = {"AL": "A Level", "GC": "GCSE", "IG": "International GCSE"}[q]
    spec = {"AL": "9AA0", "GC": "1AA0", "IG": "4AA1"}[q]
    return f"اللغة العربية · <bdi dir='ltr'>{name} {spec}</bdi> · {'السنة الأولى' if first else 'السنة الثانية'} (<bdi dir='ltr'>Year {n + 1}</bdi>)"
def folder(C):
    n = int(re.search(r"AR-Y(\d+)", C["code"]).group(1))
    return os.path.join(ROOT, "resources", f"g{n}", C["code"])

def mix(items, salt):
    return sorted(items, key=lambda x: hashlib.md5((salt + str(x)).encode()).hexdigest())
def letters(i): return "أبجدهوزحطي"[i]
def clean_q(s): return re.sub(r"^\s*\d+\)\s*", "", str(s))
def num(i): return f"{i}) "

# ---------- HTML building blocks ----------
FONT = os.path.join(ROOT, "art/fonts")
CSS = f"""
@font-face{{font-family:TS;src:url(file://{FONT}/thmanyahsans-Regular.woff2)}}
@font-face{{font-family:TS;font-weight:700;src:url(file://{FONT}/thmanyahsans-Bold.woff2)}}
@font-face{{font-family:TT;src:url(file://{FONT}/thmanyahseriftext-Regular.woff2)}}
@font-face{{font-family:TT;font-weight:700;src:url(file://{FONT}/thmanyahseriftext-Bold.woff2)}}
@page{{size:A4;margin:12mm 12mm 12mm 12mm}}
body{{font-family:TS,"DejaVu Sans",sans-serif;direction:rtl;color:#1B2A33;font-size:10.6pt;line-height:1.5;margin:0}}
.pb{{break-before:page}}
.hd{{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0F6E72;padding-bottom:2mm;margin-bottom:2.5mm;gap:4mm}}
.hd .t{{font-weight:700;font-size:15pt;color:#0F3B3F;line-height:1.3}}
.hd .sm{{font-size:9pt;color:#5B6B6E}}
.lv{{color:#fff;border-radius:3mm;padding:1.5mm 4mm;font-weight:700;white-space:nowrap;font-size:11pt}}
.meta{{display:flex;justify-content:space-between;font-size:9.5pt;color:#333;margin-bottom:2.5mm}}
.goal{{background:#EAF5F4;border-radius:2.5mm;padding:1.6mm 3mm;font-size:9.3pt;margin-bottom:2.4mm;line-height:1.45}}
.goal b{{color:#0F6E72}}
.box{{border:1.3px solid #C9D9D6;border-radius:2.5mm;padding:2mm 3mm;margin-bottom:2.4mm;break-inside:avoid}}
.box.ok{{background:#F2FAF4;border-color:#B6DCC0}}
.box.tip{{background:#FFF8E6;border-color:#F0D58A;font-size:9.8pt}}
.q{{font-weight:700;color:#0F3B3F}}
.mk{{color:#8A6D1E;font-size:9pt;font-weight:400}}
.ln{{border-bottom:1px solid #A9B8B5;height:7mm}}
.ch{{display:grid;grid-template-columns:1fr;gap:1mm;margin-top:1.5mm}}
.ch span::before{{content:"☐ ";color:#0F6E72}}
table{{width:100%;border-collapse:collapse;margin-top:1.5mm;font-size:10pt}}
th{{background:#0F6E72;color:#fff;font-weight:700;padding:1.6mm 2mm;text-align:start}}
td{{border:1px solid #C9D9D6;padding:1.6mm 2mm;vertical-align:top}}
td.w{{height:9.5mm}} td.ww{{height:14mm}}
.en{{direction:ltr;text-align:left;unicode-bidi:isolate;font-family:"DejaVu Sans",sans-serif;font-size:9.8pt;color:#1D4ED8}}
.read{{font-family:TT,serif;font-size:12.6pt;line-height:1.95;text-align:justify}}
.read p{{margin:0 0 2.5mm}}
.chk{{font-size:9.6pt;color:#333;margin-top:2mm}}
.bank{{display:flex;flex-wrap:wrap;gap:2mm;margin:1.5mm 0}}
.bank span{{border:1.2px dashed #0F6E72;border-radius:2mm;padding:.6mm 2.5mm;font-weight:700}}
.kh{{font-weight:700;color:#fff;background:#1E3A3F;padding:1.4mm 3mm;border-radius:2mm;margin:3.5mm 0 2mm;font-size:11pt}}
.kv{{margin:0 0 1.6mm;padding-inline-start:3mm;border-inline-start:3px solid #CFE3E0;break-inside:avoid}}
.kv b{{color:#0F6E72}}
.frame{{line-height:2.4}}
.steps{{display:flex;flex-wrap:wrap;gap:1.5mm;font-size:9pt;margin-top:1mm}}
.steps span{{background:#EEF2FF;color:#3730A3;border-radius:2mm;padding:.5mm 2mm}}
.c1{{font-size:10pt}} .c1 .ln{{height:6.2mm}} .c1 td.w{{height:8mm}} .c1 td.ww{{height:11.5mm}} .c1 .box{{margin-bottom:1.8mm;padding:1.5mm 2.6mm}} .c1 .read{{font-size:11.8pt;line-height:1.85}}
.c2{{font-size:9.4pt}} .c2 .ln{{height:5.4mm}} .c2 td.w{{height:7mm}} .c2 td.ww{{height:9.5mm}} .c2 .box{{margin-bottom:1.5mm;padding:1.2mm 2.4mm}} .c2 .goal{{font-size:8.6pt}} .c2 .read{{font-size:11pt;line-height:1.75}} .c2 td{{padding:1mm 1.6mm}}
.c3{{font-size:9pt}} .c3 .ln{{height:4.8mm}} .c3 td.w{{height:6mm}} .c3 td.ww{{height:8mm}} .c3 .box{{margin-bottom:1.2mm;padding:1mm 2mm}} .c3 .goal{{font-size:8.2pt}} .c3 .read{{font-size:10.2pt;line-height:1.65}} .c3 td{{padding:.8mm 1.4mm}}
"""
LV = {"beg": ("مبتدئ ★", "#B45309", "أتعرّف وأحدّد"), "dev": ("متطوّر ★★", "#475569", "أفسّر وأحلّل"), "adv": ("متمكّن ★★★", "#6D28D9", "أوازن وأقيّم وأنتج"),
      "pod": ("أصحاب الهمم 💚", "#0F6E72", "أقرأ وأفهم بخطوات ودعم")}

def head(C, lv, title=None):
    nm, col, skill = LV[lv]
    t = title or f"ورقة نشاط: {X(C['title'])}"
    return (f"<div class='hd'><div><div class='t'>{t}</div><div class='sm'>{yearline(C)}</div></div><div class='lv' style='background:{col}'>{nm}</div></div>"
            f"<div class='meta'><span>الاسم: ....................................</span><span>الصف: ..........</span><span>التاريخ: ..........</span></div>"
            f"<div class='goal'><b>🎯 هدف الدرس:</b> {X(C['goal'])}<br><b>المهارة:</b> {skill}</div>")
def lines(n): return "<div class='ln'></div>" * n
def box(q, body="", n=0, cls="", mk=""):
    return f"<div class='box {cls}'><span class='q'>{q}</span>{(' <span class=mk>' + mk + '</span>') if mk else ''}{body}{lines(n)}</div>"
def mcq_html(q, opts):
    return "<div class='ch'>" + "".join(f"<span>{X(o)}</span>" for o in opts) + "</div>"
def table(heads, rows, cls=""):
    return "<table><tr>" + "".join(f"<th>{h}</th>" for h in heads) + "</tr>" + "".join(
        "<tr>" + "".join(f"<td class='{cls if c == '' else ''}'>{c}</td>" for c in r) + "</tr>" for r in rows) + "</table>"
def checkpoint(): return "<div class='box tip'>نقطة تحقّق: ☐ أتقنتُ  ☐ أحتاج إلى مراجعة · ما الذي سأراجعه؟ ..........................................</div>"
def en(s): return f"<div class='en'>{X(s)}</div>"

def match_block(title, pairs, salt, en_right=False):
    right = mix([b for _, b in pairs], salt)
    rows = [[f"{i + 1}) {X(a)}", "........", f"{letters(j)}) " + (f"<span class='en'>{X(b)}</span>" if en_right else X(b))] for i, ((a, _), j, b) in enumerate(zip(pairs, range(len(right)), right))]
    key = "، ".join(f"{i + 1} ← {letters(right.index(b))}" for i, (_, b) in enumerate(pairs))
    return box(title, table(["الكلمة", "الحرف", "المعنى"], rows)), key
def blank_word(sent, word):
    w = re.sub(r"[ً-ْ]", "", word).split()[0] if word else ""
    plain = re.sub(r"[ً-ْ]", "", sent)
    if w and w in plain:
        return plain.replace(w, "..........", 1), w
    return None, w
def gap_fill(vocab, idx_word=0, idx_sent=-1, k=5):
    items, bank = [], []
    for v in vocab:
        s, w = blank_word(v[idx_sent], v[idx_word])
        if s: items.append((s, w)); bank.append(w)
        if len(items) >= k: break
    if not items: return "", []
    body = "<div class='bank'>" + "".join(f"<span>{X(b)}</span>" for b in mix(bank, "bank")) + "</div>" + "".join(f"<div>{i + 1}) {X(s)}</div>" for i, (s, _) in enumerate(items))
    return box("أكمل بالكلمة المناسبة من البنك:", body), [w for _, w in items]
def two_opts(mcq):
    opts = mcq["opts"]; good = next(o for o in opts if o[2]); bad = next(o for o in opts if not o[2])
    return [o[0] for o in mix([good, bad], mcq["q"])], good[0]
def strip_mark(o): return re.sub(r"^\([^)]+\)\s*", "", o)

# ---------- families ----------
def build_top(C):
    K, P = [], {}
    read = f"<div class='hd'><div><div class='t'>📖 نص الدرس: {X(C['textTitle'])}</div><div class='sm'>{yearline(C)} · {X(C.get('theme', ''))}</div></div><div class='lv' style='background:#0F6E72'>للجميع</div></div><div class='read'>" + "".join(f"<p>{X(p)}</p>" for p in C["paras"]) + "</div>"
    V = C["vocab"]
    m, mk = match_block("1) صِل الكلمة بمعناها:", [(v[0], v[1]) for v in V[:5]], C["code"])
    K.append(("مبتدئ · س1 (المطابقة)", mk))
    tr = table(["الكلمة", "ترجمتها إلى الإنجليزية"], [[X(v[0]), ""] for v in V[5:9] or V[:4]], "w")
    K.append(("مبتدئ · س2 (الترجمة)", "، ".join(f"{v[0]} = {v[2]}" for v in (V[5:9] or V[:4]))))
    mq = C["mcq"]
    K.append(("مبتدئ · س3 (الاختيار)", next(o[0] + " · " + o[1] for o in mq["opts"] if o[2])))
    wd = C["wedo"]
    beg = head(C, "beg") + m + box("2) اكتب ترجمة كل كلمة إلى الإنجليزية:", tr) + box("3) " + X(mq["q"]), mcq_html("", [o[0] for o in mq["opts"]])) \
        + box("4) " + X(clean_q(wd[0][0])), "<div class='chk'>ابدأ بـ: «حسب النص، …»</div>", 2) + checkpoint()
    K.append(("مبتدئ · س4", wd[0][1]))
    ido = C["ido"]
    steps = "<div class='steps'>" + "".join(f"<span>{X(s[0])}</span>" for s in ido["steps"]) + "</div>"
    dev = head(C, "dev") + box("1) " + X(ido["q"]), steps, 3)
    K.append(("متطوّر · س1", ido["ans"] + " · " + ido.get("tip", "")))
    for i, (q, a) in enumerate(wd[1:3]):
        dev += box(f"{i + 2}) " + X(clean_q(q)), "", 2); K.append((f"متطوّر · س{i + 2}", a))
    n = len(wd[1:3]) + 2
    dev += box(f"{n}) ترجم إلى الإنجليزية ترجمة طبيعية:", f"<div>«{X(C['toEN']['ar'])}»</div>", 2)
    K.append((f"متطوّر · س{n}", C["toEN"]["good"]))
    ye = C.get("youEN", [])[:2]
    if ye:
        dev += box(f"{n + 1}) ترجم إلى الإنجليزية:", "".join(f"<div>{chr(0x0623 + 0) if False else ''}{j + 1}. «{X(a)}»</div>{lines(1)}" for j, (a, _) in enumerate(ye)))
        K.append((f"متطوّر · س{n + 1}", " · ".join(b for _, b in ye)))
    dev += checkpoint()
    ex = C["exam"]; wr = C["write"]
    adv = head(C, "adv") + box("1) " + X(ex["title"]) + ": " + X(ex["q"]), "", 3)
    K.append(("متمكّن · س1", (ex.get("model") or "") + " · " + " / ".join(ex.get("ms", []))))
    ta = C["toAR"]
    adv += box("2) ترجم إلى العربية الفصحى:", "".join(f"<div class='en'>{j + 1}. {X(a)}</div>{lines(1)}" for j, (a, _, _) in enumerate(ta)))
    K.append(("متمكّن · س2", " · ".join(b for _, b, _ in ta)))
    plan = table(["الخطوة", "ما سأكتبه (كلمات مفتاحية)"], [[X(p[0]), ""] for p in wr["parts"]], "w")
    adv += box("3) " + X(wr["task"]) + " (نحو 150 كلمة):", plan + "<div class='chk'>استعمل تركيبين على الأقل: " + "، ".join(X(s[0]) for s in C["structs"][:3]) + "</div>", 6)
    K.append(("متمكّن · س3 (نموذج)", " ".join(p[1] for p in wr["parts"])))
    rs = C.get("research")
    if rs:
        adv += box("4) زاوية بحثية: " + X(rs["q"]), "<div class='chk'>اذكر مصدرين عربيين تبحث فيهما، وحقيقة واحدة تتوقّع أن تجدها.</div>", 2)
        K.append(("متمكّن · س4 (مصادر مقترحة)", "، ".join(rs.get("sources", []))))
    adv += checkpoint()
    # pod
    gf, gw = gap_fill(V, 0, -1)
    o2, good = two_opts(mq)
    pod = head(C, "pod", f"نشاط مكيّف: {X(C['title'])}") + box("1) اقرأ الكلمات ومعانيها:", table(["الكلمة", "معناها", "بالإنجليزية"], [[X(v[0]), X(v[1]), f"<span class='en'>{X(v[2])}</span>"] for v in V[:6]])) \
        + gf.replace("أكمل", "2) أكمل") + box("3) " + X(mq["q"]) + " (اختر واحدة)", mcq_html("", o2)) \
        + box("4) أكمل الجملة بنفسك:", f"<div class='frame'>{X(C['structs'][0][0])}<br>مثال: {X(C['structs'][0][1])}<br>جملتي: ......................................................................</div>") + checkpoint()
    K.append(("أصحاب الهمم · س2", "، ".join(gw))); K.append(("أصحاب الهمم · س3", good))
    concept_rows = [X(v[0]) for v in V] + [X(s[0]) for s in C["structs"][:3]]
    checks = C["sc"]
    return dict(read=read, beg=beg, dev=dev, adv=adv, pod=pod, concepts=concept_rows, checks=checks, key=K)

def build_gc(C):
    K = []
    read = (f"<div class='hd'><div><div class='t'>📖 {X(C['textTitle'])}</div><div class='sm'>{yearline(C)} · <span class='en' style='display:inline'>{X(C['title_en'])}</span></div></div><div class='lv' style='background:#0F6E72'>للجميع</div></div>"
            f"<div class='read'>" + "".join(f"<p>{X(p)}</p>" for p in C["text"].split("\n\n")) + "</div>")
    V = C["vocab"]
    m, mk = match_block("1) صِل الكلمة بترجمتها · Match:", [(v[0], v[1]) for v in V[:6]], C["code"], en_right=True)
    K.append(("مبتدئ · س1", mk))
    gf, gw = gap_fill(V, 0, 2)
    K.append(("مبتدئ · س2", "، ".join(gw)))
    mq = C["mcq"]
    K.append(("مبتدئ · س3", next(o[0] + " · " + o[1] for o in mq["opts"] if o[2])))
    wd = C["wedo"]
    beg = head(C, "beg") + m + gf.replace("أكمل", "2) أكمل") + box("3) " + f"<span class='en' style='display:inline'>{X(mq['q'])}</span>", "<div class='en'>" + "<br>".join("☐ " + X(o[0]) for o in mq["opts"]) + "</div>") \
        + box("4) " + X(clean_q(wd[0][0])) + " (أجب بالعربية)", "", 1)
    K.append(("مبتدئ · س4", wd[0][1]))
    ls = C["listen"]
    beg += box("5) استماع: يقرأ المعلم النص مرتين · Listening (answer in English):", "".join(f"<div class='en'>{j + 1}. {X(q)}</div>{lines(1)}" for j, (q, _) in enumerate(ls["qs"]))) + checkpoint()
    K.append(("مبتدئ · س5 (نص الاستماع)", ls["script"])); K.append(("مبتدئ · س5 (الإجابات)", " · ".join(a for _, a in ls["qs"])))
    ido = C["ido"]
    dev = head(C, "dev") + box("1) " + f"<span class='en' style='display:inline'>{X(ido['q'])}</span>", "<div class='chk'>Answer in English · أجب بالإنجليزية</div>", 2)
    K.append(("متطوّر · س1", ido["ans"] + " · " + ido.get("tip", "")))
    for i, (q, a) in enumerate(wd[1:3]):
        dev += box(f"{i + 2}) " + X(clean_q(q)) + " (بالعربية)", "", 1); K.append((f"متطوّر · س{i + 2}", a))
    dev += box("4) ترجم إلى الإنجليزية · Translate into English:", f"<div>«{X(C['toEN']['ar'])}»</div>", 2)
    K.append(("متطوّر · س4", C["toEN"]["good"]))
    rl = C["role"]
    dev += box("5) حضّر لعب الأدوار · Role play:", f"<div class='chk'>{X(rl['setting'])}</div>" + table(["النقطة", "ما سأقوله"], [[X(b[0]), ""] for b in rl["bullets"]], "w"))
    K.append(("متطوّر · س5 (نموذج)", " · ".join(f"{b[0]}: {b[1]}" for b in rl["bullets"])))
    dev += checkpoint()
    cv = C["conv"]; wr = C["write"]; ta = C["toAR"]
    adv = head(C, "adv") + box("1) محادثة · Conversation: " + X(cv["q"]), "<div class='chk'>أجب بأربع جمل: إجابة ← سبب ← مثال بالماضي ← خطة بالمستقبل.</div>", 4)
    K.append(("متمكّن · س1 (نموذج)", " ".join(m[1] for m in cv["model"])))
    adv += box("2) ترجم إلى العربية · Translate into Arabic:", "".join(f"<div class='en'>{j + 1}. {X(a)}</div>{lines(1)}" for j, (a, _, _) in enumerate(ta)))
    K.append(("متمكّن · س2", " · ".join(b for _, b, _ in ta)))
    plan = table(["النقطة", "زمنها", "كلمات مفتاحية"], [[X(b[0]), "", ""] for b in wr["bullets"]], "w")
    adv += box("3) " + X(wr["title"]), f"<div>{X(wr['task'])}</div><div class='chk'>{X(wr['note'])}</div>" + plan, 8)
    K.append(("متمكّن · س3 (نموذج)", " ".join(b[1] for b in wr["bullets"])))
    adv += checkpoint()
    o2, good = two_opts(mq)
    pod = head(C, "pod", f"نشاط مكيّف: {X(C['title'])}") + box("1) اقرأ الكلمات · Read the words:", table(["الكلمة", "English", "مثال"], [[X(v[0]), f"<span class='en'>{X(v[1])}</span>", X(v[2])] for v in V[:6]])) \
        + gf.replace("أكمل", "2) أكمل") + box("3) " + f"<span class='en' style='display:inline'>{X(mq['q'])}</span> (اختر واحدة)", "<div class='en'>" + "<br>".join("☐ " + X(o) for o in o2) + "</div>") \
        + box("4) أكمل الجملة · Complete:", f"<div class='frame'>{X(C['structs'][0][0])} <span class='en' style='display:inline'>({X(C['structs'][0][1])})</span><br>جملتي: ......................................................................</div>") + checkpoint()
    K.append(("أصحاب الهمم · س2", "، ".join(gw))); K.append(("أصحاب الهمم · س3", good))
    return dict(read=read, beg=beg, dev=dev, adv=adv, pod=pod, concepts=[X(v[0]) for v in V] + [X(s[0]) for s in C["structs"][:3]],
                checks=[a for a, _ in C["sc"]], key=K)

def build_work(C):
    K = []
    A, B, ev = C["A"], C["B"], C["ev"]
    read = (f"<div class='hd'><div><div class='t'>📚 بطاقة العمل: {X(C['work'])} · {X(C['author'])}</div><div class='sm'>{yearline(C)} · {X(C['focus'])}</div></div><div class='lv' style='background:#0F6E72'>للجميع</div></div>"
            + box(X(A["title"]), "".join(f"<div><b>{X(a)}:</b> {X(b)}</div>" for a, b in A["cards"]))
            + box(X(B["title"]), "".join(f"<div><b>{X(a)}:</b> {X(b)}</div>" for a, b in B["cards"]))
            + box("الأدلة: " + X(ev["title"]), table(["الدليل", "ما يكشفه"], [[X(a), X(b)] for a, b in ev["rows"]])))
    V = C["vocab"]
    m, mk = match_block("1) صِل المصطلح بمعناه:", [(v[0], v[1]) for v in V[:5]], C["code"])
    K.append(("مبتدئ · س1", mk))
    mq = C["mcq"]
    K.append(("مبتدئ · س2", next(o[0] + " · " + o[1] for o in mq["opts"] if o[2])))
    cb = [(re.sub(r"^\S+\s", "", a) if re.match(r"^[^\w\s«(]", a) else a, b) for a, b in B["cards"]][:4]
    m2, mk2 = match_block("3) صِل بالوصف المناسب:", cb, C["code"] + "b")
    K.append(("مبتدئ · س3", mk2))
    beg = head(C, "beg") + m + box("2) " + X(mq["q"]), mcq_html("", [o[0] for o in mq["opts"]])) + m2 \
        + box("4) اختر دليلًا من بطاقة العمل، واكتب ماذا يكشف:", "<div class='frame'>الدليل: «..............................................................»<br>يكشف هذا الدليل أنّ ..............................................................</div>") + checkpoint()
    K.append(("مبتدئ · س4", "أيّ دليل من جدول الأدلة مع ما يكشفه، مثل: " + ev["rows"][0][0] + " ← " + ev["rows"][0][1]))
    wd = C["wedo"]
    dev = head(C, "dev")
    for i, (q, a) in enumerate(wd[:3]):
        dev += box(f"{i + 1}) " + X(clean_q(q)), "", 2); K.append((f"متطوّر · س{i + 1}", a))
    n = len(wd[:3]) + 1
    dev += box(f"{n}) حلّل الأدلة (بلا نظر إلى بطاقة العمل):", table(["الدليل", "ما يكشفه (تحليلي)"], [[X(a), ""] for a, _ in ev["rows"][:3]], "w"))
    K.append((f"متطوّر · س{n}", " · ".join(f"{a} ← {b}" for a, b in ev["rows"][:3])))
    ido = C["ido"]
    frame = table(["الخطوة", "ما سأكتبه"], [["نقطة", ""], ["دليل", ""], ["تحليل", ""], ["ربط بالسؤال", ""]], "w")
    dev += box(f"{n + 1}) " + X(ido["q"]), f"<div class='en'>{X(ido.get('en', ''))}</div><div class='chk'>{X(ido.get('src', ''))} · اكتب فقرة: نقطة ← دليل ← تحليل ← ربط.</div>" + frame, 4)
    K.append((f"متطوّر · س{n + 1} (فقرة نموذجية)", " ".join(ido["parts"])))
    dev += checkpoint()
    ex = C["exam"]; yd = C["youdo"]
    rows = [[X(r[0]), ""] for r in ex.get("rows", [])] or [["الأطروحة", ""], ["النقطة 1", ""], ["النقطة 2", ""], ["النقطة 3", ""], ["الخاتمة", ""]]
    adv = head(C, "adv") + box("1) سؤال امتحان حقيقي (" + X(ex.get("src", "")) + "): " + X(ex.get("ar", ex.get("q", ""))), f"<div class='en'>{X(ex.get('en', ''))}</div><div class='chk'>خطّط مقالك أولًا (نحو 270 إلى 320 كلمة في الامتحان):</div>" + table(["الجزء", "فكرتي ودليلي"], rows, "ww"))
    if ex.get("rows"): K.append(("متمكّن · س1 (خطة نموذجية)", " · ".join(f"{a}: {b}" for a, b in ex["rows"])))
    adv += box("2) " + X(yd["q"]), "<div class='chk'>" + " · ".join("☐ " + X(c) for c in yd.get("check", [])) + "</div>", 7)
    K.append(("متمكّن · س2 (معايير التصحيح)", " · ".join(yd.get("check", [])) + ". " + C.get("gridLink", "")))
    adv += checkpoint()
    o2, good = two_opts(mq)
    e0 = ev["rows"][0]
    pod = head(C, "pod", f"نشاط مكيّف: {X(C['title'])}") + box("1) اقرأ المصطلحات:", table(["المصطلح", "معناه", "بالإنجليزية"], [[X(v[0]), X(v[1]), f"<span class='en'>{X(v[2])}</span>"] for v in V[:6]])) \
        + m2.replace("3) ", "2) ") + box("3) " + X(mq["q"]) + " (اختر واحدة)", mcq_html("", o2)) \
        + box("4) أكمل:", f"<div class='frame'>الدليل: {X(e0[0])}<br>يكشف هذا الدليل أنّ ......................................................................</div>") + checkpoint()
    K.append(("أصحاب الهمم · س2", mk2)); K.append(("أصحاب الهمم · س3", good)); K.append(("أصحاب الهمم · س4", e0[1]))
    return dict(read=read, beg=beg, dev=dev, adv=adv, pod=pod, concepts=[X(v[0]) for v in V], checks=C["sc"], key=K)

def rows_of(d):
    if not d: return []
    if d.get("rows"): return d["rows"]
    if d.get("cards"): return d["cards"]
    return []
def build_res(C):
    K = []
    st = C["steps"]
    read = (f"<div class='hd'><div><div class='t'>🔎 {X(C['stepsTitle'])}</div><div class='sm'>{yearline(C)} · {X(C['spec'])}</div></div><div class='lv' style='background:#0F6E72'>للجميع</div></div>"
            + box("الخطوات", "".join(f"<div><b>{X(a)}:</b> {X(b)}</div>" for a, b in st)) + box(X(C["ido1"].get("title", "")), f"<div class='chk'>{X(C['ido1'].get('intro', C['ido1'].get('note', '')))}</div>"
            + table(["", ""], [[X(a), X(b)] for a, b in rows_of(C["ido1"])])))
    V = C["vocab"]
    m, mk = match_block("1) صِل المصطلح بمعناه:", [(v[0], v[1]) for v in V[:5]], C["code"])
    K.append(("مبتدئ · س1", mk))
    mq = C["mcq"]
    K.append(("مبتدئ · س2", next(o[0] + " · " + o[1] for o in mq["opts"] if o[2])))
    wd = C["wedo"]
    beg = head(C, "beg") + m + box("2) " + X(mq["q"]), mcq_html("", [o[0] for o in mq["opts"]]))
    for i, (q, a) in enumerate(wd[:3]):
        beg += box(f"{i + 3}) " + X(clean_q(q)) + (" · " + X(C.get("wedoTitle", "")) if i == 0 else ""), "", 1); K.append((f"مبتدئ · س{i + 3}", a))
    beg += checkpoint()
    i2 = C["ido2"]; r2 = rows_of(i2)
    dev = head(C, "dev")
    if r2:
        dev += box("1) " + X(i2.get("title", "")), f"<div class='chk'>{X(i2.get('note', i2.get('intro', '')))}</div>" + table(["البند", "رأيي وتعليلي"], [[X(re.split('[:：]', b)[0] if ':' in b else a), ""] for a, b in r2], "w"))
        K.append(("متطوّر · س1", " · ".join(f"{a}: {b}" for a, b in r2)))
    dev += box("2) طبّق الخطوات على بحثك أنت:", table(["الخطوة", "تطبيقي"], [[X(a), ""] for a, _ in st], "ww"))
    K.append(("متطوّر · س2", "تتعدّد الإجابات؛ يُقيَّم الالتزام بالخطوات: " + " · ".join(a for a, _ in st)))
    dev += checkpoint()
    ex = C["exam"]; yd = C["youdo"]
    adv = head(C, "adv") + box("1) " + X(ex.get("title", "")), f"<div>العبارة: «{X(ex.get('statement', ''))}»</div><div>{X(ex.get('q', ''))}</div><div class='chk'>{X(ex.get('note', ''))}</div>" + table(["الجانب", "خطتي"], [[X(a), ""] for a, _ in ex.get("rows", [])], "ww"))
    K.append(("متمكّن · س1", " · ".join(f"{a}: {b}" for a, b in ex.get("rows", []))))
    adv += box("2) " + X(yd.get("title", "")), "<div>" + X(yd.get("task", "")).replace("\n", "<br>") + "</div><div class='chk'>" + " · ".join("☐ " + X(c) for c in yd.get("check", [])) + "</div>", 7)
    K.append(("متمكّن · س2 (معايير)", " · ".join(yd.get("check", [])) + ". " + C.get("gridLink", "")))
    adv += checkpoint()
    o2, good = two_opts(mq)
    pod = head(C, "pod", f"نشاط مكيّف: {X(C['title'])}") + box("1) اقرأ المصطلحات:", table(["المصطلح", "معناه", "بالإنجليزية"], [[X(v[0]), X(v[1]), f"<span class='en'>{X(v[2])}</span>"] for v in V[:6]])) \
        + box("2) " + X(mq["q"]) + " (اختر واحدة)", mcq_html("", o2)) + box("3) " + X(clean_q(wd[0][0])), "", 1) \
        + box("4) أكمل: موضوعي هو .............................، والدولة التي أبحثها هي ..........................", "") + checkpoint()
    K.append(("أصحاب الهمم · س2", good)); K.append(("أصحاب الهمم · س3", wd[0][1]))
    return dict(read=read, beg=beg, dev=dev, adv=adv, pod=pod, concepts=[X(v[0]) for v in V], checks=C["sc"], key=K)

def build_rev(C):
    K = []
    mp = C["map"]
    read = (f"<div class='hd'><div><div class='t'>🗺️ {X(C['mapTitle'])}</div><div class='sm'>{yearline(C)}</div></div><div class='lv' style='background:#0F6E72'>للجميع</div></div>"
            + box("خريطة الورقة", table(["الجزء", "المطلوب والدرجة"], [[X(a), X(b).replace("\n", " · ")] for a, b in mp])) + box("📌", X(C["mapNote"])) + box("⏱", X(C["timing"]))
            + box("أنواع الأسئلة", table(["السؤال", "المطلوب", "نصيحة"], [[X(a), X(b), X(c)] for a, b, c in C["qtypes"]])))
    mm, mk = match_block("1) صِل كل جزء بما يُطلب فيه:", [(a, b.replace("\n", " · ")) for a, b in mp], C["code"])
    K.append(("مبتدئ · س1", mk))
    beg = head(C, "beg") + mm
    for i, (q, a) in enumerate(C["exit"]):
        beg += box(f"{i + 2}) " + X(clean_q(q)), "", 1); K.append((f"مبتدئ · س{i + 2}", a))
    beg += checkpoint()
    dev = head(C, "dev") + box("1) اكتب نصيحة لكل نوع من الأسئلة:", table(["السؤال", "المطلوب", "نصيحتي"], [[X(a), X(b), ""] for a, b, _ in C["qtypes"]], "w"))
    K.append(("متطوّر · س1", " · ".join(f"{a}: {c}" for a, _, c in C["qtypes"])))
    lg = C["log"]
    dev += box("2) سجلّ أخطائي بعد التدريب الكامل:", table(["السؤال", "ما حدث", "السبب", "العلاج"], [[X(c) for c in lg[0]]] + [["", "", "", ""] for _ in range(4)], "w") + "<div class='chk'>الصف الأول نموذج. الخطأ الذي يتكرّر مرتين يصبح أولوية المراجعة.</div>")
    K.append(("متطوّر · س2", "تتعدّد الإجابات؛ نماذج: " + " · ".join(" / ".join(r) for r in lg)))
    dev += checkpoint()
    ms = C["ms"]
    adv = head(C, "adv") + box("1) " + X(C["msTitle"]) + ": صحّح إجابتك بنفسك", table(["المعيار", "الدرجة", "درجتي", "دليلي من إجابتي"], [[X(a), X(b), "", ""] for a, b, _ in ms], "ww"))
    K.append(("متمكّن · س1 (وصف المستوى الأعلى)", " · ".join(f"{a} ({b}): {c}" for a, b, c in ms)))
    for i, (t, mdl) in enumerate(C["groups"][1:3]):
        adv += box(f"{i + 2}) " + X(t), "", 4); K.append((f"متمكّن · س{i + 2}", mdl))
    adv += box("4) خطّتي للمراجعة:", table(["الأولوية", "ماذا سأفعل", "متى"], [["1", "", ""], ["2", "", ""], ["3", "", ""]], "w"))
    adv += checkpoint()
    pod = head(C, "pod", f"نشاط مكيّف: {X(C['title'])}") + box("1) اقرأ خريطة الورقة:", table(["الجزء", "المطلوب والدرجة"], [[X(a), X(b).replace("\n", " · ")] for a, b in mp])) \
        + mm.replace("1) ", "2) ") + box("3) " + X(clean_q(C["exit"][0][0])), "", 1) + box("4) أكمل: أكثر شيء سأراجعه هو .........................................، لأنّ ..........................................", "") + checkpoint()
    K.append(("أصحاب الهمم · س2", mk)); K.append(("أصحاب الهمم · س3", C["exit"][0][1]))
    return dict(read=read, beg=beg, dev=dev, adv=adv, pod=pod, concepts=[X(a) for a, _, _ in C["qtypes"]] + [X(a) for a, _, _ in ms], checks=[g for g in C["good"]], key=K)

BUILD = {"top": build_top, "gc": build_gc, "work": build_work, "res": build_res, "rev": build_rev}

def page(body): return f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>"
def render(pg, path, body):
    tmp = "/tmp/w/ws_t.html"; open(tmp, "w").write(page(body))
    pg.goto("file://" + tmp); pg.wait_for_timeout(150)
    return pg.pdf(path=path, format="A4", print_background=True, margin={"top": "12mm", "bottom": "12mm", "left": "12mm", "right": "12mm"})
def npages(b): return len(re.findall(rb"/Type\s*/Page[^s]", b))
FITLOG = []
def fit(pg, body, code="", name=""):
    """Shrink spacing step by step until the section fits on one A4 page."""
    for c in ["", "c1", "c2", "c3"]:
        h = f"<div class='{c}'>{body}</div>"
        if npages(render(pg, None, h)) <= 1: return h
    FITLOG.append((code, name)); return h

def make(C, pg):
    S = BUILD[fam(C)](C)
    d = folder(C); os.makedirs(d, exist_ok=True)
    F = {k: fit(pg, S[k], C["code"], k) for k in ["read", "beg", "dev", "adv", "pod"]}
    render(pg, f"{d}/worksheets-A4.pdf", F["read"] + "<div class='pb'></div>" + F["beg"] + "<div class='pb'></div>" + F["dev"] + "<div class='pb'></div>" + F["adv"])
    render(pg, f"{d}/pod-sheet.pdf", F["pod"])
    rows = "".join(f"<tr><td>{c}</td><td class='ww'></td><td></td></tr>" for c in S["concepts"])
    cc = (f"<div class='hd'><div><div class='t'>بطاقة المفاهيم: {X(C['title'])}</div><div class='sm'>{yearline(C)}</div></div><div class='lv' style='background:#0F6E72'>للجميع</div></div>"
          f"<table><tr><th>المفهوم أو التركيب</th><th>معناه بلغتي</th><th>مثال من إنشائي</th></tr>{rows}</table>"
          + box("✍️ بطاقة الناقد الصغير (لمراجعة عمل زميلي):", "<div>" + "<br>".join("☐ " + X(c) for c in S["checks"]) + "</div><div class='frame'>أعجبني: ................................................ أقترح: ................................................</div>"))
    render(pg, f"{d}/concept-card.pdf", cc)
    key = (f"<div class='hd'><div><div class='t'>مفتاح الإجابة: {X(C['title'])}</div><div class='sm'>{yearline(C)} · للمعلّم فقط</div></div><div class='lv' style='background:#1E3A3F'>للمعلّم</div></div>"
           "<div class='box tip'>الإجابات والنماذج مأخوذة من عرض المعلم لهذا الدرس، فما يراه الطالب في الشرائح هو ما يُصحَّح به.</div>")
    cur = None
    for a, b in S["key"]:
        sec = a.split(" · ")[0]
        if sec != cur: key += f"<div class='kh'>{X(sec)}</div>"; cur = sec
        key += f"<div class='kv'><b>{X(a.split(' · ', 1)[-1])}:</b> " + " · ".join(f"<bdi>{X(x)}</bdi>" for x in str(b).split(" · ")) + "</div>"
    render(pg, f"{d}/answer-key.pdf", key)

if __name__ == "__main__":
    from playwright.sync_api import sync_playwright
    want = set(sys.argv[1:])
    L = [C for C in lessons() if not want or C["code"] in want]
    os.makedirs("/tmp/w", exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        for C in L:
            make(C, pg); print(C["code"], fam(C))
        b.close()
    print("NOT FITTED", FITLOG)
