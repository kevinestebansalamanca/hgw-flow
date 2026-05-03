import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Trash = () => {
  const [items, setItems] = useState<Product[]>([]);
  const load = async () => {
    const { data } = await supabase.from("products").select("*").not("deleted_at", "is", null).order("deleted_at", { ascending: false });
    setItems((data ?? []) as unknown as Product[]);
  };
  useEffect(() => { load(); }, []);

  const restore = async (p: Product) => {
    await supabase.from("products").update({ deleted_at: null }).eq("id", p.id);
    toast.success("Restaurado"); load();
  };
  const purge = async (p: Product) => {
    if (!confirm(`Eliminar permanentemente "${p.name}"?`)) return;
    await supabase.from("products").delete().eq("id", p.id);
    toast.success("Eliminado permanentemente"); load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Papelera</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border">La papelera está vacía.</div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt="" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">Eliminado: {new Date(p.deleted_at!).toLocaleString("es-CO")}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => restore(p)}><RotateCcw className="w-4 h-4 mr-1" /> Restaurar</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => purge(p)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Trash;
