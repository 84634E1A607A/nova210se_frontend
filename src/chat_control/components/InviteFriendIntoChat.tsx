import { MutableRefObject } from 'react';
import { Toast } from 'primereact/toast';
import { LeastFriendInfo } from '../../utils/Types';
import { Controller, useForm } from 'react-hook-form';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { UserTabTemplate } from './UserTabTemplate';
import { Button } from 'primereact/button';
import { multiselectElementStyle } from '../../utils/ui/TailwindConsts';
import { inviteToGroupChat } from '../inviteToGroupChat';
import { useCurrentChatContext } from '../states/CurrentChatProvider';

/**
 * @description Mainly a multiselect component that allows users to select friends to invite into a chat.
 */
export function InviteFriendIntoChat({ toast, invitableFriends }: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<InvitedFriendsForm>({
    defaultValues: {
      friends: [],
    },
  });

  const { currentChat } = useCurrentChatContext();

  const onSubmit = async (form: InvitedFriendsForm) => {
    const friends = form.friends;
    reset();
    let hasOneSuccess = false;
    let hasOneFailure = false;
    for (const friend of friends) {
      const response = await inviteToGroupChat({
        chatId: currentChat!.chat_id,
        userId: friend.userId,
      });
      if (response.isSuccessful) {
        hasOneSuccess = true;
      } else {
        hasOneFailure = true;
      }
    }
    if (hasOneSuccess && hasOneFailure) {
      toast.current!.show({ severity: 'warn', summary: 'Some invites failed.' });
    } else if (hasOneSuccess) {
      toast.current!.show({ severity: 'success', summary: 'All invites successful.' });
    } else {
      toast.current!.show({ severity: 'error', summary: 'All invites failed.' });
    }
  };

  const getFormErrorMessage = (name: 'friends') => {
    return errors[name] ? (
      <small className="p-error">{errors[name]!.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="flex flex-col content-center">
      <p className="mb-1 block font-bold">Invite someone into chat.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
        <Controller
          name="friends"
          control={control}
          rules={{ required: 'At least one friend is required.' }}
          render={({ field }) => (
            <MultiSelect
              id={field.name}
              name="friends"
              value={field.value}
              options={invitableFriends}
              onChange={(e: MultiSelectChangeEvent) => field.onChange(e.value)}
              optionLabel="displayName"
              placeholder="Select Friends"
              maxSelectedLabels={4}
              className={multiselectElementStyle}
              display="chip"
              itemTemplate={UserTabTemplate}
            />
          )}
        />
        {getFormErrorMessage('friends')}
        <Button type="submit" label="Submit" />
      </form>
    </div>
  );
}

interface Props {
  toast: MutableRefObject<Toast | null>;
  invitableFriends: LeastFriendInfo[];
}

interface InvitedFriendsForm {
  friends: LeastFriendInfo[];
}
