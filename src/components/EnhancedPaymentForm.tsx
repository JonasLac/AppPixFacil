import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuickAmountButtons from "./QuickAmountButtons";

interface EnhancedPaymentFormProps {
  onGenerateQR: (amount: string, description: string) => void;
}

const EnhancedPaymentForm = ({ onGenerateQR }: EnhancedPaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleAddQuickAmount = (quickAmount: number) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = currentAmount + quickAmount;
    setAmount(newAmount.toFixed(2));
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido",
        variant: "destructive",
      });
      return;
    }

    onGenerateQR(amount, description);
  };

  return (
    <div className="space-y-4">
      <QuickAmountButtons onAddAmount={handleAddQuickAmount} />
      
      <Card className="pix-card">
        <CardHeader>
          <CardTitle className="text-lg">Dados do Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="text-lg font-medium"
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

          <Button
            onClick={handleSubmit}
            className="w-full bg-pix-gradient hover:bg-pix-green-dark text-base sm:text-lg py-4 sm:py-6 min-h-[3rem] sm:min-h-[3.5rem]"
            disabled={!amount}
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Gerar QR Code</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPaymentForm;