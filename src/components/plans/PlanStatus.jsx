import { usePlanOperations } from '../../hooks/usePlanOperations';

export default function PlanStatus({ plan }) {
  const { updateStatus } = usePlanOperations();

  const statusOptions = [
    { value: 'active', label: 'Activo', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completado', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  const handleStatusChange = (newStatus) => {
    updateStatus.mutate({
      planId: plan._id,
      status: newStatus
    });
  };

  const currentStatus = statusOptions.find(status => status.value === plan.status);

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">
        Estado del Plan
      </label>
      <div className="mt-1">
        <select
          value={plan.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </div>
    </div>
  );
}