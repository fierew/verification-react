import { httpUrl } from '@/utils/config';

const downloadUtils = (path: string, name: string) => {
  const url = httpUrl + path + `?runtime=${new Date().getTime()}`;
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: sessionStorage.getItem('Authorization') ?? '',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then(res =>
    res.blob().then((blob: Blob) => {
      const link = document.createElement('a');
      link.style.display = 'none';

      const disposition = res.headers.get('Content-disposition') ?? '';
      const fileName = disposition
        .split(';')[1]
        .split('=')[1]
        .replace(/"/g, '');

      link.download = decodeURI(fileName) ?? `${name}.docx`;
      link.href = URL.createObjectURL(blob);

      document.body.appendChild(link);
      link.click();

      // 释放URL对象已经移除a标签
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }),
  );
};

export default downloadUtils;
