import '../styles';
import App from './Popup.vue';
import {createApp} from 'vue';
import {setupApp} from '~/utils/setupApp';

const app = createApp(App);
setupApp(app);
app.mount('#app');
