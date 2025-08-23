import { Settings, User, Key, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Configuracoes = () => {
  return (
    <>
      <div className="text-center mb-8">
          <Settings className="w-12 h-12 text-pix-green mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e conta</p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Perfil */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-pix-green" />
              <h2 className="text-xl font-semibold text-gray-900">Perfil</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pix-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pix-green"
                />
              </div>
            </div>
          </div>

          {/* Chaves Pix */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-pix-green" />
              <h2 className="text-xl font-semibold text-gray-900">Chaves Pix</h2>
            </div>
            <Button className="w-full bg-pix-green hover:bg-pix-green/90">
              Gerenciar Chaves Pix
            </Button>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-6 h-6 text-pix-green" />
              <h2 className="text-xl font-semibold text-gray-900">Notificações</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-pix-green focus:ring-pix-green" />
                <span className="ml-2 text-gray-700">Notificações de pagamento</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-pix-green focus:ring-pix-green" />
                <span className="ml-2 text-gray-700">Alertas de segurança</span>
              </label>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-pix-green" />
              <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
            </div>
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
          </div>
        </div>
    </>
  );
};

export default Configuracoes;