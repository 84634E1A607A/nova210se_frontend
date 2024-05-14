import { useRef, useState } from 'react';
import { assertIsMessage } from '../../utils/Asserts';
import { MessageTab } from '../components/MessageTab';
import {
  ChatRelatedWithCurrentUser,
  DetailedMessage,
  Friend,
  LeastUserInfo,
  Message,
} from '../../utils/Types';
import { parseAnyoneName } from '../../friend_control/utils/parseAnyoneName';
import { ContextMenu } from 'primereact/contextmenu';
import { useRepliedMessageContext } from '../states/RepliedMessageProvider';
import { useDialogBoxRefContext } from '../states/DialogBoxRefProvider';
import { NoticesBar } from '../components/NoticesBar';
import { getIsSelf } from '../utils/getIsSelf';
import { messageTabListItemCssClass } from '../ui/MessageTabListItem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDetailedMessages } from '../getDetailedMessages';
import { useRefetchContext, useSetupRefetch } from '../states/RefetchProvider';
import useWebSocket from 'react-use-websocket';
import { sendDeleteMessageC2SActionWS } from '../../websockets/Actions';
import './css/auto-hidden-scroll.css';

export function Dialogs({ chat, user, friends }: Props) {
  const queryClient = useQueryClient();
  const {
    isLoading,
    data: messages,
    refetch,
  } = useQuery(
    {
      queryKey: ['detailed_messages', String(chat.chat_id)],
      queryFn: () => getDetailedMessages(chat),
    },
    queryClient,
  );

  const { messagesRefetch } = useRefetchContext();
  useSetupRefetch(refetch, messagesRefetch);

  const cm = useRef<ContextMenu | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | undefined>();
  const { setRepliedMessage } = useRepliedMessageContext();
  const { ref: dialogBoxRef } = useDialogBoxRefContext();

  const replyMessageContextMenuItem = {
    label: 'Reply',
    icon: 'pi pi-reply',
    command: () => {
      setRepliedMessage(selectedMessage!);
      dialogBoxRef[0].current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    },
  };

  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  const deleteMessageContextMenuItem = {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      sendJsonMessage({
        action: sendDeleteMessageC2SActionWS,
        data: { message_id: selectedMessage!.message_id, delete: true },
      });
    },
  };

  const contextMenuItems = [replyMessageContextMenuItem, deleteMessageContextMenuItem];

  /**
   * @description When right-click on a message, show the context menu
   */
  const onRightClick = (event: React.MouseEvent, message: DetailedMessage | Message) => {
    if (cm.current) {
      assertIsMessage(message);
      setSelectedMessage(message);
      cm.current.show(event);
    }
  };

  if (isLoading || messages === undefined) return <p>Loading messages...</p>;
  messages.sort((a, b) => a.send_time - b.send_time);

  return (
    <div className="auto-hidden-scroll flex h-[70%] w-auto flex-col">
      <NoticesBar chat={chat} />
      <ul className="m-2 flex w-auto flex-col">
        {messages.map((detailedMessage) => {
          if (detailedMessage.deleted) return null;
          return (
            <li key={detailedMessage.message_id} className={messageTabListItemCssClass}>
              <MessageTab
                detailedMessage={detailedMessage}
                isSelf={getIsSelf(detailedMessage, user)}
                name={parseAnyoneName({
                  unknownUser: detailedMessage.sender,
                  friends,
                })}
                onRightClick={onRightClick}
                chat={chat}
              />
            </li>
          );
        })}
      </ul>
      <ContextMenu
        ref={cm}
        model={contextMenuItems}
        onHide={() => {
          setSelectedMessage(undefined);
        }}
      />
    </div>
  );
}

interface Props {
  chat: ChatRelatedWithCurrentUser;
  user: LeastUserInfo;
  friends: Friend[];
}
