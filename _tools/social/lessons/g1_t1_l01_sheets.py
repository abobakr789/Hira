import sys; sys.path.insert(0, '..')
from sheets import *
from playwright.sync_api import sync_playwright
R = '/home/claude/Hira/resources/ss/g1/SS-Y1-T1-L01/'
S = dict(subj='الدِّراساتُ الاجْتِماعِيَّةُ', grade='الصَّفُّ الأَوَّلُ', title='أَنا وَأُسْرَتي', pages='ص 10–17',
         goal='أَتَعَرَّفُ أَفْرادَ أُسْرَتي، وَأُعَرِّفُ بِنَفْسي، وَأَعْرِفُ أَنَّ عَدَدَ أَفْرادِ الأُسْرَةِ يَخْتَلِفُ.')
F4, F6, FAM, CLS, HAM = (img(x if x.startswith('/') else R + x) for x in ['/tmp/bk/f4nc.webp', '/tmp/bk/f6nc.webp', 'family-photo.webp', 'classroom.webp', 'hamad.webp'])
beg = head(S, 'مُبْتَدِئٌ ⭐', 'وَرَقَةُ نَشاطٍ: أَنا وَأُسْرَتي') + \
  Q(1, 'أُحَوِّطُ الصّورَةَ الَّتي تَدُلُّ عَلى الأُسْرَةِ.') + f"<div class='row'><div class='pic'><img src='{FAM}'></div><div class='pic'><img src='{CLS}'></div></div>" + \
  Q(2, 'أَصِلُ الكَلِمَةَ بِصورَتِها.') + "<div class='row'><div><div class='card'>الأُسْرَةُ</div><br><div class='card'>الأُخْتُ</div><br><div class='card'>الأَخُ</div></div><div><div class='emo'>👦</div><br><div class='emo'>👨‍👩‍👧‍👦</div><br><div class='emo'>👧</div></div></div>" + SELF
dev = head(S, 'مُتَطَوِّرٌ ⭐⭐', 'وَرَقَةُ نَشاطٍ: أَنا وَأُسْرَتي') + \
  Q(1, 'أُعَرِّفُ بِنَفْسي.') + "<div style='font-size:22px;line-height:2.4'>أَنا ............................ ، عُمْري (......) سَنَواتٍ.<br>عِنْدي ............................................................</div>" + \
  Q(2, 'أَعُدُّ أَفْرادَ كُلِّ أُسْرَةٍ، وَأَكْتُبُ العَدَدَ.') + f"<div class='row'><div class='pic'><img src='{F4}'><b>(......) أَفْرادٍ</b></div><div class='pic'><img src='{F6}'><b>(......) أَفْرادٍ</b></div></div>" + \
  Q(3, 'أُحَوِّطُ الكَلِمَةَ المُناسِبَةَ: الأُسْرَةُ الإِماراتِيَّةُ أُسْرَةٌ ( مُتَعاوِنَةٌ  /  مُتَخاصِمَةٌ ).') + SELF
adv = head(S, 'مُتَمَكِّنٌ ⭐⭐⭐', 'وَرَقَةُ نَشاطٍ: أَنا وَأُسْرَتي') + \
  Q(1, 'أَرْسُمُ أُسْرَتي.') + "<div class='box'></div><div style='font-size:20px;margin-top:6px'>عَدَدُ أَفْرادِ أُسْرَتي: (......)</div>" + \
  Q(2, 'أُقارِنُ بَيْنَ أُسْرَتي وَأُسْرَةِ حَمَدٍ.') + "<table><tr><th></th><th>أُسْرَتي</th><th>أُسْرَةُ حَمَدٍ</th></tr><tr><td>عَدَدُ الأَفْرادِ</td><td></td><td></td></tr><tr><td>عَدَدُ الإِخْوَةِ وَالأَخَواتِ</td><td></td><td></td></tr></table>" + \
  Q(3, 'أَكْتُبُ كَيْفَ نَتَعاوَنُ في أُسْرَتي.') + "<div class='ln'></div><div class='ln'></div>" + SELF
pod = head(S, 'أَصْحابُ الهِمَمِ 💚', 'نَشاطٌ مُكَيَّفٌ: أَنا وَأُسْرَتي') + \
  Q(1, 'أُلَوِّنُ ⭐ تَحْتَ صورَةِ الأُسْرَةِ.') + f"<div class='row'><div class='pic'><img src='{FAM}'><b>☆</b></div><div class='pic'><img src='{CLS}'><b>☆</b></div></div>" + \
  Q(2, 'أَتَتَبَّعُ الكَلِمَةَ.') + "<div class='trace'>أُسْرَتي</div>" + \
  Q(3, 'أَرْسُمُ نَفْسي.') + "<div class='box' style='height:170px'></div>" + SELF
words = [('👨‍👩‍👧‍👦', 'الأُسْرَةُ'), ('👧', 'الأُخْتُ'), ('👦', 'الأَخُ'), ('🤝', 'التَّعاوُنُ')]
concept = head(S, 'لِلْجَميعِ', 'بِطاقَةُ المَفاهيمِ: كَلِماتي الجَديدَةُ') + "<table><tr><th>الكَلِمَةُ</th><th>أَرْسُمُها</th><th>أَقولُها في جُمْلَةٍ</th></tr>" + \
  "".join(f"<tr><td style='font-size:24px;font-weight:800'>{e} {w}</td><td style='height:120px'></td><td></td></tr>" for e, w in words) + "</table>"
key = "<div class='hd'><div class='t'>مِفْتاحُ الإِجابَةِ لِلْمُعَلِّمِ: أَنا وَأُسْرَتي</div><div class='lv'>لِلْمُعَلِّمِ</div></div>" + "".join(f"<div class='goal' style='background:#E2F0EF'><b>{a}:</b> {b}</div>" for a, b in [
  ('مُبْتَدِئٌ', '١) صورَةُ الأَبِ وَالأُمِّ وَالأَبْناءِ. ٢) الأُسْرَةُ ← 👨‍👩‍👧‍👦، الأُخْتُ ← 👧، الأَخُ ← 👦.'),
  ('مُتَطَوِّرٌ', '١) يُعَرِّفُ بِاسْمِهِ وَعُمْرِهِ وَإِخْوَتِهِ (إِجابَةٌ شَخْصِيَّةٌ). ٢) (4) أَفْرادٍ، (6) أَفْرادٍ. ٣) مُتَعاوِنَةٌ.'),
  ('مُتَمَكِّنٌ', '١) رَسْمٌ يَظْهَرُ فيهِ أَفْرادُ الأُسْرَةِ مَعَ عَدَدٍ صَحيحٍ. ٢) أُسْرَةُ حَمَدٍ: 6 أَفْرادٍ، وَ4 إِخْوَةٍ وَأَخَواتٍ (مَعَهُ: شَيْخَةُ، ميثاءُ، حَمْدانُ). ٣) مِثالٌ: أُساعِدُ أُمّي في تَرْتيبِ البَيْتِ.'),
  ('أَصْحابُ الهِمَمِ', '١) تَحْتَ صورَةِ الأُسْرَةِ. ٢) تَتَبُّعٌ سَليمٌ. ٣) رَسْمٌ شَخْصِيٌّ.'),
  ('تَذْكِرَةُ الخُروجِ', '٢) (ب) 6. ٣) (أ) مُتَعاوِنَةٌ.'),
  ('بِطاقَةُ المَفاهيمِ', 'الأُسْرَةُ: أَبي وَأُمّي وَإِخْوَتي · الأُخْتُ: بِنْتُ أَبي وَأُمّي · الأَخُ: ابْنُ أَبي وَأُمّي · التَّعاوُنُ: نُساعِدُ بَعْضُنا بَعْضًا.')])
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pdf(pg, R + 'worksheets-A4.pdf', beg + "<div class='pb'></div>" + dev + "<div class='pb'></div>" + adv)
    pdf(pg, R + 'pod-sheet.pdf', pod); pdf(pg, R + 'concept-card.pdf', concept); pdf(pg, R + 'answer-key.pdf', key)
    b.close()
print('ok')
