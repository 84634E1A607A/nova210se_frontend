export async function addFriendForGroup(
  group_id: number,
  friend_user_id: number,
  csrftoken: string,
) {
  try {
    await fetch(process.env.REACT_APP_API_URL!.concat(`/friend/${friend_user_id}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ group_id }),
      credentials: 'include',
    });
  } catch (e) {
    console.error(e);
    window.alert('Failed to add friend to group');
  }
}
