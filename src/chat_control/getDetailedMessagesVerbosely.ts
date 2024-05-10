import { Chat, ChatRelatedWithCurrentUser, DetailedMessage } from '../utils/Types';
import { assertIsDetailedMessages } from '../utils/Asserts';
import { expectedException } from '../utils/consts/DebugAndDevConsts';

/**
 * @description List all messages of the current chat with isSuccessful as extra return field
 */
export async function getDetailedMessagesVerbosely(
  chat: Chat | ChatRelatedWithCurrentUser | number,
): Promise<DetailedMessagesReturnType> {
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
    return {
      messages,
      isSuccessful: true,
    };
  } catch (e) {
    console.log(expectedException, e);
    return {
      messages: [],
      isSuccessful: false,
    };
  }
}

export interface DetailedMessagesReturnType {
  messages: DetailedMessage[];
  isSuccessful: boolean;
}
