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
  Empty,
} from 'antd';
import { useParams, history } from 'umi';
import request from '@/utils/request';
import moment from 'moment';

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
  templateId: number;
  userId: number;
  describe: string;
}

interface LogInfo {
  verificationId: number;
  key: string;
  formName: string;
  updateValue: string;
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
  let { id } = useParams();
  id = parseInt(id);

  // var reNumber = /^\d+$/;
  // if (!reNumber.test("" + id)) {
  //   history.push('/404');
  // }

  useEffect(() => {
    removeEditLogAndSaveLog(true);

    if (id > 0) {
      request(`/verification/getInfo/${id}`).then(res => {
        if (res.code !== 200) {
          message.error('服务异常！');
          return;
        }

        if (res.data === undefined) {
          return;
        }

        setVerificationInfo(res.data);
        setVerificationParams(JSON.parse(res.data.params));

        request(`/template/getInfoById/${res.data.templateId}`).then(tmpRes => {
          if (tmpRes.code !== 200) {
            message.error('服务异常！');
            return;
          }
          setTemplateParams(JSON.parse(tmpRes.data.params));
        });
      });
    }
  }, []);

  const onFinish = (values: any) => {
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

    Promise.all(params).then(async params => {
      data.params = JSON.stringify(params);

      const res = await request(`/verification/edit/${id}`, {
        method: 'PUT',
        data,
      });

      if (res.code === 200) {
        message.success('编辑鉴定日志成功');

        removeEditLogAndSaveLog(false);

        history.push('/verification');
      } else {
        message.error('编辑鉴定日志失败！');
      }
    });
  };

  const removeEditLogAndSaveLog = (initialize: boolean) => {
    let logKeys: LogInfo[] = [];
    // 删除操作日志记录
    Object.keys(localStorage).forEach(key => {
      if (/^verification_edit_log\|.*/.test(key)) {
        const dataJson: string = localStorage.getItem(key) ?? '';
        const data: LogInfo = JSON.parse(dataJson);
        logKeys.push(data);
        localStorage.removeItem(key);
      }
    });
    Promise.all(logKeys).then(res => {
      if (res.length !== 0) {
        if (!initialize) {
          request('/verification/addLog', {
            method: 'POST',
            data: {
              data: res,
            },
          });
        }
      }
    });
  };

  const onValuesChange = (
    changedValues: any,
    allValues: any,
    tParams: TmpParams[],
  ) => {
    const key = Object.keys(changedValues)[0];
    const value = Object.values(changedValues)[0];
    const time = moment().format('X');

    const localStorageKey = 'verification_edit_log|' + id + '|' + key;

    let formName = '';
    if (['react_umi_describe', 'react_umi_name'].indexOf(key) === -1) {
      tParams.map((item: TmpParams) => {
        if (item.key === key) {
          formName = item.name;

          const data = {
            verificationId: id,
            key: key,
            formName: formName,
            updateValue: value,
            updateTime: time,
          };
          saveLocalStorage(localStorageKey, JSON.stringify(data));
        }
      });
    } else {
      if (key === 'react_umi_describe') {
        formName = '鉴定日志备注';
      } else {
        formName = '鉴定日志名称';
      }

      const data = {
        verificationId: id,
        key: key,
        formName: formName,
        updateValue: value,
        updateTime: time,
      };

      saveLocalStorage(localStorageKey, JSON.stringify(data));
    }
  };

  const saveLocalStorage = (key: string, data: string) => {
    localStorage.setItem(key, data);
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
      <Form
        onFinish={onFinish}
        onValuesChange={(changedValues: any, allValues: any) =>
          onValuesChange(changedValues, allValues, tmpParams)
        }
      >
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
      {JSON.stringify(verificationInfo) !== '{}' ? (
        verificationForm(verificationInfo, verificationParams, templateParams)
      ) : (
        <Empty description={false} />
      )}
    </PageHeader>
  );
};
