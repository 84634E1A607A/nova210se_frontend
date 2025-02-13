import { createContext, RefObject, useContext } from 'react';
import { ContextProviderChildrenProp } from './RepliedMessageProvider';

const initialContextValue = { lastMassageRef: [] };

const DialogBoxRefContext = createContext<DialogBoxRefContextType>(initialContextValue);

/**
 * @description Provide the ref of dialog box to scroll to it automatically when reply a message.
 */
export function DialogBoxRefProvider({ children }: ContextProviderChildrenProp) {
  return (
    <DialogBoxRefContext.Provider value={initialContextValue}>
      {children}
    </DialogBoxRefContext.Provider>
  );
}

export const useDialogBoxRefContext = () => useContext(DialogBoxRefContext);

interface DialogBoxRefContextType {
  lastMassageRef: RefObject<HTMLDivElement>[];
}
