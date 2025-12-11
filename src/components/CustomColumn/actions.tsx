import React from 'react';
import {
  SquarePen,
  ToggleLeft,
  ToggleRight,
  EllipsisIcon,
  TrashIcon,
  InfoIcon,
} from 'lucide-react';
import CustomButton from '@/components/CustomButton';
import DeleteButton from '@/components/common/buttons/delete';
import { Group, GroupSeparator } from '@/components/ui/group';
import { Menu, MenuTrigger, MenuPopup, MenuItem } from '@/components/ui/menu';
import type { ActionsConfig } from '.';

const MAX_ACTIONS = 4;
const VISIBLE_ACTIONS = MAX_ACTIONS - 1;

interface ActionMetadata {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  isDelete?: boolean;
  deleteConfig?: {
    title: string;
    description: string;
    onConfirm: () => void;
  };
}

export function renderActions<TData>(
  row: TData,
  actions: ActionsConfig<TData>
): React.ReactNode {
  if (!actions) return null;

  const actionMetadata: ActionMetadata[] = [];
  const actionButtons: React.ReactNode[] = [];

  if (actions.view) {
    const metadata: ActionMetadata = {
      key: 'view',
      label: actions.view.label,
      icon: <InfoIcon className='size-3.5' />,
      onClick: () => actions.view!.onClick(row),
    };
    actionMetadata.push(metadata);
    actionButtons.push(
      <CustomButton
        key="view"
        variant="outline"
        tooltip={actions.view.label}
        icon={<InfoIcon className='size-3.5' />}
        onClick={() => actions.view!.onClick(row)}
        size="icon"
      />
    );
  }

  // Edit action - default icon: Edit
  if (actions.edit) {
    const metadata: ActionMetadata = {
      key: 'edit',
      label: actions.edit.label,
      icon: <SquarePen />,
      onClick: () => actions.edit!.onClick(row),
    };
    actionMetadata.push(metadata);
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

  if (actions.toggle) {
    const isActive = (row as any).isActive;
    const toggleIcon = isActive ? <ToggleRight /> : <ToggleLeft />;
    const metadata: ActionMetadata = {
      key: 'toggle',
      label: actions.toggle.label,
      icon: toggleIcon,
      onClick: () => actions.toggle!.onClick(row),
    };
    actionMetadata.push(metadata);
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
    const metadata: ActionMetadata = {
      key: 'delete',
      label: actions.delete.label,
      icon: <TrashIcon />,
      onClick: () => actions.delete!.onConfirm(row),
      variant: 'destructive',
      isDelete: true,
      deleteConfig: {
        title: actions.delete.title,
        description: actions.delete.description,
        onConfirm: () => actions.delete!.onConfirm(row),
      },
    };
    actionMetadata.push(metadata);
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
      // If component is provided, render it
      if (customAction.component) {
        actionButtons.push(
          <React.Fragment key={`custom-${index}`}>
            {customAction.component(row)}
          </React.Fragment>
        );
        return;
      }

      // Yoksa normal button render et
      const metadata: ActionMetadata = {
        key: `custom-${index}`,
        label: customAction.label,
        icon: customAction.icon,
        onClick: () => customAction.onClick?.(row),
      };
      actionMetadata.push(metadata);
      actionButtons.push(
        <CustomButton
          key={`custom-${index}`}
          variant="outline"
          icon={customAction.icon}
          label={customAction.label}
          tooltip={customAction.label}
          onClick={() => customAction.onClick?.(row)}
          size="icon"
        />
      );
    });
  }

  // 4'ten fazla action varsa Group + Menu kullan
  if (actionButtons.length > MAX_ACTIONS) {
    const visibleButtons = actionButtons.slice(0, VISIBLE_ACTIONS);
    const menuMetadata = actionMetadata.slice(VISIBLE_ACTIONS);

    const groupedButtons: React.ReactNode[] = [];

    // Görünür action'ları ekle
    visibleButtons.forEach((button, index) => {
      groupedButtons.push(button);
      if (index < visibleButtons.length - 1) {
        groupedButtons.push(<GroupSeparator key={`separator-${index}`} />);
      }
    });

    // Menu için separator ekle
    if (menuMetadata.length > 0) {
      groupedButtons.push(<GroupSeparator key="menu-separator" />);

      // Menu button'u ekle
      groupedButtons.push(
        <Menu key="more-actions">
          <MenuTrigger
            render={
              <CustomButton
                aria-label="More actions"
                size="icon"
                icon={<EllipsisIcon />}
                variant="outline"
              />
            }
          >
            <EllipsisIcon />
          </MenuTrigger>
          <MenuPopup align="end">
            {menuMetadata.map(metadata => {
              // Delete action için özel işleme
              if (metadata.isDelete && metadata.deleteConfig) {
                return (
                  <MenuItem
                    key={metadata.key}
                    onClick={() => {
                      // Delete için onay dialog'u göster
                      if (
                        window.confirm(
                          `${metadata.deleteConfig!.title}\n${metadata.deleteConfig!.description}`
                        )
                      ) {
                        metadata.deleteConfig!.onConfirm();
                      }
                    }}
                    variant="destructive"
                  >
                    {metadata.icon}
                    {metadata.label}
                  </MenuItem>
                );
              }

              return (
                <MenuItem
                  key={metadata.key}
                  onClick={metadata.onClick}
                  variant={metadata.variant || 'default'}
                >
                  {metadata.icon}
                  {metadata.label}
                </MenuItem>
              );
            })}
          </MenuPopup>
        </Menu>
      );
    }

    return <Group aria-label="Row actions">{groupedButtons}</Group>;
  }

  // 4 veya daha az action varsa ButtonGroup kullan
  return <Group>{actionButtons}</Group>;
}
