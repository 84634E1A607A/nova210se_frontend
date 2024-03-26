import { invite } from './invite';
import { InvitationSourceType } from '../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { assertIsInvitationSourceType } from '../utils/asserts';
import { useState } from 'react';
import { useUserName } from '../utils/UrlParamsHooks';

export function InviteFriendPage() {
  const location = useLocation();
  const state = location.state;
  assertIsValidState(state);

  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const userName = useUserName();

  const onClick = async () => {
    if (!invite({ ...state, comment })) window.alert('Failed to send invitation');
    else window.alert('Invitation sent');
    navigate(`/${userName}`);
  };

  return (
    <form onSubmit={onClick}>
      <label htmlFor="comment">comment</label>
      <textarea id="comment" onChange={(e) => setComment(e.target.value)} />
      <button type="submit">invite</button>
    </form>
  );
}

function assertIsValidState(
  state: unknown,
): asserts state is { source: InvitationSourceType; id: number } {
  if (typeof state !== 'object') throw new Error('state is not an object');
  if (state === null) throw new Error('state is null');
  if (!('source' in state)) throw new Error('state does not contain source');
  assertIsInvitationSourceType(state.source);
  if (!('id' in state)) throw new Error('state does not contain id');
  if (typeof state.id !== 'number') throw new Error('id is not a number');
}
