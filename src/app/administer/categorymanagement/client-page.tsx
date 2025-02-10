// app/administer/categorymanagement/client-page.tsx
'use client';

import dynamic from 'next/dynamic';

const CategoryManagement = dynamic(() => import('./CategoryManagement'), {
  ssr: false
});

export default function ClientPage() {
  return <CategoryManagement />;
}