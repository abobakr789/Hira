# IGCSE Islamic Studies (4IS1): student and teacher papers built from the same lesson data as the teacher deck.
# Files (same names as Hiraa's Islamic Education packs): worksheets-A4.html (Bronze (a) · Silver (b) · Gold (c) · Diamond (d)),
# pod-sheet.html, sources-concept-card.html, group-work.html, answer-key.html.
from pearson_en import pearson_lines, official
import os, re, sys, json, html as _h, hashlib
sys.path.insert(0, os.path.dirname(__file__))
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
TPL = os.path.join(ROOT, "resources/ie/IE-Y10-NN-T1-L01/worksheets-A4.html")
_t = open(TPL, encoding="utf-8").read()
STYLE = _t[_t.find("<style>"):_t.find("</style>") + 8].replace("</style>", """
@font-face{font-family:HF;src:url("../../../art/fonts/uthmanic-hafs.woff2")}
.qt{font-family:HF,QF} .two{display:grid;grid-template-columns:1fr 1fr;gap:8px} .lv{font-size:9.5pt;color:#555}
.model{background:#F2FAF6;border-left:5px solid #1F7A55;border-radius:10px;padding:6px 12px;margin:4px 0}
.k h3{font-family:TD;font-size:13pt;margin:12px 0 4px;color:#1F2A3C;border-bottom:2px solid #eee}
.k .a{margin:3px 0 6px;padding-left:10px;border-left:4px solid #DCEAE4} .bank span{display:inline-block;border:1.5px dashed #3F6E5B;border-radius:8px;padding:1px 10px;margin:2px;font-weight:700}
</style>""")
FIT = """<script>document.fonts.ready.then(function(){(function(){var H=277*96/25.4;document.querySelectorAll('.page').forEach(function(p){var f=p.querySelector('.fit');var s=p.querySelector('.self');var hh=H-(s?s.offsetHeight+6:0);var h=f.scrollHeight;if(h>hh){f.style.zoom=(hh/h*0.99).toFixed(4);}});})();});</script>"""
LOGO = '<img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:150px;height:60px;object-fit:contain">'
LV = [("Bronze", "(a) Identify & state", "#9A5A26", "#F7E9DC"), ("Silver", "(b) Describe", "#5E6672", "#EDEFF2"),
      ("Gold", "(c) Explain", "#A87A0C", "#FBF1D3"), ("Diamond", "(d) Assess", "#5546A3", "#EEEAFB")]
SELF = "<div class='self'><span>How do I feel?</span><span>🟢 I can do it alone</span><span>🟡 I need some help</span><span>🔴 I don’t understand yet</span></div>"

def e(t): return _h.escape(str(t), quote=False)
def md(t): return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", e(t))
def lines(n): return "<div class='ln'></div>" * n
def mix(items, salt): return sorted(items, key=lambda x: hashlib.md5((salt + str(x)).encode()).hexdigest())
def page(inner, self_=True): return f"<div class='page'><div class='fit'>{inner}</div>{SELF if self_ else ''}</div>"
def doc(title, pages): return f"<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>{e(title)} · Hiraa</title>{STYLE}</head><body><button class='pb' onclick='print()'>🖨️ Print</button>{''.join(pages)}{FIT}</body></html>"
def head(C, title, pill, col, bg):
    return (f"<div class='hd' style='background:{bg}'><div><div class='t'>{e(title)}</div><div class='m'>IGCSE Islamic Studies · Pearson Edexcel 4IS1 · Section {C['sec']} · Topic {C['num']}</div></div>"
            f"<div style='display:flex;align-items:center;gap:10px'><span class='pill' style='background:{col}'>{e(pill)}</span>{LOGO}</div></div>"
            "<div class='nm'><span>Name: ........................................</span><span>Class: ........</span><span>Date: ..............</span></div>")
def strip(k): return "<div class='strip'>" + "".join(f"<div class='{'on' if j == k else ''}' style='{f'border-color:{c};color:{c};background:{b}' if j == k else ''}'>{n}<br>{s}</div>" for j, (n, s, c, b) in enumerate(LV)) + "</div>"
def q(n, col, title, body=""): return f"<div class='q'><div class='qh'><span class='n' style='background:{col}'>{n}</span><span>{md(title)}</span></div>{body}</div>"
def passage(C, full=True):
    sp = C["passage"]
    if sp.get("en"): sp = dict(sp, en=pearson_lines(C["num"], sp["en"]))
    if sp.get("hadith") and official(C["num"]): sp = dict(sp, hadith=official(C["num"]))
    if sp.get("hadith"): return f"<div class='txt'><div class='h'>📜 Set passage · {e(sp['ref'])}</div><div class='trn' style='font-size:11.5pt'>{e(sp['hadith'])}</div><div class='lv'>{e(sp['src'])}</div></div>"
    ar = " ".join(f"{e(x.replace(chr(0x08F1), chr(0x065E)).replace(chr(0x0640), ''))} ﴿{n}﴾" for n, x in sp["ar"])
    en = "".join(f"<div class='trn'>({n}) {e(t)}</div>" for n, t in sp["en"]) if full else ""
    return f"<div class='txt'><div class='h'>📖 Set passage · {e(sp['ref'])}</div><div class='qt'>{ar}</div>{en}</div>"
def opts(o): return "<div class='opts'>" + "".join(f"<span>{md(x)}</span>" for x in o) + "</div>"
def table(heads, rows, h=0):
    return "<table><tr>" + "".join(f"<th>{md(x)}</th>" for x in heads) + "</tr>" + "".join("<tr>" + "".join(f"<td{f' style=height:{h}px' if (h and c == '') else ''}>{md(c)}</td>" for c in r) + "</tr>" for r in rows) + "</table>"
def goal(C): return f"<div class='goal'>🎯 {md(C['goal'])}</div>"

def build(C):
    out = os.path.join(ROOT, "resources/ie", C["code"]); os.makedirs(out, exist_ok=True)
    T, sp, W = C["title"], C["passage"], C["ws"]
    K = []  # answer key: (section, label, answer)
    # ---------- worksheets (4 levels) ----------
    pages = []
    terms = C["terms"][:4 if sum(len(x) for _, x in (sp.get("ar") or [])) + len(sp.get("hadith") or "") > 560 else 6]; right = mix([b for _, b in terms], C["code"])
    kb = [head(C, f"Worksheet: {T}", "Level: Bronze", *LV[0][2:]), strip(0), goal(C),
          q(1, LV[0][2], "Match each key term with its meaning (write the letter).", table(["Term", "Letter", "Meaning"], [[f"{i + 1}) {a}", "", f"{'ABCDEF'[j]}) {r}"] for i, ((a, _), j, r) in enumerate(zip(terms, range(6), right))])),
          passage(C),
          q(2, LV[0][2], "Which part of the set passage says this? Write the verse or phrase.", table(["Statement", "Verse / phrase"], [[r[1], ""] for r in mix(sp["unpack"], "v")])),
          q(3, LV[0][2], C["ido_a"]["q"].replace("(a) ", ""), lines(2))]
    K += [("Bronze", "1 (match)", ", ".join(f"{i + 1}–{'ABCDEF'[right.index(b)]}" for i, (_, b) in enumerate(terms))),
          ("Bronze", "2 (verses)", " · ".join(f"{r[1]} → {r[0]}" for r in mix(sp["unpack"], "v"))),
          ("Bronze", "3", C["ido_a"]["ans"])]
    pages.append(page("".join(kb)))
    cs = [x for c in C["content"] for x in c["cards"]][:8]
    ks = [head(C, f"Worksheet: {T}", "Level: Silver", *LV[1][2:]), strip(1), goal(C),
          q(1, LV[1][2], "Explain each idea in your own words (one sentence each).", table(["Idea", "In my own words"], [[a, ""] for a, _ in cs], 26)),
          q(2, LV[1][2], W["a2"][0], lines(2)),
          q(3, LV[1][2], C["ido_b"]["q"].replace("(b) ", "") + " — use point + development", lines(4)),
          q(4, LV[1][2], W["b2"][0], "<div class='lv'>Describe = 3 developed points, or a point developed twice.</div>" + lines(4))]
    K += [("Silver", "1", " · ".join(f"{a}: {b}" for a, b in cs)), ("Silver", "2 (2 marks)", W["a2"][1]), ("Silver", "3 (3 marks)", " ".join(C["ido_b"]["marks"])), ("Silver", "4 (3 marks)", W["b2"][1])]
    pages.append(page("".join(ks)))
    kg = [head(C, f"Worksheet: {T}", "Level: Gold", *LV[2][2:]), strip(2), goal(C),
          q(1, LV[2][2], W["c2"][0], "<div class='lv'>Plan three different points. For each: say it, then explain why it is important (because… this means… so…).</div>"
            + table(["", "Point", "Why it is important"], [["1", "", ""], ["2", "", ""], ["3", "", ""]], 52)),
          q(2, LV[2][2], "Now write your full answer (about 150 words).", lines(8)),
          q(3, LV[2][2], "Check your level:", "<div class='lv'>☐ Level 3 (5–6): three ideas, each fully developed · ☐ Level 2 (3–4): a range of ideas, some not developed · ☐ Level 1 (1–2): a few simple points</div>")]
    K += [("Gold", "1–2 (model answer)", W["c2"][1])]
    pages.append(page("".join(kg)))
    y = C["youdo"]
    kd = [head(C, f"Worksheet: {T}", "Level: Diamond", *LV[3][2:]), strip(3), goal(C), passage(C, full=False),
          q(1, LV[3][2], y["q"] + " (12)", "<div class='lv'>Plan first (3 minutes), then write (about 15 minutes).</div>"
            + table(["✅ Agree: reasons + the text", "❌ Another point of view: reasons"], [["", ""], ["", ""]], 70)
            + "<div class='lv'>⚖️ My conclusion (which side is stronger and why):</div>" + lines(2)),
          q(2, LV[3][2], "Write your answer.", lines(8)),
          q(3, LV[3][2], "Before you hand in:", "<div class='lv'>☐ I used the set text · ☐ I gave another point of view · ☐ every point has a reason · ☐ I reached a balanced conclusion</div>")]
    K += [("Diamond", "Indicative content", "Agree: verse 39 — prophets «fear none but Allah»: persecution tested and strengthened faith (Bilal's «Ahad, Ahad»; Sumayyah's sacrifice); hardship bound the believers together and prepared them for Madinah. "
           "Other view: the opposition also caused suffering and loss — Sumayyah was killed and some Muslims had to leave for Abyssinia; verse 38 shows that strength comes from following «the established way of Allah», not from persecution itself; Allah's help and the Prophet's ﷺ leadership kept them firm. "
           "Conclusion: a justified judgement, e.g. opposition revealed and deepened their faith, but it was faith in Allah, not the opposition itself, that made them strong. Mark with the Level 1–3 descriptors (Level 3 needs the text, another view and a justified conclusion).")]
    pages.append(page("".join(kd)))
    open(f"{out}/worksheets-A4.html", "w", encoding="utf-8").write(doc(f"Worksheet: {T}", pages))
    # ---------- POD (adapted) ----------
    m = C["mcq"]; good = next(o for o in m["opts"] if o[2]); bad = next(o for o in m["opts"] if not o[2]); two = mix([good[0], bad[0]], "pod")
    PD = W["pod"]
    pod = [head(C, f"Adapted activity: {T}", "POD 💚", "#0F6E72", "#E3F2EF"), goal(C),
           q(1, "#0F6E72", "Read the key words.", table(["Word", "Meaning"], [[a, b] for a, b in C["terms"][:6]])),
           q(2, "#0F6E72", "Fill the gaps with a word from the box.", "<div class='bank'>" + "".join(f"<span>{e(w)}</span>" for w in mix(PD["bank"], "b")) + "</div>"
             + "".join(f"<div>{i + 1}) {e(x).replace('____', '__________')}</div>" for i, x in enumerate(PD["sents"]))),
           q(3, "#0F6E72", m["q"] + " (choose one)", opts(two)),
           q(4, "#0F6E72", "Finish the sentences:", "<div style='line-height:2.3'>" + "<br>".join(e(f.replace("…", "")) + " ............................................................" for f in PD["frames"]) + "</div>")]
    open(f"{out}/pod-sheet.html", "w", encoding="utf-8").write(doc(f"Adapted activity: {T}", [page("".join(pod))]))
    K += [("POD", "2", PD["key"]), ("POD", "3", good[0] + " " + good[1])]
    # ---------- sources & concept card ----------
    boxes = [f"<div class='q'><div class='qh'>{e(c['title'])}</div>" + "".join(f"<div>• <b>{e(a)}</b>: {e(b)}</div>" for a, b in c["cards"]) + "</div>" for c in C["content"]]
    qs = [c["quote"] for c in C["content"] if c.get("quote")]
    src1 = [head(C, f"Sources & key ideas: {T}", "Source sheet", "#3F6E5B", "#DCEAE4"), goal(C), passage(C)] + [f"<div class='txt'><div class='h'>📜 {e(b)}</div><div class='trn'>{e(a)}</div></div>" for a, b in qs] + boxes[:1]
    src2 = [head(C, f"Sources & key ideas (continued): {T}", "Source sheet", "#3F6E5B", "#DCEAE4")] + boxes[1:]
    cc = [head(C, f"Concept card: {T}", "Concept card", "#3F6E5B", "#DCEAE4"),
          q(1, "#3F6E5B", "Key terms: explain each in your own words and give an example.", table(["Term", "In my own words", "Example / evidence"], [[a, "", ""] for a, _ in C["terms"]], 34))]
    open(f"{out}/sources-concept-card.html", "w", encoding="utf-8").write(doc(f"Sources & concept card: {T}", [page("".join(src1), False), page("".join(src2), False), page("".join(cc))]))
    # ---------- group work ----------
    gp = [head(C, f"Group work: {T}", "Groups", "#5546A3", "#EEEAFB"), goal(C)]
    for j, (lv, (t, _)) in enumerate(zip(["🥉 Secure", "🥈 Developing", "🥇 Mastery"], C["groups"])):
        gp.append(q(j + 1, LV[j][2], f"{lv}: {t}", "<div class='lv'>Roles: reader · writer · checker · presenter. Time: 10 minutes. Use the source sheet.</div>" + lines(5)))
    gp.append("<div class='q'><div class='qh'>Feedback</div><div class='lv'>⭐ Star 1: ...................................... ⭐ Star 2: ...................................... 💡 Wish: ......................................</div></div>")
    open(f"{out}/group-work.html", "w", encoding="utf-8").write(doc(f"Group work: {T}", [page("".join(gp))]))
    K += [("Groups", lv, mdl) for lv, (_, mdl) in zip(["Secure", "Developing", "Mastery"], C["groups"])]
    # ---------- answer key ----------
    ak = [head(C, f"Answer key: {T}", "Teacher only", "#1E3A3F", "#E8EEF0"), "<div class='lv'>Model answers come from the teacher presentation for this lesson, so students are marked against what they saw in class.</div><div class='k'>"]
    cur = None
    for s_, lab, a in K:
        if s_ != cur: ak.append(f"<h3>{e(s_)}</h3>"); cur = s_
        ak.append(f"<div class='a'><b>{e(lab)}:</b> {md(a)}</div>")
    ak.append("</div>")
    open(f"{out}/answer-key.html", "w", encoding="utf-8").write(doc(f"Answer key: {T}", ["<div>" + "".join(ak) + "</div>"]))
    return out

if __name__ == "__main__":
    import importlib
    mod = importlib.import_module(sys.argv[1])
    for C in mod.L:
        if len(sys.argv) > 2 and C["code"] not in sys.argv[2:]: continue
        print(build(C))
