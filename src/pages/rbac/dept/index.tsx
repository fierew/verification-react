import React, { useState } from 'react';
import {
  Button,
  Table,
  Modal,
  message,
  Form,
  Input,
  Space,
  TreeSelect,
  InputNumber,
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { useAntdTable } from 'ahooks';
import { useAccess } from 'umi';

const { TreeNode } = TreeSelect;

interface Item {
  id: number;
  parentId: number;
  name: string;
  remarks: string;
  sort: number;
  createTime: number;
  updateTime: number;
}

interface Result {
  list: Item[];
}

const initDeptLists: Item[] = [];

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export default () => {
  const access = useAccess();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [deptLists, setDeptLists] = useState(initDeptLists);

  const [treeValue, setTreeValue] = useState({});

  const getTableData = (): Promise<Result> => {
    return request('/rbac/dept/getAll').then(res => {
      if (res.code == 200) {
        setDeptLists(res.data);
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

  const handleCancel = (e: any) => {
    setAddVisible(false);
    setEditVisible(false);
  };

  const addResource = (e: any) => {
    addForm
      .validateFields()
      .then(values => {
        const data = {
          name: values.name,
          parentId: values.parentId,
          remarks: values.remarks ?? '',
          sort: values.sort ?? 0,
        };

        console.log(data);

        request('/rbac/dept/add', {
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
          remarks: values.remarks ?? '',
          sort: values.sort ?? 0,
        };

        request(`/rbac/dept/edit/${values.id}`, {
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

  const onChangeTree = (value: any) => {
    setTreeValue({ value });
  };

  const showAddModal = () => {
    setAddVisible(true);
  };

  const showEditModal = (info: Item) => {
    editForm.setFieldsValue(info);
    setEditVisible(true);
  };

  const deleteResource = (id: number) => {
    request(`/rbac/dept/delete/${id}`, {
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

  const showAddChildrenModal = (id: number) => {
    addForm.setFieldsValue({
      parentId: id,
    });
    setAddVisible(true);
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
          onChange={onChangeTree}
        >
          <TreeNode key={0} value={0} title={'最顶层'}>
            {parentTree(deptLists)}
          </TreeNode>
        </TreeSelect>
      </Form.Item>
      <Form.Item
        name="name"
        label="机构名称"
        hasFeedback
        rules={[{ required: true, message: '请输入机构名称!' }]}
      >
        <Input placeholder="机构名称" />
      </Form.Item>
      <Form.Item name="sort" label="排序序号" initialValue="0">
        <InputNumber />
      </Form.Item>
      <Form.Item name="remarks" label="  备注信息">
        <Input.TextArea placeholder="备注信息" />
      </Form.Item>
    </>
  );

  const addModel = (
    <Modal
      title="添加机构"
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
      title="编辑机构"
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
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
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
            {editButtonModel(record)}
            {deleteButtonModel(record.id)}
            {addChildrenButtonModel(record.id)}
          </Space>
        );
      },
    },
  ];

  const addChildrenButtonModel = (id: number) => {
    if (access.rbacDeptAddButton) {
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
    if (access.rbacDeptDeleteButton) {
      return (
        <Popconfirm
          title="是否删除机构?"
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
    if (access.rbacDeptEditButton) {
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
    if (access.rbacDeptAddButton) {
      return (
        <Button
          style={{ marginBottom: 15 }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          添加机构
        </Button>
      );
    }
  };

  return (
    <div style={{ padding: 12 }}>
      {addButtonModel()}
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
