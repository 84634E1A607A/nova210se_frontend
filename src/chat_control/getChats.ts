import { assertIsChatsRelatedWithCurrentUser } from '../utils/Asserts';
import { ChatRelatedWithCurrentUser } from '../utils/Types';
import { expectedException } from '../utils/consts/DebugAndDevConsts';

/**
 * @description List all chats of the current user. If failed, return an empty array list.
 * @returns List of chats, the chats are detailed chats (with `nickname`, etc. related with the current user )
 */
export async function getChats() {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/chat'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to get chats!');
    const data = await response.json();
    const chats = data.data;
    assertIsChatsRelatedWithCurrentUser(chats);
    return chats;
  } catch (e) {
    console.log(expectedException, e);
    return [] as Array<ChatRelatedWithCurrentUser>;
  }
}
