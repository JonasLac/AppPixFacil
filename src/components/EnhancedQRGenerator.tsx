import { useState, useRef, useEffect } from "react";
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
  const qrSectionRef = useRef<HTMLDivElement | null>(null);

  const handleGenerateQR = (amount: string, description: string) => {
    const brCode = generateBRCode(selectedKey, amount, description);
    const qrCodeUrl = generateQRCodeUrl(brCode);

    setQrCode(qrCodeUrl);
    setCurrentAmount(amount);
    setCurrentDescription(description);

    // Notifica app para registrar histórico/telemetria
    onQRGenerated?.({
      qrCode: qrCodeUrl,
      pixCode: brCode,
      amount,
      description,
    });

    toast({
      title: "QR Code gerado!",
      description: "Seu QR Code está pronto para pagamento",
    });
  };

  const handleNewQRCode = () => {
    setQrCode(null);
    setCurrentAmount("");
    setCurrentDescription("");
  };

  useEffect(() => {
    if (qrCode && qrSectionRef.current) {
      qrSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [qrCode]);

  const getTypeColor = (type: PixKey["type"]) => {
    switch (type) {
      case "cpf":
        return "bg-blue-100 text-blue-800";
      case "cnpj":
        return "bg-purple-100 text-purple-800";
      case "email":
        return "bg-green-100 text-green-800";
      case "phone":
        return "bg-yellow-100 text-yellow-800";
      case "random":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: PixKey["type"]) => {
    switch (type) {
      case "cpf":
        return "CPF";
      case "cnpj":
        return "CNPJ";
      case "email":
        return "E-mail";
      case "phone":
        return "Telefone";
      case "random":
        return "Aleatória";
      default:
        return type;
    }
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
        <div ref={qrSectionRef} aria-label="Seção do QR Code">
          <QRDisplay
            qrCodeUrl={qrCode}
            amount={currentAmount}
            description={currentDescription}
            selectedKey={selectedKey}
            onNewQRCode={handleNewQRCode}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedQRGenerator;