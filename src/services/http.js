import request from '../utils/request';

export async function getNews() {
  return request.get('/news');
}

export async function getNewsById(id) {
  return request.post('/news/detail', {
    id,
  });
}

export async function translate(q) {
  return request.post('/translate', {
    q,
  });
}
