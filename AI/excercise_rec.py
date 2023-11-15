import json

data = {
    "excercise" :[
    {
        "_id":{"$oid":"63dadc66522e8233f2084d24"},
        "name":"squat",
        "creatorId":"63d1da36d4792fc5c52045cf",
        "muscle":[],
        "muscleHighlight":["SD"],
        "muscleGroup":["hip","legs"],
        "description":"best lower-body exercise",
        "attachments":[],"__v":{"$numberInt":"0"},"access":"unlisted"
    },
    {
        "_id":{"$oid":"63dc3c8847c48fdc2c20aed9"},
        "name":"incline dumbell curls",
        "creatorId":"63d1da36d4792fc5c52045cf",
        "muscle":[],
        "muscleHighlight":["biceps","forearm","front-deltoids"],
        "muscleGroup":["hip"],"description":"seated, inclined, slow eccentric",
        "attachments":[],"access":"private",
        "__v":{"$numberInt":"0"}
    },
    {
        "_id":{"$oid":"63dc3d2eea446f083ffea3af"},
        "name":"barbell bench press",
        "creatorId":"63d1da36d4792fc5c52045cf",
        "muscle":[],
        "muscleHighlight":["chest","triceps",
        "front-deltoids"],
        "muscleGroup":["chest"],
        "description":"best chest exercise. Make sure bar comes down to lower chest, not upper chest for maximum pec engagement and prevent shoulder injuries","attachments":[],"access":"private","__v":{"$numberInt":"0"},
        "sets":[{"comments":"do 7-10 reps, low weight (30-50% of your max), and good form","type":"warmup",
        "_id":{"$oid":"63ebebf169294b7eed8b95d6"}},{"comments":"5 reps",
        "type":"working",
        "_id":{"$oid":"63ebebf169294b7eed8b95d7"}},
        {"comments":"5 reps","type":"working","_id":{"$oid":"63ebebf169294b7eed8b95d8"}},
        {"comments":"5 reps","type":"working","_id":{"$oid":"63ebebf169294b7eed8b95d9"}},
        {"comments":"5 reps","type":"working","_id":{"$oid":"63ebebf169294b7eed8b95da"}},
        {"comments":"5 reps","type":"working","_id":{"$oid":"63ebebf169294b7eed8b95db"}}]
    },
    {
        "_id":{"$oid":"63dc3d7ba17d61b17470d2cc"},
        "name":"seated rows","creatorId":"63d1da36d4792fc5c52045cf",
        "muscle":[],
        "muscleHighlight":["back-deltoids","obliques","biceps","upper-back","trapezius"],
        "muscleGroup":["back"],"description":"best back exercise, shoulders back, maintain back posture and squeeze shoulder blade together\n",
        "attachments":[],"access":"public",
        "__v":{"$numberInt":"0"},
        "sets":[{"_id":{"$oid":"63f7ebe9c95ea3ffba3c44bb"},
        "type":"working"}]
    },
    {
        "_id":{"$oid":"64137b672e0aa9f864653cc6"},
        "name":"cable row",
        "creatorId":"63d1da36d4792fc5c52045cf",
        "muscle":[],
        "muscleHighlight":["upper-back","lower-back"],
        "muscleGroup":["back"],"description":"Wkvpsjvsvjp",
        "attachments":[],
        "access":"private",
        "sets":[{"type":"working",
        "_id":{"$oid":"64137b672e0aa9f864653cc7"}},
        {"type":"working",
        "_id":{"$oid":"64137b672e0aa9f864653cc8"}}],
        "__v":{"$numberInt":"0"}
    },
    {
        "_id":{"$oid":"63dc3d8ba17d61b17470d2d0"},
        "name":"pull ups",
        "creatorId":"63d1da36d4792fc5c52045cf",
        "muscle":[],
        "muscleHighlight":["upper-back","trapezius","back-deltoids","biceps"],
        "muscleGroup":["back"],"description":"target muscles in the upper back, lead back to maintian optimal angle for engaging latissimus dorsi during contraction\n",
        "attachments":[],"access":"private",
        "__v":{"$numberInt":"0"}
    }
    ]
}


import difflib 

ref = ["upper-back","trapezius"]
Max = 0
rec = ''

for item in data["excercise"]:
    sm=difflib.SequenceMatcher(None,ref,item['muscleHighlight'])
    val = sm.ratio()
    if val > Max:
        rec = item['name']
        
print(rec)

    









