#!/usr/bin/env python3
# Sanaa · Y1 · T1 · L02 «أهمية السنع» (book p.17) — printable A4 files. Reuses the helpers of the L01 generator.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, 'sheets_y1_t1_l01.py'), encoding='utf8').read().split('# ---------- worksheets')[0]
exec(_src)
OUT = ROOT + '/resources/ssd/SN-Y1-T1-L02/'
os.makedirs(OUT, exist_ok=True)
T = 'أَهَمِّيَّةُ السَّنْعِ'
SUB = 'السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ · ص 17–21'
PTS = 'تَعْزيزُ حُبِّ الْوَطَنِ وَالِانْتِماءِ إِلَيْهِ · نَشْرُ الْأَخْلاقِ الْحَميدَةِ في الْمُجْتَمَعِ · تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ · تَعْزيزُ قُدُراتِ الْفَرْدِ عَلى التَّواصُلِ وَالْإِنْتاجِ وَالْإِبْداعِ'

def vc(t, d, col, bg):
    return f"<div style='flex:1;min-width:30%;border-radius:14px;background:{bg};padding:6px 10px;text-align:center'><div style='font-family:TD;font-size:22pt;color:{col}'>{t}</div><div style='font-size:12pt'>{d}</div></div>"
EM = "font-family:'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif;font-size:36pt;flex:none"
def learn(e, t):
    return f"<div style='display:flex;align-items:center;gap:8px;border-radius:14px;background:#FFFBF0;padding:6px'><span style=\"{EM}\">{e}</span><span>{t}</span></div>"

def intro(h=24):
    return (f"<div style='display:flex;align-items:center;gap:10px;margin:4px 0 6px'><img src='{PIC}night.webp' style='height:{h}mm;max-width:40mm;object-fit:contain;border-radius:10px'>"
            "<b style='font-family:TD'>لِلسَّنْعِ أَهَمِّيَّةٌ في حُبِّ الْوَطَنِ وَالْأَخْلاقِ وَالْأُسْرَةِ وَالتَّواصُلِ.</b></div>")

def ws_page(i):
    nm, c, bg = LEVELS[i]
    h = hd('وَرَقَةُ عَمَلٍ', bg, 'الْمُسْتَوى: ' + nm, c) + NM + intro()
    if i == 0:
        b = (q(1, c, 'أُلَوِّنُ الرَّمْزَ الْمُناسِبَ:', row('تَعْزيزُ حُبِّ الْوَطَنِ:', pics('🇦🇪', '🍎', '⚽')) + row('تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ:', pics('🚗', '👨‍👩‍👧‍👦', '🌧️')))
             + q(2, c, 'أُلَوِّنُ 👍 إِذا كانَتِ الْجُمْلَةُ صَحيحَةً، وَ 👎 إِذا كانَتْ خَطَأً:',
                 row('السَّنْعُ يُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ.', TH) + row('السَّنْعُ لا عَلاقَةَ لَهُ بِالْأَخْلاقِ.', TH)))
    elif i == 1:
        b = (q(1, c, 'أَصِلُ بِخَطٍّ:',
               "<div class='mt'><div class='c'><div><span style='flex:1'>حُبُّ الْوَطَنِ</span><span class='dot'></span></div><div><span style='flex:1'>الْأَخْلاقُ</span><span class='dot'></span></div><div><span style='flex:1'>الْأُسْرَةُ</span><span class='dot'></span></div></div>"
               "<div class='c'><div><span class='dot'></span><span style='flex:1'>نَنْشُرُ الْأَخْلاقَ الْحَميدَةَ 💛</span></div><div><span class='dot'></span><span style='flex:1'>نُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ 👨‍👩‍👧‍👦</span></div><div><span class='dot'></span><span style='flex:1'>نُعَزِّزُ الِانْتِماءَ 🇦🇪</span></div></div></div>")
             + q(2, c, 'أُلَوِّنُ ما يُعَزِّزُ قُدُراتِ الْفَرْدِ:', row('التَّواصُلُ · الْإِنْتاجُ · الْإِبْداعُ', pics('🗣️', '🛠️', '🎨'))))
    elif i == 2:
        b = (q(1, c, 'أَخْتارُ الْكَلِمَةَ الْمُناسِبَةَ وَأَكْتُبُها في الْفَراغِ:',
               "<div class='bank'><b>بَنْكُ الْكَلِماتِ:</b><span>الْأُسَرِيَّةَ</span><span>الْوَطَنِ</span><span>الْحَميدَةَ</span></div>"
               "<div class='row'><span class='s'>يُعَزِّزُ السَّنْعُ حُبَّ <span class=gap></span> وَالِانْتِماءَ إِلَيْهِ.</span></div>"
               "<div class='row'><span class='s'>يَنْشُرُ السَّنْعُ الْأَخْلاقَ <span class=gap></span> في الْمُجْتَمَعِ.</span></div>"
               "<div class='row'><span class='s'>يُقَوّي السَّنْعُ الرَّوابِطَ <span class=gap></span>.</span></div>")
             + q(2, c, 'أَنْسَخُ بِخَطٍّ جَميلٍ:', "<div class='trace'>لِلسَّنْعِ أَهَمِّيَّةٌ…</div><div class='ln'></div>"))
    else:
        b = (q(1, c, 'أُفَكِّرُ وَأُجيبُ: لِماذا يُهِمُّني أَنْ أَلْتَزِمَ بِالسَّنْعِ؟', "<div class='ln'></div>")
             + q(2, c, 'أَرْسُمُ مَوْقِفًا يُظْهِرُ فائِدَةً لِلسَّنْعِ وَأَكْتُبُ اسْمَها:', "<div class='box' style='height:52mm'></div>"))
    return page(h + b)
open(OUT + 'worksheets-A4.html', 'w', encoding='utf8').write(doc('وَرَقَةُ عَمَلٍ', ''.join(ws_page(i) for i in range(4))))

c = '#3F6E5B'
pod = (hd('نَشاطُ أَصْحابِ الْهِمَمِ', '#DCEAE4', 'أَنا أَسْتَطيعُ!', c) + NM
       + "<div style='text-align:center;margin:10px 0'><span class='big' style='font-size:63pt'>🇦🇪👨‍👩‍👧‍👦</span></div>"
       + "<div class='k' style='font-size:24pt;text-align:center;background:#F6FBF8;border-color:#BFE3CC'>لِلسَّنْعِ أَهَمِّيَّةٌ في حُبِّ الْوَطَنِ وَالْأُسْرَةِ.</div>"
       + q(1, '#5E6672', 'أُلَوِّنُ الرَّمْزَ الْمُناسِبَ:', row('تَعْزيزُ حُبِّ الْوَطَنِ:', pics('🇦🇪', '🍎', '⚽')))
       + q(2, '#5E6672', 'أُلَوِّنُ 👍 إِذا كانَتِ الْجُمْلَةُ صَحيحَةً، وَ 👎 إِذا كانَتْ خَطَأً:',
           row('السَّنْعُ يُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ.', TH) + row('السَّنْعُ يَنْشُرُ الْأَخْلاقَ الْحَميدَةَ.', TH)))
open(OUT + 'pod-sheet.html', 'w', encoding='utf8').write(doc('نَشاطُ أَصْحابِ الْهِمَمِ', page(pod)))

def k(t, c, bg):
    return f"<div class='k' style='border-color:{c};background:{bg}'>{t}</div>"
ak = (hd('مِفْتاحُ الْإِجابَةِ', '#DCEAE4', '👩‍🏫', '#3F6E5B')
      + k('<b>بُرونْزِيٌّ:</b> 1 - 🇦🇪 · 👨‍👩‍👧‍👦 &nbsp;|&nbsp; 2 - 👍 · 👎', '#9A5A26', '#F7E9DC')
      + k('<b>فِضِّيٌّ:</b> 1 - حُبُّ الْوَطَنِ ← نُعَزِّزُ الِانْتِماءَ · الْأَخْلاقُ ← نَنْشُرُ الْأَخْلاقَ الْحَميدَةَ · الْأُسْرَةُ ← نُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ &nbsp;|&nbsp; 2 - الْأَشْياءُ الثَّلاثَةُ كُلُّها (التَّواصُلُ وَالْإِنْتاجُ وَالْإِبْداعُ).', '#5E6672', '#EDEFF2')
      + k('<b>ذَهَبِيٌّ:</b> 1 - الْوَطَنِ · الْحَميدَةَ · الْأُسَرِيَّةَ &nbsp;|&nbsp; 2 - نَسْخٌ', '#A87A0C', '#FBF1D3')
      + k('<b>ماسِيٌّ:</b> إِجابَتانِ مَفْتوحَتانِ: تُقْبَلُ كُلُّ إِجابَةٍ تَرْبِطُ بَيْنَ السَّنْعِ وَفائِدَةٍ مِنْ فَوائِدِهِ الْأَرْبَعِ وَتُعَلِّلُ.', '#5546A3', '#EEEAFB')
      + k('<b>نَشاطُ أَصْحابِ الْهِمَمِ:</b> 1) 🇦🇪 2) 👍 · 👍', '#ddd', '#fff')
      + k('<b>نَماذِجُ إِجابَةِ الْمَجْموعاتِ:</b> الْمَجْموعَةُ 1: ' + PTS + ' (نَصُّ الْكِتابِ ص 17). &nbsp;|&nbsp; الْمَجْموعَةُ 2: إِجابَةٌ مَفْتوحَةٌ بِمِثالٍ مِنْ حَياةِ الطّالِبِ. &nbsp;|&nbsp; الْمَجْموعَةُ 3: إِجابَةٌ مَفْتوحَةٌ: تَرْبِطُ الصّورَةَ بِفائِدَةٍ وَتُعَلِّلُ. &nbsp;|&nbsp; الْمَجْموعَةُ 4: تَمْثيلٌ حُرٌّ.', '#3E9E5B', '#F1F8F3')
      + "<div class='k'>ملاحظةٌ للمعلِّم: الْفَوائِدُ الْأَرْبَعُ مَنْقولَةٌ مِنَ الْكِتابِ ص 17؛ وَما سِواها (الرُّموزُ وَالْأَمْثِلَةُ وَالْمَواقِفُ) مِنْ إِعْدادِ حِراءَ.</div>")
open(OUT + 'answer-key.html', 'w', encoding='utf8').write(doc('مِفْتاحُ الْإِجابَةِ', page(ak)))

card = (hd('بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ', '#DCEAE4', 'لِلْجَميعِ', '#3F6E5B')
        + "<div class='k' style='background:#FFF8EA;border-color:#E3C07A'><b>📖 مِنْ كِتابي ص 17: فَوائِدُ السَّنْعِ</b>"
        "<div style='font-family:TD;font-size:21pt;line-height:1.9;margin-top:4px'>١) تَعْزيزُ حُبِّ الْوَطَنِ وَالِانْتِماءِ إِلَيْهِ.<br>٢) نَشْرُ الْأَخْلاقِ الْحَميدَةِ في الْمُجْتَمَعِ.<br>٣) تَقْوِيَةُ الرَّوابِطِ الْأُسَرِيَّةِ.<br>٤) تَعْزيزُ قُدُراتِ الْفَرْدِ عَلى التَّواصُلِ وَالْإِنْتاجِ وَالْإِبْداعِ.</div>"
        "<div style='text-align:center;font-size:9.5pt;color:#5B6472'>نَصُّ الْكِتابِ كَما وَرَدَ، وَالتَّشْكيلُ مِنْ إِعْدادِ حِراءَ</div></div>"
        + "<div class='k'><b>📘 كَلِماتي</b> <span style='font-size:9.5pt;color:#5B6472'>(الْكَلِماتُ مِنْ ص 16، وَالشَّرْحُ الْمُبَسَّطُ مِنْ إِعْدادِ حِراءَ)</span><div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:6px'>"
        + vc('الْمُجْتَمَعُ', 'ناسٌ يَعيشونَ مَعًا في مَكانٍ واحِدٍ', '#5E6672', '#EDEFF2') + vc('الْهُوِيَّةُ الْوَطَنِيَّةُ', 'ما يُعَرِّفُ بِوَطَني', '#A87A0C', '#FBF1D3')
        + vc('الْأَخْلاقُ', 'صِفاتٌ حَسَنَةٌ في تَعامُلي', '#5546A3', '#EEEAFB') + vc('الْأُسْرَةُ', 'أَبي وَأُمّي وَإِخْوَتي', '#1F7A6D', '#DDF1EC') + "</div></div>"
        + "<div class='k'><b>💡 تَعَلَّمْتُ</b><div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px'>"
        + learn('🇦🇪', 'السَّنْعُ يُعَزِّزُ حُبَّ الْوَطَنِ.') + learn('💛', 'السَّنْعُ يَنْشُرُ الْأَخْلاقَ الْحَميدَةَ.')
        + learn('👨‍👩‍👧‍👦', 'السَّنْعُ يُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ.') + learn('🌟', 'السَّنْعُ يُعَزِّزُ قُدُراتي عَلى التَّواصُلِ وَالْإِبْداعِ.') + "</div></div>"
        + "<div class='k'><b>✅ أُطَبِّقُ</b><div class='row'><span style='font-size:23pt'>☐</span><span class='s'>أُخْبِرُ أُسْرَتي بِفائِدَتَيْنِ لِلسَّنْعِ.</span></div>"
        "<div class='row'><span style='font-size:23pt'>☐</span><span class='s'>كِتابي ص 19–21: أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ مِنَ الصُّوَرِ وَأُعَبِّرُ بِالرَّسْمِ عَنْ سَنْعِ احْتِرامِ الْأَكْبَرِ سِنًّا.</span></div></div>"
        + "<div style='text-align:center;margin-top:8px'><span style='font-family:TD;font-size:24pt;background:#C2508A;color:#fff;border-radius:24px;padding:6px 26px'>🏅 ⭐ أَحْسَنْتَ</span></div>")
open(OUT + 'sources-concept-card.html', 'w', encoding='utf8').write(doc('بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ', page(card)))

G = [('#C9822B', '#FBEBD6', 1, '⭐ مُبْتَدِئٌ:', 'أَقْرَأُ الْفَوائِدَ في كِتابي ص 17 وَأَخْتارُ واحِدَةً.', ['أُحَوِّطُ فائِدَةً أَعْرِفُها.', 'أَرْسُمُ رَمْزًا لَها.'], 'مَنْ يَذْكُرُ الْفَوائِدَ الْأَرْبَعَ؟'),
     ('#2F6A9A', '#DDEBF7', 2, '⭐⭐ مُتَطَوِّرٌ:', 'أَشْرَحُ فائِدَتَيْنِ لِلسَّنْعِ.', ['أَخْتارُ فائِدَتَيْنِ.', 'أَذْكُرُ مِثالًا لِكُلٍّ مِنْهُما.'], 'اشْرَحْ لِزَميلٍ لِماذا يُهِمُّنا السَّنْعُ.'),
     ('#1F7A6D', '#DDF1EC', 3, '⭐⭐⭐ مُتَمَكِّنٌ:', 'أَسْتَنْتِجُ أَهَمِّيَّةَ السَّنْعِ مِنْ صورَةِ كِتابي ص 19.', ['أَصِفُ ما أَراهُ.', 'أَكْتُبُ الْفائِدَةَ الَّتي أَسْتَنْتِجُها وَلِماذا.'], 'اقْتَرِحْ مَوْقِفًا آخَرَ يُظْهِرُ فائِدَةً لِلسَّنْعِ.'),
     ('#C2508A', '#FBE3EF', 4, '🌱 قيمَةٌ نَعيشُها:', '🤔 كَيْفَ يَجْعَلُنا السَّنْعُ أَقْرَبَ إِلى بَعْضِنا؟', ['أَكْتُبُ جُمْلَةً.', '🎭 نُمَثِّلُ مَشْهَدًا يُقَوّي الرَّوابِطَ الْأُسَرِيَّةَ.'], 'ماذا نَشْعُرُ حينَ يَلْتَزِمُ الْجَميعُ بِالسَّنْعِ؟')]
def gc(g):
    c, bg, n, lab, task, steps, ch = g
    return (f"<div class='gc' style='border-color:{c}'>" + hd('بِطاقَةُ مَجْموعَةٍ', bg, f'الْمَجْموعَةُ {n}', c)
            + "<div style='font-size:11pt;margin:4px 0'>🧭 الْقائِدُ · ✏️ الرَّسّامُ · 🗣️ الْمُتَحَدِّثُ · ⏰ حارِسُ الْوَقْتِ</div>"
            + f"<div class='k' style='background:{bg};border-color:{c}'><b>{lab}</b> {task}</div>"
            + ''.join(f"<div class='row'><span style='font-size:23pt'>✏️</span><span class='s'>{s}</span></div>" for s in steps)
            + "<div class='box' style='height:30mm;margin-top:6px'></div>"
            + f"<div class='star'><b>★ تَحَدّي الْأَبْطالِ:</b> {ch}</div></div>")
gw = "<div class='page'><div class='fit'>" + gc(G[0]) + gc(G[1]) + "</div></div><div class='page'><div class='fit'>" + gc(G[2]) + gc(G[3]) + "</div></div>"
open(OUT + 'group-work.html', 'w', encoding='utf8').write(doc('بِطاقَةُ مَجْموعَةٍ', gw))
print('ok', sorted(os.listdir(OUT)))
