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
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [deptVisible, setDeptVisible] = useState(false);

  const [deptTreeData, setDeptTreeData] = useState([]);
  const [resourceTreeData, setResourceTreeData] = useState([]);

  useEffect(() => {
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

    // return componentWillUnmount;
  }, []);

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
    setAddVisible(true);
  };

  const addResource = (e: any) => {
    addForm
      .validateFields()
      .then(values => {
        console.log(values);
      })
      .catch(info => {
        // console.log('Validate Failed:', info);
      });
  };

  const handleCancel = (e: any) => {
    setAddVisible(false);
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
          name="resourceArray"
          rules={[{ required: true, message: '请选择机构' }]}
        >
          <TreeSelect
            treeData={deptTreeData}
            treeCheckable={true}
            showCheckedStrategy={SHOW_PARENT}
            placeholder="请选择机构"
          />
        </Form.Item>
      );
    }
  };

  const steps = [
    {
      title: '基本属性',
      content: 'First-content',
    },
    {
      title: '数据权限',
      content: 'Second-content',
    },
    {
      title: '功能授权',
      content: 'Last-content',
    },
  ];

  const addModel = () => {
    return (
      <Modal
        title="添加角色"
        width={600}
        visible={addVisible}
        onOk={e => addResource(e)}
        onCancel={e => handleCancel(e)}
      >
        <Form {...layout} form={addForm} name="add_form_in_modal">
          <Form.Item
            name="name"
            label="角色名称"
            hasFeedback
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="角色名称" />
          </Form.Item>
          <Form.Item
            label="数据范围"
            name="dataRange"
            initialValue="0"
            hasFeedback
            rules={[{ required: true, message: '请选择数据范围' }]}
          >
            <Select placeholder="状态" onChange={dataRangeChange}>
              <Option value="0">仅允许查看自己</Option>
              <Option value="1">仅允许查看本部门</Option>
              <Option value="2">允许查看本部门及下属部门</Option>
              <Option value="3">自定义</Option>
            </Select>
          </Form.Item>
          {showDeptTreeForm(deptVisible)}
          <Form.Item
            label="设置授权"
            name="deptArray"
            hasFeedback
            rules={[{ required: true, message: '请选择授权' }]}
          >
            <TreeSelect
              treeData={resourceTreeData}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              placeholder="请选择机构"
            />
          </Form.Item>
          <Form.Item name="sort" label="排序序号" initialValue="0">
            <InputNumber />
          </Form.Item>
          <Form.Item name="remarks" label="备注信息">
            <Input.TextArea placeholder="备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

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
      {addModel()}
    </div>
  );
};
