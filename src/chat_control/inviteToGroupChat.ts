interface Params {
  chatId: number;
  userId: number;
}

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
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
