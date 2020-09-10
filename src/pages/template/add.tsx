import React, { useState } from 'react';
import {
  Button,
  Input,
  Upload,
  message,
  Form,
  Checkbox,
  Select,
  PageHeader,
  Row,
  Col,
  Card,
  Empty,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { history } from 'umi';
import CryptoJS from 'crypto-js';
import request from '@/utils/request';
import Loading from '@/loading';
import { httpUrl } from '@/utils/config';

const { Dragger } = Upload;
const { Option } = Select;

export default () => {
  const [fileList, setFileList] = useState([]);
  const [fields, setFields] = useState([]);
  const [fileId, setFileId] = useState(0);
  const [loading, setLoading] = useState(false);

  const analysisDoc = async (filePath: any) => {
    // 解析docx
    setLoading(true);
    const res = await request(`/template/analysis?filePath=${filePath}`);
    if (res.code !== 200) {
      message.error(res.msg);
    }

    setLoading(false);
    setFields(res.data);
  };

  const props: any = {
    name: 'file',
    accept: '.doc,.docx',
    fileList,
    headers: {
      Authorization: sessionStorage.getItem('Authorization'),
    },
    action: httpUrl + '/file/upload',
    data(file: any) {
      return new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          const wordArray = CryptoJS.lib.WordArray.create(reader.result);
          const hash = CryptoJS.SHA256(wordArray).toString();

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

      // @ts-ignore
      setFileList(fileList);

      const { status, response } = info.file;
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      if (status === 'done') {
        if (response.code != 200) {
          message.error(response.msg);
        } else {
          //message.success(`${info.file.name} file uploaded successfully.`);
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
      name: values.react_umi_name,
      describe: values.react_umi_describe,
      fileId: fileId,
      params: JSON.stringify(params),
    };
    const res = await request('/template/add', {
      method: 'POST',
      data,
    });

    if (res.code === 200) {
      message.success('添加模板成功');
      history.push('/template');
    } else {
      message.error('添加模板失败！');
    }
  };

  return (
    <PageHeader
      onBack={() => {
        setFields([]);
        setFileId(0);
        setFileList([]);
        window.history.back();
      }}
      title="返回"
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域以上载</p>
        <p className="ant-upload-hint">仅支持docx文件上传。</p>
      </Dragger>
      <div style={loading ? {} : { display: 'none' }}>
        <Loading spinning={loading} />
      </div>
      {fields.length === 0 ? (
        <Empty description={false} style={{ marginTop: 50 }} />
      ) : (
        <Form
          onFinish={onFinish}
          style={{ marginTop: 20, maxWidth: 800, margin: 'auto' }}
        >
          <Form.Item
            name="react_umi_name"
            rules={[{ required: true, message: '请输入模板名称!' }]}
          >
            <Input size="large" placeholder="模板名称" />
          </Form.Item>
          <Form.Item
            name="react_umi_describe"
            rules={[{ required: true, message: '请输入备注!' }]}
          >
            <Input.TextArea style={{ height: 100 }} placeholder="请输入备注" />
          </Form.Item>
          {fields.map((field, index) => (
            <Card key={index}>
              <Row gutter={24}>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item
                    name={'key_' + index}
                    initialValue={field}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="key" disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item
                    name={'name_' + index}
                    rules={[{ required: true, message: '请输入名称' }]}
                  >
                    <Input placeholder="请输入名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item
                    name={'type_' + index}
                    initialValue="text"
                    rules={[{ required: true, message: '请选择类型' }]}
                  >
                    <Select placeholder="请选择类型">
                      <Option value="text">文本</Option>
                      <Option value="number">数字</Option>
                      <Option value="text_area">长文本</Option>
                      <Option value="date">时间</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item name={'isNull_' + index} valuePropName="checked">
                    <Checkbox>是否必填</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      )}
    </PageHeader>
  );
};
