import React from 'react';
import * as EmptyUI from '@/components/ui/empty';

interface EmptyProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  title,
  description,
  icon,
  children,
}) => {
  return (
    <EmptyUI.Empty>
      <EmptyUI.EmptyHeader className="max-w-md">
        <EmptyUI.EmptyMedia variant="icon">{icon}</EmptyUI.EmptyMedia>
        <EmptyUI.EmptyTitle>{title}</EmptyUI.EmptyTitle>
        <EmptyUI.EmptyDescription>{description}</EmptyUI.EmptyDescription>
      </EmptyUI.EmptyHeader>
      {children && <EmptyUI.EmptyContent>{children}</EmptyUI.EmptyContent>}
    </EmptyUI.Empty>
  );
};

export default Empty;
