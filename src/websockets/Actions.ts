/**
 * @description All web socket actions. These string values are defined by API (backend)
 */

export const receiveMessageS2CActionWS = 'new_message';

export const sendMessageC2SActionWS = 'send_message';

export const receiveApplicationForChatS2CActionWS = 'chat_invitation';

export const receiveMemberAddedS2CActionWS = 'member_added';

export const receiveFriendDeletedS2CActionWS = 'friend_deleted';

export const receiveChatDeletedS2CActionWS = 'chat_deleted';

export const receiveMemberRemovedS2CActionWS = 'member_deleted';

export const sendReadMessagesC2SActionWS = 'messages_read';

export const receiveReadMessagesS2CActionWS = 'messages_read';

export const sendDeleteMessageC2SActionWS = 'recall_message';

// by the way, `data` is {message_id: 24}
export const receiveMessageDeletedS2CActionWS = 'message_deleted';
