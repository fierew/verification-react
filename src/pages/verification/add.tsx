import React, { useState, useEffect } from 'react';
import { Form, Input, PageHeader, InputNumber, Button } from 'antd';
import request from '@/utils/request';
import { useParams } from 'umi';

interface Params {
  key: string;
  name: string;
  type: string;
  isNull: number;
}

export default () => {
  const [templateParams, setTemplateParams] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (id > 0) {
      request(`/template/getInfoById/${id}`).then(res => {
        setTemplateParams(JSON.parse(res.data.params));
      });
    }
  }, []);

  return (
    <PageHeader
      onBack={() => {
        window.history.back();
      }}
      title="返回"
    >
      <Form style={{ marginTop: 20, maxWidth: 800, margin: 'auto' }}>
        <Form.Item
          style={templateParams.length === 0 ? { display: 'none' } : {}}
          label="鉴定名称"
          name="name"
          rules={[{ required: true, message: '请输入鉴定名称!' }]}
        >
          <Input size="large" placeholder="鉴定名称" />
        </Form.Item>
        <Form.Item
          style={templateParams.length === 0 ? { display: 'none' } : {}}
          label="备注"
          name="describe"
          rules={[{ required: true, message: '请输入备注!' }]}
        >
          <Input.TextArea style={{ height: 100 }} placeholder="请输入备注" />
        </Form.Item>
        {templateParams.map((item: Params) => {
          if (item.type === 'number') {
            return (
              <Form.Item
                style={templateParams.length === 0 ? { display: 'none' } : {}}
                label={item.name}
                name={item.key}
                rules={[
                  {
                    required: item.isNull === 1,
                    message: `请输入${item.name}!`,
                  },
                ]}
              >
                <InputNumber width={200} />
              </Form.Item>
            );
          }
          return (
            <Form.Item
              style={templateParams.length === 0 ? { display: 'none' } : {}}
              label={item.name}
              name={item.key}
              rules={[
                { required: item.isNull === 1, message: `请输入${item.name}!` },
              ]}
            >
              <Input size="large" placeholder={item.name} />
            </Form.Item>
          );
        })}
        <Form.Item
          style={templateParams.length === 0 ? { display: 'none' } : {}}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </PageHeader>
  );
};
