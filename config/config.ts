import { defineConfig } from 'umi';
import { routes } from './route';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/loading'
  },
  history: { type: 'hash' },
  publicPath: '/',
  runtimePublicPath: true,
  layout: {
    name: 'Ant Design',
    locale: true,
  },
  routes: routes
});
