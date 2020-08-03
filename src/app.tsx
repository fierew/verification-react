import React from 'react';
import request from '@/utils/request';
import { UseRequestProvider } from 'ahooks';
import { history } from 'umi';

export const layout = {
    logout: () => {
        history.push('/login');
    },
    childrenRender: (children: React.ReactNode) => {
        return (
            <UseRequestProvider
                value={{
                    requestMethod: (param: any) => request(param.url, param),
                }}
            >
                {children}
            </UseRequestProvider>
        );
    },
};

export async function getInitialState() {
    return {
        userid: 1,
        name: 'Serati Ma',
        role: 'admin',
    };
}
