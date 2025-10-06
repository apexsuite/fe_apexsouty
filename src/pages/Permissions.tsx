import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PermissionStats from '@/components/permissions/PermissionStats';
import PermissionGuard from '@/components/PermissionGuard';

import PermissionList from '@/components/permissions/PermissionList';
import PermissionFilters from '@/components/permissions/PermissionFilters';
import CreatePermissionModal from '@/components/permissions/CreatePermissionModal';
import { canRead, canCreate } from '@/lib/utils';

interface Permission {
  id: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'admin';
  status: 'active' | 'inactive';
  assignedTo: string[];
  lastModified: string;
  createdAt: string;
}

export default function PermissionsPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'read' | 'write' | 'admin'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPermission, setNewPermission] = useState<{
    name: string;
    description: string;
    actions: string[];
    assignedTo: string;
  }>({
    name: '',
    description: '',
    actions: [],
    assignedTo: ''
  });

  // Permission kontrolü
  useEffect(() => {
    if (!canRead(user)) {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    if (!canRead(user)) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockPermissions: Permission[] = [
        {
          id: '1',
          name: 'User Management',
          description: 'Full access to user management operations',
          type: 'admin',
          status: 'active',
          assignedTo: ['admin', 'supervisor'],
          lastModified: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T09:00:00Z'
        },
        {
          id: '2',
          name: 'Resource Read',
          description: 'Read-only access to resources',
          type: 'read',
          status: 'active',
          assignedTo: ['user', 'viewer'],
          lastModified: '2024-01-14T14:20:00Z',
          createdAt: '2024-01-02T11:00:00Z'
        },
        {
          id: '3',
          name: 'Data Write',
          description: 'Write access to data operations',
          type: 'write',
          status: 'inactive',
          assignedTo: ['editor'],
          lastModified: '2024-01-13T16:45:00Z',
          createdAt: '2024-01-03T13:00:00Z'
        },
        {
          id: '4',
          name: 'System Configuration',
          description: 'System configuration management',
          type: 'admin',
          status: 'active',
          assignedTo: ['admin'],
          lastModified: '2024-01-12T08:15:00Z',
          createdAt: '2024-01-04T15:00:00Z'
        },
        {
          id: '5',
          name: 'Report Generation',
          description: 'Generate and export reports',
          type: 'write',
          status: 'active',
          assignedTo: ['analyst', 'manager'],
          lastModified: '2024-01-11T12:30:00Z',
          createdAt: '2024-01-05T10:00:00Z'
        }
      ];
      setPermissions(mockPermissions);
      setFilteredPermissions(mockPermissions);
      setLoading(false);
    }, 500);
  }, [user]);

  useEffect(() => {
    let filtered = permissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(permission => permission.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(permission => permission.type === typeFilter);
    }

    setFilteredPermissions(filtered);
  }, [permissions, searchTerm, statusFilter, typeFilter]);

  const handleCreatePermission = () => {
    if (newPermission.name && newPermission.description && newPermission.actions.length > 0) {
      const permission: Permission = {
        id: Date.now().toString(),
        name: newPermission.name,
        description: newPermission.description,
        type: newPermission.actions[0] as 'read' | 'write' | 'admin',
        status: 'active',
        assignedTo: newPermission.assignedTo ? newPermission.assignedTo.split(',').map(s => s.trim()) : [],
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setPermissions(prev => [permission, ...prev]);
      setNewPermission({ name: '', description: '', actions: [], assignedTo: '' });
      setShowCreateModal(false);
    }
  };

  const handleDeletePermission = (id: string) => {
    setPermissions(prev => prev.filter(p => p.id !== id));
  };

  // Eğer Read izni yoksa loading göster
  if (!canRead(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  // Sadece ilk yükleme sırasında loading göster
  if (loading && permissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    total: permissions.length,
    active: permissions.filter(p => p.status === 'active').length,
    inactive: permissions.filter(p => p.status === 'inactive').length,
    read: permissions.filter(p => p.type === 'read').length,
    write: permissions.filter(p => p.type === 'write').length,
    admin: permissions.filter(p => p.type === 'admin').length
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>{t('permissions.title')}</h1>
          <p style={{ color: '#888' }}>{t('permissions.permissionManagement')}</p>
        </div>
        <PermissionGuard 
          permission="create-permission" 
          mode="hide"
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
            {t('permissions.createNewPermission')}
          </Button>
        </PermissionGuard>
      </div>

      {/* Stats Cards */}
      <PermissionStats stats={stats} />

      {/* Search and Filters */}
      <PermissionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      {/* Permissions List */}
      <PermissionList
        permissions={filteredPermissions}
        onDelete={handleDeletePermission}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />

      {/* Create Permission Modal */}
      <PermissionGuard 
        permission="create-permission" 
        mode="hide"
      >
        <CreatePermissionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          newPermission={newPermission}
          setNewPermission={setNewPermission}
          onSubmit={handleCreatePermission}
        />
      </PermissionGuard>
    </div>
  );
} 