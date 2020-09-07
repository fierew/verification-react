import React from 'react';
import {
  Button,
  Table,
  Modal,
  message,
  Form,
  Row,
  Col,
  Input,
  Space,
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';

interface Item {
  id: number;
  email: string;
  nickname: string;
  state: number;
  createTime: number;
  updateTime: number;
}

interface Result {
  list: Item[];
}

const getTableData = (formData: Object): Promise<Result> => {
  let query = '';
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });
  return request(`/rbac/resource/getList?${query}`).then(res => ({
    list: res.data,
  }));
};

export default () => {
  const [form] = Form.useForm();

  const { tableProps, search } = useAntdTable(getTableData, { form });

  const { type, changeType, submit, reset } = search;

  const showAddModal = () => {};

  const addModel = () => {};

  const editModel = () => {};

  const searchFrom = (
    <div>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="name">
          <Input.Search
            placeholder="权限名称"
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

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="权限名称" name="name">
              <Input placeholder="权限名称" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="权限标识" name="key">
              <Input placeholder="权限标识" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="显示状态" name="state">
              <Input placeholder="显示状态" />
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

  const columns: any[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      ellipsis: true,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      ellipsis: true,
    },
    {
      title: '菜单URL',
      dataIndex: 'path',
      key: 'path',
      width: 100,
      ellipsis: true,
    },
    {
      title: '标识组',
      dataIndex: 'key',
      key: 'key',
      width: 100,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      ellipsis: true,
      render: (text: number) => {
        if (text === 1) {
          return <span style={{ color: '#4395ff' }}>正常</span>;
        } else {
          return <span style={{ color: 'red' }}>禁用</span>;
        }
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 120,
      render: (text: any, record: Item) => {
        return (
          <Space size="middle">
            <a>编辑</a>
            <a style={{ color: 'red' }}>删除</a>
            <a>添加子节点</a>
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
        onClick={showAddModal}
      >
        添加资源
      </Button>
      {addModel()}
      {editModel()}
      {type === 'simple' ? searchFrom : advanceSearchForm}
      <Table
        columns={columns}
        rowKey="id"
        dataSource={tableProps.dataSource}
        loading={tableProps.loading}
        onChange={tableProps.onChange}
        pagination={false}
        scroll={{ x: '100%' }}
      />
    </div>
  );
};
