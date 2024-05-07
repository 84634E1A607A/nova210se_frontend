import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function leaveChat({ chatId }: Params): Promise<ReturnType> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to leave chat!');
    return { isSuccessful: true };
  } catch (e) {
    console.log(expectedException, e);
    return { isSuccessful: false };
  }
}

interface Params {
  chatId: number;
}

interface ReturnType {
  isSuccessful: boolean;
}
