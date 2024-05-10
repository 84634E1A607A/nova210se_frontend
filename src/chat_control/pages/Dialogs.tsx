import { SingleChatProps } from './ChatHeader';
import { Await, Navigate, useLoaderData, useLocation } from 'react-router-dom';
import { assertIsUserAndFriendsAndDetailedMessagesData } from '../../utils/AssertsForRouterLoader';
import { Suspense, useRef, useState } from 'react';
import {
  assertIsDetailedMessages,
  assertIsFriendsList,
  assertIsLeastUserInfo,
  assertIsMessage,
} from '../../utils/Asserts';
import { MessageTab } from '../components/MessageTab';
import { DetailedMessage, Message } from '../../utils/Types';
import { parseAnyoneName } from '../../friend_control/utils/parseAnyoneName';
import { ContextMenu } from 'primereact/contextmenu';
import { useRepliedMessageContext } from '../states/RepliedMessageProvider';
import { useDialogBoxRefContext } from '../states/DialogBoxRefProvider';
import { NoticesBar } from '../components/NoticesBar';
import { getIsSelf } from '../utils/getIsSelf';
import { messageTabListItemCssClass } from '../components/ui/MessageTabListItem';

export function Dialogs({ chat }: SingleChatProps) {
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

  const location = useLocation();
  const thisUrl = location.pathname;

  const userAndFriendsAndDetailedMessagesData = useLoaderData();
  assertIsUserAndFriendsAndDetailedMessagesData(userAndFriendsAndDetailedMessagesData);

  return (
    <Suspense fallback={<div>Loading messages</div>}>
      <Await
        resolve={userAndFriendsAndDetailedMessagesData.detailedMessages}
        errorElement={<Navigate to={thisUrl} replace={true} />}
      >
        {(detailedMessages) => {
          return (
            <Await
              resolve={userAndFriendsAndDetailedMessagesData.user}
              errorElement={<Navigate to={thisUrl} replace={true} />}
            >
              {(currentUser) => {
                return (
                  <Await
                    resolve={userAndFriendsAndDetailedMessagesData.friends}
                    errorElement={<Navigate to={thisUrl} replace={true} />}
                  >
                    {(friends) => {
                      assertIsDetailedMessages(detailedMessages);
                      assertIsLeastUserInfo(currentUser);
                      assertIsFriendsList(friends);
                      detailedMessages.sort((a, b) => a.send_time - b.send_time);
                      return (
                        <div className="flex flex-col overflow-auto">
                          <NoticesBar chat={chat} />
                          <ul className="m-2 flex flex-col">
                            {detailedMessages.map((detailedMessage) => {
                              return (
                                <li
                                  key={detailedMessage.message_id}
                                  className={messageTabListItemCssClass}
                                >
                                  <MessageTab
                                    detailedMessage={detailedMessage}
                                    isSelf={getIsSelf(detailedMessage, currentUser)}
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
                    }}
                  </Await>
                );
              }}
            </Await>
          );
        }}
      </Await>
    </Suspense>
  );
}
