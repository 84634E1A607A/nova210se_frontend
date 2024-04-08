// import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { Link } from 'react-router-dom';
import { useUserName } from '../utils/UrlParamsHooks';
import { theme } from '../utils/ui/themes';

export function MainPageFramework() {
  const userName = useUserName();

  return (
    <div className="flex flex-row h-screen w-screen">
      <Sidebar className="text-purple-500 mr-1" style={{ background: theme.primary_container }}>
        <Menu>
          <MenuItem className="mb-3" component={<DisplayCurrentUserInfo />} />
          <MenuItem component={<Link to={`/${userName}/account_management`} />}>Account</MenuItem>
          <MenuItem component={<Link to={`/${userName}/search_friend`} />}>
            Search new friend
          </MenuItem>
          <MenuItem component={<Link to={`/${userName}/friends`} />}>My friends</MenuItem>
          <MenuItem component={<Link to={`/${userName}/invitation_list`} />}>Invitations</MenuItem>
        </Menu>
        <Menu>
          {/* For chats and group chats */}
          <MenuItem component={<Link to={`/${userName}/create_group_chat`} />}>
            Create chat
          </MenuItem>
          <MenuItem component={<p>for future chats</p>}> First dummy chat</MenuItem>
        </Menu>
      </Sidebar>
      <div className="flex grow">
        <Outlet />
      </div>
      <nav
        aria-label="side bar"
        className="flex-none flex flex-col items-center text-center bg-teal-900 text-gray-400 border-r"
        // style={{ backgroundColor: theme.background }}
      >
        <div className="h-16 flex items-center w-full">
          <img
            className="h-6 w-6 mx-auto"
            src="https://raw.githubusercontent.com/bluebrown/tailwind-zendesk-clone/master/public/assets/leaves.png"
            alt="FK U"
          />
        </div>
        <ul>
          <li>
            <Link
              to={`/${userName}`}
              title="Home"
              className="h-16 px-6 flex items-center text-white bg-teal-700 w-full"
            >
              <i className="mx-auto">
                <svg
                  className="fill-current h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 6.453l9 8.375v9.172h-6v-6h-6v6h-6v-9.172l9-8.375zm12 5.695l-12-11.148-12 11.133 1.361 1.465 10.639-9.868 10.639 9.883 1.361-1.465z" />
                </svg>
              </i>
            </Link>
          </li>
          <li>
            <Link
              to={`/${userName}/friends`}
              title="Customer Lists"
              className="h-16 px-6 flex items-center hover:text-white w-full"
            >
              <i className="mx-auto">
                <svg
                  className="fill-current h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z" />
                </svg>
              </i>
            </Link>
          </li>
          <li>
            <Link
              to={`/${userName}/account_management`}
              title="Admin"
              className="h-16 px-6 flex items-center hover:text-white w-full"
            >
              <i className="mx-auto">
                <svg
                  className="fill-current h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                </svg>
              </i>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
