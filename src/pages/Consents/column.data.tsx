import { IConsent } from '@/services/consents/types';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/status-badge';

const getConsentsColumns = (): ColumnDef<IConsent>[] => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      const hasConsent = row.original.marketplaces?.some(
        marketplace => marketplace.id === row.original.consent?.marketplaceId
      );
      if (hasConsent) {
        return null;
      }

      const hasMarketplaces =
        row.original.marketplaces && row.original.marketplaces.length > 0;

      if (!hasMarketplaces) {
        return null;
      }

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="h-8 w-8 p-0"
        >
          {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
        </Button>
      );
    },
    size: 30,
  },
  {
    accessorKey: 'regionName',
    header: 'Region Name',
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
    cell: ({ row }) => {
      const hasConsent = row.original.marketplaces?.some(
        marketplace => marketplace.id === row.original.consent?.marketplaceId
      );
      if (hasConsent) {
        return (
          <StatusBadge isActive={row.original.consent?.isActive ?? false} />
        );
      }
      return <StatusBadge isActive={row.original.isActive} />;
    },
  },
  {
    accessorKey: 'sellingPartnerId',
    header: 'Selling Partner ID',
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original?.consent?.sellingPartnerId ?? '-'}
      </span>
    ),
  },
];

export default getConsentsColumns;
