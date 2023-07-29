import type {App} from 'vue';
import i18n from '~/i18n';

export function setupApp(app: App) {
    app.config.globalProperties.$app = {
        context: '',
    };

    app.provide('app', app.config.globalProperties.$app);

    app.use(i18n);
}
