export async function deleteFriend(friendUserId: number) {
  try {
    fetch(process.env.REACT_APP_API_URL!.concat(`/friend/${friendUserId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (e) {
    console.log(e);
    window.alert('Failed to delete friend');
  }
}
