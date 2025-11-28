import { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

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
    autoComplete?: string;
}

export function ControlledInputText<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    disabled = false,
    type = 'text',
    required = false,
    className,
    icon: Icon,
    autoComplete
}: ControlledInputTextProps<T>) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

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
                        <div className="relative">
                            {Icon && (
                                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            )}
                            <Input
                                {...field}
                                id={name}
                                type={inputType}
                                placeholder={placeholder}
                                disabled={disabled}
                                aria-invalid={fieldState.error ? 'true' : 'false'}
                                className={cn(
                                    Icon && 'pl-9',
                                    isPasswordType && 'pr-10',
                                    fieldState.error && 'border-destructive focus-visible:ring-destructive/20'
                                )}
                                autoComplete={autoComplete}
                            />
                            {isPasswordType && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                            )}
                        </div>
                        {fieldState.error && (
                            <span className="text-xs font-medium text-destructive">{fieldState.error.message}</span>
                        )}
                    </div>
                )}
            />
        </div>
    );
}