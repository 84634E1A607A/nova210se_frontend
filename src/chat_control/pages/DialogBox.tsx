import { SingleChatProps } from './ChatHeader';
import { useForm } from 'react-hook-form';
import { ValidationError } from '../../utils/ValidationError';
import { useRepliedMessageContext } from '../states/RepliedMessageProvider';
import { ReactComponent as CancelReply } from '../../svg/cancel-svgrepo-com.svg';
import useWebSocket from 'react-use-websocket';
import { useDialogBoxRefContext } from '../states/DialogBoxRefProvider';
import { useEffect, useRef } from 'react';

export function DialogBox({ chat }: SingleChatProps) {
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<ChatContent>();

  const { repliedMessage, setRepliedMessage } = useRepliedMessageContext();
  const repliedMessageToShow = repliedMessage
    ? `${repliedMessage.sender.user_name}: ${repliedMessage.message}`
    : '';

  const { ref: dialogBoxRefContext } = useDialogBoxRefContext();
  const trueDialogBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dialogBoxRefContext.length === 0) {
      dialogBoxRefContext.push(trueDialogBoxRef);
    }
    return () => {
      dialogBoxRefContext.splice(
        dialogBoxRefContext.findIndex((r) => r === trueDialogBoxRef),
        1,
      );
    };
  }, [trueDialogBoxRef, dialogBoxRefContext]);

  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  return (
    <div className="flex flex-col static bottom-0" ref={trueDialogBoxRef}>
      {/** The replied message, which can be canceled. */}
      <div
        className="flex flex-row pb-2 text-gray-500 place-content-center"
        title={repliedMessageToShow}
      >
        <p className="truncate max-w-[32rem]">{repliedMessageToShow}</p>
        {repliedMessage ? (
          <button
            onClick={() => {
              setRepliedMessage(null);
            }}
          >
            <CancelReply className="max-w-4 max-h-4" />
          </button>
        ) : null}
      </div>

      {/** chat input */}
      <form
        onSubmit={handleSubmit((data) => {
          const sentData = repliedMessage
            ? {
                content: data.content,
                chat_id: chat.chat_id,
                reply_to: repliedMessage.message_id,
              }
            : {
                content: data.content,
                chat_id: chat.chat_id,
              };
          sendJsonMessage({
            action: 'send_message',
            data: sentData,
          });
          reset();
          setRepliedMessage(null);
        })}
        className="flex flex-col max-w-[50rem] min-w-[50rem]"
      >
        <textarea
          id="content"
          {...register('content', {
            required: true,
          })}
          className="h-20"
        />
        {!isSubmitting ? <button type="submit">Send</button> : null}
        <ValidationError fieldError={errors.content} />
      </form>
    </div>
  );
}

interface ChatContent {
  content: string;
}
