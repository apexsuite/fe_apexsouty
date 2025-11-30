import CustomButton from '@/components/CustomButton';
import { ControlledInputText, ControlledSelect } from '@/components/FormInputs';
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

const CustomFilter = ({ inputs, path }: CustomFilterProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const { updateQueryParams, clearAllQueryParams, deleteQueryParams } =
    useQueryParams();

  const defaultValues = useMemo<FilterFormData>(() => {
    return inputs.reduce((acc, input) => {
      acc[input.name] = '';
      return acc;
    }, {} as FilterFormData);
  }, [inputs]);

  const getInitialValues = useMemo<FilterFormData>(() => {
    return inputs.reduce((acc, input) => {
      const value = searchParams.get(input.name);
      acc[input.name] = value || '';
      return acc;
    }, {} as FilterFormData);
  }, [inputs, searchParams.toString()]);

  const { control, handleSubmit, reset } = useForm<FilterFormData>({
    mode: 'onBlur',
    defaultValues: getInitialValues,
  });

  useEffect(() => {
    const values = inputs.reduce((acc, input) => {
      const value = searchParams.get(input.name);
      acc[input.name] = value || '';
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
    <>
      <div className="flex items-center justify-between">
        <Group>
          <Button
            variant={activeFilters > 0 ? 'default' : 'outline'}
            onClick={() => setOpen(!open)}
            size="lg"
          >
            <ListFilter />
            <span>Filter</span>
            {activeFilters > 0 && (
              <Badge
                variant="secondary"
                className="flex size-4 items-center justify-center rounded-full p-1"
              >
                {activeFilters}
              </Badge>
            )}
          </Button>
        </Group>
        {path && <CreateButton path={path} />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ overflow: 'hidden' }}
          >
            <Card className="p-4">
              <form onSubmit={handleSubmit(handleSearch)} onReset={handleReset}>
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
                  <div className="col-start-6 flex items-end justify-end gap-2">
                    <CustomButton type="submit" label="Apply" />
                    <CustomButton
                      type="reset"
                      label="Clear"
                      variant="outline"
                    />
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomFilter;
