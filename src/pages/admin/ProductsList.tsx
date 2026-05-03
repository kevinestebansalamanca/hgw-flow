import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product, formatCOP } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";

export const ProductsList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("products").select("*").is("deleted_at", null)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as unknown as Product[]);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (p: Product, field: "featured" | "visible") => {
    const { error } = await supabase.from("products").update({ [field]: !p[field] }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Actualizado");
    load();
  };

  const softDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString(), visible: false }).eq("id", toDelete.id);
    if (error) return toast.error(error.message);
    if (user) {
      await supabase.from("activity_log").insert({ user_id: user.id, action: "soft_delete", entity: "product", entity_id: toDelete.id, details: { name: toDelete.name } });
    }
    toast.success("Movido a papelera");
    setToDelete(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Productos</h1>
        <Button asChild className="gradient-primary text-primary-foreground border-0">
          <Link to="/admin/panel/productos/nuevo"><Plus className="w-4 h-4 mr-2" /> Nuevo</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
            <div className="aspect-video bg-muted relative">
              {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />}
              {p.featured && <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full gradient-lime text-lime-foreground text-[10px] font-bold">Destacado</div>}
            </div>
            <div className="p-4">
              <div className="font-semibold mb-1 truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{p.category}</div>
              <div className="font-display font-bold text-primary mb-3">{formatCOP(p.price)}</div>
              <div className="grid grid-cols-4 gap-1.5">
                <Button asChild size="sm" variant="outline" className="col-span-2"><Link to={`/admin/panel/productos/${p.id}`}><Edit className="w-3.5 h-3.5 mr-1" /> Editar</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => toggle(p, "featured")} title="Destacado"><Star className={`w-4 h-4 ${p.featured ? "fill-lime text-lime" : ""}`} /></Button>
                <Button size="sm" variant="ghost" onClick={() => toggle(p, "visible")} title="Visible">{p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</Button>
                <Button size="sm" variant="ghost" className="col-span-4 text-destructive hover:text-destructive" onClick={() => setToDelete(p)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>"{toDelete?.name}" se moverá a la papelera. Podrás restaurarlo después.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={softDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default ProductsList;
