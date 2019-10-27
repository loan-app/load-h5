import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import storeOrderHistory from '@/views/order/store_order_history.vue';
import storeOrderDetail from '@/views/order/store_order_detail.vue';
import storeOrderApply from '@/views/order/store_order_apply.vue';
import storeOrderRepay from '@/views/order/store_order_repay.vue';
import storePayReturn from '@/views/order/store_pay_return.vue';
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
    path: '/order/store_order_history',
    name: 'store_order_history',
    component: storeOrderHistory
  },
  {
    path: '/order/store_order_detail',
    name: 'store_order_detail',
    component: storeOrderDetail
  },
  {
    path: '/order/store_order_apply',
    name: 'store_order_apply',
    component: storeOrderApply
  },
  {
    path: '/order/store_order_repay',
    name: 'store_order_repay',
    component: storeOrderRepay
  },
  {
    path: '/order/store_pay_return',
    name: 'store_pay_return',
    component: storePayReturn
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
  routes,
  mode: 'history'
});

export default router;
