import { Message } from '../../utils/types';
import { createContext, ReactNode, useContext, useState } from 'react';

type RepliedMessageContextType = State & {
  setRepliedMessage: (_message: Message | null) => void;
};

const RepliedMessageContext = createContext<RepliedMessageContextType>({
  repliedMessage: null,
  setRepliedMessage: () => {},
});

/**
 * @description Provide the one or none replied message.
 */
export function RepliedMessageProvider({ children }: ContextProviderChildrenProp) {
  const [repliedMessage, setRepliedMessage] = useState<Message | null>(null);
  return (
    <RepliedMessageContext.Provider
      value={{ repliedMessage: repliedMessage, setRepliedMessage: setRepliedMessage }}
    >
      {children}
    </RepliedMessageContext.Provider>
  );
}

export const useRepliedMessageContext = () => useContext(RepliedMessageContext);

interface State {
  repliedMessage: Message | null;
}

export interface ContextProviderChildrenProp {
  children: ReactNode;
}
