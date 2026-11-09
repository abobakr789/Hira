import re
L=open('/tmp/fw3.txt').read().split('\n')
def clean(line):
    line=re.sub('[\u202a-\u202e\u200e\u200f\u0640]','',line)
    ws=line.split()
    ws=ws[::-1]
    out=[]
    for w in ws:
        w=re.sub('^(و?[بفكل]?)ام([لل])', r'\1ال\2', w) if False else w
        w=re.sub(r'^(و|ب|ف|ك|ل)?امل', lambda m:(m.group(1) or '')+'الم', w)
        w=re.sub(r'^(و|ب|ف|ك|ل)?اال', lambda m:(m.group(1) or '')+'الأ', w)
        w=re.sub(r'^(و|ب|ف|ك|ل)?اإل', lambda m:(m.group(1) or '')+'الإ', w)
        w=w.replace('ال إ','الإ')
        out.append(w)
    s=' '.join(out)
    s=s.replace('األ','الأ').replace('اإل','الإ').replace('اإ','إ').replace('ىل','لى')
    return s
res=[]; i=0
while i<len(L):
    m=re.fullmatch(r'\s*(\d\.\d\.\d\.\d+\.G3)\s*',L[i])
    if m:
        code=m.group(1); j=i+1; parts=[]
        while j<len(L) and not re.fullmatch(r'\s*\d\s*',L[j]) and not re.fullmatch(r'\s*\d\.\d\.\d\.\d+\.G3\s*',L[j]):
            t=clean(L[j]).strip()
            if t and not re.fullmatch(r'[\u064B-\u0652ًٌٍَُِّْ\s]+',t): parts.append(t)
            j+=1
        lvl=L[j].strip() if j<len(L) and re.fullmatch(r'\s*\d\s*',L[j]) else ''
        res.append((code,' '.join(parts),lvl)); i=j
    else: i+=1
for c,t,l in res: print(c,'|',l,'|',re.sub('[\u064B-\u0652]','',t)[:150])
print(len(res))
