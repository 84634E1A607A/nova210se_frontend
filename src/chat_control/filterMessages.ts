import { expectedException } from '../utils/consts/DebugAndDevConsts';
import { DetailedMessage } from '../utils/Types';
import { assertIsDetailedMessages } from '../utils/Asserts';

export async function filterMessages({
  beginTime,
  endTime,
  sender,
  chatId,
}: Params): Promise<ReturnType> {
  let filterRequestPostBody: any = {};
  if (beginTime) {
    filterRequestPostBody.begin_time = beginTime;
    filterRequestPostBody.end_time = endTime;
  }
  if (sender) {
    filterRequestPostBody.sender = sender;
  }
  if (!beginTime && !sender) {
    return {
      messages: [],
      isSuccessful: false,
    };
  }

  const httpRequestUrl = process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/filter`);

  try {
    const response = await fetch(httpRequestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterRequestPostBody),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to get filter messages!');
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

interface Params {
  beginTime?: number;
  endTime?: number;
  sender?: Array<number>;
  chatId: number;
}

interface ReturnType {
  messages: DetailedMessage[];
  isSuccessful: boolean;
}
