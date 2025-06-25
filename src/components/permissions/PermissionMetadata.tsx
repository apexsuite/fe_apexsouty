import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface Permission {
  id: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'admin';
  status: 'active' | 'inactive';
  assignedTo: string[];
  lastModified: string;
  createdAt: string;
  permissions?: string[];
  scope?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface PermissionMetadataProps {
  permission: Permission;
}

export default function PermissionMetadata({ permission }: PermissionMetadataProps) {
  const { t } = useTranslation();
  const [formattedCreatedDate, setFormattedCreatedDate] = useState<string>('');
  const [formattedModifiedDate, setFormattedModifiedDate] = useState<string>('');

  useEffect(() => {
    setFormattedCreatedDate(formatDate(permission.createdAt));
    setFormattedModifiedDate(formatDate(permission.lastModified));
  }, [permission.createdAt, permission.lastModified]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('permissions.metadata')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">{t('permissions.created')}</Label>
          <p className="mt-1 text-sm text-gray-600" suppressHydrationWarning>
            {formattedCreatedDate}
          </p>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-700">{t('permissions.lastModified')}</Label>
          <p className="mt-1 text-sm text-gray-600" suppressHydrationWarning>
            {formattedModifiedDate}
          </p>
        </div>

        {permission.scope && (
          <div>
            <Label className="text-sm font-medium text-gray-700">{t('permissions.scope')}</Label>
            <p className="mt-1 text-sm text-gray-600 capitalize">{permission.scope}</p>
          </div>
        )}

        {permission.priority && (
          <div>
            <Label className="text-sm font-medium text-gray-700">{t('permissions.priority')}</Label>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(permission.priority)}`}>
                {t(`permissions.${permission.priority}`)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 