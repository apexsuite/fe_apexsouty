import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AppRoutes() {
    const router = createBrowserRouter(routes);

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
        </Suspense>
    );
}