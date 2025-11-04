import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import {
    fetchMyPermissions
} from '@/lib/permissionSlice';
import { Permission } from '@/services/permissionService';

export const usePagePermissionsByPath = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const [permissions, setPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        const currentPath = location.pathname;

        dispatch(fetchMyPermissions({ path: currentPath })).unwrap().then((response) => {
            setPermissions(response as Permission[]);
        });
    }, [location.pathname, dispatch]);

    return {
        permissions,
    };
};

