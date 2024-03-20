import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { Link, Outlet, useParams } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { UrlParams } from '../utils/types';

export function MainPageFramework() {
  const params = useParams<UrlParams>();

  return (
    <div>
      <Sidebar>
        <Menu>
          <MenuItem component={<DisplayCurrentUserInfo />} />
          <MenuItem component={<Link to={`/${params.user_name!}/search_friend`} />}>
            Search new friend
          </MenuItem>
          <MenuItem component={<Link to={`/${params.user_name!}/account_management`} />}>
            Account
          </MenuItem>
          <MenuItem component={<Link to={`/${params.user_name!}/friends`} />}>My friends</MenuItem>
          <MenuItem component={<Link to={`/${params.user_name!}/invitation_list`} />}>
            Invitations
          </MenuItem>
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
