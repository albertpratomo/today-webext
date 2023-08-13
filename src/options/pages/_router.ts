import {createRouter, createWebHashHistory} from 'vue-router';
import Index from './Index.vue';
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
