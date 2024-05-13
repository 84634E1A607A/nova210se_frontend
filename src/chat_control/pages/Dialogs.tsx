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
import { messageTabListItemCssClass } from '../components/ui/MessageTabListItem';
import { useQuery } from '@tanstack/react-query';
import { getDetailedMessages } from '../getDetailedMessages';
import { useRefetchContext, useSetupRefetch } from '../states/RefetchProvider';

export function Dialogs({ chat, user, friends }: Props) {
  const {
    isLoading,
    data: messages,
    refetch,
  } = useQuery({
    queryKey: ['detailed_messages', chat.chat_id],
    queryFn: () => getDetailedMessages(chat),
  });

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

  const contextMenuItems = [replyMessageContextMenuItem];

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
    <div className="flex flex-col overflow-auto">
      <NoticesBar chat={chat} />
      <ul className="m-2 flex flex-col">
        {messages.map((detailedMessage) => {
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
