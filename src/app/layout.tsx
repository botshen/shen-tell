import "~/styles/globals.css";

import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "沈的留言板",
	description: "一个简单的留言板应用",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="zh">
			<body className="bg-gray-50 min-h-screen">
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
