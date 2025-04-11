import React from 'react';
import { generateStaticParams } from './generateStaticParams';

// Export for Next.js static generation
export { generateStaticParams };

export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 