import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Check, X, Eye, Ban, Trash2 } from "lucide-react";
import { QRCodeHistory } from "@/hooks/usePixStore";
import { toast } from "@/hooks/use-toast";
import SearchAndFilter from "./SearchAndFilter";
import ShareActions from "./ShareActions";
import CancelDialog from "./CancelDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import DateFilter from "./DateFilter";
import { isSameDay } from "date-fns";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";

interface QRHistoryListProps {
  qrHistory: QRCodeHistory[];
  onUpdateReceived: (id: string, isReceived: boolean) => void | Promise<void>;
  onCancelQR: (id: string, reason: string) => void | Promise<void>;
  onViewQR: (qr: QRCodeHistory) => void;
  onDeleteQR: (id: string) => void | Promise<void>;
  isLoading?: boolean;
}

const QRHistoryList = ({ qrHistory, onUpdateReceived, onCancelQR, onViewQR, onDeleteQR, isLoading = false }: QRHistoryListProps) => {
  const [filteredHistory, setFilteredHistory] = useState<QRCodeHistory[]>(qrHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "received" | "cancelled">("all");
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; qr: QRCodeHistory | null }>({
    open: false,
    qr: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; qr: QRCodeHistory | null }>({
    open: false,
    qr: null,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const applyFilters = useCallback(() => {
    let filtered = qrHistory;
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(qr => 
        qr.pixKeyName.toLowerCase().includes(lowercaseQuery) ||
        qr.description.toLowerCase().includes(lowercaseQuery) ||
        qr.amount.toLowerCase().includes(lowercaseQuery) ||
        qr.pixKeyValue.toLowerCase().includes(lowercaseQuery)
      );
    }
    if (selectedDate) {
      filtered = filtered.filter(qr => 
        isSameDay(new Date(qr.createdAt), selectedDate)
      );
    }
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
  }, [qrHistory, searchQuery, selectedDate, statusFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleDateFilter = (date: Date | undefined) => setSelectedDate(date);

  const formatCurrency = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(value));
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-64" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
        <SearchAndFilter onSearch={handleSearch} onFilter={() => {}} placeholder="Buscar no histórico..." showFilter={false} />
        <DateFilter date={selectedDate} onDateChange={handleDateFilter} />
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center">Filtrar por status:</span>
          <div className="flex flex-wrap gap-2 min-w-0">
            <Button size="sm" variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")} className="text-xs">Todos</Button>
            <Button size="sm" variant={statusFilter === "pending" ? "default" : "outline"} onClick={() => setStatusFilter("pending")} className="text-xs">Pendente</Button>
            <Button size="sm" variant={statusFilter === "received" ? "default" : "outline"} onClick={() => setStatusFilter("received")} className="text-xs">Recebido</Button>
            <Button size="sm" variant={statusFilter === "cancelled" ? "default" : "outline"} onClick={() => setStatusFilter("cancelled")} className="text-xs">Cancelado</Button>
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
                    <h4 className="font-semibold text-foreground">{qr.pixKeyName}</h4>
                    {qr.isCancelled ? (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">Cancelado</Badge>
                    ) : (
                      <Badge variant={qr.isReceived ? "default" : "secondary"} className={qr.isReceived ? "bg-green-100 text-green-800" : ""}>
                        {qr.isReceived ? "Recebido" : "Pendente"}
                      </Badge>
                    )}
                  </div>

                  {qr.isCancelled && qr.cancellationReason && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                      <span className="font-medium">Motivo:</span> {qr.cancellationReason}
                    </div>
                  )}

                  <div className="text-2xl font-bold text-primary">{formatCurrency(qr.amount)}</div>

                  {qr.description && <p className="text-sm text-muted-foreground">{qr.description}</p>}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(qr.createdAt)}</span>
                    <span className="font-mono bg-muted px-2 py-1 rounded">{qr.pixKeyValue}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => onViewQR(qr)} className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Ver QR
                    </Button>

                    <ShareActions qrCode={qr.qrCode} pixCode={qr.pixCode} amount={qr.amount} description={qr.description} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!qr.isCancelled && (
                      <>
                        <LoadingButton
                          size="sm"
                          variant={qr.isReceived ? "secondary" : "default"}
                          onClick={async () => {
                            setUpdatingId(qr.id);
                            try {
                              await Promise.resolve(onUpdateReceived(qr.id, !qr.isReceived));
                            } finally {
                              setUpdatingId(null);
                            }
                          }}
                          className="flex items-center gap-1 text-xs"
                          loading={updatingId === qr.id}
                          loadingText={qr.isReceived ? "Marcando..." : "Marcando..."}
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
                        </LoadingButton>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCancelDialog({ open: true, qr })}
                          className="flex items-center gap-1 text-xs text-destructive hover:text-destructive"
                          disabled={updatingId === qr.id}
                        >
                          <Ban className="w-3 h-3" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteDialog({ open: true, qr })}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      disabled={updatingId === qr.id}
                    >
                      <Trash2 className="w-3 h-3" />
                      Excluir
                    </Button>
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
        onConfirm={async (qrId, reason) => {
          // Trava ações concorrentes enquanto cancela
          setUpdatingId(qrId);
          try {
            await Promise.resolve(onCancelQR(qrId, reason));
            toast({
              title: "QR Code cancelado",
              description: "O QR Code foi cancelado com sucesso.",
            });
          } finally {
            setUpdatingId(null);
          }
        }}
      />

      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, qr: open ? deleteDialog.qr : null })}
        title="Excluir do histórico"
        description="Esta ação removerá este QR Code do histórico. Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Voltar"
        variant="destructive"
        onConfirm={() => {
          if (deleteDialog.qr) {
            Promise.resolve(onDeleteQR(deleteDialog.qr.id));
            toast({
              title: "QR Code removido",
              description: "O item foi excluído do histórico.",
            });
          }
        }}
      />
    </div>
  );
};

export default QRHistoryList;