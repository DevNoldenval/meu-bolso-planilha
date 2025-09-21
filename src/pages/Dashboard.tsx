import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import FinancialSummary from "@/components/FinancialSummary";
import heroImage from "@/assets/finance-hero.jpg";

export default function Dashboard() {
  // Mock data - will be replaced with real data from Google Sheets
  const mockData = {
    saldoTotal: 15750.80,
    receitaMes: 8500.00,
    despesaMes: 3200.50,
    ultimasMovimentacoes: [
      { id: 1, tipo: 'receita', descricao: 'Salário', valor: 5000.00, data: '2024-01-15', usuario: 'João' },
      { id: 2, tipo: 'despesa', descricao: 'Supermercado', valor: -350.75, data: '2024-01-14', usuario: 'Maria' },
      { id: 3, tipo: 'despesa', descricao: 'Combustível', valor: -180.00, data: '2024-01-13', usuario: 'João' },
      { id: 4, tipo: 'receita', descricao: 'Freelance', valor: 1200.00, data: '2024-01-12', usuario: 'João' },
    ]
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Bem-vindo ao FinanceApp</h1>
          <p className="text-xl opacity-90 mb-6">
            Controle total das suas finanças com integração ao Google Planilhas
          </p>
          <Button variant="secondary" size="lg" className="shadow-elegant">
            <Plus className="mr-2 h-5 w-5" />
            Novo Lançamento
          </Button>
        </div>
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(mockData.saldoTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo disponível em todas as contas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-income" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              {formatCurrency(mockData.receitaMes)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesa do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(mockData.despesaMes)}
            </div>
            <p className="text-xs text-muted-foreground">
              -5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Últimas Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.ultimasMovimentacoes.map((movimento) => (
              <div key={movimento.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card">
                <div className="flex items-center space-x-4">
                  {movimento.tipo === 'receita' ? (
                    <ArrowUpCircle className="h-6 w-6 text-income" />
                  ) : (
                    <ArrowDownCircle className="h-6 w-6 text-expense" />
                  )}
                  <div>
                    <p className="font-medium">{movimento.descricao}</p>
                    <p className="text-sm text-muted-foreground">
                      {movimento.usuario} • {new Date(movimento.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${movimento.tipo === 'receita' ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(Math.abs(movimento.valor))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Analysis */}
      <FinancialSummary />
    </div>
  );
}