# Normalise the Saheeh International lines in Hiraa's Qur'an data to the wording of the Pearson 4IS1 Appendix
# (no macrons, British spelling, no [i.e. ...] glosses), and check each verse against official.json.
import re, json, os
OFF = json.load(open(os.path.join(os.path.dirname(__file__), "official.json")))
MAC = str.maketrans({"ā": "a", "ī": "i", "ū": "u", "Ā": "A", "Ī": "I", "Ū": "U", "ḥ": "h", "Ḥ": "H", "ṣ": "s", "Ṣ": "S", "ḍ": "d", "Ḍ": "D", "ṭ": "t", "Ṭ": "T", "ẓ": "z", "Ẓ": "Z", "ʿ": "'", "ʾ": "'", "’": "'"})
BRIT = [("favor", "favour"), ("tranquility", "tranquillity"), ("traveler", "traveller"), ("honor", "honour")]
def pe(t):
    t = t.translate(MAC)
    t = re.sub(r"\s*\[i\.e\.,?[^\]]*\]", "", t)
    for a, b in BRIT: t = re.sub(r"\b" + a, b, t)
    t = t.replace(" - ", " – ")
    return re.sub(r"\s+", " ", t).strip()
def official(num):
    return " ".join(v[1] for k, v in OFF.items() if re.sub(r"[ab]$", "", k) == num)
# Verses whose Pearson wording differs beyond spelling: taken verbatim from the specification, Appendix 4.
OVR = {
 ("1.1", 3): 'And [remember] when the Prophet (pbuh) confided to one of His wives a statement; and when she informed [another] of it and Allah showed it to him, he made known part of it and ignored a part. And when he informed her about it, she said, "Who told you this?" He said, "I was informed by the Knowing, the Acquainted."',
 ("1.2", 1): "Indeed, We sent the Qur'an down during the Night of Decree.",
 ("2.6", 97): "Say, \"Whoever is an enemy to Gabriel – it is [none but] he who has brought the Qur'an down upon your heart, [O Muhammad], by permission of Allah, confirming that which was before it and as guidance and good tidings for the believers.\"",
 ("2.8", 13): "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.",
 ("3.2", 11): "But when they saw a transaction or a diversion, [O Muhammad (pbuh)], they rushed to it and left you standing. Say, \"What is with Allah is better than diversion and than a transaction, and Allah is the best of providers.\"",
 ("3.3", 184): "[Fasting for] a limited number of days. So whoever among you is ill or on a journey [during them] – then an equal number of days [are to be made up]. And upon those who are able [to fast, but with hardship] – a ransom [as substitute] of feeding a poor person [each day]. And whoever volunteers excess – it is better for him. But to fast is best for you, if you only knew.",
 ("3.3", 185): "The month of Ramadan [is that] in which was revealed the Qur'an, a guidance for the people and clear proofs of guidance and criterion. So whoever sights [the new moon of] the month, let him fast it; and whoever is ill or on a journey – then an equal number of other days. Allah intends for you ease and does not intend for you hardship and [wants] for you to complete the period and to glorify Allah for that [to] which He has guided you; and perhaps you will be grateful.",
 ("3.4", 60): "Zakah expenditures are only for the poor and for the needy and for those employed to collect [Zakah] and for bringing hearts together [for Islam] and for freeing captives [or slaves] and for those in debt and for the cause of Allah and for the [stranded] traveller – an obligation [imposed] by Allah. And Allah is Knowing and Wise.",
}
def pearson_lines(num, lines): return [(k, OVR.get((num, k)) or pe(t)) for k, t in lines]
