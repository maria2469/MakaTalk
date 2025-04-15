# Component Overview

## 1. `VoiceToVoiceButton`

### Description
The main component responsible for handling both voice and text input. It allows users to interact with the AI using their voice and typed queries.

### Key Features
- **Voice Recognition**: Initiates the SpeechRecognition API to capture user speech and convert it into text.
- **Text Submission**: Handles user text input and submits it to the back-end for processing.
- **AI Response Handling**: Receives responses from the back-end and triggers text-to-speech for the AI's reply.

### API Integration
- **POST Request to `/api/process-input`**: 
  - **Input**: Sends user input (either text or transcribed voice) and the selected language to the back-end.
  - **Output**: Receives the AI-generated response to display and play back to the user.

### Functions
- `handleApiCall(inputText)`: Makes the API call to process user input.
- `handleSpeechRecognition()`: Manages the voice recognition process, including starting and stopping listening.

---

## 2. `TextToSpeech`

### Description
A component that converts text responses into speech, providing an auditory response to the user.

### Key Features
- **Audio Playback**: Takes text input (either user input or AI response) and uses the Web Speech API's SpeechSynthesis interface to read it aloud.

### API Integration
- This component does not directly interact with the back-end but depends on the processed text received from the `VoiceToVoiceButton` component.

---

## 3. `UserAiResponse`

### Description
This component is responsible for displaying the AI's response in a user-friendly format.

### Key Features
- **Display AI Responses**: Renders the AI's responses on the screen for user reference.

### API Integration
- Similar to `TextToSpeech`, this component receives data from the `VoiceToVoiceButton` but does not make any API calls directly. It is part of the workflow that displays the processed information received from the back-end.

---

## Workflow Overview
1. **User Interaction**: The user either speaks into the microphone or types a message.
2. **Voice Processing**: The `VoiceToVoiceButton` captures speech, transcribes it to text, and sends it to the back-end via an API call.
3. **AI Processing**: The back-end processes the input and sends back a response.
4. **Response Handling**: The AI response is displayed by `UserAiResponse` and read aloud using `TextToSpeech`.
