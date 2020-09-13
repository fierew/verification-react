import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { Spin } from 'antd';

export default () => {
  const { initialState, loading, error, refresh, setInitialState } = useModel(
    '@@initialState',
  );

  const menu = initialState?.menu ?? [];

  useEffect(() => {
    if (menu.length > 0) {
      history.push(menu[0].path);
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
