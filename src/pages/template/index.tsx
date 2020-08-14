import React from 'react';
import { Button, Popconfirm, Space } from 'antd';
import { history } from 'umi';
import { Link } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import TemplateTable from '@/component/templateTable';

export default () => {
  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'describe',
      key: 'describe',
      width: 100,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 100,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 100,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 110,
      render: (text: any, record: { status: number; id: number }) => {
        return (
          <Space size="middle">
            <Link to={`/template/edit/${record.id}`}>编辑</Link>
            <Link to={'/template/'}>下载</Link>
            <Popconfirm title="是否删除模板?">
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Button
        style={{ marginBottom: 15 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          history.push('/template/add');
        }}
      >
        添加模板
      </Button>
      <TemplateTable columns={columns} pageSize={10} />
    </div>
  );
};
