import { Friend, InvitationSourceType } from '../utils/types';

type InvitationParam = { id: number; source: InvitationSourceType; comment?: string };
// backend requires that comment not be undefined or null

export async function invite(
  invitationInfo: InvitationParam,
): Promise<{ sendInvitationSuccessful: boolean; friend: Friend | undefined }> {
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
    if (!response.ok) throw new Error('Failed to send invitation');
    const data = await response.json(); // data is like: {ok: true, data: null}
    const friend = data.data;
    if (friend === null) return { sendInvitationSuccessful: true, friend: undefined };
    return { sendInvitationSuccessful: true, friend };
  } catch (e) {
    console.error(e);
    return { sendInvitationSuccessful: false, friend: undefined };
  }
}
