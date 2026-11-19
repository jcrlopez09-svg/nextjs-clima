"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ background: "#070b1a", color: "#e8eefc", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: 560, margin: "15vh auto", padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28 }}>Error crítico</h1>
          <p style={{ color: "#9aa8c7", marginTop: 12 }}>
            La aplicación no pudo iniciarse. {error.message}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              borderRadius: 999,
              border: 0,
              background: "#67e8f9",
              color: "#070b1a",
              fontWeight: 700,
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
