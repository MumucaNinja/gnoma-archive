import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function Products() {
  const { categorySlug } = useParams();
  const { data: products, isLoading } = useProducts(categorySlug);
  const { data: categories } = useCategories();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const currentCategory = categories?.find(c => c.slug === categorySlug);

  // Filter and sort products
  const filteredProducts = products
    ?.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {currentCategory?.name || 'Todos os Produtos'}
          </h1>
          {currentCategory?.description && (
            <p className="text-muted-foreground mt-2">{currentCategory.description}</p>
          )}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          
          <div className="flex gap-2 flex-1 justify-end">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Categorias</h4>
                    <div className="space-y-2">
                      {categories?.map(cat => (
                        <Button
                          key={cat.id}
                          variant={categorySlug === cat.slug ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to={`/categoria/${cat.slug}`}>{cat.name}</Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categorias
                </h3>
                <div className="space-y-1">
                  <Button
                    variant={!categorySlug ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/produtos">Todos</Link>
                  </Button>
                  {categories?.map(cat => (
                    <Button
                      key={cat.id}
                      variant={categorySlug === cat.slug ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={`/categoria/${cat.slug}`}>{cat.name}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
