import { Link } from "react-router-dom";
import logoSrc from "@/assets/logo-hgw.png";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`}>
    <img
      src={logoSrc}
      alt="HGW Green World Colombia"
      className="h-10 w-auto transition-smooth group-hover:scale-105"
      width={120}
      height={40}
    />
  </Link>
);
