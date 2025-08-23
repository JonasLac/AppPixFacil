
import { Clock, CheckCircle, XCircle } from "lucide-react";

const Historico = () => {
  const mockTransactions = [
    {
      id: "1",
      description: "Pagamento recebido",
      value: "R$ 150,00",
      date: "12/08/2025 - 14:30",
      status: "completed",
    },
    {
      id: "2", 
      description: "Pagamento enviado",
      value: "R$ 25,50",
      date: "11/08/2025 - 09:15",
      status: "completed",
    },
    {
      id: "3",
      description: "Pagamento pendente",
      value: "R$ 75,00",
      date: "10/08/2025 - 16:45",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Clock className="w-12 h-12 text-pix-green mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico</h1>
          <p className="text-gray-600">Acompanhe suas transações Pix</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {transaction.status === "completed" ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{transaction.value}</p>
                    <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Historico;