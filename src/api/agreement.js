import io from './axios';

export const getMechantInfo = data => io.request({
  url: '/mechant_info',
  method: 'post',
  data
});
