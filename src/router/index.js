import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/signup.vue'),
  },
  {
    path: '/channels/:channel',
    name: 'channel',
    component: () => import('../views/channel.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn
      && store.getters.getUser !== undefined
      && Object.entries(store.getters.getUser).length > 0
    ) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
