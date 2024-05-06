import { getChatInfo } from '../getChatInfo';
import { Toast } from 'primereact/toast';
import { MutableRefObject } from 'react';
import { NavigateFunction } from 'react-router-dom';

/**
 * @description Update the state ({chat: ChatRelatedWithCurrentUser}) that supports `MoreOfChat`.
 */
export const updateChatState = async ({ chatId, toast, navigate, userName }: Params) => {
  const newChat = await getChatInfo({ chatId });
  if (!newChat) {
    navigate(`/${userName}/chats`);
    toast?.current?.show({
      severity: 'warn',
      summary: 'Error in updating chat info',
      detail: 'redirect to chats list page',
      life: 3000,
    });
    return undefined;
  } else {
    console.log('success in updating chat info');
    return newChat;
  }
};

interface Params {
  chatId: number;
  toast?: MutableRefObject<Toast | null>;
  navigate: NavigateFunction;
  userName: string;
}
