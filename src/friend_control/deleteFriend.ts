export async function deleteFriend(friendUserId: number, csrftoken: string) {
  try {
    fetch(process.env.REACT_APP_API_URL!.concat(`/friend/${friendUserId}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    });
  } catch (e) {
    console.log(e);
    window.alert('Failed to delete friend');
  }
}
