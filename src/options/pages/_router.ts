import {createRouter, createWebHashHistory} from 'vue-router';
import Index from './Index.vue';
import Pomodoro from './Pomodoro.vue';
import Trash from './Trash.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
        },
        {
            path: '/pomodoro',
            name: 'pomodoro',
            component: Pomodoro,
        },
        {
            path: '/trash',
            name: 'trash',
            component: Trash,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;
