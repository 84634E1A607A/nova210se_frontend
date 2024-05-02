import { SingleChatProps } from './ChatHeader';
import { useForm } from 'react-hook-form';
import { ValidationError } from '../../utils/ValidationError';
import { useRecalledMessageContext } from '../states/RecalledMessageProvider';
import { ReactComponent as CancelRecall } from '../../svg/cancel-svgrepo-com.svg';
import useWebSocket from 'react-use-websocket';

export function DialogBox({ chat }: SingleChatProps) {
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<ChatContent>();

  const { recalledMessage, setRecalledMessage } = useRecalledMessageContext();
  const recalledMessageToShow = recalledMessage
    ? `${recalledMessage.sender.user_name}: ${recalledMessage.message}`
    : '';

  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  return (
    <div className="flex flex-col">
      {/** The recalled message, which can be canceled. */}
      <div className="flex flex-row pb-2 text-gray-500" title={recalledMessageToShow}>
        <p className="truncate">{recalledMessageToShow}</p>
        {recalledMessage ? (
          <button
            onClick={() => {
              setRecalledMessage(null);
            }}
          >
            <CancelRecall className="max-w-4 max-h-4" />
          </button>
        ) : null}
      </div>

      {/** chat input */}
      <form
        onSubmit={handleSubmit((data) => {
          const sentData = recalledMessage
            ? {
                content: data.content,
                chat_id: chat.chat_id,
                reply_to: recalledMessage.message_id,
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
        })}
        className="flex flex-col absolute bottom-0 max-w-[50rem] min-w-[50rem]"
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
