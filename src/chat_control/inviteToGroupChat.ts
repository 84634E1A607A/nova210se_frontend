import { expectedException } from '../utils/consts/DebugAndDevConsts';

/**
 * @param chatId - The ID of the group chat to invite the friend to.
 * @param userId - The ID of the friend to invite to the group chat.
 */
export async function inviteToGroupChat({ chatId, userId }: Params) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/invite`), {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to invite to group chat!');
    return { isSuccessful: true, chatId, userId } as ReturnType;
  } catch (e) {
    console.log(expectedException, e);
    return { isSuccessful: false, chatId, userId } as ReturnType;
  }
}

interface Params {
  chatId: number;
  userId: number;
}

interface ReturnType {
  isSuccessful: boolean;
  chatId: number;
  userId: number;
}
