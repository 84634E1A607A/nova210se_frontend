import { leaveChat } from './leaveChat';

/**
 * @warning The caller should judge whether the current user is the owner.
 */
export async function deleteChat(chatId: number) {
  return await leaveChat({ chatId });
}
