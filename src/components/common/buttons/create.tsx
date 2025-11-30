import CustomButton from '@/components/CustomButton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateButtonProps {
  path: string;
}
export default function CreateButton({ path }: CreateButtonProps) {
  const navigate = useNavigate();
  return (
    <CustomButton
      label="Create"
      icon={<Plus />}
      onClick={() => navigate(path)}
      size="lg"
      iconPosition="right"
    />
  );
}
