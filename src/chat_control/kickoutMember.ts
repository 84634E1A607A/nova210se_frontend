export async function kickoutMember({ chatId, memberId }: Params): Promise<ReturnType> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/chat/${chatId}/${memberId}`),
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Failed to kickout member!');
    return { isSuccessful: true };
  } catch (e) {
    console.error(e);
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
