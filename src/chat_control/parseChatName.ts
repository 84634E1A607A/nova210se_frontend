import { Chat, ChatRelatedWithCurrentUser } from '../utils/types';

/**
 * @description Only for frontend, to parse the chat name that should be displayed everywhere.
 * For example, for a private chat's name, maybe the chat name should always be the nickname or name of the friend.
 */
export function parseChatName(
  chat: ChatRelatedWithCurrentUser | Chat,
  currentUserName: string,
): string {
  if ('nickname' in chat && chat.nickname !== '') {
    return chat.nickname;
  }
  let thisChat: Chat;
  if ('chat' in chat) {
    thisChat = chat.chat;
  } else {
    thisChat = chat;
  }
  if (thisChat.chat_name === '') {
    if (thisChat.chat_members.length !== 2) return 'Unnamed group chat';
    else {
      const friend = thisChat.chat_members.filter(
        (member) => member.user_name !== currentUserName,
      )[0];
      return friend.user_name;
    }
  } else return thisChat.chat_name;
}
