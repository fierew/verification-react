import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import { useParams } from 'umi';
import { Table, PageHeader } from 'antd';

interface Item {
  id: number;
  verificationId: number;
  key: string;
  formName: string;
  updateValue: string;
  updateTime: number;
}

interface Result {
  total: number;
  list: Item[];
}

export default () => {
  let { id } = useParams();
  id = parseInt(id);

  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<Result> => {
    let query = `page=${current}&pageSize=${pageSize}`;
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        query += `&${key}=${value}`;
      }
    });
    return request(`/verification/getLogList/${id}?${query}`).then(res => ({
      total: res.data.total,
      list: res.data.list,
    }));
  };

  const { tableProps } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'email',
      key: 'email',
      width: 50,
      ellipsis: true,
    },
    {
      title: '鉴定信息ID',
      dataIndex: 'verificationId',
      key: 'verification_id',
      width: 50,
      ellipsis: true,
    },
    {
      title: '操作内容',
      width: 100,
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <span>
            将"{record.formName}"内容修改为"{record.updateValue}"
          </span>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 100,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
  ];

  return (
    <PageHeader
      onBack={() => {
        window.history.back();
      }}
      title="返回"
    >
      <Table
        columns={columns}
        rowKey="id"
        {...tableProps}
        scroll={{ x: '100%' }}
      />
    </PageHeader>
  );
};
