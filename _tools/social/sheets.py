# Young-learner worksheets (A4 PDFs): levelled sheets, POD sheet, concept card, answer key.
import os, base64
CSS = """@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:'Noto Naskh Arabic',serif;direction:rtl;color:#1E3A3F;margin:0;font-size:17px}
.hd{display:flex;justify-content:space-between;align-items:center;background:#0F6E72;color:#fff;border-radius:14px;padding:10px 16px}
.hd .t{font-size:20px;font-weight:800}.hd .s{font-size:13px;opacity:.9}.lv{background:#fff;color:#1E3A3F;border-radius:20px;padding:4px 14px;font-weight:800;font-size:15px}
.meta{display:flex;gap:30px;font-size:14px;color:#555;margin:8px 4px}.goal{background:#FCE9DA;border-radius:12px;padding:8px 14px;margin:8px 0;font-weight:700}
.q{margin:14px 0 6px;font-weight:800;font-size:19px}.q .n{display:inline-block;width:28px;height:28px;border-radius:50%;background:#A35E24;color:#fff;text-align:center;line-height:28px;margin-left:8px;font-size:15px}
.row{display:flex;gap:14px;justify-content:space-around;align-items:center;margin:8px 0}.card{border:2px solid #0F6E72;border-radius:14px;padding:8px 18px;text-align:center;font-size:24px;font-weight:700;min-width:150px}
.emo{font-size:58px;text-align:center;border:2px dashed #bbb;border-radius:14px;width:120px;height:100px;line-height:100px}
.pic{border:2px solid #ddd;border-radius:14px;padding:6px;text-align:center}.pic img{height:150px}.pic b{display:block;font-size:20px}
.ln{border-bottom:2px dotted #999;height:40px}.box{border:2px dashed #999;border-radius:14px;height:230px}
table{width:100%;border-collapse:collapse;font-size:18px}td,th{border:2px solid #0F6E72;padding:10px;text-align:center;height:46px}th{background:#E2F0EF}
.self{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-around;border-top:2px solid #eee;padding-top:8px;font-size:14px}
.trace{font-size:64px;color:#fff;-webkit-text-stroke:2px #9aa;letter-spacing:6px;text-align:center}.pb{page-break-after:always}.ok{color:#0F6E72;font-weight:700}"""
SELF = "<div class='self'><span>كَيْفَ أَشْعُرُ؟</span><span>🟢 أَسْتَطيعُ وَحْدي</span><span>🟡 أَحْتاجُ مُساعَدَةً</span><span>🔴 لَمْ أَفْهَمْ بَعْدُ</span></div>"
def img(path):
    return 'data:image/webp;base64,' + base64.b64encode(open(path, 'rb').read()).decode()
def head(S, lv, title):
    return (f"<div class='hd'><div><div class='t'>{title}</div><div class='s'>{S['subj']} · {S['grade']} · {S['title']} · {S['pages']}</div></div><div class='lv'>{lv}</div></div>"
            f"<div class='meta'><span>الاسْمُ: ....................................</span><span>التّاريخُ: ..............</span></div><div class='goal'>🎯 {S['goal']}</div>")
def Q(n, t): return f"<div class='q'><span class='n'>{n}</span>{t}</div>"
def pdf(page, path, body):
    open('/tmp/_ws.html', 'w').write(f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>")
    page.goto('file:///tmp/_ws.html'); page.wait_for_timeout(150); page.pdf(path=path, format='A4', print_background=True)
