import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  themeColor?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  themeColor = 'emerald',
  variant = 'danger'
}: ConfirmModalProps) {
  const theme = {
    text: themeColor === 'emerald' ? 'text-emerald-600' :
          themeColor === 'blue' ? 'text-blue-600' :
          themeColor === 'amber' ? 'text-amber-600' :
          themeColor === 'indigo' ? 'text-indigo-600' :
          themeColor === 'purple' ? 'text-purple-600' :
          themeColor === 'rose' ? 'text-rose-600' :
          'text-slate-600',
    bg: themeColor === 'emerald' ? 'bg-emerald-600' :
        themeColor === 'blue' ? 'bg-blue-600' :
        themeColor === 'amber' ? 'bg-amber-600' :
        themeColor === 'indigo' ? 'bg-indigo-600' :
        themeColor === 'purple' ? 'bg-purple-600' :
        themeColor === 'rose' ? 'bg-rose-600' :
        'bg-slate-600',
    hover: themeColor === 'emerald' ? 'hover:bg-emerald-500' :
           themeColor === 'blue' ? 'hover:bg-blue-500' :
           themeColor === 'amber' ? 'hover:bg-amber-500' :
           themeColor === 'indigo' ? 'hover:bg-indigo-500' :
           themeColor === 'purple' ? 'hover:bg-purple-500' :
           themeColor === 'rose' ? 'hover:bg-rose-500' :
           'hover:bg-slate-500',
  };

  const variantClasses = {
    danger: {
      icon: 'text-red-600',
      iconBg: 'bg-red-50',
      btn: 'bg-red-600 hover:bg-red-500',
      border: 'border-red-100'
    },
    warning: {
      icon: 'text-amber-600',
      iconBg: 'bg-amber-50',
      btn: 'bg-amber-600 hover:bg-amber-500',
      border: 'border-amber-100'
    },
    info: {
      icon: theme.text,
      iconBg: themeColor === 'emerald' ? 'bg-emerald-50' : 'bg-stone-50',
      btn: theme.bg + ' ' + theme.hover,
      border: themeColor === 'emerald' ? 'border-emerald-100' : 'border-stone-100'
    }
  };

  const v = variantClasses[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", v.iconBg)}>
                  <AlertTriangle className={cn("w-7 h-7", v.icon)} />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
              <p className="text-stone-500 leading-relaxed mb-8">
                {message}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={cn("flex-1 py-3 px-4 text-white rounded-xl font-bold transition-all shadow-lg", v.btn)}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
