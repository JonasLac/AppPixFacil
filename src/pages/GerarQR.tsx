import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const GerarQR = () => {
  return (
    <>
      <div className="text-center mb-8">
          <QrCode className="w-12 h-12 text-pix-green mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerar QR Code</h1>
          <p className="text-gray-600">Crie um QR Code para receber pagamentos Pix</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                placeholder="0,00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pix-green"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <input
                type="text"
                placeholder="Descrição do pagamento"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pix-green"
              />
            </div>
            
            <Button className="w-full bg-pix-green hover:bg-pix-green/90">
              Gerar QR Code
            </Button>
          </div>
        </div>
    </>
  );
};

export default GerarQR;