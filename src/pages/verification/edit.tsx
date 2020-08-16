import React, { useState, useEffect } from 'react';
import {
  PageHeader,
  message,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Button,
} from 'antd';
import { useParams, history } from 'umi';
import request from '@/utils/request';

interface VerParams {
  key: string;
  value: string;
}

interface TmpParams {
  key: string;
  name: string;
  type: string;
  isNull: number;
}

interface VerInfo {
  id: number;
  name: string;
  params: string;
  template_id: number;
  user_id: number;
  describe: string;
}

const defaultVerificationParams: VerParams[] = [];
const defaultTemplateParams: TmpParams[] = [];

const defaultVerificationInfo: any = {};

export default () => {
  const [verificationParams, setVerificationParams] = useState(
    defaultVerificationParams,
  );
  const [verificationInfo, setVerificationInfo] = useState(
    defaultVerificationInfo,
  );
  const [templateParams, setTemplateParams] = useState(defaultTemplateParams);
  const { id } = useParams();

  var reNumber = /^\d+$/;
  if (!reNumber.test(id)) {
    history.push('/404');
  }

  useEffect(() => {
    if (id > 0) {
      request(`/verification/getInfo/${id}`).then(res => {
        if (res.code !== 200) {
          message.error('服务异常！');
          return;
        }
        setVerificationInfo(res.data);
        setVerificationParams(JSON.parse(res.data.params));

        request(`/template/getInfoById/${res.data.template_id}`).then(
          tmpRes => {
            if (tmpRes.code !== 200) {
              message.error('服务异常！');
              return;
            }
            setTemplateParams(JSON.parse(tmpRes.data.params));
          },
        );
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

    const res = await request(`/verification/edit/${id}`, {
      method: 'PUT',
      data,
    });

    if (res.code === 200) {
      message.success('编辑鉴定日志成功');
      history.push('/verification');
    } else {
      message.error('编辑鉴定日志失败！');
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
        return <DatePicker placeholder={`请选择${item.name}`} />;
      default:
        return <Input placeholder={`请输入${item.name}`} />;
    }
  };

  const paramsFun = (vParams: VerParams[], tParams: TmpParams[]) => {
    let paramsFormList: JSX.Element[] = [];
    vParams.map((verItem: VerParams, verIndex: number) => {
      tParams.map((tmpItem: TmpParams, tmpIndex: number) => {
        if (verItem.key === tmpItem.key) {
          const fromItem = (
            <Form.Item
              key={verIndex}
              label={tmpItem.name}
              name={verItem.key}
              initialValue={verItem.value}
              rules={[
                {
                  required: tmpItem.isNull === 1,
                  message: `请输入${tmpItem.name}!`,
                },
              ]}
            >
              {formType(tmpItem)}
            </Form.Item>
          );

          if (tmpItem.type === 'text_area') {
            paramsFormList.push(
              <Col xs={24} sm={24} md={24} lg={24} xl={24} key={verIndex}>
                {fromItem}
              </Col>,
            );
          } else {
            paramsFormList.push(
              <Col xs={24} sm={12} md={8} lg={8} xl={6} key={verIndex}>
                {fromItem}
              </Col>,
            );
          }
        }
      });
    });

    return paramsFormList;
  };

  const verificationForm = (
    value: VerInfo,
    params: VerParams[],
    tmpParams: TmpParams[],
  ) => {
    return (
      <Form onFinish={onFinish}>
        <Form.Item
          label="名称"
          name="react_umi_name"
          initialValue={value.name}
          rules={[{ required: true, message: '请输入鉴定名称!' }]}
        >
          <Input size="large" placeholder="鉴定名称" />
        </Form.Item>
        <Form.Item
          label="备注"
          name="react_umi_describe"
          initialValue={value.describe}
          rules={[{ required: true, message: '请输入备注!' }]}
        >
          <Input.TextArea style={{ height: 100 }} placeholder="请输入备注" />
        </Form.Item>
        <Row gutter={24}>{paramsFun(params, tmpParams)}</Row>
        <Form.Item
          style={templateParams.length === 0 ? { display: 'none' } : {}}
        >
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
      {JSON.stringify(verificationInfo) !== '{}' ? (
        verificationForm(verificationInfo, verificationParams, templateParams)
      ) : (
        <></>
      )}
    </PageHeader>
  );
};
