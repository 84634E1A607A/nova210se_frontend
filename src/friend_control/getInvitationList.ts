import { Invitation } from '../utils/types';

export async function getInvitationList(): Promise<Invitation[]> {
  const response = await fetch(process.env.REACT_APP_API_URL!.concat('friend/invitation'));
  const data = await response.json();
  const invitationList = data.body;
  assertIsInvitationList(invitationList);
  return invitationList;
}

function assertIsInvitationList(invitationList: unknown): asserts invitationList is Invitation[] {
  if (!Array.isArray(invitationList)) throw new Error('Not a list');
  for (const invitation of invitationList) {
    if (!('id' in invitation)) throw new Error('Missing id');
    if (!('comment' in invitation)) throw new Error('Missing comment');
    if (!('sender' in invitation)) throw new Error('Missing sender');
    if (!('source' in invitation)) throw new Error('Missing source');
    if (typeof invitation.id !== 'number') throw new Error('id is not a number');
    if (typeof invitation.comment !== 'string') throw new Error('comment is not a string');
    if (typeof invitation.sender !== 'string') throw new Error('sender is not a string');
    if (invitation.source !== 'search' && typeof invitation.source !== 'number')
      throw new Error('source is not valid');
  }
}
