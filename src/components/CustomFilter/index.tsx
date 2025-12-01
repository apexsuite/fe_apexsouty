import CustomButton from '@/components/CustomButton';
import { ControlledInputText, ControlledSelect } from '@/components/FormInputs';
import useQueryParams from '@/utils/hooks/useQueryParams';
import {
  type CustomFilterProps,
  type FilterFormData,
  INPUT_TYPES,
} from '@/components/CustomFilter/types';
import { ListFilter, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CustomFilter = ({ inputs, path }: CustomFilterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateQueryParams, clearAllQueryParams, deleteQueryParams } =
    useQueryParams();
  const navigate = useNavigate();

  const defaultValues = useMemo<FilterFormData>(() => {
    return inputs.reduce((acc, input) => {
      acc[input.name] = '';
      return acc;
    }, {} as FilterFormData);
  }, [inputs]);

  const { control, handleSubmit, reset } = useForm<FilterFormData>({
    mode: 'onBlur',
    defaultValues,
  });

  const handleSearch = async (formValues: FilterFormData) => {
    Object.keys(formValues).forEach(field => {
      deleteQueryParams([field]);
    });

    const searchParams = Object.fromEntries(
      Object.entries(formValues).filter(
        ([, value]) => value !== undefined && value !== ''
      )
    );
    updateQueryParams({ ...searchParams, page: 1, pageSize: 10 });
  };

  const handleReset = () => {
    clearAllQueryParams();
    reset(defaultValues);
  };

  return (
    <div className="space-y-4">
      <div className={cn("flex items-center justify-between", inputs.length > 0 ? "justify-between" : "justify-end")}>
        {
          inputs.length > 0 && (
            <CustomButton
              variant="outline"
              icon={<ListFilter />}
              label="Filter"
              onClick={() => setOpen(!open)}
              size="lg"
            />)
        }
        {path && (
          <CustomButton
            label="Create"
            icon={<Plus />}
            onClick={() => navigate(path)}
          />
        )}
      </div>
      {open && (
        <div className="card rounded-md border p-6">
          <form
            onSubmit={handleSubmit(handleSearch)}
            onReset={handleReset}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {inputs.map(input => {
                if (input.type === INPUT_TYPES.Select) {
                  return (
                    <ControlledSelect
                      key={input.name}
                      control={control}
                      name={input.name}
                      label={input.label}
                      placeholder={input.placeholder}
                      options={input.options || []}
                    />
                  );
                }
                return (
                  <ControlledInputText
                    key={input.name}
                    control={control}
                    name={input.name}
                    label={input.label}
                    placeholder={input.placeholder}
                  />
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton type="submit" label="Apply" />
              <CustomButton type="reset" label="Clear" variant="outline" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomFilter;
