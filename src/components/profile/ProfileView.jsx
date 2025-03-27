import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PencilIcon } from '@heroicons/react/24/outline';
import ProfileForm from './ProfileForm';

const daysTranslation = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export default function ProfileView({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <ProfileForm user={user} onClose={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mi Perfil</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Editar perfil
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
          <p className="mt-1 text-sm text-gray-900">{user.profile?.phone || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
          <p className="mt-1 text-sm text-gray-900">{user.profile?.address || '-'}</p>
        </div>

        {user.profile?.birthDate && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fecha de nacimiento</h3>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(user.profile.birthDate), 'PP', { locale: es })}
            </p>
          </div>
        )}

        {user.profile?.gender && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Género</h3>
            <p className="mt-1 text-sm text-gray-900">
              {user.profile.gender === 'male' ? 'Masculino' : 
               user.profile.gender === 'female' ? 'Femenino' : 'Otro'}
            </p>
          </div>
        )}

        {user.role === 'nutritionist' && (
          <>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Número de licencia</h3>
              <p className="mt-1 text-sm text-gray-900">{user.profile?.license || '-'}</p>
            </div>

            {user.profile?.specialties?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Especialidades</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {user.profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.profile?.availability?.length > 0 && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Disponibilidad</h3>
                <div className="grid gap-2">
                  {user.profile.availability.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-900">
                      <span className="font-medium">{daysTranslation[slot.day]}:</span>
                      {slot.hours.map((hour, hourIndex) => (
                        <span key={hourIndex}>
                          {hour.start} - {hour.end}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}