import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { canCreate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface NewPermission {
  name: string;
  description: string;
  actions: string[];
  assignedTo: string;
}

interface CreatePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPermission: NewPermission;
  setNewPermission: (permission: NewPermission) => void;
  onSubmit: () => void;
}

const CRUD_ACTIONS = ['create', 'read', 'delete', 'update'];

export default function CreatePermissionModal({
  isOpen,
  onClose,
  newPermission,
  setNewPermission,
  onSubmit,
}: CreatePermissionModalProps) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleActionChange = (action: string) => {
    const currentActions = newPermission.actions || [];
    const newActions = currentActions.includes(action)
      ? currentActions.filter((a) => a !== action)
      : [...currentActions, action];
    setNewPermission({ ...newPermission, actions: newActions });
  };

  // Eğer Create izni yoksa modal'ı gösterme
  if (!canCreate(user)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('permissions.createNewPermission')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t('permissions.permissionName')}
            </Label>
            <Input
              id="name"
              value={newPermission.name}
              onChange={(e) =>
                setNewPermission({ ...newPermission, name: e.target.value })
              }
              className="col-span-3"
              placeholder={t('permissions.enterPermissionName')}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t('permissions.description')}
            </Label>
            <Input
              id="description"
              value={newPermission.description}
              onChange={(e) =>
                setNewPermission({
                 ...newPermission,
                  description: e.target.value,
                })
              }
              className="col-span-3"
              placeholder={t('permissions.enterDescription')}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              {t('permissions.actions')}
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              {CRUD_ACTIONS.map((action) => (
                <div key={action} className="flex items-center gap-2">
                  <Checkbox
                    id={`action-${action}`}
                    checked={(newPermission.actions || []).includes(action)}
                    onCheckedChange={() => handleActionChange(action)}
                  />
                  <Label htmlFor={`action-${action}`} className="font-normal capitalize">
                    {t(`permissions.${action}`)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              {t('permissions.assignedTo')}
            </Label>
            <Input
              id="assignedTo"
              value={newPermission.assignedTo}
              onChange={(e) =>
                setNewPermission({
                 ...newPermission,
                  assignedTo: e.target.value,
                })
              }
              className="col-span-3"
              placeholder={t('permissions.enterUserName')}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('permissions.cancel')}</Button>
          </DialogClose>
          <Button onClick={onSubmit}>{t('permissions.createPermission')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 