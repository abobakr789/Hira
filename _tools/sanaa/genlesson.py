#!/usr/bin/env python3
# Spec-driven Sanaa lesson pack: teacher deck (29 slides) + 5 printable files. See lessons_y1_t1.py for specs.
import os, sys, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import deck_y1_t1_l01 as b
from deckkit import *
ROOT = '/home/claude/hira'
OLDF = 'مَفْهومُ السَّنْعِ الْإِماراتِيِّ · السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ'
LCOL = ['#B0782A', '#5E6672', '#5546A3']

def deck(sp):
    FOOT = sp['title'] + ' · السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ'
    GOAL = sp['goal']; PIC = '../../sn/g1/SN-Y1-T1-L01/'
    b.FOOT = FOOT
    b.LV = [(s, n, t, c) for (s, n), t, c in zip((('⭐', 'مُبْتَدِئٌ'), ('⭐⭐', 'مُتَطَوِّرٌ'), ('⭐⭐⭐', 'مُتَمَكِّنٌ')), sp['levels'], LCOL)]
    LV = b.LV; S = []
    cp = sp.get('cover_pic')
    pic = (f'<div style="position:absolute;left:120px;top:250px;width:640px;height:520px;border-radius:40px;background:#fff;box-shadow:0 16px 40px rgba(31,42,60,.14);padding:18px;display:flex"><img src="{PIC}{cp}.webp" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:28px"></div>'
           if cp else '<div style="position:absolute;left:120px;top:250px;width:640px;height:520px;border-radius:40px;background:#fff;box-shadow:0 16px 40px rgba(31,42,60,.14);display:flex;align-items:center;justify-content:center;font-size:260px">' + sp['cover_emoji'] + '</div>')
    S.append('<section class="sl" id="cover" style="background:#FFF8EA;color:#1F2A3C;' + TXT + ';padding:0;direction:rtl;overflow:hidden">'
      '<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:linear-gradient(180deg,#FFE9C2 0%,#FFF8EA 55%,#F3E9D2 100%)"></div>'
      '<div style="position:absolute;left:-60px;bottom:-280px;width:1200px;height:560px;border-radius:50%;background:#B0782A;opacity:.12"></div>'
      '<div style="position:absolute;left:56px;top:34px;display:flex"><img src="../../../art/brand/hiraa-lockup-light.svg" alt="حراء" style="width:240px;height:96px;object-fit:contain"></div>' + pic +
      '<div style="position:absolute;right:110px;top:190px;width:1000px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">'
      + P('السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ', 34, '#B0782A', True, False, 'right')
      + '<h1 style="' + FONT + ';font-size:84px;line-height:1.3;text-align:right">' + sp['title'] + '</h1>'
      + P(sp['sub'] + ' · كِتابي ' + sp['pages'], 30, '#5B6472', False, False, 'right')
      + '<div style="background:#fff;border:3px solid #B0782A;border-radius:28px;padding:20px 30px;margin-top:20px;display:flex">' + P('🎯 ' + GOAL, 38, '#1F2A3C', True, True, 'right') + '</div>'
      '</div><aside>اقرأ العنوان بصوت واضح، واطلب من الطلاب فتح الكتاب على ' + sp['pages'] + '.</aside></section>')
    r = sp['retrieve']
    S.append(frame('retrieve', 'sky', '🔁 نَتَذَكَّرُ مَعًا', '3 دَقائِقَ', r['title'],
      b.cards_row(r['cards'], 700, 380, 'sky', 40, 300) + abs_(100, 740, 1500, P(r['line'], 34, '#1B7F9E', True, True), 'background:#fff;border-radius:26px;padding:16px 26px;justify-content:center'), r['notes'], FOOT))
    h = sp['hook']
    S.append(frame('hook', 'peach', '✨ لَحْظَةُ فُضولٍ', '4 دَقائِقَ', h['title'],
      abs_(100, 290, 1500, P(h['q'], 42, '#B0582F', True, True) + P('خَمِّنْ ثُمَّ شارِكْ زَميلَكَ.', 34, '#1F2A3C'), 'flex-direction:column;gap:20px;align-items:center') +
      abs_(100, 560, 1500, '<div style="display:flex;flex-direction:row;gap:30px">' + ''.join(f'<p style="font-size:30px;color:#1F2A3C;background:#fff;border-radius:24px;padding:12px 26px">{t}</p>' for t in ('💭 أُفَكِّرُ وَحْدي', '🗣️ أُخْبِرُ زَميلي', '👥 نُشارِكُ الصَّفَّ')) + '</div>', 'justify-content:center') +
      abs_(100, 730, 1500, '<div data-build-in="pop 1" style="background:#FFE9A8;border-radius:28px;padding:20px 34px;display:flex">' + P(h['reveal'], 38, '#8A5A1E', True, True) + '</div>', 'justify-content:center'), h['notes'], FOOT))
    lv_cards = ''.join(f'<div data-build-in="pop {k + 1}">' + card(P(st, 44) + P(nm, 36, col, True, True) + P(tx, 29, '#1F2A3C'), 520, 360, '#fff', col) + '</div>' for k, (st, nm, tx, col) in enumerate(LV))
    S.append(frame('goal', 'sand', '🎯 وِجْهَتُنا', '2 دَقيقَتانِ', 'وِجْهَتُنا الْيَوْمَ',
      abs_(100, 260, 1700, '<div style="background:#fff;border:3px solid #B0782A;border-radius:26px;padding:16px 28px;display:flex">' + P('🎯 ' + GOAL, 40, '#1F2A3C', True, True) + '</div>', 'justify-content:center') +
      abs_(100, 430, 1700, lv_cards, 'flex-direction:row;gap:28px;justify-content:center'), 'اقرأ الهدف ووضّح ماذا يعني كل مستوى.', FOOT))
    S.append(b.S[4])
    S.append(b.progress('progress', 'قِياسُ التَّقَدُّمِ: قَبْلَ الدَّرْسِ', 'أَخْتارُ الْوَجْهَ الَّذي يُشْبِهُني:  😟 لا أَعْرِفُ بَعْدُ · 🙂 أَعْرِفُ قَليلًا · 😀 أَعْرِفُ جَيِّدًا', '2 دَقيقَتانِ'))
    vo = sp['vocab']; n = len(vo); w = min(400, int(1700 / n) - 24)
    S.append(frame('vocab', 'mint', '🔑 مَفاتيحُ الدَّرْسِ', '5 دَقائِقَ', 'كَلِماتٌ جَديدَةٌ',
      b.cards_row(vo, w, 430, 'mint', 16, 280, 30 if n > 4 else 34), sp['vocab_note'], FOOT))
    for i, t in enumerate(sp['texts']):  # (title, inner html, notes, pageLabel)
        S.append(frame('text%d' % (i + 1), 'sand', '📖 رُكْنُ الْكِتابِ', '4 دَقائِقَ', t[0],
          abs_(100, 270, 1700, '<div style="background:#fff;border:3px solid #B0782A;border-radius:32px;padding:34px 44px;display:flex;flex-direction:column;gap:20px;width:1700px">' + t[1] + '</div>') +
          abs_(100, 905, 1700, P('📘 كِتابي ' + t[3], 26, '#8A5A1E', True), 'justify-content:center'), t[2], FOOT))
    kn = sp['know']; per = 4 if len(kn['cards']) <= 4 else 4
    rows = [kn['cards'][i:i + per] for i in range(0, len(kn['cards']), per)]
    kh = 290 if len(rows) > 1 else 400
    body = ''.join(abs_(100, 260 + ri * (kh + 20), 1700, ''.join(f'<div data-build-in="pop {ri * per + k + 1}" style="display:flex">' + card(P(e, 56 if len(rows) > 1 else 80) + P(t, 28, '#1F2A3C', True, True), 400, kh, '#fff', '#2F6A9A') + '</div>' for k, (e, t) in enumerate(row)), 'flex-direction:row;gap:26px;justify-content:center') for ri, row in enumerate(rows))
    S.append(frame('know', 'blue', '🔎 نَفْهَمُ مَعًا', '4 دَقائِقَ', kn['title'], body + abs_(100, 260 + len(rows) * (kh + 20) + 10, 1700, P(kn['line'], 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'), kn['notes'], FOOT))
    m = sp['model']
    S.append(frame('model', 'blue', '👩‍🏫 شاهِدْني أُطَبِّقُ', '5 دَقائِقَ', m['title'],
      abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="flex:1;display:flex">' + card(P(e, 64) + P(a, 34, '#2F6A9A', True, True) + P(c, 32, '#1F2A3C'), 540, 330, '#fff', '#2F6A9A') + '</div>' for k, (e, a, c) in enumerate(m['cards'])), 'flex-direction:row;gap:26px;justify-content:center') +
      abs_(100, 640, 1700, P(m['tip'], 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:16px 28px;justify-content:center'), m['notes'], FOOT))
    tg = sp['together']
    S.append(frame('together', 'blue', '🤝 نُطَبِّقُ مَعًا', '7 دَقائِقَ', tg['title'],
      abs_(100, 290, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(e, 70) + P(t, 28, '#1F2A3C', True, True), 380, 380, '#fff', '#2F6A9A') + '</div>' for k, (e, t) in enumerate(tg['cards'])), 'flex-direction:row;gap:26px;justify-content:center') +
      abs_(100, 730, 1700, P(tg['q'], 32, '#2F6A9A', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center') +
      abs_(100, 850, 1700, P('📘 ' + tg['book'], 28, '#1F7A6D', True), 'justify-content:center'), tg['notes'], FOOT))
    c = sp['check']
    S.append(frame('check', 'mint', '🚦 إِشارَةُ الِانْطِلاقِ', '2 دَقيقَتانِ', c['title'],
      abs_(100, 270, 1700, ''.join(card(P(e, 84) + P(l, 34, '#1F7A6D', True, True) + P(t, 32, '#1F2A3C'), 700, 380, '#fff', '#1F7A6D') for e, l, t in c['cards']), 'flex-direction:row;gap:60px;justify-content:center') +
      abs_(100, 690, 1700, '<div data-build-in="pop 1" style="background:#1F7A6D;border-radius:26px;padding:12px 30px;display:flex">' + P(c['answer'], 34, '#fff', True, True) + '</div>', 'justify-content:center') +
      abs_(100, 800, 1700, P('🟥 أَحْتاجُ مُساعَدَةً     🟨 قَليلًا     🟩 جاهِزٌ', 30, '#1F2A3C', True), 'justify-content:center'), 'يرفع كل طالب بطاقة (أ) أو (ب). الموقفان من إعداد حراء.', FOOT))
    S.append(frame('truefalse', 'rose', '👍👎 أُفَكِّرُ وَأُصَحِّحُ', '3 دَقائِقَ', 'صَحيحٌ أَمْ خَطَأٌ؟',
      abs_(100, 270, 1700, ''.join(f'<div style="display:flex;flex-direction:row;align-items:center;gap:20px;background:#fff;border-radius:24px;padding:12px 24px;border:3px solid #B4483F"><p style="{FONT};font-size:34px;color:#B4483F">{k + 1}</p>' + P(s, 32, '#1F2A3C', False, False, 'right', 'flex:1') + f'<div data-build-in="pop {k + 1}" style="background:#F9DAD6;border-radius:20px;padding:6px 18px;display:flex">' + P('👍 صَحيحٌ' if ok else '👎 خَطَأٌ', 30, '#B4483F', True, True) + '</div></div>' for k, (s, ok) in enumerate(sp['tf'])), 'flex-direction:column;gap:18px'), sp['tf_notes'], FOOT))
    G = sp['groups']; cols = ['#B0782A', '#5E6672', '#5546A3', '#1F7A6D']; pals = ['sand', 'blue', 'lav', 'mint']; sts = ['⭐', '⭐⭐', '⭐⭐⭐', '🌱']; nms = ['مُبْتَدِئٌ', 'مُتَطَوِّرٌ', 'مُتَمَكِّنٌ', 'قيمَةٌ']
    S.append(frame('groups', 'sky', '👥 خَريطَةُ الْمَجْموعاتِ', '10 دَقائِقَ', 'نَعْمَلُ مَعًا',
      abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(sts[k], 52) + P('الْمَجْموعَةُ ' + str(k + 1), 32, cols[k], True, True) + P(G[k]['short'], 28, '#1F2A3C') + P(nms[k], 26, cols[k], True), 400, 400, '#fff', cols[k]) + '</div>' for k in range(4)), 'flex-direction:row;gap:26px;justify-content:center') +
      abs_(100, 730, 1700, P('🧭 الْقائِدُ     ✏️ الرَّسّامُ     🗣️ الْمُتَحَدِّثُ     ⏰ حارِسُ الْوَقْتِ', 32, '#1B7F9E', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'), 'وزّع الأدوار الأربعة داخل كل مجموعة.', FOOT))
    for k in range(4):
        g = G[k]
        S.append(frame('g%d' % (k + 1), pals[k], '👥 عَمَلٌ جَماعِيٌّ', '10 دَقائِقَ', f'الْمَجْموعَةُ {k + 1}: {g["short"]}',
          abs_(100, 280, 1700, ''.join(f'<div data-build-in="pop {i + 1}" style="background:#fff;border:3px solid {cols[k]};border-radius:26px;padding:20px 30px;display:flex;width:1700px">' + P(s, 36, '#1F2A3C', False, False, 'right', 'line-height:1.6') + '</div>' for i, s in enumerate(g['steps'])), 'flex-direction:column;gap:22px') +
          abs_(100, 690, 1700, '<div data-build-in="pop 3" style="background:' + PAL[pals[k]][2] + ';border-radius:26px;padding:18px 30px;display:flex;flex-direction:column;gap:6px;width:1700px">' + P('★ تَحَدّي الْأَبْطالِ', 30, cols[k], True, True, 'right') + P(g['challenge'], 34, '#1F2A3C', True, False, 'right') + '</div>'),
          'تجوّل بين المجموعات واطرح أسئلة موجّهة.', FOOT))
    S.append(frame('models', 'mint', '✅ نَتَحَقَّقُ مَعًا', '4 دَقائِقَ', 'نَماذِجُ الْإِجابَةِ',
      abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="background:#fff;border:3px solid #1F7A6D;border-radius:24px;padding:14px 26px;display:flex;flex-direction:row;gap:20px;align-items:center;width:1700px">' + P(f'الْمَجْموعَةُ {k + 1}', 30, '#1F7A6D', True, True, 'right', 'flex:none;width:260px') + P(G[k]['model'], 28, '#1F2A3C', False, False, 'right', 'flex:1;line-height:1.5') + '</div>' for k in range(4)), 'flex-direction:column;gap:18px'),
      sp['models_note'], FOOT))
    S.append(b.S[[re.search(r'id="([^"]+)"', x).group(1) for x in b.S].index('feedback')])
    L = sp['levels_work']
    S.append(frame('levels', 'peach', '🚀 تَحَدّي الْمُسْتَوَياتِ', '10 دَقائِقَ', 'كُلٌّ في مُسْتَواهُ',
      abs_(100, 270, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="display:flex">' + card(P(LV[k][0], 44) + P(LV[k][1], 34, LCOL[k], True, True) + ''.join(P('✏️ ' + x, 28, '#1F2A3C') for x in xs), 540, 400, '#fff', LCOL[k]) + '</div>' for k, xs in enumerate(L['rows'])), 'flex-direction:row;gap:26px;justify-content:center') +
      abs_(100, 730, 1700, P('🏆 ' + L['challenge'], 32, '#B0582F', True, True), 'background:#fff;border-radius:26px;padding:14px 26px;justify-content:center'), 'وزّع الأوراق الثلاث وورقة أصحاب الهمم.', FOOT))
    v = sp['value']
    S.append(frame('value', 'mint', '🌱 قيمَةٌ نَعيشُها', '4 دَقائِقَ', v['title'],
      b.cards_row(v['cards'], 520, 340, 'mint', 28, 280) + abs_(100, 650, 1700, P(v['q'], 32, '#5546A3', True, True), 'background:#fff;border-radius:26px;padding:16px 28px;justify-content:center'), v['notes'], FOOT))
    wt = sp['watani']
    S.append(frame('watani', 'sky', '🇦🇪 أَنا مُواطِنٌ إيجابِيٌّ', '3 دَقائِقَ', 'مِنْ دَرْسي إِلى وَطَني',
      abs_(100, 280, 1700, card(P('🏠 ' + wt['line'], 40, '#1B7F9E', True, True), 1700, 200, '#fff', '#1B7F9E')) +
      abs_(100, 540, 1700, ''.join(f'<div data-build-in="pop {k + 1}" style="background:#fff;border-radius:26px;padding:16px 28px;display:flex">' + P(t, 32, '#1F2A3C', True, True) + '</div>' for k, t in enumerate(('❤️ أُحِبُّ وَطَني', '🗣️ أَلْتَزِمُ بِسَنْعي', '🤲 أُعَلِّمُ غَيْري'))), 'flex-direction:row;gap:26px;justify-content:center') +
      abs_(100, 760, 1700, P('💡 ' + wt['q'], 32, '#1B7F9E', True, True), 'justify-content:center'), wt['notes'], FOOT))
    Q = sp['quick']
    def rot(o, a, k):  # vary the correct position deterministically
        s = k % len(o); o2 = o[s:] + o[:s]; return o2, (a - s) % len(o)
    qh = ''
    for k, (qq, os_, a) in enumerate(Q):
        o2, a2 = rot(os_, a, k)
        qh += '<div style="background:#fff;border:3px solid #5546A3;border-radius:24px;padding:12px 24px;display:flex;flex-direction:row;align-items:center;gap:18px;width:1700px">' + P(f'{k + 1}', 34, '#5546A3', True, True) + P(qq, 30, '#1F2A3C', True, False, 'right', 'flex:1') + ''.join(f'<p style="font-size:24px;color:#1F2A3C;background:#F3F0FB;border-radius:18px;padding:8px 14px">{o}</p>' for o in o2) + '</div>'
    ans = ' · '.join(f'{k + 1}: ' + 'أبج'[rot(os_, a, k)[1]] for k, (qq, os_, a) in enumerate(Q))
    S.append(frame('quick', 'lav', '⚡ 4 أَسْئِلَةٍ', '3 دَقائِقَ', 'تَحَدّي حِراءَ السَّريعُ', abs_(100, 270, 1700, qh, 'flex-direction:column;gap:16px'),
      'اقرأ السؤال ودع الطلاب يجيبون على ألواحهم. الإجابات بالترتيب (أ=الأول من اليمين): ' + ans, FOOT))
    S.append(frame('exit', 'rose', '🎟️ أُجيبُ وَحْدي', '3 دَقائِقَ', 'تَذْكِرَةُ الْخُروجِ',
      abs_(100, 270, 1700, ''.join('<div style="background:#fff;border:3px solid #B4483F;border-radius:24px;padding:18px 28px;display:flex;flex-direction:row;gap:18px;width:1700px;align-items:center">' + P(f'{k + 1}', 36, '#B4483F', True, True) + P(t, 32, '#1F2A3C', False, False, 'right', 'flex:1') + '</div>' for k, t in enumerate(sp['exit']['qs'])), 'flex-direction:column;gap:20px') +
      abs_(100, 760, 1700, P('تُجْمَعُ الْبِطاقاتُ لِنَبْدَأَ بِها الدَّرْسَ الْقادِمَ.', 26, '#8A8475'), 'justify-content:center'), 'الإجابات: ' + sp['exit']['answers'], FOOT))
    S.append(b.progress('progress2', 'قِياسُ التَّقَدُّمِ: بَعْدَ الدَّرْسِ', 'أَخْتارُ الْوَجْهَ مَرَّةً أُخْرى، وَأُقارِنُ بِبِدايَةِ الْحِصَّةِ.', '2 دَقيقَتانِ'))
    S.append(frame('mirror', 'sand', '🪞 مِرْآةُ التَّعَلُّمِ', '2 دَقيقَتانِ', 'ماذا تَعَلَّمْتُ؟',
      abs_(100, 270, 1700, ''.join('<div data-build-in="pop %d" style="background:#fff;border:3px solid %s;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:8px;width:1700px">' % (k + 1, cc) + P(a, 32, cc, True, True, 'right') + P(t, 32, '#1F2A3C', False, False, 'right') + '</div>' for k, (a, t, cc) in enumerate(zip(('🪞 تَعَلَّمْتُ الْيَوْمَ', '❓ أَتَساءَلُ', '🔬 أَرْبِطُ'), sp['mirror'], ('#B0782A', '#5546A3', '#1F7A6D')))), 'flex-direction:column;gap:22px'),
      'اطلب من ثلاثة طلاب إكمال الجمل شفويًّا.', FOOT))
    hm = sp['home']
    S.append(frame('home', 'peach', '🏠 مَعَ أُسْرَتي', None, 'رِسالَتي إِلى الْبَيْتِ',
      abs_(100, 270, 1700, '<div style="background:#fff;border:3px solid #B0582F;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:14px;width:1700px">' + ''.join(P('☐ ' + t, 34, '#1F2A3C', False, False, 'right') for t in hm['checks']) + '</div>') +
      abs_(100, 600, 1700, '<div style="background:#FFE9A8;border-radius:26px;padding:20px 30px;display:flex;flex-direction:column;gap:6px;width:1700px">' + P('📸 مُهِمَّةُ أَداءٍ صَغيرَةٌ', 30, '#8A5A1E', True, True, 'right') + P(hm['task'], 34, '#1F2A3C', True, False, 'right') + '</div>') +
      abs_(100, 800, 1700, P('⭐ أَحْسَنْتَ يا بَطَلَ حِراءَ', 40, '#B0582F', True, True), 'justify-content:center'), hm['notes'], FOOT))
    S = [x.replace(OLDF, FOOT) for x in S]
    out = ROOT + '/resources/ssd/%s/teacher-deck.html' % sp['code']
    os.makedirs(os.path.dirname(out), exist_ok=True)
    return build(out, sp['title'], sp['lesson_id'], S)

def sheets(sp):
    src = open(os.path.join(HERE, 'sheets_y1_t1_l01.py'), encoding='utf8').read().split('# ---------- worksheets')[0]
    g = {}; exec(src, g)
    OUT = ROOT + '/resources/ssd/%s/' % sp['code']; os.makedirs(OUT, exist_ok=True)
    g['T'] = sp['title']; g['SUB'] = 'السَّنْعُ الْإِماراتِيُّ · الصَّفُّ الْأَوَّلُ · ' + sp['pages']
    doc, hd, NM, q, pics, row, TH, page, LEVELS = (g[x] for x in ('doc', 'hd', 'NM', 'q', 'pics', 'row', 'TH', 'page', 'LEVELS'))
    PIC = g['PIC']; ws = sp['ws']; pod = sp['pod']
    def intro(h=24):
        im = f"<img src='{PIC}{sp['intro_pic']}.webp' style='height:{h}mm;max-width:40mm;object-fit:contain;border-radius:10px'>" if sp.get('intro_pic') else f"<span class='big' style='font-size:40pt'>{sp['cover_emoji']}</span>"
        return f"<div style='display:flex;align-items:center;gap:10px;margin:4px 0 6px'>{im}<b style='font-family:TD'>{sp['intro_line']}</b></div>"
    def thp(*pairs):
        return ''.join(row(t, TH) for t in pairs)
    pgs = []
    for i, (nm, c, bg) in enumerate(LEVELS):
        h = hd('وَرَقَةُ عَمَلٍ', bg, 'الْمُسْتَوى: ' + nm, c) + NM + intro()
        if i == 0:
            body = q(1, c, 'أُلَوِّنُ الرَّمْزَ الْمُناسِبَ:', ''.join(row(t, pics(*e)) for t, e in ws['b_pics'])) + q(2, c, 'أُلَوِّنُ 👍 إِذا كانَتِ الْجُمْلَةُ صَحيحَةً، وَ 👎 إِذا كانَتْ خَطَأً:', thp(*ws['b_tf']))
        elif i == 1:
            L = ''.join(f"<div><span style='flex:1'>{a}</span><span class='dot'></span></div>" for a, _ in ws['s_match']); R = ''.join(f"<div><span class='dot'></span><span style='flex:1'>{bb}</span></div>" for _, bb in ws['s_match'][::-1])
            body = q(1, c, 'أَصِلُ بِخَطٍّ:', f"<div class='mt'><div class='c'>{L}</div><div class='c'>{R}</div></div>") + q(2, c, ws['s_color'][0], row(ws['s_color'][1], pics(*ws['s_color'][2])))
        elif i == 2:
            gaps = ''.join(f"<div class='row'><span class='s'>{a} <span class=gap></span> {bb}</span></div>" for a, bb in ws['g_fill'])
            bank = ''.join(f'<span>{w}</span>' for w in ws['g_bank'])
            body = q(1, c, 'أَخْتارُ الْكَلِمَةَ الْمُناسِبَةَ وَأَكْتُبُها في الْفَراغِ:', f"<div class='bank'><b>بَنْكُ الْكَلِماتِ:</b>{bank}</div>{gaps}") + q(2, c, 'أَنْسَخُ بِخَطٍّ جَميلٍ:', f"<div class='trace'>{ws['g_trace']}</div><div class='ln'></div>")
        else:
            body = q(1, c, ws['d_think'], "<div class='ln'></div>") + q(2, c, ws['d_draw'], "<div class='box' style='height:52mm'></div>")
        pgs.append(page(h + body))
    open(OUT + 'worksheets-A4.html', 'w', encoding='utf8').write(doc('وَرَقَةُ عَمَلٍ', ''.join(pgs)))
    c = '#3F6E5B'
    pd = (hd('نَشاطُ أَصْحابِ الْهِمَمِ', '#DCEAE4', 'أَنا أَسْتَطيعُ!', c) + NM + f"<div style='text-align:center;margin:10px 0'><span class='big' style='font-size:63pt'>{pod['emoji']}</span></div>"
          + f"<div class='k' style='font-size:24pt;text-align:center;background:#F6FBF8;border-color:#BFE3CC'>{pod['line']}</div>"
          + q(1, '#5E6672', 'أُلَوِّنُ الرَّمْزَ الْمُناسِبَ:', row(pod['pic'][0], pics(*pod['pic'][1]))) + q(2, '#5E6672', 'أُلَوِّنُ 👍 إِذا كانَتِ الْجُمْلَةُ صَحيحَةً، وَ 👎 إِذا كانَتْ خَطَأً:', thp(*pod['tf'])))
    open(OUT + 'pod-sheet.html', 'w', encoding='utf8').write(doc('نَشاطُ أَصْحابِ الْهِمَمِ', page(pd)))
    def k(t, cc, bg): return f"<div class='k' style='border-color:{cc};background:{bg}'>{t}</div>"
    ak = (hd('مِفْتاحُ الْإِجابَةِ', '#DCEAE4', '👩‍🏫', c) + k('<b>بُرونْزِيٌّ:</b> ' + sp['key']['b'], '#9A5A26', '#F7E9DC') + k('<b>فِضِّيٌّ:</b> ' + sp['key']['s'], '#5E6672', '#EDEFF2')
          + k('<b>ذَهَبِيٌّ:</b> ' + sp['key']['g'], '#A87A0C', '#FBF1D3') + k('<b>ماسِيٌّ:</b> ' + sp['key']['d'], '#5546A3', '#EEEAFB') + k('<b>نَشاطُ أَصْحابِ الْهِمَمِ:</b> ' + sp['key']['pod'], '#ddd', '#fff')
          + k('<b>نَماذِجُ إِجابَةِ الْمَجْموعاتِ:</b> ' + ' &nbsp;|&nbsp; '.join(f"الْمَجْموعَةُ {i + 1}: {x['model']}" for i, x in enumerate(sp['groups'])), '#3E9E5B', '#F1F8F3') + f"<div class='k'>{sp['key']['note']}</div>")
    open(OUT + 'answer-key.html', 'w', encoding='utf8').write(doc('مِفْتاحُ الْإِجابَةِ', page(ak)))
    def vc(t, d, col, bg): return f"<div style='flex:1;min-width:30%;border-radius:14px;background:{bg};padding:6px 10px;text-align:center'><div style='font-family:TD;font-size:22pt;color:{col}'>{t}</div><div style='font-size:12pt'>{d}</div></div>"
    EM = "font-family:'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif;font-size:36pt;flex:none"
    def learn(e, t): return f"<div style='display:flex;align-items:center;gap:8px;border-radius:14px;background:#FFFBF0;padding:6px'><span style=\"{EM}\">{e}</span><span>{t}</span></div>"
    cc4 = [('#9A5A26', '#F7E9DC'), ('#5E6672', '#EDEFF2'), ('#A87A0C', '#FBF1D3'), ('#5546A3', '#EEEAFB'), ('#1F7A6D', '#DDF1EC')]
    cd = (hd('بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ', '#DCEAE4', 'لِلْجَميعِ', c)
          + f"<div class='k' style='background:#FFF8EA;border-color:#E3C07A'><b>📖 مِنْ كِتابي {sp['pages']}</b><div style='font-family:TD;font-size:{sp['card_fs']}pt;line-height:1.8;margin-top:4px'>{sp['card_text']}</div><div style='text-align:center;font-size:9.5pt;color:#5B6472'>نَصُّ الْكِتابِ كَما وَرَدَ، وَالتَّشْكيلُ وَالرُّموزُ مِنْ إِعْدادِ حِراءَ</div></div>"
          + "<div class='k'><b>📘 كَلِماتي</b> <span style='font-size:9.5pt;color:#5B6472'>(الْكَلِماتُ مِنْ مَفاهيمِ الْمِحْوَرِ، وَالشَّرْحُ الْمُبَسَّطُ مِنْ إِعْدادِ حِراءَ)</span><div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:6px'>"
          + ''.join(vc(t, d, *cc4[i % 5]) for i, (e, t, d) in enumerate(sp['vocab'])) + "</div></div>"
          + "<div class='k'><b>💡 تَعَلَّمْتُ</b><div style='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px'>" + ''.join(learn(e, t) for e, t in sp['learn']) + "</div></div>"
          + "<div class='k'><b>✅ أُطَبِّقُ</b>" + ''.join(f"<div class='row'><span style='font-size:23pt'>☐</span><span class='s'>{t}</span></div>" for t in sp['home']['checks']) + "</div>"
          + "<div style='text-align:center;margin-top:8px'><span style='font-family:TD;font-size:24pt;background:#C2508A;color:#fff;border-radius:24px;padding:6px 26px'>🏅 ⭐ أَحْسَنْتَ</span></div>")
    open(OUT + 'sources-concept-card.html', 'w', encoding='utf8').write(doc('بِطاقَةُ الْمَصادِرِ وَالْمَفاهيمِ', page(cd)))
    gcol = [('#C9822B', '#FBEBD6', '⭐ مُبْتَدِئٌ:'), ('#2F6A9A', '#DDEBF7', '⭐⭐ مُتَطَوِّرٌ:'), ('#1F7A6D', '#DDF1EC', '⭐⭐⭐ مُتَمَكِّنٌ:'), ('#C2508A', '#FBE3EF', '🌱 قيمَةٌ نَعيشُها:')]
    def gc(i):
        cc, bg, lab = gcol[i]; x = sp['groups'][i]
        return (f"<div class='gc' style='border-color:{cc}'>" + hd('بِطاقَةُ مَجْموعَةٍ', bg, f'الْمَجْموعَةُ {i + 1}', cc) + "<div style='font-size:11pt;margin:4px 0'>🧭 الْقائِدُ · ✏️ الرَّسّامُ · 🗣️ الْمُتَحَدِّثُ · ⏰ حارِسُ الْوَقْتِ</div>"
                + f"<div class='k' style='background:{bg};border-color:{cc}'><b>{lab}</b> {x['task']}</div>" + ''.join(f"<div class='row'><span style='font-size:23pt'>✏️</span><span class='s'>{s}</span></div>" for s in x['steps'])
                + "<div class='box' style='height:30mm;margin-top:6px'></div>" + f"<div class='star'><b>★ تَحَدّي الْأَبْطالِ:</b> {x['challenge']}</div></div>")
    open(OUT + 'group-work.html', 'w', encoding='utf8').write(doc('بِطاقَةُ مَجْموعَةٍ', "<div class='page'><div class='fit'>" + gc(0) + gc(1) + "</div></div><div class='page'><div class='fit'>" + gc(2) + gc(3) + "</div></div>"))
    return sorted(os.listdir(OUT))

def run(sp):
    print(sp['code'], 'slides', deck(sp), sheets(sp))

if __name__=='__main__':
    import lessons_y1_t1 as L, lessons_y1_t1_b as L2
    for k in sys.argv[1:]: run(getattr(L,k,None) or getattr(L2,k))
