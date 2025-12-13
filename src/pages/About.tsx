import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Save, X, Leaf, Target, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface AboutContent {
  id: string;
  title: string;
  content: string;
  mission: string | null;
  vision: string | null;
  values: string | null;
  image_url: string | null;
  updated_at: string;
}

export default function About() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<AboutContent>>({});

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error) throw error;
      return data as AboutContent;
    },
  });

  useEffect(() => {
    if (aboutContent) {
      setEditData(aboutContent);
    }
  }, [aboutContent]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<AboutContent>) => {
      const { error } = await supabase
        .from('about_content')
        .update({
          title: data.title,
          content: data.content,
          mission: data.mission,
          vision: data.vision,
          values: data.values,
          image_url: data.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', aboutContent?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
      setIsEditing(false);
      toast.success('Conteúdo atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    },
  });

  const handleSave = () => {
    updateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData(aboutContent || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1" />
              {isAdmin && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Editar Página
                </Button>
              )}
              {isAdmin && isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <Leaf className="w-16 h-16 text-primary mx-auto mb-6" />
              {isEditing ? (
                <Input
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="text-4xl md:text-5xl font-bold text-center mb-6 bg-transparent border-primary/50"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {aboutContent?.title}
                </h1>
              )}
              {isEditing ? (
                <Textarea
                  value={editData.content || ''}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  className="text-lg text-muted-foreground leading-relaxed bg-transparent border-primary/50 min-h-[150px]"
                />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {aboutContent?.content}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Mission */}
              <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Nossa Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editData.mission || ''}
                      onChange={(e) => setEditData({ ...editData, mission: e.target.value })}
                      className="bg-transparent border-primary/50 min-h-[120px]"
                      placeholder="Descreva a missão da empresa..."
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {aboutContent?.mission || 'Missão não definida.'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Nossa Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editData.vision || ''}
                      onChange={(e) => setEditData({ ...editData, vision: e.target.value })}
                      className="bg-transparent border-primary/50 min-h-[120px]"
                      placeholder="Descreva a visão da empresa..."
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {aboutContent?.vision || 'Visão não definida.'}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Values */}
              <Card className="bg-card/50 border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Nossos Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editData.values || ''}
                      onChange={(e) => setEditData({ ...editData, values: e.target.value })}
                      className="bg-transparent border-primary/50 min-h-[120px]"
                      placeholder="Liste os valores da empresa..."
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {aboutContent?.values || 'Valores não definidos.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Clientes Satisfeitos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Variedades</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Qualidade Garantida</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">5★</div>
                <div className="text-muted-foreground">Avaliação Média</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ficou com alguma dúvida?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Nossa equipe está sempre pronta para ajudar. Entre em contato conosco!
            </p>
            <Button size="lg" className="gap-2">
              Fale Conosco
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
