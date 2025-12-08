import { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
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
}: ControlledPasswordProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
            <InputGroup
              className={cn(
                fieldState.error &&
                  'has-[input[aria-invalid=true]]:border-destructive/36 has-[input[aria-invalid=true]:focus-visible]:border-destructive/64'
              )}
            >
              {Icon && (
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <Icon className="h-4 w-4" />
                  </InputGroupText>
                </InputGroupAddon>
              )}
              <InputGroupInput
                {...field}
                id={name}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.error ? 'true' : 'false'}
                autoComplete="off"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
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
              </InputGroupAddon>
            </InputGroup>
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
