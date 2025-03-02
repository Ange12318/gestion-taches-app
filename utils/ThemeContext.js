import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      accentColor: '#2ecc71',
      cardBackground: '#ffffff',
      secondaryButtonBlue: '#3498db',
      secondaryButtonRed: '#e74c3c',
    },
    dark: {
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      accentColor: '#27ae60',
      cardBackground: '#2c2c2c',
      secondaryButtonBlue: '#5dade2',
      secondaryButtonRed: '#e74c3c',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles: themeStyles[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);