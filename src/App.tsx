import Providers from '@/components/Providers';
import ToastProvider from '@/components/ToastProvider';
import AppRoutes from '@/routes';

function AppContent() {
  return (
    <>
      <ToastProvider />
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App; 