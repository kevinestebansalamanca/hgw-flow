import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/#destacados", label: "Destacados" },
  { to: "/#contacto", label: "Contacto" },
];

export const PublicNav = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className={`text-sm font-medium transition-smooth hover:text-primary ${pathname === l.to ? "text-primary" : "text-foreground/70"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild variant="default" size="sm" className="gradient-primary text-primary-foreground border-0 shadow-elegant">
            <Link to="/catalogo">Ver Productos</Link>
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="py-2 text-foreground/80 hover:text-primary">
                {l.label}
              </a>
            ))}
            <Button asChild className="gradient-primary text-primary-foreground border-0 mt-2">
              <Link to="/catalogo" onClick={() => setOpen(false)}>Ver Productos</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
