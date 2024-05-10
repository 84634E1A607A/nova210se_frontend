import { DetailedMessage, LeastUserInfo } from '../../utils/Types';

/**
 * @description Get whether the sender of the message is the current user.
 */
export const getIsSelf = (detailedMessage: DetailedMessage, currentUser: LeastUserInfo) => {
  return detailedMessage.sender.id === currentUser.id;
};
