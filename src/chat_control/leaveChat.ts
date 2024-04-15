interface Params {
  chatId: number;
}

export async function leaveChat({ chatId }: Params) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to leave chat!');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
