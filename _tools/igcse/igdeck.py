# Builds an IGCSE Islamic Studies (4IS1) teacher deck from a lesson dict (see ig_t1.py).
# Structure: where it sits → retrieval → hook → success criteria → key terms → set passage → content (spec a, b, c…)
# → I do (a), (b) → check → we do (c) → examiner advice → (d) plan + model → you do (d) → self-mark → groups → exit → reflect.
import os, json, sys
sys.path.insert(0, os.path.dirname(__file__))
from igkit import *

LEVELS_C = [("Level 3 · 5–6", "Excellent, accurate facts; a broad range of ideas, each detailed and fully developed."),
            ("Level 2 · 3–4", "Mostly accurate facts; a range of ideas, some not fully developed."),
            ("Level 1 · 1–2", "Limited facts; a narrow range, little detail or development.")]
LEVELS_D = [("Level 3 · 9–12", "Balanced argument; excellent use of the set text; thorough use of own and others' views; justified conclusion."),
            ("Level 2 · 5–8", "Partly balanced; good use of the text; some other views. Missing the text or a second view keeps you here (examiners' report 2025)."),
            ("Level 1 · 1–4", "One-sided; little or no use of the text; no other views; basic interpretation.")]

def build(C):
    D = Deck(C["code"], C["title"], f'4IS1 · {C["title"]}')
    sec = C["sec"]
    # 1 cover
    D.sl.append(f'''<section class="sl" id="cover" style="background:#FBF7EF;color:#1F2A3C;font-family:'Thmanyah Text','Cairo',Tahoma,sans-serif;padding:0;direction:ltr">
<div class="cvbg" style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:linear-gradient(225deg,#F6E7C6 0%,#FBF7EF 50%,#E3EFEA 100%)"></div>
<img src="../../../art/lanterns.webp" alt="" style="position:absolute;right:640px;top:0;width:230px;height:274px;object-fit:contain">
<div style="position:absolute;right:80px;top:60px;display:flex"><img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:400px;height:159px;object-fit:contain"></div>
<div style="position:absolute;right:130px;top:330px;width:460px;height:460px;border-radius:50%;background:#fff;border:6px solid #F3E4C2;display:flex;align-items:center;justify-content:center"><img src="../../../art/{C.get("pic","quranstand.webp")}" alt="" style="width:300px;height:300px;object-fit:contain"></div>
<div style="position:absolute;left:120px;top:250px;width:1080px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">
<p style="font-size:28px;color:#A8741F;background:#fff;border:2px solid #A8741F;padding:6px 22px;border-radius:26px">Pearson Edexcel International GCSE Islamic Studies · 4IS1 · Section {sec}</p>
<h1 style="{DISP};font-size:84px;line-height:1.2;text-align:left">{md(C["title"])}</h1>
<div style="background:#fff;border-left:10px solid #3F6E5B;border-radius:20px;padding:20px 28px"><p style="font-size:32px;line-height:1.5;text-align:left"><b>🎯 Objective:</b> {md(C["goal"])}</p></div>
<p style="font-size:26px;color:#5B6472">{e(C["periods"])}</p></div><aside>{e(C["src"])}</aside></section>''')
    # 2 where it sits
    spec = grid([chipcard(f"Spec {a}", b, k, build=k + 1, size=25) for k, (a, b) in enumerate(C["spec"])], 2 if len(C["spec"]) > 2 else len(C["spec"]))
    exam = ''.join(f'<div style="flex:1;background:{TINTS[k]};border-radius:16px;padding:12px 16px"><p style="font-size:30px;font-weight:700;color:{COLS[k]};text-align:center">{a}</p><p style="font-size:21px;text-align:center">{b}</p></div>'
                   for k, (a, b) in enumerate([("(a) 1–2", "Identify / State"), ("(b) 3", "Describe"), ("(c) 6", "Explain"), ("(d) 12", "Assess · set text")]))
    D.slide("where", 'sand', "Where this sits in the course", f"Section {sec} · {C['num']}", spec + f'<div style="display:flex;flex-direction:row;gap:14px"{B(len(C["spec"]) + 1)}>{exam}</div>'
            + tagline(C["examLink"], build=len(C["spec"]) + 2, size=25), "Read the spec points as questions students will be asked. Point out the real exam link.", "3 min")
    # 3 retrieval
    D.slide("recall", 'blue', "Retrieval: what do you remember?", "From earlier topics",
            grid([qa(q, a, k, k + 1, 27) for k, (q, a) in enumerate(C["recall"])], 2), "Students answer on mini-whiteboards; reveal one at a time.", "4 min")
    # 4 hook
    hk = C["hook"]
    D.slide("hook", 'peach', hk["title"], "Think – pair – share", card(P(hk["q"], 40, '#1F2A3C', True, 'center'), '#B0582F', pad='40px 50px')
            + grid([chipcard(a, b, k + 3, build=k + 1) for k, (a, b) in enumerate(hk["prompts"])], len(hk["prompts"])), "Pairs for 2 minutes; take 2–3 answers. Come back to this at the end.", "3 min")
    # 5 success criteria
    D.slide("sc", 'blue', "Success criteria", "Where are we heading?",
            card(P("**Objective:** " + C["goal"], 28), '#2F6A9A', '#DDEBF7') + ''.join(
                f'<div style="background:#fff;border-left:10px solid {COLS[k]};border-radius:18px;padding:14px 24px;display:flex;flex-direction:row;gap:16px;align-items:center"{B(k + 1)}>'
                f'<p style="font-size:30px;color:{COLS[k]};background:{TINTS[k]};padding:0 16px;border-radius:12px"><b>{k + 1}</b></p><p style="flex:1;font-size:27px;text-align:left">{md(t)}</p>'
                f'<p style="font-size:21px;color:{COLS[k]};background:{TINTS[k]};padding:2px 12px;border-radius:12px;white-space:nowrap">{e(ao)}</p></div>' for k, (t, ao) in enumerate(C["sc"])),
            "Each criterion matches one exam skill. Students rate themselves 1–5 now and again at the end.")
    # 6 key terms
    D.slide("terms", 'gold', "Key terms", "Use them in every answer",
            grid([card(P(a, 30, COLS[k % 6], True) + P(b, 24), COLS[k % 6], build=k + 1, pad='16px 24px') for k, (a, b) in enumerate(C["terms"])], 2, 14),
            "Key terms lift AO1 marks. Students add them to their glossary.", "4 min")
    # 7 set passage
    sp = C["passage"]
    D.slide("passage", 'mint', "Set passage: " + sp["ref"], "Learn it · quote it in (d)",
            quran(sp["ar"], sp["ref_ar"], sp.get("size", 44)) + card(''.join(P(f"({n}) {t}", 25, '#3F4A5A', extra='font-style:italic') for n, t in sp["en"]), '#3F6E5B'),
            "Recite, then read the translation (from the specification). The passage is printed in the exam for (d) questions.", "5 min")
    # 8 passage unpacked
    D.slide("unpack", 'mint', "What the passage gives you", "Text → argument",
            table([("Verse", 1), ("It says…", 3), ("Use it in an answer to…", 3)], sp["unpack"], size=25, build_rows=True),
            "Show how each verse becomes evidence. Ask: which verse supports the statement, which challenges it?", "5 min")
    # 9.. content slides
    for k, cs in enumerate(C["content"]):
        body = ''
        if cs.get("intro"): body += tagline(cs["intro"], COLS[k % 6], TINTS[k % 6], size=27)
        body += grid([chipcard(a, b, k + j, build=j + 1, size=cs.get("size", 25)) for j, (a, b) in enumerate(cs["cards"])], cs.get("cols", 2), 16)
        if cs.get("quote"): body += card(P(cs["quote"][0], 26, extra='font-style:italic') + P(cs["quote"][1], 21, '#8A6D1E'), '#8A6D1E', '#FFF8E2', build=len(cs["cards"]) + 1)
        D.slide(f"c{k}", ['sky', 'lav', 'rose', 'peach', 'gold'][k % 5], cs["title"], cs["pill"], body, cs["notes"], cs.get("mins", "8 min"))
    # I do (a)
    a = C["ido_a"]
    D.slide("idoa", 'blue', "I do: an (a) question", "Watch me answer",
            card(P(a["q"], 32, '#1F2A3C', True), '#2F6A9A', '#DDEBF7')
            + ''.join(tagline(f"**{s}** {t}", COLS[j], TINTS[j], build=j + 1, size=26) for j, (s, t) in enumerate(a["steps"]))
            + card(P("✅ " + a["ans"], 30, '#1F7A55', True), '#1F7A55', '#E7F6EC', build=len(a["steps"]) + 1),
            "Think aloud: count the marks, find two separate facts, write them briefly. No explanation is needed for (a).", "3 min")
    # I do (b)
    b = C["ido_b"]
    D.slide("idob", 'blue', "I do: a (b) Describe question", "1 mark per point or development",
            card(P(b["q"], 32, '#1F2A3C', True), '#2F6A9A', '#DDEBF7') + tagged([(f"Mark {j + 1}", j, t) for j, t in enumerate(b["marks"])])
            + tagline("💡 " + b["tip"], build=len(b["marks"]) + 1, size=25),
            "Show that a point + development earns the marks; a list of single words does not.", "4 min")
    # check (mcq)
    m = C["mcq"]
    D.slide("check", 'lav', "Quick check", "Spot the misconception", card(P(m["q"], 32, '#1F2A3C', True), '#5546A3', '#E4DEF6')
            + ''.join(f'<div style="display:flex;flex-direction:row;gap:14px;align-items:center;background:#fff;border-radius:16px;padding:12px 22px">'
                      f'<p style="flex:1;font-size:27px;text-align:left">{md(o)}</p><p style="flex:1;font-size:23px;color:{"#1F7A55" if ok else "#B4483F"};text-align:left"{B(j + 1)}>{md(w)}</p></div>'
                      for j, (o, w, ok) in enumerate(m["opts"])), "Vote with fingers (A–D) before revealing each explanation.", "3 min")
    # we do (c)
    c = C["wedo_c"]
    D.slide("wedoc", 'sand', "We do: a (c) Explain question (6 marks)", "Point → develop → link",
            card(P(c["q"], 31, '#1F2A3C', True), '#A8741F', '#F3E4C2')
            + tagged([(t, j, x) for j, (t, x) in enumerate(c["model"])]),
            "Build it with the class: students suggest a point, you push for 'this is important because…'. Reveal the model paragraph by paragraph.", "8 min")
    D.slide("levelsc", 'sand', "How (c) is marked", "Levels, not ticks",
            table([("Level", 1), ("What the examiner looks for", 4)], LEVELS_C, size=26) + tagline("📊 Examiners (2025): «a series of simple points will rarely allow them to gain more than half the available marks.»", '#A8425E', '#F6DCE2', 1, 26)
            + tagline("Our model scores Level 3: three different ideas, each explained with a reason and linked to the question's focus.", build=2, size=25),
            "Ask: which level would 'he received the Qur'an, he was a role model, he built a community' get? (Level 1–2: points listed, not developed.)", "3 min")
    # examiner advice
    D.slide("examiner", 'rose', "What the examiners said (June 2025)", "Learn from real scripts",
            grid([chipcard(a, t, j, build=j + 1, size=23) for j, (a, t) in enumerate(C["examiner"])], 2),
            "From Pearson's 2025 examiners' report for 4IS1. Ask each student: which of these do I do?", "4 min")
    # (d) plan
    d = C["d"]
    D.slide("dplan", 'peach', "Plan a (d) answer: " + d["src"], "12 marks · four elements",
            card(P(d["q"], 30, '#1F2A3C', True), '#B0582F', '#F6DCCB')
            + table([("✅ Agree (with the text)", 1), ("❌ Another point of view", 1)], [[x, y] for x, y in zip(d["for"], d["against"])], [ '#3F6E5B', '#A8425E'], 24, True)
            + tagline("⚖️ **Conclusion:** " + d["conclusion"], '#5546A3', '#E4DEF6', len(d["for"]) + 1, 25),
            "Plan in a T-table first (3 minutes in the exam). Every side needs reasons; the text must appear.", "6 min")
    D.slide("dmodel", 'peach', "Model (d) answer · Level 3", "Read the tags", tagged(d["model"], size=24),
            "Read it aloud; students highlight where each tag appears. Ask what would push a Level 2 answer up.", "6 min")
    # you do
    y = C["youdo"]
    D.slide("youdo", 'mint', "You do: write a (d) answer", "Exam conditions · ~18 minutes",
            card(P(y["q"], 31, '#1F2A3C', True), '#3F6E5B', '#DCEAE4')
            + grid([chipcard(a, b, j, size=24) for j, (a, b) in enumerate([("📖 Text", "Quote or refer to " + y["text"] + "."), ("✅ Opinion", "Two reasoned points that agree."),
                                                                           ("❌ Other view", "Two reasoned points from another view."), ("⚖️ Conclusion", "Weigh both sides; say which is stronger and why.")])], 4, 14)
            + tagline("Hiraa timing suggestion: the paper is 2h 30m for four questions, so about 37 minutes per question; aim for about 18 minutes on (d).", '#5B6472', '#EEF0F2', size=23),
            "Silent writing. Circulate and stop students who have not yet used the text by minute 8.", "18 min")
    D.slide("selfmark", 'mint', "Mark your own (d) answer", "Levels 1–3", table([("Level", 1), ("Descriptor", 4)], LEVELS_D, size=23)
            + grid([chipcard("☐ Text used", "I used the set passage.", 0, 1, 20), chipcard("☐ Other view", "I developed another view.", 1, 2, 20),
                    chipcard("☐ Reasons", "Every point has 'because…'.", 2, 3, 20), chipcard("☐ Conclusion", "I weighed both sides.", 3, 4, 20)], 4, 12),
            "Students tick the four elements, then choose a level and give one reason. Swap with a partner to moderate.", "5 min")
    # groups
    D.slide("groups", 'lav', "Group challenge", "Choose your level",
            grid([card(P(lv, 30, COLS[j * 2], True) + P(t, 24) + f'<div{B(j + 1)} style="background:{TINTS[j * 2]};border-radius:14px;padding:10px 16px"><p style="font-size:22px;color:{COLS[j * 2]};text-align:left">✅ {md(mdl)}</p></div>', COLS[j * 2])
                  for j, (lv, (t, mdl)) in enumerate(zip(["🥉 Secure", "🥈 Developing", "🥇 Mastery"], C["groups"]))], 3, 16),
            "Groups pick a level; model answers are revealed after presenting.", "10 min")
    # exit
    D.slide("exit", 'blue', "Exit ticket", "Three questions before the bell", grid([qa(q, a, j, j + 1, 27) for j, (q, a) in enumerate(C["exit"])], 1, 14),
            "Individually, then self-check.", "4 min")
    D.slide("reflect", 'sand', "Reflect & next steps", "What did I learn?",
            grid([chipcard("🪞 Today I learned", C["learned"], 0, size=26), chipcard("🏠 Home learning", "  ".join(C["home"]), 3, size=24)], 2)
            + tagline("Next lesson: " + C["next"], '#5546A3', '#E4DEF6', size=27), "Students re-rate the success criteria (1–5) and compare with the start.", "3 min")
    return D

if __name__ == "__main__":
    import importlib
    mod = importlib.import_module(sys.argv[1])
    for C in mod.L:
        if len(sys.argv) > 2 and C["code"] not in sys.argv[2:]: continue
        D = build(C); n = D.save(os.path.join(ROOT, "resources/ie", C["code"], "teacher-deck.html")); print(C["code"], n)
