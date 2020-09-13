import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  { path: '/', component: '@/pages/index' },
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
    access: '/template',
  },
  {
    path: '/template/add',
    exact: true,
    component: '@/pages/template/add',
    access: '/template/add',
  },
  {
    path: '/template/edit/:id',
    exact: true,
    component: '@/pages/template/edit',
    access: '/template/edit',
  },
  {
    path: '/verification',
    exact: true,
    name: '鉴定日志',
    component: '@/pages/verification',
    access: '/verification',
  },
  {
    path: '/verification/add/:id',
    exact: true,
    component: '@/pages/verification/add',
    access: '/verification/add',
  },
  {
    path: '/verification/edit/:id?',
    exact: true,
    component: '@/pages/verification/edit',
    access: '/verification/edit',
  },
  {
    path: '/verification/log/:id?',
    exact: true,
    component: '@/pages/verification/log',
    access: '/verification/log',
  },
  {
    path: '/rbac',
    exact: true,
    redirect: '/rbac/user',
  },
  {
    path: '/rbac/dept',
    exact: true,
    component: '@/pages/rbac/dept',
    access: '/rbac/dept',
  },
  {
    path: '/rbac/resource',
    exact: true,
    component: '@/pages/rbac/resource',
    access: '/rbac/resource',
  },
  {
    path: '/rbac/role',
    exact: true,
    component: '@/pages/rbac/role',
    access: '/rbac/role',
  },
  {
    path: '/rbac/user',
    exact: true,
    component: '@/pages/rbac/user',
    access: '/rbac/user',
  },
  {
    path: '/log/login',
    exact: true,
    component: '@/pages/log/login',
    access: '/log/login',
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
