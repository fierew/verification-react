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

  const [cancelText, setCancelText] = useState('取消');
  const [okText, setOkText] = useState('下一步');
  const [current, setCurrent] = useState(0);

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

    return componentWillUnmount;
  }, []);

  const componentWillUnmount = () => {};

  const childrenTree = (data: any, type: string) => {
    if (data != undefined && data.length > 0) {
      return data.map((item: any) => {
        let title = item.name;
        if (type == 'resource') {
          switch (item.type) {
            case 0:
              title = title + '(菜单)';
              break;
            case 1:
              title = title + '(按钮)';
              break;
            case 2:
              title = title + '(接口)';
              break;
            default:
              title = title + '(未知)';
          }
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
        switch (item.type) {
          case 0:
            title = title + '(菜单)';
            break;
          case 1:
            title = title + '(按钮)';
            break;
          case 2:
            title = title + '(接口)';
            break;
          default:
            title = title + '(未知)';
        }
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
    const text = e.target.innerHTML.replace(' ', '');

    const thisCurrent = current + 1;
    if (thisCurrent <= 2 && thisCurrent >= 0) {
      addForm
        .validateFields()
        .then(values => {
          console.log(values);
          setCurrent(thisCurrent);
          if (thisCurrent == 2) {
            setOkText('确认');
          } else {
            setOkText('下一步');
          }
          setCancelText('上一步');
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    }

    if (['确认', '<span>确认</span>'].indexOf(text) >= 0) {
    }
  };

  const handleCancel = (e: any) => {
    const text = e.target.innerHTML.replace(' ', '');
    const icon = e.target.tagName;

    if (
      ['取消', '<span>取消</span>'].indexOf(text) >= 0 ||
      (text.length > 10 && ['svg', 'SPAN', 'path'].indexOf(icon) >= 0)
    ) {
      setAddVisible(false);
    } else {
      const thisCurrent = current - 1;
      if (thisCurrent <= 2 && thisCurrent >= 0) {
        setCurrent(thisCurrent);
        if (thisCurrent == 0) {
          setCancelText('取消');
        }

        if (thisCurrent < 2) {
          setOkText('下一步');
        }
      }
    }
  };

  const dataRangeChange = (value: any) => {
    console.log(value);
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
        <Form
          style={{ marginTop: 40 }}
          {...layout}
          form={addForm}
          name="add_form_in_modal"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="角色名称" />
          </Form.Item>
          <Form.Item name="sort" label="排序序号" initialValue="0">
            <InputNumber />
          </Form.Item>
          <Form.Item name="remarks" label="备注信息">
            <Input.TextArea placeholder="备注信息" />
          </Form.Item>
          <Form.Item
            label="数据范围"
            name="dataRange"
            initialValue="0"
            rules={[{ required: true, message: '请选择数据范围' }]}
          >
            <Select placeholder="状态" onChange={dataRangeChange}>
              <Option value="0">仅允许查看子级</Option>
              <Option value="1">仅允许查看本部门</Option>
              <Option value="2">允许查看本部门及下属部门</Option>
              <Option value="3">自定义</Option>
            </Select>
          </Form.Item>
          {showDeptTreeForm(deptVisible)}
          <Form.Item
            label="设置授权"
            name="deptArray"
            rules={[{ required: true, message: '请选择授权' }]}
          >
            <TreeSelect
              treeData={resourceTreeData}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              placeholder="请选择机构"
            />
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
