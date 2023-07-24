import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {vOnClickOutside} from '@vueuse/components';
import App from './Options.vue';
import {setupApp} from '~/utils/setupApp';
import '../styles';

const app = createApp(App);
setupApp(app);

const pinia = createPinia();
app.use(pinia);

app.directive('on-click-outside', vOnClickOutside);
app.mount('#app');
