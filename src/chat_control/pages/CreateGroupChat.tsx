import { Suspense, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ChatRelatedWithCurrentUser, LeastFriendInfo } from '../../utils/types';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsGroupsData } from '../../utils/queryRouterLoaderAsserts';
import { assertIsFriendsList } from '../../utils/asserts';
import { parseNameOfFriend } from '../../friend_control/utils/parseNameOfFirend';
import { useUserName } from '../../utils/UrlParamsHooks';
import { createGroupChat } from '../createGroupChat';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
      unread_count: 0,
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
            <div className="card flex content-center">
              <form
                onSubmit={handleSubmit((form) => mutate(form))}
                className="flex flex-col items-center gap-2"
              >
                <Toast ref={toast} />
                <div>
                  <label htmlFor="groupName">Group name</label>
                  <input
                    id="groupName"
                    type="text"
                    {...register('groupName', {
                      required: 'You must enter a group chat name.',
                      pattern: /^[\w@+\-.]+$/,
                      maxLength: 19,
                    })}
                  />
                  {getFormErrorMessage('groupName')}
                </div>
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
                      className="w-full md:w-20rem bg-green-200"
                    />
                  )}
                />
                {getFormErrorMessage('friends')}

                <Button type="submit" label="Submit" className="mt-2" />
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
