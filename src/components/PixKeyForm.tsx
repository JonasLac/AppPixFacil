
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

export interface PixKey {
  id: string;
  type: string;
  value: string;
  label: string;
  isPrimary?: boolean;
  createdAt: string;
}

interface PixKeyFormProps {
  onSave: (pixKey: Omit<PixKey, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
  initialKey?: PixKey | null;
  onUpdate?: (id: string, pixKey: Omit<PixKey, 'id' | 'createdAt'>) => void;
}

const PixKeyForm = ({ onSave, onCancel, mode = 'create', initialKey = null, onUpdate }: PixKeyFormProps) => {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    if (initialKey) {
      setType(initialKey.type ?? "");
      setValue(initialKey.value ?? "");
      setLabel(initialKey.label ?? "");
      setIsPrimary(Boolean(initialKey.isPrimary));
    } else {
      setType("");
      setValue("");
      setLabel("");
      setIsPrimary(false);
    }
  }, [initialKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !value || !label) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validação básica do valor baseado no tipo
    if (type === "email" && !value.includes("@")) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive",
      });
      return;
    }

    if (type === "cpf" && value.replace(/\D/g, "").length !== 11) {
      toast({
        title: "Erro",
        description: "CPF deve ter 11 dígitos",
        variant: "destructive",
      });
      return;
    }

    if (type === "phone" && value.replace(/\D/g, "").length < 10) {
      toast({
        title: "Erro",
        description: "Telefone inválido",
        variant: "destructive",
      });
      return;
    }

    const payload = { type, value, label, isPrimary };

    if (mode === 'edit' && initialKey && onUpdate) {
      onUpdate(initialKey.id, payload);
      toast({
        title: "✅ Chave atualizada",
        description: "As alterações foram salvas com sucesso",
      });
    } else {
      onSave(payload);
      toast({
        title: "Sucesso!",
        description: "Chave Pix cadastrada com sucesso",
      });
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "cpf":
        return "000.000.000-00";
      case "cnpj":
        return "00.000.000/0000-00";
      case "email":
        return "seu@email.com";
      case "phone":
        return "(11) 99999-9999";
      case "random":
        return "Chave aleatória (UUID)";
      default:
        return "Digite sua chave Pix";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">{mode === 'edit' ? 'Editar Chave Pix' : 'Nova Chave Pix'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Chave</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="random">Chave Aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Valor da Chave</Label>
            <Input
              id="value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getPlaceholder()}
            />
          </div>

          <div>
            <Label htmlFor="label">Nome/Descrição</Label>
            <Input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Conta Principal, Trabalho, etc."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPrimary" 
              checked={isPrimary}
              onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
            />
            <Label htmlFor="isPrimary" className="text-sm font-medium">
              Definir como chave principal
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="w-full sm:flex-1 bg-pix-gradient hover:bg-pix-green-dark">
              {mode === 'edit' ? 'Salvar alterações' : 'Salvar Chave'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PixKeyForm;
