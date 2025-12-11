import StatusBadge from '@/components/common/status-badge';
import type { IRegion } from '@/services/region/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { NavigateFunction } from 'react-router-dom';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';
import dayjs from 'dayjs';

interface IGetRegionColumnsProps {
  navigate: NavigateFunction;
  deleteRegion: (id: string) => void;
  changeRegionStatus: (id: string) => void;
}

const COLUMN_CONFIG: ColumnConfig<IRegion>[] = [
  {
    accessorKey: 'regionName',
    header: 'Region Name',
    size: 2,
    cell: row => <span className="font-medium">{row.regionName}</span>,
  },
  {
    accessorKey: 'regionURL',
    header: 'Region URL',
    size: 3,
    cell: row => (
      <a
        href={row.regionURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary inline-flex items-center gap-1 hover:underline"
      >
        {row.regionURL}
      </a>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    size: 1,
    cell: row => <StatusBadge isActive={row.isActive} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    size: 2,
    cell: row => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'),
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    size: 1,
  },
];

const getRegionColumns = ({
  navigate,
  deleteRegion,
  changeRegionStatus,
}: IGetRegionColumnsProps): ColumnDef<IRegion>[] => {
  const actions: ActionsConfig<IRegion> = {
    edit: {
      label: 'Edit Region',
      onClick: row => navigate(`/regions/${row.id}/edit`),
    },
    toggle: {
      label: 'Change Region Status',
      onClick: row => changeRegionStatus(row.id),
    },
    delete: {
      label: 'Delete',
      onConfirm: row => deleteRegion(row.id),
      title: 'Delete Region',
      description: 'Are you sure you want to delete this region?',
    },
  };

  return createColumns<IRegion>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getRegionColumns;
