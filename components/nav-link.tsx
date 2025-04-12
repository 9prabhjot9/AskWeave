'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
};

export function NavLink({ href, children, className = '', activeClassName = 'text-primary font-medium' }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || 
                  (href !== '/' && pathname?.startsWith(href));
  
  const combinedClassName = `flex items-center px-3 py-2 transition-colors ${isActive ? activeClassName : 'text-muted-foreground hover:text-foreground'} ${className}`;
  
  return (
    <Link href={href} className={combinedClassName}>
      {children}
    </Link>
  );
} 