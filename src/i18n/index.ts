import {createI18n} from 'vue-i18n';
import en from './locales/en';

const instance = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {en},
});

export default instance;

export const i18n = instance.global;
