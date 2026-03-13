import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-300 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} John Doe. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Built with React, Tailwind CSS, and lots of ♥️
        </p>
      </div>
    </footer>
  );
};

export default Footer;