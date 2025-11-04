import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader className="animate-spin" size={24} />
  </div>
);

export default LoadingSpinner;
