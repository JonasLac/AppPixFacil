import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share, Copy, Link, FileText, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareActionsProps {
  qrCode?: string;
  pixCode?: string;
  amount?: string;
  description?: string;
  showQRShare?: boolean;
}

const ShareActions = ({ 
  qrCode, 
  pixCode, 
  amount, 
  description, 
  showQRShare = true 
}: ShareActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const copyPixCode = () => {
    if (pixCode) {
      copyToClipboard(pixCode, "Código Pix");
    }
  };

  const copyPixLink = () => {
    if (pixCode) {
      const pixLink = `https://nubank.com.br/pagar/${encodeURIComponent(pixCode)}`;
      copyToClipboard(pixLink, "Link Pix");
    }
  };

  const shareContent = async () => {
    const shareData = {
      title: 'Pagamento Pix',
      text: `Pagamento de ${amount ? `R$ ${amount}` : 'valor'} via Pix${description ? ` - ${description}` : ''}`,
      url: pixCode ? `https://nubank.com.br/pagar/${encodeURIComponent(pixCode)}` : undefined,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setIsOpen(false);
      } catch (error) {
        // Fallback to copy if share fails
        copyPixCode();
      }
    } else {
      copyPixCode();
    }
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `qr-code-pix-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "QR Code salvo em seus downloads",
      });
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Share className="w-3 h-3" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {pixCode && (
          <>
            <DropdownMenuItem onClick={copyPixCode} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copiar Código Pix
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyPixLink} className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Copiar Link Pix
            </DropdownMenuItem>
            <DropdownMenuItem onClick={shareContent} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Compartilhar
            </DropdownMenuItem>
          </>
        )}
        {showQRShare && qrCode && (
          <DropdownMenuItem onClick={downloadQRCode} className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Baixar QR Code
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareActions;