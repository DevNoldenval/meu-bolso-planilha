import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, CreditCard, AlertTriangle } from "lucide-react";

interface CartaoInfo {
  nome: string;
  ultimosDigitos: string;
  limite: number;
  utilizado: number;
  prestacoesPendentes: number;
}

interface PrevisaoMensal {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export default function FinancialSummary() {
  // Mock data - será substituído por dados reais do Google Sheets
  const cartoes: CartaoInfo[] = [
    { nome: "Nubank", ultimosDigitos: "1234", limite: 5000, utilizado: 1250, prestacoesPendentes: 8 },
    { nome: "Itaú", ultimosDigitos: "9876", limite: 3000, utilizado: 2100, prestacoesPendentes: 12 }
  ];

  const previsaoProximosMeses: PrevisaoMensal[] = [
    { mes: "Fev/24", receitas: 8500, despesas: 4200, saldo: 4300 },
    { mes: "Mar/24", receitas: 8500, despesas: 3800, saldo: 4700 },
    { mes: "Abr/24", receitas: 8500, despesas: 4500, saldo: 4000 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPercentualUso = (utilizado: number, limite: number) => {
    return limite > 0 ? (utilizado / limite) * 100 : 0;
  };

  const getMelhorCartao = () => {
    return cartoes.reduce((melhor, cartao) => {
      const percentualAtual = getPercentualUso(cartao.utilizado, cartao.limite);
      const percentualMelhor = getPercentualUso(melhor.utilizado, melhor.limite);
      return percentualAtual < percentualMelhor ? cartao : melhor;
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Análise de Cartões */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Análise de Cartões</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartoes.map((cartao) => {
            const percentual = getPercentualUso(cartao.utilizado, cartao.limite);
            const disponivel = cartao.limite - cartao.utilizado;
            
            return (
              <div key={cartao.nome} className="p-4 bg-gradient-card rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{cartao.nome} *{cartao.ultimosDigitos}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cartao.prestacoesPendentes} prestações pendentes
                    </p>
                  </div>
                  <Badge variant={percentual > 80 ? "destructive" : percentual > 60 ? "default" : "secondary"}>
                    {percentual.toFixed(0)}% usado
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disponível</span>
                    <span className="font-medium text-income">
                      {formatCurrency(disponivel)}
                    </span>
                  </div>
                  <Progress value={percentual} className="h-2" />
                </div>
              </div>
            );
          })}
          
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium text-primary">
              💡 Melhor cartão para usar: {getMelhorCartao().nome} *{getMelhorCartao().ultimosDigitos}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Menor percentual de uso ({getPercentualUso(getMelhorCartao().utilizado, getMelhorCartao().limite).toFixed(0)}%)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Previsão Financeira */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-income" />
            <span>Previsão dos Próximos Meses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previsaoProximosMeses.map((previsao) => (
              <div key={previsao.mes} className="p-4 bg-gradient-card rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">{previsao.mes}</h4>
                  <Badge variant={previsao.saldo > 0 ? "secondary" : "destructive"}>
                    {previsao.saldo > 0 ? "Positivo" : "Negativo"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 text-income mx-auto mb-1" />
                    <p className="text-income font-medium">
                      {formatCurrency(previsao.receitas)}
                    </p>
                    <p className="text-muted-foreground">Receitas</p>
                  </div>
                  
                  <div className="text-center">
                    <TrendingDown className="h-4 w-4 text-expense mx-auto mb-1" />
                    <p className="text-expense font-medium">
                      {formatCurrency(previsao.despesas)}
                    </p>
                    <p className="text-muted-foreground">Despesas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`h-4 w-4 mx-auto mb-1 ${previsao.saldo > 0 ? 'text-income' : 'text-expense'}`}>
                      {previsao.saldo > 0 ? <TrendingUp className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <p className={`font-medium ${previsao.saldo > 0 ? 'text-income' : 'text-expense'}`}>
                      {formatCurrency(previsao.saldo)}
                    </p>
                    <p className="text-muted-foreground">Saldo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-income/10 rounded-lg">
            <p className="text-sm font-medium text-income">
              📈 Melhor mês para compras: Mar/24
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maior saldo previsto ({formatCurrency(4700)})
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}