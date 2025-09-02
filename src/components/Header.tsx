
import { QrCode, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // Se já estiver na home, scroll para o topo e força dashboard
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/?view=dashboard', { replace: true });
    } else {
      navigate('/?view=dashboard');
    }
  };

  // Mostrar botão apenas quando não estiver no dashboard ou chaves
  const shouldShowHomeButton = () => {
    if (location.pathname !== '/') {
      return true; // Mostrar em outras páginas
    }
    
    // Na página inicial, verificar se não está no dashboard ou chaves
    const currentView = new URLSearchParams(location.search).get('view');
    const isInMainViews = !currentView || currentView === 'dashboard' || currentView === 'keys';
    return !isInMainViews;
  };

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold pix-gradient-text">Pix Fácil</h1>
              <p className="pix-caption hidden sm:block">Simplifique seus pagamentos</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center flex-1">
            <OfflineIndicator />
          </div>
          
          {shouldShowHomeButton() && (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleHomeClick}
                className="rounded-xl"
              >
                <Home className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
