export const maxUserNameLength = 32;

export const systemUserName = '#SYSTEM';

// 0. Group xx created by xx with xx, xx, ...
// 1. xx added xx as a friend
// 2. xx removed xx from the group
export const systemMessages = [
  /Group\s(.+)\screated\sby\s(.+)\swith\s((?:(\w+),?\s?)+)/,
  /(.+) added (.+) as a friend/,
  /(.+) removed (.+) from the group/,
];
