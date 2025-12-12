import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="py-16 bg-card/50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Destaques
            </h2>
            <p className="text-muted-foreground mt-1">
              Novidades e promoções especiais
            </p>
          </div>
          <Link
            to="/produtos"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Ver Todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}
