import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { ReactComponent as MoreDetails } from '../../svg/more-horizontal-square-svgrepo-com.svg';

export function ChatHeader({ chat, setRightComponent }: Props) {
  return (
    <div className="flex h-[10%] flex-row place-content-center items-center justify-between">
      <h1 className="text-center text-2xl">{chat.chatName}</h1>
      <span
        className="ml-2 mt-0.5 flex cursor-pointer items-center justify-center"
        onClick={() => setRightComponent('more')}
      >
        <MoreDetails className="max-h-6 max-w-6" />
      </span>
    </div>
  );
}

interface Props {
  chat: ChatRelatedWithCurrentUser;
  setRightComponent: any;
}
