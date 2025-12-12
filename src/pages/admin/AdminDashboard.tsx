import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStats } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, FolderTree, DollarSign, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'Categorias',
      value: stats?.totalCategories || 0,
      icon: FolderTree,
      color: 'text-purple-500',
    },
    {
      title: 'Pedidos',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-green-500',
    },
    {
      title: 'Pedidos Pendentes',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Usuários',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-orange-500',
    },
    {
      title: 'Receita Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-primary',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua loja</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-20 bg-muted/50" />
                <CardContent className="h-10 bg-muted/30" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.title} className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
