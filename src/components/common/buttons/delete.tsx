import { Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import CustomButton from '@/components/CustomButton';

interface DeleteButtonProps {
  title: string;
  description: string;
  onConfirm: () => void;
}

const DeleteButton = ({ title, description, onConfirm }: DeleteButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <CustomButton
            variant="outline"
            size="icon"
            icon={<Trash2 />}
            tooltip="Delete"
          />
        }
      />
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={<CustomButton variant="outline" label="Cancel" />}
          />
          <AlertDialogClose
            render={
              <CustomButton
                variant="destructive"
                onClick={onConfirm}
                label="Delete"
                icon={<Trash2 />}
              />
            }
          />
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
};

export default DeleteButton;
