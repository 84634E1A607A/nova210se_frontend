import { MessageContent } from './MessageContent';
import { Avatar } from '../../utils/ui/Avatar';
import { DetailedMessage } from '../../utils/types';
import { systemUserName } from '../../utils/ConstValues';
import { RepliedMessageTab } from './RepliedMessageTab';
import { useMessageRefsContext } from '../states/MessageRefsProvider';
import { useEffect, useRef } from 'react';
import { parseSystemMessage } from '../utils/parseSystemMessage';
import { basicTextTailwind } from '../../utils/ui/TailwindConsts';

/**
 * @description The whole message tab, including the avatar of the sender, the message content,
 * the replied message, if any, etc.
 * @param detailedMessage The detailed message.
 * @param isSelf Whether the sender is the current user.
 * @param name The name of the sender to directly display.
 * @param onRightClick For context menu.
 */
export function MessageTab({ detailedMessage, isSelf, name, onRightClick }: Props) {
  const { refs } = useMessageRefsContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateRefs = () => {
      refs.push({ messageId: detailedMessage.message_id, ref: ref });
    };
    if (!refs.find((r) => r.messageId === detailedMessage.message_id)) updateRefs();
    return () => {
      refs.splice(
        refs.findIndex((r) => r.messageId === detailedMessage.message_id),
        1,
      );
    };
  }, [detailedMessage, ref, refs]);

  const isSystemInfo = detailedMessage.sender.user_name === systemUserName;
  if (isSystemInfo) {
    const messagesList = parseSystemMessage(detailedMessage.message);
    let id = 0;
    const inlineStyle = 'text-gray-500 inline';
    const messageComponents = messagesList.map((pair) => {
      id++;
      if (pair.shouldEmphasize) {
        return (
          <strong className={inlineStyle} id={`${id}`}>
            {pair.wordMessage}
          </strong>
        );
      } else {
        return (
          <p className={inlineStyle} id={`${id}`}>
            {pair.wordMessage}
          </p>
        );
      }
    });
    return <p className={`m-2 ${basicTextTailwind} max-w-[38rem]`}>{messageComponents}</p>;
  }

  return (
    <div className="flex flex-col h-fit w-fit" ref={ref}>
      <div className="flex flex-row">
        <div className="flex flex-col w-20 h-9 left-0 ml-2 mt-2">
          <div className="w-4 h-5">
            <Avatar
              url={detailedMessage.sender.avatar_url}
              enablePopup={true}
              detailedInfo={detailedMessage.sender}
            />
          </div>
          <p className="truncate text-gray-400 mt-0.5 w-5 text-left text-xs" title={name}>
            {name}
          </p>
        </div>

        <div onContextMenu={(event) => onRightClick(event, detailedMessage)} className="flex my-2">
          <MessageContent message={detailedMessage.message} isSelf={isSelf} />
        </div>
      </div>

      <RepliedMessageTab
        message={detailedMessage.reply_to?.message}
        senderName={detailedMessage.reply_to?.sender.user_name}
        messageId={detailedMessage.reply_to?.message_id}
      />
    </div>
  );
}

interface Props {
  detailedMessage: DetailedMessage;
  isSelf: boolean;
  name: string;
  onRightClick: (_event: React.MouseEvent, _message: DetailedMessage) => void;
}
