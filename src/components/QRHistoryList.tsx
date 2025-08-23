import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, Share, Check, X, Eye, Ban } from "lucide-react";
import { QRCodeHistory } from "@/hooks/usePixStore";
import { toast } from "@/hooks/use-toast";
import SearchAndFilter from "./SearchAndFilter";
import ShareActions from "./ShareActions";
import CancelDialog from "./CancelDialog";
import DateFilter from "./DateFilter";
import { isSameDay } from "date-fns";

interface QRHistoryListProps {
  qrHistory: QRCodeHistory[];
  onUpdateReceived: (id: string, isReceived: boolean) => void;
  onCancelQR: (id: string, reason: string) => void;
  onViewQR: (qr: QRCodeHistory) => void;
}

const QRHistoryList = ({ qrHistory, onUpdateReceived, onCancelQR, onViewQR }: QRHistoryListProps) => {
  const [filteredHistory, setFilteredHistory] = useState<QRCodeHistory[]>(qrHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "received" | "cancelled">("all");
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; qr: QRCodeHistory | null }>({
    open: false,
    qr: null,
  });

  // Sincroniza o filteredHistory quando qrHistory, searchQuery, selectedDate ou statusFilter mudam
  useEffect(() => {
    applyFilters();
  }, [qrHistory, searchQuery, selectedDate, statusFilter]);

  const applyFilters = () => {
    let filtered = qrHistory;

    // Filtrar por busca
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(qr => 
        qr.pixKeyName.toLowerCase().includes(lowercaseQuery) ||
        qr.description.toLowerCase().includes(lowercaseQuery) ||
        qr.amount.toLowerCase().includes(lowercaseQuery) ||
        qr.pixKeyValue.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Filtrar por data
    if (selectedDate) {
      filtered = filtered.filter(qr => 
        isSameDay(new Date(qr.createdAt), selectedDate)
      );
    }

    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(qr => {
        switch (statusFilter) {
          case "pending":
            return !qr.isReceived && !qr.isCancelled;
          case "received":
            return qr.isReceived && !qr.isCancelled;
          case "cancelled":
            return qr.isCancelled;
          default:
            return true;
        }
      });
    }

    setFilteredHistory(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDateFilter = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (qrHistory.length === 0) {
    return (
      <Card className="text-center py-12 animate-fade-in">
        <CardContent>
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="pix-heading-4 mb-2">Nenhum QR Code gerado</h3>
          <p className="text-muted-foreground mb-4">
            Seus QR Codes gerados aparecerão aqui
          </p>
          <p className="text-sm text-muted-foreground">
            Gere seu primeiro QR Code para começar o histórico
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={() => {}} // Not using filter for history, just search
          placeholder="Buscar no histórico..."
          showFilter={false}
        />
        
        <DateFilter
          date={selectedDate}
          onDateChange={handleDateFilter}
        />
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Filtrar por status:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="text-xs"
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className="text-xs"
            >
              Pendente
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "received" ? "default" : "outline"}
              onClick={() => setStatusFilter("received")}
              className="text-xs"
            >
              Recebido
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              onClick={() => setStatusFilter("cancelled")}
              className="text-xs"
            >
              Cancelado
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.map((qr) => (
          <Card key={qr.id} className="animate-fade-in hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">
                      {qr.pixKeyName}
                    </h4>
                    {qr.isCancelled ? (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Cancelado
                      </Badge>
                    ) : (
                      <Badge 
                        variant={qr.isReceived ? "default" : "secondary"}
                        className={qr.isReceived ? "bg-green-100 text-green-800" : ""}
                      >
                        {qr.isReceived ? "Recebido" : "Pendente"}
                      </Badge>
                    )}
                  </div>
                  
                  {qr.isCancelled && qr.cancellationReason && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                      <span className="font-medium">Motivo:</span> {qr.cancellationReason}
                    </div>
                  )}
                  
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(qr.amount)}
                  </div>
                  
                  {qr.description && (
                    <p className="text-sm text-muted-foreground">
                      {qr.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(qr.createdAt)}</span>
                    <span className="font-mono bg-muted px-2 py-1 rounded">
                      {qr.pixKeyValue}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewQR(qr)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Ver QR
                    </Button>
                    
                    <ShareActions
                      qrCode={qr.qrCode}
                      pixCode={qr.pixCode}
                      amount={qr.amount}
                      description={qr.description}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {!qr.isCancelled && (
                      <>
                        <Button
                          size="sm"
                          variant={qr.isReceived ? "secondary" : "default"}
                          onClick={() => onUpdateReceived(qr.id, !qr.isReceived)}
                          className="flex items-center gap-1 text-xs"
                        >
                          {qr.isReceived ? (
                            <>
                              <X className="w-3 h-3" />
                              Marcar Pendente
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3" />
                              Marcar Recebido
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCancelDialog({ open: true, qr })}
                          className="flex items-center gap-1 text-xs text-destructive hover:text-destructive"
                        >
                          <Ban className="w-3 h-3" />
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (searchQuery || selectedDate || statusFilter !== "all") && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">
              Nenhum resultado encontrado
              {searchQuery && ` para "${searchQuery}"`}
              {selectedDate && ` na data selecionada`}
            </p>
          </CardContent>
        </Card>
      )}

      <CancelDialog
        qr={cancelDialog.qr}
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ open, qr: open ? cancelDialog.qr : null })}
        onConfirm={(qrId, reason) => {
          onCancelQR(qrId, reason);
          toast({
            title: "QR Code cancelado",
            description: "O QR Code foi cancelado com sucesso.",
          });
        }}
      />
    </div>
  );
};

export default QRHistoryList;