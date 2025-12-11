import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ControlledCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  description?: string;
}

export function ControlledCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  description,
}: ControlledCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Label
          htmlFor={name}
          className="hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50 flex w-full items-start gap-2 rounded-lg border p-3"
        >
          <Checkbox
            id={name}
            checked={field.value || false}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-invalid={error ? true : false}
            className={cn(
              'cursor-pointer',
              error && 'border-destructive focus-visible:ring-destructive/20'
            )}
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-4">{label}</p>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
          </div>
          {error && (
            <span className="text-destructive text-xs font-medium">
              {error.message}
            </span>
          )}
        </Label>
      )}
    />
  );
}
