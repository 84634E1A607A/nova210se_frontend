import { parseNameOfFriend } from '../friend_control/utils/parseNameOfFirend';
import { Chat, ChatRelatedWithCurrentUser, Friend } from '../utils/types';

/**
 * @description Parse the chat name that should be displayed everywhere, such as in the chat list or in the header of a single chat.
 * For example, for a private chat's name, maybe the chat name should always be the nickname or name of the friend.
 * @usage This function must be used with both the chat or the chat related with the current user and the current user's friends as prop-up.
 * @Warning Be careful with when the `chatName` should be updated. For exmaple, `chatName` is of the highest priority, and when change
 * cache related with chat name, `chatName` must be updated because in this function, if `chatName` exists, it will be returned directly.
 */
export function parseChatName(
  chat: ChatRelatedWithCurrentUser | Chat,
  currentUserName: string,
  friends: Friend[],
): string {
  if ('chatName' in chat && chat.chatName) return chat.chatName;
  if ('nickname' in chat && chat.nickname !== '') return chat.nickname;

  let thisChat: Chat;
  if ('chat' in chat) thisChat = chat.chat;
  else thisChat = chat;

  if (thisChat.chat_name === '') {
    if (thisChat.chat_members.length !== 2) return 'Unnamed group chat';
    else {
      const friendLeastInfo = thisChat.chat_members.filter(
        (member) => member.user_name !== currentUserName,
      )[0]; // this doesn't contain nickname of the friend
      const friend = friends.filter((friendItem) => friendItem.friend.id === friendLeastInfo.id)[0];
      return parseNameOfFriend(friend);
    }
  } else return thisChat.chat_name;
}
