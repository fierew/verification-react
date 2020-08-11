import React, { useState, useEffect } from 'react';
import { useParams } from 'umi';
import request from '@/utils/request';
import { history } from '@@/core/history';
import { PageHeader } from 'antd';

export default () => {
  const [fileId, setFileId] = useState(0);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    setFileId(id);
  }, []);

  var reNumber = /^\d+$/;
  if (!reNumber.test(id)) {
    history.push('/404');
  }
  return (
    <PageHeader
      onBack={() => {
        setFileId(0);
        window.history.back();
      }}
      title="返回"
    >
      <div>{fileId}</div>
    </PageHeader>
  );
};
