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

export type LeastUserInfo = { id: number; user_name: string; avatar: string };

export type InvitationSourceType = 'search' | number;

export type Invitation = {
  id: number;
  comment: string;
  sender: string;
  source: InvitationSourceType;
};

export type Group = { group_id: number; group_name: string };

export type Friend = { friend: LeastUserInfo; nickname: string; group: Group };

export type ListItem = {
  name: string;
  avatar_url: string;
  last_message: string | undefined;
  has_unread: boolean;
  unread_count: number; // the requirement document mandates this field to be shown
};
