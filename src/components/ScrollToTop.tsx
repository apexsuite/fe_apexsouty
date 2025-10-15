import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component - Her sayfa geçişinde scroll pozisyonunu en üste sıfırlar
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Her route değişikliğinde scroll'u en üste sıfırla
    // setTimeout ile bir sonraki render cycle'da çalıştır
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      
      // Alternatif olarak document.documentElement ve document.body'yi de sıfırla
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
