import { DetailedMessage } from '../../utils/Types';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { unixTimestampToDateString } from '../../utils/time/unixTimestampToDateString';

/**
 * @param detailedMessage The message of concern.
 * @para isRead Whether the friend has read it. For private chat.
 * @para isSelf The same as in `MessageTab`, for group chat.
 */
export function MessageAssociateInfo({ detailedMessage }: Props) {
  return (
    <div className="m-1">
      <Accordion activeIndex={1}>
        <AccordionTab header="replied by">
          <div className="m-1">
            <strong className="inline">{detailedMessage.replied_by.length}</strong>
            <p className="inline"> messages</p>
          </div>
        </AccordionTab>

        <AccordionTab header="send time">
          <div className="m-1">{unixTimestampToDateString(detailedMessage.send_time)}</div>
        </AccordionTab>

        <AccordionTab header="already read">
          <div className="m-1"></div>
        </AccordionTab>
      </Accordion>
    </div>
  );
}

interface Props {
  detailedMessage: DetailedMessage;
  isRead?: boolean;
  isSelf?: boolean;
}
