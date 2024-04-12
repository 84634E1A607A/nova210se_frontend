export function isValidPath(path: string, userName: string) {
  const validPaths = [
    '^/$',
    '^/login/?$',
    `^/${userName}/?$`,
    `^/${userName}/chats/?$`,
    `^/${userName}/chats/[0-9]+/?$`,
    `^/${userName}/friends/?$`,
    `^/${userName}/search_friend/?$`,
    `^/${userName}/invite/?$`,
    `^/${userName}/account_management/?$`,
    `^/${userName}/invitation_list/?$`,
    `^/${userName}/create_group_chat/?$`,
  ];

  const pathRegex = new RegExp(validPaths.join('|'));
  return pathRegex.test(path);
}
