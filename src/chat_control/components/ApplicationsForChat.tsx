import { ApplicationForChat } from '../../utils/Types';

/**
 * @description Ongoing applications list for entering group chat.
 * Inside `OngoingInvitations` as a component.
 */
export function ApplicationsForChat({ applications }: Props) {
  return (
    <div className="m-2">
      <ul>
        {applications.map((application) => (
          <li key={application.invitation_id}>
            <div>one application</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
interface Props {
  applications: ApplicationForChat[];
}
