import { Outlet } from 'react-router-dom';
import { useUserName } from '../utils/UrlParamsHooks';
import { theme } from '../utils/ui/themes';
import { SidebarLink } from './SideBarLink';
import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { useState } from 'react';
import { ReactComponent as HomeIcon } from '../svg/nav-home-icon.svg';
import { ReactComponent as FriendIcon } from '../svg/nav-friend-icon.svg';
import { ReactComponent as SettingIcon } from '../svg/nav-setting-icon.svg';
import { ReactComponent as UpcomingIcon } from '../svg/nav-upcoming-icon.svg';

export function MainPageFramework() {
  const userName = useUserName();
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState(false);

  return (
    <div className="flex flex-row h-screen w-screen">
      <nav
        aria-label="side bar"
        className="flex-none flex flex-col items-center text-center bg-teal-900 text-gray-400 border-r"
        style={{ backgroundColor: theme.background }}
      >
        <ul>
          <li className="flex justify-center items-center">
            <button
              className={`h-20 w-32 px-6 flex justify-center items-center hover:text-white`}
              title={`${userName}`}
              style={{
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onClick={() => {
                setIsInfoBoxVisible(!isInfoBoxVisible);
              }}
            >
              <i className="mx-auto">{<DisplayCurrentUserInfo />}</i>
            </button>
            {isInfoBoxVisible && (
              /** `left-10` means the absolute position of the pop-up user-info window */
              <div className="absolute left-10 bg-white shadow-md p-4 rounded-md h-48 w-72 mt-40 ms-20 box-border border-4 flex items-center justify-center">
                <DisplayCurrentUserInfo isIconOnly={false} />
              </div>
            )}
          </li>
          <SidebarLink
            to={`/${userName}/chats`}
            title="Chat"
            icon={<HomeIcon className="fill-current h-7 w-7" />}
          />
          <SidebarLink
            to={`/${userName}/friends`}
            title="Friends"
            icon={<FriendIcon className="fill-current h-7 w-7" />}
          />
          <SidebarLink
            to={`/${userName}/account_management`}
            title="Setting"
            icon={<SettingIcon className="fill-current h-7 w-7" />}
          />
          <SidebarLink
            to={`/${userName}/search_friend`}
            title="Search Friend"
            icon={<UpcomingIcon className="h-10 w-10 stroke-current" />}
          />
          <SidebarLink
            to={`/${userName}/invitation_list`}
            title="Invitation List"
            icon={<UpcomingIcon className="h-10 w-10 stroke-current" />}
          />
          <SidebarLink
            to={`/${userName}/create_group_chat`}
            title="Group Chat"
            icon={<UpcomingIcon className="h-10 w-10 stroke-current" />}
          />
        </ul>
      </nav>
      <div className="flex grow">
        <Outlet />
      </div>
    </div>
  );
}
