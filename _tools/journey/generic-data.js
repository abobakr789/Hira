/* ================= بيانات الدرس (تُولَّد من بيانات العرض المعتمدة) ================= */
const D=__DATA__;
const LESSON={code:D.code,title:D.title};
const IMG="../../slides/img/"+D.code+"-";
const SALEM="../../../art/salem/";
/* تسجيلات المعلم (تُضاف لاحقًا بصوت الأستاذ): مفتاح الجملة ← ملف صوتي. الأزرار لا تظهر إلا عند وجود الملف */
const AUDIO=D.audio||{};
const CRIT=[
 {k:"bronze",got:"الْوِسامِ الْبُرونْزِيِّ",name:"بُرونْزِيٌّ",c:"#B06A34",t:"أَسْتَطيعُ أَنْ "+D.crit[0]},
 {k:"silver",got:"الْوِسامِ الْفِضِّيِّ",name:"فِضِّيٌّ",c:"#7A8797",t:"أَسْتَطيعُ أَنْ "+D.crit[1]},
 {k:"gold",got:"الْوِسامِ الذَّهَبِيِّ",name:"ذَهَبِيٌّ",c:"#C99A1E",t:"أَسْتَطيعُ أَنْ "+D.crit[2]},
 {k:"challenge",got:"وِسامِ التَّحَدّي",name:"تَحَدٍّ",c:"#7B4FC0",t:"أَسْتَطيعُ أَنْ "+D.crit[3]}
];
const pic=(name,cls)=>name?`<img src="${IMG}${name}.webp" alt=""${cls?` class="${cls}"`:""}>`:"";
const emo=(e,sz)=>`<span style="font-size:${sz||90}px;line-height:1">${e||"✨"}</span>`;
const WORDS={};D.words.forEach(w=>{WORDS[w[0]]={m:w[1],e:w[2],pic:`<div style="display:grid;place-items:center;width:100%;height:100%">${emo(w[2],110)}</div>`}});
const HL=D.hl||{},READHEAD=D.readhead||"",PQ=null,SCENE_IMG=D.hookImg?{0:D.hookImg}:{};
const STATIONS=[
 {id:"ready",t:"أَتَهَيَّأُ",s:"قَبْلَ الرِّحْلَةِ",bg:"#F2F7FC",x:50,y:7},
 {id:"read",t:"أَقْرَأُ وَأَكْتَشِفُ",s:"نَصُّ الدَّرْسِ",bg:"#FFF9EE",x:22,y:17},
 {id:"words",t:"كَلِماتي",s:"لُعْبَةُ الذّاكِرَةِ",bg:"#F3F0FB",x:72,y:27},
 {id:"match",t:D.match.title,s:"أَصِلُ",bg:"#FBF1EA",x:30,y:38,crit:0},
 {id:"map",t:D.map.title,s:"أَفْهَمُ النَّصَّ",bg:"#EEF5F1",x:74,y:49,crit:1},
 {id:"order",t:D.order.title,s:D.order.type==="words"?"أُكَوِّنُ جُمَلًا":"أُرَتِّبُ وَأَحْكي",bg:"#FFF8EA",x:26,y:60,crit:2},
 {id:"message",t:"رِسالَتي",s:"الدَّرْسُ وَحَياتي",bg:"#F5F0FC",x:70,y:71,crit:3},
 {id:"family",t:"مَعَ أُسْرَتي",s:"مُهِمَّةُ الْبَيْتِ",bg:"#EFF7F1",x:28,y:82},
 {id:"check",t:"أَتَحَقَّقُ",s:"الْقِنْديلُ الْأَخيرُ",bg:"#FFF6E3",x:62,y:93},
];
