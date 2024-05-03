import { MessageContent } from './MessageContent';
import { useMessageRefsContext } from '../states/MessageRefsProvider';

/**
 * @description To show the replied message if exists under the message tab.
 * It can be clicked to jump to the replied message as required.
 */
export function RepliedMessageTab({ message, senderName, messageId }: Props) {
  const { refs } = useMessageRefsContext();

  const scrollToMessage = (messageRef: any) => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!message) return null;
  return (
    <div
      onClick={() => {
        const ref = refs.find((r) => r.messageId === messageId);
        if (ref) scrollToMessage(ref.ref);
      }}
      className="flex flex-row ml-7"
    >
      <div className="flex" title={senderName}>
        <p className="truncate w-14 text-gray-400">{`${senderName}`}</p>
        <p className="text-gray-400">:</p>
      </div>
      <div className="flex">
        <MessageContent message={message} isReply={true} />
      </div>
    </div>
  );
}

interface Props {
  message: string | undefined;
  senderName: string | undefined;
  messageId: number | undefined;
}
