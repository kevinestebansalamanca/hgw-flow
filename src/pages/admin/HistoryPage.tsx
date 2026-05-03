import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Log = { id: string; action: string; entity: string | null; details: any; created_at: string };

export const HistoryPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setLogs((data ?? []) as Log[]));
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Historial de actividad</h1>
      <div className="bg-card rounded-2xl border border-border divide-y divide-border shadow-card">
        {logs.length === 0 && <div className="p-6 text-center text-muted-foreground">Sin actividad aún.</div>}
        {logs.map((l) => (
          <div key={l.id} className="p-4 flex items-center gap-4">
            <div className="px-2 py-1 rounded-md bg-accent text-accent-foreground text-xs font-mono">{l.action}</div>
            <div className="flex-1 text-sm">
              <div className="font-medium">{l.details?.name ?? l.entity ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("es-CO")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HistoryPage;
