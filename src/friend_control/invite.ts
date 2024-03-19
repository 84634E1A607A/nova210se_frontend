import { InvitationSourceType } from '../utils/types';

type InvitationParam = { id: number; source: InvitationSourceType; comment?: string };
// backend requires comment can't be undefined or null

export async function invite(invitationInfo: InvitationParam) {
  if (invitationInfo.comment === undefined) invitationInfo.comment = '';
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/invite'), {
      method: 'POST',
      body: JSON.stringify(invitationInfo),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) return true;
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}
