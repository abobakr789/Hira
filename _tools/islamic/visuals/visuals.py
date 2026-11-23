# Islamic Education: additive lesson-specific vector visuals.
# The current teacher-deck.html is the source, not an Arabic converter rebuild.
# Authoring preserves the complete existing deck and inserts a separate slide.
import re,html,math
F='font-family="Thmanyah Display,Cairo,Tahoma,sans-serif" font-weight="700"'
INK='#1F2A3C';GREEN='#3F6E5B';GOLD='#D7A33B';BLUE='#306D9D'
def txt(x,y,t,size=38,c=INK):return f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}" fill="{c}" {F}>{html.escape(t)}</text>'
def card(x,y,w,h,c=GREEN):return f'<rect x="{x}" y="{y+8}" width="{w}" height="{h}" rx="30" fill="{c}" opacity=".08"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="30" fill="white" stroke="{c}" stroke-width="3"/>'
def line(x1,y1,x2,y2,c=GREEN):return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{c}" stroke-width="5" fill="none" stroke-linecap="round"/>'
def sun(x,y,r=48):
 s=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#E8B640"/>'
 for i in range(12):
  a=i*math.pi/6;s+=line(x+(r+12)*math.cos(a),y+(r+12)*math.sin(a),x+(r+28)*math.cos(a),y+(r+28)*math.sin(a),'#D7A33B')
 return s
def moon(x,y):return f'<path d="M{x+25} {y-65}A70 70 0 1 0 {x+55} {y+50}A66 66 0 0 1 {x+25} {y-65}" fill="#577398"/>'
def bowl(x,y,c,food=False):
 s=f'<path d="M{x-130} {y}h260l-33 90H{x-95}z" fill="{c}"/><ellipse cx="{x}" cy="{y}" rx="130" ry="25" fill="'+('#E9CCA7' if food else '#A5DBF1')+'"/>'
 if food:
  for dx,dy in [(-70,-4),(-25,-12),(18,4),(65,-8)]:s+=f'<ellipse cx="{x+dx}" cy="{y+dy}" rx="14" ry="9" fill="#8A5D32"/>'
 return s
def cat(x,y):
 return f'<g transform="translate({x} {y})"><path d="M40 125C-30 95-30 190 35 185" fill="none" stroke="#C58B57" stroke-width="26" stroke-linecap="round"/><ellipse cx="100" cy="160" rx="80" ry="63" fill="#C58B57"/><path d="M88 110L85 15 130 45 173 12 180 115Z" fill="#D89B64"/><ellipse cx="134" cy="90" rx="53" ry="43" fill="#D89B64"/><circle cx="113" cy="83" r="5" fill="{INK}"/><circle cx="153" cy="83" r="5" fill="{INK}"/><path d="M128 100h14l-7 8z" fill="#724B3B"/><path d="M52 190V238M132 190V238" stroke="#C58B57" stroke-width="23" stroke-linecap="round"/></g>'
def animal(en):
 s=card(160,90,1280,560,'#6B54C6')+cat(715,145)+bowl(445,435,'#4686AD')+bowl(1195,435,'#AF875F',True)
 s+=txt(445,590,'Clean water' if en else 'ماءٌ نَظيفٌ',44,'#306D9D')+txt(1195,590,'Suitable food' if en else 'طَعامٌ مُناسِبٌ',44,'#986638')
 return s,'Feeding and watering animals' if en else 'أُطْعِمُ الحَيَوانَ وَأَسْقِيهِ'
def prayers(en):
 names=['Fajr','Dhuhr','Asr','Maghrib','Isha'] if en else ['الفجر','الظهر','العصر','المغرب','العشاء'];nums=[2,4,4,3,4];s=txt(800,60,"The five obligatory prayers" if en else 'الصَّلَواتُ الخَمْسُ المَفْروضَةُ',46)
 for i,(n,v) in enumerate(zip(names,nums)):
  x=30+(i if en else 4-i)*318;s+=card(x,130,285,440,BLUE)+txt(x+142,208,n,42,BLUE)
  for j in range(v):s+=f'<circle cx="{x+92+(j%2)*100}" cy="{310+(j//2)*100}" r="28" fill="{GOLD}"/>'
  s+=txt(x+142,530,str(v)+" rak'ahs" if en else ('ركعتان' if v==2 else str(v)+' ركعات'),34)
 s+=txt(800,660,"Each dot represents one rak'ah, not a time scale" if en else 'كُلُّ دائِرَةٍ تُمَثِّلُ رَكْعَةً، وَلَيْسَتْ مِقياسًا لِلْوَقْتِ',30)
 return s,'Counting the rak\'ahs' if en else 'عَدَدُ الرَّكْعاتِ'
def trade(en):
 s=card(90,100,660,490,BLUE)+card(850,100,660,490,'#A26E32')
 s+=txt(420,180,'Winter journey' if en else 'رِحْلَةُ الشِّتاءِ',44,BLUE)+txt(1180,180,'Summer journey' if en else 'رِحْلَةُ الصَّيْفِ',44,'#A26E32')
 s+=line(420,235,420,380,BLUE)+line(1180,235,1180,380,'#A26E32')
 s+='<path d="M405 360l15 20 15-20M1165 360l15 20 15-20" fill="none" stroke="#738477" stroke-width="5"/>'
 s+=txt(420,475,'Yemen' if en else 'اليَمَن',54,BLUE)+txt(1180,475,'Ash-Sham' if en else 'الشّام',54,'#A26E32')
 s+=txt(800,675,'The two destinations in the lesson, not a route map' if en else 'وِجْهَتا السَّفَرِ في الدَّرْسِ، لا خَريطَةُ طَريقٍ',30)
 return s,'Two seasonal journeys' if en else 'رِحْلَتانِ في مَوْسِمَيْنِ'
def brush(x,y):
 return f'<rect x="{x}" y="{y}" width="185" height="28" rx="14" fill="#75A8BF"/><rect x="{x+155}" y="{y-28}" width="75" height="38" rx="8" fill="#A5D4DB"/>'+''.join(line(x+166+i*13,y-29,x+166+i*13,y-48,'#567E8C') for i in range(5))
def cleaning(en):
 s=txt(800,58,'Objects that help us stay clean' if en else 'أَدَواتٌ تُساعِدُني عَلى النَّظافَةِ',45)
 for x,c in [(60,BLUE),(600,GREEN),(1140,'#AD7937')]:s+=card(x,135,410,460,c)
 s+=brush(140,320)
 s+='<rect x="720" y="240" width="170" height="170" rx="35" fill="#94C6B5"/><rect x="755" y="210" width="100" height="35" rx="10" fill="#3F6E5B"/><path d="M805 210v-50h85" stroke="#3F6E5B" stroke-width="15" fill="none"/>'
 s+='<path d="M1250 270h190l-22 210h-146z" fill="#D8B57E"/><rect x="1235" y="245" width="220" height="25" rx="10" fill="#AD7937"/><path d="M1305 230v-25h80v25" fill="none" stroke="#AD7937" stroke-width="10"/>'
 for x,t,act in [(265,'Toothbrush' if en else 'فُرْشاةُ الأَسْنانِ','Clean my teeth' if en else 'أُنَظِّفُ أَسْناني'),(805,'Soap' if en else 'الصّابونُ','Wash my hands' if en else 'أَغْسِلُ يَدَيَّ'),(1345,'Rubbish bin' if en else 'سَلَّةُ النُّفاياتِ','Put rubbish inside' if en else 'أَضَعُ النُّفاياتِ فيها')]:s+=txt(x,540,t,35)+txt(x,670,act,32)
 return s,'Cleanliness in daily life' if en else 'النَّظافَةُ في حَياتي'
def tree(en):
 s=card(45,100,1510,510,GREEN)
 s+='<path d="M800 450V235M800 360L675 260M800 350L920 250" stroke="#98704D" stroke-width="40" fill="none" stroke-linecap="round"/>'
 for x,y,r in [(680,240,100),(800,180,130),(930,250,105),(780,290,115)]:s+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#78AD7E"/>'
 for x,y in [(720,200),(850,250),(940,290),(790,310)]:s+=f'<circle cx="{x}" cy="{y}" r="17" fill="#D9904C"/>'
 for x,t in [(250,'People' if en else 'الإِنْسانُ'),(800,'Birds' if en else 'الطُّيورُ'),(1350,'Animals' if en else 'الحَيَواناتُ')]:
  s+=line(800,465,x,510,'#76A180')+card(x-170,510,340,130)+txt(x,590,t,40,GREEN)
 s+=txt(800,700,'Who benefits from the planted tree in the lesson?' if en else 'مَنْ يَنْتَفِعُ بِالشَّجَرَةِ في الدَّرْسِ؟',34)
 return s,'A tree benefits living things' if en else 'شَجَرَةٌ يَنْتَفِعُ بِها غَيْري'
def manners(en):
 # Parallel stage panels, no arrow-implied mandatory order for each listed act.
 s='';stages=[('Before eating','قبل الطعام','Wash hands','أغسل يديّ'),('While eating','أثناء الطعام','Eat from nearby','آكل ممّا يليني'),('After eating','بعد الطعام','Clean my teeth','أنظّف أسناني')]
 for i,(a,b,c,d) in enumerate(stages):
  x=60+i*540;s+=card(x,115,480,465,[BLUE,GREEN,'#9E7336'][i])+txt(x+240,190,a if en else b,40)
  if i==0:s+='<rect x="210" y="275" width="180" height="65" rx="20" fill="#9BCCBD"/>'+''.join(f'<circle cx="{xx}" cy="{yy}" r="{r}" fill="#D6EBE4"/>' for xx,yy,r in [(260,250,18),(310,230,25),(350,250,14)])
  elif i==1:s+=f'<ellipse cx="{x+240}" cy="320" rx="130" ry="60" fill="#D9B777"/><ellipse cx="{x+240}" cy="320" rx="100" ry="40" fill="#F6E8C8"/>'+line(x+240,430,x+240,380,GREEN)+'<path d="M'+str(x+225)+' 395l15-15 15 15" fill="none" stroke="#3F6E5B" stroke-width="5"/>'
  else:s+=brush(x+110,320)
  s+=txt(x+240,510,c if en else d,34)
 s+=txt(800,670,'Selected examples from the lesson, not the complete list' if en else 'أَمْثِلَةٌ مُخْتارَةٌ مِنَ الدَّرْسِ، وَلَيْسَتْ كُلَّ الآدابِ',30)
 return s,'Before, during and after food' if en else 'قَبْلَ الطَّعامِ وَأَثْناءَهُ وَبَعْدَهُ'
# Each specification is a direct reading of that particular language/lesson.

def truthful(en):
 s=txt(800,65,"Ahmad's choice in the lesson" if en else 'اخْتِيارُ أَحْمَدَ في القِصَّةِ',46)
 for x in [90,850]:s+=card(x,140,660,450,BLUE)
 # A broken vase teaches the event without inventing Ahmad's appearance.
 s+='<path d="M320 250h180l-40 100 30 80H345l-20-80 40-40z" fill="#8EADC4"/><path d="M405 255l-35 60 55 42-25 70" stroke="white" stroke-width="8" fill="none"/>'
 s+=txt(420,525,'A vase broken by mistake' if en else 'مِزْهَرِيَّةٌ كُسِرَتْ بِلا قَصْدٍ',34)
 s+='<path d="M1010 250h350v150h-90l-50 45v-45h-210z" fill="#DAEAE2" stroke="#3F6E5B" stroke-width="4"/>'
 s+=txt(1180,340,'I tell the truth' if en else 'أَقولُ الحَقيقَةَ',43,GREEN)+txt(1180,525,'Ahmad admitted what happened' if en else 'اعْتَرَفَ أَحْمَدُ بِما حَدَثَ',34)
 s+=txt(800,680,'Ahmad told the truth about his mistake' if en else 'قالَ أَحْمَدُ الحَقيقَةَ عَنْ خَطَئِهِ',28)
 return s,'A mistake and an honest answer' if en else 'خَطَأٌ وَاعْتِرافٌ صادِقٌ'
def products(en):
 s=txt(800,58,'Two animal products named in the lesson' if en else 'مَنْفَعَتانِ مِنَ الحَيَواناتِ في الدَّرْسِ',44)
 for y in [110,400]:s+=card(100,y,1400,235,GREEN)
 # A cow: broad muzzle, horns, spotted body and udder. No human proxy.
 s+='<ellipse cx="400" cy="220" rx="145" ry="72" fill="#DBE4DE" stroke="#5C7569" stroke-width="4"/><path d="M300 265v46m70-42v42m100-42v42m44-65v65" stroke="#8A9E90" stroke-width="18"/><path d="M350 175q-45 30-5 65q65 15 55-50z" fill="#576C65"/><path d="M505 176l15-35 20 30m40 0l20-35 5 45" fill="#D1AE75"/><ellipse cx="550" cy="211" rx="55" ry="56" fill="#DBE4DE" stroke="#5C7569" stroke-width="3"/><ellipse cx="558" cy="246" rx="48" ry="27" fill="#D3AFA0"/><circle cx="532" cy="203" r="5" fill="#1F2A3C"/><circle cx="573" cy="203" r="5" fill="#1F2A3C"/>'
 s+='<path d="M1060 160h170l-18 140h-134z" fill="#E9F0ED" stroke="#75A8BF" stroke-width="5"/><path d="M1080 198h130l-12 90h-106z" fill="white"/>'
 # A hen, egg shape and nest establish literal source and product.
 s+='<ellipse cx="410" cy="510" rx="110" ry="65" fill="#CB9C67"/><circle cx="495" cy="463" r="42" fill="#D6AD7D"/><path d="M490 421q-25-35 0-30q13-24 24 1q26-8 18 32" fill="#B9514C"/><path d="M532 452l40 18-40 10" fill="#D7A33B"/><circle cx="507" cy="453" r="5" fill="#1F2A3C"/><path d="M310 490l-55-45 10 70 49 27" fill="#AA764A"/><path d="M390 567v38m65-38v38" stroke="#AE7C37" stroke-width="8"/>'
 s+='<ellipse cx="1145" cy="556" rx="108" ry="32" fill="#B99C75"/><ellipse cx="1110" cy="522" rx="32" ry="45" fill="#F2E4C8"/><ellipse cx="1165" cy="515" rx="32" ry="45" fill="#EBD7B2"/>'
 for y,a,b in [(225,'Milk','الحَليبُ'),(530,'Eggs','البَيْضُ')]:s+=line(680,y,920,y)+txt(1350,y+15,a if en else b,39,GREEN)
 s+=txt(800,700,'Cow → milk · Hen → eggs' if en else 'البَقَرَةُ: الحَليبُ · الدَّجاجَةُ: البَيْضُ',32)
 return s,'Animals and what we use from them' if en else 'حَيَواناتٌ نَنْتَفِعُ بِما تُعْطينا'

def prayerseats(en):
 s=txt(800,55,'A unit-by-unit organizer from the lesson' if en else 'تَرْتيبُ الرَّكْعاتِ كَما في الدَّرْسِ',43)
 for row,(name,ar,num) in enumerate([('Dhuhr','الظُّهْرُ',4),('Maghrib','المَغْرِبُ',3)]):
  y=135+row*270;s+=txt(190,y+85,name if en else ar,43,BLUE)
  for i in range(num):
   x=410+(i if en else num-1-i)*265;s+=card(x,y,225,150,BLUE)+txt(x+112,y+65,('Unit ' if en else 'رَكْعَةٌ ')+str(i+1),32)
   if i==1 and i!=num-1:s+=txt(x+112,y+117,'Tashahhud' if en else 'التَّشَهُّدُ',27,GREEN)
   if i==num-1:s+=txt(x+112,y+105,'Tashahhud' if en else 'التَّشَهُّدُ',27,GREEN)+txt(x+112,y+137,'+ salam' if en else 'وَالتَّسْليمُ',27,GREEN)
 s+=txt(800,710,'Key sitting/ending points, not the complete prayer procedure' if en else 'مَوْضِعُ الجُلوسِ وَالخِتامِ، وَلَيْسَ وَصْفًا كامِلًا لِلصَّلاةِ',28)
 return s,'Dhuhr and Maghrib: where do I sit?' if en else 'الظُّهْرُ وَالمَغْرِبُ: مَتى أَجْلِسُ؟'
def dhikrcount(en):
 s=txt(800,60,'The three counts taught in the lesson' if en else 'الأَعْدادُ الثَّلاثَةُ في الدَّرْسِ',44)
 for i,(label,n) in enumerate([('سُبْحانَ اللهِ',33),('الحَمْدُ لِلَّهِ',33),('اللهُ أَكْبَرُ',34)]):
  x=50+(i if en else 2-i)*530;s+=card(x,130,450,450,[BLUE,GREEN,'#A37436'][i])+txt(x+225,205,label,43)+txt(x+225,305,str(n),72)
  for j in range(n):s+=f'<circle cx="{x+65+(j%7)*53}" cy="{365+(j//7)*34}" r="9" fill="{GOLD}"/>'
 s+=txt(800,680,'Each small dot represents one repetition' if en else 'كُلُّ نُقْطَةٍ صَغيرَةٍ تُمَثِّلُ تَكْرارًا واحِدًا',31)
 return s,'Before sleep: 33, 33 and 34' if en else 'قَبْلَ النَّوْمِ: 33 وَ33 وَ34'
def privacy(en):
 s=txt(800,62,'Keep the third person included' if en else 'لا أَتْرُكُ الثّالِثَ خارِجَ الحَديثِ',44)
 # Anonymous circles are membership markers, not portraits of Ibn Umar or companions.
 for x in [240,650,1060]:s+=f'<circle cx="{x}" cy="335" r="65" fill="#D9E8E0" stroke="#3F6E5B" stroke-width="4"/>'
 s+='<path d="M250 220Q650 80 1050 220" stroke="#3F6E5B" stroke-width="5" fill="none"/>'
 s+=txt(650,135,'Shared conversation' if en else 'حَديثٌ يَشْمَلُ الجَميعَ',37,GREEN)
 for x,n in [(240,1),(650,2),(1060,3)]:s+=txt(x,350,str(n),44,GREEN)
 s+=card(110,475,1380,115,BLUE)+txt(800,548,'Do not have a private conversation that leaves one of three out' if en else 'لا يَتَناجى اثْنانِ دُونَ صاحِبِهِما إِذا كانُوا ثَلاثَةً',32,BLUE)
 s+=txt(800,680,'Circles show group members, not named historical people' if en else 'الدَّوائِرُ أَعْضاءُ مَجْموعَةٍ، وَلَيْسَتْ شَخْصِيّاتٍ تاريخِيَّةً',28)
 return s,'A conversation that includes everyone' if en else 'حَديثٌ يَشْمَلُ الجَميعَ'

def trade2(en):
 s,t=trade(en)
 return (s.replace('Ash-Sham','Syria') if en else s),t

def neighbors(en):
 s=txt(800,60,'Share cooked food with neighbours' if en else 'أُشارِكُ جيراني الطَّعامَ',44)
 s+=card(60,135,660,450,GREEN)+card(860,135,680,450,BLUE)
 s+='<path d="M240 290h310v190H240z" fill="#8DAEAE"/><ellipse cx="395" cy="290" rx="155" ry="35" fill="#C69A5D"/><path d="M235 330h-50v75h50M555 330h50v75h-50" fill="none" stroke="#5F8586" stroke-width="16"/>'
 s+=bowl(1090,290,'#C69A5D').replace('#A5DBF1','#C69A5D')+bowl(1360,350,'#83A3B7').replace('#A5DBF1','#C69A5D')
 s+=txt(390,535,'Cook' if en else 'أَطْبُخُ',42,GREEN)+txt(1200,535,'Share' if en else 'أُشارِكُ',42,BLUE)
 s+=txt(800,690,'Illustrative serving idea, not a historical scene or a set quantity' if en else 'فِكْرَةٌ تَوْضيحِيَّةٌ لِلتَّقْديمِ، لا مَشْهَدٌ تاريخِيٌّ وَلا كَمِّيَّةٌ مُحَدَّدَةٌ',27)
 return s,'From my cooking to my neighbours' if en else 'مِنْ طَعامي إِلى جيراني'

def fastingday(en):
 s=txt(800,50,'Two boundaries, not sunrise to sunset' if en else 'حَدّانِ لِلصِّيامِ: الفَجْرُ وَغُروبُ الشَّمْسِ',43)
 # Dawn has a light horizon without a visible sun; sunset sun is below the horizon.
 for x,dawn in [(80,True),(1050,False)]:
  s+=card(x,130,470,360,BLUE)
  s+=f'<rect x="{x+30}" y="165" width="410" height="205" rx="22" fill="{("#243E63" if dawn else "#E6AD6D")}"/>'
  s+=f'<path d="M{x+30} 335h410v35h-410z" fill="{("#C1DAD6" if dawn else "#B98258")}"/>'
  s+=f'<path d="M{x+30} 370h410v50h-410z" fill="#69897B"/>'
  s+=txt(x+235,462,('Dawn (Fajr)' if dawn else 'Sunset') if en else ('الفَجْرُ' if dawn else 'غُروبُ الشَّمْسِ'),37,BLUE)
 s+='<path d="M560 315h480" stroke="#A37436" stroke-width="12"/><circle cx="565" cy="315" r="13" fill="#A37436"/><circle cx="1035" cy="315" r="13" fill="#A37436"/>'
 s+=txt(800,265,'FASTING' if en else 'الصِّيامُ',41,GREEN)
 s+=card(390,535,820,85,GREEN)+txt(800,590,'No food or drink during the fast' if en else 'أَمْتَنِعُ عَنِ الأَكْلِ وَالشُّرْبِ أَثْناءَ الصِّيامِ',34,GREEN)
 s+=txt(800,695,'Schematic boundaries, not a clock or a guide to local prayer times' if en else 'رَسْمٌ تَوْضيحيٌّ لِلْحُدودِ، لا ساعَةٌ وَلا تَوْقيتٌ مَحَلّيٌّ',26)
 return s,'From dawn until sunset' if en else 'مِنَ الفَجْرِ إِلى غُروبِ الشَّمْسِ'
def kinship(en):
 s=txt(800,50,"A father's brother and a mother's brother" if en else 'أَخو الأَبِ وَأَخو الأُمِّ',43)
 for i in range(2):
  x=45+i*800;col=BLUE if i==0 else GREEN
  s+=card(x,120,710,490,col)
  s+=f'<path d="M{x+210} 300h280M{x+210} 330v155" stroke="#8AAB9D" stroke-width="6" fill="none"/>'
  s+=card(x+65,230,290,120,col)+txt(x+210,305,('Father' if i==0 else 'Mother') if en else ('الأَبُ' if i==0 else 'الأُمُّ'),39,col)
  s+=card(x+400,230,260,120,col)+txt(x+530,305,('His brother' if i==0 else 'Her brother') if en else ('أَخوهُ' if i==0 else 'أَخوها'),33,col)
  s+=txt(x+530,405,('My uncle' if en else ('عَمّي' if i==0 else 'خالي')),36,col)
  s+=card(x+75,480,270,90,col)+txt(x+210,540,'Child' if en else 'طِفْلٌ',36,col)
 s+=txt(800,690,'Two examples of kinship, not a complete family tree' if en else 'مِثالانِ لِلْقَرابَةِ، وَلَيْسا شَجَرَةَ أُسْرَةٍ كامِلَةً',27)
 return s,'Two sides of my family' if en else 'أَقارِبي مِنْ جِهَتَيْنِ'
def tapwater(en):
 s=txt(800,50,'Do not leave water running when it is not needed' if en else 'لا أَتْرُكُ الماءَ يَجْري بِلا حاجَةٍ',40)
 for i,on in enumerate([True,False]):
  x=90+i*770;s+=card(x,130,650,470,BLUE if on else GREEN)
  s+=f'<path d="M{x+160} 225h185v70h100v80h-80v-35H{x+160}z" fill="#93AFB5" stroke="#547D86" stroke-width="7"/>'
  s+=f'<path d="M{x+235} 220v-45m-45 0h90" stroke="#547D86" stroke-width="16" stroke-linecap="round"/>'
  if on:
   for y in [405,450,495]:s+=f'<path d="M{x+408} {y-16}q-25 32 0 34q25-2 0-34z" fill="#75ABC4"/>'
   s+=f'<path d="M{x+520} 185l55 55m0-55l-55 55" stroke="#B66C52" stroke-width="10" stroke-linecap="round"/>'
  else:s+=f'<path d="M{x+515} 215l22 24 45-52" stroke="#3F6E5B" stroke-width="10" fill="none" stroke-linecap="round"/>'
  s+=txt(x+325,555,('Running unused' if on else 'Closed when not needed') if en else ('يَجْري بِلا حاجَةٍ' if on else 'مُغْلَقٌ عِنْدَ عَدَمِ الحاجَةِ'),32,BLUE if on else GREEN)
 s+=txt(800,690,'A practical example of avoiding waste' if en else 'مِثالٌ عَمَليٌّ لِتَجَنُّبِ الإِسْرافِ',30)
 return s,'A small action to save water' if en else 'خُطْوَةٌ صَغيرَةٌ لِحِفْظِ الماءِ'

SPECS={
'IE-Y3-N-T2-L02':('learn2',fastingday),
'IE-Y3-N-T3-L06':('learn2',kinship),
'IE-Y3-N-T3-L07':('learn3',tapwater),
'IE-Y3-NN-T2-L02':('learn2',fastingday),
'IE-Y3-NN-T3-L06':('learn2',kinship),
'IE-Y3-NN-T3-L07':('learn3',tapwater),



'IE-Y2-N-T3-L10':('learn2',neighbors),'IE-Y2-NN-T3-L10':('learn2',neighbors),
'IE-Y2-NN-T2-L04':('learn1',trade2),

'IE-Y2-N-T2-L06':('learn2',prayerseats),'IE-Y2-NN-T2-L06':('learn2',prayerseats),
'IE-Y2-N-T2-L09':('learn4',dhikrcount),'IE-Y2-NN-T2-L09':('learn4',dhikrcount),
'IE-Y2-N-T3-L02':('learn2',privacy),'IE-Y2-NN-T3-L02':('learn2',privacy),
'IE-Y1-N-T1-L03':('learn1',truthful),'IE-Y1-NN-T1-L03':('learn1',truthful),


'IE-Y1-N-T3-L01':('learn2',products),'IE-Y1-NN-T3-L01':('learn2',products),

'IE-Y1-N-T1-L12':('learn3',animal),'IE-Y1-NN-T1-L12':('learn3',animal),
'IE-Y1-N-T2-L09':('learn4',prayers),'IE-Y1-NN-T2-L10':('learn4',prayers),
'IE-Y1-N-T2-L11':('learn1',trade),
'IE-Y1-N-T2-L03':('learn4',cleaning),'IE-Y1-NN-T2-L03':('learn4',cleaning),
'IE-Y1-N-T3-L07':('learn3',tree),'IE-Y1-NN-T3-L08':('learn3',tree),
'IE-Y1-N-T3-L04':('learn4',manners),'IE-Y1-NN-T3-L04':('learn4',manners),
}

def rawatib(en):
 s=txt(800,58,'Twelve additional rak\'ahs in this lesson' if en else 'اثْنَتا عَشْرَةَ رَكْعَةً في هَذا الدَّرْسِ',43)
 s+=txt(420,125,'Before' if en else 'قَبْلَ الفَريضَةِ',35,BLUE)+txt(820,125,'Obligatory prayer' if en else 'الفَريضَةُ',35)+txt(1220,125,'After' if en else 'بَعْدَ الفَريضَةِ',35,GREEN)
 for i,(name,a,b) in enumerate(zip(['Fajr','Dhuhr','Asr','Maghrib','Isha'] if en else ['الفجر','الظهر','العصر','المغرب','العشاء'],[2,4,0,0,0],[0,2,0,2,2])):
  y=155+i*86;s+=card(140,y,1320,74,'#9AB2B7')+txt(820,y+49,name,34)
  for cx,n,c in [(420,a,BLUE),(1220,b,GREEN)]:
   if n:
    for j in range(n):s+=f'<circle cx="{cx+(j-(n-1)/2)*65}" cy="{y+36}" r="18" fill="{c}"/>'
   else:s+=line(cx-25,y+36,cx+25,y+36,'#BCC9CD')
 s+=txt(800,640,'One dot = one additional rak\'ah' if en else 'كُلُّ دائِرَةٍ = رَكْعَةٌ إِضافِيَّةٌ',32)
 s+=txt(800,695,'A dash means none listed here, not a rule about all voluntary prayers' if en else 'الشَّرْطَةُ تَعْني غَيْرَ مَذْكورٍ هُنا، لا حُكْمًا عَلى كُلِّ النَّوافِلِ',26)
 return s,'Before and after the obligatory prayers' if en else 'قَبْلَ الفَريضَةِ وَبَعْدَها'
def measure(en):
 s=txt(800,60,'A classroom example: the same marked measure' if en else 'مِثالٌ تَعْليميٌّ: المِكْيالُ نَفْسُهُ وَالعَلامَةُ نَفْسُها',42)
 for i,(x,c,label) in enumerate([(80,BLUE,'Taking a full measure' if en else 'يَأْخُذُ المِكْيالَ كامِلًا'),(880,'#AF7051','Giving a short measure' if en else 'يُعْطي المِكْيالَ ناقِصًا')]):
  s+=card(x,130,640,470,c)+txt(x+320,200,label,35,c)
  y=280 if i==0 else 390
  s+=f'<path d="M{x+170} 250v270h300V250" fill="#F2F6F5" stroke="#5B7F88" stroke-width="7"/>'
  s+=f'<path d="M{x+180} {y}h280v230H{x+180}z" fill="#D4B075"/>' if i==0 else f'<path d="M{x+180} {y}h280v120H{x+180}z" fill="#D4B075"/>'
  s+=f'<path d="M{x+130} 280h380" fill="none" stroke="#436D74" stroke-width="4" stroke-dasharray="12 10"/>'
  s+=txt(x+320,565,'Full' if i==0 and en else ('Less' if en else ('كامِلٌ' if i==0 else 'ناقِصٌ')),36,c)
 s+=txt(800,675,'The two containers are equal; what is given is not equal' if en else 'المِكْيالانِ مُتَساوِيانِ، وَالمِقْدارُ المُعْطى غَيْرُ مُتَساوٍ',32)
 return s,'Full for me, less for others' if en else 'كامِلٌ لِنَفْسي وَناقِصٌ لِغَيْري'
def bench(en):
 s=txt(800,62,'An example of caring for a shared place' if en else 'مِثالٌ لِلْعِنايَةِ بِمَكانٍ مُشْتَرَكٍ',43)
 for i,x in enumerate([80,880]):
  s+=card(x,130,640,450,BLUE if i==0 else GREEN)
  for y in [240,290]:s+=f'<rect x="{x+100}" y="{y}" width="440" height="35" rx="7" fill="#BA9168"/>'
  s+=f'<path d="M{x+150} 320v160m340-160v160" stroke="#547B81" stroke-width="18"/>'
  s+=f'<rect x="{x+90}" y="350" width="460" height="32" rx="7" fill="#BA9168"/>'
  if i==0:s+=f'<path d="M{x+220} 249l35 20 20-22 26 24m25-25 25 25 23-26" stroke="#656A75" stroke-width="7" fill="none"/>'
  s+=txt(x+320,535,'Writing damages shared property' if i==0 and en else ('Kept clean for everyone' if en else ('الكِتابَةُ تُتْلِفُ المِرْفَقَ' if i==0 else 'نَظيفٌ لِلْجَميعِ')),30,BLUE if i==0 else GREEN)
 s+=txt(800,665,'A park bench is for everyone to use, not to mark or damage' if en else 'مِقْعَدُ الحَديقَةِ لِيَنْتَفِعَ بِهِ الجَميعُ، لا لِلْكِتابَةِ عَلَيْهِ وَإِتْلافِهِ',29)
 return s,'A park bench belongs to everyone' if en else 'مِقْعَدٌ في الحَديقَةِ لِلْجَميعِ'
def litter(en):
 s=txt(800,58,'Keeping litter out of the sea' if en else 'أَمْنَعُ وُصولَ النُّفاياتِ إِلَى البَحْرِ',44)+card(90,115,1420,480,BLUE)
 s+='<path d="M100 415q90-30 180 0t180 0t180 0v170H100z" fill="#A5D0DF"/><path d="M640 415q140-40 300-15v185H640z" fill="#E8D6AE"/>'
 s+='<g transform="translate(450 335) rotate(20)"><rect width="85" height="25" rx="10" fill="#DDD6BA" stroke="#A09575" stroke-width="3"/><rect x="76" y="3" width="15" height="19" fill="#A09575"/></g>'
 s+='<path d="M1030 270h200l-25 260h-150z" fill="#75A99C" stroke="#3F6E5B" stroke-width="5"/><rect x="1010" y="245" width="240" height="28" rx="7" fill="#3F6E5B"/><path d="M1090 245v-30h85v30" fill="none" stroke="#3F6E5B" stroke-width="8"/>'
 s+=txt(425,545,'Not in the water' if en else 'لا في الماءِ',32,BLUE)+txt(1130,565,'In the bin' if en else 'في السَّلَّةِ',32,GREEN)
 s+='<path d="M650 325Q820 180 1000 290m-30-45 30 45-55-4" fill="none" stroke="#3F6E5B" stroke-width="7"/>'
 s+=txt(800,675,'Dispose of litter in its proper place, not on the shore' if en else 'أَضَعُ النُّفاياتِ في مَكانِها، لا عَلى الشّاطِئِ',32)
 return s,'From litter to the bin, not the sea' if en else 'النُّفاياتُ إِلى السَّلَّةِ لا البَحْرِ'

SPECS['IE-Y4-N-T2-L01']=('learn3',rawatib)

SPECS['IE-Y4-N-T3-L02']=('learn3',bench)

SPECS['IE-Y4-N-T3-L06']=('learn1',measure)

SPECS['IE-Y4-N-T3-L09']=('learn3',litter)

SPECS['IE-Y4-NN-T2-L01']=('learn3',rawatib)

SPECS['IE-Y4-NN-T3-L02']=('learn3',bench)

SPECS['IE-Y4-NN-T3-L06']=('learn1',measure)

SPECS['IE-Y4-NN-T3-L09']=('learn3',litter)

def section(code,h):
 after,fn=SPECS[code];en='-NN-' in code;svg,title=fn(en)
 src=re.search(r'<section class="sl" id="'+after+r'"[^>]*>.*?</section>',h,re.S).group()
 # Duplicate exact house shell and insert a new diagram, never rewrite original sections.
 s=src.replace('id="'+after+'"','id="ie-visual"',1)
 body=re.search(r'<div style="position:absolute;(?:right|left):120px;top:300px;.*?</p></div>',s,re.S).group()
 s=s.replace(body,'<div data-ie-visual="v1" style="position:absolute;left:130px;top:285px;width:1660px;height:650px"><svg role="img" aria-label="'+html.escape(title,quote=True)+'" viewBox="0 0 1600 740" style="width:100%;height:100%">'+svg+'</svg></div>')
 s=re.sub(r'(<h2[^>]*>).*?(</h2>)',lambda m:m[1]+title+m[2],s,count=1,flags=re.S)
 s=re.sub(r'<aside>.*?</aside>','<aside>Original authored diagram using only the adjacent lesson text. Shapes and text are editable. Original teaching slides and assessments retained.</aside>',s,flags=re.S)
 return s,after

def apply_html(code,h):
 if code in GRADE5_SPECS:return apply_grade5(code,h)
 if code not in SPECS or 'id="ie-visual"' in h:return h
 s,after=section(code,h);m=re.search(r'<section class="sl" id="'+after+r'"[^>]*>.*?</section>',h,re.S)
 return h[:m.end()]+s+h[m.end():]

def steady_week(en):
 s=txt(800,65,'An example: one page each day' if en else 'مِثالٌ: صَفْحَةٌ كُلَّ يَوْمٍ',44)
 days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] if en else ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']
 for i,day in enumerate(days):
  x=65+i*213;s+=card(x,155,190,335,GREEN)+txt(x+95,220,day,30)
  s+=f'<rect x="{x+45}" y="270" width="100" height="140" rx="7" fill="#F3F7F5" stroke="#3F6E5B" stroke-width="4"/>'
  for y in [302,326,350,374]:s+=line(x+65,y,x+125,y,'#9BB6A9')
  s+=txt(x+95,455,'1 page' if en else 'صفحة',27,GREEN)
 s+=txt(800,605,'A small action repeated, rather than a single large effort' if en else 'عَمَلٌ قَليلٌ يَتَكَرَّرُ بَدَلَ الكَثيرِ المُنْقَطِعِ',34)
 s+=txt(800,680,'Example only, not a required daily amount' if en else 'مِثالٌ تَوْضيحيٌّ، لا تَحْديدٌ لِمِقْدارٍ واجِبٍ',28)
 return s,'Small and regular' if en else 'قَليلٌ وَمُسْتَمِرٌّ'
def transport_queue(en):
 s=txt(800,65,'Wait in order before boarding' if en else 'أَنْتَظِرُ دَوْري قَبْلَ الرُّكوبِ',43)
 s+=card(90,130,1420,450,BLUE)
 s+='<rect x="1050" y="210" width="340" height="280" rx="40" fill="#6FA3B7"/><rect x="1110" y="240" width="130" height="205" rx="12" fill="#EFF7F6"/><rect x="1260" y="250" width="95" height="90" rx="8" fill="#D3E7EE"/><circle cx="1130" cy="500" r="36" fill="#304A56"/><circle cx="1320" cy="500" r="36" fill="#304A56"/>'
 for x,n in [(890,1),(640,2),(390,3)]:
  s+=f'<circle cx="{x}" cy="285" r="35" fill="#D5B694"/><path d="M{x-45} 340h90v90h-90z" fill="#3F6E5B"/><path d="M{x-25} 430v65m50-65v65" stroke="#42616D" stroke-width="17" stroke-linecap="round"/>'
  s+=txt(x,555,str(n),30,BLUE)
 s+=txt(800,665,'Everyone keeps their turn; no pushing' if en else 'لِكُلِّ واحِدٍ دَوْرُهُ، بِلا تَدافُعٍ',34)
 return s,'My turn to board' if en else 'دَوْري في الرُّكوبِ'
def sermon_order(en):
 s=txt(800,55,'The order is different' if en else 'يَخْتَلِفُ التَّرْتيبُ',44)
 for i,label in enumerate(['Friday' if en else 'الجُمُعَةُ','Eid' if en else 'العيدُ']):
  y=115+i*270;s+=card(85,y,1430,245,BLUE if i==0 else GREEN)
  s+=txt(245 if en else 1355,y+130,label,42)
  centers=[690,1230] if en else [910,370]
  for step,x in enumerate(centers):
   sermon=(i==0 and step==0) or (i==1 and step==1)
   s+=f'<circle cx="{x-155}" cy="{y+55}" r="25" fill="#E8D7AF"/>'+txt(x-155,y+64,str(step+1),27)
   if sermon:
    s+=f'<path d="M{x-65} {y+60}h130l-22 22h-86z" fill="#B48B5E" stroke="#826443" stroke-width="3"/><path d="M{x-37} {y+83}h74v65h-74z" fill="#CDA87A"/><path d="M{x-63} {y+148}h126v14h-126z" fill="#826443"/><path d="M{x+30} {y+59}v-24q0-18 18-18h12" fill="none" stroke="#4F6674" stroke-width="6"/><circle cx="{x+63}" cy="{y+17}" r="7" fill="#4F6674"/>'
    caption=('Two sermons' if i==0 else 'Sermon') if en else ('خُطْبَتانِ' if i==0 else 'خُطْبَةٌ')
   else:
    s+=f'<rect x="{x-57}" y="{y+22}" width="114" height="142" rx="6" fill="#DCECE5" stroke="#3F6E5B" stroke-width="5"/><path d="M{x-42} {y+145}v-63l42-35 42 35v63z" fill="#8BB7A4"/><path d="M{x-65} {y+28}h-10m10 20h-10m10 20h-10m132-40h10m-10 20h10m-10 20h10" stroke="#BA9860" stroke-width="4"/>'
    caption="Two rak'ahs" if en else 'رَكْعَتانِ'
   s+=txt(x,y+215,caption,35)
  if en:s+=f'<path d="M900 {y+112}h110l-25-20m25 20-25 20" fill="none" stroke="#3F6E5B" stroke-width="6"/>'
  else:s+=f'<path d="M700 {y+112}h-110l25-20m-25 20 25 20" fill="none" stroke="#3F6E5B" stroke-width="6"/>'
 s+=txt(800,695,'Arrows show sequence; objects are symbols, not counts of people' if en else 'الأَسْهُمُ لِلتَّرْتيبِ، وَالرُّموزُ لا تُمَثِّلُ عَدَدَ المُصَلِّينَ',27)
 return s,'Sermon and prayer: which comes first?' if en else 'الخُطْبَةُ وَالصَّلاةُ: أَيُّهُما أَوَّلًا؟'

GRADE5_SPECS={}
for track in ['N','NN']:
 for suffix,fn,after in [('T1-L03',steady_week,'part1'),('T2-L04',transport_queue,'part0'),('T3-L05',sermon_order,'part1')]:
  GRADE5_SPECS[f'IE-Y5-{track}-{suffix}']=(after,fn)
def apply_grade5(code,h):
 if 'id="ie-visual"' in h:return h
 after,fn=GRADE5_SPECS[code]
 m=re.search(r'<section class="sl" id="'+after+r'".*?</section>',h,re.S)
 assert m
 s=m.group().replace('id="'+after+'"','id="ie-visual"',1)
 svg,title=fn('-NN-' in code)
 s=re.sub(r'(<h2[^>]*>).*?(</h2>)',lambda z:z[1]+title+z[2],s,count=1,flags=re.S)
 pat=r'<div style="background:#fff;border-(?:left|right):10px.*?</p></div>'
 assert re.search(pat,s,re.S)
 s=re.sub(pat,'<div data-ie-visual="v1" style="position:absolute;left:130px;top:260px;width:1660px;height:690px"><svg role="img" aria-label="'+title+'" viewBox="0 0 1600 740" style="width:100%;height:100%">'+svg+'</svg></div>',s,count=1,flags=re.S)
 s=re.sub(r'<aside>.*?</aside>','<aside>Original editable teaching diagram. Example only; original lesson, quotation and assessment text retained.</aside>',s,flags=re.S)
 return h[:m.end()]+s+h[m.end():]

def idgham_groups(en):
 s=txt(800,55,'The six letters, in two groups' if en else 'سِتَّةُ حُروفٍ في مَجْموعَتَيْنِ',44)
 for i,(letters,label) in enumerate([(['ي','ن','م','و'],'With ghunnah' if en else 'بِغُنَّةٍ'),(['ل','ر'],'Without ghunnah' if en else 'بِغَيْرِ غُنَّةٍ')]):
  x=75+i*780;c=GREEN if i==0 else BLUE;s+=card(x,130,670,420,c)+txt(x+335,215,label,42,c)
  for j,l in enumerate(letters):
   cx=x+335+(j-(len(letters)-1)/2)*135;s+=f'<circle cx="{cx}" cy="350" r="54" fill="#EFF5F2" stroke="{c}" stroke-width="3"/>'+txt(cx,370,l,67,c)
  s+=txt(x+335,495,str(len(letters))+(' letters' if en else ' حُروفٍ'),35,c)
 s+=txt(800,635,'For nun sakinah or tanwin before a letter in the following word' if en else 'عِنْدَ مَجيءِ حَرْفٍ مِنْها بَعْدَ النّونِ السّاكِنَةِ أَوِ التَّنْوينِ في الكَلِمَةِ التّالِيَةِ',28)
 s+=txt(800,695,'A letter organizer; practise the sound with your teacher' if en else 'تَنْظيمٌ لِلْحُروفِ؛ أُطَبِّقُ النُّطْقَ مَعَ مُعَلِّمي',28)
 return s,'Two kinds of idgham' if en else 'نَوْعانِ مِنَ الإِدْغامِ'
def voluntary_calendar(en):
 s=txt(800,48,'Weekly and monthly examples' if en else 'أَمْثِلَةٌ أُسْبوعِيَّةٌ وَشَهْرِيَّةٌ',44)
 s+=card(70,100,1460,220,BLUE)+txt(800,155,'In a week' if en else 'في الأُسْبوعِ',34,BLUE)
 days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] if en else ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']
 for i,d in enumerate(days):
  x=170+(i if en else 6-i)*210;chosen=i in [1,4];s+=f'<rect x="{x-88}" y="190" width="176" height="90" rx="18" fill="{GREEN if chosen else "#EFF3F2"}"/>'+txt(x,248,d,29,'white' if chosen else INK)
 s+=card(70,360,1460,230,GREEN)+txt(800,420,'The white days of a Hijri month' if en else 'أَيّامُ البيضِ مِنَ الشَّهْرِ الهِجْرِيِّ',36,GREEN)
 for i,n in enumerate([13,14,15]):
  x=545+i*255;s+=f'<rect x="{x-80}" y="455" width="160" height="100" rx="18" fill="#DCEBE4" stroke="#3F6E5B" stroke-width="3"/>'+txt(x,525,str(n),57,GREEN)
 s+=txt(800,655,'Two separate patterns, not dates aligned to weekdays' if en else 'نَمَطانِ مُنْفَصِلانِ، لا مُطابَقَةٌ بَيْنَ أَيّامِ الأُسْبوعِ وَتَواريخِ الشَّهْرِ',27)
 s+=txt(800,710,'Examples of voluntary fasting, not an obligation' if en else 'أَمْثِلَةٌ لِصِيامِ التَّطَوُّعِ، لا فَريضَةٌ',28)
 return s,'Recognising voluntary fasting days' if en else 'أَتَعَرَّفُ أَيّامَ صِيامِ التَّطَوُّعِ'
def parched_crops(en):
 s=txt(800,50,'Water reaches parched land; crops grow' if en else 'يَصِلُ الماءُ إِلى الأَرْضِ الجُرُزِ فَيَخْرُجُ الزَّرْعُ',42)
 for i,label in enumerate(['Parched land','Water reaches it','Crops grow'] if en else ['أَرْضٌ جُرُزٌ','يَصِلُ إِلَيْها الماءُ','يَخْرُجُ الزَّرْعُ']):
  x=55+(i if en else 2-i)*520;s+=card(x,135,450,440,BLUE if i==1 else GREEN)
  s+=f'<path d="M{x+30} 425h390v80h-390z" fill="#C9A573"/>'
  if i==0:s+=f'<path d="M{x+80} 435l45 25-25 35m80-50 35 25 40-35m60 40 25 20" fill="none" stroke="#9D794F" stroke-width="5"/>'
  if i==1:
   s+=f'<path d="M{x+45} 350q90 15 170 50t200 20" fill="none" stroke="#6DAFC8" stroke-width="22"/>'
  if i==2:
   for dx in [90,180,270,360]:
    s+=f'<path d="M{x+dx} 427V290" stroke="#528067" stroke-width="7"/><path d="M{x+dx} 370q-65-55-55-75 60 5 55 75m0-25q65-55 55-75-60 5-55 75" fill="#82AD77"/>'
  s+=txt(x+225,550,label,34)
 s+=txt(800,670,'A schematic of the visible scene in the verse, not the unseen Resurrection' if en else 'رَسْمٌ لِلْمَشْهَدِ المَحْسوسِ في الآيَةِ، لا تَصْويرٌ لِلْبَعْثِ',28)
 return s,'From parched land to crops' if en else 'مِنَ الأَرْضِ الجُرُزِ إِلى الزَّرْعِ'
for track in ['N','NN']:
 for suffix,fn,after in [('T2-L01',parched_crops,'part1'),('T2-L02',idgham_groups,'part1'),('T3-L10',voluntary_calendar,'part0')]:
  GRADE5_SPECS[f'IE-Y6-{track}-{suffix}']=(after,fn)

def shared_ship(en):
 s=txt(800,48,'One hull, shared safety' if en else 'هَيْكَلٌ واحِدٌ وَسَلامَةٌ مُشْتَرَكَةٌ',44)
 s+=card(65,100,1470,475,BLUE)
 # Cross-section only. No historical people or reconstruction of an actual vessel.
 s+='<path d="M145 405q130-32 260 0t260 0t260 0t260 0t150 0v155H145z" fill="#A5D0DF"/>'
 s+='<path d="M255 210h1090l-100 290q-15 45-70 45H450q-55 0-75-45z" fill="#D5B485" stroke="#8F6A41" stroke-width="9"/>'
 s+='<path d="M310 245h970l-35 90H350zM363 365h865l-47 135H414z" fill="#F8EBD5"/>'
 s+=line(345,350,1250,350,'#8F6A41')
 s+=txt(800,310,'Upper deck' if en else 'القِسْمُ الأَعْلى',40)+txt(800,445,'Lower deck' if en else 'القِسْمُ الأَسْفَلُ',40)
 s+='<ellipse cx="1175" cy="482" rx="40" ry="35" fill="none" stroke="#AF6244" stroke-width="6" stroke-dasharray="10 7"/>'
 s+=txt(1270,180,'Proposed hole' if en else 'خَرْقٌ مُقْتَرَحٌ',27,'#9D573D')+line(1250,195,1187,445,'#AF6244')
 for x,label,c in [(430,'If left: danger to all' if en else 'إِنْ تُرِكَ الخَرْقُ: خَطَرٌ عَلى الجَميعِ','#9D573D'),(1170,'If stopped: safety for all' if en else 'إِنْ مُنِعَ: سَلامَةُ الجَميعِ',GREEN)]:s+=card(x-340,600,680,80,c)+txt(x,652,label,29,c)
 s+=txt(800,725,'A schematic of the parable, not an actual historical ship' if en else 'رَسْمٌ لِلْمَثَلِ، لا إِعادَةُ بِنَاءِ سَفينَةٍ تاريَخِيَّةٍ',25)
 return s,'The ship in the parable' if en else 'السَّفينَةُ في المَثَلِ'
def mim_cases(en):
 s=txt(800,50,'Look at the letter after mim sakinah' if en else 'أَنْظُرُ إِلى الحَرْفِ بَعْدَ الميمِ السّاكِنَةِ',42)
 entries=[('ب',"Ikhfa shafawi",'إِخْفاءٌ شَفَوِيٌّ',BLUE),('م',"Idgham shafawi",'إِدْغامٌ شَفَوِيٌّ',GREEN),('Other letters',"Izhar shafawi",'إِظْهارٌ شَفَوِيٌّ','#9D733D')]
 for i,(letter,eng,ar,c) in enumerate(entries):
  x=55+(i if en else 2-i)*520;s+=card(x,135,450,420,c)
  if i<2:s+=f'<circle cx="{x+225}" cy="265" r="78" fill="#EFF4F1" stroke="{c}" stroke-width="3"/>'+txt(x+225,294,letter,80,c)
  else:s+=txt(x+225,260,'Other letters' if en else 'باقي الحُروفِ',36,c)+txt(x+225,322,'except ب and م' if en else 'عَدا الباءِ وَالميمِ',27,c)
  s+=txt(x+225,435,eng if en else ar,33,c)
  s+=txt(x+225,505,('With ghunnah' if i<2 else 'Mim is clear') if en else ('بِغُنَّةٍ' if i<2 else 'تُنْطَقُ الميمُ واضِحَةً'),30)
 s+=txt(800,645,'Take extra care before و and ف: keep mim clear' if en else 'أَحْذَرُ عِنْدَ الواوِ وَالفاءِ: أُظْهِرُ الميمَ',31)
 s+=txt(800,710,'A rule organizer, not a substitute for listening and teacher practice' if en else 'تَنْظيمٌ لِلْأَحْكامِ، لا بَديلٌ عَنِ الاسْتِماعِ وَالتَّدْريبِ مَعَ المُعَلِّمِ',26)
 return s,'Three rules of mim sakinah' if en else 'ثَلاثَةُ أَحْكامٍ لِلْميمِ السّاكِنَةِ'
def qasr_counts(en):
 s=txt(800,45,"Compare the obligatory rak'ahs" if en else 'أُقارِنُ عَدَدَ رَكْعاتِ الفَرْضِ',43)
 s+=txt(800,96,'When the conditions for shortening on a journey apply' if en else 'عِنْدَ تَحَقُّقِ شُروطِ القَصْرِ في السَّفَرِ',28)
 names=['Fajr','Dhuhr','Asr','Maghrib','Isha'] if en else ['الفجر','الظهر','العصر','المغرب','العشاء']
 for i,(n,a,b) in enumerate(zip(names,[2,4,4,3,4],[2,2,2,3,2])):
  y=130+i*94;c=GREEN if a!=b else BLUE;s+=card(100,y,1400,80,c)+txt(300 if en else 1390,y+54,n,33,c)
  for x,count in [(670,a),(1110,b)]:
   for j in range(count):s+=f'<circle cx="{x+(j-(count-1)/2)*55}" cy="{y+40}" r="17" fill="{GOLD if x==670 else c}"/>'
   s+=txt(x+135,y+52,str(count),31,c)
 s+=txt(700,660,'Usual count' if en else 'العَدَدُ الأَصْلِيُّ',30)+txt(1140,660,'With qasr' if en else 'عِنْدَ القَصْرِ',30,GREEN)
 s+=txt(800,720,"One dot = one rak'ah. Qasr changes count, not prayer times." if en else 'كُلُّ نُقْطَةٍ رَكْعَةٌ. القَصْرُ لِلْعَدَدِ، لا لِتَغْييرِ أَوْقاتِ الصَّلاةِ.',25)
 return s,'Shortening is not combining' if en else 'القَصْرُ لَيْسَ هُوَ الجَمْعَ'
for track in ['N','NN']:
 for suffix,fn,after in [('T2-L02',mim_cases,'part1'),('T2-L11',qasr_counts,'part1'),('T3-L07',shared_ship,'part1')]:
  GRADE5_SPECS[f'IE-Y7-{track}-{suffix}']=(after,fn)

def sai_count(en):
 s=txt(800,45,'Seven crossings, not seven return trips' if en else 'سَبْعَةُ أَشْواطٍ، لا سَبْعُ رِحْلاتِ ذَهابٍ وَعَوْدَةٍ',40)
 s+=card(95,90,1410,550,BLUE)
 s+=txt(420,160,'Safa' if en else 'الصَّفا',43,GREEN)+txt(1190,160,'Marwah' if en else 'المَرْوَةُ',43,BLUE)
 for i in range(7):
  y=210+i*55;c=GREEN if i%2==0 else BLUE
  s+=txt(240,y+10,str(i+1),30,c)+line(440,y,1160,y,c)
  if i%2==0:s+=f'<path d="M1138 {y-13}l22 13-22 13" fill="none" stroke="{c}" stroke-width="5"/>'
  else:s+=f'<path d="M462 {y-13}l-22 13 22 13" fill="none" stroke="{c}" stroke-width="5"/>'
 s+=txt(800,685,'Start at Safa. Finish the seventh at Marwah.' if en else 'أَبْدَأُ بِالصَّفا، وَأُنْهي الشَّوْطَ السّابِعَ بِالمَرْوَةِ.',32)
 s+=txt(800,730,'Counting diagram only, not a map or distance scale' if en else 'رَسْمٌ لِلْعَدِّ فَقَطْ، لا خَريطَةٌ وَلا مِقْياسُ مَسافَةٍ',24)
 return s,"Counting the laps of sa'y" if en else 'أَعُدُّ أَشْواطَ السَّعْيِ'
def eclipse_counts(en):
 s=txt(800,55,"Two rak'ahs, with repeated standing and bowing" if en else 'رَكْعَتانِ، وَفي كُلٍّ مِنْهُما قِيامانِ وَرُكوعانِ',40)
 for i in range(2):
  x=75+i*780;c=[GREEN,BLUE][i];s+=card(x,120,670,480,c)
  s+=txt(x+335,195,("Rak'ah "+str(i+1)) if en else ('الرَّكْعَةُ الأُولى' if i==0 else 'الرَّكْعَةُ الثّانِيَةُ'),41,c)
  for j,(a,b) in enumerate([('Standing / recitation','قِيامٌ وَقِراءَةٌ'),('Bowing','رُكوعٌ'),('Prostration','سُجودٌ')]):
   y=285+j*115;s+=txt(x+250,y,a if en else b,32)
   for dx in [465,540]:s+=f'<circle cx="{x+dx}" cy="{y-12}" r="22" fill="{c}"/>'
 s+=txt(800,675,'Each dot is one occurrence of the named action' if en else 'كُلُّ نُقْطَةٍ مَرَّةٌ واحِدَةٌ مِنَ الفِعْلِ المَذْكورِ',29)
 s+=txt(800,730,'Action counts only, not the full order of the prayer' if en else 'العَدَدُ فَقَطْ، لا التَّرْتيبُ الكامِلُ لِأَفْعالِ الصَّلاةِ',25)
 return s,'The eclipse prayer: count the actions' if en else 'صَلاةُ الكُسوفِ: أَعُدُّ الأَفْعالَ'
def oath_choices(en):
 s=txt(800,45,'Choose ONE of these three options' if en else 'أَخْتارُ واحِدًا مِنْ هذِهِ الأُمورِ الثَّلاثَةِ',41)
 for i in range(3):
  x=60+i*520;c=[GREEN,BLUE,'#9D733D'][i];s+=card(x,105,440,340,c)
  if i<2:
   for j in range(10):
    xx=x+95+(j%5)*62;yy=230+(j//5)*70
    if i==0:s+=f'<path d="M{xx-22} {yy}h44l-9 22h-26z" fill="{c}"/><ellipse cx="{xx}" cy="{yy}" rx="22" ry="5" fill="#D8B777"/>'
    else:s+=f'<path d="M{xx-10} {yy-10}l-16 9 7 13 9-5v32h28v-32l9 5 7-13-16-9q-14 12-28 0z" fill="{c}"/>'
  else:
   s+=f'<path d="M{x+185} 210l-30 30q-25 25 0 50t50 0l25-25m25-10 30-30q25-25 0-50t-50 0l-25 25" fill="none" stroke="{c}" stroke-width="14" stroke-linecap="round"/>'
   s+=txt(x+220,345,'Set free' if en else 'تَحْريرٌ',33,c)
  labels=[('Feed ten people in need','إِطْعامُ عَشَرَةِ مَساكينَ'),('Clothe ten people in need','كِسْوَةُ عَشَرَةِ مَساكينَ'),('Free a bondsperson','تَحْريرُ رَقَبَةٍ')]
  s+=txt(x+220,400,labels[i][0 if en else 1],27,c)
 s+=txt(800,500,'If unable to do any of the three' if en else 'فَإِنْ عَجَزْتُ عَنِ الأُمورِ الثَّلاثَةِ',34)
 s+=line(800,520,800,555,GREEN)+f'<path d="M785 540l15 15 15-15" fill="none" stroke="{GREEN}" stroke-width="5"/>'
 for i in range(3):
  x=575+i*170;s+=card(x,575,140,80,GREEN)+txt(x+70,628,str(i+1),38,GREEN)
 s+=txt(800,710,'Then fast three days. Fasting is not a fourth equal choice.' if en else 'أَصومُ ثَلاثَةَ أَيّامٍ. الصِّيامُ لَيْسَ خِيارًا رابِعًا مُساوِيًا.',28)
 return s,'Expiation for a broken oath' if en else 'كَفّارَةُ اليَمينِ'
for track in ['N','NN']:
 for suffix,fn,after in [('T1-L10',eclipse_counts,'part1'),('T2-L05',sai_count,'part3'),('T3-L03',oath_choices,'part1')]:
  GRADE5_SPECS[f'IE-Y8-{track}-{suffix}']=(after,fn)

GRADE5_SPECS["IE-Y8-NN-T2-L05"]=("part1",sai_count)

def zakat_share(en):
 s=txt(800,50,'One fortieth = 2.5%' if en else 'رُبْعُ العُشْرِ = ٢٫٥٪ = ١ مِنْ ٤٠',46)
 s+=txt(800,110,'Money: when the zakah conditions are met, after a lunar year' if en else 'في النُّقودِ: بَعْدَ تَحَقُّقِ شُروطِ الزَّكاةِ وَمُرورِ حَوْلٍ قَمَرِيٍّ',28)
 s+=card(140,160,1320,410,BLUE)
 for i in range(40):
  row,col=divmod(i,10);x=215+col*120;y=225+row*85;c=GOLD if i==39 else '#DCE9E3'
  s+=f'<rect x="{x}" y="{y}" width="90" height="56" rx="12" fill="{c}" stroke="{GREEN}" stroke-width="2"/>'
 s+=txt(800,640,'40 equal shares of the zakatable money' if en else 'أُقَسِّمُ المالَ الزَّكَوِيَّ إِلى ٤٠ جُزْءًا مُتَساوِيًا',34)
 s+=txt(800,700,'The gold share is the zakah: one share, not 2.5 shares' if en else 'الجُزْءُ الذَّهَبِيُّ هُوَ الزَّكاةُ: جُزْءٌ واحِدٌ مِنْ أَرْبَعينَ',29)
 return s,'Seeing the zakah share' if en else 'أَرى مِقْدارَ الزَّكاةِ'
def hajj_types(en):
 s=txt(800,40,'Compare the rituals and the state of ihram' if en else 'أُقارِنُ النُّسُكَ وَحالَةَ الإِحْرامِ',40)
 labels=[('Ifrad','الإِفْرادُ'),('Qiran','القِرانُ'),("Tamattu'",'التَّمَتُّعُ')]
 for i,(a,b) in enumerate(labels):
  y=105+i*170;c=[BLUE,GREEN,'#9D733D'][i];s+=card(70,y,1460,145,c)+txt(270 if en else 1350,y+83,a if en else b,37,c)
  x=475 if en else 160
  if i==0:
   s+=f'<rect x="{x}" y="{y+32}" width="990" height="82" rx="24" fill="#E3EEF6"/>'+txt(x+495,y+85,'Hajj only' if en else 'الحَجُّ فَقَطْ',36,c)
  elif i==1:
   s+=f'<rect x="{x}" y="{y+32}" width="990" height="82" rx="24" fill="#E0EDE7"/>'+txt(x+495,y+85,"'Umrah + Hajj: one ihram" if en else 'عُمْرَةٌ وَحَجٌّ بِإِحْرامٍ واحِدٍ',34,c)
  else:
   for xx,ww,fill in [(x,330,'#F3E8D7'),(x+345,300,'#F7F7F2'),(x+660,330,'#F3E8D7')]:s+=f'<rect x="{xx}" y="{y+32}" width="{ww}" height="82" rx="24" fill="{fill}" stroke="{c}" stroke-width="2"/>'
   s+=txt(x+165,y+84,"'Umrah" if en else 'حَجٌّ',32,c)+txt(x+495,y+82,'Exit ihram' if en else 'تَحَلُّلٌ',29,c)+txt(x+825,y+84,'Hajj' if en else 'عُمْرَةٌ',32,c)
 s+=txt(800,650,"Tamattu': 'Umrah, release, then a new ihram for Hajj" if en else 'التَّمَتُّعُ: عُمْرَةٌ، ثُمَّ تَحَلُّلٌ، ثُمَّ إِحْرامٌ جَديدٌ لِلْحَجِّ',31)
 s+=txt(800,715,'A comparison of ihram, not the full sequence or duration of the rites' if en else 'مُقارَنَةٌ لِلْإِحْرامِ، لا لِكُلِّ المَناسِكِ وَلا لِمُدَدِها',25)
 return s,'Three types of Hajj' if en else 'أَنْواعُ الحَجِّ الثَّلاثَةُ'
for track in ['N','NN']:
 for suffix,fn,after in [('T1-L05',zakat_share,'part1'),('T1-L09',hajj_types,'part2')]:
  GRADE5_SPECS[f'IE-Y9-{track}-{suffix}']=(after,fn)

def hijrah_boundary(en):
 s=txt(800,55,'The Hijrah is the time boundary' if en else 'الهِجْرَةُ هِيَ الحَدُّ الزَّمَنِيُّ',44)
 for x,c in [(90,BLUE),(870,GREEN)]:s+=card(x,160,640,350,c)
 s+=txt(410,245,'Before the Hijrah' if en else 'ما نَزَلَ قَبْلَ الهِجْرَةِ',42,BLUE)
 s+=txt(1190,245,'After the Hijrah' if en else 'ما نَزَلَ بَعْدَ الهِجْرَةِ',42,GREEN)
 s+=txt(410,370,'Makki' if en else 'مَكِّيٌّ',66,BLUE)+txt(1190,370,'Madani' if en else 'مَدَنِيٌّ',66,GREEN)
 s+=line(800,125,800,570,GOLD)
 s+=txt(800,640,'Classify by time of revelation, not the place name' if en else 'التَّصْنيفُ بِزَمانِ النُّزولِ، لا بِاسْمِ المَكانِ',35)
 s+=txt(800,705,'This is not a map or a scale of the periods' if en else 'لَيْسَتْ خَريطَةً وَلا مِقياسًا لِمُدَدِ الفَتْرَتَيْنِ',27)
 return s,'Time, not geography' if en else 'الزَّمانُ لا المَكانُ'
def waqf_asset(en):
 s=txt(800,45,'An illustrative agricultural endowment' if en else 'مِثالٌ تَوْضيحِيٌّ لِوَقْفٍ زِراعِيٍّ',42)
 s+=card(80,110,660,480,GREEN)+card(890,110,620,480,BLUE)
 s+=txt(410,180,'Asset retained' if en else 'أَصْلٌ مَحْبوسٌ',39,GREEN)
 s+='<path d="M150 460L250 335 610 335 685 460Z" fill="#DEBF89" stroke="#8E7048" stroke-width="4"/>'
 for x in [255,350,445,540]:
  s+=line(x,425,x,290,GREEN)
  s+=f'<path d="M{x} 355q-45-55-55-12q35 18 55 12M{x} 325q45-55 55-12q-35 18-55 12" fill="#80AD7A"/>'
  s+=f'<ellipse cx="{x}" cy="280" rx="13" ry="38" fill="#D7A33B"/>'
 s+=txt(410,545,'The land remains endowed' if en else 'الأَرْضُ تَبْقى وَقْفًا',31,GREEN)
 s+=line(755,345,875,345,BLUE)+'<path d="M850 325l25 20-25 20" stroke="#306D9D" stroke-width="5" fill="none"/>'
 s+=txt(1200,180,'Benefit given' if en else 'مَنْفَعَةٌ مُسَبَّلَةٌ',39,BLUE)
 for i in range(3):
  x=1055+i*145;s+=f'<path d="M{x-45} 330h90l-12 100h-66Z" fill="#DDBF8D" stroke="#8E7048" stroke-width="3"/>'
  for j in range(3):s+=f'<ellipse cx="{x-24+j*24}" cy="{323-(j%2)*10}" rx="18" ry="12" fill="#D7A33B"/>'
 s+=txt(1200,510,'Produce for charity' if en else 'غَلَّةٌ لِوُجوهِ البِرِّ',33,BLUE)
 s+=txt(800,665,'The asset and its benefit are not the same thing' if en else 'أُمَيِّزُ بَيْنَ الأَصْلِ المَوْقوفِ وَمَنْفَعَتِهِ',34)
 s+=txt(800,720,'A general example, not a portrait of a historical waqf' if en else 'مِثالٌ عامٌّ، وَلَيْسَ تَصْويرًا لِوَقْفٍ تاريخِيٍّ بِعَيْنِهِ',25)
 return s,'The asset stays, its benefit is given' if en else 'يَبْقى الأَصْلُ وَتُبْذَلُ المَنْفَعَةُ'
for track in ['N','NN']:
 for suffix,fn,after in [('T1-L02',hijrah_boundary,'part0'),('T1-L09',waqf_asset,'part0')]:
  GRADE5_SPECS[f'IE-Y10-{track}-{suffix}']=(after,fn)
