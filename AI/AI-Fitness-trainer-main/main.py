import cv2
import argparse
from utils import *
import mediapipe as mp
from body_part_angle import BodyPartAngle
from types_of_exercise import TypeOfExercise

##run with following commands
#python3 main.py -t pull-up
#python3 main.py -t push-up
#python3 main.py -t squat


ap = argparse.ArgumentParser()
ap.add_argument("-t", "--exercise_type", type=str, help='Type of excercise', required=True)
ap.add_argument("-vs","--video_source", type=str, help='Type of ecercise' ,required=False)
args = vars(ap.parse_args())


mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


cap = cv2.VideoCapture(args["video_source"]) if args.get("video_source") else cv2.VideoCapture(1) #get video source 

#cap = cv2.VideoCapture('/demo_video/pull-up.mp4')

cap.set(3, 400)  # width
cap.set(4, 500)  # height

# setup mediapipe
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    counter, status, feedback = 0, True, 'try again'
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (1080, 1920), interpolation=cv2.INTER_AREA)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame.flags.writeable = False
        results = pose.process(frame)
        frame.flags.writeable = True
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        try:
            landmarks = results.pose_landmarks.landmark
            counter, status = TypeOfExercise(landmarks).calculate_exercise(
                args['exercise_type'], counter, status)
            feedback = 'Keep going' if not status else ''
        except:
            pass


        mp_drawing.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2, circle_radius=2),
            mp_drawing.DrawingSpec(color=(174, 139, 45), thickness=2, circle_radius=2),
        )

        frame = score_table(args['exercise_type'], frame, counter, status, feedback)
        
        
        cv2.imshow('Video', frame)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()