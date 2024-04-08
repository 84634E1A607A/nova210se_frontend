export function isValidPath(path: string, userName: string) {
  const validPaths = [
    '^/$',
    '^/login/?$',
    `^/${userName}/?$`,
    `^/${userName}/friends/?$`,
    `^/${userName}/search_friend/?$`,
    `^/${userName}/invite/?$`,
    // `^/${userName}/group_setting/([^/]+)/?$`,
    `^/${userName}/account_management/?$`,
    `^/${userName}/invitation_list/?$`,
    `^/${userName}/create_group_chat/?$`,
  ];

  const pathRegex = new RegExp(validPaths.join('|'));
  return pathRegex.test(path);
}
