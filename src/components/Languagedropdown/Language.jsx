import React from 'react';

const LanguageDropdown = ({ selectedLanguage, onLanguageChange, languages }) => {
  // Default language options in case languages aren't passed as props
  const defaultLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese' },
    // Add more languages as needed
  ];

  const availableLanguages = languages || defaultLanguages; // Use passed languages or default

  return (
    <div className="language-dropdown mb-4 mt-5">
      <label htmlFor="languageSelect" className="font-bold mr-2">
        Select Language:
      </label>
      <select
        id="languageSelect"
        aria-label="Select language"
        value={selectedLanguage}
        onChange={onLanguageChange} // Pass the handler from the parent
        className="border border-gray-300 rounded p-2"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
