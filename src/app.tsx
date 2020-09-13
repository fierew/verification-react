import React from 'react';
import request from '@/utils/request';
import { UseRequestProvider } from 'ahooks';
import { history } from 'umi';
import { message } from 'antd';
import renderRightContent from '@/component/renderRightContent';
import { ILayoutRuntimeConfig } from '@umijs/plugin-layout/src/types/interface.d';
import { MenuDataItem } from '@ant-design/pro-layout';
import { iconNames, iconModels } from '@/utils/iconNames';

export const layout = {
  logout: () => {
    sessionStorage.setItem('Authorization', '');
    history.push('/login');
  },
  rightRender: (
    initialState: any,
    setInitialState: any,
    runtimeLayout: ILayoutRuntimeConfig,
  ) => {
    return renderRightContent(runtimeLayout, initialState, setInitialState);
  },
  patchMenus: (menus: any, initial: any) => {
    const init = initial ?? [];

    const initialState = init.initialState ?? [];
    return loopMenuItem(initialState.menu ?? []);

    // menus = [
    //   {
    //     name: '模板管理',
    //     icon: <StarOutlined />,
    //     path: '/template',
    //   },
    //   {
    //     name: '鉴定日志',
    //     icon: <StarOutlined />,
    //     path: '/verification',
    //   },
    //   {
    //     name: '权限管理',
    //     icon: <StarOutlined />,
    //     path: '/rbac',
    //     children: [
    //       {
    //         name: '机构管理',
    //         icon: <StarOutlined />,
    //         path: 'dept',
    //       },
    //       {
    //         name: '资源管理',
    //         icon: <StarOutlined />,
    //         path: 'resource',
    //       },
    //       {
    //         name: '角色管理',
    //         icon: <StarOutlined />,
    //         path: 'role',
    //       },
    //       {
    //         name: '用户管理',
    //         icon: <StarOutlined />,
    //         path: 'user',
    //       },
    //     ],
    //   },
    //   // {
    //   //   name: '操作日志',
    //   //   icon: <StarOutlined />,
    //   //   path: '/log/operate',
    //   // },
    // ];

    //return menu.data;
  },
  childrenRender: (children: React.ReactNode) => {
    return (
      <UseRequestProvider
        value={{
          requestMethod: (param: any) => request(param.url, param),
        }}
      >
        {children}
      </UseRequestProvider>
    );
  },
};

export async function getInitialState() {
  // const email = sessionStorage.getItem('email');
  // const userId = sessionStorage.getItem('userId');
  const res = await request('/rbac/user/getInfo');

  if (res.code !== 200) {
    message.error(res.msg);
    return;
  }

  const auth = await request('/rbac/auth/getAll');

  const menu = await request('/rbac/auth/getMenu');

  return {
    name: res.data.email,
    userInfo: res.data,
    auth: auth.data,
    menu: menu.data,
  };
}

// 在初始加载和路由切换时做一些事情
export async function onRouteChange({ location, routes, action }: any) {
  // 获取sessionStorage的用户登录信息
  const token = sessionStorage.getItem('Authorization');
  if (location.pathname !== '/login' && !token) {
    history.push('/login');
  }
}

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: icon && iconModels[icon as string],
    children: children && loopMenuItem(children),
  }));
