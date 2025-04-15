import React from 'react';

const Navbar = () => {
  return (
    <div className="flex items-center justify-e p-3 bg-gray-100 text-blue-900">
      <img src="/images/MakaTalkLogo.svg" alt="Logo" className="h-12 w-auto ml-5" /> {/* Logo aligned to the left */}
      <div className="flex space-x-10 mr-5">
        <p className="cursor-pointer hover:text-black">Home</p>
        <p className="cursor-pointer hover:text-black">Learn</p>
        <p className="cursor-pointer hover:text-black">Settings</p>
      </div>
    </div>
  );
}

export default Navbar;


