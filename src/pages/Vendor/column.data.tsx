import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import type { IVendor } from '@/services/vendor/types';
import type { Row } from '@tanstack/react-table';
import dayjs from 'dayjs';

export default function getVendorColumns() {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'fileCount',
      header: 'File Count',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: Row<IVendor> }) => (
        <StatusBadge status={row.original.status as StatusVariant} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }: { row: Row<IVendor> }) => (
        <span className="text-sm">
          {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
  ];
}
