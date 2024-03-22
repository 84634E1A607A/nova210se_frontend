import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { assertIsInvitationsData } from '../utils/queryRouterLoaderAsserts';
import { assertIsInvitationList } from '../utils/asserts';
import { acceptInvitation } from './acceptInvitation';
import { rejectInvitation } from './rejectInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Friend, Invitation } from '../utils/types';
import { useUserName } from '../utils/UrlParamsHooks';

export function OngoingInvitations() {
  const data = useLoaderData();
  assertIsInvitationsData(data);

  const navigate = useNavigate();
  const userName = useUserName();

  const handleAccept = async (invitationId: number) => {
    return await acceptInvitation(invitationId);
  };

  const handleReject = async (invitationId: number) => {
    return await rejectInvitation(invitationId);
  };

  const queryClient = useQueryClient();
  const { mutate: accept, variables: acceptVar } = useMutation({
    mutationFn: handleAccept,
    onSuccess: (friend) => {
      if (friend === undefined) return;
      queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
        if (oldFriends === undefined) return [friend];
        else return [...oldFriends, friend];
      });
      queryClient.setQueryData<Invitation[]>(['invitations'], (oldInvitations) => {
        return oldInvitations?.filter((invitation) => invitation.id !== acceptVar);
      });
      navigate(`/${userName}/invitation_list`); // update loader
    },
  });
  const { mutate: reject, variables: rejectVar } = useMutation({
    mutationFn: handleReject,
    onSuccess: (rejectSuccessful) => {
      if (!rejectSuccessful) return;
      queryClient.setQueryData<Invitation[]>(['invitations'], (oldInvitations) => {
        return oldInvitations?.filter((invitation) => invitation.id !== rejectVar);
      });
      navigate(`/${userName}/invitation_list`);
    },
  });

  return (
    <div>
      <h1>Ongoing Invitations</h1>
      <Suspense fallback={<div>Loading invitaions...</div>}>
        <Await resolve={data.invitaions}>
          {(inviations) => {
            assertIsInvitationList(inviations);
            return (
              <div>
                <ul>
                  {inviations.map((invitation) => (
                    <li key={invitation.id}>
                      <div>
                        <p>
                          Invitation from {invitation.sender.user_name} by means of
                          {invitation.source === 'search'
                            ? ' search'
                            : ` group with id: ${invitation.source}`}
                        </p>
                        <p>Invitation message: {invitation.comment}</p>
                        <button type="button" onClick={() => accept(invitation.id)}>
                          Accept
                        </button>
                        <button type="button" onClick={() => reject(invitation.id)}>
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
