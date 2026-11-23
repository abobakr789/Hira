"""L01-only approved teaching-slide pictures (harakat, where, g1). Idempotent; uses L01's own vocab art."""
import re, json, os
S = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'l01_svgs.json'), encoding='utf8'))
lion, ear, pot, rab = S['سَدٌ'], S['ذُنٌ'], S['بْريقٌ'], S['رْنَبٌ']
def sz(svg, hh): return re.sub(r'height="\d+"', 'height="%d"' % hh, svg, count=1)
CSS = '''<style id="hira-img-sample">
#harakat .he{display:flex;align-items:center;justify-content:center;gap:16px}#harakat .he .xw2{white-space:nowrap}
#harakat .xi{display:inline-flex}
#where .whq{position:relative}
#where .xw{position:absolute;left:70px;top:14px;display:flex}
#g1 .gch .xr svg{position:static}#g1 .xr{display:flex;justify-content:center;gap:26px;margin-top:40px;margin-left:-76px}
#g1 .xr figure{margin:0;text-align:center}
#g1 .xr figcaption{font:700 26px "Thmanyah Display",Tahoma,sans-serif;color:#7a4a22;margin-top:2px}
</style>'''
def apply_l01(h):
    if 'id="hira-img-sample"' in h:
        return h
    h = h.replace('</head>', CSS + '</head>', 1)
    # harakat
    for w,svg,key in (('أَسَدٌ',lion,'سَدٌ'),('أُذُنٌ',ear,'ذُنٌ'),('إِبْريقٌ',pot,'بْريقٌ')):
        pat=re.compile(r'(<p class="he">)(مِثْلُ: <span class="L">[^<]*</span>%s)(</p>)'%re.escape(key))
        assert pat.search(h),w
        h=pat.sub(lambda m:m.group(1)+'<span class="xw2">'+m.group(2)+'</span><span class="xi" data-added="img">'+sz(svg,92)+'</span>'+m.group(3),h,count=1)
    # where
    pat='<div class="cd whq">'
    assert pat in h
    h=h.replace(pat,pat+'<div class="xw" data-added="img">'+sz(lion,130)+'</div>',1)
    # g1
    anchor='<p>نَبْحَثُ في الصَّفِّ عَنْ شَيْئَيْنِ يَبْدَآنِ بِصَوْتِ (أ)، وَنَرْسُمُهُما في لَوْحَتِنا.</p>'
    assert anchor in h
    row='<div class="xr" data-added="img">'+''.join('<figure>%s<figcaption>%s</figcaption></figure>'%(sz(s,110),c) for s,c in((lion,'أَسَدٌ'),(ear,'أُذُنٌ'),(pot,'إِبْريقٌ'),(rab,'أَرْنَبٌ')))+'</div>'
    h=h.replace(anchor,anchor+row,1)
    return h
