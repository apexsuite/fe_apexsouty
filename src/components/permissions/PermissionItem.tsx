import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate, canRead, canUpdate, canDelete } from '@/lib/utils';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

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

interface PermissionItemProps {
  permission: Permission;
  onDelete: (id: string) => void;
}

export default function PermissionItem({ permission, onDelete }: PermissionItemProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setFormattedDate(formatDate(permission.lastModified));
  }, [permission.lastModified]);

  const handleViewClick = () => {
    console.log('Eye clicked, navigating to:', `/permissions/${permission.id}`);
    navigate(`/permissions/${permission.id}`);
  };

  const handleEditClick = () => {
    console.log('Edit clicked, navigating to:', `/permissions/${permission.id}`);
    navigate(`/permissions/${permission.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(permission.id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'read': return <Eye className="w-4 h-4" />;
      case 'write': return <Edit className="w-4 h-4" />;
      case 'admin': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'write': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg  dark:hover:bg-green-300 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            {getTypeIcon(permission.type)}
            <div>
              <h3 className="font-medium">{permission.name}</h3>
              <p className="text-sm text-gray-600">{permission.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mr-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(permission.type)}`}>
            {t(`permissions.${permission.type}`)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permission.status)}`}>
            {t(`permissions.${permission.status}`)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500" suppressHydrationWarning>
            {formattedDate}
          </span>
          <div className="flex gap-1">
            {/* View Button - sadece Read izni varsa göster */}
            {canRead(user) && (
              <Button
                variant="ghost"
                size="sm"
                className='cursor-pointer'
                onClick={handleViewClick}
                title="Detayları Görüntüle"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            
            {/* Edit Button - sadece Update izni varsa göster */}
            {canUpdate(user) && (
              <Button
                variant="ghost"
                size="sm"
                className='cursor-pointer'
                onClick={handleEditClick}
                title="Düzenle"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            
            {/* Delete Button - sadece Delete izni varsa göster */}
            {canDelete(user) && (
              <Button
                variant="ghost"
                className='cursor-pointer'
                size="sm"
                onClick={handleDeleteClick}
                title="Sil"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog - sadece Delete izni varsa göster */}
      {canDelete(user) && (
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteConfirm}
          title={t('permissions.deleteConfirmTitle')}
          message={t('permissions.deleteConfirmMessage')}
          confirmText={t('permissions.deleteConfirmDelete')}
          cancelText={t('permissions.deleteConfirmCancel')}
          variant="danger"
        />
      )}
    </>
  );
} 