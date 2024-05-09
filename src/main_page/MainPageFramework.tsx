import { Outlet } from 'react-router-dom';
import { useUserName } from '../utils/UrlParamsHooks';
import { theme } from '../utils/ui/themes';
import { SidebarLink } from './SideBarLink';
import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { ReactComponent as HomeIcon } from '../svg/nav-home-icon.svg';
import { ReactComponent as FriendIcon } from '../svg/nav-friend-icon.svg';
import { ReactComponent as SettingIcon } from '../svg/nav-setting-icon.svg';
import { ReactComponent as UpcomingIcon } from '../svg/nav-upcoming-icon.svg';

export function MainPageFramework() {
  const userName = useUserName();

  const icon_class = 'h-10 w-10 fill-current m-auto';

  return (
    <div className="flex h-screen w-screen min-w-[75rem] flex-row flex-wrap overflow-x-hidden">
      <nav
        aria-label="side bar"
        className="flex flex-none flex-col items-center border-r bg-teal-900 text-center text-gray-400"
        style={{ backgroundColor: theme.background }}
      >
        <ul>
          <li className="flex items-center justify-center">
            <button
              className={`flex h-20 w-20 items-center justify-center px-6 hover:text-white`}
              title={`${userName}`}
              style={{
                transition: 'background-color 0.3s, color 0.3s',
              }}
            >
              <i className="mx-auto">{<DisplayCurrentUserInfo />}</i>
            </button>
          </li>

          <SidebarLink
            to={`/${userName}/chats`}
            title="Chat"
            icon={<HomeIcon className={icon_class} />}
          />
          <SidebarLink
            to={`/${userName}/friends`}
            title="Friends"
            icon={<FriendIcon className={icon_class} />}
          />
          <SidebarLink
            to={`/${userName}/account_management`}
            title="Setting"
            icon={<SettingIcon className={icon_class} />}
          />
          <SidebarLink
            to={`/${userName}/search_friend`}
            title="Search Friend"
            icon={<UpcomingIcon className={icon_class} />}
          />
          <SidebarLink
            to={`/${userName}/invitation_list`}
            title="Invitation List"
            icon={<UpcomingIcon className={icon_class} />}
          />
          <SidebarLink
            to={`/${userName}/create_group_chat`}
            title="Group Chat"
            icon={<UpcomingIcon className={icon_class} />}
          />
        </ul>
      </nav>
      <div className="flex grow">
        <Outlet />
      </div>
    </div>
  );
}
