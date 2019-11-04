import io from './axios';

export const checkVersion = data => io.request({
  url: '/check_version',
  method: 'post',
  data
});
