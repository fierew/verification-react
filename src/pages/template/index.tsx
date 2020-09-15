import React from 'react';
import { Button, Popconfirm, Space, message } from 'antd';
import { history, useAccess, Link } from 'umi';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import TemplateTable from '@/component/templateTable';
import request from '@/utils/request';
import downloadUtils from '@/utils/downloadUtils';

let reloadTable: any;
export default () => {
  const access = useAccess();

  const disable = (id: number, state: number) => {
    request(`/template/modifyState/${id}`, {
      method: 'PUT',
      data: {
        state: state == 1 ? 0 : 1,
      },
    }).then(res => {
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        reloadTable();
      }
    });
  };

  const reload = (submit: any) => {
    reloadTable = submit;
  };

  const download = (id: number, name: string) => {
    downloadUtils(`/template/downloads/${id}`, name);
  };

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'describe',
      key: 'describe',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 200,
      ellipsis: true,
      render: (text: number) => {
        return <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '操作',
      key: 'operate',
      fixed: 'right',
      width: 110,
      render: (
        text: any,
        record: { state: number; id: number; name: string; file_id: number },
      ) => {
        return (
          <Space size="middle">
            {editButtonModel(record.id)}
            {downloadButtonModel(record.id, record.name)}
            {stateButtonModel(record.id, record.state)}
          </Space>
        );
      },
    },
  ];

  const editButtonModel = (id: number) => {
    if (access.templateEditButton) {
      return <Link to={`/template/edit/${id}`}>编辑</Link>;
    }
  };

  const downloadButtonModel = (id: number, name: string) => {
    if (access.templateDownloadButton) {
      return (
        <a
          onClick={() => {
            download(id, name);
          }}
        >
          下载
        </a>
      );
    }
  };

  const stateButtonModel = (id: number, state: number) => {
    if (access.templateModifyStateButton) {
      return (
        <Popconfirm
          title="是否禁用模板?"
          onConfirm={() => {
            disable(id, state);
          }}
        >
          <a style={state == 1 ? { color: 'red' } : { color: '#4395ff' }}>
            {state == 1 ? '禁用' : '启用'}
          </a>
        </Popconfirm>
      );
    }
  };

  const addButtonModel = () => {
    if (access.templateAddButton) {
      return (
        <Button
          style={{ marginBottom: 15 }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push('/template/add');
          }}
        >
          添加模板
        </Button>
      );
    }
  };

  return (
    <div style={{ padding: 12 }}>
      {addButtonModel()}
      <TemplateTable
        columns={columns}
        pageSize={10}
        stateCondition={0}
        reload={reload}
      />
    </div>
  );
};
