import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex h-[calc(100vh-4.5rem)] items-center justify-center">
    <Loader className="animate-spin" size={32} />
  </div>
);

export default LoadingSpinner;
