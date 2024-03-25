import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { Link, Outlet } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useUserName } from '../utils/UrlParamsHooks';

export function MainPageFramework() {
  const userName = useUserName();

  return (
    <div>
      <Sidebar>
        <Menu>
          <MenuItem component={<DisplayCurrentUserInfo />} />
          <MenuItem component={<Link to={`/${userName}/search_friend`} />}>
            Search new friend
          </MenuItem>
          <MenuItem component={<Link to={`/${userName}/account_management`} />}>Account</MenuItem>
          <MenuItem component={<Link to={`/${userName}/friends`} />}>My friends</MenuItem>
          <MenuItem component={<Link to={`/${userName}/invitation_list`} />}>Invitations</MenuItem>
        </Menu>
        <Menu>
          {/* For chats and group chats */}
          <MenuItem component={<p>for future chats</p>}> First dummy chat</MenuItem>
        </Menu>
      </Sidebar>
      <Outlet />
    </div>
  );
}
