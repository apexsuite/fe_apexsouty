import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import type { IVendor } from '@/services/vendor/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { NavigateFunction } from 'react-router-dom';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';
import dayjs from 'dayjs';

interface IGetVendorColumnsProps {
  navigate: NavigateFunction;
  deleteVendor: (id: string) => void;
}

const COLUMN_CONFIG: ColumnConfig<IVendor>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 2,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 2,
  },
  {
    accessorKey: 'fileCount',
    header: 'File Count',
    size: 2,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    size: 2,
    cell: row => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 2,
    cell: row => <StatusBadge status={row.status as StatusVariant} />,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 1,
  },
];

const getVendorColumns = ({
  navigate,
  deleteVendor,
}: IGetVendorColumnsProps): ColumnDef<IVendor>[] => {
  const actions: ActionsConfig<IVendor> = {
    view: {
      label: 'View Vendor',
      onClick: row => navigate(`/vendors/${row.id}`),
    },
    edit: {
      label: 'Edit Vendor',
      onClick: row => navigate(`/vendors/${row.id}/edit`),
    },
    delete: {
      label: 'Delete',
      onConfirm: row => deleteVendor(row.id),
      title: 'Delete Vendor',
      description: 'Are you sure you want to delete this vendor?',
    },
  };

  return createColumns<IVendor>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getVendorColumns;
