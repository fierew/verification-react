import React from 'react';
import request from '@/utils/request';
import { UseRequestProvider } from 'ahooks';
import { history } from 'umi';
import { StarOutlined } from '@ant-design/icons';

export const layout = {
  logout: () => {
    sessionStorage.setItem('email', '');
    sessionStorage.setItem('userId', '');
    sessionStorage.setItem('Authorization', '');
    history.push('/login');
  },
  patchMenus: (menus: any) => {
    menus = [
      {
        name: '模板管理',
        icon: <StarOutlined />,
        path: '/template',
      },
      {
        name: '鉴定日志',
        icon: <StarOutlined />,
        path: '/verification',
      },
      {
        name: '登录日志',
        icon: <StarOutlined />,
        path: '/log/login',
      },
      {
        name: '操作日志',
        icon: <StarOutlined />,
        path: '/log/operate',
      },
    ];

    return menus;
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
  const email = sessionStorage.getItem('email');
  const userId = sessionStorage.getItem('userId');

  return {
    userid: userId,
    name: email,
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
