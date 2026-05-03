export type Review = { name: string; stars: number; text: string };

export type Product = {
  id: string;
  name: string;
  description: string | null;
  benefits: string[] | null;
  price: number | null;
  currency: string | null;
  category: string | null;
  images: string[] | null;
  rating: number | null;
  reviews: Review[] | null;
  featured: boolean;
  visible: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export const formatCOP = (n: number | null | undefined) =>
  n == null ? "" : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const WHATSAPP = "573142698881";
export const EMAIL = "kevinestebansalamanca2@gmail.com";
export const FACEBOOK = "https://www.facebook.com/share/1JUQbjeQoQ/";
