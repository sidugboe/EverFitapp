# Tapable API

## Table of Contents

- [User](#User)
- [Messages](#Messages)
- [Profile](#Profile)
- [Check In](#Check-in)
- [Exercise Templates](#Exercise-Templates)
- [Exercise Logs](#Exercise-Logs)
- [Workout Templates](#Workout-Templates)
- [Routine](#Routine)
- [Public Templates](#Public)
- [Post](#Post)
- [Save](#Save)
- [Upload](#Upload)


# User

### GET&emsp;`/user/whoami`:

Get current user's info

#### **Returns**

```javascript
{
    _id: "String",
    "name": "String",
    "username": "String",
    "email": "String",
    "visibility": "String", // ["public", "private"]
    "followers": [
        "String" // userId's
    ],
    "following": [
        "String" // userId's
    ]
}
```

---

### GET&emsp;`/user/search/{username|name}`:

Search for a user by username or name. Matches on the beginning of username or name.

#### **Returns**

```javascript
[
    {
        "_id": "String",
        "name": "String",
        "username": "String"
    },
    ...
]
```

---

### GET&emsp;`/user/id/{userId}`:

Get a user's info

#### **Returns**

```javascript
{
    _id: "String",
    "name": "String",
    "username": "String",
    "email": "String",
    "visibility": "String", // ["public", "private"]
    "followers": [
        "String" // userId's
    ],
    "following": [
        "String" // userId's
    ]
}
```

---

### GET&emsp;`/user/id/exercise/templates` | `/user/id/exercise/logs`:

Get a user's exercise templates/logs

#### **Returns**

```javascript
[
    {
        ExerciseTemplate
    },
    ...
]
```

---

### GET&emsp;`/user/id/workout/templates` | `/user/id/workout/logs`:

Get a user's workout templates/logs

#### **Returns**

```javascript
[
    {
        WorkoutTemplate
    },
    ...
]
```

---

### POST&emsp;`/user/login`:

Login and get token

#### **Parameters**

*Body:*

```javascript
{
    username: "String", // required
    password: "String", // required
}
```
#### **Returns**

```javascript
{
    message: "Invalid credentials.",
    // OR:
    token: "abcd"
}
```

---

### POST&emsp;`/user/signup`:

Create a user and immediately get logged in

#### **Parameters**

*Body:*

```javascript
{
    email: "String", // required
    username: "String", // required
    password: "String", // required
}
```
#### **Returns**

```javascript
{
    message: "Email is already in use.",
    // OR:
    token: "abcd"
}
```

---


# Messages

### GET&emsp;`/messages`:

Get all users that previous messages exist with. Returns a list sorted by most recent

#### **Returns**

```javascript
[
    {
        "_id": "String",
        "name": "String"
    },
    ...
]
```

---

### GET&emsp;`/messages/user/{userId}`:

Get all messages with a user. Returns a list sorted by most recent

#### **Returns**

```javascript
[
    {
        creatorId: {
            "_id": "String",
            "name": "String"
        },
        recipientId: {
            "_id": "String",
            "name": "String"
        },
        type: "String",         // ["routine", "exerciseLog", "workoutLog", "exercise", "workout", "text"]
        text: "String"
        exerciseLogs: ["ExerciseLogId"],
        exerciseTemplates: ["ExerciseTemplateId"],
        workoutLogs: ["WorkoutLogId"],
        workoutTemplates: ["WorkoutTemplateId"],
        routines: ["RoutineId"],
        date: "String"
    },
    ...
]
```

---

### POST&emsp;`/messages`:

Send message to a user

#### **Parameters**

*Body:*

```javascript
{
    recipientId: "String",  // required
    type: "String",         // required: ["routine", "exerciseLog", "workoutLog", "exercise", "workout", "text"]
    text: "String"
    exerciseLogs: ["ExerciseLogId"],
    exerciseTemplates: ["ExerciseTemplateId"],
    workoutLogs: ["WorkoutLogId"],
    workoutTemplates: ["WorkoutTemplateId"],
    routines: ["RoutineId"]
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {}
}
```

---


# Profile

### GET&emsp;`/profile`:

Get the user's own profile

#### **Returns**

```javascript
{
    "name": "Dev User",
    "username": "devuser",      // required, must be unique
    "email": "test@abc.com",    // required
    "visibility": "private",    // ["public", "private"]
    "biography": "String",
    "profilePicURL": "String",
    "measurements": {
        units: "String",        // default: "kg m"; ["lbs ft", "kg m"]
        weight: Number,
        height: Integer,
        visibility: "String",   // default: "private"; ["public", "private"]
    },
    "visibility": "String",     // default: "public"; ["public", "private"]
    "activeRoutine": "RoutineId",
    "followers": [
        {
            "_id": "String",
            "name": "String",
            "username": "String"
        },
        ...
    ],
    "following": [
        {
            "_id": "String",
            "name": "String",
            "username": "String"
        },
        ...
    ]
}
```

---

### GET&emsp;`/profile/u/{username}` | `/profile/id/{userId}`:

Get a profile by username

#### **Returns**

```javascript
{
    "name": "Dev User",
    "username": "devuser",      // required, must be unique
    "email": "test@abc.com",    // required
    "visibility": "private",    // ["public", "private"]
    "biography": "String",
    "profilePicURL": "String",
    "measurements": {
        units: "String",        // default: "kg m"; ["lbs ft", "kg m"]
        weight: Number,
        height: Integer,
        visibility: "String",   // default: "private"; ["public", "private"]
    },
    "visibility": "String",     // default: "public"; ["public", "private"]
    "activeRoutine": "RoutineId",
    "followers": [
        {
            "_id": "String",
            "name": "String",
            "username": "String"
        },
        ...
    ],
    "following": [
        {
            "_id": "String",
            "name": "String",
            "username": "String"
        },
        ...
    ]
}
```

---

### GET&emsp;`/profile/popular`:

List the most followed public users in descending order

#### **Returns**

```javascript
[
    {
        "_id": String,
        "name": String,
        "username": String,
        "visibility": String,
        "activeRoutine": String,
        "profilePicURL": String,
        "followerCount": Number
    },
    ...
]
```

---

### PUT&emsp;`/profile`:

Edit the current user's profile

#### **Parameters**

*Body:*

```javascript
{
    "name": "Dev User",
    "username": "devuser",      // required, must be unique
    "email": "test@abc.com",    // required
    "visibility": "private",    // ["public", "private"]
    "biography": "String",
    "profilePicURL": "String",
    "measurements": {
        units: "String",        // default: "kg m"; ["lbs ft", "kg m"]
        weight: Number,
        height: Integer,
        visibility: "String",   // default: "private"; ["public", "private"]
    },
    "visibility": "String",     // default: "public"; ["public", "private"]
    "activeRoutine": "RoutineId",
}
```
#### **Returns**

```javascript
{
    message: "Sucess.",
    data: {}
}
```

---

### DELETE&emsp;`/profile`:

Delete the current user

#### **Returns**

```javascript
{
    message: "String",
}
```

---

### POST&emsp;`/profile/follow/{userId}`:

Follow a user by Id

#### **Returns**

```javascript
{
    message: "Success.",
    // OR
    message: "User not found."
}
```

---

### POST&emsp;`/profile/unfollow/{userId}`:

Unfollow a user by Id

#### **Returns**

```javascript
{
    message: "Success.",
    // OR
    message: "User not found."
}
```

---

# Notification

### GET&emsp;`/notification`:

Get notifications

#### **Returns**

```javascript
{
    ownerId: UserSchema,
    events: ["String"]
}
```

---

### POST&emsp;`/notification`:

Create a notification. Existing notifications will remain and new ones are simply appended.

#### **Parameters**

*Body:*

```javascript
{
    events: [
        "String",
        "String",
        ...
    ]
}
```

#### **Returns**

```javascript
{
    message: "Success."
}
```

---


# Check In

### GET&emsp;`/checkin/templates` | `/checkin/logs` | `/checkin/logs/parent/{id}`:

Get all user's checkins, or checkin logs, or logs belonging to a checkin id 

#### **Returns**

```javascript
[
    // template
    {
        "_id": "String",
        "name": "String",
        "creatorId": {},
        "access": "String"
    }
    // OR,
    // log
    {
        "_id": "String",
        "checkInTemplate": {},
        "creatorId": {},
        "type": "String",
        "value": Any,
        "date": "String"
    }
]
```

---

### GET&emsp;`/checkin/templates/{id}` | `/checkin/logs/id/{id}`:

Get a checkin by id

#### **Returns**

```javascript
// template
{
    "_id": "String",
    "name": "String",
    "creatorId": {},
    "access": "String"
}
// OR,
// log
{
    "_id": "String",
    "checkInTemplate": {},
    "creatorId": {},
    "type": "String",
    "value": Any,
    "date": "String"
}
```

---

### POST&emsp;`/checkin/templates` | `/checkin/logs`:

Create a checkin or log

#### **Parameters**

*Body:*

```javascript
// template
{
    "name": "String",   //required
    "access": "String"  //required ["private", "public"]
}
// OR
// logs
{
    "checkInTemplate": "String",    // required
    "type": "String",               // required ["string", "boolean", "number"]
    "value": Any,                   
    "date": "String"        
}
```
#### **Returns**

```javascript
{
    message: "Sucess.",
    data: {}
}
```

---

### PUT&emsp;`/checkin/templates` | `/checkin/logs`:

Edit a checkin 

#### **Parameters**

*Body:*

```javascript
// template
{
    "_id": "String",    // required
    "name": "String",   // required
    "access": "String"  // required ["private", "public"]
}
// OR
// logs
{
    "_id": "String",                // required
    "checkInTemplate": "String",    // required
    "type": "String",               // required ["string", "boolean", "number"]
    "value": Any,                   
    "date": "String"        
}
```
#### **Returns**

```javascript
{
    message: "Sucess.",
    data: {}
}
```

---

### DELETE&emsp;`/checkin/templates/{id}` | `/checkin/logs/id/{id}`:

Delete a checkin 

#### **Returns**

```javascript
{
    message: "String",
}
```

---

# Exercise Templates

### GET&emsp;`/exercise/templates`:

Get all exercises

#### **Returns**

```javascript
[
    {
        _id: "String",
        name: "String",
        creatorId: "String",
        muscle: ["String"],
        muscleHighlight: ["String"]
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"]
    },
    ...
]
```
---

### GET&emsp;`/exercise/templates/{id}`:

Get exercise template by id

#### **Returns**

```javascript
{
    _id: "String",
    name: "String",
    creatorId: "String",
    muscle: ["String"],
    muscleHighlight: ["String"]
    muscleGroup: ["String"],
    description: "String",
    type: "String",
    attachments: ["String"]
}
```
---

### POST&emsp;`/exercise/templates/{id}/like` | `/exercise/templates/{id}/unlike`:

Like or unlike an exercise

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### POST&emsp;`/exercise/templates`:

Create exercise template

#### **Parameters**

*Body:*

```javascript
{
    name: "String", // required
    muscle: ["String"], // required
    muscleHighlight: ["String"]
    muscleGroup: ["String"],
    description: "String",
    type: "String",
    attachments: ["String"]
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "String",
        creatorId: "String",
        muscle: ["String"],
        muscleHighlight: ["String"]
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"]
    }
}
```

---

### PUT&emsp;`/exercise/templates`:

Modify exercise template

#### **Parameters**

*Body:*

```javascript
{
    _id: "String", //required
    name: "String", // required
    muscle: ["String"], // required
    muscleHighlight: ["String"]
    muscleGroup: ["String"],
    description: "String",
    type: "String",
    attachments: ["String"]
}
```

#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "String",
        creatorId: "String",
        muscle: ["String"],
        muscleHighlight: ["String"]
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"]
    }
}
```

---

### DELETE&emsp;`/exercise/templates/{id}`:

Delete exercise by id

#### **Returns**

```javascript
{ message: "Success." }
```

---


# Exercise Logs

### GET&emsp;`/exercise/logs`:

Get all exercise logs

#### **Parameters**

*Query:*

`?name={String}`

#### **Returns**

```javascript
[
    // or list of matching search results on "?name" query
    {
        _id: "String",
        exerciseTemplate: {
            ExerciseTemplate
        },
        name: "String",
        creatorId: "String",
        muscle: ["String"],
        muscleHighlight: ["String"],
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"]
    },
    ...
]
```

---

### GET&emsp;`/exercise/logs/{id}`:

Get exercise log by id

#### **Returns**

```javascript
{
    _id: "String",
    exerciseTemplate: {
        ExerciseTemplate
    },
    name: "String",
    creatorId: "String",
    muscle: ["String"],
    muscleHighlight: ["String"],
    muscleGroup: ["String"],
    description: "String",
    type: "String",
    attachments: ["String"]
}
```
---

### POST&emsp;`/exercise/logs`:

Create exercise log

#### **Parameters**

*Body:*

```javascript
{
    name: "String",                         // required
    exerciseTemplate: "ExerciseTemplateId", // required
    muscle: ["String"],         
    muscleHighlight: ["String"]
    muscleGroup: ["String"],                // ["chest", "back", "core", "shoulder", "arms", "hip", "legs"]
    description: "String",
    type: "String",                         // optional: ["Lift", "Cardio", "Mobility"]
    attachments: ["String"]
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "String",
        creatorId: "String",
        muscle: ["String"],
        muscleHighlight: ["String"]
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"]
    }
}
```

---

### PUT&emsp;`/exercise/logs`:

Modify exercise template

#### **Parameters**

*Body:*

```javascript
{
    name: "String",                         // required
    exerciseTemplate: "ExerciseTemplateId", // required
    muscle: ["String"],         
    muscleHighlight: ["String"]
    muscleGroup: ["String"],                // ["chest", "back", "core", "shoulder", "arms", "hip", "legs"]
    description: "String",
    type: "String",                         // optional: ["Lift", "Cardio", "Mobility"]
    attachments: ["String"]
}
```

#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "String",
        creatorId: "String",
        muscle: ["String"],
        muscleHighlight: ["String"]
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"]
    }
}
```

---

### DELETE&emsp;`/exercise/logs/{id}`:

Delete exercise by id

#### **Returns**

```javascript
{ message: "Success." }
```

---

# Workout Templates

### GET&emsp;`/workout/templates`:

Get all workouts

#### **Returns**

```javascript
[
    {
        _id: "String",
        name: "String",
        creatorId: "String",
        exerciseTemplates: [ExerciseTemplate],
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"],
        access: ["public", "unlisted", "private"]
    },
    ...
]
```
---

### GET&emsp;`/workout/templates/{id}`:

Get workout template by id

#### **Returns**

```javascript
{
    _id: "String",
    name: "String",
    creatorId: "String",
    exerciseTemplates: [ExerciseTemplate],
    muscleGroup: ["String"],
    description: "String",
    type: "String",
    attachments: ["String"],
    access: ["public", "unlisted", "private"]
}
```
---

### POST&emsp;`/workout/templates/{id}/like` | `/workout/templates/{id}/unlike`:

Like or unlike an workout

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### POST&emsp;`/workout/templates`:

Create workout template

#### **Parameters**

*Body:*

```javascript
{
    name: "String", // required
    muscleGroup: ["String"], // required
    exerciseTemplates: [ExerciseTemplate],
    description: "String",
    type: "String",
    attachments: ["String"],
    access: ["public", "unlisted", "private"]
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "String",
        creatorId: "String",
        exerciseTemplates: [ExerciseTemplate],
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"],
        access: ["public", "unlisted", "private"]
    }
}
```

---

### PUT&emsp;`/workout/templates`:

Modify workout template

#### **Parameters**

*Body:*

```javascript
{
    _id: "String", // required
    name: "String", // required
    muscleGroup: ["String"], // required
    exerciseTemplates: [ExerciseTemplate],
    description: "String",
    type: "String",
    attachments: ["String"],
    access: ["public", "unlisted", "private"]
}
```

#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "String",
        creatorId: "String",
        exerciseTemplates: [ExerciseTemplate],
        muscleGroup: ["String"],
        description: "String",
        type: "String",
        attachments: ["String"],
        access: ["public", "unlisted", "private"]
    }
}
```

---

### DELETE&emsp;`/workout/templates/{id}`:

Delete workout by id

#### **Returns**

```javascript
{ message: "Success." }
```

---

# Routine

### GET&emsp;`/routine`:

Get all routines

#### **Returns**

```javascript
[
    {
        name: "string", // required
        workoutTemplates: [],
        numberOfDays: "number",
        creatorId: "string",
        description: "string",
        attachments: []
    },
    ...
]
```
---

### GET&emsp;`/routine/id/{id}`:

Get workout routine by id

#### **Returns**

```javascript
{
    _id: "String",
    name: "string", // required
    workoutTemplates: [],
    numberOfDays: "number",
    creatorId: "string",
    description: "string",
    attachments: []
}
```
---

### GET&emsp;`/routine/user/{userId}`:

Get workout routines of a user id

#### **Returns**

```javascript
[
    {
        _id: "String",
        name: "string", // required
        workoutTemplates: [],
        numberOfDays: "number",
        creatorId: "string",
        description: "string",
        attachments: []
    },
    ...
]
```
---

### POST&emsp;`/routine/id/{id}/like` | `/routine/id/{id}/unlike`:

Like or unlike an routine

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### POST&emsp;`/routine`:

Create routine

#### **Parameters**

*Body:*

```javascript
{
    name: "string", // required
    workoutTemplates: [WorkoutTemplate],
    numberOfDays: "number",
    description: "string",
    attachments: []
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "string",
        workoutTemplates: [WorkoutTemplate],
        numberOfDays: "number",
        description: "string",
        attachments: []
    }
}
```

---

### PUT&emsp;`/routine`:

Modify routine

#### **Parameters**

*Body:*

```javascript
{
    _id: "String", // required
    name: "string", // required
    workoutTemplates: [WorkoutTemplate],
    numberOfDays: "number",
    description: "string",
    attachments: []
}
```

#### **Returns**

```javascript
{
    message: "Success.",
    data: {
        _id: "String",
        name: "string",
        workoutTemplates: [WorkoutTemplate],
        numberOfDays: "number",
        description: "string",
        attachments: []
    }
}
```

---

### DELETE&emsp;`/routine/{id}`:

Delete workout by id

#### **Returns**

```javascript
{ message: "Success." }
```

---

# Public

### GET&emsp;`/public/exercise/templates`:

List all public exercise templates or search on the name property

#### **Parameters**

*Query:*

- Optional query: `/public/exercise/templates?name={string}`

#### **Returns**

```javascript
[
    {
        _id: "String",
        name: "String",
        creatorId: "String",
        ...
    },
    ...
]
```

---

### GET&emsp;`/public/workout/templates`:

List all public workout templates or search on the name property

#### **Parameters**

*Query:*

- Optional query: `/public/workout/templates?name={string}`

#### **Returns**

```javascript
[
    {
        _id: "String",
        name: "String",
        creatorId: "String",
        ...
    },
    ...
]
```

---

# Post

### GET&emsp;`/post`:

List all posts belonging to the currently auth'ed user

#### **Returns**

```javascript
[
    {
        _id: "String",
        title: "String",
        creatorId: "String",
        comments: [
            {
                "creatorId": "String",
                "date": "String",
                "text": "String",
                "_id": "Sring"
            },
            ...
        ]
        items: [],
        tags: [],
        likeCount: 0,
        dislikeCount: 0
    },
    ...
]
```

---

### GET&emsp;`/post/id/{postId}`:

Get post by id. Will not be visible if post owner is private and not followed by user.

#### **Returns**

```javascript
{
    _id: "String",
    title: "String",
    creatorId: "String",
    comments: [
        {
            "creatorId": "String",
            "date": "String",
            "text": "String",
            "_id": "Sring"
        },
        ...
    ]
    items: [],
    tags: [],
    likeCount: 0,
    dislikeCount: 0
}
```

---

### GET&emsp;`/post/user/{userId}`:

Get all posts belonging to user id. Will not be visible if post owner is private and not followed by user.

#### **Returns**

```javascript
[
    {
        _id: "String",
        title: "String",
        creatorId: "String",
        items: []
    },
    ...
]
```

---

### GET&emsp;`/post/tags`:

Get all tags a post can use.

#### **Returns**

```javascript
[
    "natty or not",
    "coaching",
    "beginner",
    "intermediate",
    "advanced",
    "meal prep",
    "diet",
    "weight loss",
    "weight gain",
    "supplementation",
    "powerlifting",
    "weightlifting",
    "bodybuilding",
    "physique",
    "personal record",
    "posing",
    "program structuring",
    "hypertrophy",
    "calisthenics",
    "cardio",
    "endurance",
    "athletic performance",
    "agility",
    "mobility & stretching"
]
```

---

### POST&emsp;`/post`:

Create post

#### **Parameters**

*Body:*

```javascript
{
    title: "String", // required
    items: [
        {
            type: ["routine", "exerciseLog", "workoutLog", "checkInLog", "exercise", "workout", "media", "text"], // required
            text: "String",
            exerciseLogs: [],
            exerciseTemplates: [],
            workoutLogs: [],
            workoutTemplates: [],
            media: "String"
        }
    ]
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {}
}
```

---

### PUT&emsp;`/post`:

Edit post

#### **Parameters**

*Body:*

```javascript
{
    _id: "String", // required
    title: "String",
    items: [
        {
            type:  ["exercise", "workout", "media", "text"], // required
            text: "String",
            exerciseLogs: [],
            exerciseTemplates: [],
            workoutLogs: [],
            workoutTemplates: [],
            media: "String"
        }
    ]
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {}
}
```

---

### DELETE&emsp;`/post/id/{postId}`:

Delete post by id.

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### POST&emsp;`/post/id/{postId}/like` | `/post/id/{postId}/dislike` | `/post/id/{postId}/unlike`:

Like/dislike/unlike a post by id.

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### GET&emsp;`/post/id/{postId}/comments`:

Get comments on a post

#### **Returns**

```javascript
[
    {
        creatorId: {
            "_id": "String",
            "name": "String",
            "username": "String"
        },
        "date": "2023-02-20T06:00:50.035Z",
        "text": "String",
        "_id": "String",
        "replies": []
    },
    ...
]
```

---

### GET&emsp;`/post/id/{postId}/comments/{commentId}`:

Get comments on a post

#### **Returns**

```javascript
{
    creatorId: {
        "_id": "String",
        "name": "String",
        "username": "String"
    },
    "date": "2023-02-20T06:00:50.035Z",
    "text": "String",
    "_id": "String",
    "replies": []
}
```

---

### POST&emsp;`/post/id/{postId}/comments`:

Create comment

#### **Parameters**

*Body:*

```javascript
{
    text: "String" // required
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {}
}
```

---

### PUT&emsp;`/post/id/{postId}/comments/{commentId}`:

Edit comment

#### **Parameters**

*Body:*

```javascript
{
    text: "String" // required
}
```
#### **Returns**

```javascript
{
    message: "Success.",
    data: {}
}
```

---

### DELETE&emsp;`/post/id/{postId}/comments/{commentId}`:

Delete comment by id

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### POST&emsp;`/post/id/{postId}/comments/{commentId}/replies`:

Create reply on a comment

*Body:*

```javascript
{
    text: "String" // required
}
```

#### **Returns**

```javascript
{
    creatorId: {
        "_id": "String",
        "name": "String",
        "username": "String"
    },
    "date": "2023-02-20T06:00:50.035Z",
    "text": "String",
    "_id": "String"
}
```

---

### DELETE&emsp;`/post/id/{postId}/comments/{commentId}/replies/{replyId}`:

Delete reply on a comment

#### **Returns**

```javascript
{
    message: "Success"
}
```

---

### GET&emsp;`/tag/{tagName}`:

Get all public posts with a tag.

#### **Returns**

```javascript
[
    {
        PostObject
    },
    ...
]
```

---

# Save

### GET&emsp;`/save/routines` | `/save/workouts` | `/save/exercises`:

Get all saved routines, workouts, or exercises.

#### **Returns**

```javascript
[
    Routine, WorkoutTemplate, ExerciseTemplate
]
```

---

### POST&emsp;`/save/routines/{routineId}` | `/save/workouts/{workoutId}` | `/save/exercises/{exerciseId}`:

Add a saved routine, workout, or exercise.

The routine, workout, or exercise, will not save if it is not public or does not exist.

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

### DELETE&emsp;`/save/routines/{routineId}` | `/save/workouts/{workoutId}` | `/save/exercises/{exerciseId}`:

Remove a saved routine, workout, or exercise.

#### **Returns**

```javascript
{
    message: "Success."
}
```

---

# Upload

### GET&emsp;`/upload`:

Get a URL to upload an image to.

#### **Returns**

```javascript
{
    url: "String"
}
```

This URL will be the S3 bucket's endpont to upload an image to. As well as the URL to GET the image once it has been uploaded. 

See example:

```javascript
await fetch("myUrlString", {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: myImageFile
})
```

---

