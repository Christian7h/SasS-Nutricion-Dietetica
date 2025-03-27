import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  );
}