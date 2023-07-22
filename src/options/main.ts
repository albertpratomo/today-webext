import {createApp} from 'vue';
import {vOnClickOutside} from '@vueuse/components';
import App from './Options.vue';
import {setupApp} from '~/utils/setupApp';
import '../styles';

const app = createApp(App);
setupApp(app);
app.directive('on-click-outside', vOnClickOutside);
app.mount('#app');
