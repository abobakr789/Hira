# -*- coding: utf-8 -*-
"""Raise the top two worksheet levels and the sources card, from Grade 5 up.

Gold gets a source-analysis task; Diamond gets an evaluation task judged
against a three-step rubric, so the written work matches the raised group work.
"""
import re

SELF = "<div class='self'>"
GOLD, DIAMOND = '#A87A0C', '#5546A3'


def _rubric():
    rows = ['ذَكَرْتُ رَأْيي بِوُضوحٍ.',
            'دَعَمْتُ رَأْيي بِدَليلٍ مِنَ النَّصِّ.',
            'رَبَطْتُ إِجابَتي بِواقِعِ حَياتي.']
    cells = ''.join(
        f"<tr><td style='border:1px solid #CFC7E6;padding:5px 8px;font-size:10.5pt'>{r}</td>"
        f"<td style='border:1px solid #CFC7E6;width:22mm'></td>"
        f"<td style='border:1px solid #CFC7E6;width:22mm'></td>"
        f"<td style='border:1px solid #CFC7E6;width:22mm'></td></tr>" for r in rows)
    return (
        "<table style='width:100%;border-collapse:collapse;margin-top:6px'>"
        "<tr style='background:#F4F1FB'>"
        "<th style='border:1px solid #CFC7E6;padding:5px 8px;font-size:10.5pt;text-align:start'>"
        "سُلَّمُ تَقْديري</th>"
        "<th style='border:1px solid #CFC7E6;font-size:10pt'>مُتَوَسِّطٌ</th>"
        "<th style='border:1px solid #CFC7E6;font-size:10pt'>جَيِّدٌ</th>"
        "<th style='border:1px solid #CFC7E6;font-size:10pt'>مُتَمَيِّزٌ</th></tr>"
        f"{cells}</table>")


def _gold(source, topic, q3):
    return (
        "<div class='q'>"
        f"<div class='qh'><span class='n' style='background:{GOLD}'>3</span>"
        "<span>تَحْليلُ مَصْدَرٍ:</span></div>"
        f"<div class='k' style='background:#FFF8EC;border-color:#E6C98A'>🔎 {source}</div>"
        "<div style='font-size:11pt;margin:6px 0 2px'>"
        "<b>أ)</b> أَسْتَخْرِجُ الْفِكْرَةَ الرَّئيسَةَ مِنَ الْمَصْدَرِ.</div>"
        "<div class='ln'></div>"
        f"<div style='font-size:11pt;margin:6px 0 2px'><b>ب)</b> "
        f"ماذا يَكْشِفُ لي هٰذَا الْمَصْدَرُ عَنْ {topic}؟</div>"
        "<div class='ln'></div>"
        f"<div style='font-size:11pt;margin:6px 0 2px'><b>ج)</b> {q3}</div>"
        "<div class='ln'></div><div class='ln'></div></div>")


def _diamond(task):
    return (
        "<div class='q'>"
        f"<div class='qh'><span class='n' style='background:{DIAMOND}'>4</span>"
        "<span>مُهِمَّةُ تَقْويمٍ:</span></div>"
        f"<div class='k' style='background:#F4F1FB;border-color:#C9BEEA'>⚖️ {task}</div>"
        "<div class='ln'></div><div class='ln'></div><div class='ln'></div>"
        f"{_rubric()}</div>")


def _inside(chunk, block):
    j = chunk.rstrip().rfind('</div>')
    if j < 0:
        raise ValueError('no .fit closing tag')
    return chunk[:j] + block + chunk[j:]


def raise_worksheet(html, source, topic, q3, task):
    """Append the two new tasks to the gold (3rd) and diamond (4th) pages."""
    parts = html.split(SELF)
    if len(parts) != 5:
        raise ValueError(f'expected 4 pages, found {len(parts) - 1}')
    # the block must go INSIDE .fit, which the page's auto-zoom scales,
    # so insert before the </div> that closes it
    parts[2] = _inside(parts[2], _gold(source, topic, q3))
    parts[3] = _inside(parts[3], _diamond(task))
    return SELF.join(parts)


SRC_ANCHOR = re.compile(r"(<div class='row'|<div class='foot'|</body>)", re.S)


def raise_sources(html, source, topic):
    """Add a short source-analysis prompt to the sources & concepts card."""
    block = (
        "<div style='margin-top:8px;border:2px dashed #C9822B;border-radius:10px;"
        "padding:8px 12px;background:#FFF8EC'>"
        "<div style='font-size:11.5pt;color:#9A5A26;margin-bottom:4px'>"
        "<b>🔎 أُحَلِّلُ الْمَصْدَرَ</b></div>"
        f"<div style='font-size:11pt;line-height:1.6'>{source}</div>"
        f"<div style='font-size:11pt;margin-top:6px'><b>السُّؤالُ:</b> "
        f"ماذا يَكْشِفُ لي هٰذَا الْمَصْدَرُ عَنْ {topic}؟</div>"
        "<div style='border-bottom:1px dotted #999;height:14px;margin-top:8px'></div>"
        "<div style='border-bottom:1px dotted #999;height:14px'></div></div>")
    i = html.rfind('</body>')
    j = html.rfind('</div>', 0, i)
    if j < 0:
        raise ValueError('sources card: no insertion point')
    return html[:j] + block + html[j:]
