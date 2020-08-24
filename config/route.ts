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
    path: '/template',
    exact: true,
    name: '模板管理',
    component: '@/pages/template',
  },
  {
    path: '/template/add',
    exact: true,
    component: '@/pages/template/add',
  },
  {
    path: '/template/edit/:id',
    exact: true,
    component: '@/pages/template/edit',
  },
  {
    path: '/verification',
    exact: true,
    name: '鉴定日志',
    component: '@/pages/verification',
  },
  {
    path: '/verification/add/:id',
    exact: true,
    component: '@/pages/verification/add',
  },
  {
    path: '/verification/edit/:id?',
    exact: true,
    component: '@/pages/verification/edit',
  },
  {
    path: '/verification/log/:id?',
    exact: true,
    component: '@/pages/verification/log',
  },
  {
    path: '/log/login',
    exact: true,
    component: '@/pages/log/login',
  },
  {
    path: '/log/operate',
    exact: true,
    component: '@/pages/log/operate',
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
