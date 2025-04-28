import MessageBoard from "~/app/_components/MessageBoard";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-10">
				<div className="container max-w-4xl mx-auto px-4">
					<h1 className="text-4xl font-bold text-center mb-10 text-gray-800">沈的留言板</h1>
					<MessageBoard />
				</div>
			</main>
		</HydrateClient>
	);
}
