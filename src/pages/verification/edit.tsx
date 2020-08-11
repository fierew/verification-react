import React from 'react';
import { PageHeader } from 'antd';

export default () => {
  return (
    <PageHeader
      onBack={() => {
        window.history.back();
      }}
      title="返回"
    >
      <div>鉴定日志编辑</div>
    </PageHeader>
  );
};
