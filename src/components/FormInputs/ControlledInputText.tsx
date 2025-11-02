import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface ControlledInputTextProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    type?: string;
    error?: FieldError;
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
    type = 'text',
    error,
    required = false,
    disabled = false,
    className,
    description,
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
                render={({ field }) => (
                    <Input
                        {...field}
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-invalid={error ? 'true' : 'false'}
                        className={cn(error && 'border-destructive focus-visible:ring-destructive/20')}
                    />
                )}
            />

            {description && !error && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}

            {error && (
                <p className="text-sm font-medium text-destructive">{error.message}</p>
            )}
        </div>
    );
}