import mediapipe as mp
import pandas as pd
import numpy as np
import cv2
from utils import *


class BodyPartAngle:
    def __init__(self, landmarks):
        self.landmarks = landmarks

        self.body_part_angles = {
            "left_arm": ["LEFT_SHOULDER", "LEFT_ELBOW", "LEFT_WRIST"],
            "right_arm": ["RIGHT_SHOULDER", "RIGHT_ELBOW", "RIGHT_WRIST"],
            "left_leg": ["LEFT_HIP", "LEFT_KNEE", "LEFT_ANKLE"],
            "right_leg": ["RIGHT_HIP", "RIGHT_KNEE", "RIGHT_ANKLE"],
            "neck": ["RIGHT_SHOULDER", "LEFT_SHOULDER", "MOUTH_RIGHT", "MOUTH_LEFT", "RIGHT_HIP", "LEFT_HIP"],
            "abdomen": ["RIGHT_SHOULDER", "LEFT_SHOULDER", "RIGHT_HIP", "LEFT_HIP", "RIGHT_KNEE", "LEFT_KNEE"]
        }

    def calculate_angle(self, body_part):
        landmark_keys = self.body_part_angles[body_part]
        landmarks = [detect_body_part(self.landmarks, key) for key in landmark_keys]
        return calculate_angle(*landmarks)

    def angle_left_arm(self):
        return self.calculate_angle("left_arm")

    def angle_right_arm(self):
        return self.calculate_angle("right_arm")

    def angle_left_leg(self):
        return self.calculate_angle("left_leg")

    def angle_right_leg(self):
        return self.calculate_angle("right_leg")

    def angle_neck(self):
        return abs(180 - self.calculate_angle("neck"))

    def angle_abdomen(self):
        return self.calculate_angle("abdomen")