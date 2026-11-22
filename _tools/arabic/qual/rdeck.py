# A Level independent-research skills deck (Paper 1 Section C): modelling-first.
# Facts from the 9AA0 specification, the June 2025 Paper 1 question paper, mark scheme and examiner report.
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from qlib import *
COLS4 = [BLUE, GREEN, ORANGE, PURPLE]
SECC = [("40 درجة", "نصف درجات الورقة 1", BLUE), ("270 إلى 320 كلمة", "مقال واحد بالعربية", GREEN), ("ساعة و25 دقيقة", "الوقت المقترح للقسم", ORANGE), ("دولة عربية واحدة", "لا مقارنة بين دول", PURPLE)]
GRID = [("المعرفة بالمجتمع والثقافة", "20 درجة", "أفكار عميقة مدعومة دائمًا بمعلومات وأمثلة من الدولة التي بحثتها، وتحليل نقدي بحجج معلّلة وخلاصات مقنعة.", BLUE),
        ("فهم النص والاستجابة له", "10 درجات", "توظيف معلومات النص وأمثلته باستمرار لبناء الأفكار والحجج والخلاصات عن الدولة التي بحثتها.", GREEN),
        ("دقة اللغة وتنوّعها", "10 درجات", "تراكيب ومفردات متنوّعة ولغة مركّبة، ودقة تجعل الكتابة مترابطة واضحة.", ORANGE)]
EXR = [("✅ ما فعلته الإجابات القوية", "• دمجت معلومات النص بنتائج البحث.\n• قدّمت أفكارًا عميقة تتجاوز ما يعرفه المتحدّث العادي بالعربية عن الموضوع.\n• استعملت مفردات الموضوع بأسلوب أكاديمي.\n• راجعت كتابتها وصحّحتها.", GREEN),
       ("❌ ما أضعف الإجابات", "• الاقتصار على النص دون إضافة نتائج البحث.\n• جعل العبارة منطلقًا لتعليقات عامة لا تتجاوز المعرفة الشائعة.\n• لغة أقلّ أكاديمية، وأخطاء تُربك المعنى.\n• غياب المراجعة.", RED)]

def build(C):
    D = Deck(C["code"], C["foot"])
    # 1 cover
    s = D.new("🎓 A Level العربية · 9AA0", "", foot=False, bg="EAF5F4"); s["els"] = s["els"][:1]
    s["els"] += [T("البحث المستقل · الورقة 1 · القسم ج", 330, 92, 911, 50, 22, ORANGE, True),
      T(C["title"], 330, 150, 911, 130, 40, DK, True),
      T("السنة الأولى · مواصفات Pearson Edexcel ‏9AA0", 330, 286, 911, 44, 22, TE, False),
      PIC("art/" + C.get("pic", "lensboy.webp"), 48, 96, 260, 260),
      R(L, 400, W, 220, CARD, TE, lw=2), T("🎯 هدف الحصة: " + C["goal"], 60, 412, 1160, 196, 26, DK, False, va="top")]
    s["n"] = "درس مهارات. المواصفات: البحث مستقل؛ يوجّه المعلم توجيهًا عامًّا، ولا يعلّم محتوى البحث ولا يقدّم المصادر. الأمثلة في العرض للتدريب على المهارة فقط."
    # 2 Section C overview
    s = D.new("🗺️ أين في المنهج والامتحان؟", "القسم ج من الورقة 1: سؤال البحث", 3, "من ورقة صيف 2025: «حلّل العبارة أدناه مستعينًا بالنص وبنتائج بحثك من إحدى الدول العربية». الطالب يجيب عن سؤال واحد في موضوع بحثه.")
    for (x, w), (h, sub, col) in zip(cols(4), SECC): chip(s, x, 150, w, 150, h, sub, col, rv=1)
    s["els"].append(T("📝 في الامتحان: نص غير مقروء + عبارة ← «حلّل العبارة مستعينًا بالنص وبنتائج بحثك من إحدى الدول العربية».", L, 320, W, 86, 23, "FFFFFF", True, fill=TE, rad=True, rv=2))
    s["els"].append(T("📌 المواصفات: " + C["spec"], L, 420, W, 220, 22, DK, False, fill="FFFFFF", rad=True, va="top", rv=3))
    # 3 starter
    st = C["starter"]; s = D.new("🔁 نتذكّر معًا", st[0], 3, "يجيب الطلاب على السبورات الصغيرة، ثم اكشف كل إجابة.")
    for i, (q, a) in enumerate(st[1]):
        y = 154 + i * 122
        s["els"] += [T(f"{i+1}) {q}", 560, y, 681, 100, 23, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y, 500, 100, 21, "FFFFFF", True, "center", GREEN, True, rv=i + 1)]
    # 4 hook
    hk = C["hook"]; s = D.new("✨ لحظة فضول", hk["title"], 4, "فكّر، زاوج، شارك. نعود إلى الإجابات في نهاية الحصة.")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, hk["a"][0], hk["a"][1], BLUE, 25)
    card(s, c[1][0], 160, c[1][1], 300, hk["b"][0], hk["b"][1], ORANGE, 25)
    s["els"].append(T("💬 " + hk["q"], L, 490, W, 120, 27, "FFFFFF", True, "center", TE, True, rv=1))
    # 5 SC
    s = D.new("🎯 وجهتنا اليوم", "ناتج التعلّم ومعايير النجاح", 2, "اسأل: كيف يرفع كل معيار درجتك في القسم ج؟")
    for i, (lv, t, col) in enumerate(zip(["مبتدئ", "متطوّر", "متمكّن"], C["sc"], [BLUE, GREEN, PURPLE])):
        y = 160 + i * 160
        s["els"] += [T(lv, 1031, y, 210, 140, 28, "FFFFFF", True, "center", col, True), T(t, L, y, 975, 140, 25, DK, False, fill="FFFFFF", rad=True)]
    # 6-7 vocab
    V = C["vocab"]
    for k in range(2):
        s = D.new("🔑 كلمات مفتاحية", f"لغة البحث ({k+1} من 2): المعنى والترجمة والاستعمال", 4, "مفردات أكاديمية: تقرير الممتحنين يكافئ اللغة الأكاديمية الخاصة بالموضوع.")
        for i, (w, m, en, ex) in enumerate(V[k * 4:k * 4 + 4]):
            y = 150 + i * 124
            s["els"] += [T(w, 911, y, 330, 110, 29, TE, True, "center", "FFFFFF", True), T(m, 471, y, 425, 52, 21, DK, False, rv=1),
                         T(en, 471, y + 56, 425, 50, 21, BLUE, True, "left", rv=1), T("مثال: " + ex, L, y, 418, 110, 19, DK, False, fill="FFFFFF", rad=True, rv=2)]
    # 8 method
    s = D.new("🧭 خطوات المهارة", C["stepsTitle"], 4, "اعرض الخطوات الأربع، ثم انتقل إلى النمذجة.")
    for i, ((h, b), col) in enumerate(zip(C["steps"], COLS4)):
        x, w = cols(2)[i % 2]; card(s, x, 150 + (i // 2) * 220, w, 200, h, b, col, 22, rv=i + 1, hsize=25)
    s["els"].append(T("💡 " + C["stepsNote"], L, 600, W, 56, 21, "FFFFFF", True, "center", TE, True, rv=5))
    # 9-10 I do (worked examples)
    for key in ("ido1", "ido2"):
        I = C[key]; s = D.new("👩‍🏫 شاهدني أطبّق", I["title"], 6, I.get("note", "فكّر بصوت مسموع، واكشف كل سطر بعد أن يتوقّع الطلاب."))
        y0 = 150
        if I.get("intro"):
            s["els"].append(T(I["intro"], L, 150, W, I.get("ih", 70), I.get("isize", 22), DK, True, fill="FFFFFF", rad=True, va="top")); y0 = 150 + I.get("ih", 70) + 12
        rows = I["rows"]; rh = int((650 - y0) / len(rows)) - 10
        for i, (h, t) in enumerate(rows):
            y = y0 + i * (rh + 10); col = I.get("cols", COLS4 * 2)[i]
            s["els"] += [T(t, 300, y, 941, rh, I.get("size", 21), DK, False, fill="FFFFFF", rad=True, rv=i + 1), T(h, L, y, 245, rh, 21, "FFFFFF", True, "center", col, True, rv=i + 1)]
    # 11 MCQ
    M = C["mcq"]; s = D.new("👩‍🏫 شاهدني أطبّق", M["title"], 4, "اطلب التصويت بالأصابع قبل كشف التعليل.")
    s["els"].append(T(M["q"], L, 148, W, 56, 25, DK, True))
    for i, (o, why, ok) in enumerate(M["opts"]):
        y = 214 + i * 108
        s["els"] += [T(o, 600, y, 641, 96, 21, DK, ok, fill="FFFFFF", rad=True), T(why, L, y, 545, 96, 19, "FFFFFF", True, fill=GREEN if ok else RED, rad=True, rv=i + 1)]
    # 12 we do
    s = D.new("🤝 نطبّق معًا", C["wedoTitle"], 6, "الأزواج يجيبون على السبورات، ثم اكشف الإجابة لكل بند.")
    for i, (q, a) in enumerate(C["wedo"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 22, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 21, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 13 you do
    Y = C["youdo"]; s = D.new("✍️ أطبّق بنفسي", Y["title"], 10, "فرديًّا على بحثك أنت. تجوّل واسأل أسئلة توجيه عامة، ولا تقترح محتوى أو مصادر.")
    s["els"].append(T(Y["task"], L, 150, W, 150, 23, DK, False, fill="FFFFFF", rad=True, va="top"))
    card(s, L, 318, W, 330, "☑️ أتحقّق قبل التسليم", "\n".join("☐ " + x for x in Y["check"]), GREEN, 22, rv=1)
    # 14 grid
    s = D.new("📏 كيف يُصحَّح القسم ج؟", "ثلاثة معايير: 40 درجة", 4, "من معيار التصحيح (صيف 2025). أكبر المعايير: المعرفة بالمجتمع والثقافة (20)، وهي ثمرة البحث.")
    for i, ((h, m, b, col)) in enumerate(GRID):
        x, w = cols(3)[i]
        s["els"] += [T(h, x, 150, w, 70, 23, "FFFFFF", True, "center", col, True), T(m, x, 228, w, 56, 26, col, True, "center", "FFFFFF", True, rv=1),
                     T("أعلى مستوى: " + b, x, 294, w, 230, 20, DK, False, fill="FFFFFF", rad=True, va="top", rv=2)]
    s["els"].append(T("🔗 " + C["gridLink"], L, 540, W, 100, 22, "FFFFFF", True, "center", TE, True, rv=3))
    # 15 examiner report
    s = D.new("⚠️ من تقرير الممتحنين", "القسم ج في امتحان صيف 2025", 4, "من تقرير الممتحنين للورقة 1 (9AA0، 2025). اسأل: أيّ نقطة تعالجها مهارة اليوم؟")
    c = cols(2)
    for k in range(2): card(s, c[k][0], 150, c[k][1], 400, EXR[k][0], EXR[k][1], EXR[k][2], 21, rv=k + 1, hsize=25)
    s["els"].append(T("🎯 مهارة اليوم تعالج: " + C["exLink"], L, 570, W, 76, 22, "FFFFFF", True, "center", PURPLE, True, rv=3))
    # 16 exam statement
    X = C["exam"]; s = D.new("📝 من عبارة الامتحان إلى بحثك", X["title"], 6, "العبارة حقيقية من ورقة صيف 2025. " + X.get("note", ""))
    s["els"].append(T("«" + X["statement"] + "»", L, 148, W, 62, 25, DK, True, "center", "FEF3C7", True))
    s["els"].append(T(X["q"], L, 218, W, 64, 21, DK, True, fill="FFFFFF", rad=True))
    for i, (h, t) in enumerate(X["rows"]):
        y = 292 + i * 90
        s["els"] += [T(t, 300, y, 941, 82, 20, DK, False, fill="FFFFFF", rad=True, rv=i + 1), T(h, L, y, 245, 82, 21, "FFFFFF", True, "center", COLS4[i], True, rv=i + 1)]
    # 17 groups
    s = D.new("🚀 تحدّي المستويات", "مهام المجموعات (10 دقائق)", 10, "وزّع المستويات، ثم تعرض كل مجموعة ناتجها، واكشف النموذج.")
    for i, ((task, model), (lv, col)) in enumerate(zip(C["groups"], [("مبتدئ", BLUE), ("متطوّر", GREEN), ("متمكّن", PURPLE)])):
        x, w = cols(3)[i]
        s["els"] += [T(lv, x, 150, w, 54, 26, "FFFFFF", True, "center", col, True), T(task, x, 212, w, 180, 21, DK, False, fill="FFFFFF", rad=True, va="top"),
                     T("✅ " + model, x, 402, w, 240, 19, "FFFFFF", True, fill=col, rad=True, va="top", rv=1)]
    # 18 exit
    s = D.new("🎟️ تذكرة الخروج", "ثلاثة أسئلة قبل الجرس", 3, "فرديًّا، ثم اكشف الإجابات للتصحيح الذاتي.")
    for i, (q, a) in enumerate(C["exit"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 23, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 21, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 19 reflect
    s = D.new("🪞 أتأمّل وأتابع", "ماذا تعلّمت؟ وماذا بعد؟", 2, "عُد إلى إجابات «لحظة فضول».")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, "🪞 تعلّمتُ اليوم", C["learned"], TE, 22)
    card(s, c[1][0], 160, c[1][1], 300, "🏠 في البيت", "\n".join(C["home"]), ORANGE, 21)
    s["els"].append(T("الدرس القادم: " + C["next"], L, 490, W, 70, 24, "FFFFFF", True, "center", PURPLE, True))
    bad = check(D.slides)
    if bad: print("OVERLAP", C["code"], bad)
    return D
