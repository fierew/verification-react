import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { Spin } from 'antd';

export default () => {
  const { initialState, loading, error, refresh, setInitialState } = useModel(
    '@@initialState',
  );

  const menu = initialState?.menu ?? [];

  let path: string;

  const getPath = (data: any) => {
    if (data.children != undefined && data.children.length > 0) {
      getPath(data.children[0]);
    } else {
      path = data.path;
      return;
    }
  };

  useEffect(() => {
    if (menu != undefined && menu.length > 0) {
      getPath(menu[0]);
      history.push(path);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: 138,
        textAlign: 'center',
        borderRadius: 4,
        marginBottom: 20,
        paddingTop: 100,
      }}
    >
      <Spin size="large" spinning={true} />
    </div>
  );
};
