# -*- coding: utf-8 -*-
"""تفاعل وحركة لعروض الدراسات الاجتماعية.

- بطاقات المفاتيح تنقلب بالنقر، وعلى وجهها رسمٌ مصمَّم لا صورةُ كتابٍ.
- شريحة «صحّح وعلّل» صارت تفاعلية: يضغط المعلم صحيح أو خطأ فيظهر الأثر،
  وعند مرور الفأرة على «علّل» ينكشف التصويب.
- شريحة «الجسر إلى الكتابة» تُحذف من الدراسات الاجتماعية.
- لوحات مرسومة تحلّ محلّ أكثر صور الكتاب، فلا يبقى منها إلا الممتاز.
"""
import re
import deck

# ───────────────────────────── الأيقونات ─────────────────────────────
# رسوم خطّية بلون currentColor، كلٌّ في مربّع 100×100.
I = {
 'globe': '<circle cx="50" cy="50" r="34"/><ellipse cx="50" cy="50" rx="14" ry="34"/>'
          '<path d="M17 38h66M17 62h66"/>',
 'map': '<path d="M16 28l22-9 24 9 22-9v54l-22 9-24-9-22 9z"/><path d="M38 19v54M62 28v54"/>',
 'compass': '<circle cx="50" cy="50" r="34"/><path d="M63 37L55 55 37 63l8-18z"/>',
 'mountain': '<path d="M12 72l20-32 13 19 10-16 23 29z"/><path d="M32 40l6 9"/>',
 'dune': '<path d="M12 68c12-14 22 4 34-6s22-16 42-2"/><path d="M12 78h76"/>',
 'plant': '<path d="M50 80V44"/><path d="M50 52c-14 0-22-8-22-20 14 0 22 8 22 20z"/>'
          '<path d="M50 60c14 0 22-8 22-20-14 0-22 8-22 20z"/>',
 'tree': '<path d="M50 82V54"/><path d="M50 54c-16-4-24-14-20-26 10-4 20 2 24 12 4-10 14-16 24-12 4 12-4 22-20 26z"/>',
 'water': '<path d="M50 18c14 18 22 29 22 39a22 22 0 01-44 0c0-10 8-21 22-39z"/>',
 'wind': '<path d="M14 38h40a11 11 0 10-11-11"/><path d="M14 56h52a11 11 0 11-11 11"/><path d="M14 72h28"/>',
 'sun': '<circle cx="50" cy="50" r="17"/><path d="M50 14v10M50 76v10M14 50h10M76 50h10M24 24l7 7M69 69l7 7M76 24l-7 7M31 69l-7 7"/>',
 'people': '<circle cx="36" cy="38" r="11"/><circle cx="66" cy="42" r="9"/>'
           '<path d="M18 76c0-12 8-20 18-20s18 8 18 20"/><path d="M58 76c0-10 4-16 10-16s14 6 14 16"/>',
 'family': '<circle cx="32" cy="36" r="10"/><circle cx="62" cy="36" r="10"/><circle cx="47" cy="58" r="7"/>'
           '<path d="M16 72c0-10 7-16 16-16s16 6 16 16M46 72c0-10 7-16 16-16s16 6 16 16"/>',
 'city': '<path d="M16 80V46h20v34M44 80V28h20v52M72 80V54h12v26"/><path d="M12 80h76"/>',
 'home': '<path d="M20 50l30-24 30 24"/><path d="M28 48v32h44V48"/><path d="M44 80V60h12v20"/>',
 'scales': '<path d="M50 22v56M30 78h40"/><path d="M20 38h60"/><path d="M20 38l-9 20a9 9 0 0018 0z"/>'
           '<path d="M80 38l-9 20a9 9 0 0018 0z"/>',
 'book': '<path d="M50 30c-8-6-18-8-30-6v46c12-2 22 0 30 6 8-6 18-8 30-6V24c-12-2-22 0-30 6z"/><path d="M50 30v46"/>',
 'shield': '<path d="M50 16l28 10v22c0 18-12 30-28 36-16-6-28-18-28-36V26z"/><path d="M38 50l9 9 17-18"/>',
 'handshake': '<path d="M14 46l14-12 14 6 14-6 14 12"/><path d="M28 50l12 12 8-6 10 8 12-12"/><path d="M14 46v12M84 46v12"/>',
 'hands': '<path d="M30 78V44a6 6 0 0112 0v-6a6 6 0 0112 0v4a6 6 0 0112 0v8a6 6 0 0112 0v16c0 10-8 18-18 18z"/>',
 'star': '<path d="M50 16l11 22 24 4-17 17 4 24-22-11-22 11 4-24-17-17 24-4z"/>',
 'flag': '<path d="M28 82V18"/><path d="M28 22h44l-9 14 9 14H28z"/>',
 'recycle': '<path d="M34 34l-12 20 10 6"/><path d="M58 28l12 20-10 6"/><path d="M50 82l-14-20h28z"/>'
            '<path d="M22 54l-6 12 14 4M78 48l6 12-14 4"/>',
 'atom': '<circle cx="50" cy="50" r="7"/><ellipse cx="50" cy="50" rx="34" ry="13"/>'
         '<ellipse cx="50" cy="50" rx="34" ry="13" transform="rotate(60 50 50)"/>'
         '<ellipse cx="50" cy="50" rx="34" ry="13" transform="rotate(120 50 50)"/>',
 'bulb': '<path d="M38 66a20 20 0 1124 0v8H38z"/><path d="M42 80h16"/><path d="M50 20v-6M24 36l-5-4M76 36l5-4"/>',
 'bird': '<path d="M22 56c14 4 26 0 34-10 6-8 14-10 22-6l-8 8 10 2-12 10c-6 16-22 24-38 20z"/><circle cx="62" cy="40" r="2.6" fill="currentColor"/>',
 'falcon': '<path d="M20 60c16 2 28-4 36-16 6-9 16-12 24-7l-9 9 11 3-14 11c-7 15-24 22-40 17z"/>'
           '<path d="M34 72c10 6 24 4 32-4" /><circle cx="64" cy="40" r="2.6" fill="currentColor"/>',
 'camera': '<rect x="16" y="34" width="68" height="44" rx="8"/><circle cx="50" cy="56" r="14"/><path d="M38 34l6-10h12l6 10"/>',
 'clock': '<circle cx="50" cy="50" r="33"/><path d="M50 30v22l14 9"/>',
 'chart': '<path d="M18 80V44M38 80V28M58 80V54M78 80V36"/><path d="M12 80h76"/>',
 'scroll': '<path d="M28 22h40a8 8 0 018 8v44a8 8 0 01-8 8H28a8 8 0 01-8-8V30a8 8 0 018-8z"/>'
           '<path d="M34 38h28M34 50h28M34 62h18"/>',
 'wheel': '<circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="9"/>'
          '<path d="M50 20v12M50 68v12M20 50h12M68 50h12"/>',
 'factory': '<path d="M16 80V48l18 12V48l18 12V34l32 22v24z"/><path d="M12 80h80"/><path d="M68 34V18h10v22"/>',
 'temple': '<path d="M50 14l34 20H16z"/><path d="M24 34v38M40 34v38M60 34v38M76 34v38"/>'
           '<path d="M14 80h72"/>',
 'pot': '<path d="M34 30h32"/><path d="M30 38c-6 8-8 16-8 22a28 28 0 0056 0c0-6-2-14-8-22z"/>'
        '<path d="M26 54h48"/>',
 'crown': '<path d="M18 68l-6-34 20 14 18-26 18 26 20-14-6 34z"/><path d="M18 76h64"/>',
 'river': '<path d="M20 26c14 10 6 22 0 32s10 18 0 26"/><path d="M50 26c14 10 6 22 0 32s10 18 0 26"/>'
          '<path d="M80 26c-14 10-6 22 0 32s-10 18 0 26"/>',
 'wheat': '<path d="M50 84V36"/><path d="M50 40c-10-2-16-8-16-18 10 0 16 6 16 18z"/>'
          '<path d="M50 40c10-2 16-8 16-18-10 0-16 6-16 18z"/>'
          '<path d="M50 58c-10-2-16-8-16-18 10 0 16 6 16 18z"/>'
          '<path d="M50 58c10-2 16-8 16-18-10 0-16 6-16 18z"/>',
 'palette': '<path d="M50 18a32 32 0 100 64c6 0 8-4 6-8-3-6 1-10 7-10h7a12 12 0 0012-12c0-19-15-34-32-34z"/>'
            '<circle cx="36" cy="40" r="4" fill="currentColor"/><circle cx="52" cy="32" r="4" fill="currentColor"/>'
            '<circle cx="66" cy="44" r="4" fill="currentColor"/>',
 'pen': '<path d="M24 76l6-16 34-34 10 10-34 34z"/><path d="M60 30l10 10"/><path d="M22 80h20"/>',
 'lamp': '<path d="M30 44h40l-6 22H36z"/><path d="M50 44V26"/><path d="M38 26h24"/><path d="M34 74h32"/>',
 'bridge': '<path d="M12 56c14 0 20-14 38-14s24 14 38 14"/><path d="M12 56v18M88 56v18"/>'
           '<path d="M34 50v24M50 46v28M66 50v24"/>',
 'anchor': '<circle cx="50" cy="26" r="7"/><path d="M50 33v47"/><path d="M32 46h36"/>'
           '<path d="M22 58c0 14 12 24 28 24s28-10 28-24"/>',
}
_DEF = 'star'
_HINT = [
 (('اتِّصالُ', 'اتِّصال', 'تَواصُل', 'تَبادُل'), 'bridge'),
 (('حَضارَة', 'حَضارات', 'حَضارِيّ'), 'temple'),
 (('مُقَوِّمات', 'مُقَوِّم', 'أَسْباب', 'عَوامِل قِيام'), 'crown'),
 (('تُرْبَة', 'خَصْبَة', 'زِراعَة', 'مَحاصيل', 'حَصاد'), 'wheat'),
 (('نَهْر', 'أَنْهار', 'ضِفاف', 'وِديان'), 'river'),
 (('فَنّ', 'فُنون', 'إِبْداع', 'زَخْرَفَة', 'عِمارَة'), 'palette'),
 (('كِتابَة', 'خَطّ', 'نَقْش', 'تَدْوين'), 'pen'),
 (('آثار', 'أَثَر', 'قِطَع', 'فَخّار', 'مُتْحَف'), 'pot'),
 (('عُلوم', 'عالِم', 'اخْتِراع', 'ابْتِكار', 'مَعْرِفَة'), 'lamp'),
 (('مَوْقِع', 'موقع', 'فَلَك', 'خَريط'), 'compass'),
 (('مُناخ', 'مناخ', 'رِياح', 'طَوْز'), 'wind'),
 (('نَبات', 'نبات', 'شَجَر', 'غاف', 'مانْجْروف', 'قُرْم'), 'tree'),
 (('تَضاريس', 'جِبال', 'هَضَب', 'سُهول'), 'mountain'),
 (('صَحْراء', 'كَثيب', 'رِمال'), 'dune'),
 (('ماء', 'مِياه', 'بَحْر', 'خَليج', 'مَضيق'), 'water'),
 (('سُكّان', 'هِجْرَة', 'كَثافَة', 'تَرْكيب', 'نُمُوّ'), 'people'),
 (('أُسْرَة', 'أَبْناء', 'والِدَيْن'), 'family'),
 (('مَدينَة', 'مُدُن', 'عُمْران'), 'city'),
 (('مَسْكَن', 'بَيْت', 'سَكَن'), 'home'),
 (('مُساواة', 'عَدالَة', 'قَضاء', 'قانون', 'حُقوق', 'تَكافُؤ'), 'scales'),
 (('دُسْتور', 'مادَّة', 'وَثيقَة', 'ميثاق'), 'scroll'),
 (('أَمْن', 'حِمايَة', 'دِفاع', 'حَرْب'), 'shield'),
 (('تَعاوُن', 'تَضامُن', 'تَرابُط', 'وَحْدَة', 'مَصير'), 'handshake'),
 (('واجِب', 'الْتِزام', 'مَسْؤول'), 'hands'),
 (('مُؤْتَمَر', 'مَجْلِس', 'أَمانَة', 'قِمَّة'), 'wheel'),
 (('تَدْوير', 'نِفايات', 'مُخَلَّفات'), 'recycle'),
 (('طاقَة', 'نَوَوِيّ', 'يورانْيوم', 'شَمْسِيّ'), 'atom'),
 (('اقْتِصاد', 'شاحِن', 'أَخْضَر', 'اسْتِثْمار'), 'bulb'),
 (('مَحْمِيَّة', 'فِطْرِيَّة', 'انْقِراض', 'نِظام بيئِيّ'), 'bird'),
 (('صَيْد', 'صَقْر', 'جائِر'), 'falcon'),
 (('هِمَم', 'إِعاقَة', 'إِنْجاز'), 'star'),
 (('اسْتِعْمار', 'احْتِكار', 'قَواسِم', 'أُسْطول'), 'anchor'),
 (('تَنْمِيَة', 'اسْتِدامَة', 'مَوارِد'), 'plant'),
 (('سِياحَة', 'مَعارِض'), 'camera'),
 (('تَعْليم', 'مَدْرَسَة', 'مَنْهَج'), 'book'),
 (('مَساحَة', 'كم²', 'دُوَل', 'دَوْلَة', 'حُدود'), 'map'),
 (('تاريخ', 'سَنَة', 'عام', 'قَديم'), 'clock'),
 (('إِحْصاء', 'نِسْبَة', 'مُعَدَّل', 'أَرْقام'), 'chart'),
 (('عَلَم', 'وَطَن', 'اتِّحاد', 'إِمارات'), 'flag'),
 (('صِناعَة', 'مَصْنَع', 'إِنْتاج'), 'factory'),
]


_DIAC = re.compile(r'[\u0617-\u061A\u064B-\u0652\u0670\u0640]')


def _bare(t):
    return _DIAC.sub('', t)


def icon_for(word):
    w = _bare(word)
    for keys, name in _HINT:
        if any(_bare(k) in w for k in keys):
            return name
    return _DEF


def icon_for_text(text):
    """أنسبُ أيقونةٍ لنصٍّ طويل: الأكثرُ موافقةً لمفاتيحِه."""
    t = _bare(text)
    best, score = _DEF, 0
    for keys, name in _HINT:
        n = sum(t.count(k) for k in {_bare(x) for x in keys})   # بلا تَكرارِ مفتاحٍ بعدَ التجريد
        if n > score:
            best, score = name, n
    return best


def svg_icon(name, size=76, stroke=3.2):
    body = I.get(name, I[_DEF])
    return (f'<svg viewBox="0 0 100 100" width="{size}" height="{size}" aria-hidden="true" '
            f'style="display:block" fill="none" stroke="currentColor" stroke-width="{stroke}" '
            f'stroke-linecap="round" stroke-linejoin="round">{body}</svg>')


# ───────────────────────────── الأنماط ─────────────────────────────
MARK_A = "/* ==HIRAA-FX-START== */"
MARK_B = "/* ==HIRAA-FX-END== */"

STYLE = """
/* ==HIRAA-FX-START== */
/* ===== حراء: تفاعل وحركة (الدراسات الاجتماعية) ===== */
.flipw{perspective:1400px;flex:1;min-width:0;cursor:pointer}
.flipc{position:relative;width:100%;height:330px;transform-style:preserve-3d;
 transition:transform .72s cubic-bezier(.3,1.3,.4,1),box-shadow .3s;cursor:pointer;border-radius:34px}
.flipc.flipped{transform:rotateY(180deg)}
.flipw:hover .flipc:not(.flipped){transform:translateY(-8px) rotateY(-6deg)}
.flipf,.flipb{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;
 border-radius:34px;background:#fff;box-shadow:0 14px 34px rgba(31,42,60,.13);
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:22px 18px;overflow:hidden}
.flipb{transform:rotateY(180deg);justify-content:center}
.flipf::after{content:"";position:absolute;inset:0;border-radius:34px;pointer-events:none;
 background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.75) 50%,transparent 62%);
 transform:translateX(-120%)}
.flipw:hover .flipf::after{transform:translateX(120%);transition:transform .9s ease}
.flipc .ic{opacity:.95}
.sl.on .flipc .ic{animation:icDraw .9s .25s both}
@keyframes icDraw{from{opacity:0;transform:scale(.6) rotate(-14deg)}to{opacity:.95;transform:none}}
.fliph{position:absolute;bottom:14px;font-size:17px;color:#9AA3AE;letter-spacing:.5px}
.flipc.flipped .fliph{display:none}

/* صحّح وعلّل */
.cq{position:relative;overflow:hidden;min-height:186px;background:#fff;border-radius:26px;padding:20px 22px 18px;
 box-shadow:0 10px 26px rgba(31,42,60,.10);border-inline-start:8px solid #CBD3DD;
 transition:border-color .35s,box-shadow .35s,transform .35s}
.cq.ok{border-inline-start-color:#2E8B6B;box-shadow:0 12px 30px rgba(46,139,107,.22)}
.cq.no{border-inline-start-color:#C0392B;box-shadow:0 12px 30px rgba(192,57,43,.20)}
.cq.ok{animation:cqOk .55s cubic-bezier(.2,.9,.3,1.4)}
.cq.no{animation:cqNo .45s}
@keyframes cqOk{40%{transform:scale(1.035)}100%{transform:none}}
@keyframes cqNo{20%{transform:translateX(-9px)}45%{transform:translateX(8px)}70%{transform:translateX(-4px)}100%{transform:none}}
.cbtn{font:inherit;font-size:23px;padding:5px 20px;border-radius:20px;cursor:pointer;
 background:#fff;transition:transform .2s,background .25s,color .25s,border-color .25s}
.cbtn:hover{transform:translateY(-2px)}
.cbtn.t{border:2px solid #2E8B6B;color:#2E8B6B}
.cbtn.f{border:2px solid #C0392B;color:#C0392B}
.cbtn.t.sel{background:#2E8B6B;color:#fff}
.cbtn.f.sel{background:#C0392B;color:#fff}
.cmark{position:absolute;inset-inline-end:18px;top:14px;font-size:34px;opacity:0;transform:scale(.4)}
.cq.ok .cmark,.cq.no .cmark{opacity:1;transform:none;transition:opacity .35s .1s,transform .45s .1s cubic-bezier(.2,.9,.3,1.5)}
.why{display:inline-block;font-size:22px;color:#6B5BA8;border:2px dashed #B9AEE2;
 border-radius:18px;padding:4px 16px;cursor:help;background:#F7F4FF;transition:background .25s}
.why:hover{background:#EDE7FF}
.whyb{position:absolute;inset:0;background:linear-gradient(140deg,#2A2140,#453a63);color:#fff;
 border-radius:26px;padding:22px 26px;font-size:23px;line-height:1.6;display:flex;align-items:center;
 opacity:0;visibility:hidden;transform:scale(.97);text-align:start;z-index:4;
 transition:opacity .3s,transform .35s cubic-bezier(.2,.9,.3,1.2),visibility .3s}
.cq.why-on .whyb{opacity:1;visibility:visible;transform:none}
.whyb b{display:block;font-size:19px;opacity:.7;margin-bottom:6px}

/* لوحات مرسومة بدل صور الكتاب */
.scn{position:relative;width:100%;height:100%;border-radius:24px;overflow:hidden;
 display:flex;align-items:center;justify-content:center}
.scn .g1,.scn .g2{position:absolute;border-radius:50%;filter:blur(2px)}
.sl.on .scn .ic{animation:scnIn 1s .2s cubic-bezier(.2,.8,.3,1.2) both}
@keyframes scnIn{from{opacity:0;transform:translateY(26px) scale(.9)}to{opacity:1;transform:none}}
.sl.on .scn .g1{animation:floaty 16s ease-in-out infinite}
.sl.on .scn .g2{animation:floaty 20s ease-in-out infinite reverse}
.scn .cap{position:absolute;bottom:14px;inset-inline-start:0;inset-inline-end:0;text-align:center;
 font-size:21px;color:#fff;opacity:.92;text-shadow:0 2px 8px rgba(0,0,0,.35)}

/* تهذيب الحركة العامّة */
.sl.on .stag>*{animation-timing-function:cubic-bezier(.22,.9,.26,1)}
.hbar{transform-origin:right center}
.sl.on .hbar{animation:barIn .7s .15s cubic-bezier(.2,.9,.3,1.2) both}
@keyframes barIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.sl.on h2{animation:headIn .8s cubic-bezier(.2,.85,.3,1) both}
@keyframes headIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
 .flipc,.cq,.cmark,.whyb{transition-duration:.01ms!important;animation:none!important}
}
/* ==HIRAA-FX-END== */
"""


def add_style(html):
    """يُدرج الأنماط، ويستبدلُ ما أُدرِج سابقًا حتى تَصِلَ التحديثات."""
    a, b = html.find(MARK_A), html.find(MARK_B)
    if a != -1 and b != -1:
        return html[:a] + STYLE.strip() + html[b + len(MARK_B):]
    i = html.index('</style>')
    return html[:i] + STYLE + html[i:]


# ───────────────────────────── شريحة المفاتيح ─────────────────────────────
_PAL = [('#C9822B', '#FBEBD6'), ('#C2508A', '#FBE3EF'),
        ('#2F6A9A', '#DDEBF7'), ('#2E8B6B', '#DCEFE7')]


def flip_cards(words, icons=None):
    """words: [(كلمة, معنى)] -> محتوى شريحة المفاتيح ببطاقات تنقلب."""
    out = []
    for n, (w, m) in enumerate(words):
        c, soft = _PAL[n % 4]
        ic = (icons or {}).get(w) or icon_for(w)
        fs = 34 if len(w) > 14 else 42
        out.append(
            f'<div class="flipw" data-ia onclick="event.stopPropagation();'
            f'this.firstElementChild.classList.toggle(\'flipped\')">'
            f'<div class="flipc">'
            f'<div class="flipf" style="border-top:12px solid {c}">'
            f'<div class="ic" style="color:{c};background:{soft};border-radius:50%;padding:18px">{svg_icon(ic)}</div>'
            f'<p style="font-family:\'Thmanyah Display\',\'Cairo\',Tahoma,sans-serif;'
            f'font-size:{fs}px;color:{c};text-align:center">{w}</p>'
            f'<span class="fliph">↻ اضْغَطْ لِلْمَعْنى</span></div>'
            f'<div class="flipb" style="border-top:12px solid {c};background:{soft}">'
            f'<div style="width:62px;height:5px;background:{c};border-radius:3px;opacity:.5"></div>'
            f'<p style="font-size:23px;text-align:center;line-height:1.6;color:#1F2A3C">{m}</p></div>'
            f'</div></div>')
    return ''.join(out)


# ───────────────────────────── شريحة النقد ─────────────────────────────
def critique_ix(claims):
    """claims: [(نصّ, صواب؟, تعليل)] -> شريحة تفاعلية: ضغط + كشف بالمرور."""
    js = ("event.stopPropagation();"
          "var c=this.parentNode.parentNode;"
          "c.classList.remove('ok','no');void c.offsetWidth;"
          "c.parentNode.querySelectorAll('.cbtn').forEach(function(b){b.classList.remove('sel')});"
          "this.classList.add('sel');"
          "c.classList.add(this.dataset.v===c.dataset.a?'ok':'no');"
          "c.querySelector('.cmark').textContent=this.dataset.v===c.dataset.a?'✅':'❌';")
    cells = []
    for n, (txt, val, why) in enumerate(claims, 1):
        a = 't' if val else 'f'
        cells.append(
            f'<div class="cq" data-a="{a}" data-ia>'
            f'<span class="cmark" data-ia></span>'
            f'<p style="font-size:25px;line-height:1.5;margin-bottom:12px">'
            f'<b style="color:#6B5BA8">{n}</b> &nbsp;«{txt}»</p>'
            f'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">'
            f'<button class="cbtn t" data-ia data-v="t" onclick="{js}">صَحيحٌ</button>'
            f'<button class="cbtn f" data-ia data-v="f" onclick="{js}">خَطَأٌ</button>'
            f'<span class="why" data-ia'
            f' onmouseenter="this.closest(\'.cq\').classList.add(\'why-on\')"'
            f' onmouseleave="this.closest(\'.cq\').classList.remove(\'why-on\')"'
            f' onclick="event.stopPropagation();'
            f'this.closest(\'.cq\').classList.toggle(\'why-on\')">عَلِّلْ</span></div>'
            f'<div class="whyb" data-ia onclick="event.stopPropagation();'
            f'this.closest(\'.cq\').classList.remove(\'why-on\')">'
            f'<span><b>التَّعْليلُ</b>{why}</span></div></div>')
    return ('<div class="stag" style="position:absolute;right:100px;top:250px;width:1400px;zoom:1.2;'
            'display:grid;grid-template-columns:1fr 1fr;gap:22px 26px">' + ''.join(cells) + '</div>')


# ───────────────────────────── لوحة مرسومة ─────────────────────────────
_SCN = {
 'warm': ('#FDF1EA', '#C2571A', '#E8A66B'),
 'cool': ('#EAF2FA', '#2F6A9A', '#7FB2DA'),
 'green': ('#E9F5EF', '#2E8B6B', '#86C5AC'),
 'plum': ('#F4F0FB', '#6B5BA8', '#A99AD8'),
 'sand': ('#FBF3E4', '#A8782A', '#DDBA74'),
}


def scene(icon, caption='', tone='cool'):
    """لوحة مرسومة تحلّ محلّ صورة الكتاب في فتحةٍ بعينها."""
    bg, fg, soft = _SCN.get(tone, _SCN['cool'])
    cap = (f'<span class="cap" style="color:{fg};text-shadow:none;opacity:.8">{caption}</span>'
           if caption else '')
    return (f'<div class="scn" style="background:linear-gradient(145deg,{bg} 0%,{soft}55 58%,#fff 100%)">'
            f'<div class="g1" style="width:230px;height:230px;background:{soft};opacity:.42;'
            f'inset-inline-start:-54px;top:-58px"></div>'
            f'<div class="g2" style="width:170px;height:170px;background:{fg};opacity:.18;'
            f'inset-inline-end:-38px;bottom:-40px"></div>'
            f'<div style="position:absolute;inset:0;background:'
            f'radial-gradient(circle at 50% 46%,{fg}1f 0,transparent 46%)"></div>'
            f'<div class="ic" style="color:{fg};position:relative;background:rgba(255,255,255,.86);'
            f'border-radius:40px;padding:26px;box-shadow:0 14px 34px {fg}26">'
            f'{svg_icon(icon, size=150, stroke=2.6)}</div>{cap}</div>')


IMG_RE = re.compile(r'<img[^>]*src="\.\./\.\./ssbook/[^"]*"[^>]*>')


def replace_imgs(html, plan):
    """plan: {section_id: (icon, caption, tone)} — تُستبدل صورةُ الكتاب بلوحةٍ مرسومة."""
    pre, secs, post = deck.split_sections(html)
    out = []
    for sid, s in secs:
        if sid in plan:
            ic, cap, tone = plan[sid]
            s = IMG_RE.sub(lambda _m: scene(ic, cap, tone), s, count=1)
        out.append(s)
    return pre + ''.join(out) + post


# ───────────────────────────── حذف شريحة ─────────────────────────────
def drop(html, *sids):
    pre, secs, post = deck.split_sections(html)
    keep = [s for sid, s in secs if sid not in sids]
    return pre + ''.join(keep) + post


# ──────────────────────── استبدال كتلة .stag ────────────────────────
def _match_div(s, start):
    """نهاية الوسم المفتوح عند start (فهرس '<div')، ببحثٍ متوازن."""
    i, depth = start, 0
    while i < len(s):
        if s.startswith('<div', i):
            depth += 1
            i = s.index('>', i) + 1
        elif s.startswith('</div>', i):
            depth -= 1
            i += 6
            if depth == 0:
                return i
        else:
            i += 1
    raise ValueError('unbalanced div')


def replace_stag(section, new_html):
    i = section.index('<div class="stag"')
    j = _match_div(section, i)
    return section[:i] + new_html + section[j:]


def stag_wrap(inner, top=250, gap=26, zoom=1.2):
    return (f'<div class="stag" style="position:absolute;right:100px;top:{top}px;width:1400px;'
            f'zoom:{zoom};display:flex;gap:{gap}px;align-items:stretch">{inner}</div>')


NAV_OLD = "if(!editing&&!e.target.closest('.nav'))next();"
NAV_NEW = "if(!editing&&!e.target.closest('.nav')&&!e.target.closest('[data-ia]'))next();"


def guard_nav(html):
    """النقرُ داخلَ عنصرٍ تفاعليٍّ لا ينقلُ إلى الشريحةِ التالية."""
    return html.replace(NAV_OLD, NAV_NEW)
