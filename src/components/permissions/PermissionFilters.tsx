import { useTranslation } from 'react-i18next';
import { Card, Input } from 'antd';
import { Search } from 'lucide-react';

interface PermissionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
  typeFilter: 'all' | 'read' | 'write' | 'admin';
  setTypeFilter: (filter: 'all' | 'read' | 'write' | 'admin') => void;
}

export default function PermissionFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter
}: PermissionFiltersProps) {
  const { t } = useTranslation();

  return (
    <Card style={{ paddingTop: 24 }}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('navbar.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">{t('permissions.status')}: All</option>
            <option value="active">{t('permissions.active')}</option>
            <option value="inactive">{t('permissions.inactive')}</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'read' | 'write' | 'admin')}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">{t('permissions.type')}: All</option>
            <option value="read">{t('permissions.read')}</option>
            <option value="write">{t('permissions.write')}</option>
            <option value="admin">{t('permissions.admin')}</option>
          </select>
        </div>
      </div>
    </Card>
  );
} 