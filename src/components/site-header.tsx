"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloudSun, Heart, MapPin, Menu, Search, X } from "lucide-react";
import { UnitToggle } from "@/components/unit-toggle";

const LINKS = [
  { href: "/", label: "Inicio", icon: CloudSun },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/acerca", label: "Acerca de", icon: MapPin },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" onClick={closeMenu} className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <CloudSun className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            clima<span className="text-cyan-300">.now</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <UnitToggle compact />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-[#0b1125] px-4 py-3 md:hidden" aria-label="Navegación móvil">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                isActive(href) ? "bg-cyan-300/10 text-cyan-200" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
