import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

import { LucideIcon } from 'lucide-react';

interface ControlledInputTextProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  icon?: LucideIcon;
}

export function ControlledInputText<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  type = 'text',
  required = false,
  icon: Icon,
}: ControlledInputTextProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-destructive -ml-1">*</span>}
            </Label>
          )}
          <InputGroup>
            {Icon && (
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Icon />
                </InputGroupText>
              </InputGroupAddon>
            )}
            <InputGroupInput
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
            />
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
  );
}
