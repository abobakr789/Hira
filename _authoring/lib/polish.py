# -*- coding: utf-8 -*-
"""تهذيب عروض الدراسات الاجتماعية: بطاقات تنقلب · نقدٌ تفاعلِيٌّ · حذف الجسر · لوحات مرسومة.

يُطبَّق على دروس الصف الخامس كلِّها (الفصلان الأول والثاني).
كلُّ خطوةٍ تُحسب أوّلًا ثم تُكتب، ولا يُعاد تطبيقُ شيءٍ طُبِّق.
"""
import sys, re, glob, os
sys.path.insert(0, '/tmp/g5/lib'); sys.path.insert(0, '/tmp/g5')
import deck, adv, fx

REPO = '/tmp/hpush/resources/ssd'
MABTN_RE = re.compile(r'<button class="mabtn".*?</div>', re.S)

# أيّ فتحةٍ تبقى صورةَ كتابٍ وأيّها تصير لوحةً مرسومة.
# الغلاف والمُشَوِّقُ يحتفظان بالصورتين الرئيستين، والباقي يُرسم.
SCENE_PLAN = {
    'predict': ('bulb',  'أَتَوَقَّعُ', 'plum'),
    'learn2':  (None,    '',          'cool'),
    'learn3':  (None,    '',          'green'),
    'learn4':  (None,    '',          'sand'),
}


def _words_of(sec):
    """يستخرج (كلمة، معنى) من شريحة المفاتيح القديمة."""
    t = deck.texts(sec)
    # بعد الشارتين والعنوان: كلمة ثم معنى، أربع مرّات
    body = t[3:]
    return [(body[i].strip(), body[i + 1].strip())
            for i in range(0, min(8, len(body) - 1), 2)]


def _claims_of(code):
    """يُعيد دعاوى الدرس من ملفّات المحتوى المتقدّم."""
    import importlib
    for mod in ('adv_u1', 'adv_u2', 'adv_t2u1', 'adv_t2u2', 'adv_t2u3'):
        try:
            A = importlib.import_module(mod).A
        except Exception:
            continue
        if code in A:
            return A[code]['claims']
    return None


def _topic_icons(words):
    return {w: fx.icon_for(w) for w, _ in words}


def run(code):
    p = f'{REPO}/{code}/teacher-deck.html'
    h = open(p, encoding='utf-8').read()

    # 1) الأنماط
    h = fx.add_style(h)

    # 2) حذف «الجسر إلى الكتابة»
    h = fx.drop(h, 'bridge')

    # 3) بطاقات المفاتيح تنقلب
    secs = dict(deck.split_sections(h)[1])
    words = _words_of(secs['vocab'])
    if len(words) == 4 and 'flipc' not in secs['vocab']:
        newv = fx.replace_stag(
            secs['vocab'],
            fx.stag_wrap(fx.flip_cards(words, _topic_icons(words)), top=246, gap=26))
        h = h.replace(secs['vocab'], newv, 1)

    # 4) شريحة النقد تفاعلية (بلا زرّ نموذجٍ منفصل؛ التعليل في كلِّ دعوى)
    claims = _claims_of(code)
    if claims and 'class="cq"' not in secs.get('critique', ''):
        secs = dict(deck.split_sections(h)[1])
        donor = MABTN_RE.sub('', secs['critique'])   # لا زرَّ نموذجٍ؛ التعليلُ في كلِّ دعوى
        h = h.replace(
            secs['critique'],
            adv.build(donor, 'critique', '#F6F2FF', fx.critique_ix(claims),
                      'اضغطْ صحيحٌ أو خطأٌ أمامَ الصفِّ، ثم مرِّرِ الفأرةَ على «علِّلْ» لتكشفَ التصويبَ.'),
            1)

    # 5) لوحاتٌ مرسومةٌ بدل أكثر صور الكتاب
    plan = {}
    secs = dict(deck.split_sections(h)[1])
    for sid, (ic, cap, tone) in SCENE_PLAN.items():
        if sid not in secs:
            continue
        if 'class="scn"' in secs[sid]:
            continue
        if ic is None:
            ic = fx.icon_for_text(' '.join(deck.texts(secs[sid])))
        plan[sid] = (ic, cap, tone)
    h = fx.replace_imgs(h, plan)

    open(p, 'w', encoding='utf-8').write(h)
    return len(deck.split_sections(h)[1])


def _head_text(sec):
    """أطولُ فقرةٍ في الشريحة، تُستعملُ لاختيارِ الأيقونةِ المناسبةِ لمضمونها."""
    t = [x.strip() for x in deck.texts(sec)]
    return max(t, key=len) if t else ''


if __name__ == '__main__':
    pat = sys.argv[1] if len(sys.argv) > 1 else 'SS-Y5-*'
    codes = sorted(os.path.basename(os.path.dirname(x))
                   for x in glob.glob(f'{REPO}/{pat}/teacher-deck.html'))
    for c in codes:
        print(f'  {c}: {run(c)} شريحة')
    print('هُذِّب', len(codes), 'درسًا')
