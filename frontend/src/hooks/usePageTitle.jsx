// src/hooks/usePageTitle.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titleMap = {
  '/': 'Home | YourAppName',
  '/settings': 'Settings | YourAppName',
  '/notifications': 'Notifications | YourAppName',
  '/create': 'Create Survey | YourAppName',
  '/analytics': 'Analytics | YourAppName',
};

export default function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = titleMap[location.pathname] || 'YourAppName';
    document.title = title;
  }, [location.pathname]);
}
