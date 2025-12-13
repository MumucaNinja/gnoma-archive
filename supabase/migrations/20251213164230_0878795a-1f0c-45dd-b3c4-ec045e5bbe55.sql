-- Create table for about page content
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Sobre a SeedStore',
  content text NOT NULL DEFAULT 'Bem-vindo à SeedStore, sua loja especializada em sementes de cannabis de alta qualidade.',
  mission text,
  vision text,
  values text,
  image_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Everyone can view
CREATE POLICY "About content is viewable by everyone"
ON public.about_content
FOR SELECT
USING (true);

-- Only admins can update
CREATE POLICY "Admins can manage about content"
ON public.about_content
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Insert default content
INSERT INTO public.about_content (title, content, mission, vision, values)
VALUES (
  'Sobre a SeedStore',
  'A SeedStore nasceu da paixão por genéticas de qualidade e do desejo de oferecer as melhores sementes de cannabis do mercado. Nossa equipe é formada por entusiastas e especialistas que selecionam cuidadosamente cada variedade disponível em nosso catálogo.',
  'Fornecer sementes de cannabis de alta qualidade, com genéticas estáveis e confiáveis, garantindo a satisfação de nossos clientes.',
  'Ser referência no mercado brasileiro de sementes, reconhecidos pela excelência em qualidade e atendimento.',
  'Qualidade, Transparência, Inovação, Respeito ao Cliente, Compromisso com a Comunidade'
);