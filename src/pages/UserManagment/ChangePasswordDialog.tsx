import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ControlledPassword } from '@/components/FormInputs';
import CustomButton from '@/components/CustomButton';
import type { IChangeUserPasswordRequest } from '@/services/user-managment/types';

const changePasswordValidationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  fullName: string;
  onSubmit: (userId: string, newPassword: string) => void;
  isPending?: boolean;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
  userId,
  fullName,
  onSubmit,
  isPending = false,
}: ChangePasswordDialogProps) {
  const { control, handleSubmit, reset } = useForm<IChangeUserPasswordRequest>({
    resolver: yupResolver(changePasswordValidationSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const onFormSubmit = (data: IChangeUserPasswordRequest) => {
    onSubmit(userId, data.newPassword);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Change password for user: <strong>{fullName}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <ControlledPassword
            control={control}
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            required
          />
          <DialogFooter>
            <CustomButton
              label="Cancel"
              onClick={() => handleOpenChange(false)}
              variant="outline"
              disabled={isPending}
            />
            <CustomButton
              label="Change Password"
              onClick={handleSubmit(onFormSubmit)}
              disabled={isPending}
              loading={isPending}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
