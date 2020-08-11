import React from 'react';
import { Button, Table } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

export default () => {
  return (
    <div style={{ padding: 12 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          history.push('/verification/add');
        }}
      >
        添加鉴定
      </Button>
    </div>
  );
};
