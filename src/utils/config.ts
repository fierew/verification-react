const type = window.location.protocol;
const url = window.location.host;

declare global {
  interface Window {
    publicPath: string;
  }
}

export const httpUrl =
  window.publicPath === '/' ? 'http://localhost:8080' : type + '//' + url;
