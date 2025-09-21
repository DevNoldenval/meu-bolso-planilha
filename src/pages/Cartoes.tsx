import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, CreditCard, Calendar, DollarSign, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Cartao {
  id: number;
  nome: string;
  ultimosDigitos: string;
  tipo: "crédito" | "débito";
  limite: number;
  utilizado: number;
  dataVencimento: number;
  dataBoa: number;
}

export default function Cartoes() {
  const [showForm, setShowForm] = useState(false);
  const [cartoes, setCartoes] = useState<Cartao[]>([
    {
      id: 1,
      nome: "Nubank",
      ultimosDigitos: "1234",
      tipo: "crédito",
      limite: 5000,
      utilizado: 1250,
      dataVencimento: 15,
      dataBoa: 10
    },
    {
      id: 2,
      nome: "Bradesco",
      ultimosDigitos: "5678",
      tipo: "débito",
      limite: 0,
      utilizado: 0,
      dataVencimento: 0,
      dataBoa: 0
    },
    {
      id: 3,
      nome: "Itaú",
      ultimosDigitos: "9876",
      tipo: "crédito",
      limite: 3000,
      utilizado: 2100,
      dataVencimento: 5,
      dataBoa: 1
    }
  ]);

  const [formData, setFormData] = useState({
    nome: "",
    ultimosDigitos: "",
    tipo: "crédito" as "crédito" | "débito",
    limite: "",
    dataVencimento: "",
    dataBoa: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoCartao: Cartao = {
      id: Date.now(),
      nome: formData.nome,
      ultimosDigitos: formData.ultimosDigitos,
      tipo: formData.tipo,
      limite: parseFloat(formData.limite) || 0,
      utilizado: 0,
      dataVencimento: parseInt(formData.dataVencimento) || 0,
      dataBoa: parseInt(formData.dataBoa) || 0
    };

    setCartoes([...cartoes, novoCartao]);
    setFormData({
      nome: "",
      ultimosDigitos: "",
      tipo: "crédito",
      limite: "",
      dataVencimento: "",
      dataBoa: ""
    });
    setShowForm(false);
    
    toast({
      title: "Cartão adicionado!",
      description: `${formData.nome} foi adicionado com sucesso.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPercentualUso = (utilizado: number, limite: number) => {
    if (limite === 0) return 0;
    return (utilizado / limite) * 100;
  };

  const getStatusColor = (percentual: number) => {
    if (percentual >= 80) return "text-expense";
    if (percentual >= 60) return "text-yellow-600";
    return "text-income";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartões</h1>
          <p className="text-muted-foreground">
            Gerencie seus cartões de crédito e débito
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-primary shadow-elegant"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Adicionar Novo Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cartão</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Nubank, Bradesco..."
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ultimosDigitos">Últimos 4 Dígitos</Label>
                  <Input
                    id="ultimosDigitos"
                    placeholder="1234"
                    maxLength={4}
                    value={formData.ultimosDigitos}
                    onChange={(e) => setFormData({...formData, ultimosDigitos: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value: "crédito" | "débito") => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crédito">Crédito</SelectItem>
                      <SelectItem value="débito">Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limite">Limite</Label>
                  <Input
                    id="limite"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.limite}
                    onChange={(e) => setFormData({...formData, limite: e.target.value})}
                  />
                </div>
              </div>

              {formData.tipo === "crédito" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataVencimento">Dia do Vencimento</Label>
                    <Input
                      id="dataVencimento"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="15"
                      value={formData.dataVencimento}
                      onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataBoa">Melhor Data de Compra</Label>
                    <Input
                      id="dataBoa"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="10"
                      value={formData.dataBoa}
                      onChange={(e) => setFormData({...formData, dataBoa: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit" className="bg-gradient-primary">
                  Adicionar Cartão
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Cards List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cartoes.map((cartao) => (
          <Card key={cartao.id} className="shadow-card bg-gradient-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{cartao.nome}</CardTitle>
                </div>
                <Badge variant={cartao.tipo === "crédito" ? "default" : "secondary"}>
                  {cartao.tipo}
                </Badge>
              </div>
              <div className="text-lg font-mono">
                **** **** **** {cartao.ultimosDigitos}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {cartao.tipo === "crédito" && (
                <>
                  {/* Limite e Uso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Limite utilizado</span>
                      <span className={getStatusColor(getPercentualUso(cartao.utilizado, cartao.limite))}>
                        {formatCurrency(cartao.utilizado)} / {formatCurrency(cartao.limite)}
                      </span>
                    </div>
                    <Progress 
                      value={getPercentualUso(cartao.utilizado, cartao.limite)} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      Disponível: {formatCurrency(cartao.limite - cartao.utilizado)}
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Vencimento</p>
                        <p className="font-medium">Dia {cartao.dataVencimento}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Melhor compra</p>
                        <p className="font-medium">Dia {cartao.dataBoa}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-expense">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}