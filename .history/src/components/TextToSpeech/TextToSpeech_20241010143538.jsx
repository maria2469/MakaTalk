import React, { useEffect, useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';

const TextToSpeech = ({ text, selectedLanguage }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = () => {
        if (!text) return;

        // Initialize speech synthesis
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        // Set language for speech synthesis
        utterance.lang = selectedLanguage;

        // Set speaking state to true when speaking starts
        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        // Reset speaking state when speaking ends
        utterance.onend = () => {
            setIsSpeaking(false);
        };

        // Cancel any ongoing speech before starting a new one
        if (synth.speaking) {
            synth.cancel();
        }

        // Start speaking
        synth.speak(utterance);
    };

    return (
        <div className="text-to-speech">
            <button
                onClick={handleSpeak}
                className={`p-2 rounded-full ${isSpeaking ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
                disabled={isSpeaking}
            >
                <FaVolumeUp />
            </button>
            <p>{isSpeaking ? `Speaking: ${text}` : 'Click the icon to listen.'}</p>
        </div>
    );
};

export default TextToSpeech;


