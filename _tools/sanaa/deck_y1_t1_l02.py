#!/usr/bin/env python3
# Sanaa · Y1 · T1 · L02 «أهمية السنع» (book p.17) — teacher deck. Book text exact; other wording is Hiraa's.
import sys, os
sys.path.insert(0, '/home/claude/hira/_tools/sanaa')
import deck_y1_t1_l01 as b
from deckkit import *

CODE = 'SN-Y1-T1-L02'
LESSON_ID = '533d7f7b-22cd-4ad2-a822-1ed93ae69760'
TITLE = 'أَهَمِّيَّةُ السَّنْعِ'
FOOT = 'أَهَمِّيَّةُ السَّنْعِ · السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ'
PIC = '../../sn/g1/SN-Y1-T1-L01/'
GOAL = 'أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ الْإِماراتِيِّ.'
b.FOOT = FOOT
b.LV = [('⭐', 'مُبْتَدِئٌ', 'أَذْكُرُ فائِدَةً واحِدَةً لِلسَّنْعِ.', '#B0782A'),
        ('⭐⭐', 'مُتَطَوِّرٌ', 'أَذْكُرُ فائِدَتَيْنِ مِنْ فَوائِدِ السَّنْعِ وَأَشْرَحُ إِحْداهُما.', '#5E6672'),
        ('⭐⭐⭐', 'مُتَمَكِّنٌ', 'أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ مِنْ صورَةٍ أَوْ مَوْقِفٍ وَأُفَسِّرُ.', '#5546A3')]
LV = b.LV
P4 = [('🇦🇪', 'تَعْزيزُ حُبِّ الْوَطَنِ وَالِانْتِماءِ إِلَيْهِ'), ('💛', 'نَشْرُ الْأَخْلاقِ الْحَميدَةِ في الْمُجْتَمَعِ'),
      ('👨‍👩‍👧‍👦', 'تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ'), ('🌟', 'تَعْزيزُ قُدُراتِ الْفَرْدِ عَلى التَّواصُلِ وَالْإِنْتاجِ وَالْإِبْداعِ')]
T_A = ('يتوارث أهل الإمارات جيلًا بعد جيل مجموعة من العادات والتقاليد الاجتماعية الأصيلة، تُعدّ أسلوب حياة متأصلًا في مجتمع دولة الإمارات العربية المتحدة منذ القدم، '
       'وأصبحت من مكوّنات الصفات الشخصية التي تميّز مجتمع الإمارات عن بقية شعوب ومجتمعات العالم، فالالتزام بالسنع الإماراتي تنبع أهميته مما يأتي:')
S = []

# cover
S.append(
 '<section class="sl" id="cover" style="background:#FFF8EA;color:#1F2A3C;' + TXT + ';padding:0;direction:rtl;overflow:hidden">'
 '<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:linear-gradient(180deg,#FFE9C2 0%,#FFF8EA 55%,#F3E9D2 100%)"></div>'
 '<div style="position:absolute;left:-60px;bottom:-280px;width:1200px;height:560px;border-radius:50%;background:#B0782A;opacity:.12"></div>'
 '<div style="position:absolute;left:56px;top:34px;display:flex"><img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:240px;height:96px;object-fit:contain"></div>'
 '<div style="position:absolute;left:120px;top:250px;width:640px;height:520px;border-radius:40px;background:#fff;box-shadow:0 16px 40px rgba(31,42,60,.14);padding:18px;display:flex"><img src="' + PIC + 'night.webp" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:28px"></div>'
 '<div style="position:absolute;right:110px;top:190px;width:1000px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">'
 + P('السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ', 34, '#B0782A', True, False, 'right')
 + '<h1 style="' + FONT + ';font-size:96px;line-height:1.3;text-align:right">' + TITLE + '</h1>'
 + P('الْمِحْوَرُ الْأَوَّلُ: ثانِيًا: أَهَمِّيَّةُ السَّنْعِ · كِتابي ص 17', 30, '#5B6472', False, False, 'right')
 + '<div style="background:#fff;border:3px solid #B0782A;border-radius:28px;padding:20px 30px;margin-top:20px;display:flex">' + P('🎯 ' + GOAL, 38, '#1F2A3C', True, True, 'right') + '</div>'
 '</div><aside>اقرأ العنوان بصوت واضح، واطلب من الطلاب فتح الكتاب على الصفحة 17.</aside></section>')

# retrieve
S.append(frame('retrieve', 'sky', '🔁 نَتَذَكَّرُ مَعًا', '3 دَقائِقَ', 'ماذا تَعَلَّمْنا؟',
  b.cards_row([('🗣️', 'السَّنْعُ', 'أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها'), ('📣', 'إِذا ناداني أَحَدٌ', 'أَقولُ: نَعَمْ أَوْ لَبَّيْهِ')], 700, 380, 'sky', 40, 300)
  + abs_(100, 740, 1500, P('🔬 الْيَوْمَ نَسْأَلُ: لِماذا يُهِمُّنا السَّنْعُ؟', 34, '#1B7F9E', True, True), 'background:#fff;border-radius:26px;padding:16px 26px;justify-content:center'),
  'راجع الدرس السابق شفويًّا (تعريف السنع ومثاله) من ص 17.', FOOT))

# hook
S.append(frame('hook', 'peach', '✨ لَحْظَةُ فُضولٍ', '4 دَقائِقَ', 'لِماذا يُهِمُّنا؟',
  abs_(100, 290, 1500, P('🤔 لَوْ لَمْ يَلْتَزِمِ النّاسُ بِالْأَقْوالِ وَالْأَفْعالِ الْجَميلَةِ… ماذا يَحْدُثُ؟', 42, '#B0582F', True, True) +
       P('خَمِّنْ ثُمَّ شارِكْ زَميلَكَ.', 34, '#1F2A3C'), 'flex-direction:column;gap:20px;align-items:center') +
  abs_(100, 560, 1500, '<div style="display:flex;flex-direction:row;gap:30px">' +
       ''.join(f'<p style="font-size:30px;color:#1F2A3C;background:#fff;border-radius:24px;padding:12px 26px">{t}</p>' for t in ('💭 أُفَكِّرُ وَحْدي', '🗣️ أُخْبِرُ زَميلي', '👥 نُشارِكُ الصَّفَّ')) + '</div>', 'justify-content:center') +
  abs_(100, 730, 1500, '<div data-build-in="pop 1" style="background:#FFE9A8;border-radius:28px;padding:20px 34px;display:flex">' + P('✨ لِلسَّنْعِ أَهَمِّيَّةٌ كَبيرَةٌ في حَياتِنا، فَلْنَكْتَشِفْها!', 38, '#8A5A1E', True, True) + '</div>', 'justify-content:center'),
  'فكّر – زاوج – شارك. إجابات الطلاب مفتوحة، ولا تكشف أهمية السنع قبل قراءة النص.', FOOT))

# goal, journey, progress
lv_cards = ''.join(f'<div data-build-in="pop {k + 1}">' + card(P(st, 44) + P(nm, 36, col, True, True) + P(tx, 29, '#1F2A3C'), 520, 360, '#fff', col) + '</div>' for k, (st, nm, tx, col) in enumerate(LV))
S.append(frame('goal', 'sand', '🎯 وِجْهَتُنا', '2 دَقيقَتانِ', 'وِجْهَتُنا الْيَوْمَ',
  abs_(100, 260, 1700, '<div style="background:#fff;border:3px solid #B0782A;border-radius:26px;padding:16px 28px;display:flex">' + P('🎯 ' + GOAL, 40, '#1F2A3C', True, True) + '</div>', 'justify-content:center') +
  abs_(100, 430, 1700, lv_cards, 'flex-direction:row;gap:28px;justify-content:center'), 'اقرأ الهدف ووضّح ماذا يعني كل مستوى.', FOOT))
S.append(b.S[4])  # journey (generic)
S.append(b.progress('progress', 'قِياسُ التَّقَدُّمِ: قَبْلَ الدَّرْسِ', 'أَخْتارُ الْوَجْهَ الَّذي يُشْبِهُني:  😟 لا أَعْرِفُ بَعْدُ · 🙂 أَعْرِفُ قَليلًا · 😀 أَعْرِفُ جَيِّدًا', '2 دَقيقَتانِ'))

# vocab
S.append(frame('vocab', 'mint', '🔑 مَفاتيحُ الدَّرْسِ', '5 دَقائِقَ', 'كَلِماتٌ جَديدَةٌ',
  b.cards_row([('🏘️', 'الْمُجْتَمَعُ', 'ناسٌ يَعيشونَ مَعًا في مَكانٍ واحِدٍ'), ('🇦🇪', 'الْهُوِيَّةُ الْوَطَنِيَّةُ', 'ما يُعَرِّفُ بِوَطَني'),
               ('💛', 'الْأَخْلاقُ', 'صِفاتٌ حَسَنَةٌ في تَعامُلي مَعَ النّاسِ'), ('👨‍👩‍👧‍👦', 'الْأُسْرَةُ', 'أَبي وَأُمّي وَإِخْوَتي')], 400, 430, 'mint', 24, 280, 34),
  'الكلمات من «المفاهيم والمصطلحات» ص 16؛ التعريفات المبسطة من إعداد حراء.', FOOT))

# text1, text2 (exact)
S.append(b.textslide('text1', 'نَصُّ الدَّرْسِ (1)', P(T_A, 40, '#1F2A3C', False, False, 'right', 'line-height:1.75'),
  'اقرأ النص قراءة معبّرة والطلاب يتابعون في الكتاب ص 17 (نص الكتاب كما ورد).'))
pts = ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex;flex-direction:row;align-items:center;gap:20px;background:#FFF8EA;border-radius:22px;padding:10px 24px">' + P(f'{k + 1}', 40, '#B0782A', True, True) + P(t, 36, '#1F2A3C', False, False, 'right', 'flex:1') + '</div>'
              for k, t in enumerate(('تعزيز حب الوطن والانتماء إليه.', 'نشر الأخلاق الحميدة في المجتمع.', 'تقوية الروابط الأسرية.', 'تعزيز قدرات الفرد على التواصل والإنتاج والإبداع.')))
S.append(b.textslide('text2', 'أَهَمِّيَّةُ السَّنْعِ: أَرْبَعُ فَوائِدَ', pts, 'اقرأ النقاط الأربع من الكتاب ص 17 بنصها، ثم اطلب من الطلاب ترتيبها بكلماتهم.'))
S.append(frame('text3', 'blue', '🔎 نَفْهَمُ مَعًا', '4 دَقائِقَ', 'كُلُّ فائِدَةٍ لَها رَمْزٌ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(e, 80) + P(t, 30, '#1F2A3C', True, True), 400, 400, '#fff', '#2F6A9A') + '</div>' for k, (e, t) in enumerate(P4)), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 740, 1700, P('🗣️ أُعَبِّرُ بِكَلِماتي: أَيُّ فائِدَةٍ أُحِبُّها أَكْثَرَ؟ وَلِماذا؟', 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'),
  'الرموز من إعداد حراء لتقريب المعنى؛ والنقاط نصّ الكتاب. إجابات الطلاب مفتوحة.', FOOT))

# model
S.append(frame('model', 'blue', '👩‍🏫 شاهِدْني أُطَبِّقُ', '5 دَقائِقَ', 'أَسْتَنْتِجُ الْفائِدَةَ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="flex:1;display:flex">' + card(P(e, 64) + P(a, 34, '#2F6A9A', True, True) + P(c, 32, '#1F2A3C'), 540, 330, '#fff', '#2F6A9A') + '</div>' for k, (e, a, c) in enumerate([
      ('🇦🇪', 'أَرى الْعَلَمَ', 'أُحِبُّ وَطَني: حُبُّ الْوَطَنِ وَالِانْتِماءُ'), ('🤝', 'أُساعِدُ زَميلي', 'أَنْشُرُ الْأَخْلاقَ الْحَميدَةَ'), ('🏠', 'أَجْلِسُ مَعَ أُسْرَتي', 'أُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ')])), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 640, 1700, P('💡 أَرى مَوْقِفًا ثُمَّ أَسْأَلُ: أَيُّ فائِدَةٍ مِنْ فَوائِدِ السَّنْعِ هُنا؟', 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:16px 28px;justify-content:center'),
  'نمذج الاستنتاج بصوت مسموع: أرى الموقف، أسأل، ثم أربطه بفائدة من النقاط الأربع.', FOOT))

# together (p19 activity) with 2 of the book's pictures
pics2 = ''.join(f'<div data-build-in="pop {k + 1}" style="width:600px;height:380px;border-radius:32px;background:#fff;box-shadow:0 12px 32px rgba(31,42,60,.10);padding:14px;flex:none;display:flex"><img src="{PIC}{f}.webp" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:22px"></div>' for k, f in enumerate(('family', 'night')))
S.append(frame('together', 'blue', '🤝 نُطَبِّقُ مَعًا', '7 دَقائِقَ', 'أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ مِنَ الصُّوَرِ',
  abs_(100, 290, 1700, pics2, 'flex-direction:row;gap:60px;justify-content:center') +
  abs_(100, 730, 1700, P('👆 ماذا أَرى؟ أَيُّ فائِدَةٍ مِنْ فَوائِدِ السَّنْعِ أَسْتَنْتِجُ؟', 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center') +
  abs_(100, 850, 1700, P('📘 كِتابي ص 19: أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ الْإِماراتِيِّ مِنَ الصُّوَرِ.', 28, '#1F7A6D', True), 'justify-content:center'),
  'صورتان من نشاط الكتاب ص 19. دع الطلاب يصفون ما يرون ثم يستنتجون؛ ولا تفرض تفسيرًا واحدًا.', FOOT))

# check
S.append(frame('check', 'mint', '🚦 إِشارَةُ الِانْطِلاقِ', '2 دَقيقَتانِ', 'أَيُّ الْمَوْقِفَيْنِ يُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ؟',
  abs_(100, 270, 1700, ''.join(card(P(e, 84) + P(l, 34, '#1F7A6D', True, True) + P(t, 32, '#1F2A3C'), 700, 380, '#fff', '#1F7A6D') for e, l, t in (
      ('👨‍👩‍👧‍👦', '(أ)', 'نَجْلِسُ مَعًا وَنَتَحَدَّثُ بِاحْتِرامٍ'), ('📱', '(ب)', 'كُلٌّ مِنّا مَشْغولٌ وَحْدَهُ'))), 'flex-direction:row;gap:60px;justify-content:center') +
  abs_(100, 690, 1700, '<div data-build-in="pop 1" style="background:#1F7A6D;border-radius:26px;padding:12px 30px;display:flex">' + P('✅ (أ): نَلْتَزِمُ بِالسَّنْعِ فَتَقْوى الرَّوابِطُ الْأُسَرِيَّةُ.', 34, '#fff', True, True) + '</div>', 'justify-content:center') +
  abs_(100, 800, 1700, P('🟥 أَحْتاجُ مُساعَدَةً     🟨 قَليلًا     🟩 جاهِزٌ', 30, '#1F2A3C', True), 'justify-content:center'),
  'يرفع كل طالب بطاقة (أ) أو (ب). الموقفان من إعداد حراء.', FOOT))

# true/false
tf = [('مِنْ أَهَمِّيَّةِ السَّنْعِ تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ.', '👍 صَحيحٌ'), ('السَّنْعُ يُعَزِّزُ حُبَّ الْوَطَنِ وَالِانْتِماءَ إِلَيْهِ.', '👍 صَحيحٌ'),
      ('السَّنْعُ لا عَلاقَةَ لَهُ بِالْأَخْلاقِ.', '👎 خَطَأٌ'), ('السَّنْعُ يَمْنَعُ الْفَرْدَ مِنَ التَّواصُلِ مَعَ النّاسِ.', '👎 خَطَأٌ')]
S.append(frame('truefalse', 'rose', '👍👎 أُفَكِّرُ وَأُصَحِّحُ', '3 دَقائِقَ', 'صَحيحٌ أَمْ خَطَأٌ؟',
  abs_(100, 270, 1700, ''.join(f'<div style="display:flex;flex-direction:row;align-items:center;gap:20px;background:#fff;border-radius:24px;padding:12px 24px;border:3px solid #B4483F"><p style="{FONT};font-size:34px;color:#B4483F">{k + 1}</p>' + P(s, 32, '#1F2A3C', False, False, 'right', 'flex:1') + f'<div data-build-in="pop {k + 1}" style="background:#F9DAD6;border-radius:20px;padding:6px 18px;display:flex">' + P(a, 30, '#B4483F', True, True) + '</div></div>' for k, (s, a) in enumerate(tf)), 'flex-direction:column;gap:18px'),
  'الصحيح مأخوذ من النقاط الأربع (ص 17). صوّبوا العبارتين الخاطئتين معًا.', FOOT))

# groups
G = [('g1', '⭐', 'مُبْتَدِئٌ', 'نَذْكُرُ فائِدَةً', '#B0782A', 'sand'), ('g2', '⭐⭐', 'مُتَطَوِّرٌ', 'نَشْرَحُ فائِدَتَيْنِ', '#5E6672', 'blue'),
     ('g3', '⭐⭐⭐', 'مُتَمَكِّنٌ', 'نَسْتَنْتِجُ مِنْ مَوْقِفٍ', '#5546A3', 'lav'), ('g4', '🌱', 'قيمَةٌ', 'نُمَثِّلُ الْفائِدَةَ', '#1F7A6D', 'mint')]
S.append(frame('groups', 'sky', '👥 خَريطَةُ الْمَجْموعاتِ', '10 دَقائِقَ', 'نَعْمَلُ مَعًا',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(st, 52) + P('الْمَجْموعَةُ ' + str(k + 1), 32, col, True, True) + P(t, 28, '#1F2A3C') + P(nm, 26, col, True), 400, 400, '#fff', col) + '</div>' for k, (sid, st, nm, t, col, p) in enumerate(G)), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 730, 1700, P('🧭 الْقائِدُ     ✏️ الرَّسّامُ     🗣️ الْمُتَحَدِّثُ     ⏰ حارِسُ الْوَقْتِ', 32, '#1B7F9E', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'),
  'وزّع الأدوار الأربعة داخل كل مجموعة.', FOOT))
GT = {'g1': ('نَذْكُرُ فائِدَةً', ['١) نَقْرَأُ النِّقاطَ الْأَرْبَعَ في كِتابِنا ص 17.', '٢) نَخْتارُ فائِدَةً وَنَرْسُمُ لَها رَمْزًا.'], 'مَنْ يَذْكُرُ الْفَوائِدَ الْأَرْبَعَ مِنْ غَيْرِ النَّظَرِ؟'),
      'g2': ('نَشْرَحُ فائِدَتَيْنِ', ['١) نَخْتارُ فائِدَتَيْنِ مِنَ الْأَرْبَعِ.', '٢) نَشْرَحُ كُلَّ فائِدَةٍ بِمِثالٍ مِنْ حَياتِنا.'], 'اشْرَحْ لِزَميلٍ لِماذا يُهِمُّنا السَّنْعُ.'),
      'g3': ('نَسْتَنْتِجُ مِنْ مَوْقِفٍ', ['١) نَنْظُرُ إِلى صورَةِ كِتابِنا ص 19 وَنَصِفُها.', '٢) نَسْتَنْتِجُ أَيَّ فائِدَةٍ لِلسَّنْعِ تُمَثِّلُها وَنَقولُ لِماذا.'], 'اقْتَرِحوا مَوْقِفًا آخَرَ يُظْهِرُ فائِدَةً لِلسَّنْعِ.'),
      'g4': ('نُمَثِّلُ الْفائِدَةَ', ['١) نُمَثِّلُ مَشْهَدًا يُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ.', '٢) نُمَثِّلُ مَشْهَدًا يَنْشُرُ الْأَخْلاقَ الْحَميدَةَ.'], 'ماذا نَشْعُرُ حينَ يَلْتَزِمُ الْجَميعُ بِالسَّنْعِ؟')}
for k, (sid, st, nm, t, col, pal) in enumerate(G):
    ttl, steps_, ch = GT[sid]
    S.append(frame(sid, pal, '👥 عَمَلٌ جَماعِيٌّ', '10 دَقائِقَ', f'الْمَجْموعَةُ {k + 1}: {ttl}',
      abs_(100, 280, 1700, ''.join(f'<div data-build-in="pop {i + 1}" style="background:#fff;border:3px solid {col};border-radius:26px;padding:20px 30px;display:flex;width:1700px">' + P(s, 36, '#1F2A3C', False, False, 'right', 'line-height:1.6') + '</div>' for i, s in enumerate(steps_)), 'flex-direction:column;gap:22px') +
      abs_(100, 690, 1700, '<div data-build-in="pop 3" style="background:' + PAL[pal][2] + ';border-radius:26px;padding:18px 30px;display:flex;flex-direction:column;gap:6px;width:1700px">' + P('★ تَحَدّي الْأَبْطالِ', 30, col, True, True, 'right') + P(ch, 34, '#1F2A3C', True, False, 'right') + '</div>'),
      'تجوّل بين المجموعات واطرح أسئلة موجّهة.', FOOT))

MA = [('g1', 'الْفَوائِدُ: حُبُّ الْوَطَنِ وَالِانْتِماءُ، نَشْرُ الْأَخْلاقِ الْحَميدَةِ، تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ، تَعْزيزُ قُدُراتِ الْفَرْدِ عَلى التَّواصُلِ وَالْإِنْتاجِ وَالْإِبْداعِ (نَصُّ الْكِتابِ).'),
      ('g2', 'مِثالٌ: السَّنْعُ يُقَوّي الرَّوابِطَ الْأُسَرِيَّةِ حينَ نَجْلِسُ مَعًا وَنَتَحَدَّثُ بِاحْتِرامٍ. (إِجابَةٌ مُقْتَرَحَةٌ)'),
      ('g3', 'إِجابَةٌ مَفْتوحَةٌ: تُقْبَلُ كُلُّ إِجابَةٍ تَرْبِطُ الصّورَةَ بِفائِدَةٍ مِنَ النِّقاطِ الْأَرْبَعِ وَتُعَلِّلُ.'),
      ('g4', 'تَمْثيلٌ حُرٌّ يُظْهِرُ الْفائِدَةَ الْمَطْلوبَةَ. (إِجابَةٌ مَفْتوحَةٌ)')]
S.append(frame('models', 'mint', '✅ نَتَحَقَّقُ مَعًا', '4 دَقائِقَ', 'نَماذِجُ الْإِجابَةِ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="background:#fff;border:3px solid #1F7A6D;border-radius:24px;padding:14px 26px;display:flex;flex-direction:row;gap:20px;align-items:center;width:1700px">' + P(f'الْمَجْموعَةُ {k + 1}', 30, '#1F7A6D', True, True, 'right', 'flex:none;width:260px') + P(t, 28, '#1F2A3C', False, False, 'right', 'flex:1;line-height:1.5') + '</div>' for k, (g, t) in enumerate(MA)), 'flex-direction:column;gap:18px'),
  'اكشف النموذج بعد عرض كل مجموعة. نماذج المجموعات 2–4 مقترحة من حراء وليست من الكتاب.', FOOT))

S.append(b.S[[s.split('id="')[1].split('"')[0] for s in b.S].index('feedback')])

LW = [('⭐', 'مُبْتَدِئٌ', ['✏️ أُلَوِّنُ رَمْزَ فائِدَةٍ.', '✏️ أَصِلُ الْفائِدَةَ بِرَمْزِها.'], '#B0782A'),
      ('⭐⭐', 'مُتَطَوِّرٌ', ['✏️ أُكْمِلُ: يُقَوّي السَّنْعُ …', '✏️ أَكْتُبُ مِثالًا مِنْ بَيْتي.'], '#5E6672'),
      ('⭐⭐⭐', 'مُتَمَكِّنٌ', ['✏️ أَشْرَحُ فائِدَتَيْنِ لِلسَّنْعِ.', '✏️ أَرْسُمُ مَوْقِفًا يُظْهِرُ فائِدَةً.'], '#5546A3')]
S.append(frame('levels', 'peach', '🚀 تَحَدّي الْمُسْتَوَياتِ', '10 دَقائِقَ', 'كُلٌّ في مُسْتَواهُ',
  abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(st, 44) + P(nm, 34, col, True, True) + ''.join(P(x, 28, '#1F2A3C') for x in xs), 540, 400, '#fff', col) + '</div>' for k, (st, nm, xs, col) in enumerate(LW)), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 730, 1700, P('🏆 تَحَدٍّ: أُقْنِعُ زَميلي بِأَهَمِّيَّةِ السَّنْعِ في جُمْلَتَيْنِ.', 32, '#B0582F', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'),
  'وزّع الأوراق الثلاث وورقة أصحاب الهمم.', FOOT))

S.append(frame('value', 'mint', '🌱 قيمَةٌ نَعيشُها', '4 دَقائِقَ', 'السَّنْعُ يَجْمَعُنا',
  b.cards_row([('🛡️', 'الْوَلاءُ', 'أُحِبُّ وَطَني وَأُحافِظُ عَلَيْهِ'), ('🎁', 'الْكَرَمُ', 'أُعْطي وَأُكْرِمُ مَنْ حَوْلي'), ('🤲', 'التَّعاوُنُ', 'أُساعِدُ أُسْرَتي وَزُمَلائي')], 520, 340, 'mint', 28, 280) +
  abs_(100, 650, 1700, P('🤔 كَيْفَ يَجْعَلُنا السَّنْعُ أَقْرَبَ إِلى بَعْضِنا؟', 32, '#5546A3', True, True), 'background:#fff;border-radius:26px;padding:16px 28px;justify-content:center'),
  'قيم المحور من الكتاب ص 16. إجابات الطلاب مفتوحة.', FOOT))

S.append(frame('watani', 'sky', '🇦🇪 أَنا مُواطِنٌ إيجابِيٌّ', '3 دَقائِقَ', 'مِنْ دَرْسي إِلى وَطَني',
  abs_(100, 280, 1700, card(P('🏠 السَّنْعُ يُعَزِّزُ حُبَّ الْوَطَنِ وَالِانْتِماءَ إِلَيْهِ', 42, '#1B7F9E', True, True), 1700, 200, '#fff', '#1B7F9E')) +
  abs_(100, 540, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="background:#fff;border-radius:26px;padding:16px 28px;display:flex">' + P(t, 32, '#1F2A3C', True, True) + '</div>' for k, t in enumerate(('❤️ أُحِبُّ وَطَني', '🗣️ أَلْتَزِمُ بِسَنْعي', '🤲 أُعَلِّمُ غَيْري'))), 'flex-direction:row;gap:26px;justify-content:center') +
  abs_(100, 760, 1700, P('💡 كَيْفَ أَنْشُرُ الْأَخْلاقَ الْحَميدَةَ في مَدْرَسَتي هٰذا الْأُسْبوعَ؟', 32, '#1B7F9E', True, True), 'justify-content:center'),
  'الجملة الأولى من نقاط الأهمية في الكتاب ص 17.', FOOT))

Q = [('مِنْ أَهَمِّيَّةِ السَّنْعِ:', ['تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ', 'زِيادَةُ الضَّجيجِ', 'تَرْكُ الْأَدَبِ'], 0),
     ('يُعَزِّزُ السَّنْعُ:', ['حُبَّ الْوَطَنِ وَالِانْتِماءَ', 'الْإِهْمالَ', 'الْكَسَلَ'], 0),
     ('يَنْشُرُ السَّنْعُ في الْمُجْتَمَعِ:', ['الْأَخْلاقَ الْحَميدَةَ', 'الْخِصامَ', 'الْفَوْضى'], 0),
     ('يُعَزِّزُ السَّنْعُ قُدُراتِ الْفَرْدِ عَلى:', ['التَّواصُلِ وَالْإِنْتاجِ وَالْإِبْداعِ', 'النَّوْمِ فَقَطْ', 'الْغِيابِ'], 0)]
S.append(frame('quick', 'lav', '⚡ 4 أَسْئِلَةٍ', '3 دَقائِقَ', 'تَحَدّي حِراءَ السَّريعُ',
  abs_(100, 270, 1700, ''.join('<div style="background:#fff;border:3px solid #5546A3;border-radius:24px;padding:12px 24px;display:flex;flex-direction:row;align-items:center;gap:18px;width:1700px">' + P(f'{k + 1}', 34, '#5546A3', True, True) + P(q, 30, '#1F2A3C', True, False, 'right', 'flex:1') +
     ''.join(f'<p style="font-size:24px;color:#1F2A3C;background:#F3F0FB;border-radius:18px;padding:8px 14px">{o}</p>' for o in os_) + '</div>' for k, (q, os_, a) in enumerate(Q)), 'flex-direction:column;gap:16px'),
  'اقرأ السؤال ودع الطلاب يجيبون على ألواحهم. الإجابة الصحيحة دائمًا الخيار الأول (من نقاط ص 17)؛ بدّل ترتيب الخيارات شفويًّا عند التنفيذ.', FOOT))

S.append(frame('exit', 'rose', '🎟️ أُجيبُ وَحْدي', '3 دَقائِقَ', 'تَذْكِرَةُ الْخُروجِ',
  abs_(100, 270, 1700, ''.join('<div style="background:#fff;border:3px solid #B4483F;border-radius:24px;padding:18px 28px;display:flex;flex-direction:row;gap:18px;width:1700px;align-items:center">' + P(f'{k + 1}', 36, '#B4483F', True, True) + P(t, 32, '#1F2A3C', False, False, 'right', 'flex:1') + '</div>' for k, t in enumerate((
     'أُكْمِلُ: يُقَوّي السَّنْعُ الرَّوابِطَ …… .', 'أَذْكُرُ فائِدَةً أُخْرى لِلسَّنْعِ.', 'لِماذا يُهِمُّني أَنْ أَلْتَزِمَ بِالسَّنْعِ؟'))), 'flex-direction:column;gap:20px') +
  abs_(100, 760, 1700, P('تُجْمَعُ الْبِطاقاتُ لِنَبْدَأَ بِها الدَّرْسَ الْقادِمَ.', 26, '#8A8475'), 'justify-content:center'),
  'الإجابات: الأسرية / إحدى النقاط الأربع / إجابة مفتوحة.', FOOT))

S.append(b.progress('progress2', 'قِياسُ التَّقَدُّمِ: بَعْدَ الدَّرْسِ', 'أَخْتارُ الْوَجْهَ مَرَّةً أُخْرى، وَأُقارِنُ بِبِدايَةِ الْحِصَّةِ.', '2 دَقيقَتانِ'))
S.append(frame('mirror', 'sand', '🪞 مِرْآةُ التَّعَلُّمِ', '2 دَقيقَتانِ', 'ماذا تَعَلَّمْتُ؟',
  abs_(100, 270, 1700, ''.join('<div data-build-in="pop %d" style="background:#fff;border:3px solid %s;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:8px;width:1700px">' % (k + 1, c) + P(a, 32, c, True, True, 'right') + P(t, 32, '#1F2A3C', False, False, 'right') + '</div>' for k, (a, t, c) in enumerate((
     ('🪞 تَعَلَّمْتُ الْيَوْمَ', 'أَنَّ لِلسَّنْعِ أَرْبَعَ فَوائِدَ تَنْفَعُني وَتَنْفَعُ مُجْتَمَعي.', '#B0782A'),
     ('❓ أَتَساءَلُ', 'ما قِيَمُ السَّنْعِ وَمَبادِئُهُ؟ نَتَعَلَّمُها في الدَّرْسِ الْقادِمِ.', '#5546A3'),
     ('🔬 أَرْبِطُ', 'الْهُوِيَّةُ الْوَطَنِيَّةُ: السَّنْعُ يُعَزِّزُ الِانْتِماءَ لِلْوَطَنِ.', '#1F7A6D')))), 'flex-direction:column;gap:22px'),
  'اطلب من ثلاثة طلاب إكمال الجمل شفويًّا.', FOOT))
S.append(frame('home', 'peach', '🏠 مَعَ أُسْرَتي', None, 'رِسالَتي إِلى الْبَيْتِ',
  abs_(100, 270, 1700, '<div style="background:#fff;border:3px solid #B0582F;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:14px;width:1700px">'
       + P('☐ أُخْبِرُ أُسْرَتي بِفائِدَتَيْنِ لِلسَّنْعِ.', 34, '#1F2A3C', False, False, 'right')
       + P('☐ كِتابي ص 19–21: أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ مِنَ الصُّوَرِ وَأُعَبِّرُ بِالرَّسْمِ عَنْ سَنْعِ احْتِرامِ الْأَكْبَرِ سِنًّا.', 34, '#1F2A3C', False, False, 'right') + '</div>') +
  abs_(100, 600, 1700, '<div style="background:#FFE9A8;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:6px;width:1700px">' + P('📸 مُهِمَّةُ أَداءٍ صَغيرَةٌ', 30, '#8A5A1E', True, True, 'right') + P('أُمَثِّلُ لِأُسْرَتي مَوْقِفًا يُظْهِرُ فائِدَةً لِلسَّنْعِ، وَأَقولُ: أَيُّ فائِدَةٍ؟', 34, '#1F2A3C', True, False, 'right') + '</div>') +
  abs_(100, 800, 1700, P('⭐ أَحْسَنْتَ يا بَطَلَ حِراءَ', 40, '#B0582F', True, True), 'justify-content:center'),
  'نشاط ص 19–21 كما ورد في الكتاب.', FOOT))

OLDF = 'مَفْهومُ السَّنْعِ الْإِماراتِيِّ · السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ'
S = [x.replace(OLDF, FOOT) for x in S]

if __name__ == '__main__':
    out = '/home/claude/hira/resources/ssd/%s/teacher-deck.html' % CODE
    os.makedirs(os.path.dirname(out), exist_ok=True)
    print('slides', build(out, TITLE, LESSON_ID, S), '->', out)
