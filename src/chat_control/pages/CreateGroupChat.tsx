import { Suspense, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ChatRelatedWithCurrentUser, LeastFriendInfo } from '../../utils/Types';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsGroupsData } from '../../utils/AssertsForRouterLoader';
import { assertIsFriendsList } from '../../utils/Asserts';
import { parseNameOfFriend } from '../../friend_control/utils/parseNameOfFirend';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { createGroupChat } from '../createGroupChat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserTabTemplate } from '../components/UserTabTemplate';
import { multiselectElementStyle } from '../../utils/ui/TailwindConsts';

export function CreateGroupChat() {
  const toast = useRef<Toast | null>(null);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<CreatingGroupInfo>({
    defaultValues: {
      groupName: '',
      friends: [],
    },
  });

  const loaderData = useLoaderData();
  assertIsFriendsGroupsData(loaderData);

  const userName = useUserName();

  const mutateAgent = async (_groupInfo: CreatingGroupInfo) => {
    const groupName = getValues('groupName');
    const friends = getValues('friends');

    const createdGroupChat = await createGroupChat({
      chatName: groupName,
      chatMembers: friends.map((friend) => friend.userId),
    });

    if (!createdGroupChat) {
      toast.current!.show({ severity: 'error', summary: `Group chat creation failure` });
      return;
    }

    let detail = new Array<string>();
    detail.push(userName + ', ');
    detail.push(
      ...friends.map((friend, i) => friend.displayName + (i === friends.length - 1 ? '' : ', ')),
    );

    toast.current!.show({ severity: 'success', summary: `${groupName} created`, detail });
    reset();
    return {
      chat: createdGroupChat,
      nickname: '',
      unread_count: 1,
    } as ChatRelatedWithCurrentUser;
  };

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: mutateAgent,
    onSuccess: (createdGroupChat: ChatRelatedWithCurrentUser | undefined) => {
      if (createdGroupChat !== undefined)
        queryClient.setQueryData<ChatRelatedWithCurrentUser[]>(
          ['chats_related_with_current_user'],
          (oldChats) => {
            return [...oldChats!, createdGroupChat];
          },
        );
    },
  });

  const getFormErrorMessage = (name: 'friends' | 'groupName') => {
    return errors[name] ? (
      <small className="p-error">{errors[name]!.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <Suspense>
      <Await resolve={loaderData.friends}>
        {(friends) => {
          assertIsFriendsList(friends);
          const leastFriendsInfo: LeastFriendInfo[] = friends.map((friend) => {
            return {
              displayName: parseNameOfFriend(friend),
              userId: friend.friend.id,
              avatarUrl: friend.friend.avatar_url,
            };
          });
          return (
            <div className="surface-0 m-auto box-border inline-block rounded-lg px-6 py-4 shadow-md">
              <form
                onSubmit={handleSubmit((form) => mutate(form))}
                className="flex flex-col items-center gap-2"
              >
                <Toast ref={toast} />

                <label className="mb-4 block text-xl font-medium text-slate-700">
                  Create new group
                </label>
                <input
                  id="groupName"
                  className="borderborder-slate-300 shadow-smfocus:border-sky-500 focus:ring-sky-500disabled:border-slate-200 surface-0 w-full rounded-md px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-1"
                  type="text"
                  placeholder="Enter group name here"
                  {...register('groupName', {
                    required: 'You must enter a group chat name.',
                    pattern: /^[\w@+\-.]+$/,
                    maxLength: 19,
                  })}
                />
                {getFormErrorMessage('groupName')}

                {/** Without `optionLabel`, when you click one item, there will be runtime error*/}
                <Controller
                  name="friends"
                  control={control}
                  rules={{ required: 'At least one friend is required.' }}
                  render={({ field }) => (
                    <MultiSelect
                      id={field.name}
                      name="friends"
                      value={field.value}
                      options={leastFriendsInfo}
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
        }}
      </Await>
    </Suspense>
  );
}

interface CreatingGroupInfo {
  groupName: string;
  friends: LeastFriendInfo[];
}
