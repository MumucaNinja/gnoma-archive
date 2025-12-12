import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ChevronLeft, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from 'sonner';
import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zip_code: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();

  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!user) {
    navigate('/auth?redirect=/checkout');
    return null;
  }

  if (items.length === 0 && !isComplete) {
    navigate('/carrinho');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = addressSchema.safeParse(address);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createOrder.mutateAsync(address);
      setIsComplete(true);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="p-6 rounded-full bg-primary/10 inline-block animate-pulse-glow">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">Pedido Realizado!</h1>
            <p className="text-muted-foreground">
              Seu pedido foi recebido com sucesso. Você receberá um email com os detalhes.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/minha-conta')}>
                Ver Meus Pedidos
              </Button>
              <Button variant="outline" onClick={() => navigate('/produtos')}>
                Continuar Comprando
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <h1 className="font-display text-3xl font-bold mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="zip_code">CEP</Label>
                      <Input
                        id="zip_code"
                        placeholder="00000-000"
                        maxLength={9}
                        value={address.zip_code}
                        onChange={e => setAddress({ ...address, zip_code: e.target.value })}
                      />
                      {errors.zip_code && <p className="text-sm text-destructive">{errors.zip_code}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        placeholder="Nome da rua"
                        value={address.street}
                        onChange={e => setAddress({ ...address, street: e.target.value })}
                      />
                      {errors.street && <p className="text-sm text-destructive">{errors.street}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="123"
                        value={address.number}
                        onChange={e => setAddress({ ...address, number: e.target.value })}
                      />
                      {errors.number && <p className="text-sm text-destructive">{errors.number}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Apto, sala, etc"
                        value={address.complement}
                        onChange={e => setAddress({ ...address, complement: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Bairro"
                        value={address.neighborhood}
                        onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                      />
                      {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        placeholder="SP"
                        maxLength={2}
                        value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                      />
                      {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    O pagamento será processado após a confirmação do pedido.
                    Você receberá as instruções por email.
                  </p>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full glow-primary"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-display text-xl font-bold">Resumo do Pedido</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="text-sm font-medium text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-primary">Grátis</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-display text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
