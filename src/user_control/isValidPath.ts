export function isValidPath(path: string, userName: string) {
  const validPaths = [
    '^/$',
    '^/login/?$',
    `^/${userName}/?$`,
    `^/${userName}/friends/?$`,
    `^/${userName}/friends/([^/]+)/?$`,
    `^/${userName}/search_friend/?$`,
    `^/${userName}/invite/?$`,
    `^/${userName}/group_setting/([^/]+)/?$`,
    `^/${userName}/account_management/?$`,
    `^/${userName}/invitation_list/?$`,
  ];

  const pathRegex = new RegExp(validPaths.join('|'));
  return pathRegex.test(path);
}
