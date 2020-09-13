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
  TreeSelect,
  Radio,
  InputNumber,
  Switch,
  Tag,
  Popconfirm,
  Steps,
  Select,
  Tree,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

const { Step } = Steps;
const { Option } = Select;
const { TreeNode, SHOW_PARENT } = TreeSelect;

interface Item {
  id: number;
  name: string;
  remarks: string;
  dataRange: number;
  sort: number;
  createTime: number;
  updateTime: number;
}

interface Result {
  list: Item[];
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

let initDirection: 'horizontal' | 'vertical' | undefined = 'horizontal';

export default () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [deptVisible, setDeptVisible] = useState(false);

  const [deptTreeData, setDeptTreeData] = useState([]);
  const [resourceTreeData, setResourceTreeData] = useState([]);

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
        setDeptTreeData(parentTree(res.data, 'dept'));
      }
    });

    request('/rbac/resource/getList').then(res => {
      if (res.code == 200) {
        setResourceTreeData(parentTree(res.data, 'resource'));
      }
    });

    return request(`/rbac/role/getList?${query}`).then(res => ({
      total: res.data.total,
      list: res.data.list,
    }));
  };

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
  });

  const { type, changeType, submit, reset } = search;

  // useEffect(() => {

  //   return componentWillUnmount;
  // }, []);

  // const componentWillUnmount = () => {};

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

  const childrenTree = (data: any, type: string) => {
    if (data != undefined && data.length > 0) {
      return data.map((item: any) => {
        let title = item.name;
        if (type == 'resource') {
          title += getTreeTitle(item.type);
        }
        return {
          title: title,
          value: item.id,
          key: item.id,
          children: childrenTree(item.children, type),
        };
      });
    }
  };

  const parentTree = (data: any, type: string) => {
    return data.map((item: any) => {
      let title = item.name;
      if (type == 'resource') {
        title += getTreeTitle(item.type);
      }

      return {
        title: title,
        value: item.id,
        key: item.id,
        children: childrenTree(item.children, type),
      };
    });
  };

  const showAddModal = (e: any) => {
    addForm.resetFields();
    setAddVisible(true);
  };

  const showEditModal = (info: Item) => {
    editForm.resetFields();

    editForm.setFieldsValue(info);
    setEditVisible(true);
  };

  const addResource = (e: any) => {
    addForm
      .validateFields()
      .then(values => {
        const data = {
          name: values.name,
          remarks: values.remarks ?? '',
          dataRange: values.dataRange,
          deptArray: values.deptArray ?? [],
          resourceArray: values.resourceArray ?? [],
          sort: values.sort ?? 0,
        };

        request('/rbac/role/add/', {
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
          remarks: values.remarks ?? '',
          dataRange: values.dataRange,
          deptArray: values.deptArray ?? [],
          resourceArray: values.resourceArray ?? [],
          sort: values.sort ?? 0,
        };

        request(`/rbac/role/edit/${values.id}`, {
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

  const deleteRole = (id: number) => {
    request(`/rbac/role/delete/${id}`, {
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

  const dataRangeChange = (value: any) => {
    if (value == 3) {
      setDeptVisible(true);
    } else {
      setDeptVisible(false);
    }
  };

  const showDeptTreeForm = (show: boolean) => {
    if (show) {
      return (
        <Form.Item
          label="设置机构"
          name="deptArray"
          rules={[{ required: true, message: '请选择机构' }]}
        >
          <TreeSelect
            treeData={deptTreeData}
            treeCheckable={true}
            showCheckedStrategy={SHOW_PARENT}
            placeholder="请选择机构"
            treeNodeFilterProp="title"
            showSearch={true}
          />
        </Form.Item>
      );
    }
  };

  const formModel = (
    <>
      <Form.Item
        name="name"
        label="角色名称"
        hasFeedback
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input placeholder="请输入角色名称" />
      </Form.Item>
      <Form.Item
        label="数据范围"
        name="dataRange"
        hasFeedback
        rules={[{ required: true, message: '请选择数据范围' }]}
      >
        <Select placeholder="请选择数据范围" onChange={dataRangeChange}>
          <Option value={0}>仅允许查看自己</Option>
          <Option value={1}>仅允许查看本部门</Option>
          <Option value={2}>允许查看本部门及下属部门</Option>
          <Option value={3}>自定义</Option>
        </Select>
      </Form.Item>
      {showDeptTreeForm(deptVisible)}
      <Form.Item
        label="设置授权"
        name="resourceArray"
        hasFeedback
        rules={[{ required: true, message: '请选择授权' }]}
      >
        <TreeSelect
          treeData={resourceTreeData}
          treeCheckable={true}
          showCheckedStrategy={SHOW_PARENT}
          placeholder="请选择授权"
          treeNodeFilterProp="title"
          showSearch={true}
        />
      </Form.Item>
      <Form.Item name="sort" label="排序序号" initialValue="0">
        <InputNumber />
      </Form.Item>
      <Form.Item name="remarks" label="备注信息">
        <Input.TextArea placeholder="备注信息" />
      </Form.Item>
    </>
  );

  const addModel = (
    <Modal
      title="添加角色"
      width={600}
      visible={addVisible}
      onOk={e => addResource(e)}
      onCancel={e => handleCancel(e)}
    >
      <Form {...layout} form={addForm} name="add_form_in_modal">
        {formModel}
      </Form>
    </Modal>
  );

  const editModel = (
    <Modal
      title="编辑角色"
      width={600}
      visible={editVisible}
      onOk={e => editResource(e)}
      onCancel={e => handleCancel(e)}
    >
      <Form {...layout} form={editForm} name="edit_form_in_modal">
        <Form.Item
          name="id"
          label="ID"
          initialValue="0"
          style={{ display: 'none' }}
        >
          <InputNumber />
        </Form.Item>
        {formModel}
      </Form>
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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: '数据范围',
      dataIndex: 'dataRange',
      key: 'dataRange',
      width: 200,
      ellipsis: true,
      render: (text: number) => {
        if (text == 0) {
          return <span>仅允许查看自己</span>;
        }

        if (text == 1) {
          return <span>仅允许查看本部门</span>;
        }

        if (text == 2) {
          return <span>允许查看本部门及下属部门</span>;
        }

        if (text == 3) {
          return <span>自定义</span>;
        }

        return <span>未知</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 100,
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
            <Popconfirm
              title="是否删除资源?"
              onConfirm={() => {
                deleteRole(record.id);
              }}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const searchFrom = (
    <div>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="name">
          <Input.Search
            placeholder="角色名称"
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
            <Form.Item label="角色名称" name="name">
              <Input placeholder="角色名称" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Form.Item label="数据范围" name="dataRange" initialValue="0">
              <Select placeholder="状态">
                <Option value="0">仅允许查看自己</Option>
                <Option value="1">仅允许查看本部门</Option>
                <Option value="2">允许查看本部门及下属部门</Option>
                <Option value="3">自定义</Option>
              </Select>
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

  return (
    <div style={{ padding: 12 }}>
      <Button
        style={{ marginBottom: 15 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddModal}
      >
        添加角色
      </Button>
      {addModel}
      {editModel}
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
