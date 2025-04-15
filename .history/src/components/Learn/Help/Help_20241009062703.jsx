import React, { useState } from 'react';
import GifStore from '../../GifStore/GifStore';

const Help = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [helpOption, setHelpOption] = useState('');
  const [selectedGif, setSelectedGif] = useState('');

  const toggleHelpMenu = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHelpOption(''); // Reset when closing
      setSelectedGif('');
    }
  };

  const handleOptionSelect = (option) => {
    setHelpOption(option);
    setIsOpen(false);
  };

  const handleColorSelect = (color) => {
    const gif = GifStore.getGif(color);
    setSelectedGif(gif || '');
    if (!gif) console.error(`GIF not found for the color: ${color}`);
  };

  const renderHelpOptions = () => (
    <div className="help-options bg-white border rounded shadow-md mt-2 p-4">
      <h3 className="font-bold mb-2">Select Help Option:</h3>
      {['AI', 'GIFs'].map((option) => (
        <button key={option} className="common-button" onClick={() => handleOptionSelect(option)}>
          Help from {option}
        </button>
      ))}
    </div>
  );

  const renderGifHelp = () => (
    <div className="gif-help mt-4">
      <h4 className="font-bold">Select a color for GIF help:</h4>
      {GifStore.colorGifs && Object.keys(GifStore.colorGifs).length > 0 ? (
        Object.keys(GifStore.colorGifs).map((color) => (
          <button key={color} className="common-button m-1" onClick={() => handleColorSelect(color)}>
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </button>
        ))
      ) : (
        <p>No GIFs available. Please check GifStore configuration.</p>
      )}
      {selectedGif && <img src={selectedGif} alt="Color GIF" className="mt-2 w-full" />}
    </div>
  );

  return (
    <div className="flex flex-col items-center mt-10">
      <button className="common-button" onClick={toggleHelpMenu}>Help</button>
      {isOpen && renderHelpOptions()}
      {helpOption === 'GIFs' && renderGifHelp()}
    </div>
  );
};

export default Help;






