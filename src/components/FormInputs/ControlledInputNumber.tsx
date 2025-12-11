import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ControlledInputNumberProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ControlledInputNumber<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  className,
}: ControlledInputNumberProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive -ml-1">*</span>}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Input
                {...field}
                id={name}
                type="number"
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.error ? 'true' : 'false'}
                className={cn(
                  fieldState.error &&
                    'border-destructive focus-visible:ring-destructive/20'
                )}
              />
            </div>
            {fieldState.error && (
              <motion.span
                animate={{
                  opacity: fieldState.error ? 1 : 0,
                  y: fieldState.error ? 0 : -10,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="text-destructive block min-h-[20px] text-xs font-medium"
              >
                {fieldState.error?.message}
              </motion.span>
            )}
          </div>
        )}
      />
    </div>
  );
}
