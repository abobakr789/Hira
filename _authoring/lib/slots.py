# -*- coding: utf-8 -*-
"""(section, node index) -> field name, for the 30-slide Hiraa SS deck.
'foot' is the repeated footer line; '-' means fixed chrome (never written)."""

T = {
 'cover':    {1:'title',2:'unitref',3:'obj'},
 'retrieve': {7:'hook',8:'foot'},
 'hook':     {3:'scene',9:'hook_ans',10:'foot'},
 'guess':    {4:'guessc0',6:'guessc1',8:'guessc2',10:'guessc3',13:'guess_ans',14:'foot'},
 'predict':  {4:'topic',5:'predict_q',8:'predict_ans',9:'foot'},
 'goal':     {3:'obj',6:'lev0',9:'lev1',12:'lev2',13:'foot'},
 'journey':  {3:'foot'},
 'progress': {5:'lev0',10:'lev1',15:'lev2',19:'foot'},
 'vocab':    {3:'word0',4:'mean0',5:'word1',6:'mean1',7:'word2',8:'mean2',
              9:'word3',10:'mean3',11:'foot'},
 'match':    {3:'word0',4:'word1',5:'word2',6:'word3',
              7:'mean1',8:'mean2',9:'mean3',10:'mean0',13:'match_ans',14:'foot'},
 'wordj':    {2:'jtitle',4:'jmeaning',6:'jex0',8:'jex1',10:'jnot',11:'foot'},
 'learn1':   {3:'learn0',4:'foot'},
 'learn2':   {3:'learn1',4:'foot'},
 'learn3':   {3:'learn2',4:'foot'},
 'learn4':   {3:'learn3',4:'foot'},
 'booktext': {-3:'pagesref',-2:'foot'},   # negative: body/marks vary at the start
 'think':    {3:'think',6:'think_ans',7:'foot'},
 'truefalse':{4:'tf0',7:'tf1',9:'foot'},
 'groups':   {23:'foot'},
 'g1':       {4:'grp0',7:'foot'},
 'g2':       {3:'grp1',6:'foot'},
 'g3':       {4:'grp2',7:'foot'},
 'g4':       {4:'grp3',7:'foot'},
 'models':   {5:'mdl0',8:'mdl1',11:'mdl2',14:'mdl3',15:'foot'},
 'feedback': {12:'foot'},
 'guide':    {4:'guide0',6:'guide1',7:'foot'},
 'watani':   {4:'fact',5:'idn',7:'foot'},
 'quick':    {4:'q0s',5:'q0o0',6:'q0ck',7:'q0o1',8:'q0o2',
              10:'q1s',11:'q1o0',12:'q1ck',13:'q1o1',14:'q1o2',
              16:'q2s',17:'q2o0',18:'q2ck',19:'q2o1',20:'q2o2',
              22:'q3s',23:'q3o0',24:'q3ck',25:'q3o1',26:'q3o2',27:'foot'},
 'progress2':{5:'lev0',10:'lev1',15:'lev2',19:'foot'},
 'exit':     {6:'do0',7:'do1',8:'badge',9:'foot'},
}

# fields derived from others rather than authored
DERIVED = {'q0ck':('q0o0','✓ '), 'q1ck':('q1o0','✓ '),
           'q2ck':('q2o0','✓ '), 'q3ck':('q3o0','✓ ')}
