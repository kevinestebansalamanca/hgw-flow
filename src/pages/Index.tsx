import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PublicNav } from "@/components/PublicNav";
import { ContactSection, Footer } from "@/components/ContactFooter";
import { ProductCard, Stars } from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Leaf, Heart, Users, Zap } from "lucide-react";
import hero from "@/assets/hero.jpg";

const Index = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    document.title = "HGW Green World Colombia · Bienestar Premium";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "HGW Green World Colombia: productos premium de bienestar, café, suplementos y cuidado personal. Calidad, ciencia y naturaleza.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description"; m.content = desc;
      document.head.appendChild(m);
    }

    // Bootstrap admin and seed if needed
    supabase.functions.invoke("bootstrap-admin").catch(() => {});

    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("visible", true)
      .is("deleted_at", null)
      .limit(8)
      .then(({ data }) => setFeatured((data ?? []) as unknown as Product[]));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">Wellness Premium · Colombia</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gradient-lime shadow-glow mb-6 ml-0 md:ml-3">
              <Shield className="w-4 h-4 text-lime-foreground" />
              <span className="text-xs font-bold tracking-wide uppercase text-lime-foreground">Distribuidores Autorizados HGW</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Bienestar que <span className="text-gradient">se siente</span> premium.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Descubre la línea HGW Green World: productos elaborados con ciencia, naturaleza y pasión, diseñados para tu estilo de vida saludable.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground border-0 shadow-elegant hover:scale-105 transition-smooth">
                <Link to="/catalogo">Explorar Catálogo <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2">
                <a href="#destacados">Productos Destacados</a>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute -inset-8 gradient-lime opacity-20 blur-3xl rounded-full animate-float" />
            <img src={hero} alt="Producto wellness HGW" className="relative rounded-3xl shadow-elegant w-full" width={1600} height={1024} />
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section id="destacados" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <div className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Productos Destacados HGW</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Lo más amado por nuestra comunidad</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Selección premium con beneficios reales, reseñas de clientes y experiencia de marca internacional.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" className="border-2">
              <Link to="/catalogo">Ver catálogo completo <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* RESEÑAS / TESTIMONIOS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <Stars value={5} />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: "Laura M.", t: "Me encanta el sabor del Blueberry Coffee, es diferente y se siente premium." },
              { n: "Carolina R.", t: "LactiBerry se volvió parte de mi rutina, ligero y delicioso." },
              { n: "Daniela S.", t: "El jabón Detox deja una sensación fresca increíble. Lo uso a diario." },
            ].map((r, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:shadow-elegant transition-smooth">
                <Stars value={5} />
                <p className="mt-4 text-foreground/80 italic">"{r.t}"</p>
                <div className="mt-4 font-semibold text-foreground">{r.n}</div>
                <div className="text-xs text-muted-foreground">Cliente verificado</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ HGW */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">¿Por qué elegir HGW?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Una marca colombiana con visión internacional, comprometida con la calidad y el bienestar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { i: Sparkles, t: "Innovación", d: "Productos diseñados con ingredientes premium y procesos modernos." },
              { i: Heart, t: "Bienestar", d: "Pensados para integrarse a tu rutina diaria de forma natural." },
              { i: Shield, t: "Calidad", d: "Estándares estrictos en cada presentación y formulación." },
              { i: Leaf, t: "Naturaleza", d: "Inspirados en la riqueza natural de Colombia y el mundo." },
              { i: Users, t: "Comunidad", d: "Una marca cercana que escucha y crece contigo." },
              { i: Zap, t: "Estilo de vida", d: "Energía, equilibrio y disfrute para tu día a día." },
            ].map((b, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-smooth hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl gradient-lime flex items-center justify-center mb-4">
                  <b.i className="w-6 h-6 text-lime-foreground" />
                </div>
                <div className="font-display text-xl font-bold mb-2">{b.t}</div>
                <div className="text-sm text-muted-foreground">{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
