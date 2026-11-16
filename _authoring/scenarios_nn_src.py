# «What would you do?» — non-native track (English). Each situation mirrors the native-track one
# (scenarios_src.py) and its right answer comes from the NN lesson's own "do" list or idea.
# Key: native code -> (NN code, [(situation, [(text, ok, feedback), ...]), ...])
# Evidence is attached at insert time: the lesson's first verified hadith (English translation,
# else Arabic text), otherwise the NN lesson idea. No Qur'anic text.
# Skipped (no matching NN lesson): Y2-N-T2-L10, Y3-N-T1-L08, Y3-N-T3-L08.
S = {
"Y1-N-T1-L03": ("Y1-NN-T1-L03", [("You broke a cup by accident, and your mum asks: who broke it?", [
  ("I tell the truth: I broke it by mistake, and I say sorry.", 1, "Well done! A truthful person tells the truth even after a mistake."),
  ("I say: my brother broke it.", 0, "That is a lie, and it is unfair to your brother."),
  ("I keep quiet and hide the pieces under the table.", 0, "Hiding it does not fix it. Telling the truth is better.")])]),
"Y1-N-T1-L11": ("Y1-NN-T1-L11", [("You are making wudu, and the tap is running very fast.", [
  ("I use only the water I need and do not waste it.", 1, "Right! We save water, even in wudu."),
  ("I leave the tap running while I play.", 0, "That wastes the blessing of water."),
  ("I wash each part ten times to be extra clean.", 0, "Extra washing is waste. Wudu has set steps.")])]),
"Y1-N-T1-L12": ("Y1-NN-T1-L12", [("You see a thirsty cat on a hot day.", [
  ("I put some water in a bowl for it to drink.", 1, "Well done! Allah loves kindness to animals."),
  ("I throw a stone so it goes away.", 0, "That hurts a weak creature."),
  ("I leave it and say: it is not my cat.", 0, "A little water would help it.")])]),
"Y1-N-T2-L04": ("Y1-NN-T2-L04", [("Your classmate falls in the playground and hurts his knee.", [
  ("I help him up and call the teacher.", 1, "Well done! Allah helps those who help others."),
  ("I laugh at him with the other children.", 0, "Laughing makes him sadder and hurts more."),
  ("I keep playing and do not look at him.", 0, "Your classmate needs you now.")])]),
"Y1-N-T2-L05": ("Y1-NN-T2-L05", [("Your grandma asks you for a glass of water while you are watching a programme.", [
  ("I get up straight away and bring her the water.", 1, "Well done! We help our grandparents when they ask."),
  ("I say: wait until my programme ends.", 0, "Grandma's request matters more than the programme."),
  ("I pretend I did not hear her.", 0, "That does not please Allah or your grandma.")])]),
"Y1-N-T2-L10": ("Y1-NN-T2-L11", [("You bump into a classmate by mistake in the line.", [
  ("I say: sorry, I didn't mean it.", 1, "Well done! Saying sorry is part of good character."),
  ("I say: you were standing in my way!", 0, "That makes the problem bigger."),
  ("I walk on as if nothing happened.", 0, "A kind word puts things right.")])]),
"Y1-N-T3-L04": ("Y1-NN-T3-L04", [("Your mum gives you food you do not like very much.", [
  ("I say Bismillah, eat what I can and do not criticise the food.", 1, "Well done! We never find fault with food."),
  ("I say: this food is horrible!", 0, "Criticising food upsets the person who made it."),
  ("I throw the food in the bin.", 0, "Food is a blessing we do not throw away.")])]),
"Y1-N-T3-L05": ("Y1-NN-T3-L05", [("Your little brother is crying because he fell over.", [
  ("I hug him, help him and calm him down.", 1, "Well done! Whoever shows mercy is shown mercy."),
  ("I say: be quiet, you are annoying.", 0, "A little child needs mercy, not scolding."),
  ("I laugh at him.", 0, "Laughing at him hurts him.")])]),
"Y1-N-T3-L06": ("Y1-NN-T3-L07", [("Your friend took your pencil without asking, then said «Sorry».", [
  ("I forgive him and say: that's okay.", 1, "Well done! Forgiving is part of a Muslim's character."),
  ("I take his pencil too, to get him back.", 0, "Getting back at him does not fix the mistake."),
  ("I never talk to him again.", 0, "He said sorry. Forgiving is better.")])]),
"Y2-N-T1-L05": ("Y2-NN-T1-L05", [("Your friend got a star from the teacher, and you did not.", [
  ("I am happy for him, congratulate him and work hard to get a star too.", 1, "Well done! A believer loves for his brother what he loves for himself."),
  ("I get angry and say: he doesn't deserve it.", 0, "That is envy, and it tires the heart."),
  ("I hide his star from him.", 0, "That hurts your friend.")])]),
"Y2-N-T1-L08": ("Y2-NN-T1-L08", [("Your mum is tired, and there are lots of dishes after dinner.", [
  ("I help her clear the dishes from the table.", 1, "Well done! The Prophet ﷺ helped his family at home."),
  ("I go and play; that is grown-ups' work.", 0, "Helping the family is honourable work for everyone at home."),
  ("I complain about all the dishes.", 0, "Complaining does not help your mum.")])]),
"Y2-N-T2-L05": ("Y2-NN-T2-L05", [("You borrowed your friend's book, and you must return it tomorrow.", [
  ("I keep it clean and return it on time.", 1, "Well done! That is keeping a trust."),
  ("I draw in it a little; it is an old book.", 0, "The book is a trust; we do not spoil it."),
  ("I keep it as long as my friend doesn't ask for it.", 0, "We return what we borrow on time.")])]),
"Y2-N-T2-L11": ("Y2-NN-T2-L11", [("You sit down to eat and you are very hungry.", [
  ("I say Bismillah and eat with my right hand from what is in front of me.", 1, "Well done! These are the manners of eating."),
  ("I eat quickly from the middle of the plate.", 0, "We eat calmly, from what is in front of us."),
  ("I eat with my left hand because my right is a bit dirty.", 0, "We wash our hands and eat with the right.")])]),
"Y2-N-T3-L02": ("Y2-NN-T3-L02", [("You and your friend are with a third classmate, and you want to tell your friend a secret.", [
  ("I wait until we are alone and do not whisper in front of my classmate.", 1, "Well done! Whispering in front of a third person upsets them."),
  ("I whisper in my friend's ear in front of him.", 0, "Your classmate may think you are talking about him."),
  ("We laugh and look at our classmate.", 0, "That hurts his feelings.")])]),
"Y2-N-T3-L05": ("Y2-NN-T3-L05", [("Your classmate is speaking in the lesson, and you want to give your opinion.", [
  ("I wait until he finishes, then raise my hand.", 1, "Well done! We do not interrupt someone who is speaking."),
  ("I interrupt and speak louder.", 0, "Interrupting does not respect others."),
  ("I tell him: you are wrong, be quiet.", 0, "We value our classmates' opinions.")])]),
"Y2-N-T3-L10": ("Y2-NN-T3-L10", [("Your elderly neighbour is carrying heavy bags.", [
  ("I hurry to help him carry them to his house.", 1, "Well done! We are good to our neighbours."),
  ("I look at him and carry on walking.", 0, "Your neighbour needs your help."),
  ("I say: he should have carried less.", 0, "That does not help him at all.")])]),
"Y3-N-T1-L01": ("Y3-NN-T1-L01", [("Your mum calls you while you are playing your favourite game.", [
  ("I stop playing and answer her straight away.", 1, "Well done! Kindness to parents means obeying them quickly."),
  ("I say: in a minute, and carry on for an hour.", 0, "Obeying your mum comes before playing."),
  ("I raise my voice: why now?!", 0, "Raising your voice at parents is not kindness.")])]),
"Y3-N-T2-L01": ("Y3-NN-T2-L01", [("You want to visit your friend after Asr.", [
  ("I ask permission and agree on a time before I go.", 1, "Well done! Asking permission is a manner of visiting."),
  ("I turn up suddenly and bang on the door.", 0, "A visit without a set time may disturb the family."),
  ("I stay at his house until night.", 0, "We do not stay too long.")])]),
"Y3-N-T2-L06": ("Y3-NN-T2-L06", [("A classmate took your rubber without asking, then said sorry.", [
  ("I forgive him and accept his apology.", 1, "Well done! Forgiving is a believer's manner."),
  ("I complain about him to the whole class.", 0, "He said sorry. Forgiving is better."),
  ("I take his rubber to punish him.", 0, "We do not answer a wrong with a wrong.")])]),
"Y3-N-T2-L10": ("Y3-NN-T2-L10", [("You broke your brother's toy, and your dad asks what happened.", [
  ("I tell the truth, even if I get into trouble.", 1, "Well done! Truthfulness is the way of goodness."),
  ("I say: it broke by itself.", 0, "That is a lie, and lying is the way of wrong."),
  ("I say it as a joke and forget about it.", 0, "We never lie, even as a joke.")])]),
"Y3-N-T3-L06": ("Y3-NN-T3-L06", [("Your grandmother lives far away, and you haven't seen her for a while.", [
  ("I ask my parents if we can visit her or call her.", 1, "Well done! Keeping family ties pleases Allah and your relatives."),
  ("I wait for her to call first.", 0, "We take the first step in keeping ties."),
  ("I say: I don't have time.", 0, "Visiting relatives is one of the best deeds.")])]),
"Y3-N-T3-L09": ("Y3-NN-T3-L09", [("Your neighbour's baby is asleep, and you want to play football near their window.", [
  ("I play further away and quietly so I don't disturb them.", 1, "Well done! We do not disturb our neighbours with noise."),
  ("I play and shout as much as I like.", 0, "Noise harms your neighbour."),
  ("I kick the ball against their wall.", 0, "That harms your neighbour.")])]),
"Y4-N-T1-L01": ("Y4-NN-T1-L01", [("You want to go into your parents' room, and the door is closed.", [
  ("I knock and ask permission before going in.", 1, "Well done! We ask permission before entering any room."),
  ("I open the door and walk straight in.", 0, "Going in without permission is not good manners."),
  ("I look through the keyhole first.", 0, "Looking without permission goes against asking permission.")])]),
"Y4-N-T1-L09": ("Y4-NN-T1-L09", [("You get a message: «School is closed tomorrow!» and you don't know who wrote it.", [
  ("I check with the school or my parents before I share it.", 1, "Well done! We check news before passing it on."),
  ("I send it to all my friends straight away.", 0, "It may be a rumour that harms others."),
  ("I believe it and don't go to school.", 0, "We do not believe everything we hear before checking.")])]),
"Y4-N-T1-L10": ("Y4-NN-T1-L10", [("The adhan is called while you are in the middle of your favourite game.", [
  ("I stop the game and get ready to pray.", 1, "Well done! We pray on time; prayer is the pillar of the religion."),
  ("I finish until I win, then pray late.", 0, "We do not delay prayer for a game."),
  ("I pray very fast so I can go back to playing.", 0, "We pray with focus and calm.")])]),
"Y4-N-T2-L03": ("Y4-NN-T2-L03", [("You are buying food at the canteen, and the worker hands it to you.", [
  ("I smile and thank him with a kind word.", 1, "Well done! We respect workers and thank them."),
  ("I take the food without looking at him.", 0, "A kind word is charity."),
  ("I shout at him because he was a bit slow.", 0, "We treat everyone well.")])]),
"Y4-N-T2-L10": ("Y4-NN-T2-L10", [("You said something unkind about your friend.", [
  ("I apologise to him and follow my mistake with a good deed.", 1, "Well done! A good deed after a mistake wipes it out."),
  ("I wait until he forgets.", 0, "Apologising and doing good mend the heart."),
  ("I say: he started it.", 0, "We treat people with good character.")])]),
"Y4-N-T3-L03": ("Y4-NN-T3-L03", [("Your little brother loudly asks for help while you are busy.", [
  ("I speak to him calmly: I'll help you in a minute.", 1, "Well done! Gentleness beautifies everything."),
  ("I shout at him: leave me alone!", 0, "Shouting upsets him and solves nothing."),
  ("I push him away.", 0, "We are gentle with little ones.")])]),
"Y4-N-T3-L07": ("Y4-NN-T3-L07", [("Your classmate forgot his lunch, and you have enough for two.", [
  ("I happily share my food with him.", 1, "Well done! Generosity means giving gladly."),
  ("I eat alone; he is the one who forgot.", 0, "A generous Muslim shares what he has."),
  ("I give him some and tell everyone: poor him.", 0, "Giving should not embarrass anyone.")])]),
"Y4-N-T3-L09": ("Y4-NN-T3-L09", [("You left your room with the light and air conditioner on.", [
  ("I go back and switch them off.", 1, "Well done! The environment is our trust and responsibility."),
  ("I leave them on; there's plenty of electricity.", 0, "That is waste that harms the environment."),
  ("I wait for my mum to switch them off.", 0, "Protecting the environment is everyone's job.")])]),
"Y5-N-T1-L02": ("Y5-NN-T1-L02", [("A classmate made a mistake in a match, and you are very angry.", [
  ("I control my tongue and do not insult him.", 1, "Well done! Insults can take away good deeds on the Day of Judgement."),
  ("I insult him; he deserves it.", 0, "Insulting is a wrong that takes from your good deeds."),
  ("I mock him in front of the team.", 0, "Mocking hurts a fellow Muslim.")])]),
"Y5-N-T1-L07": ("Y5-NN-T1-L07", [("The helper in your home has worked hard all day, and you want a glass of juice.", [
  ("I thank her and get the juice myself if I can.", 1, "Well done! We are good to those who work in our home."),
  ("I shout at her to hurry up.", 0, "People differ only in God-consciousness."),
  ("I leave my things everywhere for her to pick up.", 0, "That makes her more tired.")])]),
"Y5-N-T2-L04": ("Y5-NN-T2-L04", [("An elderly man gets on the school bus, and there is no seat for him.", [
  ("I stand and give him my seat.", 1, "Well done! We give our seat to those who need it."),
  ("I stay sitting and look out of the window.", 0, "We respect and help older people."),
  ("I put my bag on the empty seat.", 0, "Seats are for people, not bags.")])]),
"Y5-N-T2-L07": ("Y5-NN-T2-L07", [("You see a hungry cat in the burning sun.", [
  ("I put food and water for it in the shade.", 1, "Well done! A Muslim is merciful to animals."),
  ("I chase it for fun.", 0, "Being cruel to animals is not a Muslim's character."),
  ("I take a photo and walk away.", 0, "You could help it.")])]),
"Y5-N-T2-L08": ("Y5-NN-T2-L08", [("Your little brother broke your toy by mistake.", [
  ("I speak to him gently and teach him to be careful.", 1, "Well done! Gentleness puts things right."),
  ("I shout at him and break his toy.", 0, "Anger does not bring the toy back."),
  ("I complain about him and ask for a hard punishment.", 0, "He broke it by mistake.")])]),
"Y5-N-T3-L02": ("Y5-NN-T3-L02", [("You disagree with your friend, you are right, and the discussion has turned into shouting.", [
  ("I calmly stop arguing.", 1, "Well done! Leaving an argument, even when right, brings great good."),
  ("I keep going until he admits I'm right.", 0, "Arguing spoils friendship."),
  ("I tell him: you don't understand anything.", 0, "That hurts him and makes things worse.")])]),
"Y5-N-T3-L04": ("Y5-NN-T3-L04", [("You see broken glass in the school corridor.", [
  ("I tell the cleaner or a teacher straight away so it is removed.", 1, "Well done! Removing harm from the way is charity."),
  ("I walk past; it's not my business.", 0, "It could cut one of your classmates."),
  ("I kick it to the side and walk on.", 0, "That does not remove the danger.")])]),
"Y5-N-T3-L08": ("Y5-NN-T3-L08", [("You see an older pupil bullying a small child.", [
  ("I tell the teacher on duty straight away.", 1, "Well done! Courage is helping the wronged, wisely."),
  ("I film it and share it.", 0, "Sharing hurts the child even more."),
  ("I laugh along with the older pupil.", 0, "That encourages him to keep doing wrong.")])]),
"Y6-N-T1-L04": ("Y6-NN-T1-L04", [("In a match, a player from the other team insults you.", [
  ("I control my tongue and do not answer an insult with an insult.", 1, "Well done! Insulting a Muslim is never part of team spirit."),
  ("I insult him back even worse.", 0, "Answering insults makes you like him."),
  ("I push him hard.", 0, "Anger is controlled, not let loose.")])]),
"Y6-N-T1-L09": ("Y6-NN-T1-L09", [("You spent three hours on your phone and did not revise your lesson.", [
  ("I take account of myself and plan tomorrow between study, worship and play.", 1, "Well done! We will be asked about our time."),
  ("I say: there's plenty of time, never mind.", 0, "Time is life, and it does not come back."),
  ("I stay up all night to catch up.", 0, "Planning is better than exhausting late nights.")])]),
"Y6-N-T2-L03": ("Y6-NN-T2-L03", [("Your team lost the final after long training.", [
  ("I am patient and say: Alhamdulillah in every situation.", 1, "Well done! A believer is patient in hard times."),
  ("I get angry and leave the team.", 0, "Patience is better than anger."),
  ("I blame my teammates with hurtful words.", 0, "Hurtful blame does not change the result.")])]),
"Y6-N-T2-L08": ("Y6-NN-T2-L08", [("A classmate wronged you yesterday, and today he needs your help with a lesson.", [
  ("I forgive him and help him.", 1, "Well done! Forgiveness makes people love you."),
  ("I refuse and remind him what he did.", 0, "Forgiving is closer to goodness."),
  ("I help him but show off.", 0, "Humility is a quality people love.")])]),
"Y6-N-T3-L03": ("Y6-NN-T3-L03", [("A friend asks you to skip class and go out to the playground.", [
  ("I politely say no and choose friends who encourage me to do good.", 1, "Well done! A good friend benefits you."),
  ("I go with him so he won't be upset.", 0, "Bad company harms you."),
  ("I go, then tell the teacher I was ill.", 0, "That is one wrong on top of another.")])]),
"Y6-N-T3-L06": ("Y6-NN-T3-L06", [("You are brushing your teeth with the tap running the whole time.", [
  ("I turn off the tap until I need it.", 1, "Well done! We save water and electricity."),
  ("I leave it on; there's lots of water.", 0, "Waste harms the earth."),
  ("I turn it up to be quicker.", 0, "That is even more waste.")])]),
"Y7-N-T1-L05": ("Y7-NN-T1-L05", [("You are alone in the classroom, and the answer key is on the teacher's desk.", [
  ("I stay away from it, because Allah sees me.", 1, "Well done! A believer is aware of Allah in private."),
  ("I take a quick look; nobody can see me.", 0, "Allah sees you everywhere."),
  ("I photograph it for my friends.", 0, "That is cheating and harms everyone.")])]),
"Y7-N-T1-L08": ("Y7-NN-T1-L08", [("You wronged a classmate, and you feel your mistake is too big to be forgiven.", [
  ("I ask Allah's forgiveness, apologise to my classmate and never despair of Allah's mercy.", 1, "Well done! The door of repentance is open."),
  ("I say: there's no point, I've done too much wrong.", 0, "Despairing of Allah's mercy does not suit a believer."),
  ("I ignore it until everyone forgets.", 0, "Apologising and seeking forgiveness put the mistake right.")])]),
"Y7-N-T2-L01": ("Y7-NN-T2-L01", [("Your classmates call you a liar about something true you said, and they mock you.", [
  ("I am patient with their hurt and keep doing good.", 1, "Well done! Patience and turning to Allah comfort the heart."),
  ("I mock them back even more.", 0, "Answering hurt with hurt does not prove the truth."),
  ("I stop telling the truth so they won't mock me.", 0, "We do not give up truthfulness because of mockery.")])]),
"Y7-N-T2-L03": ("Y7-NN-T2-L03", [("You received AED 500 as Eid money.", [
  ("I make a budget: some for needs, some for saving, some for charity.", 1, "Well done! That is moderation with money."),
  ("I spend it all in one day.", 0, "That is waste, and nothing is left."),
  ("I hide it all and never spend any of it.", 0, "Islam criticises stinginess as it criticises waste.")])]),
"Y7-N-T2-L10": ("Y7-NN-T2-L10", [("You have a school project you could finish quickly without care.", [
  ("I do it carefully and hope for Allah's reward.", 1, "Well done! Careful work is worship."),
  ("I finish it any old way to get rid of it.", 0, "Doing work well is a believer's quality."),
  ("I copy my classmate's project.", 0, "That is not your work, and there is no honesty in it.")])]),
"Y7-N-T3-L02": ("Y7-NN-T3-L02", [("A pupil in your class has lost his father and comes back to school sad.", [
  ("I am kind to him, sit with him and help him with lessons.", 1, "Well done! Kindness to an orphan has a great reward."),
  ("I avoid him because I don't know what to say.", 0, "Just being with him helps him feel safe."),
  ("I ask him in front of everyone how his father died.", 0, "That makes him sadder.")])]),
"Y7-N-T3-L03": ("Y7-NN-T3-L03", [("Your team won the tournament, and you were the top scorer.", [
  ("I thank my teammates and do not boast.", 1, "Well done! Humility raises a person."),
  ("I say: without me, you would never have won.", 0, "That arrogance spoils the team."),
  ("I mock the losing team.", 0, "Humility is for everyone.")])]),
"Y7-N-T3-L08": ("Y7-NN-T3-L08", [("You walk into a gathering of elders, and a guest comes in after you.", [
  ("I say salam and make room for the newcomer.", 1, "Well done! These are the manners of gatherings."),
  ("I sit at the head of the room and get busy with my phone.", 0, "A gathering has manners and respect for elders."),
  ("I stay seated and ignore the guest.", 0, "We make room for newcomers.")])]),
"Y7-N-T3-L10": ("Y7-NN-T3-L10", [("Lots of food is left over after a party at home.", [
  ("We store it or take it to people in need.", 1, "Well done! We do not waste food."),
  ("We throw it away; we're full.", 0, "Millions go to sleep hungry."),
  ("We leave it until it goes bad, then throw it away.", 0, "That wastes a blessing.")])]),
"Y8-N-T1-L03": ("Y8-NN-T1-L03", [("You join a volunteering campaign, and your friend wants you to post photos of yourself for likes.", [
  ("I renew my intention to do it for Allah, not for people.", 1, "Well done! A deed's value lies in a sincere intention."),
  ("I film myself every moment to become famous.", 0, "Doing it for people loses the reward."),
  ("I only volunteer if I'm filmed.", 0, "Sincerity is the soul of the deed.")])]),
"Y8-N-T1-L05": ("Y8-NN-T1-L05", [("You are selling an item at the school charity sale, and it has a small fault.", [
  ("I tell the buyer about the fault.", 1, "Well done! Honesty in selling and seeking what is lawful."),
  ("I hide the fault so it sells quickly.", 0, "That is cheating, and cheating is not a Muslim's character."),
  ("I raise the price because it's the last one.", 0, "Honesty matters more than profit.")])]),
"Y8-N-T1-L09": ("Y8-NN-T1-L09", [("You failed a test even though you worked hard.", [
  ("I accept what Allah decreed, review my mistakes and work harder.", 1, "Well done! We take the means, then trust Allah."),
  ("I say: it's my fate, so I won't study any more.", 0, "Believing in decree does not mean giving up work."),
  ("I blame the teacher and the test.", 0, "A believer reviews himself and takes the means.")])]),
"Y8-N-T2-L10": ("Y8-NN-T2-L10", [("Your classmates plan to hide a pupil's bag «as a joke» to frighten him.", [
  ("I refuse to join in and advise them not to scare him.", 1, "Well done! Frightening a Muslim is not allowed, even as a joke."),
  ("I join in; it's just a joke.", 0, "A joke that frightens is not a joke."),
  ("I film it to share.", 0, "Sharing makes the harm worse.")])]),
"Y8-N-T2-L11": ("Y8-NN-T2-L11", [("You come home from school tired, and your little brother wants you to play with him.", [
  ("I play with him gently for a while and show him love.", 1, "Well done! The Prophet ﷺ was kind to his family."),
  ("I shout at him: leave me alone!", 0, "Kindness starts at home."),
  ("I shut the door in his face.", 0, "Family deserve our best character most.")])]),
"Y8-N-T3-L02": ("Y8-NN-T3-L02", [("Your friends laugh at a teacher after he leaves and want you to imitate him with them.", [
  ("I politely say «no» and do not copy them in what is wrong.", 1, "Well done! A believer has an independent character."),
  ("I imitate him so they won't say I'm different.", 0, "Copying others in wrong is not following good."),
  ("I film them and share the clip.", 0, "That spreads the disrespect.")])]),
"Y8-N-T3-L07": ("Y8-NN-T3-L07", [("There are relatives you have not visited for a long time because of an old disagreement.", [
  ("I take the first step and call or visit them.", 1, "Well done! We keep ties even if others cut us off."),
  ("I wait for them to make the first move.", 0, "Keeping ties does not wait."),
  ("I speak badly of them to others.", 0, "That widens the gap.")])]),
"Y9-N-T1-L01": ("Y9-NN-T1-L01", [("A message arrives in the family group: «Urgent! Serious news about someone you know».", [
  ("I check the news before sharing it, and I don't share it if it isn't true.", 1, "Well done! Checking protects people from injustice."),
  ("I forward it straight away; everyone is sharing it.", 0, "Being widely shared does not make news true."),
  ("I add a comment to make it more exciting.", 0, "That doubles the harm.")])]),
"Y9-N-T1-L04": ("Y9-NN-T1-L04", [("You notice a mistake in a classmate's work before he presents it to the class.", [
  ("I advise him privately and gently.", 1, "Well done! Private advice is more readily accepted."),
  ("I point it out in front of everyone so they can learn.", 0, "Advising in public embarrasses him."),
  ("I say nothing and let him make the mistake.", 0, "Sincere advice is part of the religion.")])]),
"Y9-N-T1-L06": ("Y9-NN-T1-L06", [("A clip mocking a classmate's accent is going round the class.", [
  ("I do not join in the mockery, and I stand up for my classmate.", 1, "Well done! Mocking people is forbidden."),
  ("I laugh with everyone; it's just a clip.", 0, "Laughing here hurts your classmate."),
  ("I share the clip in another group.", 0, "Sharing spreads the harm.")])]),
"Y9-N-T1-L07": ("Y9-NN-T1-L07", [("You find a product at half price in an unknown shop, and you don't know if it is genuine.", [
  ("I leave what makes me doubt and ask before buying.", 1, "Well done! We leave what is doubtful and ask people of knowledge."),
  ("I buy it straight away; the price is tempting.", 0, "A low price does not remove the doubt."),
  ("I buy it and sell it to my friends for more.", 0, "That doubles the doubt.")])]),
"Y9-N-T2-L06": ("Y9-NN-T2-L06", [("You get a message: «You won a prize! Send your father's card number».", [
  ("I don't click it, and I tell my parents so we can report it.", 1, "Well done! Everyone shares responsibility for the community's safety."),
  ("I send the number; the prize is big.", 0, "This is a well-known scam."),
  ("I forward it to my friends to try.", 0, "That spreads the danger.")])]),
"Y9-N-T2-L10": ("Y9-NN-T2-L10", [("A classmate posts online that he feels nobody needs him.", [
  ("I talk to him, listen, and tell a trusted adult so he gets help.", 1, "Well done! Every life is precious to Allah, and supporting a sad friend matters."),
  ("I scroll past and write nothing.", 0, "He may need a word from you."),
  ("I write a sarcastic comment.", 0, "That hurts him at a hard time.")])]),
"Y9-N-T3-L03": ("Y9-NN-T3-L03", [("Your family wants to park in front of the neighbours' gate because it is closer.", [
  ("I suggest parking where we don't block their way.", 1, "Well done! We do not harm or inconvenience our neighbours."),
  ("I say: the street is for everyone, no problem.", 0, "Your freedom ends where harm to others begins."),
  ("We park there and stay away a long time.", 0, "That makes the harm to the neighbours worse.")])]),
"Y9-N-T3-L05": ("Y9-NN-T3-L05", [("In a class discussion, a classmate gives a view you disagree with.", [
  ("I listen until he finishes, then give my view politely.", 1, "Well done! Polite dialogue respects difference."),
  ("I interrupt: your view is totally wrong!", 0, "Interrupting loses the discussion."),
  ("I mock his view to make the class laugh.", 0, "Mockery kills dialogue.")])]),
"Y9-N-T3-L08": ("Y9-NN-T3-L08", [("Your classmate is ill and has been off school for a week.", [
  ("I visit or call him and send him the lessons.", 1, "Well done! Visiting the sick is a Muslim's right."),
  ("I wait until he comes back.", 0, "Asking about him cheers him up while he is ill."),
  ("I talk about his absence in front of classmates.", 0, "That does not help him.")])]),
"Y9-N-T3-L09": ("Y9-NN-T3-L09", [("In a long queue at a restaurant, you see a chance to push in front.", [
  ("I respect the queue and wait.", 1, "Well done! Respecting the queue is a manner of public places."),
  ("I push in quickly before anyone notices.", 0, "That takes the right of those ahead of you."),
  ("I ask my friend at the front to buy for me.", 0, "That is getting round the queue.")])]),
"Y9-N-T3-L11": ("Y9-NN-T3-L11", [("A dangerous online «challenge» is trending, and your friends are copying it.", [
  ("I think before copying and refuse what harms me.", 1, "Well done! Islam criticises blind imitation."),
  ("I copy it so I don't look different.", 0, "Your values matter more than fitting in."),
  ("I try it just once.", 0, "Danger is not safe just because it is once.")])]),
"Y10-N-T1-L01": ("Y10-NN-T1-L01", [("You have a big project tomorrow, and you told your friends: I will finish it.", [
  ("I say: I will finish it, in sha' Allah, and do it well.", 1, "Well done! We say in sha' Allah before any future plan."),
  ("I say: I will definitely finish it; I need nothing.", 0, "The future is in Allah's hands."),
  ("I take on many projects and do none of them well.", 0, "What counts is doing deeds well, not only many.")])]),
"Y10-N-T1-L04": ("Y10-NN-T1-L04", [("Your friend prays slightly differently from you because he follows another school of fiqh.", [
  ("I respect scholars' differences and ask qualified people if I want to understand.", 1, "Well done! Differences between schools are breadth and respect."),
  ("I tell him: your prayer is wrong.", 0, "We do not judge without knowledge."),
  ("I mock his way in front of others.", 0, "Mockery is not the manner of disagreement.")])]),
"Y10-N-T2-L08": ("Y10-NN-T2-L08", [("Inappropriate content appears while you are browsing, though you didn't search for it.", [
  ("I lower my gaze, close it at once and choose what I watch carefully.", 1, "Well done! Lowering the gaze protects the heart."),
  ("I keep watching since I didn't search for it.", 0, "Carrying on is a choice; lowering the gaze is a duty."),
  ("I send it to my friends.", 0, "That spreads the harm.")])]),
"Y10-N-T2-L10": ("Y10-NN-T2-L10", [("You and your brother are arguing over the remote, and voices are rising.", [
  ("I solve it calmly and we agree on turns.", 1, "Well done! Calm keeps love in the home."),
  ("I snatch it from him.", 0, "Force makes the argument worse."),
  ("I loudly complain to my parents.", 0, "A calm solution comes before complaining.")])]),
"Y10-N-T3-L03": ("Y10-NN-T3-L03", [("Your friend reads his «horoscope for today» before deciding anything.", [
  ("I gently advise him not to believe horoscopes; only Allah knows the unseen.", 1, "Well done! We do not believe horoscopes or fortune-tellers."),
  ("I read mine with him for fun and act on it.", 0, "Acting on horoscopes is believing them."),
  ("I say: maybe they're right sometimes.", 0, "The unseen belongs to Allah alone.")])]),
"Y10-N-T3-L04": ("Y10-NN-T3-L04", [("The light is red and the street is completely empty, and you are on your bike.", [
  ("I wait until it turns green.", 1, "Well done! We follow the state's laws even when no one sees."),
  ("I cross quickly; nobody is here.", 0, "The law protects everyone at all times."),
  ("I cross and say: the law is only for cars.", 0, "The law applies to everyone.")])]),
"Y10-N-T3-L08": ("Y10-NN-T3-L08", [("An unknown account keeps messaging you, urging you to travel and join «jihad».", [
  ("I don't respond, and I tell my parents so it can be reported.", 1, "Well done! We are wary of extremist ideas; war is declared only by the ruler."),
  ("I chat with it secretly to understand its ideas.", 0, "These accounts lure young people in."),
  ("I forward its messages to my friends.", 0, "That spreads the danger.")])]),
"Y11-N-T1-L04": ("Y11-NN-T1-L04", [("You are buying a used phone from someone, and the agreement is written down.", [
  ("I read the terms before accepting and keep to what we agreed.", 1, "Well done! We keep our contracts and read their terms."),
  ("I sign without reading; it's simple.", 0, "Not knowing the terms can lose you your rights."),
  ("I agree, then back out because I found it cheaper.", 0, "Keeping contracts is a duty.")])]),
"Y11-N-T1-L08": ("Y11-NN-T1-L08", [("A discussion in the class group turns into hurtful language.", [
  ("I listen before replying and discuss calmly.", 1, "Well done! Calm dialogue rescues a discussion."),
  ("I reply with even harsher words.", 0, "That makes the quarrel worse."),
  ("I copy the messages and post them outside the group.", 0, "That spreads the disagreement.")])]),
"Y11-N-T2-L02": ("Y11-NN-T2-L02", [("A post shares a moving «hadith» with the words: «Share it for reward».", [
  ("I check the hadith's grading with a trusted source before sharing.", 1, "Well done! We do not share unknown hadiths."),
  ("I share it straight away for the reward.", 0, "You may attribute to the Prophet ﷺ what he never said."),
  ("I share it and add some words of my own.", 0, "That changes a text attributed to the Prophet ﷺ.")])]),
"Y11-N-T2-L03": ("Y11-NN-T2-L03", [("Your family is choosing a holiday destination, and your father asks your opinion.", [
  ("I share my view politely and respect what the family decides.", 1, "Well done! Taking part in discussion builds the family."),
  ("I say: I don't care, you decide.", 0, "Your view is part of the family discussion."),
  ("I insist on my view and get angry if it isn't taken.", 0, "Dialogue is not insisting and anger.")])]),
"Y11-N-T3-L02": ("Y11-NN-T3-L02", [("You are visiting a friend, it is getting late, and his family want to rest.", [
  ("I ask to leave and go; I don't overstay.", 1, "Well done! It is good manners not to burden the household."),
  ("I stay; they haven't asked me to leave.", 0, "Shyness may stop them from asking."),
  ("I ask for more food and carry on.", 0, "That tires the household even more.")])]),
"Y11-N-T3-L03": ("Y11-NN-T3-L03", [("You are writing feedback on the work of a classmate you don't like.", [
  ("I am fair and mention his strengths and mistakes justly.", 1, "Well done! Fairness is a duty, even with those we dislike."),
  ("I mention only his mistakes.", 0, "Dislike does not permit injustice."),
  ("I give him the lowest mark.", 0, "That is unjust.")])]),
"Y11-N-T3-L06": ("Y11-NN-T3-L06", [("A photo of a classmate is posted without her permission, and mocking comments pour in.", [
  ("I don't comment or share, and I report the post.", 1, "Well done! We harm no one by word or deed."),
  ("I write a funny comment.", 0, "That adds to the harm."),
  ("I save the photo and send it on.", 0, "That violates her privacy.")])]),
"Y11-N-T3-L08": ("Y11-NN-T3-L08", [("An advert says: «95% of doctors recommend this product!»", [
  ("I ask for the evidence: which doctors? where is the study?", 1, "Well done! A critical mind asks for evidence."),
  ("I buy it at once; doctors recommend it.", 0, "A number alone is not evidence."),
  ("I share the advert with my family.", 0, "We analyse news before believing it.")])]),
"Y12-N-T1-L01": ("Y12-NN-T1-L01", [("A photo that looks fake is spreading about someone you know, with a serious accusation.", [
  ("I don't share it or speak about his honour without proof.", 1, "Well done! Protecting people's honour is one of the great aims."),
  ("I share it with «if it's true».", 0, "Those words do not prevent injustice."),
  ("I comment with what I heard about him before.", 0, "That adds accusation without proof.")])]),
"Y12-N-T1-L08": ("Y12-NN-T1-L08", [("You see an exposed electric cable in the school playground.", [
  ("I report it to the school at once and warn my classmates.", 1, "Well done! Whoever sees a danger shares responsibility for it."),
  ("I say: it's not my responsibility.", 0, "Seeing the danger makes you responsible."),
  ("I wait for someone else to notice.", 0, "Delay could cause an accident.")])]),
"Y12-N-T2-L01": ("Y12-NN-T2-L01", [("Your brother left his phone unlocked on the table.", [
  ("I don't open his messages; I respect his privacy.", 1, "Well done! Asking permission protects privacy."),
  ("I read his messages since it's unlocked.", 0, "That is spying on his privacy."),
  ("I screenshot his messages to tease him.", 0, "That violates his privacy.")])]),
"Y12-N-T2-L02": ("Y12-NN-T2-L02", [("Your friend feels very anxious before every exam and is embarrassed to ask for help.", [
  ("I encourage him to seek help from the counsellor or a specialist.", 1, "Well done! Seeking treatment is taking the means."),
  ("I tell him: this is weak faith.", 0, "Seeking treatment does not contradict faith."),
  ("I advise him to keep it hidden.", 0, "Hiding it may make it worse.")])]),
"Y12-N-T2-L03": ("Y12-NN-T2-L03", [("You are selling your used things online.", [
  ("I describe the item honestly and mention its faults.", 1, "Well done! Honesty in selling brings blessing."),
  ("I raise the price, then advertise a «big discount».", 0, "That deceives the buyer."),
  ("I post photos of a nicer item.", 0, "That is cheating, however small.")])]),
"Y12-N-T2-L07": ("Y12-NN-T2-L07", [("You have homework due tomorrow and an invitation to go out with friends tonight.", [
  ("I finish the homework first, then go if there's time.", 1, "Well done! We put duties before entertainment."),
  ("I go out and leave the homework for the morning.", 0, "Putting it off loses the duty."),
  ("I copy the homework from a classmate so I can go.", 0, "That is cheating and betrays the trust.")])]),
"Y12-N-T3-L04": ("Y12-NN-T3-L04", [("Your friend had a frightening dream and decided to cancel her trip.", [
  ("I advise her to seek refuge in Allah and not base her decision on the dream.", 1, "Well done! We seek refuge in Allah after a bad dream."),
  ("I look up its meaning online for her.", 0, "Online interpretations are no basis for decisions."),
  ("I tell everyone about her dream.", 0, "A bad dream is not told to others.")])]),
"Y12-N-T3-L08": ("Y12-NN-T3-L08", [("A fatwa spreading on social media contradicts what you learned from official bodies.", [
  ("I ask trusted scholars and refer to the official fatwa centre.", 1, "Well done! We take religion from trusted people of knowledge."),
  ("I follow it because it's more popular.", 0, "Popularity is not evidence."),
  ("I pick whatever is easiest for me without asking.", 0, "Chasing easy options without knowledge is not a sound way.")])]),
}

# Added to give Y3-NN-T1 two situations (its native counterpart Y3-N-T1-L08 has no NN match):
EXTRA = {'Y3-NN-T1-L06': [('A new pupil joins your class and looks shy.', [('I meet him with a smile and invite him to play.', 1, 'Well done! Good character is the heaviest thing on the scale.'), ('I ignore him; I already have friends.', 0, 'A smile costs nothing and means a lot.'), ('I whisper about him with my friends.', 0, 'That hurts his feelings.')])], 'Y3-NN-T1-L10': [("Reading Qur'an is hard for you today, and you keep stumbling.", [('I keep reading slowly and do not give up.', 1, 'Well done! The one who stumbles but keeps going has a double reward.'), ('I close the mushaf and stop practising.', 0, 'Giving up loses the reward of trying.'), ('I pretend to read so no one notices.', 0, 'Honest practice is how we improve.')])]}
