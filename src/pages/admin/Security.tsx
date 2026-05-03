import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Security = () => {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  const change = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 10) return toast.error("Mínimo 10 caracteres");
    if (pw !== pw2) return toast.error("Las contraseñas no coinciden");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Contraseña actualizada");
    setPw(""); setPw2("");
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-bold mb-6">Seguridad</h1>
      <form onSubmit={change} className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-card">
        <h2 className="font-semibold">Cambiar contraseña</h2>
        <div>
          <Label>Nueva contraseña</Label>
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div>
          <Label>Confirmar contraseña</Label>
          <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="gradient-primary text-primary-foreground border-0">Actualizar contraseña</Button>
      </form>

      <div className="mt-6 bg-card rounded-2xl border border-border p-6 shadow-card">
        <h2 className="font-semibold mb-2">Sesión</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✦ Auto-cierre por inactividad: 30 minutos</li>
          <li>✦ Bloqueo tras 5 intentos fallidos: 5 minutos</li>
          <li>✦ Verificación de contraseñas filtradas (HIBP) activa</li>
          <li>✦ Encriptación segura · Hash bcrypt</li>
        </ul>
      </div>
    </div>
  );
};
export default Security;
