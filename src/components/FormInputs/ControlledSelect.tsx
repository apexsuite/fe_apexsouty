import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

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
                    <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            id={name}
                            aria-invalid={error ? 'true' : 'false'}
                            className={cn(
                                error && 'border-destructive focus:ring-destructive/20'
                            )}
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options
                                .filter((option) => option.value !== '')
                                .map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
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

