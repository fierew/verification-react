import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  { path: '/', redirect: '/template' },
  {
    path: '/login',
    component: '@/pages/login',
    title: '登录',
    layout: {
      hideMenu: true,
      hideNav: true,
    },
  },
  {
    path: '/template/:type?/:id?',
    name: '模板管理',
    component: '@/pages/template',
  },
  {
    path: '/500',
    exact: true,
    component: '@/pages/500',
    layout: {
      hideMenu: true,
      hideNav: true,
    },
  },
  {
    path: '/403',
    exact: true,
    component: '@/pages/403',
    layout: {
      hideMenu: true,
      hideNav: true,
    },
  },
  {
    component: '@/pages/404',
    layout: {
      hideMenu: true,
      hideNav: true,
    },
  },
];
