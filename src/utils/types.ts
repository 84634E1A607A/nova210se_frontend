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
 * @description This structure is fetched directly from the backend API return except for the `chatName` field.
 * @field chat: the basic chat
 * @field nickname: the nickname (to display) of the chat that is set by the current user. Can be empty string.
 * Can be set to empty string.
 * @field chat_id: for front-end's convenience, assert chat_id === chat.chat_id. The backend API return doesn't contain this field.
 * @field chatName: The name of the chat that should be displayed directly. It is created using `parseChatName`.
 */
export type ChatRelatedWithCurrentUser = {
  chat: Chat;
  chat_id: number;
  nickname: string;
  unread_count: number;
  chatName?: string;
};

/**
 * @description The info needed to display a friend (when creating a new group). Only for front-end use. So camel case is used.
 */
export type LeastFriendInfo = {
  displayName: string;
  userId: number; // this friend's user ID
  avatarUrl: string | undefined;
};
