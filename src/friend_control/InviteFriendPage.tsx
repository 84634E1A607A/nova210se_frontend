import { invite } from './invite';
import { Friend, InvitationSourceType } from '../utils/Types';
import { assertIsInvitationSourceType } from '../utils/Asserts';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';

export const InviteFriendPage = forwardRef(({ state, callback }: Props, ref) => {
  useImperativeHandle(ref, () => ({
    submit() {
      mutate({ ...state, comment });
    },
  }));

  const [comment, setComment] = useState('');

  const queryClient = useQueryClient();

  const toast = useRef<Toast | null>(null);

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

      callback(sendInvitationSuccessful, alertMessage);
    },
  });

  assertIsValidState(state);

  return (
    <div className="grow">
      <Toast ref={toast} />
      <label className="block text-sm font-medium text-slate-700" htmlFor="comment">
        Leave your comment here
      </label>
      <textarea
        className="surface-0 mt-1 block w-60 rounded-md border border-slate-300 text-sm placeholder-slate-400 shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
        id="comment"
        onChange={(e) => setComment(e.target.value)}
      />
    </div>
  );
});

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

interface Props {
  state: any;
  callback: any;
}
