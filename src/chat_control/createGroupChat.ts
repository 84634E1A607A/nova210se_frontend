import { assertIsChat } from '../utils/Asserts';

interface Params {
  chatName: string;
  chatMembers: number[];
}

export async function createGroupChat({ chatName, chatMembers }: Params) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/chat/new'), {
      method: 'POST',
      body: JSON.stringify({
        chat_name: chatName,
        chat_members: chatMembers,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create group chat!');
    const data = await response.json();
    const newGroupChat = data.data;
    assertIsChat(newGroupChat);
    return newGroupChat;
  } catch (e) {
    console.error(e);
  }
}
