import StatusBadge from '@/components/common/status-badge';
import type { IRole } from '@/services/roles/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { NavigateFunction } from 'react-router-dom';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';

interface IGetRolesColumnsProps {
  navigate: NavigateFunction;
  deleteRole: (id: string) => void;
  changeRoleStatus: (id: string) => void;
}

const COLUMN_CONFIG: ColumnConfig<IRole>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 1,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 2,
    tooltip: true,
  },
  {
    accessorKey: 'roleValue',
    header: 'Value',
    size: 1,
  },
  {
    accessorKey: 'isDefault',
    header: 'Is Default',
    size: 1,
    cell: row => <StatusBadge status={row.isDefault ? 'yes' : 'no'} />,
  },
  {
    accessorKey: 'permissionCount',
    header: 'Permissions',
    size: 1,
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

const getRolesColumns = ({
  navigate,
  deleteRole,
  changeRoleStatus,
}: IGetRolesColumnsProps): ColumnDef<IRole>[] => {
  const actions: ActionsConfig<IRole> = {
    view: {
      label: 'View Role',
      onClick: row => navigate(`/roles/${row.id}`),
    },
    toggle: {
      label: 'Change Role Status',
      onClick: row => changeRoleStatus(row.id),
    },
    edit: {
      label: 'Edit Role',
      onClick: row => navigate(`/roles/${row.id}/edit`),
    },
    delete: {
      label: 'Delete',
      onConfirm: row => deleteRole(row.id),
      title: 'Delete Role',
      description: 'Are you sure you want to delete this role?',
    },
  };

  return createColumns<IRole>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getRolesColumns;
