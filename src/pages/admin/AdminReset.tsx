import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminReset = () => {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  useEffect(() => { document.title = "Restablecer contraseña · HGW"; }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 10) return toast.error("Mínimo 10 caracteres");
    if (pw !== pw2) return toast.error("Las contraseñas no coinciden");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Contraseña actualizada");
    nav("/admin/panel");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <form onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-md space-y-4 shadow-elegant">
        <h1 className="font-display text-2xl font-bold text-primary-foreground">Nueva contraseña</h1>
        <Input type="password" placeholder="Nueva contraseña" value={pw} onChange={(e) => setPw(e.target.value)} className="h-12 bg-background/90" />
        <Input type="password" placeholder="Confirmar contraseña" value={pw2} onChange={(e) => setPw2(e.target.value)} className="h-12 bg-background/90" />
        <Button type="submit" className="w-full h-12 gradient-lime text-lime-foreground font-bold border-0">Actualizar</Button>
      </form>
    </div>
  );
};
export default AdminReset;
