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
  TreeSelect,
  Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import moment from 'moment';
import { pwdRegular, chineseRegular } from '@/utils/regular';

const { TreeNode } = TreeSelect;
const { Option } = Select;

interface Item {
  id: number;
  deptId: number;
  roleId: number;
  email: string;
  realName: string;
  mobile: string;
  sex: number;
  age: number;
  loginNum: number;
  state: number;
  createTime: number;
  updateTime: number;
}

interface Result {
  total: number;
  list: Item[];
}

const initUserInfo: any = {
  email: '',
  nickname: '',
  password: '',
  confirm: '',
};

interface DeptItem {
  id: number;
  parentId: number;
  name: string;
  remarks: string;
  sort: number;
  createTime: number;
  updateTime: number;
}

const initDeptLists: DeptItem[] = [];

interface RoleItem {
  id: number;
  name: string;
  remarks: string;
  dataRange: number;
  sort: number;
  createTime: number;
  updateTime: number;
}

const initRoleLists: RoleItem[] = [];

export default () => {
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [modifyPasswordVisible, setModifyPasswordVisible] = useState(false);
  const [form] = Form.useForm();
  const [addUserform] = Form.useForm();
  const [editUserform] = Form.useForm();
  const [modifyPasswordForm] = Form.useForm();

  const [treeValue, setTreeValue] = useState({});

  const [deptLists, setDeptLists] = useState(initDeptLists);

  const [roleLists, setRoleLists] = useState(initRoleLists);

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

    request('/rbac/dept/getAll').then(res => {
      if (res.code == 200) {
        setDeptLists(res.data);
      }
    });

    request('/rbac/role/getAll').then(res => {
      if (res.code == 200) {
        setRoleLists(res.data);
      }
    });

    return request(`/rbac/user/getList?${query}`).then(res => ({
      total: res.data.total,
      list: res.data.list,
    }));
  };

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
            <Form.Item label="邮箱账号" name="email">
              <Input placeholder="邮箱账号" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="昵称" name="nickname">
              <Input placeholder="昵称" />
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
        <Form.Item name="email">
          <Input.Search
            placeholder="搜索邮箱账号"
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

  const deleteUser = (userId: number) => {
    submit();
  };

  const addUser = (e: any) => {
    addUserform
      .validateFields()
      .then(values => {
        request('/rbac/user/add', {
          method: 'POST',
          data: {
            email: values.email,
            nickname: values.nickname,
            password: values.password,
          },
        }).then(res => {
          if (res.code === 200) {
            addUserform.resetFields();
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

  const editUser = (e: any) => {
    editUserform
      .validateFields()
      .then(values => {
        editUserform.resetFields();
        console.log(values);
        setEditVisible(false);
        submit();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const editPwd = (e: any) => {
    modifyPasswordForm
      .validateFields()
      .then(values => {
        modifyPasswordForm.resetFields();
        console.log(values);
        setModifyPasswordVisible(false);
        submit();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
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
      title: '邮箱账号',
      dataIndex: 'email',
      key: 'email',
      width: 100,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'realName',
      key: 'realName',
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
      title: '登陆次数',
      dataIndex: 'loginNum',
      key: 'loginNum',
      width: 60,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>;
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
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 120,
      render: (text: any, record: Item) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                showEditModal(record);
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                showModifyPassword(record.id);
              }}
            >
              修改密码
            </a>
            <Popconfirm
              title="是否删除用户?"
              onConfirm={() => {
                deleteUser(record.id);
              }}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleCancel = (e: any) => {
    setAddVisible(false);
    setEditVisible(false);
    setModifyPasswordVisible(false);
  };

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

  const modifyPasswordModel = () => {
    return (
      <Modal
        title="修改密码"
        visible={modifyPasswordVisible}
        onOk={e => editPwd(e)}
        onCancel={e => handleCancel(e)}
      >
        <Form form={modifyPasswordForm} name="modify_pwd_form_in_modal">
          <Form.Item
            name="password"
            label="用户密码"
            hasFeedback
            rules={[
              {
                type: 'string',
                pattern: pwdRegular,
                message: '必须为数字+小写字母+大写字母+特殊符号8～16位!',
              },
              {
                type: 'string',
                pattern: chineseRegular,
                message: '密码不能有中文!',
              },
              { required: true, message: '请输入密码!' },
            ]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            hasFeedback
            rules={[
              { required: true, message: '请输入确认密码!' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('您输入的两个密码不匹配!');
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const editModel = () => {
    return (
      <Modal
        title="编辑用户"
        visible={editVisible}
        onOk={e => editUser(e)}
        onCancel={e => handleCancel(e)}
      >
        <Form form={editUserform} name="edit_form_in_modal">
          <Form.Item
            name="email"
            label="电子邮箱"
            hasFeedback
            rules={[
              { type: 'email', message: '输入的电子邮件无效!' },
              { required: true, message: '请输入邮箱!' },
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="用户昵称"
            hasFeedback
            rules={[{ required: true, message: '请输入昵称!' }]}
          >
            <Input placeholder="昵称" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const addModel = () => {
    return (
      <Modal
        title="添加用户"
        visible={addVisible}
        onOk={e => addUser(e)}
        onCancel={e => handleCancel(e)}
      >
        <Form form={addUserform} name="add_form_in_modal">
          <Form.Item
            label="所属机构"
            name="deptId"
            hasFeedback
            rules={[{ required: true, message: '请选择机构!' }]}
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={treeValue}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择机构"
              allowClear
              treeDefaultExpandAll
              onChange={onChangeTree}
            >
              {parentTree(deptLists)}
            </TreeSelect>
          </Form.Item>
          <Form.Item
            label="所属角色"
            name="roleId"
            hasFeedback
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {roleLists.map((item: RoleItem, index: number) => (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="电子邮箱"
            hasFeedback
            rules={[
              { type: 'email', message: '输入的电子邮件无效!' },
              { required: true, message: '请输入邮箱!' },
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="realName"
            label="真实姓名"
            hasFeedback
            rules={[{ required: true, message: '请输入真实姓名!' }]}
          >
            <Input placeholder="真实姓名" />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="手机号码"
            hasFeedback
            rules={[{ required: true, message: '请输入手机号码!' }]}
          >
            <Input placeholder="手机号码" />
          </Form.Item>
          <Form.Item
            name="password"
            label="用户密码"
            hasFeedback
            rules={[
              {
                type: 'string',
                pattern: pwdRegular,
                message: '必须为数字+小写字母+大写字母+特殊符号8～16位!',
              },
              {
                type: 'string',
                pattern: chineseRegular,
                message: '密码不能有中文!',
              },
              { required: true, message: '请输入密码!' },
            ]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            hasFeedback
            rules={[
              { required: true, message: '请输入确认密码!' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('您输入的两个密码不匹配!');
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认密码" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const showAddModal = () => {
    addUserform.setFieldsValue(initUserInfo);
    setAddVisible(true);
  };

  const showEditModal = (userInfo: Item) => {
    editUserform.setFieldsValue(userInfo);
    setEditVisible(true);
  };

  const showModifyPassword = (id: number) => {
    modifyPasswordForm.setFieldsValue({
      password: '',
      confirm: '',
    });
    setModifyPasswordVisible(true);
  };

  const onChangeTree = (value: any) => {
    setTreeValue({ value });
  };

  return (
    <div style={{ padding: 12 }}>
      <Button
        style={{ marginBottom: 15 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddModal}
      >
        添加用户
      </Button>
      {addModel()}
      {editModel()}
      {modifyPasswordModel()}
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
