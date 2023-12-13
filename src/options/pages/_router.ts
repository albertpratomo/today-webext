import {createRouter, createWebHashHistory} from 'vue-router';
import Active from './Active.vue';
import Inbox from './Inbox.vue';
import Later from './Later.vue';
import Library from './Library.vue';
import Today from './Today.vue';
import Trash from './Trash.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'today',
            component: Today,
        },
        {
            path: '/inbox',
            name: 'inbox',
            component: Inbox,
        },
        {
            path: '/active',
            name: 'active',
            component: Active,
        },
        {
            path: '/later',
            name: 'later',
            component: Later,
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
