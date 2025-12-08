import { cn } from '@/lib/utils';
import { Frame, FrameHeader, FramePanel, FrameTitle } from '../ui/frame';
import { Link } from 'lucide-react';
import { Badge } from '../ui/badge';

export type Layout = 'grid' | 'list';
export type ItemType = 'text' | 'link' | 'code';

export interface Item {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
  type?: ItemType;
}

interface InfoSectionProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  layout?: Layout;
  items?: Item[];
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const renderItemValue = (item: Item) => {
  switch (item.type) {
    case 'link':
      return (
        <a
          href={item.value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-sm font-medium hover:underline"
        >
          <span className="flex items-center gap-1">
            {item.value} <Link className="opacity-0 group-hover:opacity-100" />
          </span>
        </a>
      );
    case 'code':
      return (
        <Badge className="w-fit" variant="secondary" size="lg">
          {item.value}
        </Badge>
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
  children,
  actions,
}: InfoSectionProps) => {
  return (
    <Frame className={cn(className)}>
      <FrameHeader className="py-3">
        <FrameTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
          <div className="ml-auto">{actions}</div>
        </FrameTitle>
      </FrameHeader>
      <FramePanel>
        {children ? (
          <div className="flex flex-col gap-4">{children}</div>
        ) : (
          <div
            className={cn(
              'gap-4',
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'
                : 'flex flex-col'
            )}
          >
            {items &&
              items.map(item => (
                <div
                  key={item.label}
                  className={cn('flex flex-col space-y-1.5')}
                >
                  <h3 className="text-muted-foreground flex items-center gap-2 font-medium">
                    {item.icon}
                    {item.label}
                  </h3>
                  {renderItemValue(item)}
                </div>
              ))}
          </div>
        )}
      </FramePanel>
    </Frame>
  );
};
