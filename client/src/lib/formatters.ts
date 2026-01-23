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

// Mock hooks to replace atomic library hooks
export const useLocales = () => ({
    t: (key: string) => key.split('.').pop() || key,
    translate: (key: string, _params?: any) => key.split('.').pop() || key
});

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
