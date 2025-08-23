import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Globe, Wifi } from 'lucide-react';

export const CapacitorStatus = () => {
  const [platform, setPlatform] = useState<string>('');
  const [isNative, setIsNative] = useState<boolean>(false);

  useEffect(() => {
    setPlatform(Capacitor.getPlatform());
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          {isNative ? (
            <Smartphone className="w-5 h-5 text-primary" />
          ) : (
            <Globe className="w-5 h-5 text-muted-foreground" />
          )}
          <CardTitle>Status da Plataforma</CardTitle>
        </div>
        <CardDescription>
          Informações sobre o ambiente de execução atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Plataforma:</span>
          <Badge variant={isNative ? "default" : "secondary"}>
            {platform}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ambiente:</span>
          <Badge variant={isNative ? "default" : "outline"}>
            {isNative ? "Aplicativo Nativo" : "Navegador Web"}
          </Badge>
        </div>

        {isNative && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Wifi className="w-4 h-4" />
              <span className="font-medium">Modo Nativo Ativo</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              O app está rodando nativamente com acesso às APIs do dispositivo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};