import '../styles';
import App from './Options.vue';
import {PiniaSharedState} from 'pinia-shared-state';
import VueTippy from 'vue-tippy';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import router from '~/options/pages/_router';
import {setupApp} from '~/utils/setupApp';
import {vOnClickOutside} from '@vueuse/components';

const app = createApp(App);
setupApp(app);

const pinia = createPinia();
pinia.use(PiniaSharedState({}));
app.use(pinia);
app.use(VueTippy, {
    defaultProps: {
        allowHTML: true,
        delay: 180,
        duration: 100,
    },
});

app.use(router);
app.directive('on-click-outside', vOnClickOutside);
app.mount('#app');
