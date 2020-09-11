import { Result, Button } from 'antd';
import React from 'react';
import { history } from 'umi';

export default function() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问此页。"
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.push('/');
          }}
        >
          返回首页
        </Button>
      }
    />
  );
}
