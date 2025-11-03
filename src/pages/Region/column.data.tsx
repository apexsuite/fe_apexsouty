import CustomButton from '@/components/CustomButton';
import { Badge } from '@/components/ui/badge';
import { ButtonGroup } from '@/components/ui/button-group';
import { IRegion } from '@/services/region/types';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
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
    accessorKey: 'marketplaces',
    header: 'Marketplaces',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.marketplaces?.map((marketplace, index) => (
          <Badge key={index} variant="secondary" className="font-mono text-xs">
            {marketplace}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'consent.sellingPartnerId',
    header: 'Seller Partner ID',
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.consent?.sellingPartnerId || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <span className="text-sm">
        {dayjs(row.original.createdAt).format('DD/MM/YYYY HH:mm')}
      </span>
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
          size="sm"
          icon={<Edit />}
          onClick={() => navigate(`/regions/${row.original.id}/edit`)}
        />
        <CustomButton
          variant="outline"
          tooltip="Change Region Status"
          size="sm"
          onClick={() => changeRegionStatus(row.original.id)}
          icon={row.original.isActive ? <ToggleRight /> : <ToggleLeft />}
        />
        <CustomButton
          variant="outline"
          tooltip="Delete Region"
          size="sm"
          onClick={() => deleteRegion(row.original.id)}
          icon={<Trash2 />}
        />
      </ButtonGroup>
    ),
  },
];

export default getRegionColumns;
