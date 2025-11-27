import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex min-h-dvh items-center justify-center">
    <Loader className="text-muted animate-spin" size={24} />
  </div>
);

export default LoadingSpinner;
