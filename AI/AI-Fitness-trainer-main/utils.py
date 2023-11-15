
import mediapipe as mp
import pandas as pd
import numpy as np
import cv2

mp_pose = mp.solutions.pose

import math

def calculate_angle(a, b, c):
    ax, ay = a
    bx, by = b
    cx, cy = c

    ab = math.sqrt((bx - ax) ** 2 + (by - ay) ** 2)
    bc = math.sqrt((cx - bx) ** 2 + (cy - by) ** 2)
    ac = math.sqrt((cx - ax) ** 2 + (cy - ay) ** 2)

    angle_radians = math.acos((ab**2 + bc**2 - ac**2) / (2 * ab * bc))
    angle_degrees = angle_radians * 180 / math.pi

    if angle_degrees > 180:
        angle_degrees = 360 - angle_degrees

    return angle_degrees



def detect_body_part(landmarks, body_part_name):
    landmark = mp_pose.PoseLandmark[body_part_name]
    return [landmarks[landmark.value].x, landmarks[landmark.value].y, landmarks[landmark.value].visibility]



def detect_body_parts(landmarks):
    body_parts = []
    
    for lndmrk in mp_pose.PoseLandmark:
        lndmrk_str = str(lndmrk).split(".")[1]
        cord = detect_body_part(landmarks, lndmrk_str)
        body_parts.append({"body_part": lndmrk_str, "x": cord[0], "y": cord[1]})
    
    return pd.DataFrame(body_parts)



def score_table(exercise, frame , counter, status, feedback):
    text_color = (245, 135, 66)
    font = cv2.FONT_HERSHEY_COMPLEX 
    size = 1.3
    feedback = "Good Rep!"
    cv2.putText(frame, f"Exercise: {exercise.replace('-', ' ')}", (10, 65),
                font, size, text_color, 3, cv2.LINE_AA)
    cv2.putText(frame, f"Reps Completed: {counter}", (10, 110),
                font, size, text_color, 3, cv2.LINE_AA)
    cv2.putText(frame, f"Status: {status}", (10, 155),
                font, size, text_color, 3, cv2.LINE_AA)
    cv2.putText(frame, f"Comment: {feedback}", (10, 200),
                font, size, text_color, 3, cv2.LINE_AA)
    return frame

