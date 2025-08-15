
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusIcon, getStatusColor, getStatusText } from "./utils/financialUtils";

interface AccountPayable {
  id: number;
  supplier: string;
  amount: number;
  dueDate: string;
  status: string;
  category: string;
}

interface AccountsPayableTabProps {
  accountsPayable: AccountPayable[];
}

const AccountsPayableTab = ({ accountsPayable }: AccountsPayableTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Pagar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Fornecedor</th>
                <th className="text-left p-4">Valor</th>
                <th className="text-left p-4">Vencimento</th>
                <th className="text-left p-4">Categoria</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {accountsPayable.map((account) => {
                const StatusIcon = getStatusIcon(account.status);
                return (
                  <tr key={account.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{account.supplier}</td>
                    <td className="p-4">R$ {account.amount.toLocaleString()}</td>
                    <td className="p-4">{new Date(account.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-blue-modern/30 text-blue-modern">{account.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4 text-green-modern" />
                        <Badge className={getStatusColor(account.status)}>
                          {getStatusText(account.status)}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsPayableTab;
