import { assertIsInvitationList } from '../utils/asserts';
import { Invitation } from '../utils/types';

export async function getInvitationList(): Promise<Invitation[]> {
  const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/invitation'));
  const data = await response.json();
  const invitationList = data.body;
  assertIsInvitationList(invitationList);
  return invitationList;
}
