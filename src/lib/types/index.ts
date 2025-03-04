export interface Category {
    id: number;
    name: string;
    created_at?: string;
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    category_name?: string;
    unit_measure: string;
    created_at?: string;
    presentations?: ProductPresentation[];
}

export interface ProductPresentation {
    id: number;
    product_id: number;
    price: number;
    quantity: number;
    store?: string;
    date: string;
    notes?: string;
}

export type UnitMeasure = 'ml' | 'l' | 'g' | 'kg' | 'un' | 'm' | 'cm';

export interface ThemeColors {
    background: string;
    card: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    error: string;
    success: string;
}

export interface DatabaseContextType {
    getCategories: () => Promise<Category[]>;
    addCategory: (name: string) => Promise<number>;
    getProducts: (categoryId?: number | null) => Promise<Product[]>;
    addProduct: (name: string, categoryId: number, unitMeasure: string) => Promise<number>;
    getProductPresentations: (productId: number) => Promise<ProductPresentation[]>;
    addProductPresentation: (
        productId: number,
        price: number,
        quantity: number,
        store?: string,
        notes?: string
    ) => Promise<number>;
    getProductWithPresentations: (productId: number) => Promise<Product>;
    isLoading?: boolean;
    error?: Error | null;
}

export interface ThemeContextType {
    theme: ThemeColors;
    isDarkMode: boolean;
    toggleTheme: () => Promise<void>;
} 