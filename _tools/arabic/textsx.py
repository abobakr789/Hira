import nnbase
def _qa(x):
    x=x.strip()
    if "؟" in x: a,b=x.split("؟",1); return (a.strip()+"؟",b.strip())
    a,b=x.split(". ",1); return (a.strip()+".",b.strip())
def X(code,title,body,tf,qs):
    nnbase.TEXTS[code]=dict(kind="نص",title=title,body=[b.strip() for b in body.split("|")],
      tf=[(t.strip()[:-1].strip(),t.strip().endswith("+")) for t in tf.split("|")],
      qs=[_qa(x) for x in qs.split("|")])
