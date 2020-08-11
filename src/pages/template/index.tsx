import React from 'react';
import { Button, Input, Form, Table, Col, Row, Popconfirm, Space } from 'antd';
import { history } from 'umi';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Link } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

interface Item {
  name: string;
  describe: string;
  create_time: string;
  update_time: string;
}

interface Result {
  total: number;
  list: Item[];
}

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
  return request(`/template/getList?${query}`).then(res => ({
    total: res.data.total,
    list: res.data.list,
  }));
};

export default () => {
  const [form] = Form.useForm();

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });

  const { type, changeType, submit, reset } = search;

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="名称" name="name">
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
            <Button onClick={reset} style={{ marginLeft: 16 }}>
              重置
            </Button>
            <Button type="link" onClick={changeType}>
              简单搜索
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  const searchFrom = (
    <div>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="name">
          <Input.Search
            placeholder="搜索名称"
            style={{ width: 240 }}
            onSearch={submit}
          />
        </Form.Item>
        <Button type="link" onClick={changeType}>
          高级搜索
        </Button>
      </Form>
    </div>
  );

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
      title: 'describe',
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
        console.log(text);
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
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          history.push('/template/add');
        }}
      >
        添加模板
      </Button>
      {type === 'simple' ? searchFrom : advanceSearchForm}
      <Table
        columns={columns}
        rowKey="id"
        {...tableProps}
        scroll={{ x: '100%' }}
      />
    </div>
  );
};
