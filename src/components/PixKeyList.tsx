
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share, QrCode, Star, Trash2 } from "lucide-react";
import { PixKey } from "./PixKeyForm";
import SearchAndFilter from "./SearchAndFilter";
import ConfirmationDialog from "./ConfirmationDialog";
import ShareActions from "./ShareActions";

interface PixKeyListProps {
  keys: PixKey[];
  onDeleteKey: (id: string) => void;
  onGenerateQR: (key: PixKey) => void;
  onSetPrimary: (id: string) => void;
}

const PixKeyList = ({ keys, onDeleteKey, onGenerateQR, onSetPrimary }: PixKeyListProps) => {
  const [filteredKeys, setFilteredKeys] = useState<PixKey[]>(keys);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; keyId: string; keyName: string }>({
    open: false,
    keyId: '',
    keyName: ''
  });

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredKeys(keys);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = keys.filter(key => 
      key.label.toLowerCase().includes(lowercaseQuery) ||
      key.value.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredKeys(filtered);
  };

  const handleFilter = (type: string) => {
    if (!type || type === 'all') {
      setFilteredKeys(keys);
      return;
    }
    
    const filtered = keys.filter(key => key.type === type);
    setFilteredKeys(filtered);
  };

  const handleDeleteClick = (key: PixKey) => {
    setDeleteConfirm({
      open: true,
      keyId: key.id,
      keyName: key.label
    });
  };

  const handleConfirmDelete = () => {
    onDeleteKey(deleteConfirm.keyId);
    setDeleteConfirm({ open: false, keyId: '', keyName: '' });
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

  // Update filtered keys when keys prop changes
  useEffect(() => {
    setFilteredKeys(keys);
  }, [keys]);

  if (keys.length === 0) {
    return (
      <Card className="text-center py-12 animate-fade-in">
        <CardContent>
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="pix-heading-4 mb-2">Nenhuma chave Pix cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Suas chaves Pix aparecerão aqui
          </p>
          <p className="text-sm text-muted-foreground">
            Cadastre sua primeira chave para começar a receber pagamentos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        placeholder="Buscar chaves Pix..."
      />

      <div className="space-y-4">
        {filteredKeys.map((key) => (
          <Card key={key.id} className={`animate-fade-in hover:shadow-md transition-shadow ${key.isPrimary ? 'ring-2 ring-primary/30' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getTypeColor(key.type)}>
                      {getTypeLabel(key.type)}
                    </Badge>
                    <span className="font-medium text-foreground">{key.label}</span>
                    {key.isPrimary && (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Star className="w-3 h-3 mr-1" />
                        Principal
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {maskValue(key.type, key.value)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Criada em {new Date(key.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    onClick={() => onGenerateQR(key)}
                    variant="gradient"
                    className="text-xs px-2 py-1"
                  >
                    <QrCode className="w-3 h-3 mr-1" />
                    QR Code
                  </Button>
                  
                  {!key.isPrimary && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSetPrimary(key.id)}
                      className="text-xs px-2 py-1"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Principal
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClick(key)}
                    className="text-xs px-2 py-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredKeys.length === 0 && keys.length > 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">
              Nenhuma chave encontrada com os critérios de busca
            </p>
          </CardContent>
        </Card>
      )}

      <ConfirmationDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Excluir chave Pix"
        description={`Tem certeza que deseja excluir a chave "${deleteConfirm.keyName}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default PixKeyList;
