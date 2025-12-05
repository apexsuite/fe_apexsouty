import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { renderActions } from './actions';

export interface CustomActionConfig<TData> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: TData) => void;
}
export interface ActionConfig<TData> {
  label: string;
  onClick: (row: TData) => void;
}

export interface DeleteActionConfig<TData> {
  label: string;
  onConfirm: (row: TData) => void;
  title: string;
  description: string;
}

export interface ActionsConfig<TData> {
  edit?: ActionConfig<TData>;
  view?: ActionConfig<TData>;
  delete?: DeleteActionConfig<TData>;
  toggle?: ActionConfig<TData>;
  custom?: CustomActionConfig<TData>[];
}

export interface ColumnConfig<TData> {
  accessorKey: string;
  header: string;
  size: number;
  cell?: (row: TData) => React.ReactNode;
  tooltip?: boolean | string;
}

interface CustomColumnOptions<TData> {
  config: ColumnConfig<TData>[];
  actions?: ActionsConfig<TData>;
  actionsAccessorKey?: string;
}

/**
 * Column konfigürasyonundan ColumnDef array'i oluşturur
 * Size değerleri otomatik olarak yüzdeye çevrilir
 * Tooltip ve Actions desteği içerir
 */
export function createColumns<TData>(
  options: CustomColumnOptions<TData>
): ColumnDef<TData>[] {
  const { config, actions, actionsAccessorKey = 'actions' } = options;

  // Toplam size değerini hesapla
  const totalSize = config.reduce((sum, col) => sum + col.size, 0);

  // Size değerlerini percentage'e çevir
  const getColumnWidth = (size: number): number => {
    return (size / totalSize) * 100;
  };

  // Tooltip wrapper oluştur
  const wrapWithTooltip = (
    content: React.ReactNode,
    tooltip: boolean | string | undefined,
    value: any
  ): React.ReactNode => {
    if (!tooltip) return content;

    const tooltipText = typeof tooltip === 'string' ? tooltip : String(value);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="line-clamp-1 cursor-pointer">{content}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <span className="text-sm">{tooltipText}</span>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Actions renderer wrapper
  const renderActionsWrapper = (row: TData): React.ReactNode => {
    if (!actions) return null;
    return renderActions(row, actions);
  };

  return config.map(colConfig => {
    const columnDef: ColumnDef<TData> = {
      accessorKey: colConfig.accessorKey as keyof TData,
      header: colConfig.header,
      meta: {
        style: { width: `${getColumnWidth(colConfig.size)}%` },
      },
    };

    // Actions column için özel renderer
    if (colConfig.accessorKey === actionsAccessorKey && actions) {
      columnDef.cell = ({ row }) => renderActionsWrapper(row.original);
    } else if (colConfig.cell) {
      // Custom cell renderer varsa kullan
      columnDef.cell = ({ row }) => {
        const cellContent = colConfig.cell!(row.original);
        // Tooltip desteği
        if (colConfig.tooltip) {
          const value = (row.original as any)[colConfig.accessorKey];
          return wrapWithTooltip(cellContent, colConfig.tooltip, value);
        }
        return cellContent;
      };
    } else if (colConfig.tooltip) {
      // Tooltip desteği - otomatik değer gösterimi
      columnDef.cell = ({ row }) => {
        const value = (row.original as any)[colConfig.accessorKey];
        return wrapWithTooltip(<span>{value}</span>, colConfig.tooltip, value);
      };
    }

    return columnDef;
  });
}

export default createColumns;
