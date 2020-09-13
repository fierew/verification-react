import React, { useEffect } from 'react';
import { history, useModel } from 'umi';

export default () => {
  const { initialState, loading, error, refresh, setInitialState } = useModel(
    '@@initialState',
  );
  console.log(initialState);

  const menu = initialState?.menu ?? [];

  let homeUrl = '/';
  if (menu.length > 0) {
    homeUrl = menu[0].path;
  }
  useEffect(() => {
    history.push(homeUrl);
  }, []);

  return <></>;
};
