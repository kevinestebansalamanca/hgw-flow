// Creates the initial SUPER_ADMIN if it doesn't exist yet, and seeds catalog.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "kevinestebansalamanca2@gmail.com";
const ADMIN_PASSWORD = "HGWColombia_Admin2025!KW";

const SEED_PRODUCTS = [
  {
    name: "Blueberry Coffee HGW",
    category: "Bebidas Wellness",
    price: 89000,
    description:
      "Café premium enriquecido con el delicioso sabor de arándano, diseñado para quienes buscan una experiencia diferente combinando energía, sabor sofisticado y bienestar.",
    benefits: [
      "Energía y vitalidad para el día",
      "Sabor premium con toque de arándano",
      "Experiencia antioxidante inspirada en blueberry",
      "Ideal para rutina diaria",
      "Sensación de bienestar y disfrute",
    ],
    rating: 5,
    featured: true,
    reviews: [
      { name: "Laura M.", stars: 5, text: "Me encanta su sabor, es diferente al café tradicional y se siente premium. Perfecto para comenzar el día con energía." },
      { name: "Andrés P.", stars: 5, text: "Blueberry Coffee se volvió parte de mi rutina, delicioso y práctico." },
    ],
  },
  {
    name: "LactiBerry HGW",
    category: "Bienestar Digestivo",
    price: 95000,
    description:
      "Bebida nutricional inspirada en bienestar digestivo y equilibrio, diseñada para complementar un estilo de vida saludable.",
    benefits: ["Bienestar digestivo", "Sensación de equilibrio", "Fácil de incorporar a la rutina", "Sabor agradable", "Complemento diario"],
    rating: 5,
    featured: true,
    reviews: [
      { name: "Carolina R.", stars: 5, text: "Me gusta porque se siente ligero y fácil de consumir. Excelente para mi rutina." },
      { name: "Jorge T.", stars: 5, text: "Una opción práctica para quienes buscan bienestar integral." },
    ],
  },
  {
    name: "Jabón Detox Real HGW",
    category: "Cuidado Personal",
    price: 45000,
    description: "Jabón premium de limpieza profunda inspirado en frescura, purificación y cuidado personal.",
    benefits: ["Sensación de limpieza profunda", "Frescura revitalizante", "Cuidado diario", "Apariencia de piel renovada", "Rutina premium de higiene"],
    rating: 5,
    featured: true,
    reviews: [
      { name: "Daniela S.", stars: 5, text: "Deja una sensación fresca y limpia, me encanta usarlo diariamente." },
      { name: "Mateo G.", stars: 5, text: "Se siente diferente, premium y refrescante." },
    ],
  },
  {
    name: "Blueberry Jam HGW",
    category: "Gourmet",
    price: 38000,
    description: "Deliciosa mermelada inspirada en el sabor natural del arándano, perfecta para complementar desayunos y momentos especiales.",
    benefits: ["Sabor premium", "Versátil", "Ideal para desayunos", "Experiencia gourmet", "Toque frutal delicioso"],
    rating: 5,
    featured: true,
    reviews: [{ name: "Sofía L.", stars: 5, text: "El sabor es increíble, muy rica y práctica." }],
  },
  {
    name: "Té Verde Natural HGW",
    category: "Bebidas Wellness",
    price: 42000,
    description: "Infusión natural de té verde premium, ideal para momentos de calma, hidratación y estilo de vida saludable.",
    benefits: ["Antioxidante natural", "Aroma delicado", "Ritual diario de bienestar", "Sin azúcares añadidos"],
    rating: 5,
    featured: false,
    reviews: [{ name: "Paola V.", stars: 5, text: "Aroma y sabor excelentes, se nota la calidad." }],
  },
  {
    name: "Suplemento Wellness HGW",
    category: "Suplementos",
    price: 120000,
    description: "Fórmula wellness premium pensada para complementar tu estilo de vida activo y consciente.",
    benefits: ["Soporte energético", "Bienestar integral", "Fácil incorporación", "Calidad premium"],
    rating: 5,
    featured: false,
    reviews: [{ name: "Camilo H.", stars: 5, text: "Excelente complemento, lo recomiendo." }],
  },
  {
    name: "Cuidado Facial Herbal HGW",
    category: "Cuidado Personal",
    price: 78000,
    description: "Tratamiento facial herbal premium con ingredientes inspirados en la naturaleza para un cuidado consciente.",
    benefits: ["Hidratación visible", "Frescura natural", "Textura ligera", "Aroma delicado"],
    rating: 5,
    featured: false,
    reviews: [{ name: "Valentina O.", stars: 5, text: "Mi piel se siente más fresca y suave." }],
  },
  {
    name: "Bebida Energética Natural HGW",
    category: "Bebidas Wellness",
    price: 32000,
    description: "Bebida energética natural premium para momentos activos, sin sacrificar sabor ni bienestar.",
    benefits: ["Energía limpia", "Sabor natural", "Hidratación", "Estilo de vida activo"],
    rating: 5,
    featured: false,
    reviews: [{ name: "Felipe N.", stars: 5, text: "Refrescante y con buena energía." }],
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Find existing user
    const { data: list } = await admin.auth.admin.listUsers();
    let user = list?.users?.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    let created = false;
    if (!user) {
      const { data: newUser, error } = await admin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (error) throw error;
      user = newUser.user!;
      created = true;
    }

    // Ensure super_admin role
    if (user) {
      await admin.from("user_roles").upsert(
        { user_id: user.id, role: "super_admin" },
        { onConflict: "user_id,role" },
      );
    }

    // Seed products if empty
    const { count } = await admin.from("products").select("id", { count: "exact", head: true });
    let seeded = 0;
    if (!count || count === 0) {
      const { error: insErr, data: ins } = await admin.from("products").insert(SEED_PRODUCTS).select("id");
      if (insErr) throw insErr;
      seeded = ins?.length ?? 0;
    }

    return new Response(JSON.stringify({ ok: true, created, seeded }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
