"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card empty" style={{ margin: 24 }}>
      <h3>Algo não saiu como esperado.</h3>
      <p>Não foi possível carregar esta página. Tente novamente; se continuar, avise a coordenação.</p>
      <button className="btn" onClick={reset}>Tentar novamente</button>
    </div>
  );
}
