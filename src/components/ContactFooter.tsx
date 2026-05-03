import { Mail, MessageCircle, Facebook, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { EMAIL, WHATSAPP, FACEBOOK } from "@/lib/products";

const CopyBtn = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(`${label} copiado correctamente`);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-2 rounded-lg hover:bg-accent transition-smooth"
      aria-label={`Copiar ${label}`}
    >
      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
};

export const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-95" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, hsl(86 85% 55% / 0.5), transparent 40%), radial-gradient(circle at 80% 70%, hsl(142 76% 45% / 0.4), transparent 40%)",
      }} />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-up">
          <div className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold tracking-widest uppercase text-primary-foreground mb-4">
            Contáctanos
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Hablemos. Estamos para ti.
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Atención rápida, profesional y cercana — desde Colombia para el mundo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Email */}
          <div className="glass rounded-2xl p-6 transition-smooth hover:scale-[1.02] hover:shadow-glow">
            <div className="w-12 h-12 rounded-xl gradient-lime flex items-center justify-center mb-4 shadow-glow">
              <Mail className="w-6 h-6 text-lime-foreground" />
            </div>
            <div className="text-primary-foreground font-semibold mb-1">Correo electrónico</div>
            <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4 break-all">
              {EMAIL}
              <CopyBtn text={EMAIL} label="Correo" />
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-primary-foreground text-primary font-semibold hover:scale-[1.02] transition-smooth shadow-elegant"
            >
              Enviar Correo
            </a>
          </div>

          {/* WhatsApp */}
          <div className="glass rounded-2xl p-6 transition-smooth hover:scale-[1.02] hover:shadow-glow">
            <div className="w-12 h-12 rounded-xl gradient-lime flex items-center justify-center mb-4 animate-pulse-glow">
              <MessageCircle className="w-6 h-6 text-lime-foreground" />
            </div>
            <div className="text-primary-foreground font-semibold mb-1">WhatsApp</div>
            <div className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4">
              +57 311 464 3478
              <CopyBtn text="3114643478" label="Número" />
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl gradient-lime text-lime-foreground font-semibold hover:scale-[1.02] transition-smooth shadow-glow"
            >
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Facebook */}
          <div className="glass rounded-2xl p-6 transition-smooth hover:scale-[1.02] hover:shadow-glow">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <Facebook className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground font-semibold mb-1">Facebook oficial</div>
            <div className="text-primary-foreground/80 text-sm mb-4">HGW Green World Colombia</div>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-primary-foreground text-primary font-semibold hover:scale-[1.02] transition-smooth shadow-elegant"
            >
              Visitar Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="bg-background border-t border-border">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Bienestar, ciencia y naturaleza unidos en productos premium pensados para tu estilo de vida.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-foreground">Explorar</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/" className="hover:text-primary transition-smooth">Inicio</a></li>
            <li><a href="/catalogo" className="hover:text-primary transition-smooth">Catálogo</a></li>
            <li><a href="/#destacados" className="hover:text-primary transition-smooth">Destacados</a></li>
            <li><a href="/#contacto" className="hover:text-primary transition-smooth">Contacto</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-foreground">Contacto</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Correo: <a href={`mailto:${EMAIL}`} className="hover:text-primary break-all">{EMAIL}</a></li>
            <li>WhatsApp: <a href={`https://wa.me/${WHATSAPP}`} className="hover:text-primary">+57 311 464 3478</a></li>
            <li>Facebook: <a href={FACEBOOK} target="_blank" rel="noreferrer" className="hover:text-primary">HGW Green World Colombia</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
        © HGW Green World Colombia 2026 · Todos los derechos reservados
      </div>
    </div>

    {/* Floating WhatsApp */}
    <a
      href={`https://wa.me/${WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full gradient-lime flex items-center justify-center shadow-glow animate-pulse-glow hover:scale-110 transition-smooth"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-lime-foreground" />
    </a>
  </footer>
);
