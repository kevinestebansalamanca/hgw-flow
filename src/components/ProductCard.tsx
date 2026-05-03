import { Star, MessageCircle } from "lucide-react";
import { Product, formatCOP, WHATSAPP } from "@/lib/products";

const placeholder = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23dcfce7'/><stop offset='1' stop-color='%23bbf7d0'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/><text x='50%' y='50%' font-family='Georgia' font-size='28' fill='%23166534' text-anchor='middle' dominant-baseline='middle'>HGW</text></svg>`
);

export const Stars = ({ value = 5 }: { value?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < value ? "fill-lime text-lime" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

export const ProductCard = ({ product }: { product: Product }) => {
  const img = product.images?.[0] || placeholder;
  return (
    <article className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1 border border-border/50 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full gradient-lime text-lime-foreground text-xs font-bold shadow-glow">
            Destacado
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full glass text-xs font-medium text-foreground">
            {product.category}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-1">{product.name}</h3>
        <Stars value={Math.round(product.rating ?? 5)} />
        <p className="mt-3 text-sm text-muted-foreground line-clamp-3 flex-1">{product.description}</p>
        {!!product.benefits?.length && (
          <ul className="mt-3 space-y-1">
            {product.benefits.slice(0, 3).map((b, i) => (
              <li key={i} className="text-xs text-foreground/70 flex gap-1.5">
                <span className="text-primary">✦</span> {b}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="font-display text-2xl font-bold text-gradient">{formatCOP(product.price)}</div>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola HGW, me interesa ${product.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:scale-105 transition-smooth shadow-elegant"
          >
            <MessageCircle className="w-4 h-4" /> Comprar
          </a>
        </div>
      </div>
    </article>
  );
};
