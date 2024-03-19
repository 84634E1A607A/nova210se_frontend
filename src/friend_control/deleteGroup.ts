export async function deleteGroup(groupId: number) {
  try {
    await fetch(process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (e) {
    console.error(e);
    window.alert('Failed to delete group');
  }
}
