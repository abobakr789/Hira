#!/usr/bin/env python3
# Re-point cloned Y2-Y4 teacher decks at their own lesson ids (clones carried the Y1 id).
import os
R='/home/claude/hira/resources/ssd/'
Y1={'L01':'f93820c9-5d7a-4161-909d-ab7e204e0351','L02':'533d7f7b-22cd-4ad2-a822-1ed93ae69760','L03':'9a253bfc-fcc6-47df-a809-fde98781c85e','L04':'840eef87-19cb-4517-8aaf-471e1a45cf2e','L05':'fe501f1b-c400-489d-8914-983e016e07a4','L06':'e4408922-9140-4513-94f1-5ac2b2c9d8d0','L07':'657f2735-8a28-4402-9a4a-2de19e900865','L08':'9e4d00c4-808d-4483-b558-238bf470bca4','L09':'e2fef28b-8bed-4bc2-a5e8-5d2cd48beb08','L10':'a596a2f4-6da8-46b9-b295-8f06af5f855c','L11':'0728263b-330b-41f0-9c54-0830605c21d8'}
O={2:'a7902dcb-6498-4613-a8d1-8b774e3581c1 04d77ecd-89c5-4790-9746-dc023a8628e5 70b869dc-c25e-4bf5-8e8d-4baaf3d2b346 e2e6eb9b-25a2-4a05-9e25-34b0e281a2e6 aa0b636b-a71a-4522-a7dc-bae4b798df26 b330afe2-085a-4cef-9d2e-8e00d5c9faff 440a7c84-e581-4c28-bc46-939228a23997 1f8fe77f-885e-40d8-add6-2386de218b2b c85ba3c7-4233-41b9-b3ca-144b4c1d017e f4a4ae25-740f-4c30-8896-ea1d7702b6f1 ace09ff8-c17f-40f2-825b-27850e95494f',
3:'1b785437-413a-45f0-ba90-c84c4eee11a3 166e79a1-2afe-4fde-b27d-988237260155 1b1e2b00-a905-4c09-8571-b59c15cef9b3 468baf2b-9f96-4e28-ba2f-6cca72ff95a5 848e3cb1-ea48-4904-b936-c7e84f2fa8b8 6d69138e-4d51-44fa-ae79-dc0efcac277c ea4eb159-e259-4786-b5b2-34e2b24347de 5f13cbd1-d68c-4ae0-acd3-52de407f5c90 cc480ce1-63a7-45a9-aabc-bf3173348db3 ef6bc04d-b8bc-4562-9f64-183243e6cfbf 463c25d2-056e-47e5-87f9-d1c680342922',
4:'137239cd-f460-4067-ac47-afbdb137068c 01ae59e8-e2ed-4e5c-9153-16cf9c03749f 1886b131-bd0e-4fc2-9eac-d74484e34d44 2672fb33-8c8d-46b6-810b-73494afed6c4 6cc8a60e-514a-46e9-88e4-cdf30345438e 35fbbf51-83c2-499c-815c-f72473a38220 27970247-ea77-4875-94be-a82ef3c9db91 1b3f41e9-2302-4dbe-b746-426cb78930db 6b3967b3-8b11-457a-b11e-1f797716a890 5eb946f9-6d5e-4a47-943f-626df266d3c1 781f661c-5e14-41d4-89a8-2e359afa7dc7'}
IDS={y:dict(zip(sorted(Y1),v.split())) for y,v in O.items()}
n=0
for y in (2,3,4):
    for l in sorted(Y1):
        p=f'{R}SN-Y{y}-T1-{l}/teacher-deck.html'
        s=open(p,encoding='utf-8').read()
        if Y1[l] in s:
            open(p,'w',encoding='utf-8').write(s.replace(Y1[l],IDS[y][l])); n+=1
print('fixed',n)
