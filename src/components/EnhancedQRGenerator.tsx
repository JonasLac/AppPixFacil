import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PixKey } from "./PixKeyForm";
import { generateBRCode, generateQRCodeUrl } from "@/utils/pixBRCodeGenerator";
import EnhancedPaymentForm from "./EnhancedPaymentForm";
import QRDisplay from "./QRDisplay";
import { toast } from "@/hooks/use-toast";

interface EnhancedQRGeneratorProps {
  selectedKey: PixKey;
  onBack: () => void;
  onQRGenerated?: (qrData: {
    qrCode: string;
    pixCode: string;
    amount: string;
    description: string;
  }) => void;
}

const EnhancedQRGenerator = ({ selectedKey, onBack, onQRGenerated }: EnhancedQRGeneratorProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [currentAmount, setCurrentAmount] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  const handleGenerateQR = (amount: string, description: string) => {
    const brCode = generateBRCode(selectedKey, amount, description);
    console.log("BR Code gerado:", brCode);
    console.log("Tamanho do BR Code:", brCode.length);
    
    const qrCodeUrl = generateQRCodeUrl(brCode);
    
    setQrCode(qrCodeUrl);
    setCurrentAmount(amount);
    setCurrentDescription(description);
    
    // Chama o callback para salvar no histórico
    if (onQRGenerated) {
      onQRGenerated({
        qrCode: qrCodeUrl,
        pixCode: brCode,
        amount,
        description
      });
    }
    
    toast({
      title: "✅ QR Code gerado com sucesso!",
      description: "Seu QR Code foi criado e adicionado ao histórico",
    });
  };

  const handleNewQRCode = () => {
    setQrCode(null);
    setCurrentAmount("");
    setCurrentDescription("");
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      cpf: "CPF",
      cnpj: "CNPJ", 
      email: "Email",
      phone: "Telefone",
      random: "Aleatória"
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      cpf: "bg-blue-100 text-blue-800",
      cnpj: "bg-purple-100 text-purple-800",
      email: "bg-green-100 text-green-800", 
      phone: "bg-orange-100 text-orange-800",
      random: "bg-gray-100 text-gray-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="pix-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chave Selecionada</CardTitle>
            <Button variant="outline" size="sm" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Badge className={getTypeColor(selectedKey.type)}>
              {getTypeLabel(selectedKey.type)}
            </Badge>
            <div>
              <p className="font-medium">{selectedKey.label}</p>
              <p className="text-sm text-gray-600 font-mono">{selectedKey.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EnhancedPaymentForm onGenerateQR={handleGenerateQR} />

      {qrCode && (
        <QRDisplay
          qrCodeUrl={qrCode}
          amount={currentAmount}
          description={currentDescription}
          selectedKey={selectedKey}
          onNewQRCode={handleNewQRCode}
        />
      )}
    </div>
  );
};

export default EnhancedQRGenerator;