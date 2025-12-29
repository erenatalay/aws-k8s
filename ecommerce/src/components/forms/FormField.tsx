'use client';

import { useField } from 'formik';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  disabled,
  className,
}: FormFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-200"
      >
        {label}
      </label>
      <Input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'bg-slate-900 text-slate-50 border-slate-800',
          hasError && 'border-red-500 focus:ring-red-500',
        )}
      />
      {hasError && (
        <p className="text-sm text-red-400">{meta.error}</p>
      )}
    </div>
  );
}

