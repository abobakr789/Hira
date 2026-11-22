# GCSE Arabic (1AA0, non-native learners) lesson deck: curriculum-specific, modelling-first, English support.
# Exam facts from the 1AA0 specification/SAMs and 2024/2025 question papers, mark schemes and examiner reports (see the qualification workshops).
import sys, os, json; sys.path.insert(0, os.path.dirname(__file__))
from qlib import *
REG = os.path.join(os.path.dirname(__file__), "vocab_reg.json")
THEMES = {1: "المحور 1: الهوية والثقافة", 2: "المحور 2: المنطقة المحلية والعطلات والسفر", 3: "المحور 3: المدرسة", 4: "المحور 4: الطموحات المستقبلية والدراسة والعمل", 5: "المحور 5: البعد الدولي والعالمي"}
THEMES_EN = {1: "Theme 1: Identity and culture", 2: "Theme 2: Local area, holiday and travel", 3: "Theme 3: School", 4: "Theme 4: Future aspirations, study and work", 5: "Theme 5: International and global dimension"}
PAPERS = [("الورقة 1 · الاستماع", "Listening · 50 درجة (العليا)", BLUE), ("الورقة 2 · المحادثة", "Speaking · ثلاث مهام", GREEN), ("الورقة 3 · القراءة", "Reading · 50 درجة (العليا)", ORANGE), ("الورقة 4 · الكتابة", "Writing · 60 درجة (العليا)", PURPLE)]
COLS4 = [BLUE, GREEN, ORANGE, PURPLE]
def EN(t, x, y, w, h, size=19, rv=None, align="left", **kw): return T(t, x, y, w, h, size, BLUE, True, align, rv=rv, **kw)

def _reg():
    try: return json.load(open(REG))
    except Exception: return {}

def build(C):
    reg = _reg(); code = C["code"]; th = C["theme"]
    D = Deck(code, C["foot"])
    # 1 cover
    s = D.new("🎓 GCSE العربية · ⁦1AA0⁩", "", foot=False, bg="EAF5F4"); s["els"] = s["els"][:1]
    s["els"] += [T(THEMES[th], 330, 86, 911, 44, 22, ORANGE, True), EN(THEMES_EN[th], 330, 128, 911, 34, 18),
      T(C["title"], 330, 168, 911, 100, 42 if len(C["title"]) < 34 else 34, DK, True), EN(C["title_en"], 330, 268, 911, 40, 22),
      T(f"{C.get('year', 'السنة الأولى')} · مواصفات Pearson Edexcel ‏⁦1AA0⁩", 330, 316, 911, 40, 20, TE, False),
      PIC("art/" + C.get("pic", "boybook.webp"), 48, 96, 260, 260),
      R(L, 400, W, 220, CARD, TE, lw=2), T("🎯 هدف الحصة: " + C["goal"], 60, 408, 1160, 130, 24, DK, False, va="top"), EN("🎯 " + C["goal_en"], 60, 540, 1160, 74, 17, va="top")]
    s["n"] = "عرض للناطقين بغير العربية. النصوص من إعداد حراء على نمط نصوص الامتحان. التعليمات بالعربية مع دعم بالإنجليزية."
    # 2 where
    s = D.new("🗺️ أين في المنهج والامتحان؟", "من المحور إلى أوراق الامتحان", 3, "اربط الدرس بالمحور، ثم بيّن أن مفرداته قد تظهر في الأوراق الأربع. المستوى الأعلى (Higher).")
    s["els"].append(T(f"{THEMES[th]} · {C['topic']}", L, 150, W, 56, 23, DK, True, fill="FFFFFF", rad=True))
    s["els"].append(EN(f"{THEMES_EN[th]} · {C['topic_en']}", L, 210, W, 34, 18))
    for (x, w), (h, sub, col) in zip(cols(4), PAPERS): chip(s, x, 256, w, 160, h, sub, col, rv=1)
    s["els"].append(T("اليوم نتدرّب على: " + C["skills"], L, 440, W, 120, 23, "FFFFFF", True, fill=TE, rad=True, rv=2, va="top"))
    s["els"].append(EN("Today: " + C["skills_en"], L, 574, W, 70, 19, rv=2))
    # 3 starter
    prev = [w for c2, r in sorted(reg.items()) if c2 < code and c2.startswith(code[:6]) and "-GC-" in c2 for w in r["v"]]
    if len(prev) >= 4:
        import random; pick = random.Random(code).sample(prev, 4)
        s = D.new("🔁 نتذكّر معًا", "مفردات الدروس السابقة · Recall", 3, "اكتب الكلمة العربية، ويكتب الطلاب المعنى بالإنجليزية على السبورات، ثم اكشف.")
        rows = [(f"ما معنى «{w[0]}»؟", w[2]) for w in pick]
    else:
        s = D.new("🔁 نتذكّر معًا", C["starter"][0], 3, "يجيب الطلاب على السبورات الصغيرة، ثم اكشف.")
        rows = C["starter"][1]
    for i, (q, a) in enumerate(rows):
        y = 154 + i * 122
        s["els"] += [T(f"{i+1}) {q}", 560, y, 681, 100, 24, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y, 500, 100, 22, "FFFFFF", True, "center", GREEN, True, rv=i + 1)]
    # 4 hook
    hk = C["hook"]; s = D.new("✨ لحظة فضول", hk["title"], 3, "فكّر، زاوج، شارك. اقبل الإجابة بالعربية أو بالإنجليزية، ثم أعد صياغتها بالعربية.")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 280, hk["a"][0], hk["a"][1], BLUE, 25)
    card(s, c[1][0], 160, c[1][1], 280, hk["b"][0], hk["b"][1], ORANGE, 25)
    s["els"].append(T("💬 " + hk["q"], L, 466, W, 90, 27, "FFFFFF", True, "center", TE, True, rv=1))
    s["els"].append(EN(hk["q_en"], L, 566, W, 60, 21, rv=1, align="center"))
    # 5 SC
    s = D.new("🎯 وجهتنا اليوم", "معايير النجاح · Success criteria", 2, "اقرأ المعايير بالعربية، ويقرأ طالب الترجمة الإنجليزية.")
    for i, (lv, (t, te), col) in enumerate(zip(["مبتدئ", "متطوّر", "متمكّن"], C["sc"], [BLUE, GREEN, PURPLE])):
        y = 160 + i * 160
        s["els"] += [T(lv, 1031, y, 210, 140, 28, "FFFFFF", True, "center", col, True), T(t, L, y, 975, 84, 24, DK, True, fill="FFFFFF", rad=True), EN(te, L + 12, y + 88, 950, 48, 18)]
    # 6-7 vocab
    V = C["vocab"]
    for k in range(2):
        s = D.new("🔑 كلمات مفتاحية", f"مفردات الدرس ({k+1} من 2) · Key vocabulary", 4, "انطق الكلمة، ويردّد الطلاب، ثم اكشف المعنى ثم المثال. تُكتب في دفتر المفردات.")
        for i, (w, en, ex) in enumerate(V[k * 4:k * 4 + 4]):
            y = 150 + i * 124
            s["els"] += [T(w, 891, y, 350, 110, 30, TE, True, "center", "FFFFFF", True), EN(en, 541, y, 335, 110, 23, rv=1, va="middle"),
                         T("مثال: " + ex, L, y, 488, 110, 21, DK, False, fill="FFFFFF", rad=True, rv=2)]
    reg[code] = {"t": THEMES[th], "v": [[w, "", en] for (w, en, ex) in V]}; json.dump(reg, open(REG, "w"), ensure_ascii=False, indent=0)
    # 8 structures
    s = D.new("🧱 تراكيب ترفع الدرجة", "Structures that score", 4, "هذه التراكيب يكافئها التصحيح: الأزمنة الثلاثة، والرأي المعلّل، والتراكيب المركّبة. اطلب جملة جديدة لكل تركيب.")
    for i, (st, en) in enumerate(C["structs"]):
        y = 150 + i * 100
        s["els"] += [T(st, 541, y, 700, 86, 23, "FFFFFF", True, "center", PURPLE, True), EN(en, L, y, 488, 86, 20, rv=i + 1, va="middle", fill="FFFFFF", rad=True)]
    # 9 text
    s = D.new("📖 نص الدرس", f"«{C['textTitle']}»", 5, "قراءة أولى للفكرة العامة، ثم قراءة ثانية مع الأسئلة. النص من إعداد حراء على نمط نصوص الورقة 3.")
    s["els"] += [R(L, 150, W, 500, "FFFFFF", TE, lw=2), T(C["text"], 58, 162, 1163, 478, C.get("textSize", 25), DK, False, va="top")]
    # 10 I do: answer in English
    I = C["ido"]; s = D.new("👩‍🏫 شاهدني أطبّق", "الورقة 3 · القسم أ: أجب بالإنجليزية", 4, "القسم أ في الورقة 3 إجاباته بالإنجليزية، قصيرة ودقيقة. فكّر بصوت مسموع.")
    s["els"].append(EN("Q: " + I["q"], L, 150, W, 60, 23, fill="FFFFFF", rad=True))
    for i, ((h, b), col) in enumerate(zip(I["steps"], COLS4)):
        x, w = cols(4)[i]; chip(s, x, 228, w, 150, h, b, col, rv=i + 1)
    s["els"].append(T("✅ " + I["ans"], L, 398, W, 90, 23, "FFFFFF", True, "left", GREEN, True, rv=5))
    if I.get("tip"): s["els"].append(T("💡 " + I["tip"], L, 504, W, 110, 21, DK, False, fill="FFFFFF", rad=True, rv=6))
    # 11 MCQ
    M = C["mcq"]; s = D.new("👩‍🏫 شاهدني أطبّق", "اختيار من متعدد: احذر المشتّت", 4, "فكّر بصوت مسموع: هل قاله النص؟ أم تشبه الكلمة ما في النص بمعنى آخر؟")
    s["els"].append(T(M["q"], L, 148, W, 56, 25, DK, True))
    for i, (o, why, ok) in enumerate(M["opts"]):
        y = 214 + i * 108
        s["els"] += [T(o, 600, y, 641, 96, 22, DK, ok, fill="FFFFFF", rad=True), T(why, L, y, 545, 96, 19, "FFFFFF", True, fill=GREEN if ok else RED, rad=True, rv=i + 1)]
    # 12 we do (Arabic answers)
    s = D.new("🤝 نطبّق معًا", "الورقة 3 · القسم ب: أجب بالعربية", 5, "القسم ب إجاباته بالعربية، كلمات أو جمل قصيرة من النص.")
    for i, (q, a) in enumerate(C["wedo"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 24, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 23, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 13 translation into English
    E = C["toEN"]; s = D.new("👩‍🏫 شاهدني أطبّق", "الورقة 3 · القسم ج: الترجمة إلى الإنجليزية", 5, "تُقدَّر الترجمة بمستويات على الفقرة كلها: المعنى كاملًا، والزمن الصحيح، وإنجليزية طبيعية.")
    s["els"] += [T("«" + E["ar"] + "»", L, 150, W, 70, 27, DK, True, fill="FFFFFF", rad=True),
                 T("❌ " + E["bad"], L, 236, W, 86, 21, "FFFFFF", True, "left", RED, True, rv=1),
                 T("✅ " + E["good"], L, 334, W, 86, 21, "FFFFFF", True, "left", GREEN, True, rv=2)]
    for i, ((h, b), col) in enumerate(zip(E["notes"], [BLUE, GREEN, ORANGE])):
        x, w = cols(3)[i]; chip(s, x, 440, w, 150, h, b, col, rv=3 + i)
    # 14 listening (teacher reads)
    Ls = C["listen"]; s = D.new("🎧 أستمع وأجيب", "الورقة 1: المعلم يقرأ مرتين", 6, "اقرأ النص مرتين بسرعة طبيعية (كما في الامتحان يُسمع المقطع مرتين). النص: " + Ls["script"])
    s["els"].append(T("🎧 " + Ls["intro"], L, 150, W, 60, 23, DK, True, fill="FEF3C7", rad=True))
    for i, (q, a) in enumerate(Ls["qs"]):
        y = 224 + i * 110
        s["els"] += [EN(f"{i+1}) {q}", 500, y, 741, 96, 21, fill="FFFFFF", rad=True, va="middle"), T("✅ " + a, L, y, 450, 96, 20, "FFFFFF", True, "left", GREEN, True, rv=i + 1)]
    s["els"].append(T("📜 النص: " + Ls["script"], L, 558, W, 92, 18, DK, False, fill="FFFFFF", rad=True, rv=4, va="top"))
    # 15 role play
    Rp = C["role"]; s = D.new("🗣️ لعب الأدوار", "الورقة 2 · المهمة 1: بطاقة لعب الأدوار", 6, "خمس نقاط، لكل نقطة 0–2. الرمز ! سؤال مفاجئ من المعلم، والرمز ؟ سؤال يطرحه الطالب. جملة كاملة لكل نقطة، بأسلوب رسمي.")
    s["els"].append(T("📍 " + Rp["setting"], L, 148, W, 56, 22, DK, True, fill="FEF3C7", rad=True))
    for i, (cue, model) in enumerate(Rp["bullets"]):
        y = 214 + i * 88
        s["els"] += [T(cue, 801, y, 440, 78, 20, "FFFFFF", True, "center", COLS4[i % 4] if not cue.startswith(("!", "؟")) else RED, True), T("✅ " + model, L, y, 748, 78, 20, DK, False, fill="FFFFFF", rad=True, rv=i + 1)]
    # 16 conversation
    Cv = C["conv"]; s = D.new("🗣️ المحادثة", "الورقة 2 · المهمة 3: إجابة ممتدّة", 6, "الإجابة الممتدّة: إجابة + تفصيل + سبب + مثال، مع زمنين على الأقل.")
    for i, q in enumerate(Cv["qs"]):
        x, w = cols(3)[i]; s["els"].append(T(q, x, 150, w, 80, 21, DK, True, "center", "FFFFFF", True))
    s["els"].append(T("السؤال النموذجي: " + Cv["q"], L, 246, W, 56, 22, "FFFFFF", True, fill=TE, rad=True))
    for i, ((h, t), col) in enumerate(zip(Cv["model"], COLS4)):
        y = 314 + i * 84
        s["els"] += [T(t, 260, y, 981, 76, 20, DK, False, fill="FFFFFF", rad=True, rv=i + 1), T(h, L, y, 210, 76, 20, "FFFFFF", True, "center", col, True, rv=i + 1)]
    # 17 writing model
    Wm = C["write"]; s = D.new("👩‍🏫 نموذج كتابة", Wm["title"], 7, Wm["note"])
    s["els"].append(T(Wm["task"], L, 148, W, 60, 21, DK, True, fill="FEF3C7", rad=True))
    for i, ((b, t), col) in enumerate(zip(Wm["bullets"], COLS4)):
        y = 218 + i * 106
        s["els"] += [T(t, 300, y, 941, 96, 21, DK, False, fill="FFFFFF", rad=True, rv=i + 1), T(b, L, y, 245, 96, 19, "FFFFFF", True, "center", col, True)]
    # 18 why strong
    s = D.new("🔍 لماذا هو نموذج قوي؟", "ما يكافئه التصحيح · What scores", 3, "اطلب من الطلاب أن يجدوا في النموذج مثالًا على كل بطاقة قبل كشفها.")
    for i, ((h, b), col) in enumerate(zip(Wm["why"], COLS4)):
        x, w = cols(2)[i % 2]; chip(s, x, 160 + (i // 2) * 200, w, 180, h, b, col, rv=i + 1)
    s["els"].append(T("⚠️ غطِّ النقاط الأربع كلها، والتزم بعدد الكلمات تقريبًا.", L, 570, W, 70, 22, "FFFFFF", True, "center", RED, True, rv=5))
    # 19 translation into Arabic
    A = C["toAR"]; s = D.new("👩‍🏫 أطبّق ثم تطبّق", "الورقة 4 · السؤال 3: الترجمة إلى العربية", 6, "السؤال 12 درجة، يُقدَّر بمستويات على الفقرة كلها: لا تحذف كلمة، وانتبه للزمن والمطابقة. نمذج الأولى، ويترجم الطلاب الثانية.")
    s["els"] += [EN(A[0][0], L, 150, W, 60, 24, fill="FFFFFF", rad=True), T("✅ " + A[0][1], L, 220, W, 66, 26, "FFFFFF", True, fill=GREEN, rad=True, rv=1),
                 T("💡 " + A[0][2], L, 296, W, 80, 20, DK, False, fill="FFFFFF", rad=True, rv=2),
                 T("✍️ دورك:", 1041, 400, 200, 70, 23, PURPLE, True, "center", "FFFFFF", True, rv=3), EN(A[1][0], L, 400, 990, 70, 23, rv=3, fill="FFFFFF", rad=True),
                 T("✅ " + A[1][1], L, 480, W, 66, 26, "FFFFFF", True, fill=GREEN, rad=True, rv=4), T("💡 " + A[1][2], L, 556, W, 80, 20, DK, False, fill="FFFFFF", rad=True, rv=5)]
    # 20 groups
    s = D.new("🚀 تحدّي المستويات", "مهام المجموعات (10 دقائق)", 10, "وزّع المستويات. بعد العرض: تغذية راجعة من مجموعة أخرى، ثم اكشف النموذج.")
    for i, ((task, model), (lv, col)) in enumerate(zip(C["groups"], [("مبتدئ", BLUE), ("متطوّر", GREEN), ("متمكّن", PURPLE)])):
        x, w = cols(3)[i]
        s["els"] += [T(lv, x, 150, w, 54, 26, "FFFFFF", True, "center", col, True), T(task, x, 212, w, 190, 21, DK, False, fill="FFFFFF", rad=True, va="top"),
                     T("✅ " + model, x, 412, w, 232, 20, "FFFFFF", True, fill=col, rad=True, va="top", rv=1)]
    # 21 exit
    s = D.new("🎟️ تذكرة الخروج", "ثلاثة أسئلة قبل الجرس · Exit ticket", 3, "فرديًّا، ثم اكشف الإجابات للتصحيح الذاتي.")
    for i, (q, a) in enumerate(C["exit"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 23, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 22, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 22 reflect
    s = D.new("🪞 أتأمّل وأتابع", "ماذا تعلّمت؟ وماذا بعد؟", 2, "عُد إلى «لحظة فضول»: ماذا تستطيع أن تقول الآن؟")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, "🪞 تعلّمتُ اليوم", C["learned"], TE, 22)
    card(s, c[1][0], 160, c[1][1], 300, "🏠 في البيت", "\n".join(C["home"]), ORANGE, 21)
    s["els"].append(T("الدرس القادم: " + C["next"], L, 490, W, 70, 24, "FFFFFF", True, "center", PURPLE, True))
    bad = check(D.slides)
    if bad: print("OVERLAP", code, bad)
    return D
