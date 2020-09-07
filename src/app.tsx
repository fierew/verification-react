import React from 'react';
import request from '@/utils/request';
import { UseRequestProvider } from 'ahooks';
import { history } from 'umi';
import { StarOutlined } from '@ant-design/icons';
import { message } from 'antd';

export const layout = {
  logout: () => {
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
        name: '权限管理',
        icon: <StarOutlined />,
        path: '/rbac',
        children: [
          {
            name: '机构管理',
            icon: <StarOutlined />,
            path: 'dept',
          },
          {
            name: '资源管理',
            icon: <StarOutlined />,
            path: 'resource',
          },
          {
            name: '角色管理',
            icon: <StarOutlined />,
            path: 'role',
          },
          {
            name: '用户管理',
            icon: <StarOutlined />,
            path: 'user',
          },
        ],
      },
      // {
      //   name: '操作日志',
      //   icon: <StarOutlined />,
      //   path: '/log/operate',
      // },
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
  // const email = sessionStorage.getItem('email');
  // const userId = sessionStorage.getItem('userId');
  const res = await request('/rbac/user/getInfo');

  if (res.code !== 200) {
    message.error(res.msg);
    return;
  }

  return {
    name: res.data.email,
    userInfo: res.data,
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
