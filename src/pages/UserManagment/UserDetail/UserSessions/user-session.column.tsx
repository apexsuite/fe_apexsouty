import dayjs from 'dayjs';
import type { IUserSessions, TokenType } from '@/services/user-managment/types';
import type { ColumnDef } from '@tanstack/react-table';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';
import SessionDetailPopover from './components/SessionDetailPopover';
import { Eye } from 'lucide-react';

interface IGetUserSessionColumnsProps {
  userId: string;
  deleteSession: (params: {
    userId: string;
    tokenType: TokenType;
    tokenId: string;
  }) => void;
}

const COLUMN_CONFIG: ColumnConfig<IUserSessions>[] = [
  {
    accessorKey: 'tokenType',
    header: 'Token Type',
    size: 3,
  },
  {
    accessorKey: 'tokenId',
    header: 'Token ID',
    size: 3,
    clipboard: true,
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
    size: 3,
    cell: row =>
      row.expiresAt ? dayjs(row.expiresAt).format('DD/MM/YYYY HH:mm') : '-',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 1,
  },
];

const getUserSessionColumns = ({
  userId,
  deleteSession,
}: IGetUserSessionColumnsProps): ColumnDef<IUserSessions>[] => {
  const actions: ActionsConfig<IUserSessions> = {
    delete: {
      label: 'Delete Session',
      onConfirm: row => {
        deleteSession({
          userId,
          tokenType: row.tokenType as TokenType,
          tokenId: row.tokenId,
        });
      },
      title: 'Delete Session',
      description:
        'Are you sure you want to delete this session? This action cannot be undone.',
    },
    custom: [
      {
        label: 'View Details',
        icon: <Eye />,
        component: (row: IUserSessions) => (
          <SessionDetailPopover userId={userId} session={row} />
        ),
      },
    ],
  };

  return createColumns<IUserSessions>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getUserSessionColumns;
