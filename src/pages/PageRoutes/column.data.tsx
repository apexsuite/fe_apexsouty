import StatusBadge from '@/components/common/status-badge';
import type { IPageRoute } from '@/services/page-routes/types';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, type NavigateFunction } from 'react-router-dom';
import createColumns, {
  type ColumnConfig,
  type ActionsConfig,
} from '@/components/CustomColumn';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { t } from 'i18next';

interface IGetPageRouteColumnsProps {
  navigate: NavigateFunction;
  deletePageRoute: (id: string) => void;
  changePageRouteStatus: (id: string) => void;
}

const getLucideIcon = (icon: string) => {
  if (!icon) return LucideIcons.Circle;

  const pascalCaseName = icon
    .split('-')
    .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  const IconComponent = (
    LucideIcons as unknown as Record<string, typeof LucideIcons.Circle>
  )[pascalCaseName];
  return IconComponent ?? LucideIcons.Circle;
};

const COLUMN_CONFIG: ColumnConfig<IPageRoute>[] = [
  {
    accessorKey: 'name',
    header: t('pages.table.name'),
    size: 1,
    cell: row => {
      const IconComponent = getLucideIcon(row.icon);
      return (
        <div className="flex items-center gap-2">
          <IconComponent />
          {row.name}
        </div>
      );
    },
  },
  {
    accessorKey: 'component',
    header: t('pages.table.component'),
    size: 1,
  },
  {
    accessorKey: 'path',
    header: t('pages.table.path'),
    size: 1,
    cell: row => (
      <Link to={row.path}>
        <Badge variant="secondary" size="lg">
          {row.path}
        </Badge>
      </Link>
    ),
  },
  {
    accessorKey: 'permissionCount',
    header: t('pages.table.permissions'),
    size: 1,
  },
  {
    accessorKey: 'isActive',
    header: t('pages.table.status'),
    size: 1,
    cell: row => <StatusBadge isActive={row.isActive} />,
  },
  {
    accessorKey: 'isVisible',
    header: t('pages.table.visible'),
    size: 1,
    cell: row => (
      <StatusBadge status={row.isVisible ? 'visible' : 'invisible'} />
    ),
  },
  {
    accessorKey: 'IsUnderConstruction',
    header: 'Under Construction',
    size: 1,
    cell: row => (
      <StatusBadge
        status={row.IsUnderConstruction ? 'under_construction' : 'no'}
      />
    ),
  },
  {
    accessorKey: 'actions',
    header: t('common.actions'),
    size: 1,
  },
];

const getPageRouteColumns = ({
  navigate,
  deletePageRoute,
  changePageRouteStatus,
}: IGetPageRouteColumnsProps): ColumnDef<IPageRoute>[] => {
  const actions: ActionsConfig<IPageRoute> = {
    view: {
      label: 'View Page Route',
      onClick: row => navigate(`/page-routes/${row.id}`),
    },
    edit: {
      label: 'Edit Page Route',
      onClick: row => navigate(`/page-routes/${row.id}/edit`),
    },
    toggle: {
      label: 'Change Status',
      onClick: row => changePageRouteStatus(row.id),
    },
    delete: {
      label: 'Delete',
      onConfirm: row => deletePageRoute(row.id),
      title: 'Delete Page Route',
      description: 'Are you sure you want to delete this page route?',
    },
  };

  return createColumns<IPageRoute>({
    config: COLUMN_CONFIG,
    actions,
  });
};

export default getPageRouteColumns;
