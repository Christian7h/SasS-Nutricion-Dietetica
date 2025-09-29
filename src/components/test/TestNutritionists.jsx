// Componente de prueba para verificar la carga de nutricionistas
// Solo para debugging - puedes eliminarlo después

import React from 'react';
import { useNutritionists } from '../hooks/useNutritionists';

export default function TestNutritionists() {
  const { nutritionists, isLoading, error, rawData } = useNutritionists();

  console.log('=== Test Component Debug ===');
  console.log('Raw Data:', rawData);
  console.log('Nutritionists:', nutritionists);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  return (
    <div className="p-4 border rounded-lg bg-base-100">
      <h3 className="text-lg font-bold mb-4">Test - Nutricionistas</h3>
      
      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      <p>Total encontrados: {nutritionists?.length || 0}</p>
      
      {nutritionists?.map((n) => (
        <div key={n.id} className="border p-2 my-2 rounded">
          <strong>{n.name}</strong> - {n.email}
          {n.specialties?.length > 0 && (
            <div className="text-sm text-gray-600">
              Especialidades: {n.specialties.join(', ')}
            </div>
          )}
          <div className="text-xs">
            ID: {n.id} | Disponible: {n.hasAvailability ? 'Sí' : 'No'}
          </div>
        </div>
      ))}
      
      <details className="mt-4">
        <summary>Raw Data</summary>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </details>
    </div>
  );
}