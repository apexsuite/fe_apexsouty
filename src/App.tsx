import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import AppRoutes from '@/routes';

function App() {
  return (
    <Providers>
      <ToastProvider />
      <AppRoutes />
    </Providers>
  );
}

export default App;
