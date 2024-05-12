import { ChatRelatedWithCurrentUser } from '../../utils/Types';
import { createContext, useContext, useState } from 'react';
import { ContextProviderChildrenProp } from './RepliedMessageProvider';

/**
 * @description The right side of the chat page can be chat or chat detail. If it's undefined, then no
 * single chat should be displayed.
 */
export type RightSideComponentType = 'chat' | 'more' | undefined;

interface State {
  currentChat: ChatRelatedWithCurrentUser | null;
  rightComponent: RightSideComponentType;
}

type CurrentChatContextType = State & {
  setCurrentChat: (_currentChat: ChatRelatedWithCurrentUser | null) => void;
  setRightComponent: (_rightComponent: RightSideComponentType) => void;
};

const CurrentChatContext = createContext<CurrentChatContextType>({
  currentChat: null,
  setCurrentChat: () => {},
  rightComponent: undefined,
  setRightComponent: () => {},
});

/**
 * @description Provide current chat and the chat page type, whether it is a chat page or a chat detail page.
 */
export function CurrentChatProvider({ children }: ContextProviderChildrenProp) {
  const [currentChat, setCurrentChat] = useState<ChatRelatedWithCurrentUser | null>(null);
  const [rightComponent, setRightComponent] = useState<RightSideComponentType>();
  return (
    <CurrentChatContext.Provider
      value={{ currentChat, setCurrentChat, rightComponent, setRightComponent }}
    >
      {children}
    </CurrentChatContext.Provider>
  );
}

export const useCurrentChatContext = () => useContext(CurrentChatContext);
