import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Interactive F1 Portfolio',
  alternates: { canonical: 'https://infoshubhjain.github.io/f1/' },
};

export default function F1Layout({ children }: { children: ReactNode }) {
  return children;
}
