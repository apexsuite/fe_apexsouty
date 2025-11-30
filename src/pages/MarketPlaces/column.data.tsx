import StatusBadge from '@/components/common/status-badge';
import CustomButton from '@/components/CustomButton';
import { ButtonGroup } from '@/components/ui/button-group';
import { IMarketplace } from '@/services/marketplaces/type';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, SquarePen, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';

interface IMarketPlaceColumnsProps {
  navigate: NavigateFunction;
  deleteMarketplace: (id: string) => void;
  changeMarketplaceStatus: (id: string) => void;
}

const getMarketPlaceColumns = ({
  navigate,
  deleteMarketplace,
  changeMarketplaceStatus,
}: IMarketPlaceColumnsProps): ColumnDef<IMarketplace>[] => {
  return [
    {
      accessorKey: 'marketplace',
      header: 'Marketplace',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.marketplace}</span>
      ),
    },
    {
      accessorKey: 'marketplaceKey',
      header: 'Marketplace Key',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.marketplaceKey}</span>
      ),
    },
    {
      accessorKey: 'marketplaceURL',
      header: 'Marketplace URL',
      cell: ({ row }) => (
        <a
          href={row.original.marketplaceURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1 hover:underline"
        >
          {row.original.marketplaceURL}
        </a>
      ),
    },
    {
      accessorKey: 'region',
      header: 'Region',
      cell: ({ row }) => (
        <span className="font-medium">{row?.original?.region?.regionName}</span>
      ),
    },
    {
      accessorKey: 'regionId',
      header: 'Region ID',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.regionId}</span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => (
        <ButtonGroup>
          <CustomButton
            variant="outline"
            onClick={() => navigate(`/marketplaces/${row.original.id}`)}
            icon={<Eye />}
            tooltip="View Market Place"
          />
          <CustomButton
            variant="outline"
            onClick={() => navigate(`/marketplaces/${row.original.id}/edit`)}
            icon={<SquarePen />}
            tooltip="Edit Market Place"
          />
          <CustomButton
            variant="outline"
            onClick={() => changeMarketplaceStatus(row.original.id)}
            icon={row.original.isActive ? <ToggleRight /> : <ToggleLeft />}
            tooltip={
              row.original.isActive
                ? 'Deactivate Market Place'
                : 'Activate Market Place'
            }
          />
          <CustomButton
            variant="outline"
            onClick={() => deleteMarketplace(row.original.id)}
            icon={<Trash2 />}
            tooltip="Delete Market Place"
          />
        </ButtonGroup>
      ),
    },
  ];
};

export default getMarketPlaceColumns;
