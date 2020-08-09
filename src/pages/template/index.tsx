import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Input,
  Upload,
  message,
  Space,
  Form,
  Checkbox,
  Select,
} from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useParams, history } from 'umi';
import CryptoJS from 'crypto-js';
import request from '@/utils/request';

const { Meta } = Card;
const { Search } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 4',
  },
];

export default () => {
  const [fileList, setFileList] = useState([]);
  const [fields, setFields] = useState([]);
  const [fileId, setFileId] = useState(0);

  const { type, id } = useParams();
  console.log(type);
  console.log(id);
  if (type === 'add') {
    const analysisDoc = async (filePath: any) => {
      // 解析docx
      const res = await request(`/template/analysis?filePath=${filePath}`);
      console.log(res);
      if (res.code !== 200) {
        message.error(res.msg);
      }

      // let valus: any = { params: [] }
      // res.data.map((key: string) => {
      //     valus.params.push({
      //         key: key,
      //         name: '',
      //         type: '',
      //         isNull: '',
      //     })
      // })
      setFields(res.data);
    };

    const props = {
      name: 'file',
      accept: '.doc,.docx',
      fileList,
      headers: {
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTcwMzI3OTgsInVzZXJJZCI6MX0.oHBcqFRBA5s_87inEKNYDLOi7QNPowroA37LYp0XgLo',
      },
      action: 'http://localhost:8080/file/upload',
      data(file: any) {
        return new Promise(resolve => {
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () => {
            const wordArray = CryptoJS.lib.WordArray.create(reader.result);
            const hash = CryptoJS.SHA256(wordArray).toString();
            console.log(hash);
            resolve({ hash });
          };
        });
      },
      onRemove: (file: { url: any }) => {
        setFields([]);
        setFileId(0);
      },
      onChange(info: {
        file: { name?: any; status?: any; response?: any };
        fileList: any;
      }) {
        let fileList = [...info.fileList];

        fileList = fileList.slice(-1);

        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });

        setFileList(fileList);

        const { status, response } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          if (response.code != 200) {
            message.error(response.msg);
          } else {
            message.success(`${info.file.name} file uploaded successfully.`);
            if (response.data.path) {
              setFileId(response.data.id);
              analysisDoc(response.data.path);
            }
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    const onFinish = async (values: any) => {
      let params = [];
      for (var i = 0; i < fields.length; i++) {
        params.push({
          key: values['key_' + i],
          name: values['name_' + i],
          type: values['type_' + i],
          isNull: values['isNull_' + i] ? 1 : 0,
        });
      }

      const data = {
        name: values.name,
        describe: values.describe,
        fileId: fileId,
        params: JSON.stringify(params),
      };
      const res = await request('/template/add', {
        method: 'POST',
        data,
      });
      console.log(res);
    };

    return (
      <div style={{ margin: 10 }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域以上载</p>
          <p className="ant-upload-hint">仅支持docx文件上传。</p>
        </Dragger>
        <Form onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            style={fields.length === 0 ? { display: 'none' } : {}}
            name="name"
            rules={[{ required: true, message: '请输入模板名称!' }]}
          >
            <Input size="large" placeholder="模板名称" />
          </Form.Item>
          <Form.Item
            name="describe"
            style={fields.length === 0 ? { display: 'none' } : {}}
          >
            <Input.TextArea style={{ height: 100 }} placeholder="请输入备注" />
          </Form.Item>
          {fields.map((field, index) => (
            <Space
              key={index}
              style={{ display: 'flex', marginBottom: 8 }}
              align="start"
            >
              <Form.Item
                {...field}
                name={'key_' + index}
                initialValue={field}
                rules={[{ required: true, message: 'Missing first name' }]}
              >
                <Input placeholder="key" disabled />
              </Form.Item>
              <Form.Item
                name={'name_' + index}
                rules={[{ required: true, message: 'Missing last name' }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item
                name={'type_' + index}
                rules={[{ required: true, message: 'Missing last name' }]}
              >
                <Select defaultValue="string">
                  <Option value="string">文字</Option>
                  <Option value="number">数字</Option>
                  <Option value="text">文本</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'isNull_' + index} valuePropName="checked">
                <Checkbox>是否必填</Checkbox>
              </Form.Item>
            </Space>
          ))}
          <Form.Item style={fields.length === 0 ? { display: 'none' } : {}}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  return (
    <div style={{ margin: 10 }}>
      <Button type="primary" onClick={() => history.push('/template/add')}>
        添加模板
      </Button>
      <Search
        style={{ width: 250, float: 'right' }}
        placeholder="input search text"
        onSearch={value => console.log(value)}
        enterButton
      />
      <List
        style={{ marginTop: 20 }}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          xxl: 5,
        }}
        dataSource={data}
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 10,
        }}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta title="Card title" description="This is the description" />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
