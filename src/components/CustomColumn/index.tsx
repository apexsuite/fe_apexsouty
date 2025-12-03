import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CustomButton from '@/components/CustomButton';
import DeleteButton from '@/components/common/buttons/delete';
import { ButtonGroup } from '@/components/ui/button-group';
import { Eye, SquarePen, ToggleLeft, ToggleRight } from 'lucide-react';

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
  custom?: ActionConfig<TData>[];
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

  // Actions renderer oluştur
  const renderActions = (row: TData): React.ReactNode => {
    if (!actions) return null;

    const actionButtons: React.ReactNode[] = [];

    // View action - default icon: Eye
    if (actions.view) {
      actionButtons.push(
        <CustomButton
          key="view"
          variant="outline"
          tooltip={actions.view.label}
          icon={<Eye />}
          onClick={() => actions.view!.onClick(row)}
          size="icon"
        />
      );
    }

    // Edit action - default icon: Edit
    if (actions.edit) {
      actionButtons.push(
        <CustomButton
          key="edit"
          variant="outline"
          tooltip={actions.edit.label}
          icon={<SquarePen />}
          onClick={() => actions.edit!.onClick(row)}
          size="icon"
        />
      );
    }

    // Toggle action - dinamik icon (isActive durumuna göre)
    if (actions.toggle) {
      // Toggle için isActive field'ını kontrol et (genel kullanım için)
      const isActive = (row as any).isActive;
      const toggleIcon = isActive ? <ToggleRight /> : <ToggleLeft />;

      actionButtons.push(
        <CustomButton
          key="toggle"
          variant="outline"
          tooltip={actions.toggle.label}
          icon={toggleIcon}
          onClick={() => actions.toggle!.onClick(row)}
          size="icon"
        />
      );
    }

    // Delete action
    if (actions.delete) {
      actionButtons.push(
        <DeleteButton
          key="delete"
          title={actions.delete.title}
          description={actions.delete.description}
          onConfirm={() => actions.delete!.onConfirm(row)}
        />
      );
    }

    // Custom actions
    if (actions.custom) {
      actions.custom.forEach((customAction, index) => {
        actionButtons.push(
          <CustomButton
            key={`custom-${index}`}
            variant="outline"
            tooltip={customAction.label}
            label={customAction.label}
            onClick={() => customAction.onClick(row)}
          />
        );
      });
    }

    return <ButtonGroup>{actionButtons}</ButtonGroup>;
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
      columnDef.cell = ({ row }) => renderActions(row.original);
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
