import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { openDatabaseSync } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen: React.FC = () => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const db = openDatabaseSync('comparapreco.db');
    const router = useRouter();

    const handleClearData = () => {
        Alert.alert(
            'Limpar Dados',
            'Tem certeza que deseja limpar todos os dados do aplicativo? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await db.execAsync('DELETE FROM product_presentations;');
                            await db.execAsync('DELETE FROM products;');
                            await db.execAsync('DELETE FROM categories WHERE id > 5;');

                            Alert.alert('Sucesso', 'Todos os dados foram limpos com sucesso!');
                        } catch (error) {
                            console.error('Erro ao limpar dados:', error);
                            Alert.alert('Erro', 'Não foi possível limpar os dados.');
                        }

                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Configurações</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Aparência</Text>

                    <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.settingLabel, { color: theme.text }]}>Tema Escuro</Text>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: theme.primary + '80' }}
                            thumbColor={isDarkMode ? theme.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Sobre</Text>

                    <View style={[styles.aboutCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.appName, { color: theme.text }]}>ComparaPreço</Text>
                        <Text style={[styles.appVersion, { color: theme.text }]}>Versão 1.0.0</Text>
                        <Text style={[styles.appDescription, { color: theme.text }]}>
                            Um aplicativo para comparar preços de produtos em diferentes apresentações e encontrar o melhor custo-benefício.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        flex: 1,
    },
    section: {
        padding: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingLabel: {
        fontSize: 16,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    dangerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    warningText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
    },
    aboutCard: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        marginBottom: 12,
    },
    appDescription: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default SettingsScreen; 