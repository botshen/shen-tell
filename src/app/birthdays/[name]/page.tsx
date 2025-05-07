import { BirthdayContent } from './BirthdayContent';

interface PageProps {
  params: Promise<{ name: string }>;
}

export default async function BirthdaysPage({ params }: PageProps) {
  const { name } = await params;
  return <BirthdayContent name={name} />;
}