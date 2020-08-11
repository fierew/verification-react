import { defineConfig } from 'umi';
import { routes } from './route';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/loading',
  },
  history: { type: 'hash' },
  publicPath: '/',
  runtimePublicPath: true,
  layout: {
    name: '计量器具检定管理',
    locale: true,
  },
  routes: routes,
});
