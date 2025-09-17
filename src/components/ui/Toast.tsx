import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, Toast as ToastType } from '../../context/ToastContext';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-500/90 border-green-400 text-white',
  error: 'bg-red-500/90 border-red-400 text-white',
  warning: 'bg-yellow-500/90 border-yellow-400 text-black',
  info: 'bg-blue-500/90 border-blue-400 text-white',
};

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const Icon = iconMap[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-lg max-w-md ${colorMap[toast.type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:bg-black/10 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};