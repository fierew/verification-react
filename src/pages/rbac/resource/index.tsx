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
  TreeSelect,
  Radio,
  InputNumber,
  Switch,
  Tag,
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import './index.css';
import { iconNames, iconModels } from '@/utils/iconNames';
import { useAccess } from 'umi';

const { TreeNode } = TreeSelect;

interface Item {
  id: number;
  parentId: number;
  name: string;
  icon: string;
  type: number;
  key: string;
  path: string;
  isHide: number;
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
  const access = useAccess();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);

  const [radio, setRadio] = useState(0);

  const [resourceLists, setResourceLists] = useState(initResourceLists);

  const [iconText, setIconText] = useState('GlobalOutlined');

  const [treeValue, setTreeValue] = useState({});

  const getTableData = (): Promise<Result> => {
    return request('/rbac/resource/getList').then(res => {
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

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });

  const { type, changeType, submit, reset } = search;

  const getTreeTitle = (type: number) => {
    let title = '';
    switch (type) {
      case 0:
        title = '(菜单)';
        break;
      case 1:
        title = '(按钮)';
        break;
      case 2:
        title = '(接口)';
        break;
      default:
        title = '(未知)';
    }
    return title;
  };

  const childrenTree = (data: any) => {
    if (data != undefined && data.length > 0) {
      return data.map((item: any) => {
        return (
          <TreeNode
            key={item.id}
            value={item.id}
            title={item.name + getTreeTitle(item.type)}
          >
            {childrenTree(item.children)}
          </TreeNode>
        );
      });
    }
  };

  const parentTree = (data: any) => {
    return data.map((item: any) => {
      return (
        <TreeNode
          key={item.id}
          value={item.id}
          title={item.name + getTreeTitle(item.type)}
        >
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
          icon: values.icon ?? '',
          isHide: values.isHide ? 1 : 0,
        };

        request('/rbac/resource/add', {
          method: 'POST',
          data: data,
        }).then(res => {
          if (res.code === 200) {
            setAddVisible(false);
            addForm.resetFields();
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

  const editResource = (e: any) => {
    editForm
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
          icon: values.icon ?? '',
          isHide: values.isHide ? 1 : 0,
        };

        request(`/rbac/resource/edit/${values.id}`, {
          method: 'PUT',
          data: data,
        }).then(res => {
          if (res.code === 200) {
            setEditVisible(false);
            editForm.resetFields();
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

  const deleteResource = (resourceId: number) => {
    request(`/rbac/resource/delete/${resourceId}`, {
      method: 'DELETE',
    }).then(res => {
      if (res.code === 200) {
        submit();
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleCancel = (e: any) => {
    setAddVisible(false);
    setEditVisible(false);
  };

  const incoHandleCancel = (e: any) => {
    setIconVisible(false);
  };

  const showAddModal = () => {
    addForm.resetFields();
    addForm.setFieldsValue({
      icon: 'GlobalOutlined',
    });
    setAddVisible(true);
    setRadio(0);
    setIconText('GlobalOutlined');
  };

  const showEditModal = (resourceInfo: Item) => {
    editForm.resetFields();
    editForm.setFieldsValue(resourceInfo);
    setEditVisible(true);
    setRadio(resourceInfo.type);
    setIconText(resourceInfo.icon);
  };

  const showAddChildrenModal = (id: number) => {
    addForm.resetFields();
    addForm.setFieldsValue({
      parentId: id,
      icon: 'GlobalOutlined',
    });
    setAddVisible(true);
    setRadio(0);
    setIconText('GlobalOutlined');
  };

  const showIconModel = (e: any) => {
    setIconVisible(true);
  };

  const onChangeRadio = (e: any) => {
    setRadio(e.target.value);
  };

  const iconSeletc = (iconName: string) => {
    const iconNode = document.getElementById('icon_' + iconText);

    if (iconNode != null) {
      iconNode.classList.remove('anticons-select');
    }

    setIconText(iconName);
    addForm.setFieldsValue({
      icon: iconName,
    });

    editForm.setFieldsValue({
      icon: iconName,
    });
  };

  const radioModel = (radioValue: any) => {
    switch (radioValue) {
      case 1:
      case 2:
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
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="icon"
                  label="菜单图标"
                  rules={[{ required: true, message: '请选择菜单图标' }]}
                >
                  <Input style={{ display: 'none' }} placeholder="请输入图标" />
                </Form.Item>
              </Col>
              <Col span={4} style={{ fontSize: 20 }}>
                {iconModels[iconText as string]}
              </Col>
              <Col span={8}>
                <Button onClick={showIconModel} type="primary">
                  选择图标
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item
                  name="path"
                  label="菜单URL"
                  hasFeedback
                  rules={[{ required: true, message: '请输入URL' }]}
                >
                  <Input placeholder="请输入URL,外部链接请加HTTP://" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="isHide" label="隐藏" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
    }
  };

  const formModel = (
    <>
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
          treeNodeFilterProp="title"
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
        initialValue={0}
        rules={[{ required: true, message: '请选择权限类型!' }]}
      >
        <Radio.Group onChange={onChangeRadio}>
          <Radio value={0}>菜单</Radio>
          <Radio value={1}>按钮</Radio>
          <Radio value={2}>接口</Radio>
        </Radio.Group>
      </Form.Item>
      {radioModel(radio)}
      <Row gutter={24}>
        <Col span={16}>
          <Form.Item name="sort" label="排序序号" initialValue="0">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="state" label="状态" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="remarks" label="  备注信息">
        <Input.TextArea placeholder="备注信息" />
      </Form.Item>
    </>
  );

  const addModel = (
    <Modal
      title="添加资源"
      visible={addVisible}
      onOk={e => addResource(e)}
      onCancel={e => handleCancel(e)}
    >
      <Form form={addForm} name="add_form_in_modal">
        {formModel}
      </Form>
    </Modal>
  );

  const editModel = (
    <Modal
      title="编辑资源"
      visible={editVisible}
      onOk={e => editResource(e)}
      onCancel={e => handleCancel(e)}
    >
      <Form form={editForm} name="edit_form_in_modal">
        <Form.Item
          name="id"
          label="ID"
          initialValue={0}
          style={{ display: 'none' }}
        >
          <InputNumber />
        </Form.Item>
        {formModel}
      </Form>
    </Modal>
  );

  const iconModel = (
    <Modal
      zIndex={2000}
      visible={iconVisible}
      onOk={e => incoHandleCancel(e)}
      onCancel={e => incoHandleCancel(e)}
    >
      <ul className="anticons-list">
        {iconNames.map((item: string, index: number) => (
          <li
            key={index}
            onClick={(e: any) => {
              iconSeletc(item);
            }}
            id={'icon_' + item}
            className={
              iconText == item ? 'Outlined anticons-select' : 'Outlined'
            }
          >
            {/* <Icon style={{ fontSize: 40 }} type={item} /> */}
            {iconModels[item]}
          </li>
        ))}
      </ul>
    </Modal>
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
      render: (text: string) => iconModels[text as string],
    },
    {
      title: '菜单URL',
      dataIndex: 'path',
      key: 'path',
      width: 100,
      ellipsis: true,
    },
    {
      title: '是否隐藏',
      dataIndex: 'isHide',
      key: 'isHide',
      width: 100,
      ellipsis: true,
      render: (text: number, record: Item) => {
        if (record.type == 0) {
          if (text === 1) {
            return <span style={{ color: 'red' }}>隐藏</span>;
          } else {
            return <span style={{ color: '#4395ff' }}>显示</span>;
          }
        }
      },
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
      render: (text: number) => {
        if (text == 0) {
          return <Tag color="blue">菜单</Tag>;
        }

        if (text == 1) {
          return <Tag color="geekblue">按钮</Tag>;
        }

        if (text == 2) {
          return <Tag color="green">接口</Tag>;
        }

        return <Tag color="red">未知</Tag>;
      },
    },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 160,
      render: (text: any, record: Item) => {
        return (
          <Space size="middle">
            {editButtonModel(record)}
            {deleteButtonModel(record.id)}
            {addChildrenButtonModel(record.id)}
          </Space>
        );
      },
    },
  ];

  const addChildrenButtonModel = (id: number) => {
    if (access.rbacResourceAddButton) {
      return (
        <a
          onClick={() => {
            showAddChildrenModal(id);
          }}
        >
          添加子节点
        </a>
      );
    }
  };

  const deleteButtonModel = (id: number) => {
    if (access.rbacResourceDeleteButton) {
      return (
        <Popconfirm
          title="是否删除资源?"
          onConfirm={() => {
            deleteResource(id);
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      );
    }
  };

  const editButtonModel = (record: Item) => {
    if (access.rbacResourceEditButton) {
      return (
        <a
          onClick={() => {
            showEditModal(record);
          }}
        >
          编辑
        </a>
      );
    }
  };

  const addButtonModel = () => {
    if (access.rbacResourceAddButton) {
      return (
        <Button
          style={{ marginBottom: 15 }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          添加资源
        </Button>
      );
    }
  };

  return (
    <div style={{ padding: 12 }}>
      {addButtonModel()}
      {iconModel}
      {addModel}
      {editModel}
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
