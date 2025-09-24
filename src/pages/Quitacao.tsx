import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, CreditCard, Calendar, AlertTriangle, DollarSign, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FaturaCartao {
  id: number;
  cartao: string;
  mesReferencia: string;
  dataVencimento: string;
  valorTotal: number;
  valorPago: number;
  status: 'fechada' | 'paga' | 'vencida';
  itens: ItemFatura[];
}

interface ItemFatura {
  id: number;
  descricao: string;
  valor: number;
  usuario: string;
  categoria: string;
  data: string;
}

interface PagamentoFatura {
  tipo: 'total' | 'parcial' | 'parcelado';
  valor: number;
  parcelas?: number;
  cartaoParcelamento?: string;
}

export default function Quitacao() {
  const [faturas, setFaturas] = useState<FaturaCartao[]>([
    {
      id: 1,
      cartao: "Nubank",
      mesReferencia: "Janeiro/2024",
      dataVencimento: "2024-02-15",
      valorTotal: 2850.00,
      valorPago: 0,
      status: 'vencida',
      itens: [
        { id: 1, descricao: "TV Samsung 55\"", valor: 2000.00, usuario: "João", categoria: "Casa", data: "2024-01-10" },
        { id: 2, descricao: "Supermercado", valor: 450.00, usuario: "Maria", categoria: "Alimentação", data: "2024-01-15" },
        { id: 3, descricao: "Combustível", valor: 400.00, usuario: "João", categoria: "Transporte", data: "2024-01-20" }
      ]
    },
    {
      id: 2,
      cartao: "Itaú",
      mesReferencia: "Janeiro/2024", 
      dataVencimento: "2024-02-10",
      valorTotal: 1200.00,
      valorPago: 0,
      status: 'vencida',
      itens: [
        { id: 4, descricao: "Curso Online", valor: 800.00, usuario: "Maria", categoria: "Lazer", data: "2024-01-05" },
        { id: 5, descricao: "Farmácia", valor: 400.00, usuario: "João", categoria: "Saúde", data: "2024-01-25" }
      ]
    },
    {
      id: 3,
      cartao: "Santander",
      mesReferencia: "Fevereiro/2024",
      dataVencimento: "2024-03-10",
      valorTotal: 980.00,
      valorPago: 0,
      status: 'fechada',
      itens: [
        { id: 6, descricao: "Academia", valor: 180.00, usuario: "Maria", categoria: "Saúde", data: "2024-02-01" },
        { id: 7, descricao: "Restaurante", valor: 800.00, usuario: "João", categoria: "Alimentação", data: "2024-02-14" }
      ]
    }
  ]);

  const [mostrarApenasPendentes, setMostrarApenasPendentes] = useState(true);
  const [faturaModal, setFaturaModal] = useState<FaturaCartao | null>(null);
  const [pagamento, setPagamento] = useState<PagamentoFatura>({
    tipo: 'total',
    valor: 0,
    parcelas: 2,
    cartaoParcelamento: ''
  });

  const cartoes = ["Nubank", "Itaú", "Santander", "Bradesco"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusVencimento = (dataVencimento: string, status: string) => {
    if (status === 'paga') return { status: 'paga', dias: 0 };
    
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "vencida", dias: Math.abs(diffDays) };
    if (diffDays <= 5) return { status: "vencendo", dias: diffDays };
    return { status: "normal", dias: diffDays };
  };

  const abrirModalPagamento = (fatura: FaturaCartao) => {
    setFaturaModal(fatura);
    setPagamento({
      tipo: 'total',
      valor: fatura.valorTotal - fatura.valorPago,
      parcelas: 2,
      cartaoParcelamento: fatura.cartao
    });
  };

  const processarPagamento = () => {
    if (!faturaModal) return;

    const valorRestante = faturaModal.valorTotal - faturaModal.valorPago;
    
    if (pagamento.valor > valorRestante) {
      toast({
        title: "Erro",
        description: "O valor do pagamento não pode ser maior que o valor em aberto.",
        variant: "destructive"
      });
      return;
    }

    setFaturas(faturas.map(fatura => {
      if (fatura.id === faturaModal.id) {
        const novoValorPago = fatura.valorPago + pagamento.valor;
        const novoStatus = novoValorPago >= fatura.valorTotal ? 'paga' : fatura.status;
        
        return {
          ...fatura,
          valorPago: novoValorPago,
          status: novoStatus
        };
      }
      return fatura;
    }));

    let mensagem = "";
    if (pagamento.tipo === 'total') {
      mensagem = "Fatura quitada integralmente!";
    } else if (pagamento.tipo === 'parcial') {
      mensagem = `Pagamento parcial de ${formatCurrency(pagamento.valor)} realizado!`;
    } else {
      mensagem = `Fatura parcelada em ${pagamento.parcelas}x no cartão ${pagamento.cartaoParcelamento}`;
    }

    toast({
      title: "Pagamento processado!",
      description: mensagem,
    });

    setFaturaModal(null);
  };

  const faturasFiltradas = mostrarApenasPendentes 
    ? faturas.filter(f => f.status !== 'paga')
    : faturas;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quitação de Faturas</h1>
          <p className="text-muted-foreground">
            Gerencie o pagamento de faturas fechadas dos cartões
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="mostrar-pendentes">Apenas pendentes</Label>
          <Switch
            id="mostrar-pendentes"
            checked={mostrarApenasPendentes}
            onCheckedChange={setMostrarApenasPendentes}
          />
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(
                faturas
                  .filter(f => f.status !== 'paga')
                  .reduce((total, f) => total + (f.valorTotal - f.valorPago), 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturas Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {faturas.filter(f => f.status === 'vencida').length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturas Fechadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {faturas.filter(f => f.status === 'fechada').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Faturas */}
      <div className="space-y-4">
        {faturasFiltradas.map((fatura) => {
          const statusVencimento = getStatusVencimento(fatura.dataVencimento, fatura.status);
          const valorRestante = fatura.valorTotal - fatura.valorPago;
          
          return (
            <Card key={fatura.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{fatura.cartao}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {fatura.mesReferencia} • Vencimento: {formatDate(fatura.dataVencimento)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {statusVencimento.status === 'vencida' && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Vencida há {statusVencimento.dias} dias
                      </Badge>
                    )}
                    
                    {statusVencimento.status === 'vencendo' && (
                      <Badge variant="outline" className="border-warning text-warning">
                        Vence em {statusVencimento.dias} dias
                      </Badge>
                    )}
                    
                    <Badge variant={fatura.status === 'paga' ? "default" : "secondary"}>
                      {fatura.status === 'paga' ? 'Quitada' : 
                       fatura.status === 'vencida' ? 'Vencida' : 'Fechada'}
                    </Badge>
                    
                    {fatura.status !== 'paga' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => abrirModalPagamento(fatura)}
                            className="bg-gradient-primary"
                            size="sm"
                          >
                            Pagar Fatura
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Valor Total: {formatCurrency(fatura.valorTotal)}</p>
                      {fatura.valorPago > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Pago: {formatCurrency(fatura.valorPago)} • 
                          Restante: {formatCurrency(valorRestante)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{fatura.itens.length} itens</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {fatura.itens.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border-l-4 border-primary/20 bg-background/50">
                        <div>
                          <p className="font-medium">{item.descricao}</p>
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.usuario}
                            </span>
                            <span>{item.categoria}</span>
                            <span>{formatDate(item.data)}</span>
                          </div>
                        </div>
                        <p className="font-medium">{formatCurrency(item.valor)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Pagamento */}
      {faturaModal && (
        <Dialog open={!!faturaModal} onOpenChange={() => setFaturaModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pagamento da Fatura - {faturaModal.cartao}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium">Valor em aberto: {formatCurrency(faturaModal.valorTotal - faturaModal.valorPago)}</p>
              </div>
              
              <div className="space-y-3">
                <Label>Tipo de Pagamento</Label>
                <Select value={pagamento.tipo} onValueChange={(value: 'total' | 'parcial' | 'parcelado') => 
                  setPagamento({...pagamento, tipo: value, valor: value === 'total' ? faturaModal.valorTotal - faturaModal.valorPago : 0})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Pagamento Total</SelectItem>
                    <SelectItem value="parcial">Pagamento Parcial</SelectItem>
                    <SelectItem value="parcelado">Parcelar Fatura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(pagamento.tipo === 'parcial' || pagamento.tipo === 'parcelado') && (
                <div className="space-y-3">
                  <Label>Valor do Pagamento</Label>
                  <Input
                    type="number"
                    value={pagamento.valor}
                    onChange={(e) => setPagamento({...pagamento, valor: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                  />
                </div>
              )}

              {pagamento.tipo === 'parcelado' && (
                <>
                  <div className="space-y-3">
                    <Label>Número de Parcelas</Label>
                    <Select value={pagamento.parcelas?.toString()} onValueChange={(value) => 
                      setPagamento({...pagamento, parcelas: parseInt(value)})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2,3,4,5,6,7,8,9,10,11,12].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}x</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Cartão para Parcelamento</Label>
                    <Select value={pagamento.cartaoParcelamento} onValueChange={(value) => 
                      setPagamento({...pagamento, cartaoParcelamento: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cartoes.map(cartao => (
                          <SelectItem key={cartao} value={cartao}>{cartao}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {pagamento.parcelas && pagamento.valor > 0 && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm">
                        <strong>{pagamento.parcelas}x de {formatCurrency(pagamento.valor / pagamento.parcelas)}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Será adicionado nas próximas faturas do {pagamento.cartaoParcelamento}
                      </p>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setFaturaModal(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={processarPagamento} className="flex-1 bg-gradient-primary">
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {faturasFiltradas.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-income mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {mostrarApenasPendentes ? "Nenhuma fatura pendente!" : "Nenhuma fatura encontrada"}
            </h3>
            <p className="text-muted-foreground">
              {mostrarApenasPendentes 
                ? "Todas as suas faturas estão em dia." 
                : "Não há faturas cadastradas no sistema."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}