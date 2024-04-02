export async function deleteGroup(groupId: number) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`),
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete group');
    }
    return true;
  } catch (e) {
    console.error(e);
    window.alert('Failed to delete group');
    return false;
  }
}
