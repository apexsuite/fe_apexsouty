import { Badge } from '@/components/ui/badge';
import type { IVendor } from '@/services/vendor/types';
import type { Row } from '@tanstack/react-table';
import dayjs from 'dayjs';

const STATUS_MAP = {
  active: 'success',
  inactive: 'destructive',
  pending: 'warning',
};

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
        <Badge
          variant={
            STATUS_MAP[row.original.status as keyof typeof STATUS_MAP] as any
          }
          className="capitalize"
        >
          {row.original.status}
        </Badge>
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
