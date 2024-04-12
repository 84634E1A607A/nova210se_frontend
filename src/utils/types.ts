// the leftmost list's item type, for example, friends and group chats belonged to the current user
export type LoginInfo = {
  user_name: string;
  password: string;
};

export type PostMethodReturn = {
  status_code: number;
  message?: string;
  ok?: boolean;
};

export type ChooseLoginType = 'login' | 'register';

export type LeastUserInfo = {
  id: number;
  user_name: string;
  avatar_url: string;
  phone?: string;
  email?: string;
};

export type InvitationSourceType = 'search' | number;

export type Invitation = {
  id: number;
  comment: string;
  sender: LeastUserInfo;
  source: InvitationSourceType;
};

export type Group = { group_id: number; group_name: string };

export type Friend = { friend: LeastUserInfo; nickname: string; group: Group };

// maybe some field names are wrong
export type UrlParams = { user_name: string; friend_user_id?: string; group_id?: string };

export type Message = {
  message_id: number;
  chat_id: number;
  message: string;
  send_time: number;
  sender: LeastUserInfo;
};

export type DetailedMessage = Message & {
  reply_to: Message | null;
  read_users: LeastUserInfo[];
  replied_by: Message[];
};

export type Chat = {
  chat_id: number;
  chat_name: string;
  chat_owner: LeastUserInfo;
  chat_admins: LeastUserInfo[];
  chat_members: LeastUserInfo[];
  last_message: Message;
};

/**
 * @field chat: the basic chat
 * @field nickname: the nickname (to display) of the chat that is set by the current user. Can be empty string.
 * Can be set to empty string.
 * @field chat_id: for front-end's convenience, assert chat_id === chat.chat_id
 */
export type ChatRelatedWithCurrentUser = {
  chat: Chat;
  chat_id: number;
  nickname: string;
  unread_count: number;
};

/**
 * @description The info needed to display a friend (when creating a new group). Only for front-end use. So camel case is used.
 */
export type LeastFriendInfo = {
  displayName: string;
  userId: number;
  avatarUrl: string | undefined;
};
