import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
    },
    info: {
      bg: 'bg-cyan-50 border-cyan-200',
      icon: Info,
      iconColor: 'text-cyan-600',
      textColor: 'text-cyan-800',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${config.bg} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}>
        <div className="flex items-start space-x-3">
          <Icon className={config.iconColor} size={24} />
          <div className="flex-1">
            <p className={`${config.textColor} font-medium`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;