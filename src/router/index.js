// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '@/components/SignIn.vue';
import HomePage from '@/components/HomePage.vue';
import { getAuth } from 'firebase/auth';

const routes = [
  { path: '/', component: SignIn },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!user) {
        next('/');
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router;
