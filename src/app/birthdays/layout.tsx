import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: '生日列表',
  description: '查看从当前年份到2100年的所有公历生日日期',
};

export default function BirthdaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}
