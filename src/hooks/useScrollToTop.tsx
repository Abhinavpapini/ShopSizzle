import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};

// Helper function for manual scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};
