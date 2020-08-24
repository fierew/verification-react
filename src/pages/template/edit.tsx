import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import request from '@/utils/request';
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Col,
  Select,
  Card,
  Empty,
} from 'antd';
import Loading from '@/loading';

const { Option } = Select;

const defTemplateInfo: any = {};
export default () => {
  const [templateInfo, setTemplateInfo] = useState(defTemplateInfo);
  const [templateParams, setTemplateParams] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // 获取模板信息
    if (id > 0) {
      request(`/template/getInfoById/${id}`).then(res => {
        setTemplateInfo(res.data);
        setTemplateParams(JSON.parse(res.data.params));
        setFields(res.data.keys.split(','));
        setLoading(false);
      });
    }
  }, []);

  var reNumber = /^\d+$/;
  if (!reNumber.test(id)) {
    history.push('/404');
  }

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
      fileId: templateInfo.fileId,
      params: JSON.stringify(params),
    };
    const res = await request(`/template/edit/${id}`, {
      method: 'PUT',
      data,
    });

    if (res.code === 200) {
      message.success('修改模板成功');
      history.push('/template');
    } else {
      message.error('修改模板失败！');
    }
  };

  const tempForm = (templateInfo: any, templateParams: any) => {
    return (
      <Form
        onFinish={onFinish}
        style={{ marginTop: 20, maxWidth: 800, margin: 'auto' }}
      >
        <Form.Item
          name="react_umi_name"
          initialValue={templateInfo.name}
          rules={[{ required: true, message: '请输入模板名称!' }]}
        >
          <Input size="large" placeholder="模板名称" />
        </Form.Item>
        <Form.Item
          name="react_umi_describe"
          initialValue={templateInfo.describe}
          rules={[{ required: true, message: '请输入备注!' }]}
        >
          <Input.TextArea style={{ height: 100 }} placeholder="请输入备注" />
        </Form.Item>
        {templateParams.map((field: any, index: number) => (
          <Card key={index}>
            <Row gutter={24}>
              <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                <Form.Item
                  name={'key_' + index}
                  initialValue={field.key}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="key" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                <Form.Item
                  name={'name_' + index}
                  initialValue={field.name}
                  rules={[{ required: true, message: '请输入名称' }]}
                >
                  <Input placeholder="请输入名称" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                <Form.Item
                  name={'type_' + index}
                  initialValue={field.type}
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
                <Form.Item
                  name={'isNull_' + index}
                  initialValue={field.isNull === 1}
                  valuePropName="checked"
                >
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
    );
  };
  return (
    <PageHeader
      onBack={() => {
        window.history.back();
      }}
      title="返回"
    >
      <div style={loading ? {} : { display: 'none' }}>
        <Loading spinning={loading} />
      </div>
      {JSON.stringify(templateInfo) !== '{}' ? (
        tempForm(templateInfo, templateParams)
      ) : (
        <Empty description={false} />
      )}
    </PageHeader>
  );
};
