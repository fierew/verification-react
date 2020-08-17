import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  PageHeader,
  InputNumber,
  Button,
  DatePicker,
  message,
  Row,
  Col,
  Empty,
} from 'antd';
import request from '@/utils/request';
import { useParams, history } from 'umi';

interface Params {
  key: string;
  name: string;
  type: string;
  isNull: number;
}

export default () => {
  const [templateParams, setTemplateParams] = useState([]);
  const { id } = useParams();

  var reNumber = /^\d+$/;
  if (!reNumber.test(id)) {
    history.push('/404');
  }

  useEffect(() => {
    if (id > 0) {
      request(`/template/getInfoById/${id}`).then(res => {
        setTemplateParams(JSON.parse(res.data.params));
      });
    }
  }, []);

  const onFinish = async (values: any) => {
    const data = {
      name: values.react_umi_name,
      describe: values.react_umi_describe,
      templateId: id,
      params: '{}',
    };
    delete values.react_umi_name;
    delete values.react_umi_describe;

    let params: { key: string; value: any }[] = [];
    Object.keys(values).forEach((key: string) => {
      if (typeof values[key] === 'object') {
        values[key] = values[key].format('YYYY-MM-DD');
      }

      params.push({
        key: key,
        value: values[key],
      });
    });

    data.params = JSON.stringify(params);

    const res = await request('/verification/add', {
      method: 'POST',
      data,
    });

    if (res.code === 200) {
      message.success('添加鉴定日志成功');
      history.push('/verification');
    } else {
      message.error('添加鉴定日志失败！');
    }
  };

  const formType = (item: any) => {
    switch (item.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'text_area':
        return (
          <Input.TextArea
            style={{ height: 100 }}
            placeholder={`请输入${item.name}`}
          />
        );
      case 'date':
        return (
          <DatePicker
            placeholder={`请选择${item.name}`}
            style={{ width: '100%' }}
          />
        );
      default:
        return <Input placeholder={`请输入${item.name}`} />;
    }
  };

  const paramsFun = (params: Params[]) => {
    let paramsFormList: JSX.Element[] = [];
    params.map((item: Params, index: number) => {
      const fromItem = (
        <Form.Item
          key={index}
          label={item.name}
          name={item.key}
          rules={[
            {
              required: item.isNull === 1,
              message: `请输入${item.name}!`,
            },
          ]}
        >
          {formType(item)}
        </Form.Item>
      );
      if (item.type === 'text_area') {
        paramsFormList.push(
          <Col xs={24} sm={24} md={24} lg={24} xl={24} key={index}>
            {fromItem}
          </Col>,
        );
      } else {
        paramsFormList.push(
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={index}>
            {fromItem}
          </Col>,
        );
      }
    });

    return paramsFormList;
  };

  return (
    <PageHeader
      onBack={() => {
        window.history.back();
      }}
      title="返回"
    >
      {templateParams.length === 0 ? (
        <Empty description={false} />
      ) : (
        <Form onFinish={onFinish}>
          <Form.Item
            label="名称"
            name="react_umi_name"
            rules={[{ required: true, message: '请输入鉴定名称!' }]}
          >
            <Input size="large" placeholder="鉴定名称" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="react_umi_describe"
            rules={[{ required: true, message: '请输入备注!' }]}
          >
            <Input.TextArea style={{ height: 100 }} placeholder="请输入备注" />
          </Form.Item>
          <Row gutter={24}>{paramsFun(templateParams)}</Row>
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
