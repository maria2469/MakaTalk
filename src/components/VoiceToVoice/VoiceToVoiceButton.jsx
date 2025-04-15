import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import TextToSpeech from '../TextToSpeech/TextToSpeech'; // Import the TextToSpeech component

const VoiceToVoiceButton = ({ selectedLanguage }) => {
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null); // State to store recognition instance

    // Function to handle API call to backend
    const handleApiCall = async (inputText) => {
        setIsProcessing(true);

        try {
            const response = await fetch('/api/process-input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText,
                    language: selectedLanguage,
                }),
            });

            const data = await response.json();
            setAiResponse(data.response);
            // Play AI response with TextToSpeech
            if (data.response) {
                // Use the TextToSpeech component here or trigger a text-to-speech function
                // If you have a separate function, you can call it here
            }
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSpeechRecognition = () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.error('SpeechRecognition is not supported in this browser');
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        
        // If recognition instance already exists and is listening, stop it
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
            return; // Exit the function to prevent starting again
        }

        const newRecognition = new SpeechRecognition();
        setRecognition(newRecognition); // Store the recognition instance

        newRecognition.lang = selectedLanguage;
        newRecognition.interimResults = false;
        newRecognition.continuous = false;

        newRecognition.onstart = () => setIsListening(true);

        newRecognition.onresult = (event) => {
            const transcriptedText = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
            handleApiCall(transcriptedText);
        };

        newRecognition.onend = () => setIsListening(false);
        newRecognition.onerror = (event) => console.error('SpeechRecognition error:', event.error);

        newRecognition.start();
    };

    return (
        <div className="voice-to-voice-button">
            <div className="flex mt-0 p-0">
                <button
                    onClick={handleSpeechRecognition}
                    className={`p-3 rounded-full ${isListening ? 'bg-blue-900' : 'bg-blue-500'} text-white`}
                    disabled={isProcessing}
                >
                    <FaMicrophone />
                </button>
            </div>

            {isProcessing && <p>Processing...</p>}

            {/* TextToSpeech Component for user input */}
            {userInput && (
                <TextToSpeech text={userInput} selectedLanguage={selectedLanguage} />
            )}

            {/* TextToSpeech Component to play AI response in the selected language */}
            {aiResponse && (
                <TextToSpeech text={aiResponse} selectedLanguage={selectedLanguage} />
            )}
        </div>
    );
};

export default VoiceToVoiceButton;


