export const systemUserName = '#SYSTEM';

// 0. Group xx created by xx with xx, xx, ...
// 1. xx added xx as a friend
// 2. xx removed xx from the group
// 3. xx left the chat
// 4. xx approved xx to join the group, invited by xx
export const systemMessages = [
  /Group\s(.+)\screated\sby\s(.+)\swith\s((?:(\w+),?\s?)+)/,
  /(.+) added (.+) as a friend/,
  /(.+) removed (.+) from the group/,
  /(.+) left the chat/,
  /(.+) approved (.+) to join the group, invited by (.+)/,
];
