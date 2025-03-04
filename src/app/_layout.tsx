import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { Slot, SplashScreen } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [error, setError] = useState<Error | null>(null);


    useEffect(() => {
        if (!error) {
            SplashScreen.hideAsync();
        }
    }, [error]);

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: 'red', marginBottom: 16, fontSize: 18 }}>
                    Erro ao conectar ao banco de dados:
                </Text>
                <Text style={{ textAlign: 'center' }}>{error.message}</Text>
            </View>
        );
    }

    return (
        <ThemeProvider>
            <Slot />
        </ThemeProvider>
    );
}