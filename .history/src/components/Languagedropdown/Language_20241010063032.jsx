import React from 'react';

const LanguageDropdown = ({ selectedLanguage, onLanguageChange }) => {
  // Define the available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese' },
    // Add more languages as needed
  ];

  return (
    <div className="language-dropdown mb-4">
      <label htmlFor="languageSelect" className="font-bold mr-2">
        Select Language:
      </label>
      <select
        id="languageSelect"
        value={selectedLanguage}
        onChange={onLanguageChange} // Pass the handler from the parent
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

export default LanguageDropdown;
