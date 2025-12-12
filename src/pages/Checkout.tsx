import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
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
  const { items, total } = useCart();
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  if (items.length === 0) {
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

    setIsProcessing(true);

    try {
      // First create the order in pending state
      const order = await createOrder.mutateAsync(address);
      
      // Then redirect to Stripe checkout
      const checkoutItems = items.map(item => ({
        product_name: item.product.name,
        product_price: item.product.price,
        product_image: item.product.images?.[0] || null,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: checkoutItems,
          shippingAddress: address,
          orderId: order.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Erro ao processar checkout: ' + error.message);
      setIsProcessing(false);
    }
  };

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
                        disabled={isProcessing}
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
                        disabled={isProcessing}
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
                        disabled={isProcessing}
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
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Bairro"
                        value={address.neighborhood}
                        onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                        disabled={isProcessing}
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
                        disabled={isProcessing}
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
                        disabled={isProcessing}
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
                    Você será redirecionado para o Stripe para concluir o pagamento de forma segura.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <svg viewBox="0 0 32 32" className="h-8 w-auto" aria-hidden="true">
                      <path fill="#6772E5" d="M28.314 7.006c-.65-1.02-1.87-1.67-3.196-1.67h-18.23c-1.33 0-2.55.65-3.2 1.67-.65 1.02-.76 2.29-.29 3.39l5.89 13.83c.46 1.08 1.55 1.78 2.73 1.78h8.03c1.18 0 2.27-.7 2.73-1.78l5.89-13.83c.47-1.1.36-2.37-.29-3.39z"/>
                    </svg>
                    Pagamento seguro via Stripe
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full glow-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Ir para Pagamento'
                )}
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
