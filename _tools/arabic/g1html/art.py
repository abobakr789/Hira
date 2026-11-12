# Hand-drawn flat SVG illustrations for Grade 1 «أوشي الأرنب الأكول (أ)»
N="#1F2A3C"
def svg(vb,body,w=None,h=None,cls=""):
    sz=(f'width="{w}" ' if w else '')+(f'height="{h}" ' if h else '')
    return f'<svg class="{cls}" {sz}viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">{body}</svg>'
def carrot(x,y,s=1,r=0):
    return f'''<g transform="translate({x} {y}) rotate({r}) scale({s})"><path d="M-6 -2 Q-18 -26 -4 -34 Q2 -22 0 -6Z" fill="#4CA65A" stroke="{N}" stroke-width="3"/><path d="M4 -2 Q14 -28 26 -24 Q18 -10 6 -4Z" fill="#5DBB6A" stroke="{N}" stroke-width="3"/><path d="M-16 0 Q0 -8 16 0 L2 74 Q0 80 -2 74Z" fill="#F28C28" stroke="{N}" stroke-width="4" stroke-linejoin="round"/><path d="M-8 18 L0 16 M-4 36 L4 34 M-6 52 L2 50" stroke="#C9661A" stroke-width="3" stroke-linecap="round"/></g>'''
def rabbit(w=None,h=None,carr=True,sleep=False):
    eyes = (f'<path d="M116 136 q12 10 24 0" stroke="{N}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M160 136 q12 10 24 0" stroke="{N}" stroke-width="5" fill="none" stroke-linecap="round"/>' if sleep else
            f'<circle cx="128" cy="136" r="10" fill="{N}"/><circle cx="131" cy="132" r="3.5" fill="#fff"/><circle cx="172" cy="136" r="10" fill="{N}"/><circle cx="175" cy="132" r="3.5" fill="#fff"/>')
    b=f'''<ellipse cx="150" cy="330" rx="100" ry="12" fill="{N}" opacity=".12"/>
<g transform="rotate(-14 118 70)"><ellipse cx="118" cy="62" rx="24" ry="64" fill="#fff" stroke="{N}" stroke-width="5"/><ellipse cx="118" cy="66" rx="11" ry="44" fill="#F7B6C2"/></g>
<g transform="rotate(14 182 70)"><ellipse cx="182" cy="62" rx="24" ry="64" fill="#fff" stroke="{N}" stroke-width="5"/><ellipse cx="182" cy="66" rx="11" ry="44" fill="#F7B6C2"/></g>
<ellipse cx="150" cy="250" rx="88" ry="76" fill="#fff" stroke="{N}" stroke-width="5"/>
<circle cx="236" cy="282" r="24" fill="{N}"/>
<ellipse cx="150" cy="262" rx="46" ry="42" fill="#F4F1EC"/>
<ellipse cx="102" cy="320" rx="30" ry="14" fill="#fff" stroke="{N}" stroke-width="5"/><ellipse cx="198" cy="320" rx="30" ry="14" fill="#fff" stroke="{N}" stroke-width="5"/>
<circle cx="150" cy="148" r="64" fill="#fff" stroke="{N}" stroke-width="5"/>
{eyes}
<circle cx="112" cy="162" r="11" fill="#F7B6C2" opacity=".8"/><circle cx="188" cy="162" r="11" fill="#F7B6C2" opacity=".8"/>
<path d="M142 156 L158 156 L150 166Z" fill="#E77F96"/>
<path d="M150 166 L150 172 M150 172 q-10 10 -18 2 M150 172 q10 10 18 2" stroke="{N}" stroke-width="4" fill="none" stroke-linecap="round"/>
<rect x="144" y="176" width="12" height="11" rx="2" fill="#fff" stroke="{N}" stroke-width="3"/>'''
    if carr: b+=carrot(212,196,1.35,26)+f'<ellipse cx="196" cy="226" rx="16" ry="13" fill="#fff" stroke="{N}" stroke-width="4"/>'
    if sleep: b+=f'<text x="230" y="70" font-size="44" font-family="sans-serif" fill="#5B7BB4" font-weight="700">z</text><text x="262" y="36" font-size="32" font-family="sans-serif" fill="#5B7BB4" font-weight="700">z</text>'
    return svg("0 0 300 345",b,w,h)
def lion(w=None,h=None):
    mane="".join(f'<circle cx="{150+118*__import__("math").cos(k*0.5236):.1f}" cy="{150+118*__import__("math").sin(k*0.5236):.1f}" r="44" fill="#C8742A" stroke="{N}" stroke-width="5"/>' for k in range(12))
    b=f'''<ellipse cx="150" cy="292" rx="96" ry="10" fill="{N}" opacity=".12"/>{mane}<circle cx="150" cy="150" r="118" fill="#C8742A"/>
<circle cx="78" cy="78" r="26" fill="#F6C453" stroke="{N}" stroke-width="5"/><circle cx="222" cy="78" r="26" fill="#F6C453" stroke="{N}" stroke-width="5"/>
<circle cx="150" cy="156" r="92" fill="#F6C453" stroke="{N}" stroke-width="5"/>
<circle cx="116" cy="138" r="11" fill="{N}"/><circle cx="120" cy="134" r="4" fill="#fff"/><circle cx="184" cy="138" r="11" fill="{N}"/><circle cx="188" cy="134" r="4" fill="#fff"/>
<ellipse cx="150" cy="196" rx="40" ry="30" fill="#FBE3A6"/>
<path d="M134 172 L166 172 L150 190Z" fill="#8A4B1F" stroke="{N}" stroke-width="3" stroke-linejoin="round"/>
<path d="M150 190 v10 M150 200 q-14 14 -26 2 M150 200 q14 14 26 2" stroke="{N}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
<circle cx="98" cy="176" r="12" fill="#F2A65A" opacity=".7"/><circle cx="202" cy="176" r="12" fill="#F2A65A" opacity=".7"/>'''
    return svg("-14 -16 328 324",b,w,h)
def ear(w=None,h=None):
    b=f'''<ellipse cx="150" cy="292" rx="70" ry="9" fill="{N}" opacity=".12"/>
<path d="M162 30 C 84 26 56 110 92 152 C 110 172 98 206 116 238 C 134 274 196 270 200 230 C 204 204 230 186 236 146 C 246 84 222 34 162 30 Z" fill="#F6C9A8" stroke="{N}" stroke-width="6" stroke-linejoin="round"/>
<path d="M164 74 C 118 72 106 124 132 144 C 150 158 140 182 154 196" stroke="#D9895F" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M190 116 C 196 140 178 150 170 160" stroke="#D9895F" stroke-width="9" fill="none" stroke-linecap="round"/>
<g stroke="#5B9BD5" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"><path d="M40 120 q-16 30 0 60"/><path d="M18 100 q-26 50 0 100"/></g>'''
    return svg("0 0 300 300",b,w,h)
def ibriq(w=None,h=None):
    b=f'''<ellipse cx="150" cy="292" rx="96" ry="10" fill="{N}" opacity=".12"/>
<path d="M224 138 C 268 130 278 196 236 226" stroke="{N}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M224 138 C 268 130 278 196 236 226" stroke="#E7B54A" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M86 172 C 60 168 40 130 22 96 L 36 88 C 54 112 70 136 96 146 Z" fill="#2F8F8A" stroke="{N}" stroke-width="5" stroke-linejoin="round"/>
<path d="M104 96 L196 96 C 236 140 244 220 214 264 Q150 290 86 264 C 56 220 64 140 104 96 Z" fill="#2F8F8A" stroke="{N}" stroke-width="6" stroke-linejoin="round"/>
<path d="M80 200 Q150 226 220 200" stroke="#E7B54A" stroke-width="10" fill="none"/><path d="M90 160 Q150 178 210 160" stroke="#E7B54A" stroke-width="6" fill="none" opacity=".8"/>
<rect x="96" y="80" width="108" height="22" rx="10" fill="#E7B54A" stroke="{N}" stroke-width="5"/>
<path d="M118 80 Q150 40 182 80Z" fill="#2F8F8A" stroke="{N}" stroke-width="5"/><circle cx="150" cy="46" r="11" fill="#E7B54A" stroke="{N}" stroke-width="4"/>
<ellipse cx="120" cy="190" rx="12" ry="26" fill="#fff" opacity=".25"/>'''
    return svg("0 0 300 300",b,w,h)
def fish(w=None,h=None):
    b=f'''<ellipse cx="150" cy="282" rx="90" ry="9" fill="{N}" opacity=".12"/><path d="M226 150 L286 104 L280 196 Z" fill="#F08A5D" stroke="{N}" stroke-width="5" stroke-linejoin="round"/>
<ellipse cx="140" cy="150" rx="104" ry="72" fill="#F6A46B" stroke="{N}" stroke-width="5"/><path d="M110 100 Q140 60 180 90" fill="#F08A5D" stroke="{N}" stroke-width="5"/>
<circle cx="80" cy="134" r="13" fill="#fff" stroke="{N}" stroke-width="4"/><circle cx="76" cy="134" r="6" fill="{N}"/><path d="M50 168 q14 10 26 0" stroke="{N}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M150 120 q18 30 0 60 M182 120 q18 30 0 60" stroke="#D8743F" stroke-width="5" fill="none"/>'''
    return svg("0 0 300 300",b,w,h)
def carrotpic(w=None,h=None):
    return svg("0 0 300 300",f'<ellipse cx="150" cy="286" rx="70" ry="9" fill="{N}" opacity=".12"/>'+carrot(150,70,2.6,18),w,h)
def sun(w=None,h=None):
    rays="".join(f'<rect x="144" y="18" width="12" height="44" rx="6" fill="#F4B33A" transform="rotate({k*30} 150 150)"/>' for k in range(12))
    return svg("0 0 300 300",rays+f'<circle cx="150" cy="150" r="74" fill="#FFD25C" stroke="{N}" stroke-width="5"/><circle cx="126" cy="140" r="8" fill="{N}"/><circle cx="174" cy="140" r="8" fill="{N}"/><path d="M122 172 q28 24 56 0" stroke="{N}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="108" cy="166" r="10" fill="#F79A6B" opacity=".6"/><circle cx="192" cy="166" r="10" fill="#F79A6B" opacity=".6"/>',w,h)
def garden(w=None,h=None):
    b=f'''<rect x="0" y="0" width="400" height="300" rx="28" fill="#E3F2FB"/><circle cx="330" cy="62" r="30" fill="#FFD25C"/>
<path d="M0 230 Q100 196 200 222 T400 214 V300 H0Z" fill="#8CCB6E"/><path d="M0 262 Q120 240 240 258 T400 250 V300 H0Z" fill="#6DB257"/>
<rect x="88" y="128" width="20" height="100" rx="6" fill="#8A5A32" stroke="{N}" stroke-width="4"/><circle cx="98" cy="110" r="52" fill="#5FAE5A" stroke="{N}" stroke-width="4"/><circle cx="74" cy="96" r="9" fill="#E8574B"/><circle cx="116" cy="122" r="9" fill="#E8574B"/><circle cx="104" cy="84" r="9" fill="#E8574B"/>
''' + "".join(f'<g transform="translate({x} {y})"><path d="M0 0 v34" stroke="#3F8C3A" stroke-width="5"/><circle cx="0" cy="-6" r="13" fill="{c}" stroke="{N}" stroke-width="3"/><circle cx="0" cy="-6" r="5" fill="#FFD25C"/></g>' for x,y,c in [(230,236,"#F48FB1"),(270,230,"#B39DDB"),(310,240,"#FF8A65"),(350,232,"#F48FB1")])
    return svg("0 0 400 300",b,w,h)
def night(w=None,h=None):
    b=f'''<rect x="0" y="0" width="400" height="300" rx="28" fill="#2D3E6E"/><path d="M300 40 a46 46 0 1 0 40 70 a36 36 0 1 1 -40 -70Z" fill="#FFE08A"/>
''' + "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FFF3C4"/>' for x,y,r in [(60,50,4),(120,90,3),(200,40,5),(240,110,3),(80,140,3),(370,170,4)]) + f'''<rect x="40" y="200" width="320" height="60" rx="20" fill="#8FB3E8" stroke="{N}" stroke-width="4"/><rect x="56" y="186" width="80" height="34" rx="14" fill="#fff" stroke="{N}" stroke-width="4"/>'''
    return svg("0 0 400 300",b,w,h)
def face(kind,w=None,h=None):
    col={"sad":"#F28B82","mid":"#FFD25C","happy":"#7BCB8A"}[kind]
    m={"sad":'<path d="M70 118 q30 -22 60 0" stroke="#1F2A3C" stroke-width="8" fill="none" stroke-linecap="round"/>',
       "mid":'<path d="M72 112 h56" stroke="#1F2A3C" stroke-width="8" stroke-linecap="round"/>',
       "happy":'<path d="M64 104 q36 40 72 0" stroke="#1F2A3C" stroke-width="8" fill="#fff" stroke-linecap="round"/>'}[kind]
    return svg("0 0 200 200",f'<circle cx="100" cy="100" r="88" fill="{col}" stroke="{N}" stroke-width="7"/><circle cx="72" cy="78" r="10" fill="{N}"/><circle cx="128" cy="78" r="10" fill="{N}"/>{m}',w,h)
def clock(w=None,h=None):
    return svg("0 0 200 200",f'<circle cx="100" cy="104" r="80" fill="#fff" stroke="{N}" stroke-width="8"/><circle cx="52" cy="30" r="18" fill="#F2A93B" stroke="{N}" stroke-width="6"/><circle cx="148" cy="30" r="18" fill="#F2A93B" stroke="{N}" stroke-width="6"/>'+"".join(f'<rect x="97" y="34" width="6" height="14" rx="3" fill="{N}" transform="rotate({k*30} 100 104)"/>' for k in range(12))+f'<path d="M100 104 V62 M100 104 L132 120" stroke="{N}" stroke-width="8" stroke-linecap="round"/><circle cx="100" cy="104" r="7" fill="#E8574B"/>',w,h)
def star(w=None,h=None,fill="#F6C453"):
    return svg("0 0 100 100",f'<path d="M50 6 L62 36 L94 38 L69 58 L77 90 L50 72 L23 90 L31 58 L6 38 L38 36Z" fill="{fill}" stroke="{N}" stroke-width="4" stroke-linejoin="round"/>',w,h)
