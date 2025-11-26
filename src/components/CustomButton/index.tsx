'use client';

import * as React from 'react';

import { LoaderCircleIcon } from 'lucide-react';

import { Button as ShadcnButton } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LinkProps {
  href: string;
  external?: boolean;
  className?: string;
}

export interface TooltipProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export interface CustomButtonProps
  extends React.ComponentProps<typeof ShadcnButton> {
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  tooltip?: string;
  tooltipProps?: TooltipProps;
  linkProps?: LinkProps;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      icon,
      iconPosition = 'left',
      label,
      tooltip,
      tooltipProps,
      loading,
      linkProps,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(loading || disabled);

    const ButtonContent = (
      <ShadcnButton
        ref={ref}
        {...props}
        className={className}
        disabled={isDisabled}
        aria-label={label}
        aria-disabled={isDisabled}
      >
        {loading && <LoaderCircleIcon className="animate-spin" />}
        {!loading && icon && iconPosition === 'left' && icon}
        {label}
        {!loading && icon && iconPosition === 'right' && icon}
      </ShadcnButton>
    );

    const wrappedButton = linkProps ? (
      <ShadcnButton
        {...props}
        className={className}
        disabled={isDisabled}
        aria-label={label}
        aria-disabled={isDisabled}
      >
        <Link
          to={linkProps.href}
          className={cn(
            linkProps.className,
            'disabled:cursor-not-allowed aria-[disabled]:cursor-not-allowed'
          )}
          target={linkProps.external ? '_blank' : undefined}
          rel={linkProps.external ? 'noopener noreferrer' : undefined}
          tabIndex={isDisabled ? -1 : undefined}
          aria-disabled={isDisabled}
          onClick={e => {
            if (isDisabled) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {loading && <LoaderCircleIcon className="animate-spin" />}
          {!loading && icon && iconPosition === 'left' && icon}
          {label}
          {!loading && icon && iconPosition === 'right' && icon}
        </Link>
      </ShadcnButton>
    ) : (
      ButtonContent
    );

    const content = tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>{wrappedButton}</TooltipTrigger>
        <TooltipContent
          className="text-sm"
          side={tooltipProps?.position}
          sideOffset={tooltipProps?.sideOffset}
          align={tooltipProps?.align}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    ) : (
      wrappedButton
    );

    return content;
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
