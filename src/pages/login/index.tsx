import React, { useState, useEffect } from 'react';
import styles from './index.css';
import { Link, history, useModel } from 'umi';
import { Button, Form, Input, Checkbox, Row, Col, message } from 'antd';
import {
  UserOutlined,
  KeyOutlined,
  LockOutlined,
  WechatOutlined,
  QqOutlined,
} from '@ant-design/icons';
import UserLayout from '@/layouts/UserLayout';
import request from '@/utils/request';
import { useRequest } from 'ahooks';

export default () => {
  const [rememberPwd, setRememberPwd] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem('email') ?? '');
  const [password, setPassword] = useState(
    localStorage.getItem('password') ?? '',
  );
  const { initialState, loading, error, refresh, setInitialState } = useModel(
    '@@initialState',
  );

  useEffect(() => {
    const checked =
      localStorage.getItem('rememberPwd') === 'true' ? true : false;
    setRememberPwd(checked);
  }, []);

  const checkboxOnChange = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setRememberPwd(e.target.checked);
    localStorage.setItem('rememberPwd', e.target.checked ? 'true' : 'false');
  };

  const onFinish = async (values: any) => {
    if (rememberPwd) {
      localStorage.setItem('email', values.email);
      localStorage.setItem('password', values.password);
    }

    console.log(values);
    const res = await request('/user/login', {
      method: 'POST',
      data: values,
    });

    if (res.code !== 200) {
      message.error(res.msg);
      return false;
    }

    sessionStorage.setItem('email', res.data.email);
    sessionStorage.setItem('userId', res.data.userId);
    sessionStorage.setItem('Authorization', res.data.token);

    setInitialState({
      userid: res.data.userId,
      name: res.data.email,
    });
    history.push('/template');
  };
  const userContent = (
    <div className={styles.pages_user_login_main}>
      <Form onFinish={onFinish}>
        <Form.Item
          name="email"
          initialValue={email}
          rules={[{ required: true, message: '请输入你的邮箱!' }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: 'rgb(24, 144, 255)' }} />}
            placeholder="用户名/邮箱"
          />
        </Form.Item>
        <Form.Item
          name="password"
          initialValue={password}
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: 'rgb(24, 144, 255)' }} />}
            placeholder="密码"
          />
        </Form.Item>
        {/* <Row gutter={8}>
          <Col span={16}>
            <Form.Item
              name="code"
              rules={[{ required: true, message: '请输入验证码!' }]}
            >
              <Input
                autoComplete="off"
                size="large"
                prefix={<KeyOutlined style={{ color: 'rgb(24, 144, 255)' }} />}
                placeholder="验证码"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <img style={{ height: '40px', width: '100%' }} alt="code" src="" />
          </Col>
        </Row> */}
        <Form.Item>
          <Checkbox onChange={checkboxOnChange} checked={rememberPwd}>
            记住密码
          </Checkbox>
          <Link className={styles.pages_user_login_register} to="">
            忘记密码
          </Link>
          <Button
            loading={false}
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.login_form_button}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <div className={styles.pages_user_login_other}>
        <span>其他登陆方式</span>
        <WechatOutlined className={styles.pages_user_login_icon} />
        <QqOutlined className={styles.pages_user_login_icon} />
        <Link className={styles.pages_user_login_register} to="/register">
          注册账户
        </Link>
      </div>
    </div>
  );

  return <UserLayout userContent={userContent} />;
};
