export { default } from './request';

import entityMap from './entities';

export function parseText(article) {
  let content = article.replace(/(\r\n|\n|\r)/gm, '');
  for (let key in entityMap) {
    const re = new RegExp('&' + key + ';', 'g');
    content = content.replace(re, entityMap[key]);
  }
  const hReg = /<p[^>]*>(.*?)<\/p>/gm;
  const texts = content.match(hReg);

  if (texts) {
    return texts.map(item => {
      if (item.includes('</strong>')) {
        const tRe = /<p><strong[^>]*>(.*?)<\/strong><\/p>/g;
        return {
          type: 'title',
          value: item.replace(tRe, '$1'),
        };
      }
      return {
        type: 'text',
        value: item.replace(/<p[^>]*>(.*?)<\/p>/g, '$1'),
      };
    });
  }
}
