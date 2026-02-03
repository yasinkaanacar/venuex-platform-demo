import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKeys } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        // Get from localStorage or default to 'en'
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('venuex-language');
            if (saved === 'en' || saved === 'tr') {
                return saved;
            }
        }
        return 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('venuex-language', lang);
    };

    useEffect(() => {
        // Sync with localStorage on mount
        const saved = localStorage.getItem('venuex-language');
        if (saved === 'en' || saved === 'tr') {
            setLanguageState(saved);
        }
    }, []);

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Helper hook for just translations
export function useTranslation() {
    const { t, language } = useLanguage();
    return { t, language };
}
