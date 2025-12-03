import { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface ControlledPasswordProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  icon?: LucideIcon;
  autoComplete?: 'current-password' | 'new-password' | 'off';
}

export function ControlledPassword<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  className,
  icon: Icon,
  autoComplete = 'off',
}: ControlledPasswordProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

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
                <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              )}
              <Input
                {...field}
                id={name}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.error ? 'true' : 'false'}
                className={cn(
                  Icon && 'pl-9',
                  'pr-10',
                  fieldState.error &&
                    'border-destructive focus-visible:ring-destructive/20'
                )}
                autoComplete={autoComplete}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-0 h-8 w-8 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
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
