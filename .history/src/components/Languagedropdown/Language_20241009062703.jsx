import React, { useState } from 'react';

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English

  // Define the available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese' },
    // Add more languages as needed
  ];

  // Handle language selection
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    // Here you can also integrate the selected language with your text-to-speech functionality
  };

  return (
    <div className="language-dropdown">
      <label htmlFor="languageSelect" className="font-bold mr-2">
        Select Language:
      </label>
      <select
        id="languageSelect"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded p-2"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Language;
