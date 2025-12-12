import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Qualidade Premium Garantida
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Sementes de{' '}
            <span className="gradient-text">Alta Genética</span>
            {' '}para Colecionadores
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Descubra nossa coleção exclusiva de sementes selecionadas. 
            Qualidade, discrição e entrega garantida em todo o Brasil.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="glow-primary group">
              <Link to="/produtos">
                Ver Coleção
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/sobre">Saiba Mais</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Pagamento Seguro</p>
                <p className="text-sm text-muted-foreground">100% Protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Envio Discreto</p>
                <p className="text-sm text-muted-foreground">Todo Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Alta Genética</p>
                <p className="text-sm text-muted-foreground">Selecionadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
