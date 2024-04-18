export async function updateFriend(
  nickname: string,
  group_id: number | undefined,
  friend_user_id: number,
) {
  const bodyData =
    nickname === '' ? { group_id } : group_id === undefined ? { nickname } : { nickname, group_id };
  try {
    const reponse = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/${friend_user_id}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
        credentials: 'include',
      },
    );
    if (!reponse.ok) {
      throw new Error('Failed to update a friend');
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
