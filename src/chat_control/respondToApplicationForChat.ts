import { expectedException } from '../utils/consts/DebugAndDevConsts';

/**
 * @return true if the application was responded to successfully, false otherwise
 */
export async function respondToApplicationForChat({
  action,
  chatId,
  userId,
}: RespondToApplicationParams) {
  const url = `/chat/${chatId}/invitation/${userId}`;
  try {
    let response: Response;
    if (action === 'approve') {
      response = await fetch(process.env.REACT_APP_API_URL!.concat(url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        credentials: 'include',
      });
    } else {
      response = await fetch(process.env.REACT_APP_API_URL!.concat(url), {
        method: 'DELETE',
        credentials: 'include',
      });
    }
    if (!response.ok) throw new Error('Failed to respond to an application!');
    return true;
  } catch (e) {
    console.log(expectedException, e);
    return false;
  }
}

export interface RespondToApplicationParams {
  action: 'approve' | 'reject';
  chatId: number;
  userId: number;
}
