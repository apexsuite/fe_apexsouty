import React from 'react';
import { Input, Select, Button, Card } from 'antd';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface RoleFiltersProps {
  searchTerm: string;
  selectedRoleValue: string;
  onSearchChange: (value: string) => void;
  onRoleValueChange: (value: string) => void;
  onSearch: () => void;
}

const RoleFilters: React.FC<RoleFiltersProps> = ({
  searchTerm,
  selectedRoleValue,
  onSearchChange,
  onRoleValueChange,
  onSearch,
}) => {
  const { t } = useTranslation();

  return (
    <Card 
      className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('roles.searchRoles') || 'Search roles...'}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onPressEnter={onSearch}
            prefix={<Search size={16} className="text-gray-400 dark:text-gray-500" />}
            size="large"
            className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedRoleValue}
            onChange={onRoleValueChange}
            size="large"
            className="min-w-[140px] dark:bg-gray-700 dark:border-gray-600"
            dropdownStyle={{ backgroundColor: '#374151', borderColor: '#4B5563' }}
          >
            <Option value="all">{t('roles.allRoleValues') || 'All Role Values'}</Option>
            <Option value="1">{t('roles.roleValue1') || 'Role Value 1'}</Option>
            <Option value="2">{t('roles.roleValue2') || 'Role Value 2'}</Option>
            <Option value="3">{t('roles.roleValue3') || 'Role Value 3'}</Option>
            <Option value="4">{t('roles.roleValue4') || 'Role Value 4'}</Option>
            <Option value="5">{t('roles.roleValue5') || 'Role Value 5'}</Option>
          </Select>
          <Button
            type="primary"
            onClick={onSearch}
            size="large"
            icon={<Search size={16} />}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            {t('roles.search') || 'Search'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RoleFilters; 