import Link from "next/link";
import { Code2, Wind } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-slate-400 sm:flex-row sm:px-6 sm:text-left">
        <p className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-cyan-300" />
          Datos meteorológicos de{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-300 hover:underline"
          >
            Open-Meteo
          </a>
        </p>
        <div className="flex items-center gap-5">
          <Link href="/acerca" className="hover:text-white">Tecnología</Link>
          <a
            href="https://github.com/JairoAdrianVR/Bootcamp-FSJ35"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white"
          >
            <Code2 className="h-4 w-4" /> Repositorio
          </a>
        </div>
      </div>
    </footer>
  );
}
