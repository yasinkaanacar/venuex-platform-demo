// Formatters for currency, numbers and percentages

export const fCurrency = (value: number): string => {
    if (value >= 1000000) {
        return `₺${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `₺${(value / 1000).toFixed(0)}K`;
    }
    return `₺${value.toLocaleString('tr-TR')}`;
};

export const fNumber = (value: number): string => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString('tr-TR');
};

export const fPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
};


// Real translation hook integration
import { useTranslation } from '@/contexts/LanguageContext';

function getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
}

export const useLocales = () => {
    const { t: translations } = useTranslation();
    return {
        t: (key: string) => getNestedValue(translations, key),
        translate: (key: string, options?: any) => {
            let text = getNestedValue(translations, key);
            if (options && typeof text === 'string') {
                Object.keys(options).forEach(k => {
                    text = text.replace(new RegExp(`{{${k}}}|{${k}}`, 'g'), options[k]);
                });
            }
            return text;
        }
    };
};

export const useSetup = () => ({
    isLoading: false,
    isGoogleAdsEnabled: true,
    isMetaConversionsConnected: true,
    isMetaAdAccountEnabled: true,
    isTiktokEventsConnected: true
});

export const useBrandContext = () => ({
    brandId: "demo-brand-123"
});
