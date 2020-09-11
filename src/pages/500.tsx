import { Result, Button } from 'antd';
import React from 'react';
import { history } from 'umi';

export default function() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="对不起，服务器出错了。"
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
