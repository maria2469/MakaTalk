import React, { useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import TextToSpeech from '../TextToSpeech/TextToSpeech'; // Import the new TextToSpeech component

const VoiceToVoiceButton = ({ selectedLanguage }) => {
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

    const handleSpeechRecognition = () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            console.error('SpeechRecognition is not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

    const handleStopRecognition = () => {
        setIsListening(false);
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            window.SpeechRecognition.abort(); // Stop recognition
        }
    };

    return (
        <div className="voice-to-voice-button">
            <div className="flex mt-4">
                {isListening ? (
                    <button
                        onClick={handleStopRecognition}
                        className={`p-2 rounded-full bg-red-500 text-white`}
                        disabled={isProcessing}
                    >
                        <FaStop />
                    </button>
                ) : (
                    <button
                        onClick={handleSpeechRecognition}
                        className={`p-2 rounded-full bg-green-500 text-white`}
                        disabled={isProcessing}
                    >
                        <FaMicrophone />
                    </button>
                )}
            </div>

            {isProcessing && <p>Processing...</p>}

            {/* TextToSpeech Component to play AI response in the selected language */}
            {aiResponse && (
                <TextToSpeech text={aiResponse} selectedLanguage={selectedLanguage} />
            )}
        </div>
    );
};

export default VoiceToVoiceButton;


