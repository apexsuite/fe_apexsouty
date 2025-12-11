import type { IUserRole } from '@/services/user-managment/types';
import type { ColumnDef } from '@tanstack/react-table';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/common/status-badge';
import { formatDate } from '@/lib/utils';

interface IGetUserRoleColumnsProps {
  unassignRole: (roleId: string) => void;
}

const COLUMN_CONFIG: ColumnConfig<IUserRole>[] = [
  {
    accessorKey: 'roleName',
    header: 'Role Name',
    size: 3,
    cell: row => <Badge variant="warning">{row.roleName}</Badge>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 1,
  },
  {
    accessorKey: 'roleValue',
    header: 'Role Value',
    size: 2,
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    size: 2,
    cell: row => <StatusBadge isActive={row.isActive} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Assigned At',
    size: 2,
    cell: row => (row.createdAt ? formatDate(row.createdAt) : '-'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 1,
  },
];

const getUserRoleColumns = ({
  unassignRole,
}: IGetUserRoleColumnsProps): ColumnDef<IUserRole>[] => {
  const actions: ActionsConfig<IUserRole> = {
    delete: {
      label: 'Unassign Role',
      onConfirm: row => {
        unassignRole(row.roleId);
      },
      title: 'Unassign Role',
      description: `Are you sure you want to unassign the role from this user?`,
    },
  };

  return createColumns<IUserRole>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getUserRoleColumns;
