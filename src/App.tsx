import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/common/layout";
import { useBackButton } from "@/hooks/useBackButton";
import React, { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Index = React.lazy(() => import("./pages/Index"));
const GerarQR = React.lazy(() => import("./pages/GerarQR"));
const Historico = React.lazy(() => import("./pages/Historico"));
const Configuracoes = React.lazy(() => import("./pages/Configuracoes"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Fallback = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="md" />
    <span className="ml-3 text-sm text-muted-foreground">Carregando...</span>
  </div>
);

const AppContent = () => {
  useBackButton();
  
  return (
    <Layout>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gerar-qr" element={<GerarQR />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
