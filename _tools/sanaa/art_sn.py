# رسوم توضيحية أصلية (SVG مسطّحة) لمادة السنع للصفوف 5–12. بلا وجوه ولا أنبياء ولا صحابة.
SAND, BROWN, TEAL, GREEN, GOLD, CREAM, RED, NAVY, DARK = '#E9D3A6', '#8A5A1E', '#1B7F9E', '#3E9E5B', '#C9822B', '#FFF8EA', '#B4483F', '#2F6A9A', '#1F2A3C'
def _w(inner, bg=CREAM, ac=GOLD):
    return ('<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" style="width:100%;height:100%;display:block">'
            f'<rect x="4" y="4" width="592" height="392" rx="34" fill="{bg}" stroke="{ac}" stroke-width="4"/>'
            f'<circle cx="540" cy="60" r="70" fill="{ac}" opacity=".10"/><circle cx="70" cy="350" r="90" fill="{ac}" opacity=".10"/>{inner}</svg>')
def _ground(c=SAND): return f'<path d="M4 320 C150 290 300 340 450 310 C520 296 560 306 596 300 V370 Q596 396 570 396 H30 Q4 396 4 370Z" fill="{c}"/>'
S = {}
S['dallah'] = _w(_ground() + f'''<path d="M255 120 h60 l22 30 c40 40 40 110 10 150 h-124 c-30 -40 -30 -110 10 -150z" fill="{GOLD}"/>
<path d="M270 100 h30 l8 20 h-46z" fill="{BROWN}"/><circle cx="285" cy="94" r="9" fill="{BROWN}"/>
<path d="M345 170 c70 -50 90 -70 100 -110 l14 6 c-10 50 -40 90 -100 140z" fill="{BROWN}"/>
<path d="M225 170 c-60 -20 -70 20 -50 60 c10 20 40 30 55 20" fill="none" stroke="{BROWN}" stroke-width="14" stroke-linecap="round"/>
<path d="M225 290 h120" stroke="{BROWN}" stroke-width="6"/><circle cx="285" cy="215" r="22" fill="{CREAM}" opacity=".5"/>
<g><path d="M410 300 h56 v-14 c0 -30 -56 -30 -56 0z" fill="#fff" stroke="{BROWN}" stroke-width="4"/><path d="M420 292 h36" stroke="{GOLD}" stroke-width="5"/></g>
<g><path d="M490 300 h56 v-14 c0 -30 -56 -30 -56 0z" fill="#fff" stroke="{BROWN}" stroke-width="4"/><path d="M500 292 h36" stroke="{GOLD}" stroke-width="5"/></g>
<g fill="{BROWN}"><ellipse cx="100" cy="305" rx="14" ry="8"/><ellipse cx="128" cy="311" rx="14" ry="8"/><ellipse cx="112" cy="296" rx="14" ry="8"/></g>''')
S['majlis'] = _w(f'''<path d="M120 330 V210 a180 180 0 0 1 360 0 V330z" fill="#fff" stroke="{BROWN}" stroke-width="8"/>
<path d="M150 330 V215 a150 150 0 0 1 300 0 V330z" fill="{SAND}" opacity=".55"/>
<line x1="300" y1="22" x2="300" y2="90" stroke="{BROWN}" stroke-width="4"/><path d="M280 90 h40 l-6 36 h-28z" fill="{GOLD}" stroke="{BROWN}" stroke-width="4"/><circle cx="300" cy="108" r="8" fill="#FFE9A8"/>
<rect x="60" y="316" width="480" height="52" rx="12" fill="{RED}" opacity=".85"/><path d="M80 342 h440" stroke="#FFE9A8" stroke-width="5" stroke-dasharray="14 10"/>
<rect x="150" y="262" width="90" height="58" rx="22" fill="{TEAL}"/><rect x="360" y="262" width="90" height="58" rx="22" fill="{GREEN}"/><rect x="255" y="274" width="90" height="46" rx="18" fill="{GOLD}"/>''')
S['falcon'] = _w(_ground() + f'''<rect x="150" y="270" width="300" height="26" rx="13" fill="{BROWN}"/>
<ellipse cx="300" cy="200" rx="62" ry="80" fill="{BROWN}"/><path d="M300 150 q-70 40 -50 140 q40 -20 58 -90z" fill="#6B4416"/>
<circle cx="300" cy="118" r="36" fill="{BROWN}"/><path d="M322 112 l36 14 l-34 10z" fill="{GOLD}"/><circle cx="312" cy="110" r="6" fill="#fff"/><circle cx="314" cy="110" r="3" fill="{DARK}"/>
<path d="M270 130 q-6 30 6 50" stroke="{DARK}" stroke-width="5" fill="none"/><path d="M280 262 l-18 40 M320 262 l18 40" stroke="{GOLD}" stroke-width="8" stroke-linecap="round"/>
<g fill="{SAND}"><circle cx="292" cy="200" r="6"/><circle cx="312" cy="215" r="6"/><circle cx="292" cy="230" r="6"/></g>''')
S['camel'] = _w(_ground('#F1DDB2') + f'''<g fill="{GOLD}"><rect x="170" y="190" width="240" height="84" rx="40"/><circle cx="260" cy="180" r="38"/><circle cx="340" cy="184" r="34"/>
<path d="M170 215 C120 170 110 120 130 90 l34 14 c-14 24 -4 56 30 86z"/><ellipse cx="128" cy="92" rx="34" ry="20"/></g>
<g fill="{BROWN}"><rect x="190" y="268" width="22" height="70" rx="8"/><rect x="236" y="268" width="22" height="70" rx="8"/><rect x="332" y="268" width="22" height="70" rx="8"/><rect x="378" y="268" width="22" height="70" rx="8"/></g>
<circle cx="116" cy="88" r="5" fill="{DARK}"/><rect x="200" y="206" width="170" height="22" rx="8" fill="{RED}"/><path d="M200 217 h170" stroke="#FFE9A8" stroke-width="4" stroke-dasharray="10 8"/>''')
S['horse'] = _w(_ground() + f'''<path d="M205 330 V190 a95 95 0 0 1 190 0 V330" fill="none" stroke="#9AA3AF" stroke-width="44" stroke-linecap="butt"/>
<path d="M205 330 V190 a95 95 0 0 1 190 0 V330" fill="none" stroke="#C5CBD3" stroke-width="22" stroke-linecap="butt"/>
<g fill="{DARK}"><circle cx="205" cy="290" r="8"/><circle cx="205" cy="232" r="8"/><circle cx="232" cy="150" r="8"/><circle cx="300" cy="112" r="8"/><circle cx="368" cy="150" r="8"/><circle cx="395" cy="232" r="8"/><circle cx="395" cy="290" r="8"/></g>
<g transform="translate(480 100)"><path d="M-22 40 l-14 60 l36 -20 l36 20 l-14 -60z" fill="{RED}"/><circle r="44" fill="{GOLD}"/><circle r="28" fill="{CREAM}"/><path d="M0 -16 l5 12 l13 1 l-10 8 l3 13 l-11 -7 l-11 7 l3 -13 l-10 -8 l13 -1z" fill="{GOLD}"/></g>''', bg='#FBF3E4')
S['dhow'] = _w(f'''<path d="M4 262 C60 236 110 288 170 262 C230 236 280 288 340 262 C400 236 450 288 510 262 C550 246 575 252 596 258 V370 Q596 396 570 396 H30 Q4 396 4 370Z" fill="{TEAL}" opacity=".85"/>
<path d="M120 250 h330 l-40 50 h-250z" fill="{BROWN}"/><rect x="288" y="70" width="8" height="180" fill="{DARK}"/>
<path d="M300 80 L170 232 H300z" fill="#fff" stroke="{BROWN}" stroke-width="4"/><path d="M308 100 L430 232 H308z" fill="{SAND}" stroke="{BROWN}" stroke-width="4"/>
<path d="M300 66 l40 10 l-40 10z" fill="{RED}"/><path d="M30 318 C90 296 150 340 210 318 C270 296 330 340 390 318 C450 296 510 340 570 318" fill="none" stroke="#fff" stroke-width="6" opacity=".6"/>
<g transform="translate(470 330)"><path d="M0 0 c0 -34 80 -34 80 0z" fill="{SAND}" stroke="{BROWN}" stroke-width="4"/><circle cx="40" cy="-10" r="12" fill="#fff" stroke="#CFCFCF" stroke-width="3"/></g>''', bg='#EAF6FB', ac=TEAL)
S['palmfort'] = _w(_ground() + f'''<circle cx="470" cy="100" r="44" fill="#FFD36B"/>
<rect x="190" y="170" width="220" height="140" fill="{SAND}" stroke="{BROWN}" stroke-width="5"/><rect x="170" y="130" width="64" height="180" fill="#E0C48E" stroke="{BROWN}" stroke-width="5"/>
<g fill="{BROWN}"><rect x="170" y="116" width="14" height="16"/><rect x="196" y="116" width="14" height="16"/><rect x="222" y="116" width="14" height="16"/><rect x="196" y="156" width="14" height="16"/><rect x="250" y="156" width="14" height="16"/><rect x="304" y="156" width="14" height="16"/><rect x="358" y="156" width="14" height="16"/></g>
<path d="M280 310 v-60 a30 30 0 0 1 60 0 v60z" fill="{BROWN}"/>
<g stroke="{BROWN}" stroke-width="10" stroke-linecap="round"><path d="M80 320 C84 250 78 200 90 150"/><path d="M510 320 C506 260 512 220 500 180"/></g>
<g fill="{GREEN}"><path d="M90 150 q-60 -20 -70 20 q40 -20 70 -10z"/><path d="M90 150 q50 -40 90 -10 q-50 -10 -90 20z"/><path d="M90 150 q-20 -50 20 -66 q-8 40 -20 66z"/>
<path d="M500 180 q-60 -20 -70 20 q40 -20 70 -10z"/><path d="M500 180 q50 -40 90 -10 q-50 -10 -90 20z"/><path d="M500 180 q-20 -50 20 -66 q-8 40 -20 66z"/></g>''', bg='#FFF3DC')
S['flag'] = _w(f'''<rect x="120" y="50" width="12" height="300" rx="6" fill="{DARK}"/><circle cx="126" cy="46" r="12" fill="{GOLD}"/>
<g><path d="M132 70 C220 40 300 100 410 66 V250 C300 284 220 224 132 254z" fill="#fff"/>
<path d="M132 70 C220 40 300 100 410 66 V126 C300 160 220 100 132 130z" fill="{GREEN}"/><path d="M132 190 C220 164 300 224 410 190 V250 C300 284 220 224 132 254z" fill="{DARK}"/>
<path d="M132 70 C150 66 160 66 172 66 V258 C158 258 146 256 132 254z" fill="{RED}"/></g>
<path d="M110 350 h420" stroke="{SAND}" stroke-width="10" stroke-linecap="round"/>''', bg='#F7FAF5', ac=GREEN)
S['home'] = _w(_ground() + f'''<path d="M130 170 L300 70 L470 170 V310 H130z" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M110 176 L300 60 L490 176" fill="none" stroke="{GOLD}" stroke-width="12" stroke-linejoin="round"/>
<path d="M260 310 V240 a40 40 0 0 1 80 0 V310z" fill="{BROWN}"/><rect x="160" y="200" width="60" height="60" rx="30" fill="{SAND}" stroke="{BROWN}" stroke-width="4"/><rect x="380" y="200" width="60" height="60" rx="30" fill="{SAND}" stroke="{BROWN}" stroke-width="4"/>
<path d="M300 130 c-30 -30 -62 4 -30 30 l30 24 l30 -24 c32 -26 0 -60 -30 -30z" fill="{RED}"/><g stroke="{BROWN}" stroke-width="9" stroke-linecap="round"><path d="M70 320 V240"/></g><circle cx="70" cy="226" r="34" fill="{GREEN}"/>''')
S['road'] = _w(f'''<path d="M300 40 L360 360 H240z" fill="#6B7585"/><path d="M300 60 V340" stroke="#fff" stroke-width="6" stroke-dasharray="26 22"/>
<rect x="60" y="210" width="130" height="100" rx="14" fill="{BROWN}"/><rect x="92" y="190" width="66" height="26" rx="10" fill="none" stroke="{BROWN}" stroke-width="8"/><rect x="60" y="244" width="130" height="14" fill="{GOLD}"/>
<g transform="translate(440 130)"><circle cx="0" cy="40" r="60" fill="#fff" stroke="{NAVY}" stroke-width="6"/><path d="M0 -4 l16 44 l-16 -12 l-16 12z" fill="{RED}"/><path d="M0 84 l16 -44 l-16 12 l-16 -12z" fill="{NAVY}"/></g>''', bg='#EEF5FB', ac=NAVY)
S['book'] = _w(_ground() + f'''<path d="M300 130 C250 100 170 100 110 120 V300 C170 280 250 280 300 310z" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M300 130 C350 100 430 100 490 120 V300 C430 280 350 280 300 310z" fill="#FFFDF6" stroke="{BROWN}" stroke-width="6"/>
<g stroke="{GOLD}" stroke-width="5" stroke-linecap="round"><path d="M140 160 h120"/><path d="M140 190 h120"/><path d="M140 220 h100"/><path d="M340 160 h120"/><path d="M340 190 h120"/><path d="M340 220 h100"/></g>
<path d="M470 70 l60 -34 l14 24 l-60 34z" fill="{TEAL}"/><path d="M470 94 l-30 60 l36 -12z" fill="{GOLD}"/>
<g fill="{RED}" opacity=".9"><rect x="70" y="60" width="110" height="54" rx="22"/><path d="M110 112 l-8 22 l28 -22z"/></g><circle cx="105" cy="87" r="5" fill="#fff"/><circle cx="125" cy="87" r="5" fill="#fff"/><circle cx="145" cy="87" r="5" fill="#fff"/>''')
S['clothes'] = _w(f'''<g><path d="M200 70 c0 -18 24 -18 24 0" fill="none" stroke="{DARK}" stroke-width="5"/><path d="M212 74 L120 110 H304z" fill="none" stroke="{DARK}" stroke-width="5"/>
<path d="M140 110 H284 L316 180 L290 196 V340 H134 V196 L108 180z" fill="#fff" stroke="{BROWN}" stroke-width="5"/><path d="M212 110 V190" stroke="{SAND}" stroke-width="5"/><circle cx="212" cy="130" r="5" fill="{GOLD}"/></g>
<g><path d="M390 70 c0 -18 24 -18 24 0" fill="none" stroke="{DARK}" stroke-width="5"/><path d="M402 74 L310 110 H494z" fill="none" stroke="{DARK}" stroke-width="5"/>
<path d="M330 110 H474 L520 340 H284z" fill="{DARK}"/><path d="M402 110 V340" stroke="{GOLD}" stroke-width="4"/><path d="M330 200 q72 24 144 0" fill="none" stroke="{GOLD}" stroke-width="5" stroke-dasharray="8 6"/></g>
<path d="M60 370 h480" stroke="{SAND}" stroke-width="8" stroke-linecap="round"/>''')
S['chat'] = _w(f'''<rect x="210" y="40" width="180" height="320" rx="30" fill="{DARK}"/><rect x="224" y="66" width="152" height="268" rx="14" fill="#fff"/><circle cx="300" cy="52" r="4" fill="#fff"/>
<g><rect x="236" y="90" width="100" height="34" rx="16" fill="{TEAL}"/><rect x="264" y="140" width="100" height="34" rx="16" fill="{SAND}"/><rect x="236" y="190" width="116" height="34" rx="16" fill="{TEAL}"/>
<path d="M300 296 c-22 -22 -48 4 -22 24 l22 18 l22 -18 c26 -20 0 -46 -22 -24z" transform="translate(0 -44)" fill="{RED}"/></g>
<rect x="60" y="110" width="110" height="60" rx="24" fill="{GOLD}"/><path d="M130 168 l14 24 l-34 -22z" fill="{GOLD}"/><rect x="430" y="200" width="110" height="60" rx="24" fill="{GREEN}"/><path d="M450 258 l-14 24 l34 -22z" fill="{GREEN}"/>''', bg='#EAF6FB', ac=TEAL)
S['mosque'] = _w(_ground() + f'''<path d="M200 300 V200 a100 100 0 0 1 200 0 V300z" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M300 70 V100" stroke="{GOLD}" stroke-width="6"/>
<circle cx="300" cy="62" r="14" fill="{GOLD}"/><circle cx="305" cy="62" r="11" fill="{CREAM}"/>
<rect x="130" y="120" width="40" height="180" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M130 120 L150 80 L170 120z" fill="{GOLD}"/><rect x="430" y="120" width="40" height="180" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M430 120 L450 80 L470 120z" fill="{GOLD}"/>
<path d="M270 300 V250 a30 30 0 0 1 60 0 V300z" fill="{TEAL}"/>''', bg='#F0F7F3', ac=GREEN)
S['school'] = _w(_ground() + f'''<rect x="120" y="150" width="360" height="160" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M100 150 L300 70 L500 150z" fill="{GOLD}"/>
<g fill="{TEAL}"><rect x="150" y="190" width="56" height="50" rx="6"/><rect x="236" y="190" width="56" height="50" rx="6"/><rect x="394" y="190" width="56" height="50" rx="6"/></g><rect x="300" y="226" width="70" height="84" rx="10" fill="{BROWN}"/>
<path d="M300 70 V30" stroke="{DARK}" stroke-width="5"/><path d="M300 30 h46 v24 h-46z" fill="{GREEN}"/>''')
S['network'] = _w(f'''<g stroke="{GOLD}" stroke-width="6"><path d="M300 200 L140 110"/><path d="M300 200 L460 110"/><path d="M300 200 L140 300"/><path d="M300 200 L460 300"/><path d="M140 110 L460 110"/><path d="M140 300 L460 300"/><path d="M140 110 L140 300"/><path d="M460 110 L460 300"/></g>
<circle cx="140" cy="110" r="34" fill="{TEAL}"/><circle cx="460" cy="110" r="34" fill="{GREEN}"/><circle cx="140" cy="300" r="34" fill="{RED}"/><circle cx="460" cy="300" r="34" fill="{NAVY}"/>
<circle cx="300" cy="200" r="56" fill="{GOLD}"/><path d="M300 164 l10 24 l26 2 l-20 18 l7 26 l-23 -14 l-23 14 l7 -26 l-20 -18 l26 -2z" fill="#fff"/>''')
S['hands'] = _w(f'''<path d="M300 150 c-70 -80 -170 -10 -90 80 l90 86 l90 -86 c80 -90 -20 -160 -90 -80z" fill="{RED}"/>
<path d="M300 200 v60 M270 230 h60" stroke="#fff" stroke-width="16" stroke-linecap="round"/>
<path d="M60 300 c60 -50 120 -30 170 -4 l-20 32 c-50 -20 -90 -20 -130 14z" fill="{GOLD}"/><path d="M540 300 c-60 -50 -120 -30 -170 -4 l20 32 c50 -20 90 -20 130 14z" fill="{GOLD}"/>''')
S['flower'] = _w(f'''<g transform="translate(300 190)"><g fill="{RED}" opacity=".92"><ellipse cx="0" cy="-70" rx="34" ry="60"/><ellipse cx="0" cy="-70" rx="34" ry="60" transform="rotate(72)"/><ellipse cx="0" cy="-70" rx="34" ry="60" transform="rotate(144)"/><ellipse cx="0" cy="-70" rx="34" ry="60" transform="rotate(216)"/><ellipse cx="0" cy="-70" rx="34" ry="60" transform="rotate(288)"/></g><circle r="34" fill="{GOLD}"/><circle r="16" fill="#FFE9A8"/></g>
<path d="M300 320 C290 350 270 360 240 366 M300 320 C310 350 330 360 360 366" stroke="{GREEN}" stroke-width="8" fill="none" stroke-linecap="round"/>''', bg='#FFF6F0', ac=RED)
S['star'] = _w(f'''<g transform="translate(300 200)"><rect x="-110" y="-110" width="220" height="220" fill="{TEAL}"/><rect x="-110" y="-110" width="220" height="220" fill="{GOLD}" transform="rotate(45)"/>
<rect x="-80" y="-80" width="160" height="160" fill="{CREAM}"/><rect x="-80" y="-80" width="160" height="160" fill="{TEAL}" transform="rotate(45)" opacity=".85"/><circle r="40" fill="{CREAM}"/><circle r="22" fill="{GOLD}"/></g>''')
S['calendar'] = _w(f'''<rect x="150" y="70" width="300" height="270" rx="26" fill="#fff" stroke="{BROWN}" stroke-width="6"/><path d="M150 96 a26 26 0 0 1 26 -26 h248 a26 26 0 0 1 26 26 v50 h-300z" fill="{RED}"/>
<g fill="{BROWN}"><circle cx="210" cy="64" r="10"/><circle cx="390" cy="64" r="10"/></g>
<g fill="{SAND}">{''.join(f'<rect x="{176+c*52}" y="{170+r*46}" width="40" height="32" rx="8"/>' for r in range(3) for c in range(5))}</g><circle cx="332" cy="293" r="22" fill="{GOLD}" opacity=".9"/>
<g transform="translate(520 330)"><circle r="44" fill="#fff" stroke="{NAVY}" stroke-width="6"/><path d="M0 -26 V0 L18 12" stroke="{NAVY}" stroke-width="6" fill="none" stroke-linecap="round"/></g>''')
S['letters'] = _w(f'''<text x="300" y="250" text-anchor="middle" font-size="190" font-weight="700" fill="{BROWN}" font-family="Thmanyah Display,Cairo,Tahoma,sans-serif">عربي</text>
<path d="M80 310 C200 290 400 330 520 300" stroke="{GOLD}" stroke-width="8" fill="none" stroke-linecap="round"/>''')
S['greet'] = _w(f'''<rect x="70" y="90" width="250" height="120" rx="48" fill="{TEAL}"/><path d="M130 208 l-24 50 l62 -48z" fill="{TEAL}"/>
<rect x="290" y="190" width="250" height="120" rx="48" fill="{GOLD}"/><path d="M470 308 l24 50 l-62 -48z" fill="{GOLD}"/>
<text x="195" y="170" text-anchor="middle" font-size="58" font-weight="700" fill="#fff" font-family="Thmanyah Display,Cairo,Tahoma,sans-serif">مرحبا</text><text x="415" y="270" text-anchor="middle" font-size="58" font-weight="700" fill="#fff" font-family="Thmanyah Display,Cairo,Tahoma,sans-serif">حياك الله</text>''')
S['shield'] = _w(f'''<path d="M300 50 L470 100 V210 C470 290 390 340 300 370 C210 340 130 290 130 210 V100z" fill="{NAVY}"/><path d="M300 80 L440 120 V210 C440 272 372 312 300 338 C228 312 160 272 160 210 V120z" fill="#fff"/>
<path d="M300 120 l16 40 l44 4 l-34 28 l10 42 l-36 -22 l-36 22 l10 -42 l-34 -28 l44 -4z" fill="{GOLD}"/>''', bg='#EEF5FB', ac=NAVY)
S['map'] = None  # يستخدم صورة uaemap.webp
S['mapimg'] = '<img src="../../../art/uaemap.webp" alt="" style="width:100%;height:100%;object-fit:contain;display:block">'
_IMG = {'mapimg'}

def svg(name):
    return S.get(name) or S['star']

# اختيار الرسم لكل درس (الحلقة الثانية 5–8 والثالثة 9–12)
C2 = {'T1-L01': 'star', 'T1-L02': 'hands', 'T1-L03': 'network', 'T1-L04': 'flag', 'T1-L05': 'majlis', 'T1-L06': 'majlis', 'T1-L07': 'greet',
      'T2-L01': 'dallah', 'T2-L02': 'dallah', 'T2-L03': 'dallah', 'T2-L04': 'home', 'T2-L05': 'home', 'T2-L06': 'home', 'T2-L07': 'home',
      'T3-L01': 'hands', 'T3-L02': 'mosque', 'T3-L03': 'school', 'T3-L04': 'hands', 'T3-L05': 'flag', 'T3-L06': 'palmfort', 'T3-L07': 'palmfort'}
C3 = {'T1-L01': 'flag', 'T1-L02': 'letters', 'T1-L03': 'school', 'T1-L04': 'mapimg', 'T1-L05': 'calendar', 'T1-L06': 'letters', 'T1-L07': 'mosque',
      'T1-L08': 'palmfort', 'T1-L09': 'network', 'T1-L10': 'dallah', 'T1-L11': 'hands', 'T1-L12': 'network', 'T1-L13': 'hands', 'T1-L14': 'shield',
      'T1-L15': 'flag', 'T1-L16': 'camel', 'T1-L17': 'book'}
for i in range(18, 26): C3['T1-L%d' % i] = 'chat'
C3['T1-L23'] = 'school'; C3['T1-L22'] = 'flag'
C3.update({'T2-L01': 'dallah', 'T2-L02': 'dallah', 'T2-L03': 'majlis', 'T2-L04': 'majlis', 'T2-L05': 'majlis', 'T2-L06': 'majlis', 'T2-L07': 'greet',
           'T2-L08': 'home', 'T2-L09': 'home', 'T2-L10': 'flower', 'T2-L11': 'flower', 'T2-L12': 'flower', 'T2-L13': 'flower', 'T2-L14': 'palmfort',
           'T2-L15': 'home', 'T2-L16': 'dallah', 'T2-L17': 'hands', 'T2-L18': 'flower', 'T2-L19': 'home',
           'T3-L01': 'clothes', 'T3-L02': 'clothes', 'T3-L03': 'clothes', 'T3-L04': 'road', 'T3-L05': 'road', 'T3-L06': 'falcon', 'T3-L07': 'camel',
           'T3-L08': 'horse', 'T3-L09': 'dhow', 'T3-L10': 'book', 'T3-L11': 'book'})
def scene(stem, y):
    nm = (C2 if y <= 8 else C3).get(stem, 'star')
    return S[nm] if nm in _IMG else svg(nm)
