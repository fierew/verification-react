import React, { useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Space,
  Popconfirm,
  message,
} from 'antd';
import { history, Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';

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
  const [visible, setVisible] = useState(false);
  const [templateId, setTemplateId] = useState(0);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e: any) => {
    if (templateId === 0) {
      message.warning('请选择模板！');
    } else {
      setVisible(false);
      history.push(`/verification/add/${templateId}`);
    }
  };

  const handleCancel = (e: any) => {
    setVisible(false);
  };

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
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setTemplateId(selectedRowKeys[0]);
    },
  };

  const modal = (
    <Modal
      width={800}
      title="选择模板"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {type === 'simple' ? searchFrom : advanceSearchForm}
      <Table
        columns={columns}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        rowKey="id"
        {...tableProps}
        scroll={{ x: '100%' }}
      />
    </Modal>
  );

  return (
    <div style={{ padding: 12 }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        添加鉴定
      </Button>
      {modal}
    </div>
  );
};
