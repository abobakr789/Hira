import re,json,glob,sys
B='/home/claude/Hira/resources/'
D=re.compile('[ً-ْٰۖ-ۭـ ۚ]')
def n(s): s=s.replace('…',' '); return re.sub(r'\s+',' ',D.sub('',s.replace('آ','ا').replace('أ','ا').replace('إ','ا').replace('ٱ','ا').replace('ى','ي'))).strip(' …')
M={
'قل هل يستوي الذين يعلمون والذين لا يعلمون':'قُلۡ هَلۡ يَسۡتَوِي ٱلَّذِينَ يَعۡلَمُونَ وَٱلَّذِينَ لَا يَعۡلَمُونَۗ',
'ن والقلم وما يسطرون':'نٓۚ وَٱلۡقَلَمِ وَمَا يَسۡطُرُونَ',
'ن والقلم':'نٓۚ وَٱلۡقَلَمِ',
'وانك لعلي خلق عظيم':'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٖ',
'اياك نستعين':'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ',
'ويوم تقوم الساعة ما لبثوا غير ساعة':'وَيَوۡمَ تَقُومُ ٱلسَّاعَةُ يُقۡسِمُ ٱلۡمُجۡرِمُونَ مَا لَبِثُواْ غَيۡرَ سَاعَةٖۚ',
'الله ولي الذين امنوا يخرجهم من الظلمات الي النور':'ٱللَّهُ وَلِيُّ ٱلَّذِينَ ءَامَنُواْ يُخۡرِجُهُم مِّنَ ٱلظُّلُمَٰتِ إِلَى ٱلنُّورِۖ',
'يخرجهم من الظلمات الي النور':'يُخۡرِجُهُم مِّنَ ٱلظُّلُمَٰتِ إِلَى ٱلنُّورِۖ',
'تنزل الملائكة والروح':'تَنَزَّلُ ٱلۡمَلَٰٓئِكَةُ وَٱلرُّوحُ',
'ولكم في القصاص حياة':'وَلَكُمۡ فِي ٱلۡقِصَاصِ حَيَوٰةٞ',
'ولا تحسبن الذين قتلوا في سبيل الله امواتا بل احياء عند ربهم يرزقون':'وَلَا تَحۡسَبَنَّ ٱلَّذِينَ قُتِلُواْ فِي سَبِيلِ ٱللَّهِ أَمۡوَٰتَۢاۚ بَلۡ أَحۡيَآءٌ عِندَ رَبِّهِمۡ يُرۡزَقُونَ',
'ان اكرمكم عند الله اتقاكم':'إِنَّ أَكۡرَمَكُمۡ عِندَ ٱللَّهِ أَتۡقَىٰكُمۡۚ',
'يا ايها الذين امنوا':'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ',
}
M={n(k):v for k,v in M.items()}
CSS='@font-face{font-family:"Amiri Quran";src:url("../../../art/fonts/amiri-quran.woff2") format("woff2")}.qf{font-family:"Amiri Quran",serif!important;font-weight:400;font-size:1.08em}'
miss=set(); changed=[]
def rep_html(m):
    k=n(m.group(1)); 
    if k in M: return '<span class="qf">﴿'+M[k]+'﴾</span>'
    miss.add(m.group(1)); return m.group(0)
def rep_txt(m):
    k=n(m.group(1));return '﴿'+M[k]+'﴾' if k in M else m.group(0)
for hp in glob.glob(B+'ar/AR-Y*/teacher-deck.html'):
    h=open(hp).read()
    if '﴿' not in h: continue
    code=hp.split('/')[-2]
    h2=re.sub(r'(?<!<span class="qf">)﴿([^﴾<]*)﴾',rep_html,h)
    if 'Amiri Quran' not in h2: h2=h2.replace('<style>','<style>'+CSS,1)
    if h2!=h: open(hp,'w').write(h2); changed.append(code)
    jp=B+'slides/'+code+'.json'; j=json.load(open(jp))
    for s in j['slides']:
        for e in s['els']:
            if e.get('text'): e['text']=re.sub(r'﴿([^﴾]*)﴾',rep_txt,e['text'])
        if s.get('n'): s['n']=re.sub(r'﴿([^﴾]*)﴾',rep_txt,s['n'])
    json.dump(j,open(jp,'w'),ensure_ascii=False)
print('changed',changed); print('miss',miss)
json.dump({'map':{k:v for k,v in M.items()}},open('/tmp/w/qs/map.json','w'),ensure_ascii=False)
