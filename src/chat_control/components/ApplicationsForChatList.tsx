import { ApplicationForChat, ChatRelatedWithCurrentUser } from '../../utils/Types';
import {
  respondToApplicationForChat,
  RespondToApplicationParams,
} from '../respondToApplicationForChat';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUserName } from '../../utils/router/RouteParamsHooks';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Avatar } from '../../utils/ui/Avatar';
import { ScrollPanel } from 'primereact/scrollpanel';

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
    <div className="flex grow overflow-clip">
      <ScrollPanel className="grow">
        <ul>
          {applications.map((application) => {
            const chatDesired = chats.find((chat) => {
              return chat.chat_id === application.chat_id;
            });
            return (
              <li key={application.invitation_id}>
                <div className="m-1 flex flex-row rounded-lg bg-blue-50 px-4 py-2">
                  <div className="my-auto flex h-14 w-14">
                    <Avatar url={application.user.avatar_url} />
                  </div>
                  <div className="grow flex-col px-4 text-left">
                    <div className="m-1 max-w-72 truncate">
                      <span className="font-bold">Invited by: </span>
                      <span title={application.invited_by.user_name}>
                        {application.invited_by.user_name}
                      </span>
                    </div>
                    <div className="m-1 max-w-72 truncate">
                      <span className="font-bold">Into Group: </span>
                      <span title={chatDesired!.chat.chat_name}>{chatDesired!.chat.chat_name}</span>
                    </div>
                    <div className="m-1">
                      <span className="font-bold">Username: </span>
                      <span>{application.user.user_name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => approve(application.chat_id, application.user.id)}
                      className="focus:shadow-outline my-1 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(application.chat_id, application.user.id)}
                      className="focus:shadow-outline my-1 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollPanel>
      <Toast ref={toastRef} />
    </div>
  );
}

interface Props {
  applications: ApplicationForChat[];
  chats: ChatRelatedWithCurrentUser[];
}
