# Hiraa qualification decks (IGCSE / GCSE / A Level): curriculum-specific, modelling-first.
# Slides use the "free" element format of resources/slides/<code>.json (1280x720 px; rv = click-reveal order).
import json, os
TE, DK, SUN, SOFT, CARD = "0F6E72", "1E3A3F", "F2A93B", "E2F0EF", "FFFDF8"
BLUE, GREEN, ORANGE, PURPLE, RED = "2563EB", "16A34A", "EA580C", "7C3AED", "C9553A"
BGS = ["EAF5F4", "FDF1DC", "F3E9FB", "FBF6EC", "E9F3E6", "FCE8E4"]
L, W = 38, 1203  # content box

def T(text, x, y, w, h, size=24, color=DK, bold=False, align="right", fill=None, rad=False, va="middle", rv=None, **kw):
    e = {"k": "text", "x": x, "y": y, "w": w, "h": h, "text": text, "size": size, "color": color, "bold": bold, "align": align, "fill": fill, "rad": rad, "va": va}
    if rv: e["rv"] = rv
    e.update(kw); return e
def R(x, y, w, h, fill=CARD, line=None, rv=None, rad=True, lw=1.5, **kw):
    e = {"k": "shape", "x": x, "y": y, "w": w, "h": h, "fill": fill, "line": line, "rad": rad, "oval": False, "lw": lw}
    if rv: e["rv"] = rv
    e.update(kw); return e
def EM(emo, x, y, s, rv=None):
    e = {"k": "img", "x": x, "y": y, "w": s, "h": s, "emo": emo}
    if rv: e["rv"] = rv
    return e
def PIC(src, x, y, w, h, rv=None, **kw):
    e = {"k": "pic", "x": x, "y": y, "w": w, "h": h, "src": src, "rad": True, "shadow": "soft"}
    if rv: e["rv"] = rv
    e.update(kw); return e

class Deck:
    def __init__(self, code, foot):
        self.code, self.foot, self.slides = code, foot, []
    def new(self, stage, title, mins=None, notes="", bg=None, foot=True):
        bg = bg or BGS[len(self.slides) % len(BGS)]
        els = [T(stage, 390, 13, 500, 46, 22, "FFFFFF", True, "center", TE, True)]
        if mins: els.append(T(f"⏱ {mins} {'دقائق' if 3 <= mins <= 10 else 'دقيقة'}", L, 74, 173, 54, 22, DK, True, "center", SUN, True))
        els.append(T(title, 230, 67, 1011, 70, 38 if len(title) <= 48 else (32 if len(title) <= 58 else 27), DK, True, "right"))
        if foot: els.append(T("🎯 " + self.foot, 180, 664, 1061, 44, 19, TE, True, "center", SOFT, True))
        s = {"bg": bg, "els": els, "n": notes}; self.slides.append(s); return s
    def save(self, path):
        json.dump({"code": self.code, "en": False, "slides": self.slides}, open(path, "w"), ensure_ascii=False)

def card(s, x, y, w, h, head, body, col=TE, size=22, rv=None, hsize=24):
    hh = max(44, int(hsize * 1.75) + 2)
    s["els"] += [R(x, y, w, h, CARD, col, rv=rv, lw=2),
                 T(head, x + 12, y + 6, w - 24, hh, hsize, col, True, "right", rv=rv),
                 T(body, x + 12, y + hh + 10, w - 24, h - hh - 18, size, DK, False, "right", va="top", rv=rv)]
def chip(s, x, y, w, h, head, sub, col, rv=None):
    s["els"] += [R(x, y, w, h, col, None, rv=rv), T(head, x, y + 4, w, h * 0.45, 26, "FFFFFF", True, "center", rv=rv),
                 T(sub, x, y + h * 0.48, w, h * 0.48, 20, "FFFFFF", False, "center", rv=rv)]
def answer(s, text, y, h=64, x=L, w=W, rv=2, size=22):
    s["els"].append(T("✅ " + text, x, y, w, h, size, "FFFFFF", True, "right", GREEN, True, rv=rv))
def cols(n, gap=18, x0=L, w=W):
    cw = (w - gap * (n - 1)) / n
    return [(round(x0 + w - cw - i * (cw + gap)), round(cw)) for i in range(n)]  # right-to-left

def check(slides):
    bad = []
    for si, s in enumerate(slides):
        tx = [e for e in s["els"] if e["k"] == "text"]
        def ov(a, b): return min(a["x"] + a["w"], b["x"] + b["w"]) - max(a["x"], b["x"]) > 2 and min(a["y"] + a["h"], b["y"] + b["h"]) - max(a["y"], b["y"]) > 2
        for i in range(len(tx)):
            for j in range(i + 1, len(tx)):
                if ov(tx[i], tx[j]): bad.append((si, tx[i]["text"][:25], tx[j]["text"][:25]))
            if tx[i]["y"] + tx[i]["h"] > 712 or tx[i]["x"] < 0 or tx[i]["x"] + tx[i]["w"] > 1280: bad.append((si, "outside", tx[i]["text"][:25]))
    return bad
