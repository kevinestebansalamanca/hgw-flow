import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`}>
    <div className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-smooth group-hover:scale-105">
      <Leaf className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
    </div>
    <div className="leading-tight">
      <div className="font-display font-bold text-lg text-foreground">HGW</div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground -mt-0.5">Green World</div>
    </div>
  </Link>
);
