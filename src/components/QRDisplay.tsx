
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share } from "lucide-react";
import { PixKey } from "./PixKeyForm";
import { toast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";

interface QRDisplayProps {
  qrCodeUrl: string;
  amount: string;
  description: string;
  selectedKey: PixKey;
  onNewQRCode: () => void;
}

const QRDisplay = ({ qrCodeUrl, amount, description, selectedKey, onNewQRCode }: QRDisplayProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    // Reset loading state when a new QR is generated
    setImageLoading(true);
  }, [qrCodeUrl]);

  const shareQRCode = async () => {
    const shareData = {
      title: "QR Code Pix",
      text: `Pagamento Pix - R$ ${amount}${description ? ` - ${description}` : ''}`,
      url: qrCodeUrl,
    };

    try {
      setSharing(true);
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Compartilhado!",
          description: "QR Code compartilhado com sucesso",
        });
      } else {
        // Fallback para copiar link da imagem
        await navigator.clipboard.writeText(qrCodeUrl);
        toast({
          title: "Link copiado!",
          description: "O link do QR Code foi copiado para a área de transferência",
        });
      }
    } catch (error) {
      // Se falhar, copia o link como fallback
      try {
        await navigator.clipboard.writeText(qrCodeUrl);
        toast({
          title: "Link copiado!",
          description: "O link do QR Code foi copiado para a área de transferência",
        });
      } catch (clipboardError) {
        toast({
          title: "Erro ao compartilhar",
          description: "Não foi possível compartilhar ou copiar o QR Code",
          variant: "destructive",
        });
      }
    } finally {
      setSharing(false);
    }
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

  return (
    <Card className="pix-card text-center">
      <CardHeader>
        <CardTitle className="text-lg">QR Code Gerado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
          {imageLoading && (
            <div className="flex flex-col items-center justify-center w-64 h-64">
              <Skeleton className="w-64 h-64 rounded" />
              <span className="mt-3 text-sm text-muted-foreground">Gerando QR...</span>
            </div>
          )}
          <img
            src={qrCodeUrl}
            alt="QR Code Pix"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            className={`w-64 h-64 mx-auto ${imageLoading ? 'hidden' : 'block'}`}
          />
        </div>
        
        <div className="bg-pix-gradient-light p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Dados do pagamento:</p>
          <p className="font-bold text-lg">R$ {parseFloat(amount).toFixed(2)}</p>
          {description && <p className="text-sm text-gray-600">{description}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Chave: {selectedKey.label} ({getTypeLabel(selectedKey.type)})
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <LoadingButton 
            onClick={shareQRCode}
            loading={sharing}
            loadingText="Compartilhando..."
            className="w-full sm:flex-1 bg-pix-gradient hover:bg-pix-green-dark"
          >
            <Share className="w-4 h-4 mr-2" />
            Compartilhar
          </LoadingButton>
          <Button 
            variant="outline" 
            onClick={onNewQRCode}
            className="w-full sm:flex-1"
            disabled={sharing}
          >
            Novo QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRDisplay;
