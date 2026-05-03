import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const nav = useNavigate();
  const { signIn, isAdmin, user, loading } = useAuth();
  const [email, setEmail] = useState("kevinestebansalamanca2@gmail.com");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Admin · HGW Green World";
    if (!loading && user && isAdmin) nav("/admin/panel", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Bienvenido");
    setTimeout(() => nav("/admin/panel", { replace: true }), 200);
  };

  const onReset = async () => {
    if (!email) return toast.error("Ingresa tu correo primero");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset`,
    });
    if (error) return toast.error(error.message);
    toast.success("Te enviamos un correo de recuperación");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-95" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 30% 20%, hsl(86 85% 55% / 0.4), transparent 40%), radial-gradient(circle at 70% 80%, hsl(142 76% 45% / 0.4), transparent 40%)",
      }} />
      <div className="relative w-full max-w-md glass rounded-3xl p-8 shadow-elegant animate-fade-up">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h1 className="font-display text-3xl font-bold text-center text-primary-foreground mb-2">Panel Admin</h1>
        <p className="text-center text-primary-foreground/70 text-sm mb-8">Acceso seguro · Solo administradores autorizados</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-primary-foreground">Correo</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="pl-10 h-12 bg-background/90" />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-primary-foreground">Contraseña</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="pl-10 pr-10 h-12 bg-background/90" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Mostrar/ocultar">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-12 gradient-lime text-lime-foreground font-bold border-0 shadow-glow hover:scale-[1.02] transition-smooth">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Iniciar sesión"}
          </Button>
          <button type="button" onClick={onReset} className="w-full text-center text-sm text-primary-foreground/70 hover:text-primary-foreground transition-smooth">
            ¿Olvidaste tu contraseña?
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-primary-foreground/50">
          Protegido con encriptación · Auto-bloqueo tras intentos fallidos
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
