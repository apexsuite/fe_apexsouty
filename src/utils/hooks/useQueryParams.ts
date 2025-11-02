import { useSearchParams } from 'react-router-dom';

const useQueryParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateQueryParams = (
        params: Record<string | number, string | number | undefined | null>
    ) => {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.set(key, String(value));
            } else {
                searchParams.delete(key);
            }
        });

        setSearchParams(searchParams);
    };

    const setDefaultQueryParams = (
        defaultParams: Record<string, string | number | boolean>
    ) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        const updatedParams: Record<string, string> = {};

        Object.entries(defaultParams).forEach(([key, value]) => {
            if (currentParams[key] === undefined) {
                updatedParams[key] = String(value);
            }
        });

        if (Object.keys(updatedParams).length > 0) {
            updateQueryParams(updatedParams);
        }
    };

    const deleteQueryParams = (keys: string[]) => {
        keys.forEach((key) => searchParams.delete(key));
        setSearchParams(searchParams);
    };

    const clearAllQueryParams = (keys_to_preserve?: string[]) => {
        const preservedTabValue = searchParams.get('tab');
        const preservedKeys =
            keys_to_preserve?.reduce((acc, key) => {
                if (searchParams.has(key)) {
                    acc[key] = searchParams.get(key) as string;
                }
                return acc;
            }, {} as Record<string, string>) || {};

        const reservedKeys = {
            ...(preservedTabValue ? { tab: preservedTabValue } : {}),
            ...preservedKeys,
        };

        setSearchParams(reservedKeys);
    };

    const getQueryParam = (key: string) => {
        return searchParams.get(key) || undefined;
    };

    const getQueryParams = <T extends Record<string, string>>(
        keys: (keyof T)[]
    ): Partial<T> => {
        return keys.reduce((acc, key) => {
            const value = searchParams.get(key as string);
            acc[key] = (value as T[keyof T]) || undefined;
            return acc;
        }, {} as Partial<T>);
    };

    return {
        updateQueryParams,
        setDefaultQueryParams,
        deleteQueryParams,
        clearAllQueryParams,
        getQueryParam,
        getQueryParams,
    };
};

export default useQueryParams;
