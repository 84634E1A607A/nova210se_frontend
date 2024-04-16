import { ChatPurview } from '../utils/types';

/**
 * @returns `ReturnType`: if the operation succeeds, the purview now of the user, and his user id.
 * @param `setToAdmin`: true to set the member to admin, false to remove an admin.
 */
export async function setAdmin({ chatId, memberId, setToAdmin }: Params): Promise<ReturnType> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/${memberId}/admin`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setToAdmin),
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Failed to set admin');
    return { isSuccessful: true, purview: setToAdmin ? 'Admin' : 'Member', memberUserId: memberId };
  } catch (e) {
    console.error(e);
    return { isSuccessful: false, purview: undefined, memberUserId: memberId };
  }
}

interface Params {
  chatId: number;
  memberId: number;
  setToAdmin: boolean;
}

interface ReturnType {
  isSuccessful: boolean;
  purview: ChatPurview | undefined;
  memberUserId: number;
}
