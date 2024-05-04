import { assertIsInvitationList } from '../utils/Asserts';
import { Invitation } from '../utils/Types';

export async function getInvitations(): Promise<Invitation[]> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/invitation'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to get invitations!');
    const data = await response.json();
    const invitationList = data.data;
    assertIsInvitationList(invitationList);
    return invitationList;
  } catch (e) {
    console.error(e);
    return [];
  }
}
