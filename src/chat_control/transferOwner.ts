import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function transferOwner({ chatId, newOwnerId }: Params): Promise<ReturnType> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/set_owner`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_owner: newOwnerId }),
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Failed to transfer owner');
    return { isSuccessful: true };
  } catch (e) {
    console.log(expectedException, e);
    return { isSuccessful: false };
  }
}

interface Params {
  chatId: number;
  newOwnerId: number;
}

interface ReturnType {
  isSuccessful: boolean;
}
