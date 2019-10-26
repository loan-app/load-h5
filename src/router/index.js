import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import storeOrderHistory from '@/views/order/store_order_history.vue';
import storeOrderDetail from '@/views/order/store_order_detail.vue';
import bankCard from '@/views/user/bank_card.vue';
import bankCardBind from '@/views/user/bank_card_bind.vue';
import bankCardCode from '@/views/user/bank_card_code.vue';
import registar from '@/views/agreement/registar.vue';
import register from '@/views/agreement/register.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/order/store-order-history',
    name: 'store-order-history',
    component: storeOrderHistory
  },
  {
    path: '/order/store-order-detail',
    name: 'store-order-detail',
    component: storeOrderDetail
  },
  {
    path: '/user/bank_card',
    name: 'bank_card',
    component: bankCard
  },
  {
    path: '/user/bank_card_bind',
    name: 'bank_card_bind',
    component: bankCardBind
  },
  {
    path: '/user/bank_card_code',
    name: 'bank_card_code',
    component: bankCardCode
  },
  {
    path: '/agreement/registar',
    name: 'registar',
    component: registar
  },
  {
    path: '/agreement/register',
    name: 'register',
    component: register
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
