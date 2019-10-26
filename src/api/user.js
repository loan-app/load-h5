import io from './axios';

export const getBankInfo = data => io.request({
  url: '/bank_info',
  method: 'post',
  data
});

export const getBankCardInfo = data => io.request({
  url: '/bank_card_info',
  method: 'post',
  data
});

export const getBankUserName = data => io.request({
  url: '/bank_user',
  method: 'post',
  data
});

export const getBankCardCode = data => io.request({
  url: '/bank_card_code',
  method: 'post',
  data
});

export const getBankName = data => io.request({
  url: '/bank_name',
  method: 'post',
  data
});

export const getBankList = data => io.request({
  url: '/bank_list',
  method: 'post',
  data
});

export const bankBind = data => io.request({
  url: '/bank_bind',
  method: 'post',
  data
});
