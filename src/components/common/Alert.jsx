import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const icons = {
  error: XCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
};

const colors = {
  error: 'red',
  success: 'green',
  warning: 'yellow',
};

export default function Alert({ type = 'error', message }) {
  const Icon = icons[type];
  const color = colors[type];

  return (
    <div className={`rounded-md bg-${color}-50 p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 text-${color}-400`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium text-${color}-800`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}