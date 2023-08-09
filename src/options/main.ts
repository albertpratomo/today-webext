import '../styles';
import App from './Options.vue';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import router from '~/options/pages/_router';
import {setupApp} from '~/utils/setupApp';
import {vOnClickOutside} from '@vueuse/components';

const app = createApp(App);
setupApp(app);

const pinia = createPinia();
app.use(pinia);

app.use(router);
app.directive('on-click-outside', vOnClickOutside);
app.mount('#app');
