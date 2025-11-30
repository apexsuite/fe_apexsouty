import CustomFilter from '@/components/CustomFilter';
import type { CustomFilterProps } from '@/components/CustomFilter/types';

type CustomPageLayoutProps = {
  title: string;
  description: string;
  datatable: React.ReactNode;
  filters?: CustomFilterProps;
};

const CustomPageLayout = ({
  datatable,
  filters,
  title,
  description,
}: CustomPageLayoutProps) => {
  return (
    <section className="w-full space-y-4 p-4 lg:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {filters && <CustomFilter inputs={filters.inputs} path={filters.path} />}
      {datatable && datatable}
    </section>
  );
};

export default CustomPageLayout;
