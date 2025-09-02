import { useState, useRef, useEffect } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuickAmountButtons from "./QuickAmountButtons";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface EnhancedPaymentFormProps {
  onGenerateQR: (amount: string, description: string) => void;
}

const EnhancedPaymentForm = ({ onGenerateQR }: EnhancedPaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastGeneratedAmount, setLastGeneratedAmount] = useState<string | null>(null);

  const normalizeAmount = (val: string) => {
    const parsed = parseFloat((val || '').replace(',', '.'));
    return isNaN(parsed) ? "" : parsed.toFixed(2);
  };

  const handleAddQuickAmount = (quickAmount: number) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = currentAmount + quickAmount;
    setAmount(newAmount.toFixed(2));
  };

  const handleSubmit = async () => {
    if (loading) return;

    const parsedAmount = parseFloat((amount || '').replace(',', '.'));
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const formattedAmount = parsedAmount.toFixed(2);
      onGenerateQR(formattedAmount, description);
      setLastGeneratedAmount(formattedAmount);
      // Removido toast de sucesso aqui para evitar duplicação com EnhancedQRGenerator
    } finally {
      setLoading(false);
    }
  };

  const isBlockedAfterGeneration =
    !!lastGeneratedAmount && normalizeAmount(amount) === lastGeneratedAmount;

  return (
    <div className="animate-fade-in">
      <Card className="pix-card">
        <CardHeader>
          <CardTitle className="text-lg">Dados do Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="text-base sm:text-lg font-medium"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pagamento de serviço, produto..."
              maxLength={100}
            />
          </div>

          <QuickAmountButtons onAddAmount={handleAddQuickAmount} />

          <Tooltip>
            <TooltipTrigger asChild>
              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                loadingText="Gerando..."
                className="w-full bg-pix-gradient hover:bg-pix-green-dark text-base sm:text-lg py-4 sm:py-6 min-h-[3rem] sm:min-h-[3.5rem] min-w-0"
                disabled={!amount || isBlockedAfterGeneration}
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate max-w-full">Gerar QR Code</span>
              </LoadingButton>
            </TooltipTrigger>
            <TooltipContent>Gerar QR Code</TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPaymentForm;