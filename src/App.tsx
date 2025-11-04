import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import AppRoutes from '@/routes';
import useQueryParamHandler from './utils/hooks/useQueryParamHandler';

function App() {
  return (
    <Providers>
      <ToastProvider />
      <AppRoutes />
    </Providers>
  );
}

export default App;
