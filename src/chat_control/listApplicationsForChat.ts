import { assertIsApplicationsForChat } from '../utils/Asserts';
import { ApplicationForChat } from '../utils/Types';
import { expectedException } from '../utils/consts/DebugAndDevConsts';

/**
 * @description List applications for entering a specific chat.
 */
export async function listApplicationsForChat({ chatId }: Params): Promise<ApplicationForChat[]> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/invitation`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Failed to get applications for chat!');
    const data = await response.json();
    const applicationsList = data.data;
    assertIsApplicationsForChat(applicationsList);
    return applicationsList;
  } catch (e) {
    console.log(expectedException, e);
    return [];
  }
}

interface Params {
  chatId: number;
}
