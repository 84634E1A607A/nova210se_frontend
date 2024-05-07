import { assertIsChatRelatedWithCurrentUser } from '../utils/Asserts';
import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function getChatInfo({ chatId }: Params) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      // @ts-ignore
      throw new Error('Failed to get chat info!');
    }
    const data = await response.json();
    const chatInfo = data.data;
    assertIsChatRelatedWithCurrentUser(chatInfo);
    return chatInfo;
  } catch (e) {
    console.log(expectedException, e);
    return undefined;
  }
}

interface Params {
  chatId: number;
}
