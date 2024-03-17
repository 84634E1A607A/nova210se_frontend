export async function editGroupName(newName: string, groupId: number, csrftoken: string) {
  try {
    await fetch(process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`), {
      method: 'PATCH',
      body: JSON.stringify({ group_name: newName }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
    });
  } catch (e) {
    console.error(e);
    window.alert('Failed to edit group name');
  }
}
