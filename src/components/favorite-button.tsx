"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { GeocodingResult } from "@/types/weather";

export function FavoriteButton({
  city,
  className = "",
}: {
  city: GeocodingResult;
  className?: string;
}) {
  const { hydrated, isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(city.id);

  return (
    <button
      type="button"
      disabled={!hydrated}
      onClick={() => toggleFavorite(city)}
      aria-label={active ? `Quitar ${city.name} de favoritos` : `Guardar ${city.name} en favoritos`}
      title={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors disabled:opacity-40 ${
        active
          ? "border-rose-300/60 bg-rose-400/20 text-rose-200"
          : "border-white/15 bg-white/5 text-slate-300 hover:border-rose-300/50 hover:text-rose-200"
      } ${className}`}
    >
      <Heart className="h-4.5 w-4.5" fill={active ? "currentColor" : "none"} />
    </button>
  );
}
