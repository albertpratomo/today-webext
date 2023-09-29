import {createRouter, createWebHashHistory} from 'vue-router';
import Index from './Index.vue';
import Library from './Library.vue';
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
            path: '/library',
            name: 'library',
            component: Library,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;
