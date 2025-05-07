import { BirthdayContent } from './BirthdayContent';
import { use, Suspense } from 'react';

interface PageProps {
  params: Promise<{ name: string }>;
}

function BirthdayPage({ params }: PageProps) {
  const { name } = use(params);
  return <BirthdayContent name={name} />;
}

export default function BirthdaysPageWithSuspense(props: PageProps) {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <BirthdayPage {...props} />
    </Suspense>
  );
}