import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingButton } from '@/components/ui/loading-button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useLoading } from '@/hooks/useLoading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const AnimatedPageExample = () => {
  const [showCards, setShowCards] = useState(false);
  const { isLoading, withLoading } = useLoading();

  const handleAsyncAction = async () => {
    await withLoading(async () => {
      // Simula uma operação async
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Ação concluída!",
        description: "A operação foi executada com sucesso.",
      });
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold animate-fade-in">
          Exemplo de Animações e Loading States
        </h1>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setShowCards(!showCards)}
            className="hover-scale"
          >
            {showCards ? 'Ocultar' : 'Mostrar'} Cards Animados
          </Button>
          
          <LoadingButton
            loading={isLoading}
            loadingText="Processando..."
            onClick={handleAsyncAction}
            variant="outline"
          >
            Ação com Loading
          </LoadingButton>
        </div>
      </div>

      {/* Loading Spinner Example */}
      <AnimatedCard className="text-center">
        <CardHeader>
          <CardTitle>Loading Spinners</CardTitle>
          <CardDescription>Diferentes tamanhos de loading</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </CardContent>
      </AnimatedCard>

      {/* Skeleton Loading Example */}
      <AnimatedCard delay={100}>
        <CardHeader>
          <CardTitle>Skeleton Loading</CardTitle>
          <CardDescription>Exemplo de loading com skeleton</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </AnimatedCard>

      {/* Animated Cards Grid */}
      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <AnimatedCard
              key={i}
              delay={i * 100}
              className="hover-scale"
            >
              <CardHeader>
                <CardTitle>Card {i + 1}</CardTitle>
                <CardDescription>
                  Card animado com delay de {i * 100}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Conteúdo do card com animação de fade-in e hover effect.
                </p>
              </CardContent>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Animation Classes Demo */}
      <AnimatedCard delay={200}>
        <CardHeader>
          <CardTitle>Classes de Animação</CardTitle>
          <CardDescription>Demonstração das classes CSS disponíveis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded animate-pulse-slow">
            Animação pulse-slow
          </div>
          <div className="p-4 border rounded animate-bounce-gentle">
            Animação bounce-gentle
          </div>
          <a href="#" className="story-link text-primary">
            Link com animação de underline
          </a>
        </CardContent>
      </AnimatedCard>
    </div>
  );
};