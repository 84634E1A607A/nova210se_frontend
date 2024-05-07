import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function kickoutMember({ chatId, memberId }: Params): Promise<ReturnType> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/${memberId}`),
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Failed to kick out member!');
    return { isSuccessful: true };
  } catch (e) {
    console.log(expectedException, e);
    return { isSuccessful: false };
  }
}

interface Params {
  chatId: number;
  memberId: number;
}

interface ReturnType {
  isSuccessful: boolean;
}
