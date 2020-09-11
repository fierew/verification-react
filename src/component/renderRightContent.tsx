import React from 'react';
import { Avatar, Dropdown, Menu, Spin } from 'antd';
import { SelectLang } from 'umi';
import { LogoutOutlined } from '@ant-design/icons';
import '@umijs/plugin-layout/src/layout/style.less';
import { ILayoutRuntimeConfig } from '@umijs/plugin-layout/src/types/interface.d';

export default function renderRightContent(
  runtimeLayout: ILayoutRuntimeConfig,
  initialState: any,
  setInitialState: any,
) {
  const menu = (
    <Menu className="umi-plugin-layout-menu">
      <Menu.Item
        key="logout"
        onClick={() =>
          runtimeLayout.logout && runtimeLayout?.logout(initialState)
        }
      >
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const avatar = (
    <span className="umi-plugin-layout-action">
      <Avatar
        size="small"
        className="umi-plugin-layout-avatar"
        src={
          (initialState && initialState.avatar) ||
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        }
        alt="avatar"
      />
      <span className="umi-plugin-layout-name">
        {initialState && initialState.name}
      </span>
    </span>
  );

  return (
    initialState && (
      <div className="umi-plugin-layout-right">
        {runtimeLayout.logout ? (
          <Dropdown
            overlay={menu}
            overlayClassName="umi-plugin-layout-container"
          >
            {avatar}
          </Dropdown>
        ) : (
          avatar
        )}
        {SelectLang && <SelectLang />}
      </div>
    )
  );
}
