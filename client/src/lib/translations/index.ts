import { en } from './en';
import { tr } from './tr';

export type Language = 'en' | 'tr';
export type TranslationKeys = typeof en;

export const translations: Record<Language, TranslationKeys> = {
    en,
    tr,
};

export { en, tr };
