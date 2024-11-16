'use client'
import { useEffect, useState } from "react";
import { getTipoCambio } from "../lib/api";
import TipoCambioCard from "../components/TipoCambioCard";

export default function Home() {
  const [tipoCambio, setTipoCambio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipoCambio = async () => {
      try {
        const data = await getTipoCambio();
        setTipoCambio(data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el tipo de cambio.");
        setLoading(false);
      }
    };

    fetchTipoCambio();
  }, []);

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <Header />
      {tipoCambio && <TipoCambioCard tipoCambio={tipoCambio} />}
    </div>
  );
}

const Header = () => (
  <header className="bg-blue-600 w-full py-4 text-white text-center font-bold text-xl">
    Tipo de Cambio - Banco de Guatemala
  </header>
);
