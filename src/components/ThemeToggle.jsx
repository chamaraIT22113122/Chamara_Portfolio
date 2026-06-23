import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      }
      return newMode;
    });
  };

  return (
    <button 
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: isLightMode ? '#333' : '#f4f6f9',
        color: isLightMode ? '#f4f6f9' : '#333',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        zIndex: 9999,
        fontSize: '24px',
        transition: '0.3s'
      }}
      title="Toggle Light/Dark Mode"
    >
      <i className={`bx ${isLightMode ? 'bx-moon' : 'bx-sun'}`}></i>
    </button>
  );
};

export default ThemeToggle;
