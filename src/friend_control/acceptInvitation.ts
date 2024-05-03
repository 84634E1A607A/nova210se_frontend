import { assertIsFriend } from '../utils/Asserts';

/**
 *
 * @param invitationId: number
 * @returns Friend (if succeeded)
 * @returns undefined (if failed)
 */
export async function acceptInvitation(invitationId: number) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/invitation/${invitationId}`),
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    if (!response.ok) throw new Error('Response is not ok');
    const data = await response.json();
    const friend = data.data;
    if (friend === undefined) throw new Error('Response does not contain friend');
    assertIsFriend(friend);
    return friend;
  } catch (e) {
    console.error(e);
    window.alert('Failed to accept invitation');
  }
}
