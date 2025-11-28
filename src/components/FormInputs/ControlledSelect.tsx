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
import { LucideIcon } from 'lucide-react';

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
    icon?: LucideIcon;
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
    icon: Icon
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
                    <div className="relative">
                        {Icon && (
                            <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        )}
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={disabled}
                        >
                            <SelectTrigger
                                id={name}
                                aria-invalid={error ? 'true' : 'false'}
                                className={cn(
                                    Icon && 'pl-9',
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
                    </div>
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

