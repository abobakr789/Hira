# A Level works deck (Paper 2 Sections B/C): modelling-first analytical essay skills.
# Facts: 9AA0 specification; June 2024/2025 Paper 2 mark schemes (questions + indicative content) and examiner reports.
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from qlib import *
COLS4 = [BLUE, GREEN, ORANGE, PURPLE]
GRID2 = [("التحليل النقدي", "20 درجة", "تفسيرات مقنعة للقضايا والموضوعات والسياقات، وحجج مفصّلة منطقية مترابطة، واستجابة للسؤال طوال المقال.", BLUE),
         ("تنوّع التراكيب والمفردات", "15 درجة", "تراكيب متنوّعة ولغة مركّبة، ومفردات متنوّعة، ومصطلحات التحليل الأدبي والسينمائي باستمرار.", GREEN),
         ("دقة اللغة", "10 درجات", "لغة دقيقة طوال المقال تجعل الكتابة مترابطة، والأخطاء لا تُربك الوضوح.", ORANGE)]
EXR2 = [("✅ ما فعلته المقالات القوية", "• حلّلت ولم تسرد الأحداث.\n• أجابت عن السؤال المحدّد كله.\n• استشهدت بمشاهد أو حوار محدّد.\n• استعملت مصطلحات التحليل: الموضوع، الرمز، تطوّر الشخصية.\n• تناولت الشخصيات الثانوية والرموز من زوايا متعدّدة.", GREEN),
        ("❌ ما أضعف المقالات", "• تلخيص الأحداث بدل تحليلها.\n• الخروج عن السؤال أو الاقتصار على جزء منه.\n• أدلة عامة غير محدّدة.\n• العامية بدل الفصحى.\n• الخلط بين كلمات متشابهة، مثل «الغُربة» و«الغَرب».", RED)]

def build(C):
    D = Deck(C["code"], C["foot"]); film = C["kind"] == "فيلم"
    sec = "الورقة 2 · القسم ج: الأفلام" if film else "الورقة 2 · القسم ب: الأعمال الأدبية"
    # 1 cover
    s = D.new("🎓 A Level العربية · 9AA0", "", foot=False, bg="EAF5F4"); s["els"] = s["els"][:1]
    s["els"] += [T(f"{sec} · {C['kind']} «{C['work']}» · {C['author']} ({C['year']})", 330, 92, 911, 50, 21, ORANGE, True),
      T(C["title"], 330, 150, 911, 130, 40 if len(C["title"]) < 44 else 34, DK, True),
      T(f"{C.get('yr', 'السنة الأولى')} · مواصفات Pearson Edexcel ‏9AA0", 330, 286, 911, 44, 22, TE, False),
      PIC("art/" + C.get("pic", "girlbook.webp"), 48, 96, 260, 260),
      R(L, 400, W, 220, CARD, TE, lw=2), T("🎯 هدف الحصة: " + C["goal"], 60, 412, 1160, 196, 26, DK, False, va="top")]
    s["n"] = C.get("srcNote", "")
    # 2 where
    s = D.new("🗺️ أين في المنهج والامتحان؟", "مقال نقدي عن " + ("فيلم" if film else "عمل أدبي"), 3, "من المواصفات ومعيار تصحيح 2025: لكل عمل سؤالان (أ) و(ب) يختار الطالب أحدهما، والمقال يُصحَّح كاملًا مهما طال.")
    for (x, w), (h, sub, col) in zip(cols(4), [("45 درجة", "لكل مقال", BLUE), ("270 إلى 320 كلمة", "العدد المقترح للمقال", GREEN), ("سؤالان لكل عمل", "تختار (أ) أو (ب)", ORANGE), ("بالعربية الفصحى", "لا عامية", PURPLE)]):
        chip(s, x, 150, w, 150, h, sub, col, rv=1)
    s["els"].append(T(f"📌 الورقة 2 (110 درجات): القسم أ ترجمة إلى العربية (20)، والقسم ب الأعمال الأدبية (45)، والقسم ج الأفلام (45). «{C['work']}» من القسم {'ج' if film else 'ب'}.", L, 320, W, 100, 23, "FFFFFF", True, fill=TE, rad=True, rv=2))
    s["els"].append(T("🎯 تركيز اليوم: " + C["focus"], L, 436, W, 200, 23, DK, False, fill="FFFFFF", rad=True, va="top", rv=3))
    # 3 starter
    st = C["starter"]; s = D.new("🔁 نتذكّر معًا", st[0], 3, "يجيب الطلاب على السبورات الصغيرة، ثم اكشف كل إجابة.")
    for i, (q, a) in enumerate(st[1]):
        y = 154 + i * 122
        s["els"] += [T(f"{i+1}) {q}", 560, y, 681, 100, 22, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y, 500, 100, 20, "FFFFFF", True, "center", GREEN, True, rv=i + 1)]
    # 4 hook
    hk = C["hook"]; s = D.new("✨ لحظة فضول", hk["title"], 4, hk.get("note", "فكّر، زاوج، شارك. نعود إلى الإجابات في نهاية الحصة."))
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, hk["a"][0], hk["a"][1], BLUE, 24)
    card(s, c[1][0], 160, c[1][1], 300, hk["b"][0], hk["b"][1], ORANGE, 24)
    s["els"].append(T("💬 " + hk["q"], L, 490, W, 120, 26, "FFFFFF", True, "center", TE, True, rv=1))
    # 5 SC
    s = D.new("🎯 وجهتنا اليوم", "ناتج التعلّم ومعايير النجاح", 2, "اسأل: أيّ معيار يرفع درجة «التحليل النقدي»؟")
    for i, (lv, t, col) in enumerate(zip(["مبتدئ", "متطوّر", "متمكّن"], C["sc"], [BLUE, GREEN, PURPLE])):
        y = 160 + i * 160
        s["els"] += [T(lv, 1031, y, 210, 140, 28, "FFFFFF", True, "center", col, True), T(t, L, y, 975, 140, 24, DK, False, fill="FFFFFF", rad=True)]
    # 6-7 vocab
    V = C["vocab"]
    for k in range(2):
        s = D.new("🔑 كلمات مفتاحية", f"لغة التحليل ({k+1} من 2): المعنى والترجمة والاستعمال", 4, "تقرير الممتحنين: المقالات القوية استعملت مصطلحات التحليل الأدبي والسينمائي بدقة.")
        for i, (w, m, en, ex) in enumerate(V[k * 4:k * 4 + 4]):
            y = 150 + i * 124
            s["els"] += [T(w, 911, y, 330, 110, 28, TE, True, "center", "FFFFFF", True), T(m, 471, y, 425, 52, 21, DK, False, rv=1),
                         T(en, 471, y + 56, 425, 50, 21, BLUE, True, "left", rv=1), T("مثال: " + ex, L, y, 418, 110, 19, DK, False, fill="FFFFFF", rad=True, rv=2)]
    # 8-9 content cards
    for key in ("A", "B"):
        A = C[key]; s = D.new(A.get("stage", "📚 نتعرّف العمل"), A["title"], A.get("mins", 6), A.get("note", "اكشف البطاقات واحدة واحدة، واسأل بعد كل بطاقة: ما الدليل على ذلك في العمل؟"))
        n = len(A["cards"]); rows = (n + 1) // 2; hh = int((500 - (rows - 1) * 18) / rows)
        for i, (h, b) in enumerate(A["cards"]):
            x, w = cols(2)[i % 2]; card(s, x, 150 + (i // 2) * (hh + 18), w, hh, h, b, COLS4[i % 4], A.get("size", 21), rv=i + 1, hsize=23)
    # 10 evidence
    E = C["ev"]; s = D.new("🔍 من " + ("الفيلم" if film else "النص"), E["title"], 7, E.get("note", "اقرأ الدليل أولًا، واطلب من الطلاب تفسيره قبل كشف التحليل."))
    for i, (h, t) in enumerate(E["rows"]):
        y = 150 + i * 126
        s["els"] += [T(h, 640, y, 601, 112, E.get("hs", 21), DK, True, fill="FFFFFF", rad=True), T(t, L, y, 590, 112, 20, "FFFFFF", True, fill=COLS4[i], rad=True, rv=i + 1)]
    # 11 I do: analytical paragraph (PEEL)
    I = C["ido"]; s = D.new("👩‍🏫 شاهدني أطبّق", "فقرة تحليلية: نقطة ← دليل ← تحليل ← ربط", 7, "اكشف الفقرة جزءًا جزءًا، واسأل عن وظيفة كل جزء. السؤال من امتحان حقيقي (" + I["src"] + ").")
    s["els"].append(T("السؤال: " + I["q"], L, 146, W, 50, 22, DK, True, fill="FEF3C7", rad=True))
    if I.get("en"): s["els"].append(T(I["en"], L, 200, W, 36, 18 if len(I["en"]) < 100 else 15, BLUE, True, "left"))
    for i, (h, t) in enumerate(zip(["النقطة", "الدليل", "التحليل", "الربط"], I["parts"])):
        y = 244 + i * 102
        s["els"] += [T(t, 300, y, 941, 92, 20, DK, False, fill="FFFFFF", rad=True, rv=i + 1), T(h, L, y, 245, 92, 23, "FFFFFF", True, "center", COLS4[i], True, rv=i + 1)]
    # 12 MCQ analysis vs narration
    M = C["mcq"]; s = D.new("👩‍🏫 شاهدني أطبّق", M.get("title", "تحليل أم سرد؟"), 4, "تقرير الممتحنين: سرد الأحداث أكثر ما يُفقد الدرجات. اطلب التصويت قبل كشف التعليل.")
    s["els"].append(T(M["q"], L, 148, W, 56, 24, DK, True))
    for i, (o, why, ok) in enumerate(M["opts"]):
        y = 214 + i * 108
        s["els"] += [T(o, 600, y, 641, 96, 20, DK, ok, fill="FFFFFF", rad=True), T(why, L, y, 545, 96, 19, "FFFFFF", True, fill=GREEN if ok else RED, rad=True, rv=i + 1)]
    # 13 we do
    s = D.new("🤝 نطبّق معًا", C.get("wedoTitle", "أسئلة تحليلية قصيرة"), 6, "الأزواج يجيبون على السبورات، ثم اكشف الإجابة النموذجية لكل سؤال.")
    for i, (q, a) in enumerate(C["wedo"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 22, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 74, 20, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 14 you do
    Y = C["youdo"]; s = D.new("✍️ أطبّق بنفسي", "أكتب فقرة تحليلية", 10, "فرديًّا. ثم تبادل الفقرات وصحّحها بقائمة التحقّق.")
    s["els"].append(T("السؤال: " + Y["q"], L, 150, W, 100, 23, DK, True, fill="FEF3C7", rad=True))
    card(s, L, 268, W, 380, "☑️ أتحقّق من فقرتي", "\n".join("☐ " + x for x in Y["check"] + ["لا أسرد الأحداث: كل جملة سرد تتبعها جملة تحليل", "فصحى، ومصطلح تحليلي واحد على الأقل"]), GREEN, 22, rv=1)
    # 15 grid
    s = D.new("📏 كيف يُصحَّح المقال؟", "ثلاثة معايير: 45 درجة", 4, "من معيار تصحيح الورقة 2 (صيف 2025): أعلى مستوى في كل معيار.")
    for i, (h, m, b, col) in enumerate(GRID2):
        x, w = cols(3)[i]
        s["els"] += [T(h, x, 150, w, 70, 23, "FFFFFF", True, "center", col, True), T(m, x, 228, w, 56, 26, col, True, "center", "FFFFFF", True, rv=1),
                     T("أعلى مستوى: " + b, x, 294, w, 240, 20, DK, False, fill="FFFFFF", rad=True, va="top", rv=2)]
    s["els"].append(T("🔗 " + C["gridLink"], L, 552, W, 92, 22, "FFFFFF", True, "center", TE, True, rv=3))
    # 16 examiner report
    s = D.new("⚠️ من تقارير الممتحنين", "الورقة 2: صيف 2024 و2025", 4, "من تقريري الممتحنين للورقة 2 (9AA0). " + C.get("exNote", ""))
    c = cols(2)
    for k in range(2): card(s, c[k][0], 150, c[k][1], 420, EXR2[k][0], EXR2[k][1], EXR2[k][2], 20, rv=k + 1, hsize=24)
    s["els"].append(T("🎯 " + C["exLink"], L, 586, W, 64, 21, "FFFFFF", True, "center", PURPLE, True, rv=3))
    # 17 past question plan
    X = C["exam"]; s = D.new("📝 سؤال امتحان حقيقي", "خطة مقال: " + X["src"], 7, "السؤال من معيار تصحيح " + X["src"] + "؛ الصياغة العربية ترجمة حراء. خطّط مع الطلاب قبل كشف الخطة، ونقاط الخطة من المحتوى الإرشادي في معيار التصحيح.")
    s["els"].append(T(X["en"], L, 146, W, 46, 20 if len(X["en"]) < 100 else 16, BLUE, True, "left", "FFFFFF", True))
    s["els"].append(T("«" + X["ar"] + "»", L, 198, W, 52, 22, DK, True, "center", "FEF3C7", True))
    for i, (h, t) in enumerate(X["rows"]):
        y = 258 + i * 80
        s["els"] += [T(t, 300, y, 941, 74, 19, DK, False, fill="FFFFFF", rad=True, rv=i + 1), T(h, L, y, 245, 74, 21, "FFFFFF", True, "center", (COLS4 + [TE])[i], True, rv=i + 1)]
    # 18 groups
    s = D.new("🚀 تحدّي المستويات", "مهام المجموعات (10 دقائق)", 10, "وزّع المستويات، ثم تعرض كل مجموعة ناتجها، واكشف النموذج.")
    for i, ((task, model), (lv, col)) in enumerate(zip(C["groups"], [("مبتدئ", BLUE), ("متطوّر", GREEN), ("متمكّن", PURPLE)])):
        x, w = cols(3)[i]
        s["els"] += [T(lv, x, 150, w, 54, 26, "FFFFFF", True, "center", col, True), T(task, x, 212, w, 190, 20, DK, False, fill="FFFFFF", rad=True, va="top"),
                     T("✅ " + model, x, 412, w, 232, 19, "FFFFFF", True, fill=col, rad=True, va="top", rv=1)]
    # 19 exit
    s = D.new("🎟️ تذكرة الخروج", "ثلاثة أسئلة قبل الجرس", 3, "فرديًّا، ثم اكشف الإجابات للتصحيح الذاتي.")
    for i, (q, a) in enumerate(C["exit"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 22, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 20, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 20 reflect
    s = D.new("🪞 أتأمّل وأتابع", "ماذا تعلّمت؟ وماذا بعد؟", 2, "عُد إلى إجابات «لحظة فضول».")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, "🪞 تعلّمتُ اليوم", C["learned"], TE, 22)
    card(s, c[1][0], 160, c[1][1], 300, "🏠 في البيت", "\n".join(C["home"]), ORANGE, 21)
    s["els"].append(T("الدرس القادم: " + C["next"], L, 490, W, 70, 24, "FFFFFF", True, "center", PURPLE, True))
    bad = check(D.slides)
    if bad: print("OVERLAP", C["code"], bad)
    return D
