# -*- coding: utf-8 -*-
"""شرائح مقتبسة من عروض التربية الإسلامية واللغة العربية، لرفع التحدّي في الدراسات الاجتماعية.

- groupmap : خَريطَةُ الْعَمَلِ الْجَماعِيِّ (أدوار + معايير + مسار الوقت)   [التربية الإسلامية]
- critique : أَتَأَمَّلُ وَأَنْقُدُ — صَحِّحْ وَعَلِّلْ                        [التربية الإسلامية]
- enrich   : إِثْراءٌ: هَلْ تَعْلَمُ؟                                        [التربية الإسلامية]
- bridge   : الْجِسْرُ إِلَى الْكِتابَةِ (أسأل ← أستخرج ← أرتّب ← أكتب)        [اللغة العربية]
- exitcard : بِطاقَةُ الْخُروجِ (أطبّق · أتأمّل · ما أحسنته / ما أحسّنه)       [الإسلامية + العربية]
- tiers    : الدَّعْمُ الْمَرِنُ ★ / ★★ / ★★★ داخل شريحة المجموعة            [اللغة العربية]
"""
import re

GOLD, INK, MUTED = '#C9822B', '#1F2A3C', '#5B6472'
BLUE, GREEN, PLUM = '#2F6A9A', '#1F7A6D', '#5546A3'
DISPLAY = "'Thmanyah Display','Cairo',Tahoma,sans-serif"
SHADOW = '0 12px 32px rgba(31,42,60,.10)'

BLOCK = re.compile(
    r'(<div style="position:absolute;right:120px;top:(?:96|104)px.*?)'
    r'(?=<div style="position:absolute;left:120px;bottom:44px")', re.S)


def _head(eyebrow, minutes, title, accent=GOLD, chip=None):
    extra = (f'<div style="flex:1"></div><p style="font-size:24px;color:{accent};'
             f'background:#fff;padding:4px 18px;border-radius:24px">{chip}</p>') if chip else ''
    return (
        f'<div style="position:absolute;right:120px;top:96px;width:1680px;'
        f'display:flex;flex-direction:column;gap:16px">'
        f'<div style="display:flex;gap:12px;align-items:center">'
        f'<p style="font-size:24px;color:{accent};background:#fff;border:2px solid {accent};'
        f'padding:4px 18px;border-radius:24px">{eyebrow}</p>'
        f'<p style="font-size:24px;color:{MUTED};background:#fff;padding:4px 16px;'
        f'border-radius:24px">⏱ {minutes}</p>{extra}</div>'
        f'<div style="display:flex;align-items:stretch;gap:14px">'
        f'<div style="width:12px;background:{accent};border-radius:6px"></div>'
        f'<div style="flex:1;background:#fff;border-radius:22px;padding:16px 30px;'
        f'box-shadow:{SHADOW};display:flex;align-items:center">'
        f'<h2 style="font-family:{DISPLAY};font-size:44px;line-height:1.45;color:{INK}">'
        f'{title}</h2></div></div></div>')


def groupmap(groups_list):
    """خريطة العمل الجماعي: كل مجموعة = معيار نجاح، والأدوار، ومسار الوقت."""
    cards = ''.join(
        f'<div style="flex:1;background:#fff;border-radius:24px;padding:20px 22px;'
        f'box-shadow:{SHADOW};display:flex;flex-direction:column;gap:10px">'
        f'<div style="display:flex;align-items:center;gap:10px">'
        f'<p style="font-size:23px;color:#fff;background:{GOLD};padding:3px 14px;'
        f'border-radius:16px">الْمَجْموعَةُ {i + 1}</p>'
        f'<p style="font-size:21px;color:{MUTED}">مِعْيارُ {g["crit"]}</p></div>'
        f'<p style="font-size:26px;line-height:1.5;color:{INK}">{g["head"]}</p></div>'
        for i, g in enumerate(groups_list))
    roles = [('🧭', 'الْقائِدُ', 'يُديرُ الْوَقْتَ وَالْمَهامَّ'),
             ('🔎', 'الْباحِثُ', 'يَسْتَخْرِجُ الْأَدِلَّةَ'),
             ('✏️', 'الْكاتِبُ', 'يُدَوِّنُ الْإِجابَةَ'),
             ('🗣️', 'الْمُقَدِّمُ', 'يَعْرِضُ في دَقيقَتَيْنِ')]
    rolerow = ''.join(
        f'<div style="flex:1;background:#F1F6FB;border-radius:20px;padding:14px 18px;'
        f'display:flex;align-items:center;gap:12px">'
        f'<p style="font-size:34px">{e}</p><div>'
        f'<p style="font-size:25px;color:{BLUE}"><b>{n}</b></p>'
        f'<p style="font-size:22px;color:{MUTED}">{d}</p></div></div>'
        for e, n, d in roles)
    steps = ['عَمَلٌ 8 د', 'عَرْضٌ 2 د', 'تَغْذِيَةُ الْأَقْرانِ', 'تَعْقيبُ الْمُعَلِّمِ', 'نَموذَجُ الْإِجابَةِ']
    line = '<p style="font-size:26px;color:#8A8475">←</p>'.join(
        f'<p style="font-size:26px;color:{INK};background:#fff;padding:6px 18px;'
        f'border-radius:18px;box-shadow:{SHADOW}">{s}</p>' for s in steps)
    return (
        _head('🧭 خَريطَةُ الْعَمَلِ الْجَماعِيِّ', '15 دَقيقَةً',
              'كُلُّ مَجْموعَةٍ = مِعْيارُ نَجاحٍ') +
        f'<div style="position:absolute;right:120px;top:286px;width:1680px;'
        f'display:flex;gap:20px;align-items:stretch">{cards}</div>'
        f'<div style="position:absolute;right:120px;top:560px;width:1680px;'
        f'display:flex;gap:18px">{rolerow}</div>'
        f'<div style="position:absolute;right:120px;top:730px;width:1680px;'
        f'display:flex;gap:14px;align-items:center;justify-content:center">{line}</div>')


def critique(claims):
    """أتأمّل وأنقد: دعاوى يَحكُم عليها الطالب ثم تُكشَف بزرّ الإجابة النموذجية.
    claims: [(نصّ, صحيح؟, التصويب)]"""
    cards = ''.join(
        f'<div style="flex:1 1 calc(50% - 12px);background:#fff;border-radius:24px;'
        f'padding:22px 26px;box-shadow:{SHADOW};display:flex;flex-direction:column;gap:14px">'
        f'<div style="display:flex;align-items:center;gap:10px">'
        f'<p style="font-size:23px;color:#fff;background:{PLUM};width:34px;height:34px;'
        f'border-radius:17px;display:flex;align-items:center;justify-content:center">{i + 1}</p>'
        f'<p style="font-size:27px;line-height:1.6;color:{INK};flex:1">«{t}»</p></div>'
        f'<div style="display:flex;gap:12px">'
        f'<p style="font-size:23px;color:{GREEN};border:2px solid {GREEN};padding:3px 16px;'
        f'border-radius:16px">☐ صَحيحٌ</p>'
        f'<p style="font-size:23px;color:#B8292F;border:2px solid #B8292F;padding:3px 16px;'
        f'border-radius:16px">☐ خَطَأٌ</p>'
        f'<p style="font-size:22px;color:{MUTED};align-self:center">… وَأُعَلِّلُ</p>'
        f'</div></div>'
        for i, (t, _ok, _fix) in enumerate(claims))
    return (
        _head('🧠 أَتَأَمَّلُ وَأَنْقُدُ', '6 دَقائِقَ', 'صَحِّحْ وَعَلِّلْ',
              accent=PLUM, chip='صَوِّتْ ثُمَّ عَلِّلْ') +
        f'<div style="position:absolute;right:120px;top:300px;width:1680px;'
        f'display:flex;gap:24px;align-items:stretch;flex-wrap:wrap">{cards}</div>')


def critique_model(claims):
    """نصّ الإجابة النموذجية لشريحة النقد."""
    return ' '.join(
        f'<b>{i + 1}) {"صَحيحٌ" if ok else "خَطَأٌ"}</b> — {fix}'
        for i, (_t, ok, fix) in enumerate(claims))


def enrich(items):
    """إثراء: هل تعلم؟ items: [(عنوان, نصّ)]"""
    cards = ''.join(
        f'<div style="flex:1;background:#fff;border-radius:26px;padding:26px 30px;'
        f'box-shadow:{SHADOW};display:flex;flex-direction:column;gap:12px">'
        f'<p style="font-size:26px;color:#fff;background:{GREEN};padding:5px 20px;'
        f'border-radius:18px;align-self:flex-start">{t}</p>'
        f'<p style="font-size:29px;line-height:1.7;color:{INK}">{x}</p></div>'
        for t, x in items)
    return (
        _head('💡 إِثْراءٌ: هَلْ تَعْلَمُ؟', '3 دَقائِقَ', 'نُوَسِّعُ الْأُفُقَ', accent=GREEN) +
        f'<div style="position:absolute;right:120px;top:300px;width:1680px;'
        f'min-height:460px;display:flex;gap:24px;align-items:stretch">{cards}</div>')


def bridge(prompt, question, frames, criteria):
    """الجسر إلى الكتابة: أسأل ← أستخرج ← أرتّب ← أكتب، مع قوالب ومعايير."""
    steps = [('١', 'أَسْأَلُ', question), ('٢', 'أَسْتَخْرِجُ', 'أَدِلَّتي مِنَ النَّصِّ وَالشَّرائِحِ'),
             ('٣', 'أُرَتِّبُ', 'مُقَدِّمَةٌ ← دَليلانِ ← خاتِمَةٌ'), ('٤', 'أَكْتُبُ', prompt)]
    col = ''.join(
        f'<div style="flex:1;background:#fff;border-radius:22px;padding:18px 22px;'
        f'box-shadow:{SHADOW};display:flex;flex-direction:column;gap:8px">'
        f'<div style="display:flex;align-items:center;gap:10px">'
        f'<p style="font-size:24px;color:#fff;background:{BLUE};width:38px;height:38px;'
        f'border-radius:19px;display:flex;align-items:center;justify-content:center">{n}</p>'
        f'<p style="font-size:27px;color:{BLUE}"><b>{t}</b></p></div>'
        f'<p style="font-size:24px;line-height:1.6;color:{INK}">{d}</p></div>'
        for n, t, d in steps)
    fr = ''.join(f'<p style="font-size:25px;line-height:1.8;color:{INK}">• {f}</p>' for f in frames)
    cr = ''.join(f'<p style="font-size:24px;line-height:1.7;color:{MUTED}">◯ {c}</p>' for c in criteria)
    return (
        _head('✍️ الْجِسْرُ إِلَى الْكِتابَةِ', '7 دَقائِقَ',
              'مِنَ النِّقاشِ إِلى فِقْرَةٍ مَكْتوبَةٍ', accent=BLUE) +
        f'<div style="position:absolute;right:120px;top:292px;width:1680px;'
        f'display:flex;gap:18px;align-items:stretch">{col}</div>'
        f'<div style="position:absolute;right:120px;top:560px;width:1680px;'
        f'display:flex;gap:24px;align-items:stretch">'
        f'<div style="flex:1.4;background:#FFF6E0;border:4px dashed #D7A33B;'
        f'border-radius:26px;padding:22px 28px;display:flex;flex-direction:column;gap:6px">'
        f'<p style="font-size:25px;color:#A8741F"><b>قَوالِبُ تُعينُني</b></p>{fr}</div>'
        f'<div style="width:620px;background:#F1F6FB;border-radius:26px;padding:22px 28px;'
        f'display:flex;flex-direction:column;gap:6px">'
        f'<p style="font-size:25px;color:{BLUE}"><b>تُقَيَّمُ فِقْرَتي بِـ</b></p>{cr}</div></div>')


def exitcard(apply_items, badge):
    """بطاقة الخروج: أطبّق · أتأمّل · ما أحسنته / ما أحسّنه."""
    ap = ''.join(f'<p style="font-size:27px;line-height:1.85;color:{INK}">☐ {a}</p>'
                 for a in apply_items)
    return (
        _head('🎒 بِطاقَةُ الْخُروجِ', '4 دَقائِقَ', 'نَخْتِمُ بِأَثَرٍ', accent=GOLD, chip=badge) +
        f'<div style="position:absolute;right:120px;top:296px;width:1680px;'
        f'min-height:430px;display:flex;gap:24px;align-items:stretch">'
        f'<div style="flex:1.25;background:#fff;border-radius:28px;padding:26px 32px;'
        f'box-shadow:{SHADOW};display:flex;flex-direction:column;gap:10px">'
        f'<p style="font-size:26px;color:#fff;background:{GOLD};padding:5px 20px;'
        f'border-radius:18px;align-self:flex-start">أُطَبِّقُ</p>{ap}</div>'
        f'<div style="width:700px;background:#F4F1FB;border-radius:28px;padding:26px 30px;'
        f'display:flex;flex-direction:column;gap:14px">'
        f'<p style="font-size:26px;color:#fff;background:{PLUM};padding:5px 20px;'
        f'border-radius:18px;align-self:flex-start">أَتَأَمَّلُ</p>'
        f'<p style="font-size:28px;line-height:1.6;color:{INK}">'
        f'ما الَّذي تَغَيَّرَ في فَهْمي بَعْدَ دَرْسِ الْيَوْمِ؟</p>'
        f'<div style="display:flex;gap:14px;margin-top:4px">'
        f'<div style="flex:1;background:#fff;border-radius:18px;padding:14px 18px">'
        f'<p style="font-size:24px;color:{GREEN}">✓ ما أَحْسَنْتُهُ</p>'
        f'<div style="border-bottom:2px dotted #BBB;height:26px;margin-top:8px"></div></div>'
        f'<div style="flex:1;background:#fff;border-radius:18px;padding:14px 18px">'
        f'<p style="font-size:24px;color:{GOLD}">↻ ما أُحَسِّنُهُ</p>'
        f'<div style="border-bottom:2px dotted #BBB;height:26px;margin-top:8px"></div></div>'
        f'</div></div></div>')


TIER_BOX = re.compile(
    r"<div style=\"width:640px;background:#F1F6FB;border-radius:22px;padding:16px 30px\">.*?</div>",
    re.S)


def tiers(section_html, t1, t2, t3):
    """يستبدل صندوق «دعم» بثلاث درجات دعم مرن داخل المهمّة الواحدة."""
    rows = ''.join(
        f'<p style="font-size:23px;line-height:1.6;color:{c}"><b>{s}</b> {t}</p>'
        for s, t, c in (('★', t1, '#A8741F'), ('★★', t2, BLUE), ('★★★', t3, GREEN)))
    box = (f'<div style="width:640px;background:#F1F6FB;border-radius:22px;padding:14px 26px;'
           f'display:flex;flex-direction:column;gap:4px">'
           f'<p style="font-size:23px;color:{MUTED}"><b>دَعْمٌ مَرِنٌ · هَدَفٌ واحِدٌ</b></p>'
           f'{rows}</div>')
    out, n = TIER_BOX.subn(lambda m: box, section_html, count=1)
    if n != 1:
        raise ValueError('support box not found')
    return out


def build(template_sec, sid, bg, content, aside):
    """يصنع شريحة جديدة من شريحة قائمة: تُبدَّل الهوية والخلفية والمحتوى."""
    s = re.sub(r'id="[^"]+"', f'id="{sid}"', template_sec, count=1)
    s = re.sub(r'(id="' + sid + r'" style="background:)#[0-9A-Fa-f]{6}', r'\g<1>' + bg, s, count=1)
    s, n = BLOCK.subn(lambda m: content, s, count=1)
    if n != 1:
        raise ValueError(f'{sid}: no content block in the donor section')
    s = re.sub(r'<aside>.*?</aside>', f'<aside>{aside}</aside>', s, count=1, flags=re.S)
    return s


def insert(html, additions, replacements=None):
    """additions: [(after_sid, section_html)] · replacements: {sid: section_html}"""
    import deck
    pre, secs, post = deck.split_sections(html)
    rep = replacements or {}
    out = []
    for sid, s in secs:
        out.append(rep.get(sid, s))
        for after, new in additions:
            if after == sid:
                out.append(new)
    return pre + ''.join(out) + post


MODEL_BTN = (
    '<button class="mabtn" data-ia '
    'onclick="this.nextElementSibling.classList.toggle(\'on\')">{label}</button>'
    '<div class="mabox" data-ia onclick="this.classList.remove(\'on\')">'
    '<b>{label}</b>{body}</div>')


def with_model(section_html, body, label='💡 الْإِجابَةُ النَّموذَجِيَّةُ'):
    """يُعلّق زرّ الإجابة النموذجية على الشريحة، كما في بقيّة شرائح العرض."""
    i = section_html.rindex('</section>')
    return (section_html[:i]
            + MODEL_BTN.format(label=label, body=body)
            + section_html[i:])
