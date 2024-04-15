import { parseNameOfFriend } from '../friend_control/utils/parseNameOfFirend';
import { ChatRelatedWithCurrentUser, Friend } from '../utils/types';

/**
 * @description Parse the chat name that should be displayed everywhere, such as in the chat list or in the header of a single chat.
 * For example, for a private chat's name, maybe the chat name should always be the nickname or name of the friend.
 * @usage This function must be used with both the chat or the chat related with the current user and the current user's friends as prop-up.
 * @Warning Be careful with `chatName`. It shouldn't be updated in cache. It will only be set in `ChatMainPageFramework`
 * before this field is used by lower consumer components.
 */
export function parseChatName(
  chat: ChatRelatedWithCurrentUser,
  currentUserName: string,
  friends: Friend[],
): string {
  if (chat.nickname !== '') return chat.nickname;

  const thisChat = chat.chat;

  if (thisChat.chat_name === '') {
    // means it's a private chat (between two people and can't be extended to more people)
    const friendLeastInfo = thisChat.chat_members.filter(
      (member) => member.user_name !== currentUserName,
    )[0]; // this doesn't contain nickname of the friend
    const friend = friends.filter((friendItem) => friendItem.friend.id === friendLeastInfo.id)[0];
    return parseNameOfFriend(friend);
  } else return thisChat.chat_name;
}
