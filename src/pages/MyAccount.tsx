import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-warning text-primary-foreground',
  paid: 'bg-info text-white',
  shipped: 'bg-primary text-primary-foreground',
  delivered: 'bg-success text-primary-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

export default function MyAccount() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (!user) {
    navigate('/auth?redirect=/minha-conta');
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Minha Conta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">
                      {profile?.full_name || 'Usuário'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {isAdmin && (
                      <Badge className="mt-1 bg-primary">Admin</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/admin')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Painel Admin
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Meus Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-muted-foreground">Carregando pedidos...</p>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">
                              Pedido #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {order.items.slice(0, 3).map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.product_name}
                                </span>
                                <span>{formatPrice(item.product_price * item.quantity)}</span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-sm text-muted-foreground">
                                +{order.items.length - 3} mais itens
                              </p>
                            )}
                          </div>
                        )}

                        <Separator className="my-3" />

                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span className="text-primary">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Você ainda não fez nenhum pedido.
                    </p>
                    <Button className="mt-4" onClick={() => navigate('/produtos')}>
                      Ver Produtos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
