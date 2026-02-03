import en from './en.json';
import tr from './tr.json';

export type Language = 'en' | 'tr';
export type TranslationKeys = typeof en;

export const translations: Record<Language, TranslationKeys> = {
    en,
    tr,
};

export { en, tr };
