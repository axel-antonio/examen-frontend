// src/lib/api.js
import axios from 'axios';

// Función para obtener el tipo de cambio desde Spring Boot
export const getTipoCambio = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/tipo-cambio');
    return response.data.venta;  // Asumimos que el tipo de cambio está bajo 'venta'
  } catch (error) {
    throw new Error('Error al obtener el tipo de cambio');
  }
};

// Función para obtener el historial de conversiones
export const getConversionHistory = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/historial');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el historial de conversiones');
  }
};

