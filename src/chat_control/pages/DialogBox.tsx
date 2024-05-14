import { useForm } from 'react-hook-form';
import { ValidationError } from '../../utils/ValidationError';
import { useRepliedMessageContext } from '../states/RepliedMessageProvider';
import { ReactComponent as CancelReply } from '../../svg/cancel-svgrepo-com.svg';
import useWebSocket from 'react-use-websocket';
import { useDialogBoxRefContext } from '../states/DialogBoxRefProvider';
import { sendMessageC2SActionWS } from '../../websockets/Actions';
import { ChatRelatedWithCurrentUser } from '../../utils/Types';

export function DialogBox({ chat }: Props) {
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

  const { lastMassageRef: dialogBoxRefContext } = useDialogBoxRefContext();

  const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL!, {
    share: true,
  });

  return (
    <div className="static bottom-0 flex h-[20%] flex-col">
      {/** The replied message, which can be canceled. */}
      <div
        className="flex flex-row place-content-center pb-2 text-gray-500"
        title={repliedMessageToShow}
      >
        <p className="max-w-[32rem] truncate">{repliedMessageToShow}</p>
        {repliedMessage ? (
          <button
            onClick={() => {
              setRepliedMessage(null);
            }}
          >
            <CancelReply className="max-h-4 max-w-4" />
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
            action: sendMessageC2SActionWS,
            data: sentData,
          });
          reset();
          setRepliedMessage(null);
          dialogBoxRefContext[0].current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        })}
        className="flex max-h-[100%] min-h-[100%] min-w-[60rem] max-w-[60rem] flex-col"
      >
        <textarea
          id="content"
          {...register('content', {
            required: true,
          })}
          className="max-h-[60%] min-h-[60%] resize-none rounded-md border border-slate-300 px-3 py-2 text-sm
                   placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none
                     focus:ring-1 focus:ring-sky-500 disabled:border-slate-200 disabled:bg-slate-50 
                   disabled:text-slate-500 disabled:shadow-none"
        />
        {!isSubmitting ? (
          <button
            type="submit"
            className="mb-2 mt-2 rounded bg-teal-500 px-4 py-2 font-bold text-white hover:bg-teal-300 
                     focus:border-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            Send
          </button>
        ) : null}
        <ValidationError fieldError={errors.content} />
      </form>
    </div>
  );
}

interface ChatContent {
  content: string;
}

interface Props {
  chat: ChatRelatedWithCurrentUser;
}
