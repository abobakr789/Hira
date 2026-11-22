#!/usr/bin/env python3
# Sanaa · Cycle 1 · Term 1 · Lesson 1 «مفهوم السنع الإماراتي» (book p.17) — teacher deck.
# Book text is quoted exactly (unvowelled, as transcribed); all other wording is Hiraa's.
import sys
sys.path.insert(0, '/home/claude/hira/_tools/sanaa')
from deckkit import *

CODE = 'SN-Y1-T1-L01'
LESSON_ID = 'f93820c9-5d7a-4161-909d-ab7e204e0351'
TITLE = 'مَفْهومُ السَّنْعِ الْإِماراتِيِّ'
FOOT = 'مَفْهومُ السَّنْعِ الْإِماراتِيِّ · السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ'
PIC = '../../sn/g1/SN-Y1-T1-L01/'
GOAL = 'أَتَعَرَّفُ مَفْهومَ السَّنْعِ الْإِماراتِيِّ.'
LV = [('⭐', 'مُبْتَدِئٌ', 'أَذْكُرُ مِثالًا عَلى السَّنْعِ: أَقولُ «نَعَمْ» إِذا ناداني أَحَدٌ.', '#B0782A'),
      ('⭐⭐', 'مُتَطَوِّرٌ', 'أَشْرَحُ: السَّنْعُ أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها.', '#5E6672'),
      ('⭐⭐⭐', 'مُتَمَكِّنٌ', 'أَخْتارُ السَّنْعَ في مَوْقِفٍ يَوْمِيٍّ وَأَقولُ لِماذا.', '#5546A3')]
S = []

def cards_row(items, w, h, pal, gap=24, y=300, fs=38):
    bg, ac, tint = PAL[pal]; out = ''
    for k, (emo, a, b) in enumerate(items):
        inner = P(emo, 76) + P(a, fs, ac, True, True) + P(b, 26, '#4A5566')
        out += f'<div data-build-in="pop {k + 1}">' + card(inner, w, h, '#fff', ac) + '</div>'
    return abs_(100, y, 1700, out, f'flex-direction:row;gap:{gap}px;justify-content:center;align-items:stretch')

# 1 cover
S.append(
 '<section class="sl" id="cover" style="background:#FFF8EA;color:#1F2A3C;' + TXT + ';padding:0;direction:rtl;overflow:hidden">'
 '<div class="cvbg" style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:linear-gradient(180deg,#FFE9C2 0%,#FFF8EA 55%,#F3E9D2 100%)"></div>'
 '<div style="position:absolute;left:-60px;bottom:-280px;width:1200px;height:560px;border-radius:50%;background:#B0782A;opacity:.12"></div>'
 '<div style="position:absolute;left:56px;top:34px;display:flex"><img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:240px;height:96px;object-fit:contain"></div>'
 '<div style="position:absolute;left:120px;top:250px;width:640px;height:520px;border-radius:40px;background:#fff;box-shadow:0 16px 40px rgba(31,42,60,.14);padding:18px;display:flex"><img src="' + PIC + 'family.webp" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:28px"></div>'
 '<div style="position:absolute;right:110px;top:190px;width:1000px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">'
 + P('السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ', 34, '#B0782A', True, False, 'right')
 + '<h1 style="' + FONT + ';font-size:96px;line-height:1.3;text-align:right">' + TITLE + '</h1>'
 + P('الْمِحْوَرُ الْأَوَّلُ: مَفْهومُ السَّنْعِ الْإِماراتِيِّ وَأَهَمِّيَّتُهُ · كِتابي ص 17', 30, '#5B6472', False, False, 'right')
 + '<div style="background:#fff;border:3px solid #B0782A;border-radius:28px;padding:20px 30px;margin-top:20px;display:flex">' + P('🎯 ' + GOAL, 38, '#1F2A3C', True, True, 'right') + '</div>'
 '</div><aside>اقرأ العنوان بصوت واضح، واطلب من الطلاب فتح الكتاب على الصفحة 17.</aside></section>')

# 2 retrieve
S.append(frame('retrieve', 'sky', '🔁 نَتَذَكَّرُ مَعًا', '3 دَقائِقَ', 'كَيْفَ أَتَصَرَّفُ؟',
  cards_row([('🏠', 'إِذا نادَتْني أُمّي', 'ماذا أَقولُ؟  أَقولُ: نَعَمْ يا أُمّي'),
             ('👴', 'عِنْدَما أَرى جَدّي', 'كَيْفَ أُحَيّيهِ؟  أَقولُ: السَّلامُ عَلَيْكُمْ')], 700, 380, 'sky', 40, 300)
  + abs_(100, 740, 1500, P('🔬 هٰذِهِ الْأَقْوالُ وَالْأَفْعالُ الْجَميلَةُ لَها اسْمٌ جَميلٌ: «السَّنْعُ»', 34, '#1B7F9E', True, True),
         'background:#fff;border-radius:26px;padding:16px 26px;justify-content:center'),
  'اسأل شفويًّا واستمع لثلاث إجابات، ثم اكشف الجملة الأخيرة.', FOOT))

# 3 hook
S.append(frame('hook', 'peach', '✨ لَحْظَةُ فُضولٍ', '4 دَقائِقَ', 'ماذا تَقولُ؟',
  abs_(100, 290, 1500, P('🔔 يُناديكَ أَحَدٌ في الْمَدْرَسَةِ: «يا أَحْمَدُ!»', 44, '#B0582F', True, True) +
       P('خَمِّنْ: ماذا تَقولُ لَهُ؟ وَلِماذا؟', 36, '#1F2A3C'), 'flex-direction:column;gap:20px;align-items:center') +
  abs_(100, 560, 1500, '<div style="display:flex;flex-direction:row;gap:30px">' +
       ''.join(f'<p style="font-size:30px;color:#1F2A3C;background:#fff;border-radius:24px;padding:12px 26px">{t}</p>' for t in ('💭 أُفَكِّرُ وَحْدي', '🗣️ أُخْبِرُ زَميلي', '👥 نُشارِكُ الصَّفَّ')) + '</div>', 'justify-content:center') +
  abs_(100, 730, 1500, '<div data-build-in="pop 1" style="background:#FFE9A8;border-radius:28px;padding:20px 34px;display:flex">' + P('نَقولُ: «نَعَمْ» أَوْ «لَبَّيْهِ» ✨ وَهٰذا مِنَ السَّنْعِ الْإِماراتِيِّ', 38, '#8A5A1E', True, True) + '</div>', 'justify-content:center'),
  'فكّر – زاوج – شارك. لا تكشف الإجابة قبل أن يخمّن الطلاب. الإجابة من نص الكتاب ص 17.', FOOT))

# 4 goal
lv_cards = ''
for k, (st, nm, tx, col) in enumerate(LV):
    inner = P(st, 44) + P(nm, 36, col, True, True) + P(tx, 29, '#1F2A3C')
    lv_cards += f'<div data-build-in="pop {k + 1}">' + card(inner, 520, 360, '#fff', col) + '</div>'
S.append(frame('goal', 'sand', '🎯 وِجْهَتُنا', '2 دَقيقَتانِ', 'وِجْهَتُنا الْيَوْمَ',
  abs_(100, 260, 1700, '<div style="background:#fff;border:3px solid #B0782A;border-radius:26px;padding:16px 28px;display:flex">' + P('🎯 ' + GOAL, 40, '#1F2A3C', True, True) + '</div>', 'justify-content:center') +
  abs_(100, 430, 1700, lv_cards, 'flex-direction:row;gap:28px;justify-content:center'),
  'اقرأ الهدف مع الطلاب، ووضّح ماذا يعني كل مستوى.', FOOT))

# 5 journey
steps = [('🔁', 'نَتَذَكَّرُ'), ('📖', 'نَقْرَأُ'), ('🔑', 'الْكَلِماتُ'), ('👥', 'نَتَعاوَنُ'), ('🚦', 'نَتَحَقَّقُ'), ('🏠', 'نُطَبِّقُ')]
S.append(frame('journey', 'sand', '🗺️ خَريطَةُ الْحِصَّةِ', '1 دَقيقَةٌ', 'رِحْلَةُ دَرْسِنا',
  abs_(100, 400, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex;flex-direction:column;align-items:center;gap:10px">' +
       f'<div style="width:150px;height:150px;border-radius:50%;background:#fff;border:4px solid #B0782A;display:flex;align-items:center;justify-content:center;font-size:70px">{e}</div>' + P(t, 32, '#1F2A3C', True, True) + '</div>' for k, (e, t) in enumerate(steps)),
       'flex-direction:row;justify-content:space-around'), 'اعرض مراحل الحصة سريعًا.', FOOT))

# 6 / 27 progress
def progress(sid, title, sub, mins):
    rows = ''
    for k, (st, nm, tx, col) in enumerate(LV):
        rows += (f'<div data-build-in="pop {k + 1}" style="display:flex;flex-direction:row;align-items:center;gap:24px;background:#fff;border-radius:26px;padding:14px 26px;border:3px solid {col}">'
                 + P(st, 40) + P(tx, 30, '#1F2A3C', False, False, 'right', 'flex:1') +
                 '<div style="display:flex;flex-direction:row;gap:14px;font-size:54px"><span>😟</span><span>🙂</span><span>😀</span></div></div>')
    return frame(sid, 'lav', '📈 ' + ('أَيْنَ أَنا الْآنَ؟' if sid == 'progress' else 'كَمْ تَعَلَّمْتُ؟'), mins, title,
                 abs_(100, 270, 1700, P(sub, 32, '#5546A3', True), 'justify-content:center') +
                 abs_(100, 380, 1700, rows, 'flex-direction:column;gap:20px'),
                 'كل طالب يختار وجهًا لكل مستوى. يُقارَن بعد الدرس بالنتيجة القبلية.', FOOT)
S.append(progress('progress', 'قِياسُ التَّقَدُّمِ: قَبْلَ الدَّرْسِ', 'أَخْتارُ الْوَجْهَ الَّذي يُشْبِهُني:  😟 لا أَعْرِفُ بَعْدُ · 🙂 أَعْرِفُ قَليلًا · 😀 أَعْرِفُ جَيِّدًا', '2 دَقيقَتانِ'))

# 7 vocab (book concepts p.16; meanings are Hiraa's own wording)
S.append(frame('vocab', 'mint', '🔑 مَفاتيحُ الدَّرْسِ', '6 دَقائِقَ', 'كَلِماتٌ جَديدَةٌ',
  cards_row([('🤝', 'السَّنْعُ', 'أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها'),
             ('🏘️', 'الْمُجْتَمَعُ', 'ناسٌ يَعيشونَ مَعًا في مَكانٍ واحِدٍ'),
             ('🇦🇪', 'الْهُوِيَّةُ الْوَطَنِيَّةُ', 'ما يُعَرِّفُ بِوَطَني: عَلَمي وَلُغَتي وَعاداتي'),
             ('💛', 'الْأَخْلاقُ', 'صِفاتٌ حَسَنَةٌ في تَعامُلي مَعَ النّاسِ'),
             ('👨‍👩‍👧‍👦', 'الْأُسْرَةُ', 'أَبي وَأُمّي وَإِخْوَتي')], 320, 430, 'mint', 16, 280, 31) +
  abs_(100, 760, 1700, P('🗣️ أَقولُ جُمْلَةً بِكَلِمَةٍ جَديدَةٍ: «أُحِبُّ … في أُسْرَتي».', 32, '#1F7A6D', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'),
  'الكلمات من «المفاهيم والمصطلحات» في ص 16 من الكتاب؛ والتعريفات المبسطة من إعداد حراء.', FOOT))

# 8–9 book text (exact)
T1 = ('اهتمت دولة الإمارات العربية المتحدة وقيادتها الحكيمة بنشر قيم السنع الإماراتي من خلال المحافظة على الآداب والأخلاق والعادات الحميدة، '
      'وتناقلها وترسيخها في نفوس الأجيال الناشئة والشابة مثل: احترام الكبير، ونصرة الضعيف، وتقدير الوالدين، ونشر صفات الكرم، والأمانة والإخلاص، '
      'والتعاون، والصدق، والتسامح في مجتمعنا، وهذا ما يعبّر عن هويتنا الوطنية التي نعتزّ بها.')
T2a = 'فما المقصود بالسنع الإماراتي؟'
T2b = 'هي الأقوال والأفعال التي من الواجب الالتزام بها في المواقف الاجتماعية اليومية أو المناسبات أو الزيارات أو حضور المجالس.'
def textslide(sid, title, inner, notes):
    return frame(sid, 'sand', '📖 رُكْنُ الْكِتابِ', '4 دَقائِقَ', title,
      abs_(100, 270, 1700, '<div style="background:#fff;border:3px solid #B0782A;border-radius:32px;padding:34px 44px;display:flex;flex-direction:column;gap:20px;width:1700px">' + inner + '</div>') +
      abs_(100, 905, 1700, P('📘 كِتابي ص 17', 26, '#8A5A1E', True), 'justify-content:center'), notes, FOOT)
S.append(textslide('text1', 'نَصُّ الدَّرْسِ (1)', P(T1, 42, '#1F2A3C', False, False, 'right', 'line-height:1.75'),
                   'اقرأ النص قراءة معبّرة والطلاب يتابعون في الكتاب، ثم اسأل: ما القيم التي ذُكرت؟ (نص الكتاب منقول كما ورد).'))
S.append(textslide('text2', 'نَصُّ الدَّرْسِ (2)',
  P(T2a, 46, '#B0782A', True, True, 'right') + P(T2b, 42, '#1F2A3C', False, False, 'right', 'line-height:1.75'),
  'اقرأ السؤال ثم التعريف. اطلب من الطلاب إعادة التعريف بكلماتهم.'))
S.append(textslide('text3', 'مِثالانِ مِنَ الْكِتابِ',
  '<div style="display:flex;flex-direction:row;gap:30px">'
  + '<div data-build-in="pop 1" style="flex:1;display:flex">' + card(P('مِثال', 34, '#B0782A', True, True) + P('الحياة اليومية: (إذا ناداك أحد فأجب بكلمة نعم أو لبيه)', 38, '#1F2A3C', False, False, 'center', 'line-height:1.6'), 760, 300, '#FFF8EA', '#B0782A') + '</div>'
  + '<div data-build-in="pop 2" style="flex:1;display:flex">' + card(P('مِثال', 34, '#1F7A6D', True, True) + P('المناسبات الاجتماعية: (تهنئة العيد عساكم من عوّاده)', 38, '#1F2A3C', False, False, 'center', 'line-height:1.6'), 760, 300, '#EEF8F3', '#1F7A6D') + '</div></div>',
  'المثالان من الكتاب ص 17 بنصهما. اطلب من الطلاب تمثيل المثال الأول.'))

# 11 model
S.append(frame('model', 'blue', '👩‍🏫 شاهِدْني أُطَبِّقُ', '5 دَقائِقَ', 'أَخْتارُ الْقَوْلَ الْجَميلَ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="flex:1;display:flex">' + card(P(e, 64) + P(a, 34, '#2F6A9A', True, True) + P(b, 32, '#1F2A3C'), 540, 330, '#fff', '#2F6A9A') + '</div>' for k, (e, a, b) in enumerate([
        ('📣', 'يُناديني أَحَدٌ', 'أَقولُ: «نَعَمْ» أَوْ «لَبَّيْهِ»'),
        ('🎉', 'يَوْمُ الْعيدِ', 'أُهَنِّئُ: «عَساكُمْ مِنْ عُوّادِهِ»'),
        ('🤝', 'أُحافِظُ عَلَيْهِ', 'السَّنْعُ أَقْوالٌ وَأَفْعالٌ نَلْتَزِمُ بِها')])), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 640, 1700, P('💡 انْتَبِهْ: السَّنْعُ في الْبَيْتِ وَالْمَدْرَسَةِ وَالْمُناسَباتِ وَالزِّياراتِ وَالْمَجالِسِ.', 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:16px 28px;justify-content:center'),
  'قدّم النموذجين أمام الطلاب بصوتك، ثم اطلب متطوعًا يقلّدك. عبارة «عساكم من عوّاده» كما في الكتاب.', FOOT))

# 12 together (book p.18 activity with the book's three pictures)
pics3 = ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex;flex-direction:column;align-items:center;gap:12px"><div style="width:520px;height:340px;border-radius:32px;background:#fff;box-shadow:0 12px 32px rgba(31,42,60,.10);padding:14px;flex:none;display:flex"><img src="{PIC}{f}.webp" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:22px"></div></div>' for k, f in enumerate(('bus', 'greet', 'class')))
S.append(frame('together', 'blue', '🤝 نُطَبِّقُ مَعًا', '7 دَقائِقَ', 'أَنْظُرُ حَوْلي لِأَكْتَشِفَ السَّنْعَ',
  abs_(100, 290, 1700, pics3, 'flex-direction:row;gap:40px;justify-content:center') +
  abs_(100, 730, 1700, P('👆 ماذا يَفْعَلُ كُلُّ واحِدٍ؟ أَيُّ قيمَةٍ مِنْ قِيَمِ السَّنْعِ أَراها؟', 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center') +
  abs_(100, 850, 1700, P('📘 كِتابي ص 18: أُلَوِّنُ الدّائِرَةَ الَّتي تُعَبِّرُ عَنْ ذٰلِكَ.', 28, '#1F7A6D', True), 'justify-content:center'),
  'صور النشاط من كتاب الطالب ص 18. دع الطلاب يصفون ما يرون ويسمّون القيمة بأنفسهم، ثم ينفذون النشاط في الكتاب.', FOOT))

# 13 check
S.append(frame('check', 'mint', '🚦 إِشارَةُ الِانْطِلاقِ', '2 دَقيقَتانِ', 'أَيُّ الْمَوْقِفَيْنِ فيهِ سَنْعٌ؟',
  abs_(100, 270, 1700, ''.join(card(P(e, 84) + P(l, 34, '#1F7A6D', True, True) + P(t, 32, '#1F2A3C'), 700, 380, '#fff', '#1F7A6D') for e, l, t in (
      ('👴🙂', '(أ)', 'ناداني جَدّي فَقُلْتُ: «لَبَّيْهِ»'), ('👴😶', '(ب)', 'ناداني جَدّي فَلَمْ أُجِبْ'))), 'flex-direction:row;gap:60px;justify-content:center') +
  abs_(100, 690, 1700, '<div data-build-in="pop 1" style="background:#1F7A6D;border-radius:26px;padding:12px 30px;display:flex">' + P('✅ (أ): لِأَنَّني أَجَبْتُ بِقَوْلٍ جَميلٍ.', 34, '#fff', True, True) + '</div>', 'justify-content:center') +
  abs_(100, 800, 1700, P('🟥 أَحْتاجُ مُساعَدَةً     🟨 قَليلًا     🟩 جاهِزٌ', 30, '#1F2A3C', True), 'justify-content:center'),
  'يرفع كل طالب بطاقة (أ) أو (ب). من يخطئ ينضم إلى مجموعة دعم قصيرة.', FOOT))

# 14 true/false
tf = [('السَّنْعُ أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها.', '👍 صَحيحٌ'), ('نَقولُ «نَعَمْ» أَوْ «لَبَّيْهِ» إِذا ناداني أَحَدٌ.', '👍 صَحيحٌ'),
      ('السَّنْعُ يَكونُ في الْمَجْلِسِ فَقَطْ.', '👎 خَطَأٌ'), ('لا نُهَنِّئُ أَحَدًا في الْعيدِ.', '👎 خَطَأٌ')]
S.append(frame('truefalse', 'rose', '👍👎 أُفَكِّرُ وَأُصَحِّحُ', '3 دَقائِقَ', 'صَحيحٌ أَمْ خَطَأٌ؟',
  abs_(100, 270, 1700, ''.join(f'<div style="display:flex;flex-direction:row;align-items:center;gap:20px;background:#fff;border-radius:24px;padding:12px 24px;border:3px solid #B4483F"><p style="{FONT};font-size:34px;color:#B4483F">{k + 1}</p>' + P(s, 32, '#1F2A3C', False, False, 'right', 'flex:1') + f'<div data-build-in="pop {k + 1}" style="background:#F9DAD6;border-radius:20px;padding:6px 18px;display:flex">' + P(a, 30, '#B4483F', True, True) + '</div></div>' for k, (s, a) in enumerate(tf)), 'flex-direction:column;gap:18px'),
  'اقرأ كل عبارة، ويصوّت الطلاب بالإبهام، ثم اكشف الإجابة. صوّبوا العبارة الخاطئة معًا (السنع في المواقف اليومية والمناسبات والزيارات والمجالس).', FOOT))

# 15 groups map + g1..g4
G = [('g1', '⭐', 'مُبْتَدِئٌ', 'نَقْرَأُ الْقِيَمَ وَنَخْتارُ', '#B0782A', 'sand'),
     ('g2', '⭐⭐', 'مُتَطَوِّرٌ', 'نَشْرَحُ مَعْنى السَّنْعِ', '#5E6672', 'blue'),
     ('g3', '⭐⭐⭐', 'مُتَمَكِّنٌ', 'نَخْتارُ السَّنْعَ في مَوْقِفٍ', '#5546A3', 'lav'),
     ('g4', '🌱', 'قيمَةٌ', 'نُمَثِّلُ السَّنْعَ', '#1F7A6D', 'mint')]
S.append(frame('groups', 'sky', '👥 خَريطَةُ الْمَجْموعاتِ', '10 دَقائِقَ', 'نَعْمَلُ مَعًا',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(st, 52) + P('الْمَجْموعَةُ ' + str(k + 1), 32, col, True, True) + P(t, 28, '#1F2A3C') + P(nm, 26, col, True), 400, 400, '#fff', col) + '</div>' for k, (sid, st, nm, t, col, p) in enumerate(G)), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 730, 1700, P('🧭 الْقائِدُ     ✏️ الرَّسّامُ     🗣️ الْمُتَحَدِّثُ     ⏰ حارِسُ الْوَقْتِ', 32, '#1B7F9E', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'),
  'وزّع الأدوار الأربعة داخل كل مجموعة. الهدف واحد والمهمة تختلف بحسب المستوى.', FOOT))
GT = {
 'g1': ('نَقْرَأُ الْقِيَمَ وَنَخْتارُ', ['١) نَقْرَأُ الْقِيَمَ في نَصِّ الْكِتابِ ص 17: احْتِرامُ الْكَبيرِ، نُصْرَةُ الضَّعيفِ، تَقْديرُ الْوالِدَيْنِ، الْكَرَمُ، الْأَمانَةُ…', '٢) نَخْتارُ ثَلاثَ قِيَمٍ وَنَرْسُمُ لِكُلٍّ مِنْها رَمْزًا.'], 'مَنْ يَذْكُرُ خَمْسَ قِيَمٍ مِنَ النَّصِّ مِنْ غَيْرِ النَّظَرِ؟'),
 'g2': ('نَشْرَحُ مَعْنى السَّنْعِ', ['١) نُكْمِلُ: «السَّنْعُ هُوَ أَقْوالٌ وَأَفْعالٌ …»', '٢) نَذْكُرُ مِثالًا مِنْ بَيْتِنا أَوْ مَدْرَسَتِنا وَنُمَثِّلُهُ.'], 'اشْرَحْ لِزَميلٍ ما هُوَ السَّنْعُ في جُمْلَتَيْنِ.'),
 'g3': ('نَخْتارُ السَّنْعَ في مَوْقِفٍ', ['١) مَوْقِفٌ: ناداني أَحَدٌ. ماذا أَقولُ؟ وَلِماذا؟', '٢) مَوْقِفٌ: جاءَ الْعيدُ. ماذا أَقولُ؟ وَلِماذا؟'], 'اقْتَرِحوا مَوْقِفًا ثالِثًا مِنْ حَياتِكُمْ فيهِ سَنْعٌ.'),
 'g4': ('نُمَثِّلُ السَّنْعَ', ['١) نُمَثِّلُ مَشْهَدَ: «ناداني أَحَدٌ» بِقَوْلٍ جَميلٍ.', '٢) نُمَثِّلُ مَشْهَدَ تَهْنِئَةِ الْعيدِ كَما في الْكِتابِ.'], 'اذْكُروا كَيْفَ يَشْعُرُ مَنْ نُجيبُهُ بِسَنْعٍ.')}
for k, (sid, st, nm, t, col, pal) in enumerate(G):
    ttl, steps_, ch = GT[sid]
    S.append(frame(sid, pal, '👥 عَمَلٌ جَماعِيٌّ', '10 دَقائِقَ', f'الْمَجْموعَةُ {k + 1}: {ttl}',
      abs_(100, 280, 1700, ''.join(f'<div data-build-in="pop {i + 1}" style="background:#fff;border:3px solid {col};border-radius:26px;padding:20px 30px;display:flex;width:1700px">' + P(s, 36, '#1F2A3C', False, False, 'right', 'line-height:1.6') + '</div>' for i, s in enumerate(steps_)), 'flex-direction:column;gap:22px') +
      abs_(100, 690, 1700, '<div data-build-in="pop 3" style="background:' + PAL[pal][2] + ';border-radius:26px;padding:18px 30px;display:flex;flex-direction:column;gap:6px;width:1700px">' + P('★ تَحَدّي الْأَبْطالِ', 30, col, True, True, 'right') + P(ch, 34, '#1F2A3C', True, False, 'right') + '</div>'),
      'تجوّل بين المجموعات واطرح أسئلة موجّهة. ذكّر المجموعة بدور كل عضو.', FOOT))

# 20 models (model answers, hidden until click is provided by the shared "عرض" behaviour: keep reveal builds)
MA = [('g1', 'قِيَمٌ مِنَ النَّصِّ: احْتِرامُ الْكَبيرِ، نُصْرَةُ الضَّعيفِ، تَقْديرُ الْوالِدَيْنِ، الْكَرَمُ، الْأَمانَةُ، الْإِخْلاصُ، التَّعاوُنُ، الصِّدْقُ، التَّسامُحُ.'),
      ('g2', 'السَّنْعُ هُوَ الْأَقْوالُ وَالْأَفْعالُ الَّتي مِنَ الْواجِبِ الِالْتِزامُ بِها في الْمَواقِفِ الِاجْتِماعِيَّةِ الْيَوْمِيَّةِ أَوِ الْمُناسَباتِ أَوِ الزِّياراتِ أَوْ حُضورِ الْمَجالِسِ.'),
      ('g3', 'إِذا ناداني أَحَدٌ أَقولُ «نَعَمْ» أَوْ «لَبَّيْهِ»؛ وَفي الْعيدِ أَقولُ «عَساكُمْ مِنْ عُوّادِهِ».'),
      ('g4', 'نَشْعُرُ بِالْفَرَحِ وَالتَّقْديرِ، وَيَزْدادُ التَّعاوُنُ وَالْمَحَبَّةُ بَيْنَنا. (إِجابَةٌ مُقْتَرَحَةٌ)')]
S.append(frame('models', 'mint', '✅ نَتَحَقَّقُ مَعًا', '4 دَقائِقَ', 'نَماذِجُ الْإِجابَةِ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="background:#fff;border:3px solid #1F7A6D;border-radius:24px;padding:14px 26px;display:flex;flex-direction:row;gap:20px;align-items:center;width:1700px">' + P(f'الْمَجْموعَةُ {k + 1}', 30, '#1F7A6D', True, True, 'right', 'flex:none;width:260px') + P(t, 28, '#1F2A3C', False, False, 'right', 'flex:1;line-height:1.5') + '</div>' for k, (g, t) in enumerate(MA)), 'flex-direction:column;gap:18px'),
  'اكشف النموذج بعد عرض كل مجموعة. نموذج المجموعة 4 اقتراح وليس نصًّا من الكتاب.', FOOT))

# 21 feedback
S.append(frame('feedback', 'gold', '⭐ أُشَجِّعُ زَميلي', '3 دَقائِقَ', 'نَجْمَتانِ وَأُمْنِيَةٌ',
  cards_row([('★', 'النَّجْمَةُ الْأولى', '«أَعْجَبَني تَمْثيلُكُمْ»'), ('★', 'النَّجْمَةُ الثّانِيَةُ', '«تَكَلَّمْتُمْ بِصَوْتٍ واضِحٍ»'), ('✦', 'الْأُمْنِيَةُ', '«أَتَمَنّى لَوْ زِدْتُمْ مِثالًا»')], 520, 360, 'gold', 28, 300),
  'يقدّم الطلاب تغذية راجعة لمجموعة أخرى: نجمتان وأمنية.', FOOT))

# 22 levels
LW = [('⭐', 'مُبْتَدِئٌ', ['✏️ أُلَوِّنُ صورَةَ السَّنْعِ.', '✏️ أَصِلُ الْقَوْلَ بِالْمَوْقِفِ.'], '#B0782A'),
      ('⭐⭐', 'مُتَطَوِّرٌ', ['✏️ أُكْمِلُ: السَّنْعُ هُوَ …', '✏️ أَكْتُبُ مِثالًا مِنْ بَيْتي.'], '#5E6672'),
      ('⭐⭐⭐', 'مُتَمَكِّنٌ', ['✏️ أَشْرَحُ السَّنْعَ بِجُمْلَتَيْنِ.', '✏️ أَرْسُمُ مَوْقِفًا فيهِ سَنْعٌ.'], '#5546A3')]
S.append(frame('levels', 'peach', '🚀 تَحَدّي الْمُسْتَوَياتِ', '10 دَقائِقَ', 'كُلٌّ في مُسْتَواهُ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(st, 44) + P(nm, 34, col, True, True) + ''.join(P(x, 28, '#1F2A3C') for x in xs), 540, 400, '#fff', col) + '</div>' for k, (st, nm, xs, col) in enumerate(LW)), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 730, 1700, P('🏆 تَحَدٍّ: أُعَلِّمُ زَميلي ماذا نَقولُ إِذا ناداني أَحَدٌ.', 32, '#B0582F', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'),
  'وزّع الأوراق الثلاث وورقة أصحاب الهمم. الهدف واحد والمهمة تختلف.', FOOT))

# 23 value
S.append(frame('value', 'mint', '🌱 قيمَةٌ نَعيشُها', '4 دَقائِقَ', 'السَّنْعُ يَجْمَعُنا',
  cards_row([('🛡️', 'الْوَلاءُ', 'أُحِبُّ وَطَني وَأُحافِظُ عَلَيْهِ'), ('🎁', 'الْكَرَمُ', 'أُعْطي وَأُكْرِمُ مَنْ حَوْلي'), ('🤲', 'التَّعاوُنُ', 'أُساعِدُ أُسْرَتي وَزُمَلائي')], 520, 340, 'mint', 28, 280) +
  abs_(100, 650, 1700, P('🤔 ماذا أَفْعَلُ؟ أَرى زَميلًا جَديدًا يَقِفُ وَحْدَهُ… كَيْفَ أُظْهِرُ السَّنْعَ؟', 32, '#5546A3', True, True), 'background:#fff;border-radius:26px;padding:16px 28px;justify-content:center'),
  'قيم المحور من الكتاب ص 16: الولاء، الكرم، التعاون. ناقش المعضلة: ماذا تفعل ولماذا؟ (إجابات الطلاب مفتوحة).', FOOT))

# 24 watani
S.append(frame('watani', 'sky', '🇦🇪 أَنا مُواطِنٌ إيجابِيٌّ', '3 دَقائِقَ', 'مِنْ دَرْسي إِلى وَطَني',
  abs_(100, 280, 1700, card(P('🏠 السَّنْعُ يُعَبِّرُ عَنْ هُوِيَّتِنا الْوَطَنِيَّةِ الَّتي نَعْتَزُّ بِها', 42, '#1B7F9E', True, True), 1700, 200, '#fff', '#1B7F9E')) +
  abs_(100, 540, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="background:#fff;border-radius:26px;padding:16px 28px;display:flex">' + P(t, 32, '#1F2A3C', True, True) + '</div>' for k, t in enumerate(('❤️ أُحِبُّ وَطَني', '🗣️ أَلْتَزِمُ بِسَنْعي', '🤲 أُعَلِّمُ غَيْري'))), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 760, 1700, P('💡 كَيْفَ أُطَبِّقُ السَّنْعَ في بَيْتي وَمَدْرَسَتي هٰذا الْأُسْبوعَ؟', 32, '#1B7F9E', True, True), 'justify-content:center'),
  'الجملة الأولى مأخوذة من نص الكتاب ص 17 («هويتنا الوطنية التي نعتز بها»).', FOOT))

# 25 quick
Q = [('أَيٌّ مِمّا يَلي مِنَ السَّنْعِ؟', ['أَقولُ «نَعَمْ» إِذا ناداني أَحَدٌ', 'أَتَجاهَلُ مَنْ يُناديني', 'أَصيحُ في وَجْهِهِ'], 0),
     ('نُهَنِّئُ في الْعيدِ بِقَوْلِنا:', ['مَعَ السَّلامَةِ', 'عَساكُمْ مِنْ عُوّادِهِ', 'صَباحُ الْخَيْرِ'], 1),
     ('السَّنْعُ هُوَ:', ['أَقْوالٌ وَأَفْعالٌ نَلْتَزِمُ بِها', 'لُعْبَةٌ', 'طَعامٌ'], 0),
     ('يَدُلُّ السَّنْعُ عَلى:', ['هُوِيَّتِنا الْوَطَنِيَّةِ', 'الطَّقْسِ', 'الْوَقْتِ'], 0)]
S.append(frame('quick', 'lav', '⚡ 4 أَسْئِلَةٍ', '3 دَقائِقَ', 'تَحَدّي حِراءَ السَّريعُ',
  abs_(100, 270, 1700, ''.join('<div style="background:#fff;border:3px solid #5546A3;border-radius:24px;padding:12px 24px;display:flex;flex-direction:row;align-items:center;gap:18px;width:1700px">' + P(f'{k + 1}', 34, '#5546A3', True, True) + P(q, 30, '#1F2A3C', True, False, 'right', 'flex:1') +
     ''.join(f'<p style="font-size:24px;color:#1F2A3C;background:{"#DDF1EC" if i == a else "#F3F0FB"};border-radius:18px;padding:8px 14px">{o}{" ✓" if i == a else ""}</p>' for i, o in enumerate(os_)) + '</div>' for k, (q, os_, a) in enumerate(Q)), 'flex-direction:column;gap:16px'),
  'اقرأ السؤال ودع الطلاب يجيبون على ألواحهم، ثم اكشف الإجابة الصحيحة.', FOOT))

# 26 exit
S.append(frame('exit', 'rose', '🎟️ أُجيبُ وَحْدي', '3 دَقائِقَ', 'تَذْكِرَةُ الْخُروجِ',
  abs_(100, 270, 1700, ''.join('<div style="background:#fff;border:3px solid #B4483F;border-radius:24px;padding:18px 28px;display:flex;flex-direction:row;gap:18px;width:1700px;align-items:center">' + P(f'{k + 1}', 36, '#B4483F', True, True) + P(t, 32, '#1F2A3C', False, False, 'right', 'flex:1') + '</div>' for k, t in enumerate((
     'أُكْمِلُ: السَّنْعُ هُوَ أَقْوالٌ وَ …… نَلْتَزِمُ بِها.', 'ماذا أَقولُ إِذا ناداني أَحَدٌ؟  (أ) نَعَمْ   (ب) لا أُجيبُ   (ج) أَصيحُ',
     'أَكْتُبُ مِثالًا آخَرَ عَلى السَّنْعِ مِنْ بَيْتي أَوْ مَدْرَسَتي.'))), 'flex-direction:column;gap:20px') +
  abs_(100, 760, 1700, P('تُجْمَعُ الْبِطاقاتُ لِنَبْدَأَ بِها الدَّرْسَ الْقادِمَ.', 26, '#8A8475'), 'justify-content:center'),
  'يجيب كل طالب وحده في البطاقة. الإجابات: أفعال / (أ) / إجابات مفتوحة.', FOOT))

# 27 progress2, 28 mirror, 29 home
S.append(progress('progress2', 'قِياسُ التَّقَدُّمِ: بَعْدَ الدَّرْسِ', 'أَخْتارُ الْوَجْهَ مَرَّةً أُخْرى، وَأُقارِنُ بِبِدايَةِ الْحِصَّةِ.', '2 دَقيقَتانِ'))
S.append(frame('mirror', 'sand', '🪞 مِرْآةُ التَّعَلُّمِ', '2 دَقيقَتانِ', 'ماذا تَعَلَّمْتُ؟',
  abs_(100, 270, 1700, ''.join('<div data-build-in="pop %d" style="background:#fff;border:3px solid %s;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:8px;width:1700px">' % (k + 1, c) + P(a, 32, c, True, True, 'right') + P(b, 32, '#1F2A3C', False, False, 'right') + '</div>' for k, (a, b, c) in enumerate((
     ('🪞 تَعَلَّمْتُ الْيَوْمَ', 'أَنَّ السَّنْعَ أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها.', '#B0782A'),
     ('❓ أَتَساءَلُ', 'لِماذا يُهِمُّنا السَّنْعُ؟ نَتَعَلَّمُهُ في الدَّرْسِ الْقادِمِ.', '#5546A3'),
     ('🔬 أَرْبِطُ', 'الْأَخْلاقُ: السَّنْعُ مِنَ الْأَخْلاقِ الْحَسَنَةِ في تَعامُلِنا.', '#1F7A6D')))), 'flex-direction:column;gap:22px'),
  'اطلب من ثلاثة طلاب إكمال الجمل شفويًّا.', FOOT))
S.append(frame('home', 'peach', '🏠 مَعَ أُسْرَتي', None, 'رِسالَتي إِلى الْبَيْتِ',
  abs_(100, 270, 1700, '<div style="background:#fff;border:3px solid #B0582F;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:14px;width:1700px">'
       + P('☐ أَسْأَلُ أُسْرَتي: ماذا نَقولُ عِنْدَما يُناديني أَحَدٌ؟', 34, '#1F2A3C', False, False, 'right')
       + P('☐ كِتابي ص 18: أُسَجِّلُ صِفَةً أَوْ قيمَةً مِنْ قِيَمِ السَّنْعِ أَعْتَزُّ بِها في شَخْصِيَّتي.', 34, '#1F2A3C', False, False, 'right') + '</div>') +
  abs_(100, 600, 1700, '<div style="background:#FFE9A8;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:6px;width:1700px">' + P('📸 مُهِمَّةُ أَداءٍ صَغيرَةٌ', 30, '#8A5A1E', True, True, 'right') + P('أُمَثِّلُ لِأُسْرَتي مَوْقِفًا فيهِ سَنْعٌ، وَأَقولُ: ماذا فَعَلْتُ؟ وَلِماذا؟', 34, '#1F2A3C', True, False, 'right') + '</div>') +
  abs_(100, 800, 1700, P('⭐ أَحْسَنْتَ يا بَطَلَ حِراءَ', 40, '#B0582F', True, True), 'justify-content:center'),
  'ذكّر الطلاب بالمهمة. نشاط ص 18 من الكتاب مذكور حرفيًّا في صياغة الكتاب.', FOOT))

if __name__ == '__main__':
    out = '/home/claude/hira/resources/ssd/%s/teacher-deck.html' % CODE
    import os; os.makedirs(os.path.dirname(out), exist_ok=True)
    print('slides', build(out, TITLE, LESSON_ID, S), '->', out)
