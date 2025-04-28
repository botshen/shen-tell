import MessageBoard from "~/app/_components/MessageBoard";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-10">
				<div className="container max-w-4xl mx-auto px-4">
					<MessageBoard />
				</div>
			</main>
		</HydrateClient>
	);
}
