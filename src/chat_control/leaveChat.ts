export async function leaveChat({ chatId }: Params): Promise<ReturnType> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to leave chat!');
    return { isSuccessful: true };
  } catch (e) {
    console.error(e);
    return { isSuccessful: false };
  }
}

interface Params {
  chatId: number;
}

interface ReturnType {
  isSuccessful: boolean;
}
