import io from './axios';

export const checkVersion = data => io.request({
  url: '/check_version',
  method: 'post',
  data
});

export const getGraphCode = data => io.request({
  url: '/web/graph_code',
  method: 'post',
  data
});

export const getMobileCode = data => io.request({
  url: '/web/mobile_code',
  method: 'post',
  data
});

export const webRegister = data => io.request({
  url: '/web/register',
  method: 'post',
  data
});
