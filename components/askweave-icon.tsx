import React from "react";

export function AskWeaveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Arweave-inspired woven pattern */}
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      
      {/* Subtle question mark overlay */}
      <path
        d="M12 19h.01"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M9.5 9a2.5 2.5 0 1 1 5 0c0 1.5-2.5 2-2.5 5"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
} 