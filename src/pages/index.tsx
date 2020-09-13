import React, { useEffect } from 'react';
import { history, useModel } from 'umi';

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

  return <></>;
};
