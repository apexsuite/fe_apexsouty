import CustomButton from '@/components/CustomButton';
import useQueryParams from '@/utils/hooks/useQueryParams';
import {
  type CustomFilterProps,
  type FilterFormData,
  INPUT_TYPES,
} from '@/components/CustomFilter/types';
import { ListFilter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import CreateButton from '@/components/common/buttons/create';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Group } from '@/components/ui/group';

/**
 * @description Import the form inputs components
 */
import {
  ControlledSelect,
  ControlledCheckbox,
  ControlledInputNumber,
  ControlledInputText,
} from '@/components/FormInputs';

const CustomFilter = ({ inputs, path }: CustomFilterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const { updateQueryParams, clearAllQueryParams, deleteQueryParams } =
    useQueryParams();

  const defaultValues = useMemo<FilterFormData>(() => {
    return inputs.reduce((acc, input) => {
      if (input.type === INPUT_TYPES.Checkbox) {
        acc[input.name] = false;
      } else {
        acc[input.name] = '';
      }
      return acc;
    }, {} as FilterFormData);
  }, [inputs]);

  const getInitialValues = useMemo<FilterFormData>(() => {
    return inputs.reduce((acc, input) => {
      if (input.type === INPUT_TYPES.Checkbox) {
        const value = searchParams.get(input.name);
        acc[input.name] = value === 'true';
      } else {
        const value = searchParams.get(input.name);
        acc[input.name] = value || '';
      }
      return acc;
    }, {} as FilterFormData);
  }, [inputs, searchParams.toString()]);

  const { control, handleSubmit, reset } = useForm<FilterFormData>({
    mode: 'onBlur',
    defaultValues: getInitialValues,
  });

  useEffect(() => {
    const values = inputs.reduce((acc, input) => {
      if (input.type === INPUT_TYPES.Checkbox) {
        const value = searchParams.get(input.name);
        acc[input.name] = value === 'true';
      } else {
        const value = searchParams.get(input.name);
        acc[input.name] = value || '';
      }
      return acc;
    }, {} as FilterFormData);
    reset(values);
  }, [inputs, searchParams, reset]);

  /**
   * @description This hook is used to count the active filters.
   */
  const activeFilters = useMemo(() => {
    const params = inputs.map(input => input.name);
    const excludedParams = ['page', 'pageSize', 'tab'];

    return params.filter(i => {
      const value = searchParams.get(i);
      return value !== null && value !== '' && !excludedParams.includes(i);
    }).length;
  }, [inputs, searchParams]);

  const handleSearch = async (formValues: FilterFormData) => {
    Object.keys(formValues).forEach(field => {
      deleteQueryParams([field]);
    });

    const searchParams = Object.fromEntries(
      Object.entries(formValues).filter(([, value]) => {
        if (typeof value === 'boolean') {
          return value === true;
        }
        return value !== undefined && value !== '';
      })
    );
    // Convert boolean values to string for query params
    const stringParams = Object.fromEntries(
      Object.entries(searchParams).map(([key, value]) => [
        key,
        typeof value === 'boolean' ? String(value) : value,
      ])
    );
    updateQueryParams({ ...stringParams, page: 1, pageSize: 10 });
  };

  const handleReset = () => {
    clearAllQueryParams();
    reset(defaultValues);
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <Group>
          <Button
            variant={activeFilters > 0 ? 'default' : 'outline'}
            onClick={() => setOpen(!open)}
            size="lg"
            className="relative gap-2"
          >
            <ListFilter />
            <span>Filter</span>
            <AnimatePresence initial={false}>
              {activeFilters > 0 && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="flex size-4 items-center justify-center rounded-full p-1"
                  >
                    {activeFilters}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </Group>
        {path && <CreateButton path={path} />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Card className="mt-4 p-4">
              <form onSubmit={handleSubmit(handleSearch)} onReset={handleReset}>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5">
                  {inputs.map(input => {
                    if (input.type === INPUT_TYPES.Select) {
                      return (
                        <ControlledSelect
                          control={control}
                          name={input.name}
                          label={input.label}
                          placeholder={input.placeholder}
                          options={input.options || []}
                        />
                      );
                    }
                    if (input.type === INPUT_TYPES.Checkbox) {
                      return (
                        <ControlledCheckbox
                          control={control}
                          name={input.name}
                          label={input.label}
                        />
                      );
                    }
                    if (input.type === INPUT_TYPES.Number) {
                      return (
                        <ControlledInputNumber
                          control={control}
                          name={input.name}
                          label={input.label}
                          placeholder={input.placeholder}
                        />
                      );
                    }
                    return (
                      <ControlledInputText
                        control={control}
                        name={input.name}
                        label={input.label}
                        placeholder={input.placeholder}
                      />
                    );
                  })}
                  <div className="mt-2 flex items-end justify-end gap-2 lg:col-start-5 lg:mt-0">
                    <CustomButton
                      type="submit"
                      label="Apply"
                      className="w-1/2 lg:w-auto"
                    />
                    <CustomButton
                      type="reset"
                      label="Clear"
                      variant="outline"
                      className="w-1/2 lg:w-auto"
                    />
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomFilter;
