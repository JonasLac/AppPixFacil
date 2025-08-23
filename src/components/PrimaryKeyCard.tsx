
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Star } from "lucide-react";
import { PixKey } from "./PixKeyForm";

interface PrimaryKeyCardProps {
  primaryKey: PixKey;
  onGenerateQR: (key: PixKey) => void;
}

const PrimaryKeyCard = ({ primaryKey, onGenerateQR }: PrimaryKeyCardProps) => {
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

  const maskValue = (type: string, value: string) => {
    if (type === "cpf") {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
    }
    if (type === "email") {
      const [user, domain] = value.split("@");
      return `${user.charAt(0)}***@${domain}`;
    }
    if (type === "phone") {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-****");
    }
    return value;
  };

  return (
    <Card className="pix-card ring-2 ring-pix-green">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Chave Principal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Badge className={getTypeColor(primaryKey.type)}>
            {getTypeLabel(primaryKey.type)}
          </Badge>
          <div>
            <p className="font-medium">{primaryKey.label}</p>
            <p className="text-sm text-gray-600 font-mono">
              {maskValue(primaryKey.type, primaryKey.value)}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => onGenerateQR(primaryKey)}
          className="w-full bg-pix-gradient hover:bg-pix-green-dark text-lg py-4"
        >
          <QrCode className="w-5 h-5 mr-2" />
          Gerar QR Code Rapidamente
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrimaryKeyCard;
