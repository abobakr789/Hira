# A Level theme-lesson deck: curriculum-linked, modelling-first (I do → we do → you do).
import sys, os, json; sys.path.insert(0, os.path.dirname(__file__))
from qlib import *
REG = os.path.join(os.path.dirname(__file__), "vocab_reg.json")
def _reg():
    try: return json.load(open(REG))
    except Exception: return {}

PAPERS_AL = [("الورقة 1 · أ", "ترجمة إلى الإنجليزية\n(20 درجة)", BLUE), ("الورقة 1 · ب", "قراءة وفهم بالعربية\n(20 درجة)", GREEN), ("الورقة 2 · أ", "ترجمة إلى العربية\n(20 درجة)", ORANGE), ("الورقة 3", "استماع، وقراءة وكتابة\n(30 + 30)", PURPLE)]
MIST_AL = [("الترجمة الحرفية", "إنجليزية غير طبيعية لا يفهمها قارئ إنجليزي.", RED), ("المشتّتات", "خيار يعيد كلمات من النص بمعنى مختلف.", ORANGE), ("أول إجابة فقط", "في سؤال الدرجة الواحدة تُصحَّح الإجابة الأولى.", BLUE), ("النسخ العشوائي", "نسخ جمل طويلة من النص لا يُكافأ.", PURPLE)]

def build(C):
    reg = _reg(); code = C["code"]
    D = Deck(code, C["foot"])
    # 1 cover
    s = D.new("🎓 A Level العربية · 9AA0", "", foot=False, bg="EAF5F4"); s["els"] = s["els"][:1]
    s["els"] += [T(f"{C['theme']} · المحور الفرعي: {C['sub']}", 330, 92, 911, 50, 22, ORANGE, True),
      T(C["title"], 330, 150, 911, 130, 44 if len(C["title"]) < 48 else 38, DK, True),
      T(f"{C.get('year', 'السنة الأولى')} · مواصفات Pearson Edexcel ‏9AA0", 330, 286, 911, 44, 22, TE, False),
      PIC("art/" + C.get("pic", "teacher.webp"), 48, 96, 260, 260),
      R(L, 400, W, 220, CARD, TE, lw=2), T("🎯 هدف الحصة: " + C["goal"], 60, 412, 1160, 196, 26, DK, False, va="top")]
    s["n"] = f"لا يوجد كتاب مدرسي مقرّر لـA Level؛ النص في هذا العرض من إعداد حراء على نمط نصوص الامتحان. موقع الدرس في المواصفات: {C['sub']}."
    # 2 where
    s = D.new("🗺️ أين في المنهج والامتحان؟", "من المواصفات إلى ورقة الامتحان", 3, "اقرأ بند المواصفات، ثم بيّن أن نصوص الأوراق تأتي من المحاور الأربعة، فمفردات الدرس قد تظهر في أيّ ورقة.")
    s["els"].append(T("المواصفات: «" + C["spec"] + "»", L, 150, W, 70, 22 if len(C["spec"]) < 105 else 18, DK, True, fill="FFFFFF", rad=True))
    for (x, w), (h, sub, col) in zip(cols(4), PAPERS_AL): chip(s, x, 240, w, 170, h, sub, col, rv=1)
    s["els"].append(T("📌 كل نصوص الامتحان «مأخوذة من المحاور الأربعة»؛ فمفردات اليوم وتراكيبه قد تظهر في أي ورقة من الثلاث.", L, 432, W, 86, 23, "FFFFFF", True, fill=TE, rad=True, rv=2))
    s["els"].append(T("اليوم نتدرّب على: " + C["skills"], L, 532, W, 110, 22, DK, False, fill="FFFFFF", rad=True, rv=3))
    # 3 starter: cumulative theme vocabulary, else given questions
    prev = [w for c2, r in sorted(reg.items()) if c2 < code and r["t"] == C["theme"] for w in r["v"]]
    ttl = "مفردات المحور حتى الآن"
    if len(prev) < 4 and "starter" not in C: prev = [w for c2, r in sorted(reg.items()) if c2 < code for w in r["v"]]; ttl = "مفردات المحاور السابقة"
    if len(prev) >= 4:
        import random; rnd = random.Random(code); pick = rnd.sample(prev, 4)
        s = D.new("🔁 نتذكّر معًا", ttl, 3, "مراجعة تراكمية لمفردات الدروس السابقة في المحور: يكتب الطلاب المعنى والترجمة على السبورات، ثم اكشف.")
        rows = [(f"ما معنى «{w[0]}»؟ وما ترجمتها؟", f"{w[1]} · {w[2]}") for w in pick]
    else:
        s = D.new("🔁 نتذكّر معًا", C["starter"][0], 3, "يجيب الطلاب على السبورات الصغيرة، ثم اكشف كل إجابة.")
        rows = C["starter"][1]
    for i, (q, a) in enumerate(rows):
        y = 154 + i * 122
        s["els"] += [T(f"{i+1}) {q}", 560, y, 681, 100, 23, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y, 500, 100, 22, "FFFFFF", True, "center", GREEN, True, rv=i + 1)]
    # 4 hook
    hk = C["hook"]; s = D.new("✨ لحظة فضول", hk["title"], 4, "فكّر، زاوج، شارك: دقيقة صمت، ثم أزواج، ثم ثلاث إجابات. لا تصحّح الآن؛ نعود إليها بعد النص.")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, hk["a"][0], hk["a"][1], BLUE, 25)
    card(s, c[1][0], 160, c[1][1], 300, hk["b"][0], hk["b"][1], ORANGE, 25)
    s["els"].append(T("💬 " + hk["q"], L, 490, W, 120, 27, "FFFFFF", True, "center", TE, True, rv=1))
    # 5 SC
    s = D.new("🎯 وجهتنا اليوم", "ناتج التعلّم ومعايير النجاح", 2, "اسأل: أيّ معيار يرتبط بأيّ ورقة؟")
    for i, (lv, t, col) in enumerate(zip(["مبتدئ", "متطوّر", "متمكّن"], C["sc"], [BLUE, GREEN, PURPLE])):
        y = 160 + i * 160
        s["els"] += [T(lv, 1031, y, 210, 140, 28, "FFFFFF", True, "center", col, True), T(t, L, y, 975, 140, 25, DK, False, fill="FFFFFF", rad=True)]
    # 6-7 vocab
    V = C["vocab"]
    for k in range(2):
        s = D.new("🔑 كلمات مفتاحية", f"مفردات المحور ({k+1} من 2): المعنى والترجمة والاستعمال", 4, "اكشف المعنى ثم الترجمة ثم المثال، واطلب جملة جديدة لكل كلمة. تُضاف الكلمات إلى صفحة المحور في الدفتر.")
        for i, (w, m, en, ex) in enumerate(V[k * 4:k * 4 + 4]):
            y = 150 + i * 124
            s["els"] += [T(w, 911, y, 330, 110, 29, TE, True, "center", "FFFFFF", True), T(m, 471, y, 425, 52, 21, DK, False, rv=1),
                         T(en, 471, y + 56, 425, 50, 21, BLUE, True, "left", rv=1), T("مثال: " + ex, L, y, 418, 110, 19, DK, False, fill="FFFFFF", rad=True, rv=2)]
    reg[code] = {"t": C["theme"], "v": [[w, m, en] for (w, m, en, ex) in V]}; json.dump(reg, open(REG, "w"), ensure_ascii=False, indent=0)
    # 8 structures
    s = D.new("🧱 " + C.get("structTitle", "تراكيب الرأي والموازنة"), "لغة تُكافأ في الكتابة والتقييم", 4, "هذه التراكيب ترفع درجة مدى اللغة. اطلب من كل زوج جملة جديدة بتركيبين عن موضوع الدرس.")
    for i, (st, ex) in enumerate(C["structs"]):
        y = 150 + i * 100
        s["els"] += [T(st, 851, y, 390, 86, 23, "FFFFFF", True, "center", PURPLE, True), T(ex, L, y, 795, 86, 21, DK, False, fill="FFFFFF", rad=True, rv=i + 1)]
    # 9-10 text
    P = C["paras"]
    for k in range(2):
        s = D.new("📖 نص الدرس", f"«{C['textTitle']}» ({k+1} من 2)", 5 if k == 0 else 4, "القراءة الأولى للفكرة العامة، ثم قراءة ثانية مع الأسئلة. النص من إعداد حراء على نمط نصوص الورقة 1.")
        s["els"] += [R(L, 150, W, 500, "FFFFFF", TE, lw=2), T(P[2 * k] + "\n\n" + P[2 * k + 1], 58, 162, 1163, 478, C.get("textSize", 25), DK, False, va="top")]
    # 11 I do short answer
    I = C["ido"]; s = D.new("👩‍🏫 شاهدني أطبّق", "سؤال فهم بإجابة قصيرة (الورقة 1 · ب)", 5, "فكّر بصوت مسموع خطوة خطوة، ثم اكشف الإجابة. الإجابة بالعربية، موجزة، وبعدد ما يطلبه السؤال.")
    s["els"].append(T("السؤال: " + I["q"], L, 150, W, 64, 24, DK, True, fill="FFFFFF", rad=True))
    for i, ((h, b), col) in enumerate(zip(I["steps"], [BLUE, GREEN, ORANGE, PURPLE])):
        x, w = cols(4)[i]; chip(s, x, 232, w, 150, h, b, col, rv=i + 1)
    answer(s, I["ans"], 400, 110, rv=5, size=23)
    if I.get("tip"): s["els"].append(T("💡 " + I["tip"], L, 524, W, 110, 21, DK, False, fill="FFFFFF", rad=True, rv=6))
    # 12 MCQ
    M = C["mcq"]; s = D.new("👩‍🏫 شاهدني أطبّق", "الاختيار من متعدد: احذر المشتّت", 5, "فكّر بصوت مسموع: هل قاله النص؟ أم أعاد كلمات النص بمعنى آخر؟ (ملاحظات الممتحنين: المشتّتات تعيد كلمات من النص).")
    s["els"].append(T(M["q"], L, 148, W, 56, 25, DK, True))
    for i, (o, why, ok) in enumerate(M["opts"]):
        y = 214 + i * 108
        s["els"] += [T(o, 600, y, 641, 96, 21, DK, ok, fill="FFFFFF", rad=True), T(why, L, y, 545, 96, 19, "FFFFFF", True, fill=GREEN if ok else RED, rad=True, rv=i + 1)]
    # 13 we do
    s = D.new("🤝 نطبّق معًا", "ثلاثة أسئلة بإجابات قصيرة", 6, "الأزواج يجيبون على السبورات، ثم اكشف الإجابة النموذجية لكل سؤال وقارن.")
    for i, (q, a) in enumerate(C["wedo"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 24, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 22, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 14 I do EN translation
    E = C["toEN"]; s = D.new("👩‍🏫 شاهدني أطبّق", "الترجمة إلى الإنجليزية (الورقة 1 · أ)", 5, "المعيار: ترجمة يفهمها قارئ إنجليزي لا يعرف العربية. اكشف الحرفية أولًا، وناقش ضعفها، ثم الطبيعية.")
    s["els"] += [T("«" + E["ar"] + "»", L, 150, W, 70, 26, DK, True, fill="FFFFFF", rad=True),
                 T("❌ " + E["bad"], L, 236, W, 92, 21, "FFFFFF", True, "left", RED, True, rv=1),
                 T("✅ " + E["good"], L, 340, W, 92, 21, "FFFFFF", True, "left", GREEN, True, rv=2)]
    for i, ((h, b), col) in enumerate(zip(E["notes"], [BLUE, GREEN, ORANGE])):
        x, w = cols(3)[i]; chip(s, x, 450, w, 140, h, b, col, rv=3 + i)
    # 15 you do EN
    s = D.new("✍️ أطبّق بنفسي", "ترجم إلى الإنجليزية ترجمة طبيعية", 5, "فرديًّا في الدفتر، ثم اكشف الترجمة النموذجية. تُقبل صياغات أخرى صحيحة طبيعية.")
    for i, (ar, en) in enumerate(C["youEN"]):
        y = 150 + i * 165
        s["els"] += [T(f"{i+1}) «{ar}»", L, y, W, 66, 23, DK, True, fill="FFFFFF", rad=True), T("✅ " + en, L, y + 74, W, 70, 22, "FFFFFF", True, "left", GREEN, True, rv=i + 1)]
    # 16 to Arabic
    A = C["toAR"]; s = D.new("👩‍🏫 أطبّق ثم تطبّق", "الترجمة إلى العربية (الورقة 2 · أ)", 6, "معيار الورقة 2: الحركات غير مطلوبة، لكن نهايات الأفعال والصفات يجب أن تكون صحيحة. نمذج الجملة الأولى، ثم يترجم الطلاب الثانية.")
    s["els"] += [T(A[0][0], L, 150, W, 60, 24, BLUE, True, "left", "FFFFFF", True), T("✅ " + A[0][1], L, 220, W, 66, 25, "FFFFFF", True, fill=GREEN, rad=True, rv=1),
                 T("💡 " + A[0][2], L, 296, W, 80, 20, DK, False, fill="FFFFFF", rad=True, rv=2),
                 T("✍️ دورك:", 1041, 400, 200, 70, 23, PURPLE, True, "center", "FFFFFF", True, rv=3), T(A[1][0], L, 400, 990, 70, 23, BLUE, True, "left", "FFFFFF", True, rv=3),
                 T("✅ " + A[1][1], L, 480, W, 66, 25, "FFFFFF", True, fill=GREEN, rad=True, rv=4), T("💡 " + A[1][2], L, 556, W, 80, 20, DK, False, fill="FFFFFF", rad=True, rv=5)]
    # 17 writing model
    Wm = C["write"]; s = D.new("👩‍🏫 نموذج: " + Wm.get("kind", "تقييم رأيين"), Wm["task"], 7, "على نمط الورقة 3 · س5: اكشف الفقرة جملة جملة، واسأل عن وظيفة كل جملة قبل كشف وصفها.")
    for i, (h, t) in enumerate(Wm["parts"]):
        y = 150 + i * 126
        s["els"] += [T(t, 300, y, 941, 112, 21, DK, False, fill="FFFFFF", rad=True, rv=2 * i + 1), T(h, L, y, 245, 112, 21, "FFFFFF", True, "center", [BLUE, GREEN, ORANGE, PURPLE][i], True, rv=2 * i + 2)]
    # 18 why strong
    s = D.new("🔍 لماذا هو نموذج قوي؟", "ما يكافئه التصحيح في الفقرة", 3, "اطلب من الطلاب أن يجدوا في الفقرة مثالًا على كل بطاقة قبل كشفها.")
    for i, ((h, b), col) in enumerate(zip(Wm["why"], [BLUE, GREEN, ORANGE, PURPLE])):
        x, w = cols(2)[i % 2]; chip(s, x, 160 + (i // 2) * 200, w, 180, h, b, col, rv=i + 1)
    s["els"].append(T("⚠️ الفقرة لا تعيد كلام النص حرفيًّا: تعرضه بكلماتها ثم تقيّمه.", L, 570, W, 70, 22, "FFFFFF", True, "center", RED, True, rv=5))
    # 19 groups
    s = D.new("🚀 تحدّي المستويات", "مهام المجموعات (12 دقيقة)", 12, "وزّع المستويات. بعد العرض: تغذية راجعة من مجموعة أخرى، ثم اكشف النموذج.")
    for i, ((task, model), (lv, col)) in enumerate(zip(C["groups"], [("مبتدئ", BLUE), ("متطوّر", GREEN), ("متمكّن", PURPLE)])):
        x, w = cols(3)[i]
        s["els"] += [T(lv, x, 150, w, 54, 26, "FFFFFF", True, "center", col, True), T(task, x, 212, w, 180, 21, DK, False, fill="FFFFFF", rad=True, va="top"),
                     T("✅ " + model, x, 402, w, 240, 19, "FFFFFF", True, fill=col, rad=True, va="top", rv=1)]
    # 20 mini exam question with mark scheme
    X = C["exam"]; s = D.new("📝 سؤال امتحان مصغّر", X["title"], 6, "يجيب الطلاب فرديًّا بصمت كما في الامتحان، ثم يصحّح كل طالب إجابة زميله بالمعيار، ثم اكشف الإجابة النموذجية." + (" للتدريب الكامل: ورشة الامتحان في درس «" + X["ws"] + "»." if X.get("ws") else ""))
    s["els"].append(T(X["q"], L, 150, W, 96, 23, DK, True, fill="FFFFFF", rad=True))
    s["els"].append(T("📏 معيار التصحيح:\n" + "\n".join("• " + m for m in X["ms"]), L, 260, W, 200, 20, DK, False, fill="FEF3C7", rad=True, va="top", rv=1))
    s["els"].append(T("✅ " + X["model"], L, 472, W, 170, 21, "FFFFFF", True, X.get("align", "right"), GREEN, True, va="top", rv=2))
    # 21 mistakes
    s = D.new("⚠️ أخطاء يذكرها الممتحنون", "من تقارير Pearson للورقة 1", 3, "من تقرير الممتحنين للورقة 1 (9AA0). اربط كل خطأ بما تدرّبنا عليه اليوم.")
    for i, (h, b, col) in enumerate(MIST_AL):
        x, w = cols(2)[i % 2]; card(s, x, 160 + (i // 2) * 240, w, 220, h, b, col, 23, rv=i + 1, hsize=27)
    # 22 UAE
    U = C["uae"]; s = D.new("🇦🇪 من واقعنا", U["title"], 4, "اربط الدرس بالهوية الوطنية، ثم ناقش السؤال في أزواج.")
    c = cols(2)
    for k in range(2): card(s, c[k][0], 160, c[k][1], 230, U["cards"][k][0], U["cards"][k][1], [GREEN, ORANGE][k], 23)
    s["els"].append(T("💬 " + U["q"], L, 420, W, 140, 25, "FFFFFF", True, "center", TE, True, rv=1))
    # 23 research angle (Paper 1 Section C)
    Rz = C["research"]; s = D.new("🔎 زاوية بحثية", "نحو سؤال البحث (الورقة 1 · ج، 40 درجة)", 4, "في الامتحان: نص غير مقروء وعبارة يحلّلها الطالب مستعينًا بالنص وبنتائج بحثه عن دولة عربية واحدة (270 إلى 320 كلمة، 40 درجة). تقرير الممتحنين: الاقتصار على النص أو التعليقات العامة يخفض الدرجة. المواصفات: المعلم يوجّه توجيهًا عامًّا، ولا يعلّم محتوى البحث ولا يقدّم المصادر.")
    s["els"].append(T(f"🌍 {Rz['country']} · سؤال بحثي: {Rz['q']}", L, 150, W, 96, 24, DK, True, fill="FFFFFF", rad=True))
    card(s, cols(2)[0][0], 262, cols(2)[0][1], 250, "📚 أين أبحث؟", "\n".join("• " + x for x in Rz["sources"]), BLUE, 21)
    card(s, cols(2)[1][0], 262, cols(2)[1][1], 250, "🏆 ما يرفع الدرجة", "• حقائق وأمثلة دقيقة من دولتك وحدها\n• ربط معلومات النص بنتائج بحثك\n• حكم معلّل وخلاصة مقنعة", GREEN, 21)
    s["els"].append(T("✍️ ابدأ صفحة البحث: دوّن حقيقتين ومصدرهما قبل الحصة القادمة.", L, 530, W, 80, 23, "FFFFFF", True, "center", PURPLE, True, rv=1))
    # 24 exit
    s = D.new("🎟️ تذكرة الخروج", "ثلاثة أسئلة قبل الجرس", 3, "فرديًّا، ثم اكشف الإجابات للتصحيح الذاتي. اجمع البطاقات لتبدأ بها الحصة القادمة.")
    for i, (q, a) in enumerate(C["exit"]):
        y = 150 + i * 165
        s["els"] += [T(q, L, y, W, 66, 23, DK, True, fill="FFFFFF", rad=True), T("✅ " + a, L, y + 74, W, 70, 21, "FFFFFF", True, fill=GREEN, rad=True, rv=i + 1)]
    # 25 reflect
    s = D.new("🪞 أتأمّل وأتابع", "ماذا تعلّمت؟ وماذا بعد؟", 2, "عُد إلى إجابات «لحظة فضول»: كيف تغيّرت بعد النص؟")
    c = cols(2)
    card(s, c[0][0], 160, c[0][1], 300, "🪞 تعلّمتُ اليوم", C["learned"], TE, 22)
    card(s, c[1][0], 160, c[1][1], 300, "🏠 في البيت", "\n".join(C["home"]), ORANGE, 21)
    s["els"].append(T("الدرس القادم: " + C["next"], L, 490, W, 70, 24, "FFFFFF", True, "center", PURPLE, True))
    bad = check(D.slides)
    if bad: print("OVERLAP", code, bad)
    return D
