import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Users, Activity } from 'lucide-react';

interface PermissionQuickActionsProps {
  onDuplicate?: () => void;
  onManageAssignments?: () => void;
  onViewActivityLog?: () => void;
}

export default function PermissionQuickActions({
  onDuplicate,
  onManageAssignments,
  onViewActivityLog
}: PermissionQuickActionsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('permissions.quickActions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onDuplicate}
        >
          <Copy className="w-4 h-4 mr-2" />
          {t('permissions.duplicatePermission')}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onManageAssignments}
        >
          <Users className="w-4 h-4 mr-2" />
          {t('permissions.manageAssignments')}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onViewActivityLog}
        >
          <Activity className="w-4 h-4 mr-2" />
          {t('permissions.viewActivityLog')}
        </Button>
      </CardContent>
    </Card>
  );
} 