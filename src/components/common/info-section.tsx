import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type InfoSectionLayout = 'grid' | 'list';
export type InfoSectionItemType = 'text' | 'link' | 'code';

export interface InfoSectionItem {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
  type?: InfoSectionItemType;
}

interface InfoSectionProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  layout?: InfoSectionLayout;
  items: InfoSectionItem[];
}

const renderItemValue = (item: InfoSectionItem) => {
  switch (item.type) {
    case 'link':
      return (
        <a
          href={item.value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline"
        >
          {item.value}
        </a>
      );
    case 'code':
      return (
        <code className="bg-muted w-fit rounded-md px-2 py-1 font-mono text-sm font-medium">
          {item.value}
        </code>
      );
    case 'text':
    default:
      return (
        <p className="text-foreground text-sm font-medium">{item.value}</p>
      );
  }
};

export const InfoSection = ({
  title,
  icon,
  className,
  layout = 'list',
  items,
}: InfoSectionProps) => {
  return (
    <Card className={cn('overflow-hidden py-0', className)}>
      <CardHeader className="bg-muted/50 border-b py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <div
          className={cn(
            'gap-6',
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col'
          )}
        >
          {items.map(item => (
            <div key={item.label} className={cn('flex flex-col space-y-1.5')}>
              <div className="text-muted-foreground flex items-center gap-2 font-medium">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {renderItemValue(item)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
