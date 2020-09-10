import { defineConfig } from 'umi';
import { routes } from './route';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  ignoreMomentLocale: true,
  dynamicImport: {
    loading: '@/loading',
  },
  history: { type: 'hash' },
  publicPath:
    'https://cdn.jsdelivr.net/gh/fierew/verification-react-cdn@v1.0.2/',
  // 'https://purge.jsdelivr.net/gh/fierew/verification-react-cdn@v1.0.0/',
  runtimePublicPath: true,
  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  layout: {
    name: '计量器具检定平台',
    locale: false,
  },
  routes: routes,
});
