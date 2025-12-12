import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      setError('Sessão de pagamento não encontrada');
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId },
        });

        if (error) throw error;

        if (data?.paid) {
          setStatus('success');
        } else {
          setStatus('error');
          setError('Pagamento não confirmado');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setStatus('error');
        setError('Erro ao verificar pagamento');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <Layout>
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          {status === 'loading' && (
            <>
              <div className="p-6 rounded-full bg-primary/10 inline-block">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <h1 className="font-display text-3xl font-bold">Verificando Pagamento...</h1>
              <p className="text-muted-foreground">
                Aguarde enquanto confirmamos seu pagamento.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="p-6 rounded-full bg-primary/10 inline-block animate-pulse-glow">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold">Pagamento Confirmado!</h1>
              <p className="text-muted-foreground">
                Seu pedido foi processado com sucesso. Você receberá um email com os detalhes.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/minha-conta')}>
                  Ver Meus Pedidos
                </Button>
                <Button variant="outline" onClick={() => navigate('/produtos')}>
                  Continuar Comprando
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="p-6 rounded-full bg-destructive/10 inline-block">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <h1 className="font-display text-3xl font-bold">Erro no Pagamento</h1>
              <p className="text-muted-foreground">
                {error || 'Houve um problema ao processar seu pagamento.'}
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/checkout')}>
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Voltar à Loja
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
