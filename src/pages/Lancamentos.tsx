import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Calendar } from "lucide-react";
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

export default function Lancamentos() {
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");
  const [parcelado, setParcelado] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui será implementada a integração com Google Sheets
    toast({
      title: "Lançamento criado!",
      description: `${tipo === 'receita' ? 'Receita' : 'Despesa'} de R$ ${formData.valor} foi registrada.`,
    });
    
    // Reset form
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
            <CardTitle>Novo Lançamento</CardTitle>
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

              <Button type="submit" className="w-full bg-gradient-primary shadow-elegant">
                <Plus className="mr-2 h-4 w-4" />
                Criar Lançamento
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Transactions Preview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Lançamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-card rounded-lg">
                <div>
                  <p className="font-medium">Salário</p>
                  <p className="text-sm text-muted-foreground">João • Hoje</p>
                </div>
                <span className="font-bold text-income">R$ 5.000,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-card rounded-lg">
                <div>
                  <p className="font-medium">Supermercado</p>
                  <p className="text-sm text-muted-foreground">Maria • Ontem</p>
                </div>
                <span className="font-bold text-expense">R$ 350,75</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-card rounded-lg">
                <div>
                  <p className="font-medium">Combustível</p>
                  <p className="text-sm text-muted-foreground">João • 2 dias atrás</p>
                </div>
                <span className="font-bold text-expense">R$ 180,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}