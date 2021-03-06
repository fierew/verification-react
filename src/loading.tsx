import React from 'react';
import { Spin } from 'antd';

export default (props: any) => {
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
      <Spin
        size="large"
        spinning={props.spinning === null ? true : props.spinning}
      />
    </div>
  );
};
