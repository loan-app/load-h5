import io from './axios';

// 获取用户账单列表
export const getOrderList = data => io.request({
  url: 'order/loan_order_records',
  method: 'post',
  data
});

// 获取订单详情
export const getOrderDetail = data => io.request({
  url: '/order/loan_order_detail',
  method: 'post',
  data: data
});

export const orderConfirm = data => io.request({
  url: '/order/order_confirm',
  method: 'post',
  data: data
});

export const orderSubmit = data => io.request({
  url: '/order/order_submit',
  method: 'post',
  data: data
});

export const getRepayChannel = data => io.request({
  url: '/order/repay_channel',
  method: 'post',
  data: data
});

export const getRepayInfo = data => io.request({
  url: '/order/repay_info',
  method: 'post',
  data: data
});

// 易宝还款
export const orderRepay = data => io.request({
  url: '/order/order_repay',
  method: 'post',
  data: data
});



