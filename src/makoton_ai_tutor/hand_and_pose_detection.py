import cv2
import mediapipe as mp
import torch
from transformers import ViTFeatureExtractor, ViTForImageClassification

# Initialize MediaPipe Hands and Pose
mp_hands = mp.solutions.hands
mp_pose = mp.solutions.pose
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Initialize the ViT model and feature extractor
feature_extractor = ViTFeatureExtractor.from_pretrained("google/vit-base-patch16-224")
model = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")

# Function to process frame and detect hand and body landmarks
def process_frame(frame):
    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Process the frame and find hand landmarks
    hand_results = hands.process(rgb_frame)
    
    # Process the frame and find body pose landmarks
    pose_results = pose.process(rgb_frame)
    
    # Create a copy of the frame to draw landmarks on
    landmark_frame = frame.copy()
    
    if hand_results.multi_hand_landmarks:
        for hand_landmarks in hand_results.multi_hand_landmarks:
            # Draw the hand landmarks on the landmark_frame
            mp_drawing.draw_landmarks(landmark_frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
    
    if pose_results.pose_landmarks:
        # Draw the pose landmarks on the landmark_frame
        mp_drawing.draw_landmarks(landmark_frame, pose_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
    
    # Prepare the landmark_frame for the ViT model
    landmark_frame_rgb = cv2.cvtColor(landmark_frame, cv2.COLOR_BGR2RGB)
    inputs = feature_extractor(images=landmark_frame_rgb, return_tensors="pt")
    
    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Get the predicted class
    predicted_class = outputs.logits.argmax(-1).item()
    predicted_label = model.config.id2label[predicted_class]
    
    # Display the predicted label on the frame
    cv2.putText(frame, f"Predicted: {predicted_label}", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    return frame, predicted_label

# Function to process video frames and return results
def process_video(callback):
    cap = cv2.VideoCapture(1)
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        
        # Process the frame
        processed_frame, predicted_label = process_frame(frame)
        
        # Pass the processed frame and label to the callback function
        callback(processed_frame, predicted_label)
        
        if cv2.waitKey(5) & 0xFF == 27:  # Press 'ESC' to exit
            break

    cap.release()
    cv2.destroyAllWindows()
