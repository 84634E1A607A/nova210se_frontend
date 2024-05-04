import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { assertIsInvitationsAndApplicationsForChatData } from '../utils/AssertsForRouterLoader';
import { assertIsInvitationList } from '../utils/Asserts';
import { acceptInvitation } from './acceptInvitation';
import { rejectInvitation } from './rejectInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Friend, Invitation } from '../utils/Types';
import { useUserName } from '../utils/UrlParamsHooks';
import { theme } from '../utils/ui/themes';
import { UserDisplayTabInInvitations } from './UserDisplayTabInInvitations';
import { ApplicationsForChat } from '../chat_control/components/ApplicationsForChat';

/**
 * @description Friend applications and applications for entering group chat if the current
 * user is admin or owner.
 */
export function OngoingInvitations() {
  const data = useLoaderData();
  assertIsInvitationsAndApplicationsForChatData(data);

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
    <Suspense fallback={<div>Loading invitaions...</div>}>
      <Await resolve={data.invitations}>
        {(inviations) => {
          assertIsInvitationList(inviations);
          return (
            <div className="flex flex-grow flex-col">
              <strong className="m-2">Applications for friendship</strong>
              <ul>
                {inviations.map((invitation) => (
                  <li key={invitation.id}>
                    <div className="m-1 p-2" style={{ backgroundColor: theme.secondary_container }}>
                      <p>
                        From{' '}
                        {invitation.source === 'search'
                          ? ' search'
                          : ` group with id: ${invitation.source}`}
                      </p>
                      {invitation.comment === '' ? null : (
                        <p>Invitation message: {invitation.comment}</p>
                      )}
                      <UserDisplayTabInInvitations leastUserInfo={invitation.sender} />
                      <div className="flex flex-row place-content-evenly place-items-center">
                        <button
                          type="button"
                          onClick={() => accept(invitation.id)}
                          className="text-green-600"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => reject(invitation.id)}
                          className="text-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <strong className="m-2">Applications for chat</strong>
              <ApplicationsForChat />
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
