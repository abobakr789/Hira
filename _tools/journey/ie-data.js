/* ================= بيانات الدرس (التربية الإسلامية: الكتاب المدرسي + عرض المعلم) ================= */
const D=__DATA__;
const LESSON={code:D.code,title:D.title};
const IMG="journey/";
const SALEM="../../../art/salem/";
const AUDIO={};
const CRIT=[
 {k:"bronze",got:"الْوِسامِ الْبُرونْزِيِّ",name:"بُرونْزِيٌّ",c:"#B06A34",t:"أَسْتَطيعُ أَنْ "+D.crit[0]},
 {k:"silver",got:"الْوِسامِ الْفِضِّيِّ",name:"فِضِّيٌّ",c:"#7A8797",t:"أَسْتَطيعُ أَنْ "+D.crit[1]},
 {k:"gold",got:"الْوِسامِ الذَّهَبِيِّ",name:"ذَهَبِيٌّ",c:"#C99A1E",t:"أَسْتَطيعُ أَنْ "+D.crit[2]},
 {k:"challenge",got:"وِسامِ التَّحَدّي",name:"تَحَدٍّ",c:"#7B4FC0",t:"أَسْتَطيعُ أَنْ "+D.crit[3]}
];
const pic=(name)=>name?`<img src="${IMG}${name}.webp" alt="">`:"";
const emo=(e,sz)=>`<span style="font-size:${sz||90}px;line-height:1">${e||"✨"}</span>`;
const WORDS={};D.words.forEach(w=>{WORDS[w[0]]={m:w[1],e:w[2],pic:`<div style="display:grid;place-items:center;width:100%;height:100%">${emo(w[2],110)}</div>`}});
const HL=D.hl||{},READHEAD=D.readhead||"",PQ=D.pq||null,SCENE_IMG=D.sceneImg||{};
const STATIONS=D.stations;
