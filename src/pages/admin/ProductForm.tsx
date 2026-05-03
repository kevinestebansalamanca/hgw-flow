import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { optimizeImage } from "@/lib/image";
import { Product } from "@/lib/products";
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const nav = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({
    name: "", description: "", price: 0, category: "", benefits: [],
    images: [], featured: false, visible: true, rating: 5, currency: "COP",
  });
  const [benefitsText, setBenefitsText] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    supabase.from("products").select("*").eq("id", id!).single().then(({ data }) => {
      if (data) {
        setForm(data as unknown as Product);
        setBenefitsText((data.benefits ?? []).join("\n"));
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await optimizeImage(file);
        const path = `products/${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage.from("products").upload(path, blob, {
          contentType: "image/webp", cacheControl: "31536000",
        });
        if (error) throw error;
        const { data } = supabase.storage.from("products").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setForm((f) => ({ ...f, images: [...(f.images ?? []), ...uploaded] }));
      toast.success(`${uploaded.length} imagen(es) optimizadas y subidas`);
    } catch (e: any) {
      toast.error(e.message ?? "Error subiendo imágenes");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: (f.images ?? []).filter((u) => u !== url) }));
  };

  const save = async () => {
    if (!form.name?.trim()) return toast.error("Nombre requerido");
    setSaving(true);
    const payload = {
      name: form.name!.trim(),
      description: form.description ?? "",
      price: Number(form.price ?? 0),
      category: form.category ?? "",
      benefits: benefitsText.split("\n").map((s) => s.trim()).filter(Boolean),
      images: form.images ?? [],
      featured: !!form.featured,
      visible: form.visible !== false,
      rating: Number(form.rating ?? 5),
      currency: "COP",
    };

    const res = isEdit
      ? await supabase.from("products").update(payload).eq("id", id!)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    if (user) {
      await supabase.from("activity_log").insert({
        user_id: user.id, action: isEdit ? "update" : "create", entity: "product", entity_id: id ?? null,
        details: { name: payload.name },
      });
    }
    toast.success(isEdit ? "Producto actualizado" : "Producto creado");
    nav("/admin/panel/productos");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => nav(-1)} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
      <h1 className="font-display text-3xl font-bold mb-6">{isEdit ? "Editar producto" : "Nuevo producto"}</h1>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-5 shadow-card">
        <div>
          <Label>Imágenes</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
            {(form.images ?? []).map((u) => (
              <div key={u} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                <img src={u} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(u)} type="button" className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-smooth">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-smooth">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span className="text-xs">Subir</span>
              <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => onUpload(e.target.files)} />
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Optimización automática a WebP · Móvil + cámara + galería</p>
        </div>

        <div>
          <Label>Nombre</Label>
          <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Categoría</Label>
            <Input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ej: Bebidas Wellness" />
          </div>
          <div>
            <Label>Precio (COP)</Label>
            <Input type="number" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div>
          <Label>Beneficios (uno por línea)</Label>
          <Textarea rows={4} value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div><div className="font-medium">Destacado</div><div className="text-xs text-muted-foreground">Aparece en la home</div></div>
            <Switch checked={!!form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div><div className="font-medium">Visible</div><div className="text-xs text-muted-foreground">Mostrar al público</div></div>
            <Switch checked={form.visible !== false} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
          </div>
        </div>

        <Button onClick={save} disabled={saving} className="w-full h-12 gradient-primary text-primary-foreground border-0 shadow-elegant">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </div>
  );
};
export default ProductForm;
