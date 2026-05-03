import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicNav } from "@/components/PublicNav";
import { ContactSection, Footer } from "@/components/ContactFooter";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Catalogo = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todos");

  useEffect(() => {
    document.title = "Catálogo · HGW Green World Colombia";
    supabase
      .from("products")
      .select("*")
      .eq("visible", true)
      .is("deleted_at", null)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as unknown as Product[]));
  }, []);

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))], [items]);
  const filtered = items.filter((p) =>
    (cat === "Todos" || p.category === cat) &&
    (q.trim() === "" || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="py-12 md:py-16 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">Catálogo HGW</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Explora nuestra línea completa de productos premium.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10 h-12" placeholder="Buscar productos..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                    cat === c ? "gradient-primary text-primary-foreground shadow-elegant" : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No se encontraron productos.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Catalogo;
