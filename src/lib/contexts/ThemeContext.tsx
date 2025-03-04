import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeColors, ThemeContextType } from '../types';

// Definição dos temas
const lightTheme: ThemeColors = {
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#333333',
    primary: '#4CAF50',
    secondary: '#2196F3',
    border: '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
};

const darkTheme: ThemeColors = {
    background: '#083043',
    card: '#474852',
    text: '#FFFFFF',
    primary: '#BA94E2',
    secondary: '#64B5F6',
    border: '#333333',
    error: '#E57373',
    success: '#BA94E2',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const deviceTheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceTheme === 'dark');
    const [theme, setTheme] = useState<ThemeColors>(isDarkMode ? darkTheme : lightTheme);

    // Carregar preferência de tema salva
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('themePreference');
                if (savedTheme !== null) {
                    const isDark = savedTheme === 'dark';
                    setIsDarkMode(isDark);
                    setTheme(isDark ? darkTheme : lightTheme);
                }
            } catch (error) {
                console.error('Erro ao carregar preferência de tema:', error);
            }
        };

        loadThemePreference();
    }, []);

    // Alternar entre temas
    const toggleTheme = async () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        setTheme(newIsDarkMode ? darkTheme : lightTheme);

        try {
            await AsyncStorage.setItem('themePreference', newIsDarkMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Erro ao salvar preferência de tema:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}; 