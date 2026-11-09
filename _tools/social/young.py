# Grade 1–3 Social Studies lesson: 14-slide young-learner deck (cover + 13 stages) with book pictures, big vowelled text.
from engine import *
BADGE = ["🔁 نتذكّر معًا", "✨ لحظة فضول", "🎯 وجهتنا اليوم", "🔑 مفاتيح الدرس", "📖 ركن القصة", "👩‍🏫 شاهدني أطبّق",
         "🤝 نطبّق معًا", "🚦 إشارة الانطلاق", "🚀 تحدّي المستويات", "🌱 قيمة نعيشها", "🎟️ تذكرة الخروج", "🪞 مرآة التعلّم", "🏠 رسالتي إلى البيت"]
STAGES = ["استرجاع التعلّم السابق", "التهيئة وإثارة الدافعية", "ناتج التعلّم ومعايير النجاح", "المفاهيم والمصطلحات",
          "استكشاف المصادر (نص الكتاب وصوره)", "النمذجة: «أنا أطبّق»", "الممارسة الموجّهة: «نطبّق معًا»", "تحقّق قبل العمل المستقل",
          "الأنشطة المتمايزة: «أطبّق بنفسي»", "القيمة والسلوك والهوية", "بطاقة الخروج", "غلق الدرس والتأمل", "التكليف ومهمة الأداء"]
LV = [("⭐ مُبْتَدِئٌ", 'A35E24'), ("⭐⭐ مُتَطَوِّرٌ", '5F6C78'), ("⭐⭐⭐ مُتَمَكِّنٌ", '6B46A8')]
SUBJ = "الدِّراساتُ الاجْتِماعِيَّةُ وَالتَّرْبِيَةُ الأَخْلاقِيَّةُ"
def stage(D, i, title, S, mins=None, notes=''):
    sl = D.new(BG, f'[{STAGES[i]}] ' + notes)
    T(sl, BADGE[i], 3.2, 0.1, 3.6, 0.38, 13, 'FFFFFF', True, 'center', fill=TE, rad=True)
    if mins: T(sl, ('⏱ %s دقائق' if mins > 2 else '⏱ %s دقيقة') % mins, X0, 0.58, 1.35, 0.42, 13, DK, True, 'center', fill=SUN, rad=True)
    T(sl, title, 1.8, 0.52, 7.9, 0.6, 26, DK, True, 'right')
    T(sl, '🎯 ' + S['gs'], X0, 5.17, W, 0.36, 12, TE, True, 'center', fill=SOFT, rad=True)
    return sl
def wide(src):
    try:
        from PIL import Image; im = Image.open('/home/claude/Hira/' + src); return im.width / im.height > 1.25
    except Exception: return False
def deck(S):
    D = Deck(False); P = S['pics']
    sl = D.new(DK, 'اقرأ العنوان بصوت واضح، واطلب من الطلاب فتح الكتاب على الصفحة.')
    T(sl, f'{SUBJ} · {S["grade"]} · {S["unit"]}', 0.5, 0.45, 9.0, 0.45, 14, SUN, True, 'right')
    T(sl, S['title'], 3.0, 1.0, 6.5, 1.05, 44, 'FFFFFF', True, 'right')
    T(sl, S['sub'], 3.0, 2.1, 6.5, 0.5, 16, 'CFE3E1', False, 'right')
    PIC(sl, P['cover'], *((0.4, 1.0, 2.6, 2.0) if wide(P['cover']) else (0.6, 0.95, 2.1, 2.3)))
    R(sl, 0.5, 3.45, 9.0, 1.45, '27474D'); T(sl, '🎯 ' + S['goal'], 0.7, 3.55, 8.6, 1.25, 18, 'FFFFFF', False, 'right', valign='top')
    # 1
    r = S['ret']; sl = stage(D, 0, r['title'], S, 3, 'اسأل شفويًّا، واستمع لثلاث إجابات، ثم اكشف الجملة الأخيرة.')
    (a, wa), (b, wb) = cols(2)
    box(sl, a, 1.25, wa, 2.15, r['q'][0][0], [r['q'][0][1]], size=20, rv=1); box(sl, b, 1.25, wb, 2.15, r['q'][1][0], [r['q'][1][1]], col='6B46A8', size=20, rv=2)
    T(sl, r['reveal'], X0, 3.6, W, 1.3, 18, TE, True, 'right', fill=SOFT, rad=True, rv=3)
    # 2
    h = S['hook']; sl = stage(D, 1, h['title'], S, 4, 'فكّر – زاوج – شارك. لا تكشف الإجابة قبل أن يخمّن الطلاب.')
    PIC(sl, P[h['pic']], 6.9, 1.25, 2.8, 2.6)
    T(sl, h['q1'], X0, 1.25, 6.4, 0.75, 24 if len(h['q1']) < 45 else 18, DK, True, 'right'); T(sl, h['q2'], X0, 2.05, 6.4, 0.95, 18, TE, True, 'right', rv=1, valign='top')
    T(sl, '💬 ' + h['tps'], X0, 3.1, 6.4, 0.75, 16, DK, False, 'right', fill=CARD, rad=True, rv=2)
    T(sl, h['reveal'], X0, 4.05, W, 0.95, 20, 'B42318', True, 'center', fill=PEACH, rad=True, rv=3)
    # 3
    sl = stage(D, 2, 'وِجْهَتُنا الْيَوْمَ', S, 2, 'اقرأ الهدف مع الطلاب، ووضّح ماذا يعني كل مستوى.')
    T(sl, '🎯 ' + S['goal'], X0, 1.25, W, 1.0, 18, DK, True, 'right', fill=CARD, rad=True)
    for i, ((x, w), (lv, col), txt) in enumerate(zip(cols(3), LV, S['lv'])): box(sl, x, 2.4, w, 2.6, lv, [txt], col=col, size=18, rv=i + 1)
    # 4
    sl = stage(D, 3, 'كَلِماتٌ جَديدَةٌ', S, 6, 'الكلمات الجديدة من الكتاب. اعرض الرمز، واطلب جملة شفوية بكل كلمة.')
    for i, ((x, w), (emo, wd, m)) in enumerate(zip(cols(4), S['vocab'])):
        R(sl, x, 1.25, w, 2.75, CARD, line=TE, rv=i + 1, lw=2)
        I(sl, emo, x + (w - 0.95) / 2, 1.35, 0.95, rv=i + 1)
        T(sl, wd, x + 0.08, 2.4, w - 0.16, 0.6, 24 if len(wd) <= 14 else 15, TE, True, 'center', rv=i + 1)
        T(sl, m, x + 0.08, 3.05, w - 0.16, 0.85, 15, DK, False, 'center', rv=i + 1, valign='top')
    T(sl, '🗣️ ' + S['vtask'], X0, 4.15, W, 0.85, 17, DK, True, 'right', fill=PEACH, rad=True, rv=5)
    # 5
    st = S['story']; sl = stage(D, 4, st['title'], S, 7, 'اقرأ النص قراءة معبّرة والطلاب يتابعون في الكتاب، ثم اسأل: من؟ كم عمره؟')
    pw = 3.3 if wide(P[st['pic']]) else 2.3; tx = X0 + pw + 0.15; tw = 9.7 - tx
    PIC(sl, P[st['pic']], X0, 1.25, pw, 3.0)
    T(sl, st['t1'], tx, 1.25, tw, 1.75, 17 if tw > 6 else 15, DK, False, 'right', fill=CARD, rad=True, valign='top', rv=1)
    T(sl, st['t2'], tx, 3.1, tw, 1.35, 16 if tw > 6 else 14, DK, False, 'right', fill=SOFT, rad=True, valign='top', rv=2)
    T(sl, st['ask'], X0, 4.55, W, 0.5, 15, '6B46A8', True, 'center', rv=3)
    # 6
    k = S['model']; sl = stage(D, 5, k['title'], S, 5, 'عرّف بنفسك أمام الطلاب بالقالب نفسه، ثم اطلب من متطوّع.')
    for (x, w), (c, t_, d) in zip(cols(len(k['chips'])), k['chips']):
        R(sl, x, 1.25, w, 1.05, c, rv=1); T(sl, t_, x, 1.27, w, 0.5, 20, 'FFFFFF', True, 'center', rv=1); T(sl, d, x, 1.77, w, 0.45, 14, 'FFFFFF', False, 'center', rv=1)
    box(sl, X0, 2.45, W, 1.4, k.get('ftitle', '👩‍🏫 أَنا أُطَبِّقُ أَمامَكُمْ'), k['frame'], size=19, rv=2)
    box(sl, X0, 3.97, W, 1.05, k['note'][0], k['note'][1], col='B42318', size=17, rv=3)
    # 7
    g = S['guided']; sl = stage(D, 6, g['title'], S, 7, 'اعرض الصورتين، وعُدّوا معًا. ثم نفّذوا نشاط الكتاب.')
    (a, wa), (b, wb) = cols(2)
    PIC(sl, P[g['pics'][0]], a, 1.25, wa, 2.45, rv=1); PIC(sl, P[g['pics'][1]], b, 1.25, wb, 2.45, rv=2)
    T(sl, g['task'], X0, 3.82, W, 0.6, 18, DK, True, 'center', fill=CARD, rad=True, rv=3)
    T(sl, g['book'], X0, 4.5, W, 0.55, 15, TE, True, 'center', rv=4)
    # 8
    c = S['check']; sl = stage(D, 7, c['q'], S, 2, 'يرفع كل طالب بطاقة (أ) أو (ب). من يخطئ ينضمّ إلى مجموعة دعم قصيرة.')
    (a, wa), (b, wb) = cols(2)
    PIC(sl, P[c['pics'][0]], a + 0.4, 1.25, wa - 0.8, 2.3); T(sl, '(أ)', a, 3.55, wa, 0.45, 20, DK, True, 'center')
    PIC(sl, P[c['pics'][1]], b + 0.4, 1.25, wb - 0.8, 2.3); T(sl, '(ب)', b, 3.55, wb, 0.45, 20, DK, True, 'center')
    T(sl, c['ans'], X0, 4.07, W, 0.48, 16, 'FFFFFF', True, 'center', fill=TE, rad=True, rv=1)
    T(sl, '🟥 أَحْتاجُ مُساعَدَةً     🟨 أَحْتاجُ قَليلًا     🟩 جاهِزٌ', X0, 4.6, W, 0.45, 15, DK, True, 'center', rv=2)
    # 9
    sl = stage(D, 8, 'كُلٌّ في مُسْتَواهُ', S, 10, 'وزّع الأوراق الثلاث وورقة أصحاب الهمم. الهدف واحد والمهمة تختلف.')
    for i, ((x, w), (lv, col), lines) in enumerate(zip(cols(3), LV, S['ind'])): box(sl, x, 1.25, w, 2.55, lv, lines, col=col, size=18, rv=i + 1)
    box(sl, X0, 3.92, W, 1.1, '🏆 تَحَدٍّ', [S['chal']], col='A35E24', size=17, rv=4)
    # 10
    v = S['value']; sl = stage(D, 9, v['title'], S, 4, 'ناقش المعضلة: ماذا تفعل؟ ولماذا؟ اربطها بالسَّنع.')
    (a, wa), (b, wb) = cols(2)
    box(sl, a, 1.25, wa, 2.2, '🇦🇪 مِنْ سَنْعِ بِلادي أَتَعَلَّمُ', v['sana'], col=TE, size=17, rv=1)
    box(sl, b, 1.25, wb, 2.2, '🏠 حَقيقَةٌ وَطَنِيَّةٌ', v['fact'], col='A35E24', size=17, rv=2)
    box(sl, X0, 3.57, W, 1.45, '🤔 ماذا أَفْعَلُ؟', v['dilemma'], col='6B46A8', size=17, rv=3)
    # 11
    sl = stage(D, 10, 'تَذْكِرَةُ الْخُروجِ', S, 3, 'يجيب كل طالب وحده في البطاقة، ثم يمسح رمز الاستجابة السريعة في الشريحة التالية.')
    box(sl, X0, 1.25, W, 3.45, '🎟️ أُجيبُ وَحْدي', S['exit'], size=19)
    T(sl, 'تُجْمَعُ البِطاقاتُ لِنَبْدَأَ بِها الدَّرْسَ القادِمَ.', X0, 4.72, W, 0.4, 13, MU, False, 'center')
    # 12
    sl = stage(D, 11, 'ماذا تَعَلَّمْتُ؟', S, 2, 'اطلب من ثلاثة طلاب إكمال الجمل شفويًّا.')
    box(sl, X0, 1.25, W, 1.25, '🪞 تَعَلَّمْتُ الْيَوْمَ', [S['learned']], size=19 if len(S['learned']) < 95 else 15)
    box(sl, X0, 2.62, W, 1.1, '❓ أَتَساءَلُ', [S['wonder']], col='6B46A8', size=18, rv=1)
    box(sl, X0, 3.85, W, 1.17, '🔬 أَرْبِطُ', [S['link']], col='A35E24', size=17, rv=2)
    # 13
    sl = stage(D, 12, 'رِسالَتي إِلى الْبَيْتِ', S, None, 'ذكّر الطلاب بالمهمة، وحدّد موعد عرض اللوحة.')
    box(sl, X0, 1.25, W, 1.9, '🏠 مَعَ أُسْرَتي', S['home'], size=18)
    box(sl, X0, 3.28, W, 1.74, '🎯 مُهِمَّةُ أَداءٍ صَغيرَةٌ', S['task'], col='A35E24', size=17, rv=1)
    return D
