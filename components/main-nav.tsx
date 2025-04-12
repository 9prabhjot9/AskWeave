'use client';

import { NavLink } from './nav-link';

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/questions">Questions</NavLink>
      <NavLink href="/ask">Ask</NavLink>
      <NavLink href="/tags">Tags</NavLink>
      <NavLink href="/users">Users</NavLink>
      <NavLink href="/governance">Governance</NavLink>
    </nav>
  );
} 