import { render, screen } from '@testing-library/react';
import { UserDisplayTab } from './UserDisplayTab';
import { alice, bob, friends } from '../utils/TestsData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';

const mockRouter = createMemoryRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <UserDisplayTab leastUserInfo={alice} friendsList={friends} />,
      },
      {
        path: 'bob',
        element: <UserDisplayTab leastUserInfo={bob} friendsList={friends} />,
      },
    ],
  },
]);

const testQueryClient = new QueryClient();

test('should have "More" and no "invite" if is friend', () => {
  render(
    <QueryClientProvider client={testQueryClient}>
      <RouterProvider router={mockRouter} />
    </QueryClientProvider>,
  );
  const more = screen.getByText('More');
  expect(more).toBeInTheDocument();
  const invite = screen.queryByText('invite');
  expect(invite).not.toBeInTheDocument();
});

// test('should have "invite" and no "more" if is not friend', () => {
//   render(
//     <QueryClientProvider client={testQueryClient}>
//       <RouterProvider router={mockRouter} />
//     </QueryClientProvider>,
//   );
//   const invite = screen.getByText('invite');
//   expect(invite).toBeInTheDocument();
//   const more = screen.queryByText('more');
//   expect(more).not.toBeInTheDocument();
// });
