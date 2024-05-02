import { Message } from '../../utils/types';
import { createContext, ReactNode, useContext, useState } from 'react';

type RecalledMessageContextType = State & {
  setRecalledMessage: (_message: Message | null) => void;
};

const RecalledMessageContext = createContext<RecalledMessageContextType>({
  recalledMessage: null,
  setRecalledMessage: () => {},
});

export function RecalledMessageProvider({ children }: Props) {
  const [recalledMessage, setRecalledMessage] = useState<Message | null>(null);
  return (
    <RecalledMessageContext.Provider value={{ recalledMessage, setRecalledMessage }}>
      {children}
    </RecalledMessageContext.Provider>
  );
}

export const useRecalledMessageContext = () => useContext(RecalledMessageContext);

interface State {
  recalledMessage: Message | null;
}

interface Props {
  children: ReactNode;
}
