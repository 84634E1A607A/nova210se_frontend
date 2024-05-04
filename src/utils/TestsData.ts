import { Friend, LeastUserInfo } from './Types';

export const alice: LeastUserInfo = {
  user_name: 'Alice',
  id: 1,
  avatar_url: 'https://developer.mozilla.org/en-US/docs/web/http/basics_of_http/data_urls',
};

export const bob: LeastUserInfo = {
  user_name: 'Bob',
  id: 2,
  avatar_url: 'https://developer.mozilla.org/en-US/docs/web/http/basics_of_http/data_urls',
};

export const charlie: LeastUserInfo = {
  user_name: 'Charlie',
  id: 3,
  avatar_url: 'https://developer.mozilla.org/en-US/docs/web/http/basics_of_http/data_urls',
};

export const friendAlice: Friend = {
  friend: alice,
  nickname: '',
  group: { group_name: '', group_id: 1 },
};

export const friends: Friend[] = [friendAlice];
