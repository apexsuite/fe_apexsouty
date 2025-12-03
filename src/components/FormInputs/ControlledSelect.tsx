import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string | undefined;
  label: string;
}

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: readonly SelectOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  placeholder?: string;
  icon?: LucideIcon;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  required = false,
  disabled = false,
  className,
  description,
  placeholder,
  icon: Icon,
}: ControlledSelectProps<T>) {
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
              {Icon && (
                <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
              )}
              <Select
                value={
                  field.value === undefined || field.value === ''
                    ? undefined
                    : field.value
                }
                onValueChange={value => {
                  // '__all__' özel değerini undefined'a çevir
                  field.onChange(value === '__all__' ? undefined : value);
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  id={name}
                  aria-invalid={fieldState.error ? 'true' : 'false'}
                  className={cn(
                    Icon && 'pl-9',
                    fieldState.error &&
                      'border-destructive focus:ring-destructive/20'
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => {
                    // undefined değerleri için özel '__all__' değeri kullan
                    const selectValue =
                      option.value === undefined ? '__all__' : option.value;
                    return (
                      <SelectItem key={selectValue} value={selectValue}>
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {description && !fieldState.error && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
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
          </div>
        )}
      />
    </div>
  );
}
