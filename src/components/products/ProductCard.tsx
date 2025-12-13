import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0;

  const isCombo = product.is_combo === true;
  const productLink = isCombo ? `/combo/${product.slug}` : `/produto/${product.slug}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card className={cn(
      "group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
      isCombo && "ring-2 ring-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
    )}>
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isCombo && (
            <Badge className="bg-warning text-primary-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Combo
            </Badge>
          )}
          {product.is_new && !isCombo && (
            <Badge className="bg-info text-white">Novo</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive">-{discountPercent}%</Badge>
          )}
          {isOutOfStock && !isCombo && (
            <Badge variant="destructive">Esgotado</Badge>
          )}
        </div>

        {/* Image */}
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
            isOutOfStock && !isCombo && "opacity-50"
          )}
        />

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            asChild
          >
            <Link to={productLink}>
              <Eye className="h-5 w-5" />
            </Link>
          </Button>
          {!isOutOfStock && !isCombo && (
            <Button
              size="icon"
              onClick={() => addItem(product)}
              className="glow-primary"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <Link to={productLink}>
          <h3 className="font-display font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description for combos, Genetics for regular products */}
        {isCombo ? (
          <p className="text-sm text-muted-foreground line-clamp-2">
            Escolha {product.combo_quantity} sementes {product.combo_seed_type === 'automaticas' ? 'automáticas' : 'fotoperíodo'}
          </p>
        ) : product.genetics ? (
          <p className="text-sm text-muted-foreground">{product.genetics}</p>
        ) : null}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.original_price!)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {isCombo ? (
          <Button className="w-full glow-primary" asChild>
            <Link to={productLink}>
              <Sparkles className="mr-2 h-4 w-4" />
              Montar Combo
            </Link>
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={isOutOfStock}
            onClick={() => addItem(product)}
          >
            {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
