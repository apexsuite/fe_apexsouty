import StatusBadge from '@/components/common/status-badge';
import DateTimeDisplay from '@/components/common/date-time-display';
import CustomButton from '@/components/CustomButton';
import { ButtonGroup } from '@/components/ui/button-group';
import { IRegion } from '@/services/region/types';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';

interface IRegionColumnsProps {
  navigate: NavigateFunction;
  deleteRegion: (id: string) => void;
  changeRegionStatus: (id: string) => void;
}

const getRegionColumns = ({
  navigate,
  deleteRegion,
  changeRegionStatus,
}: IRegionColumnsProps): ColumnDef<IRegion>[] => [
  {
    accessorKey: 'regionName',
    header: 'Region Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.regionName}</span>
    ),
  },
  {
    accessorKey: 'regionURL',
    header: 'Region URL',
    cell: ({ row }) => (
      <a
        href={row.original.regionURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary inline-flex items-center gap-1 hover:underline"
      >
        {row.original.regionURL}
      </a>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <DateTimeDisplay value={row.original.createdAt} mode="datetime" />
    ),
  },
  {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => (
      <ButtonGroup>
        <CustomButton
          variant="outline"
          tooltip="Edit Region"
          icon={<Edit />}
          onClick={() => navigate(`/regions/${row.original.id}/edit`)}
        />
        <CustomButton
          variant="outline"
          tooltip="Change Region Status"
          onClick={() => changeRegionStatus(row.original.id)}
          icon={row.original.isActive ? <ToggleRight /> : <ToggleLeft />}
        />
        <CustomButton
          variant="outline"
          tooltip="Delete Region"
          onClick={() => deleteRegion(row.original.id)}
          icon={<Trash2 />}
        />
      </ButtonGroup>
    ),
  },
];

export default getRegionColumns;
