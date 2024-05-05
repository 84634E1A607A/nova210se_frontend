import { systemUserName } from '../../utils/consts/SystemValues';

/**
 * @description Check extra rules for user_name. Now backend and frontend don't allow # in user_name,
 * so it's kind of useless.
 */
export const validateUserName = (userName: string) => {
  return userName !== systemUserName || 'User name cannot be the system user name';
};
