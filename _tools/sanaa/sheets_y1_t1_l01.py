#!/usr/bin/env python3
# Sanaa · Y1 · T1 · L01 «مفهوم السنع الإماراتي» (book p.17) — printable A4 files, same look as SS-Y1-T1-L01.
import re, os
ROOT = '/home/claude/hira'
SRC = open(ROOT + '/resources/ssd/SS-Y1-T1-L01/worksheets-A4.html', encoding='utf8').read()
HEAD_CSS = re.search(r'<style>(.*?)</style>', SRC, re.S).group(1)
FIT_JS = re.search(r'(<script>document\.fonts.*?</script>)', SRC, re.S).group(1)
OUT = ROOT + '/resources/ssd/SN-Y1-T1-L01/'
SUB = 'السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ · ص 17–21'
T = 'مَفْهومُ السَّنْعِ الْإِماراتِيِّ'
LOGO = '<img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:120px;height:48px;object-fit:contain">'
PIC = '../../sn/g1/SN-Y1-T1-L01/'
SELF = "<div class='self'><span>كَيْفَ أَشْعُرُ؟</span><span>😀 أَعْرِفُ جَيِّدًا</span><span>🙂 أَعْرِفُ قَليلًا</span><span>😟 أَحْتاجُ مُساعَدَةً</span></div>"
DEF = 'هِيَ الْأَقْوالُ وَالْأَفْعالُ الَّتي مِنَ الْواجِبِ الِالْتِزامُ بِها في الْمَواقِفِ الِاجْتِماعِيَّةِ الْيَوْمِيَّةِ أَوِ الْمُناسَباتِ أَوِ الزِّياراتِ أَوْ حُضورِ الْمَجالِسِ.'
LEVELS = [('بُرونْزِيٌّ', '#9A5A26', '#F7E9DC'), ('فِضِّيٌّ', '#5E6672', '#EDEFF2'), ('ذَهَبِيٌّ', '#A87A0C', '#FBF1D3'), ('ماسِيٌّ', '#5546A3', '#EEEAFB')]

def doc(title, body):
    return ('<!doctype html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
            + title + ' · Hiraa</title><style>' + HEAD_CSS + '</style></head><body><button class="pb" onclick="print()">🖨️ طِباعَةٌ</button>'
            + body + FIT_JS + '</body></html>')

def hd(title, bg, pill, pc):
    return (f"<div class='hd' style='background:{bg}'><div><div class='t'>{title}: {T}</div><div class='m'>{SUB}</div></div>"
            f"<div style='display:flex;align-items:center;gap:10px'><span class='pill' style='background:{pc}'>{pill}</span>{LOGO}</div></div>")

NM = "<div class='nm'><span>الِاسْمُ: ......................</span><span>التّاريخُ: ..........</span></div>"
def intro(h=24):
    return (f"<div style='display:flex;align-items:center;gap:10px;margin:4px 0 6px'><img src='{PIC}family.webp' style='height:{h}mm;max-width:40mm;object-fit:contain;border-radius:10px'>"
            "<b style='font-family:TD'>السَّنْعُ: أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها في بَيْتِنا وَمَدْرَسَتِنا وَمُناسَباتِنا.</b></div>")
def q(n, c, head, inner):
    return f"<div class='q'><div class='qh'><span class='n' style='background:{c}'>{n}</span><span>{head}</span></div>{inner}</div>"
def pics(*e):
    return "<div class='pics'>" + ''.join(f'<div class=pic>{x}</div>' for x in e) + '</div>'
def row(t, extra=''):
    return f"<div class='row'><span class='s'>{t}</span>{extra}</div>"
TH = "<div class='th'><span>👍</span><span>👎</span></div>"
def page(inner):
    return f"<div class='page'><div class='fit'>{inner}</div>{SELF}</div>"

# ---------- worksheets (4 levels) ----------
def ws_page(i):
    nm, c, bg = LEVELS[i]
    h = hd('وَرَقَةُ عَمَلٍ', bg, 'الْمُسْتَوى: ' + nm, c) + NM + intro()
    if i == 0:
        b = (q(1, c, 'أُلَوِّنُ الصّورَةَ الْمُناسِبَةَ:',
               row('إِذا ناداني أَحَدٌ أَقولُ:', pics('🗣️', '🙅', '😶')) + row('أَقولُ «نَعَمْ» أَوْ «لَبَّيْهِ».', pics('👂', '🙉', '🙈')))
             + q(2, c, 'أُلَوِّنُ 👍 إِذا كانَتِ الْجُمْلَةُ صَحيحَةً، وَ 👎 إِذا كانَتْ خَطَأً:',
                 row('السَّنْعُ أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها.', TH) + row('لا نُجيبُ مَنْ يُناديني.', TH)))
    elif i == 1:
        b = (q(1, c, 'أَصِلُ بِخَطٍّ:',
               "<div class='mt'><div class='c'><div><span style='flex:1'>إِذا ناداني أَحَدٌ</span><span class='dot'></span></div><div><span style='flex:1'>في الْعيدِ</span><span class='dot'></span></div><div><span style='flex:1'>السَّنْعُ</span><span class='dot'></span></div></div>"
               "<div class='c'><div><span class='dot'></span><span style='flex:1'>أَقولُ: عَساكُمْ مِنْ عُوّادِهِ 🎉</span></div><div><span class='dot'></span><span style='flex:1'>أَقْوالٌ وَأَفْعالٌ نَلْتَزِمُ بِها 🤝</span></div><div><span class='dot'></span><span style='flex:1'>أَقولُ: نَعَمْ أَوْ لَبَّيْهِ 🗣️</span></div></div></div>")
             + q(2, c, 'أُلَوِّنُ الْمَكانَ الَّذي فيهِ سَنْعٌ:', row('الْبَيْتُ · الْمَدْرَسَةُ · الْمَجْلِسُ · الْمُناسَباتُ', pics('🏠', '🏫', '🪑'))))
    elif i == 2:
        b = (q(1, c, 'أَخْتارُ الْكَلِمَةَ الْمُناسِبَةَ وَأَكْتُبُها في الْفَراغِ:',
               "<div class='bank'><b>بَنْكُ الْكَلِماتِ:</b><span>وَأَفْعالٌ</span><span>نَعَمْ</span><span>الْعيدِ</span></div>"
               "<div class='row'><span class='s'>السَّنْعُ أَقْوالٌ <span class=gap></span> جَميلَةٌ نَلْتَزِمُ بِها.</span></div>"
               "<div class='row'><span class='s'>إِذا ناداني أَحَدٌ أَقولُ: <span class=gap></span> أَوْ لَبَّيْهِ.</span></div>"
               "<div class='row'><span class='s'>أُهَنِّئُ في <span class=gap></span> بِقَوْلي: عَساكُمْ مِنْ عُوّادِهِ.</span></div>")
             + q(2, c, 'أَنْسَخُ بِخَطٍّ جَميلٍ:', "<div class='trace'>السَّنْعُ أَقْوالٌ وَأَفْعالٌ…</div><div class='ln'></div>"))
    else:
        b = (q(1, c, 'أُفَكِّرُ وَأُجيبُ: لِماذا نَقولُ «نَعَمْ» أَوْ «لَبَّيْهِ» إِذا ناداني أَحَدٌ؟', "<div class='ln'></div>")
             + q(2, c, 'أَرْسُمُ مَوْقِفًا فيهِ سَنْعٌ وَأَكْتُبُ ماذا أَقولُ:', "<div class='box' style='height:52mm'></div>"))
    return page(h + b)
open(OUT + 'worksheets-A4.html', 'w', encoding='utf8').write(doc('وَرَقَةُ عَمَلٍ', ''.join(ws_page(i) for i in range(4))))

# ---------- pod sheet (students of determination) ----------
c = '#3F6E5B'
pod = (hd('نَشاطُ أَصْحابِ الْهِمَمِ', '#DCEAE4', 'أَنا أَسْتَطيعُ!', c) + NM
       + "<div style='text-align:center;margin:10px 0'><span class='big' style='font-size:63pt'>🗣️🤝</span></div>"
       + "<div class='k' style='font-size:24pt;text-align:center;background:#F6FBF8;border-color:#BFE3CC'>السَّنْعُ: أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها.</div>"
       + q(1, '#5E6672', 'أُلَوِّنُ الصّورَةَ الْمُناسِبَةَ:', row('إِذا ناداني أَحَدٌ أَقولُ:', pics('🗣️', '🙅', '😶')))
       + q(2, '#5E6672', 'أُلَوِّنُ 👍 إِذا كانَتِ الْجُمْلَةُ صَحيحَةً، وَ 👎 إِذا كانَتْ خَطَأً:',
           row('أَقولُ «نَعَمْ» إِذا ناداني أَحَدٌ.', TH) + row('لا أُجيبُ مَنْ يُناديني.', TH)))
open(OUT + 'pod-sheet.html', 'w', encoding='utf8').write(doc('نَشاطُ أَصْحابِ الْهِمَمِ', page(pod)))

# ---------- answer key ----------
def k(t, c, bg):
    return f"<div class='k' style='border-color:{c};background:{bg}'>{t}</div>"
ak = (hd('مِفْتاحُ الْإِجابَةِ', '#DCEAE4', '👩‍🏫', '#3F6E5B')
      + k('<b>بُرونْزِيٌّ:</b> 1 - 🗣️ · 👂 &nbsp;|&nbsp; 2 - 👍 · 👎', '#9A5A26', '#F7E9DC')
      + k('<b>فِضِّيٌّ:</b> 1 - إِذا ناداني أَحَدٌ ← أَقولُ: نَعَمْ أَوْ لَبَّيْهِ · في الْعيدِ ← أَقولُ: عَساكُمْ مِنْ عُوّادِهِ · السَّنْعُ ← أَقْوالٌ وَأَفْعالٌ نَلْتَزِمُ بِها &nbsp;|&nbsp; 2 - الْأَماكِنُ الثَّلاثَةُ كُلُّها صَحيحَةٌ (الْبَيْتُ، الْمَدْرَسَةُ، الْمَجْلِسُ)؛ السَّنْعُ في الْمَواقِفِ الْيَوْمِيَّةِ وَالْمُناسَباتِ وَالزِّياراتِ وَالْمَجالِسِ.', '#5E6672', '#EDEFF2')
      + k('<b>ذَهَبِيٌّ:</b> 1 - وَأَفْعالٌ · نَعَمْ · الْعيدِ &nbsp;|&nbsp; 2 - نَسْخٌ', '#A87A0C', '#FBF1D3')
      + k('<b>ماسِيٌّ:</b> إِجابَتانِ مَفْتوحَتانِ: تُقْبَلُ كُلُّ إِجابَةٍ تُوافِقُ الدَّرْسَ، مِثْلُ: لِأَنَّها أَقْوالٌ جَميلَةٌ نَلْتَزِمُ بِها، وَنُظْهِرُ بِها احْتِرامَنا لِلْآخَرينَ. (صياغة مقترحة من حراء)', '#5546A3', '#EEEAFB')
      + k('<b>نَشاطُ أَصْحابِ الْهِمَمِ:</b> 1) 🗣️ 2) 👍 · 👎', '#ddd', '#fff')
      + k('<b>نَماذِجُ إِجابَةِ الْمَجْموعاتِ:</b> الْمَجْموعَةُ 1: احْتِرامُ الْكَبيرِ، نُصْرَةُ الضَّعيفِ، تَقْديرُ الْوالِدَيْنِ، الْكَرَمُ، الْأَمانَةُ، الْإِخْلاصُ، التَّعاوُنُ، الصِّدْقُ، التَّسامُحُ (نَصُّ الْكِتابِ ص 17). &nbsp;|&nbsp; الْمَجْموعَةُ 2: ' + DEF + ' (نَصُّ الْكِتابِ). &nbsp;|&nbsp; الْمَجْموعَةُ 3: نَقولُ «نَعَمْ» أَوْ «لَبَّيْهِ»، وَفي الْعيدِ «عَساكُمْ مِنْ عُوّادِهِ». &nbsp;|&nbsp; الْمَجْموعَةُ 4: تَمْثيلٌ حُرٌّ يَلْتَزِمُ بِالْقَوْلِ الْجَميلِ (إِجابَةٌ مَفْتوحَةٌ).', '#3E9E5B', '#F1F8F3')
      + "<div class='k'>ملاحظةٌ للمعلِّم: إِجاباتُ الْمَجْموعَتَيْنِ 1 و2 وَمَثَلا الْحَياةِ الْيَوْمِيَّةِ وَالْعيدِ مَنْقولَةٌ مِنَ الْكِتابِ؛ وَما سِواها صِياغَةٌ مِنْ إِعْدادِ حِراءَ.</div>")
open(OUT + 'answer-key.html', 'w', encoding='utf8').write(doc('مِفْتاحُ الْإِجابَةِ', page(ak)))

# ---------- sources & concept card ----------
def vc(t, d, col, bg):
    return f"<div style='flex:1;min-width:30%;border-radius:14px;background:{bg};padding:6px 10px;text-align:center'><div style='font-family:TD;font-size:22pt;color:{col}'>{t}</div><div style='font-size:12pt'>{d}</div></div>"
EM = "font-family:'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif;font-size:36pt;flex:none"
def learn(e, t):
    return f"<div style='display:flex;align-items:center;gap:8px;border-radius:14px;background:#FFFBF0;padding:6px'><span style=\"{EM}\">{e}</span><span>{t}</span></div>"
card = (hd('بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ', '#DCEAE4', 'لِلْجَميعِ', '#3F6E5B')
        + "<div class='k' style='background:#FFF8EA;border-color:#E3C07A'><b>📖 مِنْ كِتابي ص 17</b>"
        "<div style='font-family:TD;font-size:20pt;line-height:1.8;text-align:center;margin-top:4px'>فَما الْمَقْصودُ بِالسَّنْعِ الْإِماراتِيِّ؟<br>" + DEF + "</div>"
        "<div style='text-align:center;font-size:9.5pt;color:#5B6472'>نَصُّ الْكِتابِ كَما وَرَدَ، وَالتَّشْكيلُ مِنْ إِعْدادِ حِراءَ</div></div>"
        + "<div class='k'><b>📘 كَلِماتي</b> <span style='font-size:9.5pt;color:#5B6472'>(الْكَلِماتُ مِنْ ص 16، وَالشَّرْحُ الْمُبَسَّطُ مِنْ إِعْدادِ حِراءَ)</span><div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:6px'>"
        + vc('السَّنْعُ', 'أَقْوالٌ وَأَفْعالٌ جَميلَةٌ نَلْتَزِمُ بِها', '#9A5A26', '#F7E9DC') + vc('الْمُجْتَمَعُ', 'ناسٌ يَعيشونَ مَعًا في مَكانٍ واحِدٍ', '#5E6672', '#EDEFF2')
        + vc('الْهُوِيَّةُ الْوَطَنِيَّةُ', 'ما يُعَرِّفُ بِوَطَني', '#A87A0C', '#FBF1D3') + vc('الْأَخْلاقُ', 'صِفاتٌ حَسَنَةٌ في تَعامُلي', '#5546A3', '#EEEAFB')
        + vc('الْأُسْرَةُ', 'أَبي وَأُمّي وَإِخْوَتي', '#1F7A6D', '#DDF1EC') + "</div></div>"
        + "<div class='k'><b>💡 تَعَلَّمْتُ</b><div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px'>"
        + learn('🗣️', 'إِذا ناداني أَحَدٌ أَقولُ: نَعَمْ أَوْ لَبَّيْهِ.') + learn('🎉', 'في الْعيدِ أَقولُ: عَساكُمْ مِنْ عُوّادِهِ.')
        + learn('🤝', 'السَّنْعُ أَقْوالٌ وَأَفْعالٌ نَلْتَزِمُ بِها.') + learn('🇦🇪', 'السَّنْعُ يُعَبِّرُ عَنْ هُوِيَّتِنا الْوَطَنِيَّةِ.') + "</div></div>"
        + "<div class='k'><b>✅ أُطَبِّقُ</b><div class='row'><span style='font-size:23pt'>☐</span><span class='s'>أَسْأَلُ أُسْرَتي: ماذا نَقولُ عِنْدَما يُناديني أَحَدٌ؟</span></div>"
        "<div class='row'><span style='font-size:23pt'>☐</span><span class='s'>كِتابي ص 18: أُسَجِّلُ صِفَةً أَوْ قيمَةً مِنْ قِيَمِ السَّنْعِ أَعْتَزُّ بِها.</span></div></div>"
        + "<div style='text-align:center;margin-top:8px'><span style='font-family:TD;font-size:24pt;background:#C2508A;color:#fff;border-radius:24px;padding:6px 26px'>🏅 ⭐ أَحْسَنْتَ</span></div>")
open(OUT + 'sources-concept-card.html', 'w', encoding='utf8').write(doc('بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ', page(card)))

# ---------- group work ----------
G = [('#C9822B', '#FBEBD6', 1, '⭐ مُبْتَدِئٌ:', 'أَقْرَأُ الْقِيَمَ في نَصِّ الْكِتابِ ص 17 وَأَخْتارُ ثَلاثًا.',
      ['أُحَوِّطُ قيمَةً أَعْرِفُها.', 'أَرْسُمُ رَمْزًا لِكُلِّ قيمَةٍ.'], 'مَنْ يَذْكُرُ خَمْسَ قِيَمٍ مِنَ النَّصِّ؟'),
     ('#2F6A9A', '#DDEBF7', 2, '⭐⭐ مُتَطَوِّرٌ:', 'أَشْرَحُ مَعْنى السَّنْعِ.',
      ['أُكْمِلُ: السَّنْعُ هُوَ أَقْوالٌ وَ …', 'أَذْكُرُ مِثالًا مِنْ بَيْتي.'], 'اشْرَحْ لِزَميلٍ ما هُوَ السَّنْعُ في جُمْلَتَيْنِ.'),
     ('#1F7A6D', '#DDF1EC', 3, '⭐⭐⭐ مُتَمَكِّنٌ:', 'أَخْتارُ السَّنْعَ في مَوْقِفٍ وَأَقولُ لِماذا.',
      ['مَوْقِفٌ: ناداني أَحَدٌ. ماذا أَقولُ؟', 'مَوْقِفٌ: جاءَ الْعيدُ. ماذا أَقولُ؟'], 'اقْتَرِحْ مَوْقِفًا ثالِثًا فيهِ سَنْعٌ.'),
     ('#C2508A', '#FBE3EF', 4, '🌱 قيمَةٌ نَعيشُها:', '🤔 ماذا أَفْعَلُ؟ أَرى زَميلًا جَديدًا يَقِفُ وَحْدَهُ.',
      ['أَكْتُبُ كَيْفَ أُظْهِرُ السَّنْعَ.', '🎭 نُمَثِّلُ الْمَوْقِفَ أَمامَ الصَّفِّ.'], 'كَيْفَ يَشْعُرُ مَنْ نُجيبُهُ بِسَنْعٍ؟')]
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
print('ok', os.listdir(OUT))
