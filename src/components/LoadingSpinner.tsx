import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../lib/contexts/ThemeContext';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner = ({ message = 'Carregando...' }: LoadingSpinnerProps) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.text, { color: theme.text }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        fontSize: 18,
        marginTop: 12,
    },
}); 