import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
<<<<<<< HEAD
        // Check if there's a saved theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        // Update localStorage and document class when theme changes
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
=======
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    useEffect(() => {
>>>>>>> ad028a9bdf55b89b5bbc742d4232ba4343b39752
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
<<<<<<< HEAD
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
=======
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
>>>>>>> ad028a9bdf55b89b5bbc742d4232ba4343b39752
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 