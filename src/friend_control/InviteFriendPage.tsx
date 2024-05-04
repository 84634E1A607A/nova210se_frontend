import { invite } from './invite';
import { Friend, InvitationSourceType } from '../utils/Types';
import { useLocation, useNavigate } from 'react-router-dom';
import { assertIsInvitationSourceType } from '../utils/Asserts';
import { useState } from 'react';
import { useUserName } from '../utils/UrlParamsHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function InviteFriendPage() {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const userName = useUserName();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: invite,
    onSuccess: ({ sendInvitationSuccessful, friend }) => {
      let alertMessage = '';
      if (friend !== undefined) {
        queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
          if (oldFriends === undefined) return [friend];
          else return [...oldFriends, friend];
        });
        alertMessage = `You and ${friend.friend.user_name} are friends now`;
      } else if (!sendInvitationSuccessful) alertMessage = 'Failed to send invitation';
      else alertMessage = 'Invitation sent';

      window.alert(alertMessage);
      navigate(`/${userName}`);
    },
  });

  const location = useLocation();
  const state = location.state;
  assertIsValidState(state);

  return (
    <div className="grow">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent the state from being erased out to null
          mutate({ ...state, comment });
        }}
      >
        <label htmlFor="comment">comment</label>
        <textarea id="comment" onChange={(e) => setComment(e.target.value)} />
        <button type="submit">invite</button>
      </form>
    </div>
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
