export type S2CMessage = {
  action: string;
  data: any;
  ok: boolean;
};

export type S2CMessageError = {
  action: string;
  ok: boolean;
  code: number;
  error: string;
};

export type C2SMessage = {
  action: string;
  data: any;
};
