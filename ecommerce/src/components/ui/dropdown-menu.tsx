'use client';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ open: false, setOpen: () => {} });

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      className: cn(
        (children as React.ReactElement<any>).props.className,
        className,
      ),
    });
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  align = 'end',
  className,
}: DropdownMenuContentProps) {
  const { open } = React.useContext(DropdownMenuContext);

  if (!open) return null;

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-1 shadow-lg',
        alignmentClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext);

  const baseClassName = cn(
    'flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10',
    className,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();


    if (onClick) {
      onClick();
    }


    setOpen(false);
  };

  return (
    <button type="button" onClick={handleClick} className={baseClassName}>
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({
  className,
}: DropdownMenuSeparatorProps) {
  return <div className={cn('my-1 h-px bg-white/10', className)} />;
}

export function DropdownMenuLabel({
  children,
  className,
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        'px-3 py-2 text-xs font-semibold text-slate-400',
        className,
      )}
    >
      {children}
    </div>
  );
}
