# Social Studies & Moral Education lesson generator: 14-slide deck (cover + 13 stages), differentiated sheets, payload.
import os, json
from engine import *
STAGES = ["استرجاع التعلّم السابق", "التهيئة وإثارة الدافعية", "ناتج التعلّم ومعايير النجاح", "المفاهيم والمصطلحات",
          "استكشاف المصادر", "النمذجة: «أنا أطبّق»", "الممارسة الموجّهة: «نطبّق معًا»", "تحقّق قبل العمل المستقل",
          "الأنشطة المتمايزة: «أطبّق بنفسي»", "القيمة والسلوك والهوية", "بطاقة الخروج", "غلق الدرس والتأمل", "التكليف ومهمة الأداء"]
# Lively stage labels shown on the slide; the formal stage name stays in the teacher notes (for planning and inspection).
BADGE = ["🔁 نتذكّر معًا", "✨ لحظة فضول", "🎯 وجهتنا اليوم", "🔑 مفاتيح الدرس", "🕵️ محقّقو المصادر", "👩‍🏫 شاهدني أطبّق",
         "🤝 نطبّق معًا", "🚦 إشارة الانطلاق", "🚀 تحدّي المستويات", "🌱 قيمة نعيشها", "🎟️ تذكرة الخروج", "🪞 مرآة التعلّم", "🏠 رسالتي إلى البيت"]
LV = [("مبتدئ: أتعرّف وأحدّد", 'A35E24'), ("متطوّر: أفسّر وأحلّل", '5F6C78'), ("متمكّن: أقيّم وأقترح", '6B46A8')]
ROLES = [("🔎", "الباحث", "يستخرج المعلومة من المصدر"), ("🗺️", "قارئ الخريطة", "يقرأ الخريطة والجدول والرسم"),
         ("🧠", "المحلّل", "يربط السبب بالنتيجة"), ("📝", "المقرّر", "يدوّن ويعرض رأي المجموعة")]
SUBJ = "الدراسات الاجتماعية والتربية الأخلاقية"
def stage(D, i, title, goal, mins=None, notes=''):
    sl = D.new(BG, f'[{STAGES[i]}] ' + notes)
    T(sl, BADGE[i], 3.2, 0.1, 3.6, 0.38, 13, 'FFFFFF', True, 'center', fill=TE, rad=True)
    if mins: T(sl, ('⏱ %s دقائق' if mins > 2 else '⏱ %s دقيقة') % mins, X0, 0.58, 1.35, 0.42, 13, DK, True, 'center', fill=SUN, rad=True)
    T(sl, title, 1.8, 0.52, 7.9, 0.55, 23, DK, True, 'right')
    T(sl, '🎯 ' + goal, X0, 5.17, W, 0.36, 12, TE, True, 'center', fill=SOFT, rad=True)
    return sl
def deck(S, grade_ar):
    D = Deck(False); G = S['gs']
    sl = D.new(DK, '')
    T(sl, f'{SUBJ} · {grade_ar} · {S["unit"]}', 0.5, 0.7, 9.0, 0.45, 15, SUN, True, 'right')
    t = S['title']; T(sl, t, 3.0, 1.25, 6.5, 1.1, 40 if len(t) <= 16 else (30 if len(t) <= 26 else 24), 'FFFFFF', True, 'right')
    T(sl, 'كتاب الطالب ' + S['pg'], 3.0, 2.4, 6.5, 0.45, 15, 'CFE3E1', False, 'right'); I(sl, S['emo'], 0.8, 1.2, 1.5)
    R(sl, 0.5, 3.35, 9.0, 1.5, '27474D'); T(sl, '🎯 هدف الحصة: ' + S['goal'], 0.7, 3.45, 8.6, 1.3, 16, 'FFFFFF', False, 'right', valign='top')
    # 1 retrieval
    sl = stage(D, 0, "ماذا تتذكّر؟", G, 3, "اسأل شفويًّا ثم اكشف الإجابة.")
    (a, wa), (b, wb) = cols(2)
    box(sl, a, 1.2, wa, 2.1, "🔁 تذكّر", S['ret'][0], rv=1); box(sl, b, 1.2, wb, 2.1, "🧩 اربط", S['ret'][1], col='6B46A8', rv=2)
    T(sl, S['ret'][2], X0, 3.5, W, 1.2, 15, TE, True, 'right', fill=SOFT, rad=True, rv=3)
    # 2 hook
    h = S['hook']; sl = stage(D, 1, "موقف يثير التفكير", G, 4, "فكّر – زاوج – شارك.")
    I(sl, h[0], 0.5, 1.25, 1.0); I(sl, h[1], 8.5, 1.25, 1.0)
    T(sl, h[2], 1.7, 1.2, 6.6, 0.6, 17, DK, True, 'center'); T(sl, h[3], 1.7, 1.85, 6.6, 0.55, 16, TE, True, 'center', rv=1)
    box(sl, X0, 2.65, W, 2.3, "💬 فكّر · زاوج · شارك", h[4], rv=2)
    # 3 outcome + success criteria
    sl = stage(D, 2, "ناتج التعلّم ومعايير النجاح", G, 2)
    T(sl, "🎯 " + S['goal'], X0, 1.2, W, 0.9, 15, DK, True, 'right', fill=CARD, rad=True)
    for i, ((x, w), (lv, col), txt) in enumerate(zip(cols(3), LV, S['lv'])): box(sl, x, 2.3, w, 2.65, lv, [txt], col=col, size=14, rv=i + 1)
    # 4 concepts
    sl = stage(D, 3, "المفاهيم والمصطلحات", G, 6, "المفهوم في الكتاب؛ اسأل: ما مثاله من حياتنا في الإمارات؟")
    cs = cols(2)
    for i, (w_, m, e) in enumerate(S['vocab'][:4]):
        x, w = cs[i % 2]; y = 1.2 + (i // 2) * 1.45
        R(sl, x, y, w, 1.35, CARD, line=TE, rv=i + 1, lw=2)
        T(sl, w_, x + 0.1, y + 0.05, w - 0.2, 0.45, 20, TE, True, 'right', rv=i + 1)
        T(sl, "المعنى: " + m, x + 0.1, y + 0.5, w - 0.2, 0.38, 14, DK, False, 'right', rv=i + 1)
        T(sl, "مثال: " + e, x + 0.1, y + 0.88, w - 0.2, 0.38, 14, '6B46A8', True, 'right', rv=i + 1)
    T(sl, "✍️ " + S['vtask'], X0, 4.2, W, 0.75, 15, DK, True, 'right', fill=PEACH, rad=True, rv=5)
    # 5 sources
    sl = stage(D, 4, "نستكشف المصادر", G, 6, "يقرأ الطلاب مصدر الكتاب (نص، خريطة، صورة، جدول) بالأدوار.")
    box(sl, X0, 1.2, W, 1.25, "📚 المصادر في كتابي " + S['pg'], S['src'], size=14)
    for i, ((x, w), (e, r, d)) in enumerate(zip(cols(4), S.get('roles', ROLES))):
        R(sl, x, 2.6, w, 2.35, CARD, line=SUN, rv=i + 1, lw=2); I(sl, e, x + (w - 0.7) / 2, 2.68, 0.7, rv=i + 1)
        T(sl, r, x + 0.05, 3.42, w - 0.1, 0.42, 16, TE, True, 'center', rv=i + 1); T(sl, d, x + 0.08, 3.86, w - 0.16, 1.0, 13, DK, False, 'center', rv=i + 1, valign='top')
    # 6 modelling
    k = S['skill']; sl = stage(D, 5, k['title'], G, 6, "فكّر بصوت عالٍ أمام الطلاب، خطوة خطوة.")
    for (x, w), (c, t_, d) in zip(cols(len(k['chips'])), k['chips']):
        R(sl, x, 1.2, w, 1.05, c, rv=1); T(sl, t_, x, 1.22, w, 0.45, 16, 'FFFFFF', True, 'center', rv=1); T(sl, d, x, 1.7, w, 0.45, 13, 'FFFFFF', False, 'center', rv=1)
    box(sl, X0, 2.4, W, 1.3, "👩‍🏫 أنا أطبّق", k['model'], size=13, rv=2)
    box(sl, X0, 3.82, W, 1.18, k['second'][0], k['second'][1], col='6B46A8', size=13, rv=3)
    # 7 guided practice
    we = S['we']; sl = stage(D, 6, we['title'], G, 8, "بطاقة مهمة لكل مجموعة؛ يقيّم المعلم كل طالب حسب دوره.")
    box(sl, X0, 1.2, W, 1.6, "🔬 مهمة المجموعات (بالأدوار)", we['task'], size=14)
    (a, wa), (b, wb) = cols(2)
    box(sl, a, 2.95, wa, 2.05, "🧠 حلّل", we['crit'], col='6B46A8', size=13, rv=1)
    box(sl, b, 2.95, wb, 2.05, "⚖️ قيّم واقترح", we['eval'], col='A35E24', size=13, rv=2)
    # 8 check
    c = S['chk']; sl = stage(D, 7, "هل أنت جاهز؟", G, 2, "بطاقات الإجابة؛ من يخطئ ينضمّ إلى مجموعة دعم قصيرة.")
    T(sl, c[0], X0, 1.2, W, 0.5, 17, DK, True, 'right'); L = 'أبجد'
    for i, o in enumerate(c[1]): T(sl, '(%s) %s' % (L[i], o), X0, 1.8 + i * 0.55, W, 0.48, 15, DK, False, 'right', fill=CARD, rad=True, rv=1)
    T(sl, "✅ الإجابة (%s)، %s" % (L[c[2]], c[3]), X0, 4.0, W, 0.48, 15, 'FFFFFF', True, 'right', fill=TE, rad=True, rv=2)
    T(sl, "🟥 أحتاج مساعدة     🟨 أحتاج قليلًا     🟩 جاهز", X0, 4.55, W, 0.45, 15, DK, True, 'center', rv=3)
    # 9 differentiated
    sl = stage(D, 8, "أنشطة متمايزة", G, 10, "الأوراق الثلاث وورقة أصحاب الهمم: الهدف واحد والعمق مختلف.")
    for i, ((x, w), (lv, col), lines) in enumerate(zip(cols(3), LV, S['ind'])): box(sl, x, 1.2, w, 2.45, lv, lines, col=col, size=13, rv=i + 1)
    box(sl, X0, 3.8, W, 1.2, "🏆 تحدٍّ", S['chal'], col='A35E24', size=13, rv=4)
    # 10 value / moral / identity
    v = S['value']; sl = stage(D, 9, v['title'], G, 4, "ناقش القيمة بموقف واقعي، واربطها بالهوية الوطنية.")
    (a, wa), (b, wb) = cols(2)
    box(sl, a, 1.2, wa, 2.2, "🌱 القيمة", v['value'], col=TE, size=14, rv=1)
    box(sl, b, 1.2, wb, 2.2, "🇦🇪 الهوية الوطنية", v['identity'], col='A35E24', size=14, rv=2)
    box(sl, X0, 3.55, W, 1.45, "🤔 معضلة: ماذا تفعل؟", v['dilemma'], col='6B46A8', size=14, rv=3)
    # 11 exit
    sl = stage(D, 10, "بطاقة الخروج", G, 3)
    box(sl, X0, 1.2, W, 2.6, "🎟️ أجب في بطاقتك", S['exit'], size=16)
    T(sl, "تُجمع البطاقات ليبدأ بها الدرس القادم.", X0, 4.0, W, 0.5, 14, MU, False, 'center')
    # 12 reflection
    sl = stage(D, 11, "ماذا تعلّمت؟", G, 2)
    box(sl, X0, 1.2, W, 1.3, "🪞 تعلّمتُ اليوم", [S['learned']], size=15)
    box(sl, X0, 2.62, W, 1.1, "❓ وما زلتُ أتساءل", [S['wonder']], col='6B46A8', size=15, rv=1)
    box(sl, X0, 3.85, W, 1.15, "🔗 أربط", [S['link']], col='A35E24', size=14, rv=2)
    # 13 homework / performance task
    sl = stage(D, 12, "التكليف ومهمة الأداء", G)
    box(sl, X0, 1.2, W, 2.0, "🏠 في البيت", S['home'], size=15)
    box(sl, X0, 3.35, W, 1.65, "🎯 مهمة أداء مصغّرة", S['task'], col='A35E24', size=14, rv=1)
    return D
