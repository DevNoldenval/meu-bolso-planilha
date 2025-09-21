import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, ArrowUpCircle, ArrowDownCircle, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categorias = [
  "Casa", "Alimentação", "Transporte", "Saúde", "Lazer", 
  "Salário", "Comissão", "Vendas", "Extras"
];

const usuarios = [
  { id: 1, nome: "João Silva", apelido: "João" },
  { id: 2, nome: "Maria Santos", apelido: "Maria" }
];

const cartoes = [
  { id: 1, nome: "Nubank", ultimosDigitos: "1234", tipo: "crédito", limite: 5000, dataVencimento: 15, dataBoa: 10 },
  { id: 2, nome: "Bradesco", ultimosDigitos: "5678", tipo: "débito", limite: 0, dataVencimento: 0, dataBoa: 0 }
];

interface Lancamento {
  id: number;
  tipo: "receita" | "despesa";
  data: string;
  valor: number;
  categoria: string;
  descricao: string;
  formaPagamento: string;
  usuario: string;
  cartao?: string;
  parcelas?: number;
  parcelaAtual?: number;
}

export default function Lancamentos() {
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [parcelado, setParcelado] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([
    {
      id: 1,
      tipo: "receita",
      data: "2024-01-15",
      valor: 5000.00,
      categoria: "Salário",
      descricao: "Salário mensal",
      formaPagamento: "pix",
      usuario: "João"
    },
    {
      id: 2,
      tipo: "despesa",
      data: "2024-01-14",
      valor: 350.75,
      categoria: "Alimentação",
      descricao: "Supermercado",  
      formaPagamento: "cartao",
      usuario: "Maria",
      cartao: "Nubank"
    },
    {
      id: 3,
      tipo: "despesa",
      data: "2024-01-13",
      valor: 180.00,
      categoria: "Transporte",
      descricao: "Combustível",
      formaPagamento: "cartao",
      usuario: "João",
      cartao: "Bradesco"
    }
  ]);
  
  const [formData, setFormData] = useState({
    data: "",
    valor: "",
    categoria: "",
    descricao: "",
    formaPagamento: "",
    usuario: "",
    cartao: "",
    parcelas: "1"
  });

  const resetForm = () => {
    setFormData({
      data: "",
      valor: "",
      categoria: "",
      descricao: "",
      formaPagamento: "",
      usuario: "",
      cartao: "",
      parcelas: "1"
    });
    setTipo("receita");
    setParcelado(false);
    setEditandoId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lancamentoData: Omit<Lancamento, 'id'> = {
      tipo,
      data: formData.data,
      valor: parseFloat(formData.valor),
      categoria: formData.categoria,
      descricao: formData.descricao,
      formaPagamento: formData.formaPagamento,
      usuario: formData.usuario,
      cartao: formData.cartao || undefined,
      parcelas: parcelado ? parseInt(formData.parcelas) : undefined
    };

    if (editandoId) {
      // Editando lançamento existente
      setLancamentos(lancamentos.map(l => 
        l.id === editandoId ? { ...lancamentoData, id: editandoId } : l
      ));
      toast({
        title: "Lançamento atualizado!",
        description: `${tipo === 'receita' ? 'Receita' : 'Despesa'} de R$ ${formData.valor} foi atualizada.`,
      });
    } else {
      // Criando novo lançamento
      const novoLancamento: Lancamento = {
        ...lancamentoData,
        id: Date.now()
      };
      setLancamentos([novoLancamento, ...lancamentos]);
      toast({
        title: "Lançamento criado!",
        description: `${tipo === 'receita' ? 'Receita' : 'Despesa'} de R$ ${formData.valor} foi registrada.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (lancamento: Lancamento) => {
    setEditandoId(lancamento.id);
    setTipo(lancamento.tipo);
    setFormData({
      data: lancamento.data,
      valor: lancamento.valor.toString(),
      categoria: lancamento.categoria,
      descricao: lancamento.descricao,
      formaPagamento: lancamento.formaPagamento,
      usuario: lancamento.usuario,
      cartao: lancamento.cartao || "",
      parcelas: lancamento.parcelas?.toString() || "1"
    });
    setParcelado(!!lancamento.parcelas && lancamento.parcelas > 1);
  };

  const handleDelete = (id: number) => {
    setLancamentos(lancamentos.filter(l => l.id !== id));
    toast({
      title: "Lançamento excluído!",
      description: "O lançamento foi removido com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lançamentos</h1>
        <p className="text-muted-foreground">
          Registre suas receitas e despesas
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              {editandoId ? "Editar Lançamento" : "Novo Lançamento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={tipo === "receita" ? "default" : "outline"}
                    onClick={() => setTipo("receita")}
                    className={tipo === "receita" ? "bg-income hover:bg-income/90" : ""}
                  >
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant={tipo === "despesa" ? "default" : "outline"}
                    onClick={() => setTipo("despesa")}
                    className={tipo === "despesa" ? "bg-expense hover:bg-expense/90" : ""}
                  >
                    Despesa
                  </Button>
                </div>
              </div>

              {/* Data e Valor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o lançamento..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </div>

              {/* Usuário */}
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Select value={formData.usuario} onValueChange={(value) => setFormData({...formData, usuario: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quem fez o lançamento?" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((user) => (
                      <SelectItem key={user.id} value={user.apelido}>{user.apelido}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select value={formData.formaPagamento} onValueChange={(value) => setFormData({...formData, formaPagamento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Como foi pago?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cartão (se forma de pagamento for cartão) */}
              {formData.formaPagamento === "cartao" && (
                <div className="space-y-2">
                  <Label>Cartão</Label>
                  <Select value={formData.cartao} onValueChange={(value) => setFormData({...formData, cartao: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qual cartão?" />
                    </SelectTrigger>
                    <SelectContent>
                      {cartoes.map((cartao) => (
                        <SelectItem key={cartao.id} value={cartao.nome}>
                          {cartao.nome} (*{cartao.ultimosDigitos})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Parcelamento */}
              {tipo === "despesa" && formData.formaPagamento === "cartao" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="parcelado" 
                      checked={parcelado}
                      onCheckedChange={setParcelado}
                    />
                    <Label htmlFor="parcelado">Parcelado</Label>
                  </div>
                  
                  {parcelado && (
                    <div className="space-y-2">
                      <Label htmlFor="parcelas">Número de Parcelas</Label>
                      <Select value={formData.parcelas} onValueChange={(value) => setFormData({...formData, parcelas: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 12}, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}x</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-gradient-primary shadow-elegant">
                  {editandoId ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Atualizar Lançamento
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Lançamento
                    </>
                  )}
                </Button>
                {editandoId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Lançamentos */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Lançamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {lancamentos.map((lancamento) => (
                <div key={lancamento.id} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
                  <div className="flex items-center space-x-4 flex-1">
                    {lancamento.tipo === 'receita' ? (
                      <ArrowUpCircle className="h-6 w-6 text-income flex-shrink-0" />
                    ) : (
                      <ArrowDownCircle className="h-6 w-6 text-expense flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium truncate">{lancamento.descricao}</p>
                        <Badge variant="outline" className="text-xs">
                          {lancamento.categoria}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{lancamento.usuario}</span>
                        <span>•</span>
                        <span>{formatDate(lancamento.data)}</span>
                        {lancamento.cartao && (
                          <>
                            <span>•</span>
                            <span>{lancamento.cartao}</span>
                          </>
                        )}
                        {lancamento.parcelas && lancamento.parcelas > 1 && (
                          <>
                            <span>•</span>
                            <span>{lancamento.parcelas}x</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`font-bold ${lancamento.tipo === 'receita' ? 'text-income' : 'text-expense'}`}>
                        {formatCurrency(lancamento.valor)}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(lancamento)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-expense hover:text-expense"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(lancamento.id)}
                                className="bg-expense hover:bg-expense/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}