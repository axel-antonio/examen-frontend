// src/pages/tipo-cambio.js
'use client'
import { getTipoCambio } from '../lib/api';
import styles from '../styles/tipo-cambio.module.css';
import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, DollarSign, ArrowRightLeft } from 'lucide-react'

export default function TipoDeCambio() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tipoCambio, setTipoCambio] = useState<number | null>(null)
  const [cantidadQuetzales, setCantidadQuetzales] = useState<string>('1')
  const [cantidadDolares, setCantidadDolares] = useState<string>('0')

  const fetchTipoCambio = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/currency', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Error al obtener el tipo de cambio')
      }

      const data = await response.json()
      // Asumiendo que el tipo de cambio está en data.Vars[0].venta
      const nuevoCambio = parseFloat(data.data.Envelope.Body.TipoCambioResponse.TipoCambioResult.Vars[0].venta._text)
      setTipoCambio(nuevoCambio)
      actualizarConversion(cantidadQuetzales, nuevoCambio)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  const actualizarConversion = (quetzales: string, cambio: number | null) => {
    if (cambio) {
      const dolares = (parseFloat(quetzales) / cambio).toFixed(2)
      setCantidadDolares(dolares)
    }
  }

  const handleQuetzalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidadQuetzales(e.target.value)
    actualizarConversion(e.target.value, tipoCambio)
  }

  useEffect(() => {
    fetchTipoCambio()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Conversión de Moneda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tipo de Cambio */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">1 USD = </span>
              {loading ? (
                <span className="text-lg font-bold animate-pulse">Cargando...</span>
              ) : (
                <span className="text-lg font-bold">{tipoCambio?.toFixed(2) || '---'} GTQ</span>
              )}
            </div>

            {/* Campo Quetzales */}
            <div className="space-y-2">
              <Label htmlFor="quetzales">Quetzales (GTQ)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="quetzales"
                  type="number"
                  value={cantidadQuetzales}
                  onChange={handleQuetzalesChange}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Icono de Conversión */}
            <div className="flex justify-center">
              <ArrowRightLeft className="text-gray-500" />
            </div>

            {/* Campo Dólares */}
            <div className="space-y-2">
              <Label htmlFor="dolares">Dólares (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="dolares"
                  type="text"
                  value={cantidadDolares}
                  readOnly
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Botón para actualizar tipo de cambio */}
        <CardFooter>
          <Button 
            onClick={fetchTipoCambio} 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualizar Tipo de Cambio
          </Button>
        </CardFooter>
      </Card>

      {/* Error */}
      {error && (
        <div className="mt-4 text-center text-red-500">{error}</div>
      )}
    </div>
  )
}
