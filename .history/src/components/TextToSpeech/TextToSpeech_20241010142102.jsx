import React, { useEffect } from 'react';

const TextToSpeech = ({ text, selectedLanguage }) => {
    useEffect(() => {
        if (!text) return;

        // Initialize speech synthesis
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        // Set language for speech synthesis
        utterance.lang = selectedLanguage;

        // Cancel any ongoing speech before starting a new one
        if (synth.speaking) {
            synth.cancel();
        }

        // Start speaking
        synth.speak(utterance);

        // Cleanup when the component is unmounted or text changes
        return () => {
            synth.cancel();
        };
    }, [text, selectedLanguage]); // Run when text or language changes

    return (
        <div>
            <p>Speaking: {text}</p>
        </div>
    );
};

export default TextToSpeech;
