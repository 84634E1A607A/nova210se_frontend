import { assertIsInvitationList } from '../utils/Asserts';
import { Invitation } from '../utils/types';

export async function getInvitations(): Promise<Invitation[]> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/invitation'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await response.json();
    const invitationList = data.data;
    if (invitationList === undefined) throw new Error('Response does not contain invitation list');
    assertIsInvitationList(invitationList);
    return invitationList;
  } catch (e) {
    console.error(e);
    window.alert('Failed to get invitation list');
    return [];
  }
}
