export async function deleteGroup(groupId: number, csrftoken: string) {
  try {
    await fetch(process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`), {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrftoken,
      },
    });
  } catch (e) {
    console.error(e);
    window.alert('Failed to delete group');
  }
}
