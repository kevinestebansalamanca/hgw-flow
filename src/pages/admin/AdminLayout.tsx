import { ReactNode, useEffect, useRef } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, Plus, Package, Trash2, ShieldCheck, History, Mail, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const items = [
  { to: "/admin/panel", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/panel/productos/nuevo", label: "+ Agregar Producto", icon: Plus },
  { to: "/admin/panel/productos", label: "Productos", icon: Package },
  { to: "/admin/panel/papelera", label: "Papelera", icon: Trash2 },
  { to: "/admin/panel/seguridad", label: "Seguridad", icon: ShieldCheck },
  { to: "/admin/panel/historial", label: "Historial", icon: History },
  { to: "/admin/panel/contacto", label: "Contacto", icon: Mail },
];

const INACTIVITY_MS = 30 * 60 * 1000; // 30 min

export const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const reset = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(async () => {
        toast.info("Sesión cerrada por inactividad");
        await signOut();
        nav("/admin");
      }, INACTIVITY_MS);
    };
    reset();
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [user, nav, signOut]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }
  if (!user || !isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-4 sticky top-0 h-screen">
        <div className="px-2 mb-8"><Logo /></div>
        <nav className="flex-1 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                  isActive ? "gradient-primary text-primary-foreground shadow-elegant" : "text-foreground/70 hover:bg-accent hover:text-foreground"
                }`
              }
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <Button variant="outline" className="mt-4" onClick={async () => { await signOut(); nav("/admin"); }}>
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border">
        <div className="grid grid-cols-5">
          {items.slice(0, 5).map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 text-[10px] ${isActive ? "text-primary" : "text-muted-foreground"}`
            }>
              <it.icon className="w-5 h-5" />
              <span className="truncate max-w-[60px]">{it.label.replace("+ ", "")}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="lg:hidden sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border p-4 flex items-center justify-between">
          <Logo />
          <Button size="sm" variant="outline" onClick={async () => { await signOut(); nav("/admin"); }}>
            <LogOut className="w-4 h-4" />
          </Button>
        </header>
        <div className="p-4 md:p-8">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
};
