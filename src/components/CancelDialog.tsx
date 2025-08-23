import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, AlertTriangle } from "lucide-react";
import { QRCodeHistory } from "@/hooks/usePixStore";

interface CancelDialogProps {
  qr: QRCodeHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (qrId: string, reason: string) => void;
}

const CancelDialog = ({ qr, open, onOpenChange, onConfirm }: CancelDialogProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!qr || !reason.trim()) return;
    onConfirm(qr.id, reason.trim());
    setReason("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  if (!qr) return null;

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle>Cancelar QR Code</DialogTitle>
          </div>
          <DialogDescription>
            Você está prestes a cancelar este QR Code. Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="font-semibold">{qr.pixKeyName}</div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(qr.amount)}
            </div>
            {qr.description && (
              <div className="text-sm text-muted-foreground">
                {qr.description}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do cancelamento *</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Cliente desistiu da compra, erro no valor, pagamento duplicado..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Descreva brevemente o motivo do cancelamento
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!reason.trim()}
              className="flex-1"
            >
              Confirmar Cancelamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;