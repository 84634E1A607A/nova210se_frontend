/**
 *
 * @param invitationId: number
 * @returns true (if succeeded)
 * @returns false (if failed)
 */
export async function rejectInvitation(invitationId: number): Promise<boolean> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/invitation/${invitationId}`),
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Response is not ok');
    return true;
  } catch (e) {
    console.error(e);
    window.alert('Failed to reject invitation');
    return false;
  }
}
