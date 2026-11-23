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
 if code not in SPECS or 'id="ie-visual"' in h:return h
 s,after=section(code,h);m=re.search(r'<section class="sl" id="'+after+r'"[^>]*>.*?</section>',h,re.S)
 return h[:m.end()]+s+h[m.end():]
