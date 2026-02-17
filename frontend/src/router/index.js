import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import DoctorSlots from '../views/DoctorSlots.vue';
import MyAppointments from '../views/MyAppointments.vue';
import DoctorDashboard from '../views/DoctorDashboard.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: Home 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: Login 
  },
  { 
    path: '/doctor/:id', 
    name: 'DoctorSlots',
    component: DoctorSlots 
  },
  { 
    path: '/my-appointments', 
    name: 'MyAppointments',
    component: MyAppointments,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next('/login');
      } else {
        next();
      }
    }
  },
{ 
    path: '/dashboard', 
    name: 'DoctorDashboard',
    component: DoctorDashboard
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;