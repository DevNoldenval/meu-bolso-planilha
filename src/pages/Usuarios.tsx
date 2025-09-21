import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Usuario {
  id: number;
  nome: string;
  apelido: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export default function Usuarios() {
  const [showForm, setShowForm] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: "João Silva",
      apelido: "João",
      totalReceitas: 12500.00,
      totalDespesas: 3200.00,
      saldo: 9300.00
    },
    {
      id: 2,
      nome: "Maria Santos",
      apelido: "Maria",
      totalReceitas: 8000.00,
      totalDespesas: 2100.00,
      saldo: 5900.00
    }
  ]);

  const [formData, setFormData] = useState({
    nome: "",
    apelido: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: formData.nome,
      apelido: formData.apelido,
      totalReceitas: 0,
      totalDespesas: 0,
      saldo: 0
    };

    setUsuarios([...usuarios, novoUsuario]);
    setFormData({ nome: "", apelido: "" });
    setShowForm(false);
    
    toast({
      title: "Usuário adicionado!",
      description: `${formData.nome} foi adicionado com sucesso.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-primary shadow-elegant"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Adicionar Novo Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: João Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apelido">Apelido</Label>
                  <Input
                    id="apelido"
                    placeholder="Ex: João"
                    value={formData.apelido}
                    onChange={(e) => setFormData({...formData, apelido: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-gradient-primary">
                  Adicionar Usuário
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className="shadow-card bg-gradient-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(usuario.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{usuario.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">@{usuario.apelido}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Saldo */}
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <p className={`text-2xl font-bold ${usuario.saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(usuario.saldo)}
                </p>
              </div>

              {/* Receitas e Despesas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-income" />
                    <span className="text-sm text-muted-foreground">Receitas</span>
                  </div>
                  <p className="font-bold text-income">
                    {formatCurrency(usuario.totalReceitas)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingDown className="h-4 w-4 text-expense" />
                    <span className="text-sm text-muted-foreground">Despesas</span>
                  </div>
                  <p className="font-bold text-expense">
                    {formatCurrency(usuario.totalDespesas)}
                  </p>
                </div>
              </div>

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

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{usuarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Usuários cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-income" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              {formatCurrency(usuarios.reduce((acc, user) => acc + user.totalReceitas, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as receitas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(usuarios.reduce((acc, user) => acc + user.totalDespesas, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as despesas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}