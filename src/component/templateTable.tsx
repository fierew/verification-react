import React, { useState } from 'react';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import request from '@/utils/request';
import { Button, Col, Form, Input, Row, Table } from 'antd';
import { useAntdTable } from 'ahooks';

interface Item {
  name: string;
  describe: string;
  create_time: string;
  update_time: string;
}

interface Result {
  total: number;
  list: Item[];
}

const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Object,
): Promise<Result> => {
  let query = `page=${current}&pageSize=${pageSize}`;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });
  return request(`/template/getList?${query}`).then(res => ({
    total: res.data.total,
    list: res.data.list,
  }));
};

export default (props: any) => {
  const [form] = Form.useForm();
  const { columns, pageSize, rowSelection } = props;

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: pageSize,
    form,
  });

  const { type, changeType, submit, reset } = search;

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="名称" name="name">
              <Input placeholder="名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
            <Button onClick={reset} style={{ marginLeft: 16 }}>
              重置
            </Button>
            <Button type="link" onClick={changeType}>
              简单搜索
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  const searchFrom = (
    <div>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="name">
          <Input.Search
            placeholder="搜索名称"
            style={{ width: 240 }}
            onSearch={submit}
          />
        </Form.Item>
        <Button type="link" onClick={changeType}>
          高级搜索
        </Button>
      </Form>
    </div>
  );

  return (
    <>
      {type === 'simple' ? searchFrom : advanceSearchForm}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowKey="id"
        {...tableProps}
        scroll={{ x: '100%' }}
      />
    </>
  );
};
