// import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { Outlet } from 'react-router-dom';
import { useUserName } from '../utils/UrlParamsHooks';
import { theme } from '../utils/ui/themes';
import { SidebarLink } from './SideBarLink';
import { DisplayCurrentUserInfo } from '../user_control/DisplayCurrentUserInfo';
import { useState } from 'react';

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
              <div className="absolute left-10 bg-white shadow-md p-4 rounded-md h-46 w-72 mt-40 ms-20 box-border border-4 flex items-center justify-center">
                <DisplayCurrentUserInfo isIconOnly={false} />
              </div>
            )}
          </li>
          <SidebarLink
            to={`/${userName}`}
            title="Chat"
            icon={
              <svg
                className="fill-current h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 6.453l9 8.375v9.172h-6v-6h-6v6h-6v-9.172l9-8.375zm12 5.695l-12-11.148-12 11.133 1.361 1.465 10.639-9.868 10.639 9.883 1.361-1.465z" />
              </svg>
            }
          />
          <SidebarLink
            to={`/${userName}/friends`}
            title="Friends"
            icon={
              <svg
                className="fill-current h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 7.001c0 3.865-3.134 7-7 7s-7-3.135-7-7c0-3.867 3.134-7.001 7-7.001s7 3.134 7 7.001zm-1.598 7.18c-1.506 1.137-3.374 1.82-5.402 1.82-2.03 0-3.899-.685-5.407-1.822-4.072 1.793-6.593 7.376-6.593 9.821h24c0-2.423-2.6-8.006-6.598-9.819z" />
              </svg>
            }
          />
          <SidebarLink
            to={`/${userName}/account_management`}
            title="Setting"
            icon={
              <svg
                className="fill-current h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
              </svg>
            }
          />
          <SidebarLink
            to={`/${userName}/search_friend`}
            title="Search Friend"
            icon={
              <svg
                className="h-10 w-10 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path d="M12 10V13" stroke-width="2" stroke-linecap="round"></path>{' '}
                  <path d="M12 16V15.9888" stroke-width="2" stroke-linecap="round"></path>{' '}
                  <path
                    d="M10.2518 5.147L3.6508 17.0287C2.91021 18.3618 3.87415 20 5.39912 20H18.6011C20.126 20 21.09 18.3618 20.3494 17.0287L13.7484 5.147C12.9864 3.77538 11.0138 3.77538 10.2518 5.147Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{' '}
                </g>
              </svg>
            }
          />
          <SidebarLink
            to={`/${userName}/invitation_list`}
            title="Invitation List"
            icon={
              <svg
                className="h-10 w-10 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path d="M12 10V13" stroke-width="2" stroke-linecap="round"></path>{' '}
                  <path d="M12 16V15.9888" stroke-width="2" stroke-linecap="round"></path>{' '}
                  <path
                    d="M10.2518 5.147L3.6508 17.0287C2.91021 18.3618 3.87415 20 5.39912 20H18.6011C20.126 20 21.09 18.3618 20.3494 17.0287L13.7484 5.147C12.9864 3.77538 11.0138 3.77538 10.2518 5.147Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{' '}
                </g>
              </svg>
            }
          />
          <SidebarLink
            to={`/${userName}/create_group_chat`}
            title="Group Chat"
            icon={
              <svg
                className="h-10 w-10 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path d="M12 10V13" stroke-width="2" stroke-linecap="round"></path>{' '}
                  <path d="M12 16V15.9888" stroke-width="2" stroke-linecap="round"></path>{' '}
                  <path
                    d="M10.2518 5.147L3.6508 17.0287C2.91021 18.3618 3.87415 20 5.39912 20H18.6011C20.126 20 21.09 18.3618 20.3494 17.0287L13.7484 5.147C12.9864 3.77538 11.0138 3.77538 10.2518 5.147Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{' '}
                </g>
              </svg>
            }
          />
        </ul>
      </nav>
      <div className="flex grow">
        <Outlet />
      </div>
    </div>
  );
}
