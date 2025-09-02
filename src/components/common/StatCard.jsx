import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function StatCard({ title, value, change, changeType, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'from-primary to-primary-focus',
    secondary: 'from-secondary to-secondary-focus',
    accent: 'from-accent to-accent-focus',
    success: 'from-success to-success-focus',
    warning: 'from-warning to-warning-focus',
    error: 'from-error to-error-focus',
    info: 'from-info to-info-focus'
  };

  const textColorClasses = {
    primary: 'text-primary-content',
    secondary: 'text-secondary-content',
    accent: 'text-accent-content',
    success: 'text-success-content',
    warning: 'text-warning-content',
    error: 'text-error-content',
    info: 'text-info-content'
  };

  return (
    <div className={`card bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`card-title text-sm font-medium ${textColorClasses[color]} opacity-90`}>
              {title}
            </h2>
            <p className={`text-3xl font-bold ${textColorClasses[color]}`}>
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {changeType === 'increase' ? (
                  <ArrowUpIcon className={`w-4 h-4 ${textColorClasses[color]} opacity-75`} />
                ) : changeType === 'decrease' ? (
                  <ArrowDownIcon className={`w-4 h-4 ${textColorClasses[color]} opacity-75`} />
                ) : null}
                <span className={`text-sm ${textColorClasses[color]} opacity-75 ml-1`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
              <Icon className={`w-8 h-8 ${textColorClasses[color]}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
