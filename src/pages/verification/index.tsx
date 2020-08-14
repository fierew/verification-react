import React, { useState } from 'react';
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
import { history, Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import TemplateTable from '@/component/templateTable';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import moment from 'moment';
import { httpUrl } from '@/utils/config';

interface Item {
  name: string;
  describe: string;
  templateId: number;
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
  return request(`/verification/getList?${query}`).then(res => ({
    total: res.data.total,
    list: res.data.list,
  }));
};

export default () => {
  const [visible, setVisible] = useState(false);
  const [templateId, setTemplateId] = useState(0);
  const [form] = Form.useForm();

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
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

  const download = (id: number, name: string) => {
    const url = `${httpUrl}/verification/downloads/${id}?runtime=${new Date().getTime()}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: sessionStorage.getItem('Authorization') ?? '',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(res =>
      res.blob().then((blob: Blob) => {
        const link = document.createElement('a');
        link.style.display = 'none';

        const disposition = res.headers.get('Content-disposition') ?? '';
        const fileName = disposition
          .split(';')[1]
          .split('=')[1]
          .replace(/"/g, '');

        link.download = decodeURI(fileName) ?? `${name}.docx`;
        link.href = URL.createObjectURL(blob);

        document.body.appendChild(link);
        link.click();

        // 释放URL对象已经移除a标签
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }),
    );
  };

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
      title: '模板ID',
      dataIndex: 'template_id',
      key: 'template_id',
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
      render: (text: any, record: { id: number; name: string }) => {
        return (
          <Space size="middle">
            <Link to={`/verification/edit/${record.id}`}>编辑</Link>
            <a
              onClick={() => {
                download(record.id, record.name);
              }}
            >
              下载
            </a>
            <Popconfirm title="是否删除鉴定日志?">
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

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

  const tempColumns: any[] = [
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
    type: 'radio',
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
      <TemplateTable
        columns={tempColumns}
        pageSize={5}
        rowSelection={rowSelection}
      />
    </Modal>
  );

  return (
    <div style={{ padding: 12 }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        添加鉴定
      </Button>
      {modal}
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
