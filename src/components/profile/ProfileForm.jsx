import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

export default function ProfileForm({ user, onClose }) {
  const [profile, setProfile] = useState({
    phone: user.profile?.phone || '',
    address: user.profile?.address || '',
    birthDate: user.profile?.birthDate ? new Date(user.profile.birthDate).toISOString().split('T')[0] : '',
    gender: user.profile?.gender || '',
    license: user.profile?.license || '',
    specialties: user.profile?.specialties || [],
    availability: user.profile?.availability || [
      { day: 'monday', hours: [{ start: '09:00', end: '17:00' }] }
    ]
  });

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (profileData) => api.put('/auth/profile', { 
        profile: {
            phone: profileData.phone || undefined,
            address: profileData.address || undefined,
            birthDate: profileData.birthDate || undefined,
            gender: profileData.gender || undefined,
            // Solo incluir campos de nutricionista si el rol es correcto
            ...(user.role === 'nutritionist' && {
                license: profileData.license,
                specialties: profileData.specialties,
                availability: profileData.availability
            })
        }
    }),
    onSuccess: () => {
        queryClient.invalidateQueries(['user']);
        toast.success('Perfil actualizado correctamente');
        onClose?.();
    },
    onError: (error) => {
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           'Error al actualizar perfil';
        toast.error(errorMessage);
    }
});

const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filtrar campos vacíos
    const cleanProfile = Object.entries(profile).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            if (Array.isArray(value) && value.length === 0) return acc;
            acc[key] = value;
        }
        return acc;
    }, {});

    updateProfile.mutate(cleanProfile);
};

  const handleSpecialtyChange = (e) => {
    const specialties = e.target.value.split(',').map(s => s.trim());
    setProfile(prev => ({ ...prev, specialties }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            value={profile.birthDate}
            onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Género
          </label>
          <select
  value={profile.gender || 'other'} // Valor por defecto válido
  onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
  required
>
  <option value="male">Masculino</option>
  <option value="female">Femenino</option>
  <option value="other">Otro</option>
</select>
        </div>

        {user.role === 'nutritionist' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de licencia
              </label>
              <input
                type="text"
                value={profile.license}
                onChange={(e) => setProfile(prev => ({ ...prev, license: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Especialidades
              </label>
              <input
                type="text"
                value={profile.specialties.join(', ')}
                onChange={handleSpecialtyChange}
                placeholder="Separadas por comas"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidad
              </label>
              {profile.availability.map((slot, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <select
                    value={slot.day}
                    onChange={(e) => {
                      const newAvailability = [...profile.availability];
                      newAvailability[index].day = e.target.value;
                      setProfile(prev => ({ ...prev, availability: newAvailability }));
                    }}
                    className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="monday">Lunes</option>
                    <option value="tuesday">Martes</option>
                    <option value="wednesday">Miércoles</option>
                    <option value="thursday">Jueves</option>
                    <option value="friday">Viernes</option>
                    <option value="saturday">Sábado</option>
                    <option value="sunday">Domingo</option>
                  </select>
                  <input
                    type="time"
                    value={slot.hours[0]?.start}
                    onChange={(e) => {
                      const newAvailability = [...profile.availability];
                      newAvailability[index].hours[0].start = e.target.value;
                      setProfile(prev => ({ ...prev, availability: newAvailability }));
                    }}
                    className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <input
                    type="time"
                    value={slot.hours[0]?.end}
                    onChange={(e) => {
                      const newAvailability = [...profile.availability];
                      newAvailability[index].hours[0].end = e.target.value;
                      setProfile(prev => ({ ...prev, availability: newAvailability }));
                    }}
                    className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setProfile(prev => ({
                    ...prev,
                    availability: [
                      ...prev.availability,
                      { day: 'monday', hours: [{ start: '09:00', end: '17:00' }] }
                    ]
                  }));
                }}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                + Agregar horario
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}