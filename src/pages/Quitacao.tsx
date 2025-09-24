import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, CreditCard, Calendar, User, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Parcela {
  id: number;
  lancamentoId: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  usuario: string;
  cartao: string;
  parcelaAtual: number;
  totalParcelas: number;
  paga: boolean;
  categoria: string;
}

export default function Quitacao() {
  const [parcelas, setParcelas] = useState<Parcela[]>([
    {
      id: 1,
      lancamentoId: 1,
      descricao: "TV Samsung 55\"",
      valor: 416.67,
      dataVencimento: "2024-02-15",
      usuario: "João",
      cartao: "Nubank",
      parcelaAtual: 1,
      totalParcelas: 12,
      paga: false,
      categoria: "Casa"
    },
    {
      id: 2,
      lancamentoId: 1,
      descricao: "TV Samsung 55\"",
      valor: 416.67,
      dataVencimento: "2024-03-15",
      usuario: "João",
      cartao: "Nubank",
      parcelaAtual: 2,
      totalParcelas: 12,
      paga: false,
      categoria: "Casa"
    },
    {
      id: 3,
      lancamentoId: 2,
      descricao: "Curso Online",
      valor: 299.00,
      dataVencimento: "2024-02-05",
      usuario: "Maria",
      cartao: "Itaú",
      parcelaAtual: 1,
      totalParcelas: 3,
      paga: false,
      categoria: "Lazer"
    }
  ]);

  const [mostrarApenasAbertas, setMostrarApenasAbertas] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const quitarParcela = (parcelaId: number) => {
    setParcelas(parcelas.map(parcela => 
      parcela.id === parcelaId 
        ? { ...parcela, paga: true }
        : parcela
    ));
    
    const parcela = parcelas.find(p => p.id === parcelaId);
    toast({
      title: "Parcela quitada!",
      description: `${parcela?.descricao} - Parcela ${parcela?.parcelaAtual} foi marcada como paga.`,
    });
  };

  const quitarTodasParcelas = (lancamentoId: number) => {
    setParcelas(parcelas.map(parcela => 
      parcela.lancamentoId === lancamentoId && !parcela.paga
        ? { ...parcela, paga: true }
        : parcela
    ));

    const parcela = parcelas.find(p => p.lancamentoId === lancamentoId);
    toast({
      title: "Fatura quitada!",
      description: `Todas as parcelas de "${parcela?.descricao}" foram marcadas como pagas.`,
    });
  };

  const parcelasAgrupadas = parcelas.reduce((grupos, parcela) => {
    const key = `${parcela.lancamentoId}`;
    if (!grupos[key]) {
      grupos[key] = [];
    }
    grupos[key].push(parcela);
    return grupos;
  }, {} as Record<string, Parcela[]>);

  const parcelasFiltradas = mostrarApenasAbertas 
    ? parcelas.filter(p => !p.paga)
    : parcelas;

  const getStatusVencimento = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "vencida", dias: Math.abs(diffDays) };
    if (diffDays <= 5) return { status: "vencendo", dias: diffDays };
    return { status: "normal", dias: diffDays };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quitação</h1>
          <p className="text-muted-foreground">
            Gerencie o pagamento de faturas e parcelas
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="mostrar-abertas">Apenas em aberto</Label>
          <Switch
            id="mostrar-abertas"
            checked={mostrarApenasAbertas}
            onCheckedChange={setMostrarApenasAbertas}
          />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total em Aberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(
                parcelas
                  .filter(p => !p.paga)
                  .reduce((total, p) => total + p.valor, 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parcelas Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {parcelas.filter(p => !p.paga && getStatusVencimento(p.dataVencimento).status === "vencida").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vencendo em 5 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {parcelas.filter(p => !p.paga && getStatusVencimento(p.dataVencimento).status === "vencendo").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Parcelas Agrupadas */}
      <div className="space-y-4">
        {Object.entries(parcelasAgrupadas).map(([lancamentoId, parcelasGrupo]) => {
          const parcelasGrupoFiltradas = parcelasGrupo.filter(p => 
            mostrarApenasAbertas ? !p.paga : true
          );
          
          if (parcelasGrupoFiltradas.length === 0) return null;

          const temParcelasAbertas = parcelasGrupo.some(p => !p.paga);
          const todasParcelasPagas = parcelasGrupo.every(p => p.paga);
          
          return (
            <Card key={lancamentoId} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{parcelasGrupoFiltradas[0]?.descricao}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {parcelasGrupo.length} parcelas • {parcelasGrupoFiltradas[0]?.cartao}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={todasParcelasPagas ? "default" : "secondary"}>
                      {todasParcelasPagas ? "Quitada" : "Em aberto"}
                    </Badge>
                    
                    {temParcelasAbertas && (
                      <Button
                        onClick={() => quitarTodasParcelas(parseInt(lancamentoId))}
                        className="bg-gradient-primary"
                        size="sm"
                      >
                        Quitar Fatura
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {parcelasGrupoFiltradas.map((parcela) => {
                    const statusVencimento = getStatusVencimento(parcela.dataVencimento);
                    
                    return (
                      <div
                        key={parcela.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          parcela.paga 
                            ? "bg-muted/50 border-muted" 
                            : statusVencimento.status === "vencida"
                            ? "bg-destructive/10 border-destructive/20"
                            : statusVencimento.status === "vencendo"
                            ? "bg-warning/10 border-warning/20"
                            : "bg-background border-border"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              Parcela {parcela.parcelaAtual}/{parcela.totalParcelas}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(parcela.dataVencimento)}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatCurrency(parcela.valor)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{parcela.usuario}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!parcela.paga && statusVencimento.status === "vencida" && (
                            <Badge variant="destructive" className="text-xs">
                              Vencida há {statusVencimento.dias} dias
                            </Badge>
                          )}
                          
                          {!parcela.paga && statusVencimento.status === "vencendo" && (
                            <Badge variant="outline" className="text-xs border-warning text-warning">
                              Vence em {statusVencimento.dias} dias
                            </Badge>
                          )}
                          
                          {parcela.paga ? (
                            <Badge variant="default" className="bg-income">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Paga
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => quitarParcela(parcela.id)}
                              variant="outline"
                              size="sm"
                            >
                              Quitar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {parcelasFiltradas.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-income mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {mostrarApenasAbertas ? "Nenhuma parcela em aberto!" : "Nenhuma parcela encontrada"}
            </h3>
            <p className="text-muted-foreground">
              {mostrarApenasAbertas 
                ? "Todas as suas parcelas estão em dia." 
                : "Não há parcelas cadastradas no sistema."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}