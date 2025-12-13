import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Check, Leaf, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProduct, useComboSeeds } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function ComboDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: combo, isLoading } = useProduct(slug || '');
  const { data: availableSeeds, isLoading: loadingSeeds } = useComboSeeds(combo?.combo_seed_type || '');
  const { addItem } = useCart();
  const [selectedSeeds, setSelectedSeeds] = useState<Product[]>([]);

  const maxSeeds = combo?.combo_quantity || 3;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const toggleSeed = (seed: Product) => {
    if (selectedSeeds.find(s => s.id === seed.id)) {
      setSelectedSeeds(selectedSeeds.filter(s => s.id !== seed.id));
    } else {
      if (selectedSeeds.length >= maxSeeds) {
        toast.error(`Você pode selecionar no máximo ${maxSeeds} sementes`);
        return;
      }
      setSelectedSeeds([...selectedSeeds, seed]);
    }
  };

  const handleAddToCart = () => {
    if (selectedSeeds.length !== maxSeeds) {
      toast.error(`Selecione exatamente ${maxSeeds} sementes para o combo`);
      return;
    }

    // Add combo with selected seeds info in description
    const seedNames = selectedSeeds.map(s => s.name).join(', ');
    const comboWithSeeds: Product = {
      ...combo!,
      description: `Sementes selecionadas: ${seedNames}`,
    };
    
    addItem(comboWithSeeds, 1);
    toast.success('Combo adicionado ao carrinho!');
    setSelectedSeeds([]);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!combo || !combo.is_combo) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Combo não encontrado</h1>
          <Button onClick={() => navigate('/produtos')}>Ver todos os produtos</Button>
        </div>
      </Layout>
    );
  }

  const hasDiscount = combo.original_price && combo.original_price > combo.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - combo.price / combo.original_price!) * 100)
    : 0;

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Badge className="bg-warning text-primary-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Combo Especial
            </Badge>
            {hasDiscount && (
              <Badge variant="destructive">
                -{discountPercent}% OFF
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {combo.name}
          </h1>

          <p className="text-muted-foreground text-lg mb-6">
            {combo.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-primary">
              {formatPrice(combo.price)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(combo.original_price!)}
              </span>
            )}
            <span className="text-muted-foreground">
              por {maxSeeds} sementes
            </span>
          </div>

          <Separator className="mb-6" />

          {/* Selection Counter */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Sementes selecionadas: {selectedSeeds.length} de {maxSeeds}
              </span>
            </div>
            {selectedSeeds.length === maxSeeds && (
              <Badge className="bg-success text-white">
                <Check className="h-3 w-3 mr-1" />
                Completo!
              </Badge>
            )}
          </div>
        </div>

        {/* Selected Seeds Summary */}
        {selectedSeeds.length > 0 && (
          <div className="mb-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
            <h3 className="font-medium mb-2">Suas escolhas:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSeeds.map(seed => (
                <Badge 
                  key={seed.id} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => toggleSeed(seed)}
                >
                  {seed.name} ✕
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Seeds Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Escolha {maxSeeds} sementes {combo.combo_seed_type === 'automaticas' ? 'automáticas' : 'fotoperíodo'}:
          </h2>

          {loadingSeeds ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : availableSeeds && availableSeeds.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableSeeds.map(seed => {
                const isSelected = selectedSeeds.find(s => s.id === seed.id);
                return (
                  <Card
                    key={seed.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/10' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleSeed(seed)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <img
                          src={seed.images?.[0] || '/placeholder.svg'}
                          alt={seed.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center rounded-t-lg">
                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                              <Check className="h-6 w-6" />
                            </div>
                          </div>
                        )}
                        {seed.is_new && (
                          <Badge className="absolute top-2 left-2 bg-info text-white text-xs">
                            Novo
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-1">{seed.name}</h3>
                        {seed.genetics && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {seed.genetics}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma semente disponível no momento.</p>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="sticky bottom-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Total do Combo</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(combo.price)}</p>
            </div>
            <Button
              size="lg"
              className="glow-primary"
              disabled={selectedSeeds.length !== maxSeeds}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
