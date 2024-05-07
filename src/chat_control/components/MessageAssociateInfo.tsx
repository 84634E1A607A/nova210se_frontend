import { ChatRelatedWithCurrentUser, DetailedMessage } from '../../utils/Types';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import { Button } from 'primereact/button';
import { unixTimestampToExactTimeString } from '../../utils/time/unixTimestampToExactTimeString';

/**
 * @param detailedMessage The message of concern.
 * @param chat The chat of the message.
 */
export function MessageAssociateInfo({ detailedMessage, chat }: Props) {
  const op = useRef<OverlayPanel | null>(null);
  const isPrivateChat = chat?.chat.chat_name === '';

  return (
    <div className="m-1 flex flex-row">
      <div className="flex flex-col text-xs">
        <div>
          <p className="inline">Reply: </p>
          <strong className="inline">{detailedMessage.replied_by.length}</strong>
        </div>

        <div className="mt-1" title={'send time'}>
          {unixTimestampToExactTimeString(detailedMessage.send_time)}
        </div>
      </div>

      <Button
        type="button"
        icon="pi pi-list-check"
        className="ml-5 h-4 w-3"
        unstyled={true}
        onClick={(e) => op.current?.toggle(e)}
      ></Button>
      <OverlayPanel ref={op}>
        {isPrivateChat ? (
          <strong>{detailedMessage.read_users.length === 2 ? 'Read' : 'Unread'}</strong>
        ) : (
          <ul>
            {detailedMessage.read_users.map((user) => {
              return (
                <li key={user.id} className="m-3">
                  {user.user_name}
                </li>
              );
            })}
          </ul>
        )}
      </OverlayPanel>
    </div>
  );
}

interface Props {
  detailedMessage: DetailedMessage;
  chat?: ChatRelatedWithCurrentUser;
}
