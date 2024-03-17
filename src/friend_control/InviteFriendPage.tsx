import { useCookies } from 'react-cookie';
import { invite } from './invite';
import { InvitationSourceType } from '../utils/types';
import { useLocation } from 'react-router-dom';
import { assertIsInvitationSourceType } from '../utils/asserts';
import { useState } from 'react';

export function InviteFriendPage() {
  const [cookie] = useCookies(['csrftoken']);

  const location = useLocation();
  const state = location.state;
  assertIsValidState(state);

  const [comment, setComment] = useState('');

  const onClick = async () => {
    invite({ ...state, comment }, cookie.csrftoken);
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
