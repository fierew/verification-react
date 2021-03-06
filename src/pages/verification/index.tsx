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
  InputNumber,
} from 'antd';
import { history, Link, useAccess } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import TemplateTable from '@/component/templateTable';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import moment from 'moment';
import downloadUtils from '@/utils/downloadUtils';

interface Item {
  name: string;
  describe: string;
  templateId: number;
  createTime: string;
  updateTime: string;
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
  const access = useAccess();
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
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="名称" name="name">
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="备注" name="describe">
              <Input placeholder="备注" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="模板ID" name="templateId">
              <InputNumber placeholder="模板ID" style={{ width: '100%' }} />
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
    downloadUtils(`/verification/downloads/${id}`, name);
  };

  const deleteTable = (id: number) => {
    request(`/verification/delete/${id}`, {
      method: 'delete',
    }).then(res => {
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        reset();
      }
    });
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
      width: 200,
      ellipsis: true,
    },
    {
      title: '模板ID',
      dataIndex: 'templateId',
      key: 'templateId',
      width: 100,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 200,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 120,
      render: (text: any, record: { id: number; name: string }) => {
        return (
          <Space size="middle">
            {logButtonModel(record.id)}
            {editButtonModel(record.id)}
            {downloadButtonModel(record.id, record.name)}
            {deleteButtonModel(record.id)}
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
        stateCondition={1}
      />
    </Modal>
  );

  const deleteButtonModel = (id: number) => {
    if (access.verificationDeleteButton) {
      return (
        <Popconfirm
          title="是否删除鉴定日志?"
          onConfirm={() => {
            deleteTable(id);
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      );
    }
  };

  const downloadButtonModel = (id: number, name: string) => {
    if (access.verificationDownloadsButton) {
      return (
        <a
          onClick={() => {
            download(id, name);
          }}
        >
          下载
        </a>
      );
    }
  };

  const logButtonModel = (id: number) => {
    if (access.verificationLogButton) {
      return <Link to={`/verification/log/${id}`}>日志</Link>;
    }
  };

  const editButtonModel = (id: number) => {
    if (access.verificationEditButton) {
      return <Link to={`/verification/edit/${id}`}>编辑</Link>;
    }
  };

  const addButtonModel = () => {
    if (access.verificationAddButton) {
      return (
        <Button
          style={{ marginBottom: 15 }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          添加鉴定
        </Button>
      );
    }
  };

  return (
    <div style={{ padding: 12 }}>
      {addButtonModel()}
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
