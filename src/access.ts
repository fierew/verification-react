export default function(initialState: any) {
  const init = initialState ?? [];
  const authData = init.auth ?? [];
  if (authData) {
    const paths = [
      '/template',
      '/template/add',
      '/template/edit',
      '/verification',
      '/verification/add',
      '/verification/edit',
      '/verification/log',
      '/rbac/dept',
      '/rbac/resource',
      '/rbac/role',
      '/rbac/user',
      '/log/login',

      'templateAddButton',
      'templateEditButton',
      'templateDownloadButton',
      'templateModifyStateButton',

      'verificationAddButton',
      'verificationEditButton',
      'verificationLogButton',
      'verificationDownloadsButton',
      'verificationDeleteButton',

      'rbacDeptAddButton',
      'rbacDeptEditButton',
      'rbacDeptDeleteButton',

      'rbacResourceAddButton',
      'rbacResourceEditButton',
      'rbacResourceDeleteButton',

      'rbacRoleAddButton',
      'rbacRoleEditButton',
      'rbacRoleDeleteButton',

      'rbacUserAddButton',
      'rbacUserEditButton',
      'rbacUserDeleteButton',
      'rbacUserModifyPwdButton',
    ];

    let res: any = {};
    for (let i = 0; i < paths.length; i++) {
      res[paths[i]] = authData.indexOf(paths[i]) >= 0;
    }

    return res;
  }

  return [];
}
