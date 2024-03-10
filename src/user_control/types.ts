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
