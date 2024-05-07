import { Chat, ChatRelatedWithCurrentUser, DetailedMessage } from '../utils/Types';
import { assertIsDetailedMessages } from '../utils/Asserts';
import { expectedException } from '../utils/consts/DebugAndDevConsts';

/**
 * @description List all messages of the current chat. If failed, return an empty array list.
 * @returns List of messages, the messages are detailed messages
 */
export async function getDetailedMessages(chat: Chat | ChatRelatedWithCurrentUser | number) {
  const chatId = typeof chat === 'number' ? chat : chat.chat_id;
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/messages`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Failed to get messages!');
    const data = await response.json();
    const messages = data.data;
    assertIsDetailedMessages(messages);
    return messages;
  } catch (e) {
    console.log(expectedException, e);
    return [] as Array<DetailedMessage>;
  }
}
