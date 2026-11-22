#!/usr/bin/env python3
# Compact spec builder for Sanaa T2/T3 (Y1 base). Book text from the student book pp.46-97 (condensed where noted); all other wording is Hiraa's.
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from deckkit import P
from lessons_y1_t1 import two_col
from lessons_y1_t1_b import mk, V
from ids_t2t3 import IDS as DBIDS

def tp(t, pg, note, title='نَصُّ الدَّرْسِ'):
    n = len(t); s = 44 if n <= 140 else 38 if n <= 230 else 32 if n <= 330 else 28
    return (title, P(t, s, '#1F2A3C', False, False, 'right', 'line-height:1.75'), note, pg)

def tl(title, items, pg, note, fs=None):
    fs = fs or (34 if len(items) <= 4 else 30 if len(items) <= 6 else 27)
    return (title, two_col(items, fs), note, pg)

def q(t, who): return (P(t, 44, '#1F2A3C', True, True, 'right', 'line-height:1.7') + P(who, 30, '#8A5A1E', True, False, 'right'))

def mk3(d, prev_title='السَّنْعُ الْإِماراتِيُّ'):
    it = d['items']
    fill = [(a, c) for a, b, c in d['fill']]; ans = [b for a, b, c in d['fill']]
    D = dict(d)
    D['code'] = 'SN-Y1-' + d['n']; D['id'] = DBIDS[D['code']]
    D.setdefault('lv', ['أَذْكُرُ واحِدًا مِمّا تَعَلَّمْتُ.', 'أَذْكُرُ اثْنَيْنِ وَأَشْرَحُ أَحَدَهُما.', 'أَرْبِطُ مَوْقِفًا بِما تَعَلَّمْتُ وَأُفَسِّرُ.'])
    D['prev'] = [(d.get('prev_e', '🏠'), prev_title, 'ما تَعَلَّمْناهُ سابِقًا'), ('🇦🇪', 'السَّنْعُ الْإِماراتِيُّ', 'أَخْلاقٌ نَعْتَزُّ بِها')]
    D['prev_line'] = '🔬 الْيَوْمَ نَسْأَلُ: ' + d['ask']
    D['hook_title'] = d['hook'][0]; D['hook_q'] = d['hook'][1]; D['hook_reveal'] = '✨ الْيَوْمَ نَتَعَلَّمُ: ' + d['title']
    D.setdefault('know_line', '🗣️ أَيُّ بِطاقَةٍ أُحِبُّها أَكْثَرَ؟ وَلِماذا؟')
    D.setdefault('tip', '💡 أَرى مَوْقِفًا ثُمَّ أَسْأَلُ: أَيُّ سَنْعٍ يُناسِبُهُ؟')
    D['tg_title'] = 'أَتَعَرَّفُ ' + d['short']; D['tg_q'] = '👆 أَيُّ بِطاقَةٍ أَسْتَطيعُ تَطْبيقَها؟ كَيْفَ؟'
    D['tg_book'] = 'أَقْرَأُ وَأَتَعَرَّفُ ' + d['short'] + '.'
    D['tg_notes'] = 'الرموز من إعداد حراء؛ دع الطلاب يقرؤون الصفحات من كتبهم. الصور الفوتوغرافية للشخصيات العامة في الكتاب لا تُنسخ هنا.'
    D['ck_title'], D['ck'], D['ck_ans'] = d['ck']
    D['bank'] = ans + [d.get('distract', 'لُعْبَةٌ')]
    D['fill'] = fill
    D['key_g'] = '1 - ' + ' · '.join(ans) + ' &nbsp;|&nbsp; 2 - نَسْخٌ'
    D['value'] = dict(title=d['val'][0], cards=d['val'][1], q='🌱 كَيْفَ أُطَبِّقُ ما تَعَلَّمْتُ؟', notes=d.get('val_note', 'اربط بقيم المحور المذكورة في كتاب الطالب.'))
    D['watani'] = dict(line='سَنْعي يَعْكِسُ صورَةَ وَطَني', q='كَيْفَ يَعْكِسُ سَنْعي صورَةً جَميلَةً عَنْ وَطَني؟', notes='إجابات الطلاب مفتوحة.')
    D['exit'] = dict(qs=[d['ex'][0], d['ex'][1], 'سَأُطَبِّقُ في بَيْتي …'], answers=d['ex'][2] + ' 3) مفتوح.')
    D['mirror'] = ['أَنَّ ' + d['short'] + ' …', 'كَيْفَ أُطَبِّقُهُ …؟', 'أَرْبِطُهُ بِمَوْقِفٍ في بَيْتي: …']
    D['home'] = dict(checks=d['home'] + ['أَعْتَزُّ بِسَنْعي الْإِماراتِيِّ.'], task=d['home_task'], notes='المهمة اختيارية.')
    D['intro_line'] = d['pod_line']
    D['hook_title'] = d['hook'][0]
    D['src_note'] = d['src_note']
    for k in ('prev_e', 'ask', 'hook', 'short', 'val', 'ex', 'n', 'distract', 'val_note'):
        D.pop(k, None)
    D['home'] = dict(checks=d['home'] + ['أَعْتَزُّ بِسَنْعي الْإِماراتِيِّ.'], task=d['home_task'], notes='المهمة اختيارية.')
    D['home_x'] = None; D.pop('home_x')
    D['home_task'] = None; D.pop('home_task')
    return mk(D)

SPECS = []   # (key, builder-dict)
def add(d): SPECS.append(d)

def build():
    from importlib import import_module
    for m in ('t2t3_a', 't2t3_b', 't2t3_c'):
        try: import_module(m)
        except ModuleNotFoundError as e:
            if e.name != m: raise
    out = {}; prev = 'السَّنْعُ الْإِماراتِيُّ'
    for d in SPECS:
        key = d['n']; out[key] = mk3(d, prev); prev = d['title']
    return out
