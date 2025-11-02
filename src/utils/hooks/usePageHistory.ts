import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { isClient } from '@/utils/helpers/common';
import { PUBLIC_ROUTES } from '@/utils/constants/routes';

interface PageHistoryItem {
  path: string;
  timestamp: number;
  title?: string;
}

const PAGE_HISTORY_KEY = 'history';
const MAX_HISTORY_ITEMS = 5;

export const usePageHistory = (): void => {
  const location = useLocation();
  const matches = useMatches();

  useEffect(() => {
    if (!isClient) return;

    const pathname = location.pathname;
    const timestamp = Date.now();

    if (PUBLIC_ROUTES.some(route => pathname === route)) {
      return;
    }

    try {
      const match = matches[matches.length - 1];
      const routeTitle = (match?.handle as { title?: string })?.title;

      const storedHistory = localStorage.getItem(PAGE_HISTORY_KEY);
      let history: PageHistoryItem[] = storedHistory
        ? JSON.parse(storedHistory)
        : [];

      const lastVisited = history[0];
      if (lastVisited?.path !== pathname) {
        history = history.filter(item => item.path !== pathname);

        const newItem: PageHistoryItem = {
          path: pathname,
          timestamp: timestamp,
          title: routeTitle || document.title || pathname,
        };

        history.unshift(newItem);

        if (history.length > MAX_HISTORY_ITEMS) {
          history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        localStorage.setItem(PAGE_HISTORY_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Page history saving error:', error);
    }
  }, [location.pathname, matches]);
};

export const getPageHistory = (): PageHistoryItem[] => {
  if (!isClient) return [];

  try {
    const history = localStorage.getItem(PAGE_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Page history reading error:', error);
    return [];
  }
};

export const clearPageHistory = (): void => {
  if (!isClient) return;

  try {
    localStorage.removeItem(PAGE_HISTORY_KEY);
  } catch (error) {
    console.error('Page history clearing error:', error);
  }
};
