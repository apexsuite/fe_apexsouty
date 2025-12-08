'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { useState } from 'react';

import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface CustomTabProps {
  tabs: Tab[];
  initialTab?: string;
  className?: string;
  children?: React.ReactNode;
  syncUrl?: boolean;
  queryKey?: string;
}

export default function CustomTab({
  tabs = [],
  initialTab = tabs[0]?.value,
  className,
  syncUrl = false,
  queryKey = 'tab',
}: CustomTabProps) {
  const [urlTab, setUrlTab] = useQueryState(
    queryKey,
    parseAsString.withDefault(initialTab || '').withOptions({
      clearOnDefault: true,
      history: 'replace',
    })
  );

  const [localTab, setLocalTab] = useState(initialTab || tabs[0]?.value);

  const activeTab = syncUrl ? urlTab : localTab;
  const setActiveTab = syncUrl ? setUrlTab : setLocalTab;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn('w-full', className)}
    >
      <TabsList>
        {tabs.map(tab => (
          <TabsTab key={tab.value} value={tab.value}>
            {tab.icon && tab.icon}
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsPanel key={tab.value} value={tab.value}>
          {tab.content}
        </TabsPanel>
      ))}
    </Tabs>
  );
}
