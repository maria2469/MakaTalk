import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import UserAiResponse from '../UserAiResponse/UserAiResponse';
import TextToSpeech from '../TextToSpeech/TextToSpeech'; // Import the new TextToSpeech component

const VoiceToVoiceButton = ({ selectedLanguage }) => {
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);

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
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = () => {
        if (userInput.trim()) {
            handleApiCall(userInput);
            setUserInput('');
        }
    };

    const handleSpeechRecognition = () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.error('SpeechRecognition is not supported in this browser');
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = selectedLanguage;
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcriptedText = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
            handleApiCall(transcriptedText);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => console.error('SpeechRecognition error:', event.error);

        recognition.start();
    };

    return (
        <div className="voice-to-voice-button flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex mb-4">
                <button
                    onClick={handleSpeechRecognition}
                    className={`p-2 rounded-full transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-green-500 hover:bg-green-600'} text-white shadow-md`}
                    disabled={isProcessing}
                    aria-label="Voice Input"
                >
                    <FaMicrophone size={24} />
                </button>
            </div>

            {isProcessing && <p className="text-gray-600">Processing...</p>}

            {/* TextToSpeech Component for user input */}
            {userInput && (
                <div className="mt-2">
                    <TextToSpeech text={userInput} selectedLanguage={selectedLanguage} />
                </div>
            )}

            {/* TextToSpeech Component to play AI response in the selected language */}
            {aiResponse && (
                <div className="mt-2">
                    <TextToSpeech text={aiResponse} selectedLanguage={selectedLanguage} />
                </div>
            )}
        </div>
    );
};

export default VoiceToVoiceButton;

