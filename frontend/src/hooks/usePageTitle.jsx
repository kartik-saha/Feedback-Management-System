// src/hooks/usePageTitle.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titleMap = {
  '/': 'Home | SurveySphere',
  '/settings': 'Settings | SurveySphere',
  '/notifications': 'Notifications | SurveySphere',
  '/create': 'Create Survey | SurveySphere',
  '/analytics': 'Analytics | SurveySphere',
};

export default function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = titleMap[location.pathname] || 'SurveySphere';
    document.title = title;
  }, [location.pathname]);
}
