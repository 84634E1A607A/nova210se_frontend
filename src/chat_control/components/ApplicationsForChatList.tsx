import { ApplicationForChat, ChatRelatedWithCurrentUser } from '../../utils/Types';
import { theme } from '../../utils/ui/themes';
import { UserDisplayTabInInvitations } from '../../friend_control/UserDisplayTabInInvitations';
import {
  RespondToApplicationParams,
  respondToApplicationForChat,
} from '../respondToApplicationForChat';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';

/**
 * @description Ongoing applications list for entering group chats, where the current user is an admin
 * or the owner.
 * @position Inside `OngoingInvitations` as a component.
 */
export function ApplicationsForChatList({ applications, chats }: Props) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const userName = useUserName();
  const thisPageUrl = `/${userName}/invitation_list`;

  const toastRef = useRef<Toast>(null);

  const respond = async ({ action, chatId, userId }: RespondToApplicationParams) => {
    const isSuccessful = await respondToApplicationForChat({ action, chatId, userId });
    if (isSuccessful) {
      queryClient.removeQueries({ queryKey: ['applications_for_chat'] });
      navigate(thisPageUrl);
      toastRef.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: `${action} successful!`,
        life: 2000,
      });
    } else {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `${action} failed!`,
        life: 2000,
      });
    }
  };

  const approve = async (chatId: number, userId: number) => {
    await respond({ action: 'approve', chatId, userId });
  };

  const reject = async (chatId: number, userId: number) => {
    await respond({ action: 'reject', chatId, userId });
  };

  return (
    <div className="m-2">
      <ul>
        {applications.map((application) => {
          const chatDesired = chats.find((chat) => {
            return chat.chat_id === application.chat_id;
          });
          return (
            <li key={application.invitation_id}>
              <div className="m-1 p-2" style={{ backgroundColor: theme.secondary_container }}>
                <div className="m-1 max-w-72 truncate">
                  <p className="inline">Invited by </p>
                  <strong className="inline" title={application.invited_by.user_name}>
                    {application.invited_by.user_name}
                  </strong>
                  <p className="inline"> Into </p>
                  <strong className="inline" title={chatDesired!.chat.chat_name}>
                    {chatDesired!.chat.chat_name}
                  </strong>
                </div>

                <UserDisplayTabInInvitations leastUserInfo={application.user} />
                <div className="flex flex-row place-content-evenly place-items-center">
                  <button
                    type="button"
                    onClick={() => approve(application.chat_id, application.user.id)}
                    className="text-green-600"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => reject(application.chat_id, application.user.id)}
                    className="text-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Toast ref={toastRef} />
    </div>
  );
}

interface Props {
  applications: ApplicationForChat[];
  chats: ChatRelatedWithCurrentUser[];
}
