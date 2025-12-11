import Empty from '@/components/common/empty';
import CustomButton from '@/components/CustomButton';
import { ArrowLeft, Hammer, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="flex h-dvh items-center justify-center">
      <Empty
        title="Under Construction"
        description="This page is under construction."
        icon={<Hammer />}
        children={
          <div className="flex items-center gap-2">
            <CustomButton
              onClick={() => navigate('/')}
              label="Go Back"
              icon={<ArrowLeft />}
              variant="outline"
            />
            <CustomButton
              onClick={() => navigate('/')}
              label="Go Home"
              icon={<Home />}
            />
          </div>
        }
      />
    </div>
  );
}
