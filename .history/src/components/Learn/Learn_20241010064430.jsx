import React, { useState } from 'react';
import './learn.css'; 
import Navbar from '../LandingPage/Navbar';
import Webcam from './Webcam/Webcam';
import colorOptions from '../Choices/Colors/Colors'; 
import Help from './Help/Help';
import LanguageDropdown from '../Languagedropdown/Language';
import UserAiResponse from '../UserAiResponse/UserAiResponse';
import V

const Learn = () => {
    const [userInput, setUserInput] = useState(''); // User's typed input or speech transcription
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language is English
    const [selectedImage, setSelectedImage] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [aiResponse, setAiResponse] = useState('What do you want to learn today?');
    const [step, setStep] = useState(0);

    // Handle text input change from user
    const handleInputChange = (event) => setUserInput(event.target.value.toLowerCase().trim());

    // Handle speech input (from TTS)
    const handleSpeechInput = (transcript) => setUserInput(transcript.toLowerCase().trim());

    // Handle language change for dropdown
    const handleLanguageChange = (event) => setSelectedLanguage(event.target.value);

    // Handle form submission or AI response logic
    const handleSubmit = () => {
        const colorData = colorOptions[userInput];
        if (!userInput) return setAiResponse("Please enter a color or a question.");
        
        if (step === 0 && userInput.includes('color')) {
            setAiResponse('Great! Which color do you want to learn?');
            return setStep(1);
        }

        if (colorData) {
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
                    
                    <Webcam />

                    <div className="interface-card">
                        <h2 className="text-2xl font-bold mb-4">User & AI Interface</h2>

                        {/* Language dropdown and speech recognition button */}
                        <div className="language-and-speech flex items-center mb-4">
                            <LanguageDropdown 
                                selectedLanguage={selectedLanguage} 
                                onLanguageChange={handleLanguageChange} 
                            />
                            <TextToSpeechButton 
                                selectedLanguage={selectedLanguage} 
                                onSpeechInput={handleSpeechInput} // Pass speech input handler
                            />
                        </div>

                        {/* User and AI interaction */}
                        <UserAiResponse 
                            aiResponse={aiResponse}
                            userInput={userInput}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                        />
                        <Help setUserInput={setUserInput} />

                        {selectedImage && (
                            <div className="mt-4">
                                <img src={selectedImage} alt="Selected" className="w-full mt-4" />
                                <p>{instructions}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="right-section bg-color-2"></div>
            </div>
        </div>
    );
}

export default Learn;







