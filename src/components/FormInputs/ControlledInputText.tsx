import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

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
}

export function ControlledInputText<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    disabled = false,
    type = 'text',
    required = false,
    className
}: ControlledInputTextProps<T>) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                        <Input
                            {...field}
                            id={name}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            aria-invalid={fieldState.error ? 'true' : 'false'}
                            className={cn(fieldState.error && 'border-destructive focus-visible:ring-destructive/20')}
                        />
                        {fieldState.error && (
                            <span className="text-xs font-medium text-destructive">{fieldState.error.message}</span>
                        )}
                    </div>
                )}
            />
        </div>
    );
}