import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface SelectOption {
    value: string;
    label: string;
}

interface ControlledSelectProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    options: SelectOption[];
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    description?: string;
    placeholder?: string;
}

export function ControlledSelect<T extends FieldValues>({
    control,
    name,
    label,
    options,
    error,
    required = false,
    disabled = false,
    className,
    description,
    placeholder,
}: ControlledSelectProps<T>) {
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
                    <select
                        {...field}
                        id={name}
                        disabled={disabled}
                        aria-invalid={error ? 'true' : 'false'}
                        className={cn(
                            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                            error && 'border-destructive focus-visible:ring-destructive/20'
                        )}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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

