import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Categorias
          </h2>
          <Link
            to="/produtos"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Ver Todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/categoria/${category.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
