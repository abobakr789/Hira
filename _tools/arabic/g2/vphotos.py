# Crop the photo of each vocabulary card from the MoE book pages (auto-detected inside each card cell)
import subprocess, glob, sys
from PIL import Image
import numpy as np
def page(F, idx, dpi=70):
    f=f'/tmp/vp_{abs(hash(F))%9999}_{idx}'
    if not glob.glob(f+'-*.png'): subprocess.run(['pdftoppm','-r',str(dpi),'-f',str(idx),'-l',str(idx),'-png',F,f],check=True)
    return Image.open(sorted(glob.glob(f+'-*.png'))[0]).convert('RGB')
def photo_in(im, box):
    x0,y0,x1,y1=box; c=np.asarray(im.crop(box)).astype(int)
    mx=c.max(2); mn=c.min(2); sat=mx-mn
    mask=(sat>30)|(mx<200)
    dens=mask.mean(1)
    rows=np.where(dens>0.35)[0]
    if len(rows)<10: return None
    # merge runs allowing small gaps (light areas inside photos)
    runs=[]; s=rows[0]; p=rows[0]
    for r in list(rows[1:])+[10**9]:
        if r>p+18: runs.append((s,p)); s=r
        p=r
    r0,r1=max(runs,key=lambda t:t[1]-t[0])
    cols=np.where(mask[r0:r1+1].mean(0)>0.3)[0]
    if len(cols)<10 or r1-r0<20: return None
    return im.crop((x0+cols[0]+4,y0+r0+4,x0+cols[-1]-4,y0+r1-4))
def safe(im, box):
    x0,y0,x1,y1=box; r=photo_in(im,box); H=y1-y0
    if r is None or r.size[1]<0.45*H:
        W=x1-x0; return im.crop((x0+int(W*.05),y0+int(H*.12),x1-int(W*.05),y1-int(H*.03)))
    return r
def cards(F, idxA, idxB, nA=2, rowsB=3, botB=0.93):
    out=[]
    A=page(F,idxA); w,h=A.size
    # page A: one column of nA cards in the lower ~70%
    a=np.asarray(A).astype(int); ink=((a.max(2)-a.min(2))>38)|(a.max(2)<170)
    colsum=ink[int(h*.3):].mean(0); xs=np.where(colsum>0.15)[0]
    # choose the widest dense band (the card column)
    x0,x1=int(w*0.1),int(w*0.75)
    if len(xs): 
        segs=[];s=xs[0];p=xs[0]
        for x in list(xs[1:])+[10**9]:
            if x!=p+1: segs.append((s,p)); s=x
            p=x
        s,p=max(segs,key=lambda t:t[1]-t[0]); x0,x1=s,p
    top=int(h*0.28); step=(int(h*0.95)-top)//nA
    for i in range(nA): out.append(safe(A,(x0,top+i*step+int(step*.25),x1,top+(i+1)*step)))
    B=page(F,idxB); w,h=B.size
    b=np.asarray(B).astype(int); ink=((b.max(2)-b.min(2))>38)|(b.max(2)<170)
    xs=np.where(ink[int(h*.1):int(h*.9)].mean(0)>0.12)[0]; L,R=xs[0],xs[-1]; mid=(L+R)//2
    top=int(h*0.07); bot=int(h*botB); step=(bot-top)//rowsB
    for r in range(rowsB):
        for (cx0,cx1) in ((mid,R),(L,mid)):   # right card first (Arabic order)
            out.append(safe(B,(cx0,top+r*step+int(step*.3),cx1,top+(r+1)*step)))
    return out
if __name__=="__main__":
    F,a,b,prefix=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
    rb=int(sys.argv[5]) if len(sys.argv)>5 else 3; bb=float(sys.argv[6]) if len(sys.argv)>6 else 0.93
    for i,im in enumerate(cards(F,a,b,rowsB=rb,botB=bb),1):
        if im is None: print('miss',i); continue
        im.thumbnail((520,520)); im.save(f"{prefix}{i}.webp",quality=86); print(i,im.size)
