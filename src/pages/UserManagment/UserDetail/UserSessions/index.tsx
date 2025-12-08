import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import CustomDataTable from '@/components/CustomDataTable';
import { getUserSessions, deleteUserSession } from '@/services/user-managment';
import { TAGS } from '@/utils/constants/tags';
import type { TokenType } from '@/services/user-managment/types';
import { toastManager } from '@/components/ui/toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import Empty from '@/components/common/empty';
import { Clock } from 'lucide-react';
import getUserSessionColumns from './user-session.column';

export default function UserSessions() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: [TAGS.USER, id, 'sessions'],
    queryFn: () => getUserSessions(id!),
    enabled: !!id,
  });

  const { mutate: deleteSessionMutation } = useMutation({
    mutationFn: ({
      userId,
      tokenType,
      tokenId,
    }: {
      userId: string;
      tokenType: TokenType;
      tokenId: string;
    }) =>
      deleteUserSession(userId, {
        user_id: userId,
        token_type: tokenType,
        token_id: tokenId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.USER, id, 'sessions'],
      });
      toastManager.add({
        title: 'Session deleted successfully',
        type: 'success',
      });
    },
    onError: (error: Error) => {
      toastManager.add({
        title: error.message ?? 'Failed to delete session',
        type: 'error',
      });
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Empty
        title="No sessions found"
        description="This user has no active sessions"
        icon={<Clock />}
      />
    );
  }

  const columns = getUserSessionColumns({
    userId: id!,
    deleteSession: ({
      userId,
      tokenType,
      tokenId,
    }: {
      userId: string;
      tokenType: TokenType;
      tokenId: string;
    }) => {
      deleteSessionMutation({ userId, tokenType, tokenId });
    },
  });

  return (
    <div className="space-y-4">
      <CustomDataTable
        columns={columns}
        data={sessions}
        isLoading={isLoading}
      />
    </div>
  );
}
