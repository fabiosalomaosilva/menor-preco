import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const UNITS = ['ml', 'L', 'g', 'kg', 'un'];

const AddPresentationScreen = () => {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();

    const [loading, setLoading] = useState<boolean>(false);
    const [selectedUnit, setSelectedUnit] = useState<string>('ml');
    const [presentations, setPresentations] = useState([
        { id: 1, name: 'Produto 1', price: '', quantity: '', unitValue: null }
    ]);

    const calculateUnitValue = (price: string, quantity: string) => {
        const priceNum = parseFloat(price.replace(',', '.'));
        const quantityNum = parseFloat(quantity.replace(',', '.'));

        if (isNaN(priceNum) || isNaN(quantityNum) || quantityNum === 0) {
            return null;
        }

        return priceNum / quantityNum;
    };

    const updatePresentation = (id: number, field: string, value: string) => {
        const updatedPresentations = presentations.map(p => {
            if (p.id === id) {
                const updated = { ...p, [field]: value };

                // Recalcular o valor unitário sempre que price ou quantity mudar
                if (field === 'price' || field === 'quantity') {
                    const unitValue = calculateUnitValue(
                        field === 'price' ? value : p.price,
                        field === 'quantity' ? value : p.quantity
                    );
                    updated.unitValue = unitValue;
                }

                return updated;
            }
            return p;
        });

        setPresentations(updatedPresentations);
    };

    const addNewProduct = () => {
        const newId = Math.max(...presentations.map(p => p.id), 0) + 1;
        setPresentations([
            ...presentations,
            { id: newId, name: `Produto ${newId}`, price: '', quantity: '', unitValue: null }
        ]);
    };

    const getBestValue = () => {
        const validPresentations = presentations.filter(p => p.unitValue !== null);
        if (validPresentations.length < 2) return null;

        const bestValue = validPresentations.reduce((prev, current) =>
            (prev.unitValue! < current.unitValue!) ? prev : current
        );

        return bestValue.id;
    };

    const handleSave = async () => {
        // Implemente a lógica de salvamento aqui
        Alert.alert("Sucesso", "Apresentações salvas com sucesso!");
    };

    const resetComparison = () => {
        setPresentations([
            { id: 1, name: 'Produto 1', price: '', quantity: '', unitValue: null }
        ]);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const bestValueId = getBestValue();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>

            <View style={styles.header}>
                <View style={styles.placeholder} />
                <View style={styles.headerTitleContainer}>
                    <Ionicons name="calculator-outline" size={24} color={theme.text} />
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Comparar Produtos</Text>
                </View>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => router.push('/screens/SettingsScreen')}
                >
                    <Ionicons name="settings-outline" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.unitsContainer}>
                {UNITS.map(unit => (
                    <TouchableOpacity
                        key={unit}
                        style={[
                            styles.unitButton,
                            { backgroundColor: selectedUnit === unit ? theme.primary : theme.card }
                        ]}
                        onPress={() => setSelectedUnit(unit)}
                    >
                        <Text
                            style={[styles.unitText,
                            { color: selectedUnit === unit ? '#fff' : theme.text }
                            ]}
                        >
                            {unit}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.scrollContainer}>
                {presentations.map(presentation => (
                    <View
                        key={presentation.id}
                        style={[
                            styles.productCard,
                            { backgroundColor: theme.card },
                            bestValueId === presentation.id && { borderColor: '#4CAF50', borderWidth: 2 }
                        ]}
                    >
                        <View style={styles.productHeader}>
                            <Text style={[styles.productTitle, { color: theme.text }]}>
                                {presentation.name}
                            </Text>
                            {bestValueId === presentation.id && (
                                <View style={styles.bestValueTag}>
                                    <Text style={styles.bestValueText}>Melhor valor</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Preço:</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                                value={presentation.price}
                                onChangeText={(value) => updatePresentation(presentation.id, 'price', value)}
                                placeholder="R$0,00"
                                placeholderTextColor={theme.secondary}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Tamanho:</Text>
                            <View style={styles.quantityContainer}>
                                <TextInput
                                    style={[styles.quantityInput, { backgroundColor: theme.background, color: theme.text }]}
                                    value={presentation.quantity}
                                    onChangeText={(value) => updatePresentation(presentation.id, 'quantity', value)}
                                    placeholder="0"
                                    placeholderTextColor={theme.secondary}
                                    keyboardType="decimal-pad"
                                />
                                <Text style={[styles.unitLabel, { color: theme.text }]}>{selectedUnit}</Text>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Preço por {selectedUnit}:</Text>
                            <View
                                style={[
                                    styles.unitValueContainer,
                                    {
                                        backgroundColor: bestValueId === presentation.id
                                            ? '#1B5E20'  // Verde mais escuro para tema dark
                                            : theme.background
                                    }
                                ]}
                            >
                                <Text style={[styles.unitValue, { color: theme.text }]}>
                                    {presentation.unitValue !== null && typeof presentation.unitValue === 'number'
                                        ? `R$ ${presentation.unitValue.toFixed(2).replace('.', ',')}/${selectedUnit}`
                                        : '-'
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.primary }]}
                    onPress={addNewProduct}
                >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>Adicionar produto</Text>
                </TouchableOpacity>

                {presentations.length > 1 && (
                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: theme.primary }]}
                        onPress={resetComparison}
                    >
                        <Text style={styles.resetButtonText}>Nova comparação</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
    unitsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
    },
    unitButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        minWidth: 60,
    },
    unitText: {
        fontWeight: '500',
    },
    scrollContainer: {
        flex: 1,
    },
    productCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bestValueTag: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    bestValueText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
    },
    input: {
        height: 44,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityInput: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    unitLabel: {
        position: 'absolute',
        right: 12,
        fontSize: 16,
    },
    unitValueContainer: {
        height: 44,
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    unitValue: {
        fontSize: 16,
    },
    addButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    resetButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddPresentationScreen;