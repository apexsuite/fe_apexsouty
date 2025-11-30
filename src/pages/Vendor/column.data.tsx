import DeleteButton from '@/components/common/buttons/delete';
import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';
import CustomButton from '@/components/CustomButton';
import { ButtonGroup } from '@/components/ui/button-group';
import { Group, GroupSeparator } from '@/components/ui/group';
import type { IVendor } from '@/services/vendor/types';
import type { Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IGetVendorColumnsProps {
  deleteVendor: (id: string) => void;
}

export default function getVendorColumns({
  deleteVendor,
}: IGetVendorColumnsProps) {
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
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }: { row: Row<IVendor> }) => (
        <span className="text-sm">
          {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: Row<IVendor> }) => (
        <StatusBadge status={row.original.status as StatusVariant} />
      ),
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }: { row: Row<IVendor> }) => (
        <Group>
          <CustomButton
            variant="outline"
            tooltip="View Vendor"
            icon={<Eye />}
            size="icon"
            render={<Link to={`/vendors/${row.original.id}`} />}
          />
          <GroupSeparator />
          <CustomButton
            variant="outline"
            tooltip="Edit Vendor"
            icon={<Edit />}
            size="icon"
            render={<Link to={`/vendors/${row.original.id}/edit`} />}
          />
          <GroupSeparator />
          <DeleteButton
            title="Delete Vendor"
            description="Are you sure you want to delete this vendor?"
            onConfirm={() => deleteVendor(row.original.id)}
          />
        </Group>
      ),
    },
  ];
}
