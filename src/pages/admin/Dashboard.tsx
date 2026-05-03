import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Package, Star, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Stat = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
    <div className="font-display text-3xl font-bold text-foreground">{value}</div>
  </div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, featured: 0, deleted: 0 });

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("featured", true).is("deleted_at", null),
        supabase.from("products").select("id", { count: "exact", head: true }).not("deleted_at", "is", null),
      ]);
      setStats({ total: a.count ?? 0, featured: b.count ?? 0, deleted: c.count ?? 0 });
    })();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tu tienda HGW Green World</p>
        </div>
        <Button asChild className="gradient-primary text-primary-foreground border-0 shadow-elegant">
          <Link to="/admin/panel/productos/nuevo"><Plus className="w-4 h-4 mr-2" /> Agregar Producto</Link>
        </Button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Productos activos" value={stats.total} icon={Package} color="gradient-primary" />
        <Stat label="Destacados" value={stats.featured} icon={Star} color="gradient-lime" />
        <Stat label="En papelera" value={stats.deleted} icon={Trash2} color="bg-destructive" />
      </div>
    </div>
  );
};
export default Dashboard;
