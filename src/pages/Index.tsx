
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StatsCard from "@/components/StatsCard";
import PixKeyForm from "@/components/PixKeyForm";
import PixKeyList from "@/components/PixKeyList";
import EnhancedQRGenerator from "@/components/EnhancedQRGenerator";
import PrimaryKeyCard from "@/components/PrimaryKeyCard";
import QRHistoryList from "@/components/QRHistoryList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { QrCode, Share, User, Home, Plus, History, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePixStore } from "@/hooks/usePixStore";
import type { PixKey as StorePixKey, QRCodeHistory } from "@/hooks/usePixStore";
import type { PixKey as FormPixKey } from "@/components/PixKeyForm";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<"dashboard" | "keys" | "add-key" | "edit-key" | "generate-qr" | "history">("dashboard");
  const [selectedKey, setSelectedKey] = useState<FormPixKey | null>(null);
  const [editingKey, setEditingKey] = useState<FormPixKey | null>(null);
  
  // Use Zustand store instead of local state
  const {
    pixKeys,
    qrHistory,
    addPixKey,
    deletePixKey,
    setPrimaryKey,
    getPrimaryKey,
    addQRHistory,
    updateQRReceived,
    cancelQR,
    getQRHistory,
    deleteQRHistory,
    updatePixKey,
  } = usePixStore();

  // Verificar se deve ir para o dashboard via query params
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'dashboard') {
      setCurrentView('dashboard');
      setSearchParams({}, { replace: true }); // Remove o query param
    }
  }, [searchParams, setSearchParams]);

  // Sincronizar mudanças de view com URL
  const handleViewChange = (newView: "dashboard" | "keys" | "add-key" | "edit-key" | "generate-qr" | "history") => {
    setCurrentView(newView);
    if (newView !== 'dashboard' && newView !== 'keys' && newView !== 'history') {
      setSearchParams({ view: newView });
    } else {
      setSearchParams({});
    }
  };

  const handleSavePixKey = (newKey: Omit<FormPixKey, 'id' | 'createdAt'>) => {
    const storeKey: Omit<StorePixKey, 'id' | 'createdAt'> = {
      type: newKey.type as StorePixKey['type'],
      value: newKey.value,
      name: newKey.label,
      isPrimary: newKey.isPrimary || false
    };
    
    addPixKey(storeKey);
    handleViewChange("keys");
    toast({
      title: "✅ Chave salva com sucesso!",
      description: "Sua chave Pix foi cadastrada e já está disponível",
    });
  };

  const handleDeleteKey = (id: string) => {
    deletePixKey(id);
    toast({
      title: "🗑️ Chave removida",
      description: "A chave Pix foi excluída com sucesso",
    });
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryKey(id);
    toast({
      title: "⭐ Chave principal definida",
      description: "A chave foi definida como principal com sucesso",
    });
  };

  const handleGenerateQR = (key: FormPixKey) => {
    setSelectedKey(key);
    handleViewChange("generate-qr");
  };

  const handleQRGenerated = (qrData: {
    qrCode: string;
    pixCode: string;
    amount: string;
    description: string;
  }) => {
    if (selectedKey) {
      const keyName = selectedKey.label;
      addQRHistory({
        pixKeyId: selectedKey.id,
        pixKeyValue: selectedKey.value,
        pixKeyName: keyName,
        qrCode: qrData.qrCode,
        pixCode: qrData.pixCode,
        amount: qrData.amount,
        description: qrData.description,
        isReceived: false,
        isCancelled: false
      });
    }
  };

  const handleUpdateQRReceived = (id: string, isReceived: boolean) => {
    updateQRReceived(id, isReceived);
    toast({
      title: isReceived ? "✅ Marcado como recebido!" : "⏳ Marcado como pendente",
      description: isReceived 
        ? "Pagamento confirmado no histórico" 
        : "Pagamento marcado como pendente",
    });
  };

  const handleViewQRFromHistory = (qr: QRCodeHistory) => {
    // Find the corresponding key for the QR and convert to component format
    const storeKey = pixKeys.find(k => k.id === qr.pixKeyId);
    if (storeKey) {
      const componentKey: FormPixKey = {
        id: storeKey.id,
        type: storeKey.type,
        value: storeKey.value,
        label: storeKey.name,
        isPrimary: storeKey.isPrimary,
        createdAt: storeKey.createdAt,
      };
      setSelectedKey(componentKey);
      handleViewChange("generate-qr");
    }
  };

  const handleEditPixKey = (key: FormPixKey) => {
    setEditingKey(key);
    handleViewChange('edit-key');
  };

  const primaryKey = getPrimaryKey();

  const renderCurrentView = () => {
    switch (currentView) {
      case "add-key":
        return (
          <PixKeyForm
            onSave={handleSavePixKey}
            onCancel={() => handleViewChange("keys")}
          />
        );
      
      case "edit-key":
        return (
          <PixKeyForm
            mode="edit"
            initialKey={editingKey}
            onUpdate={(id, updated) => {
              // Converter label -> name para o store
              updatePixKey(id, {
                type: updated.type as StorePixKey['type'],
                value: updated.value,
                name: updated.label,
                isPrimary: updated.isPrimary,
              });
              setEditingKey(null);
              handleViewChange('keys');
            }}
            onCancel={() => {
              setEditingKey(null);
              handleViewChange('keys');
            }}
            // onSave não é usado em modo edit, mas o componente exige a prop
            onSave={() => {}}
          />
        );
      
      case "keys":
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="pix-heading-2">Minhas Chaves Pix</h2>
              <Button 
                onClick={() => {
                  if (pixKeys.length === 0) {
                    handleViewChange("add-key");
                    return;
                  }
                  if (primaryKey) {
                    const componentKey: FormPixKey = {
                      id: primaryKey.id,
                      type: primaryKey.type,
                      value: primaryKey.value,
                      label: primaryKey.name,
                      isPrimary: primaryKey.isPrimary,
                      createdAt: primaryKey.createdAt,
                    };
                    setSelectedKey(componentKey);
                    handleViewChange("generate-qr");
                  } else {
                    toast({
                      title: "Selecione uma chave",
                      description: "Use o botão QR na linha da chave ou defina uma chave principal para gerar rapidamente.",
                    });
                  }
                }}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 min-h-[2.5rem] min-w-0"
              >
                <QrCode className="w-4 h-4 flex-shrink-0" />
                <span className="truncate max-w-full">
                  {pixKeys.length === 0 ? "Cadastre uma chave" : "Gerar QR Code"}
                </span>
              </Button>
            </div>
            <PixKeyList
              keys={pixKeys.map(key => ({
                id: key.id,
                type: key.type,
                value: key.value,
                label: key.name,
                isPrimary: key.isPrimary,
                createdAt: key.createdAt,
              }))}
              onDeleteKey={handleDeleteKey}
              onGenerateQR={handleGenerateQR}
              onSetPrimary={handleSetPrimary}
              onEditKey={handleEditPixKey}
            />
          </div>
        );
        
      case "history":
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="pix-heading-2">Histórico de QR Codes</h2>
              <div className="text-sm text-muted-foreground">
                {qrHistory.length} QR Code{qrHistory.length !== 1 ? 's' : ''} gerado{qrHistory.length !== 1 ? 's' : ''}
              </div>
            </div>
            <QRHistoryList
              qrHistory={qrHistory}
              onUpdateReceived={handleUpdateQRReceived}
              onCancelQR={cancelQR}
              onViewQR={handleViewQRFromHistory}
              onDeleteQR={deleteQRHistory}
            />
          </div>
        );

      case "generate-qr":
        return selectedKey ? (
          <div className="space-y-8">
            <h2 className="pix-heading-2">Gerar QR Code</h2>
            <EnhancedQRGenerator
              selectedKey={selectedKey}
              onBack={() => handleViewChange("keys")}
              onQRGenerated={handleQRGenerated}
            />
          </div>
        ) : null;

      default:
        return (
          <div className="space-y-10">
            <div className="text-center py-12 animate-fade-in">
              <h1 className="pix-heading-1 mb-6">
                Bem-vindo ao Pix Fácil
              </h1>
              <p className="pix-body-large max-w-3xl mx-auto">
                Simplifique seus pagamentos Pix: cadastre suas chaves, gere QR Codes e receba pagamentos em segundos.
              </p>
            </div>

            {primaryKey && (
              <PrimaryKeyCard 
                primaryKey={{
                  id: primaryKey.id,
                  type: primaryKey.type,
                  value: primaryKey.value,
                  label: primaryKey.name,
                  isPrimary: primaryKey.isPrimary,
                  createdAt: primaryKey.createdAt,
                }}
                onGenerateQR={handleGenerateQR}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatsCard
                title="Chaves Cadastradas"
                value={pixKeys.length}
                icon={User}
              />
              <StatsCard
                title="QR Codes Gerados"
                value={qrHistory.length}
                icon={QrCode}
                gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
              <StatsCard
                title="Pagamentos Recebidos"
                value={qrHistory.filter(qr => qr.isReceived).length}
                icon={Share}
                gradient="bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <AnimatedCard className="pix-card" delay={100}>
                <CardHeader className="pb-6">
                  <CardTitle className="pix-heading-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Gerenciar Chaves Pix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="pix-body">
                    Cadastre e gerencie suas chaves Pix de forma simples e organizada.
                  </p>
                  <Button 
                    onClick={() => handleViewChange("keys")}
                    variant="gradient"
                    className="w-full flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Ver Minhas Chaves
                  </Button>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard className="pix-card" delay={200}>
                <CardHeader className="pb-6">
                  <CardTitle className="pix-heading-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    Gerar QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="pix-body">
                    Crie QR Codes Pix instantaneamente para receber pagamentos.
                  </p>
                  <Button 
                    onClick={() => handleViewChange(pixKeys.length === 0 ? "add-key" : "keys")}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 min-h-[2.5rem] min-w-0"
                    disabled={pixKeys.length === 0}
                  >
                    <QrCode className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate max-w-full">
                      {pixKeys.length === 0 ? "Cadastre uma chave" : "Gerar QR Code"}
                    </span>
                  </Button>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard className="pix-card" delay={300}>
                <CardHeader className="pb-6">
                  <CardTitle className="pix-heading-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <History className="w-5 h-5 text-white" />
                    </div>
                    Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="pix-body">
                    Acompanhe todos os QR Codes gerados e pagamentos recebidos.
                  </p>
                  <Button 
                    onClick={() => handleViewChange("history")}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Ver Histórico
                  </Button>
                </CardContent>
              </AnimatedCard>
            </div>

            {pixKeys.length === 0 && (
              <AnimatedCard className="pix-card text-center bg-pix-gradient-subtle py-12" delay={300}>
                <CardContent className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center animate-bounce-gentle">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="pix-heading-3">Comece agora!</h3>
                    <p className="pix-body max-w-md mx-auto">
                      Cadastre sua primeira chave Pix para começar a receber pagamentos de forma simples e rápida.
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleViewChange("add-key")}
                    variant="gradient"
                    size="lg"
                    className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
                  >
                    <Plus className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">Cadastrar Primeira Chave</span>
                  </Button>
                </CardContent>
              </AnimatedCard>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8 bg-card rounded-2xl p-2 shadow-sm border mx-1 sm:mx-0">
          <Button
            variant={currentView === "dashboard" ? "gradient" : "ghost"}
            onClick={() => handleViewChange("dashboard")}
            className="flex items-center justify-center gap-2 rounded-xl text-sm px-3 py-2 min-w-0"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Dashboard</span>
          </Button>
          <Button
            variant={currentView === "keys" || currentView === "add-key" || currentView === 'edit-key' ? "gradient" : "ghost"}
            onClick={() => handleViewChange("keys")}
            className="flex items-center justify-center gap-2 rounded-xl text-sm px-3 py-2 min-w-0"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Chaves ({pixKeys.length})</span>
          </Button>
          <Button
            variant={currentView === "history" ? "gradient" : "ghost"}
            onClick={() => handleViewChange("history")}
            className="flex items-center justify-center gap-2 rounded-xl text-sm px-3 py-2 min-w-0"
          >
            <History className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Histórico ({qrHistory.length})</span>
          </Button>
        </nav>

        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
