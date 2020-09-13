export default function(initialState: any) {
  const authData = initialState.auth;

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
  ];

  let res: any = {};
  for (let i = 0; i < paths.length; i++) {
    res[paths[i]] = authData.indexOf(paths[i]) >= 0;
  }

  return res;
}
