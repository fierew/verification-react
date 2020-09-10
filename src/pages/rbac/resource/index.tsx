import React, { useState, useEffect } from 'react';
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
  TreeSelect,
  Radio,
  InputNumber,
  Switch,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';

const { TreeNode } = TreeSelect;

interface Item {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  type: number;
  key: string;
  path: string;
  remarks: string;
  state: number;
  sort: number;
  createTime: number;
  updateTime: number;
}

interface Result {
  list: Item[];
}

const initResourceLists: Item[] = [];

export default () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [radio, setRadio] = useState(0);

  const [resourceLists, setResourceLists] = useState(initResourceLists);

  const [treeValue, setTreeValue] = useState({});

  const getTableData = (formData: Object): Promise<Result> => {
    let query = '';
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        query += `&${key}=${value}`;
      }
    });
    return request(`/rbac/resource/getList?${query}`).then(res => {
      if (res.code == 200) {
        setResourceLists(res.data);
        return {
          list: res.data,
        };
      }
      return {
        list: [],
      };
    });
  };

  const { tableProps, search } = useAntdTable(getTableData, { form });

  const { type, changeType, submit, reset } = search;

  const childrenTree = (data: any) => {
    if (data != undefined && data.length > 0) {
      return data.map((item: any) => {
        return (
          <TreeNode key={item.id} value={item.id} title={item.name}>
            {childrenTree(item.children)}
          </TreeNode>
        );
      });
    }
  };

  const parentTree = (data: any) => {
    return data.map((item: any) => {
      return (
        <TreeNode key={item.id} value={item.id} title={item.name}>
          {childrenTree(item.children)}
        </TreeNode>
      );
    });
  };

  const onChangeTree = (value: any) => {
    console.log(value);
    setTreeValue({ value });
  };

  const addResource = (e: any) => {
    addForm
      .validateFields()
      .then(values => {
        const data = {
          name: values.name,
          parentId: values.parentId,
          path: values.path ?? '',
          remarks: values.remarks ?? '',
          sort: values.sort ?? 0,
          state: values.state ? 1 : 0,
          type: values.type,
          key: values.key ?? '',
          icon: '',
        };

        request('/rbac/resource/add', {
          method: 'POST',
          data: data,
        }).then(res => {
          if (res.code === 200) {
            addForm.resetFields();
            setAddVisible(false);
            submit();
            message.success(res.msg);
          } else {
            message.error(res.msg);
          }
        });
      })
      .catch(info => {
        // console.log('Validate Failed:', info);
      });
  };

  const handleCancel = (e: any) => {
    setAddVisible(false);
  };

  const showAddModal = () => {
    setAddVisible(true);
  };

  const onChangeRadio = (e: any) => {
    setRadio(e.target.value);
  };

  const radioModel = (radioValue: any) => {
    switch (radioValue) {
      case '1':
      case '2':
        return (
          <Form.Item
            name="key"
            label="权限标识"
            hasFeedback
            rules={[{ required: true, message: '请输入权限标识' }]}
          >
            <Input placeholder="请输入权限标识,多个用“,”隔开" />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            name="path"
            label="菜单URL"
            hasFeedback
            rules={[{ required: true, message: '请输入URL' }]}
          >
            <Input placeholder="请输入URL,外部链接请加HTTP://" />
          </Form.Item>
        );
    }
  };

  const addModel = () => {
    return (
      <Modal
        title="添加资源"
        visible={addVisible}
        onOk={e => addResource(e)}
        onCancel={e => handleCancel(e)}
      >
        <Form form={addForm} name="add_form_in_modal">
          <Form.Item
            label="所属上级"
            name="parentId"
            hasFeedback
            rules={[{ required: true, message: '请选择所属上级!' }]}
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={treeValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择所属上级"
              allowClear
              treeDefaultExpandAll
              onChange={onChangeTree}
            >
              <TreeNode key={0} value={0} title={'最顶层'}>
                {parentTree(resourceLists)}
              </TreeNode>
            </TreeSelect>
          </Form.Item>
          <Form.Item
            name="name"
            label="权限名称"
            hasFeedback
            rules={[{ required: true, message: '请输入权限名称!' }]}
          >
            <Input placeholder="权限名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="权限类型"
            hasFeedback
            initialValue={'0'}
            rules={[{ required: true, message: '请选择权限类型!' }]}
          >
            <Radio.Group onChange={onChangeRadio}>
              <Radio value="0">菜单</Radio>
              <Radio value="1">按钮</Radio>
              <Radio value="2">接口</Radio>
            </Radio.Group>
          </Form.Item>
          {radioModel(radio)}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="sort" label="排序序号" initialValue="0">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="状态" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="remarks" label="  备注信息">
            <Input.TextArea placeholder="备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

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
      width: 160,
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
