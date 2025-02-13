import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserName } from '../utils/router/RouteParamsHooks';
import { deleteFriend } from './deleteFriend';
import { useNavigate } from 'react-router-dom';

type Props = { friendUserId: number };

export function DeleteFriendButton({ friendUserId }: Props) {
  const navigate = useNavigate();

  const userName = useUserName();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => await deleteFriend(friendUserId),
    onSuccess: (deleteSuccessful) => {
      if (deleteSuccessful) {
        queryClient.removeQueries({ queryKey: ['friends'] });
        queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
        navigate(`/${userName}/friends`);
      }
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutate()}
      className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white 
    hover:bg-red-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
    >
      Delete Friend
    </button>
  );
}
