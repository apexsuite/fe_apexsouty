import StatusBadge from '@/components/common/status-badge';
import type {
  IChangeUserStatusRequest,
  IUsers,
} from '@/services/user-managment/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { NavigateFunction } from 'react-router-dom';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';
import { Badge } from '@/components/ui/badge';
import { KeySquare } from 'lucide-react';

interface IGetUsersColumnsProps {
  navigate: NavigateFunction;
  changeUserStatus: (request: IChangeUserStatusRequest) => void;
  onChangePassword: (user: { id: string; fullName: string }) => void;
}

const COLUMN_CONFIG: ColumnConfig<IUsers>[] = [
  {
    accessorKey: 'firstname',
    header: 'Full Name',
    size: 2,
    cell: row => `${row.firstname} ${row.lastname}`,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 2,
    clipboard: true,
  },
  {
    accessorKey: 'userType',
    header: 'User Type',
    size: 1,
    cell: row => (
      <Badge variant="info" className="capitalize">
        {row.userType.replace('_', ' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    size: 2,
    cell: row => (
      <>
        {row.roles && row.roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.roles.map(role => (
              <Badge variant="warning" key={role.id}>
                {role.roleName}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </>
    ),
  },
  {
    accessorKey: 'hasSubscription',
    header: 'Has Subscription',
    size: 1,
    cell: row => <StatusBadge status={row.hasSubscription ? 'yes' : 'no'} />,
  },
  {
    accessorKey: 'subscriptionStatus',
    header: 'Subscription',
    size: 1,
    cell: row => <StatusBadge isActive={row.subscriptionStatus === 'active'} />,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    size: 1,
    cell: row => <StatusBadge isActive={row.isActive} />,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 1,
  },
];

const getUsersColumns = ({
  navigate,
  changeUserStatus,
  onChangePassword,
}: IGetUsersColumnsProps): ColumnDef<IUsers>[] => {
  const actions: ActionsConfig<IUsers> = {
    view: {
      label: 'View User',
      onClick: row => navigate(`/user-management/${row.id}`),
    },
    toggle: {
      label: 'Change User Status',
      onClick: row => changeUserStatus({ id: row.id, isActive: !row.isActive }),
    },
    custom: [
      {
        label: 'Change Password',
        icon: <KeySquare />,
        onClick: row =>
          onChangePassword({
            id: row.id,
            fullName: `${row.firstname} ${row.lastname}`,
          }),
      },
    ],
  };

  return createColumns<IUsers>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getUsersColumns;
