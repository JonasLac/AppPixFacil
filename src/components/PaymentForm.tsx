
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentFormProps {
  onGenerateQR: (amount: string, description: string) => void;
}

const PaymentForm = ({ onGenerateQR }: PaymentFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Padroniza para 2 casas decimais para manter consistência
      const formattedAmount = parseFloat(amount).toFixed(2);
      onGenerateQR(formattedAmount, description);
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          loadingText="Gerando..."
          className="w-full bg-pix-gradient hover:bg-pix-green-dark text-lg py-6"
          disabled={!amount}
        >
          <QrCode className="w-5 h-5 mr-2" />
          Gerar QR Code Pix
        </LoadingButton>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
