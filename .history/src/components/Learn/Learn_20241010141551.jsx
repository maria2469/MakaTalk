import React, { useState, useRef, Suspense } from 'react';
import './learn.css'; 
import Navbar from '../LandingPage/Navbar';
import colorOptions from '../Choices/Colors/Colors'; 
import LanguageDropdown from '../Languagedropdown/Language';
import UserAiResponse from '../UserAiResponse/UserAiResponse';
import VoiceToVoiceButton from '../VoiceToVoice/VoiceToVoiceButton';
import TextToSpeech from '../TextToSpeech/TextToSpeech'; // Import TextToSpeech component

// Lazy load Webcam and Help components to optimize performance
const Webcam = React.lazy(() => import('./Webcam/Webcam'));
const Help = React.lazy(() => import('./Help/Help'));

const Learn = () => {
    const [userInput, setUserInput] = useState(''); // User's typed input or speech transcription
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language is English
    const [selectedImage, setSelectedImage] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [aiResponse, setAiResponse] = useState('What do you want to learn today?');
    const [step, setStep] = useState(0);
    const [isVoiceInput, setIsVoiceInput] = useState(false); // Track if the input is from voice or text
    const debounceTimer = useRef(null); // Debounce timer to handle input

    // Handle text input change from user with debounce
    const handleInputChange = (event) => {
        const value = event.target.value.toLowerCase().trim();
        clearTimeout(debounceTimer.current); // Clear previous debounce if user keeps typing

        debounceTimer.current = setTimeout(() => {
            setUserInput(value);
            setIsVoiceInput(false); // Set to false because it's from text input
        }, 500); // Wait for 500ms pause in typing
    };

    // Handle speech input (from VoiceToVoiceButton)
    const handleSpeechInput = (transcript) => {
        setUserInput(transcript.toLowerCase().trim());
        setIsVoiceInput(true); // Set to true because it's from voice input
    };

    // Handle language change for dropdown
    const handleLanguageChange = (event) => setSelectedLanguage(event.target.value);

    // Handle form submission or AI response logic
    const handleSubmit = () => {
        const colorData = colorOptions[userInput];
        if (!userInput) return setAiResponse("Please enter a color or a question.");

        if (step === 0 && userInput.includes('color')) {
            setAiResponse('Great! Which color do you want to learn?');
            setStep(1);
        } else if (colorData) {
            setSelectedImage(colorData.image);
            setInstructions(colorData.instructions);
            setAiResponse(`Here's how to sign ${userInput}:`);
            setStep(2);
        } else {
            setAiResponse("Sorry, I don't have information on that color.");
        }

        setUserInput(''); // Clear input after processing
    };

    return (
        <div className="learn-container">
            <Navbar />
            <div className="main-content flex">
                <div className="left-section bg-color-1"></div>
                <div className="center-section flex flex-col items-center justify-center">
                    <h1 className="text-blue-900 text-3xl font-bold text-center mb-6">MakaTalk</h1>
                    
                    {/* Lazy load Webcam component */}
                    <Suspense fallback={<div>Loading Webcam...</div>}>
                        <Webcam />
                    </Suspense>

                    <div className="interface-card">
                        <h2 className="text-2xl font-bold mb-4">User & AI Interface</h2>

                        {/* Language dropdown and speech recognition button */}
                        <div className="language-and-speech flex items-center mb-4">
                            <LanguageDropdown 
                                selectedLanguage={selectedLanguage} 
                                onLanguageChange={handleLanguageChange} 
                            />
                            {/* VoiceToVoiceButton replaces the TextToSpeechButton */}
                            <VoiceToVoiceButton
                                selectedLanguage={selectedLanguage}
                                onSpeechInput={handleSpeechInput} // Handle speech input from VoiceToVoiceButton
                            />
                        </div>

                        {/* User and AI interaction */}
                        <UserAiResponse 
                            aiResponse={aiResponse}
                            userInput={userInput}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                        />

                        {/* Lazy load Help component */}
                        <Suspense fallback={<div>Loading Help...</div>}>
                            <Help setUserInput={setUserInput} />
                        </Suspense>

                        {/* Show image and instructions if available */}
                        {selectedImage && (
                            <div className="mt-4">
                                <img src={selectedImage} alt="Selected" className="w-full mt-4" />
                                <p>{instructions}</p>
                            </div>
                        )}

                        {/* Text-to-Speech for AI response */}
                        {aiResponse && <TextToSpeech text={aiResponse} selectedLanguage={selectedLanguage} />}
                    </div>
                </div>
                <div className="right-section bg-color-2"></div>
            </div>
        </div>
    );
};

export default Learn;







