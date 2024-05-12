import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { ReactComponent as MoreDetails } from '../../svg/more-horizontal-square-svgrepo-com.svg';

export function ChatHeader({ chat, setRightComponent }: Props) {
  return (
    <div className="flex flex-row place-content-center">
      <h2>{chat.chatName}</h2>
      <span className="ml-2 mt-0.5 cursor-pointer" onClick={() => setRightComponent('more')}>
        <MoreDetails className="max-h-6 max-w-6" />
      </span>
    </div>
  );
}

interface Props {
  chat: ChatRelatedWithCurrentUser;
  setRightComponent: any;
}
