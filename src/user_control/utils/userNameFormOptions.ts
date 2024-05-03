import { maxUserNameLength } from '../../utils/ConstValues';

export const pattern = {
  value: /^[a-zA-Z0-9-_()@.]+$/,
  message: 'Invalid user name. Only a-z A-Z 0-9 - _ ( ) @ . are allowed.',
};

export const maxlengthOption = {
  value: maxUserNameLength,
  message: `User name must be at most ${maxUserNameLength} characters long`,
};
