# Crop the round pictures of «قاموسي المصوّر» (3 rows x 3 columns, right-to-left; bottom-right is the sight-word box)
import subprocess, glob, sys
from PIL import Image
CX=[0.765,0.50,0.22]; CY=[0.295,0.54,0.775]; R=0.088
def crop(F, idx, prefix):
    f=f'/tmp/nd_{abs(hash(F))%9999}_{idx}'
    if not glob.glob(f+'-*.png'): subprocess.run(['pdftoppm','-r','80','-f',str(idx),'-l',str(idx),'-png',F,f],check=True)
    im=Image.open(sorted(glob.glob(f+'-*.png'))[0]).convert('RGB'); w,h=im.size; k=0
    for r in range(3):
        for c in range(3):
            if r==2 and c==0: continue
            k+=1; x,y,rr=CX[c]*w,CY[r]*h,R*w
            p=im.crop((int(x-rr),int(y-rr),int(x+rr),int(y+rr))); p.thumbnail((300,300)); p.save(f"{prefix}{k}.webp",quality=88)
if __name__=="__main__": crop(sys.argv[1],int(sys.argv[2]),sys.argv[3])
