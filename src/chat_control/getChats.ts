import { assertIsChatsRelatedWithCurrentUser } from '../utils/asserts';
import { ChatRelatedWithCurrentUser } from '../utils/types';

/**
 * @description List all chats of the current user. If failed, return an empty array list.
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
    console.error(e);
    return [] as Array<ChatRelatedWithCurrentUser>;
  }
}
