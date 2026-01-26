// Simple date formatter for Geographic components
export function formatDate(date: Date | string): string {
    if (typeof date === 'string') {
        return date;
    }
    if (!date) {
        return '';
    }
    return date.toISOString().split('T')[0];
}
