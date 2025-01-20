import "./index.css"

import { atproto } from "./atproto.server"
import { BskyFeed } from "@/lib/feed/types"
import { Client, FeedProvider } from "./layout.client"
import { cache, Suspense } from "react"

async function fetchFeed(): Promise<BskyFeed> {
	console.log ("fetching feed...")

	const { data } = await atproto ("app.bsky.feed.getAuthorFeed", {
		params: {
			actor: "did:plc:uvuzsptk4b22b63xowm62chr",
			limit: 30,
		},
	})

	// close enough
	// @ts-expect-error
	return data
}

const loadFeed = cache (fetchFeed)

const fallback = <div>Loading...</div>

export default function RootLayout (props: {
	children: React.ReactNode
}) {
	const feed = loadFeed()

	return (
		<html>
			<body>
				<Client>
					<Suspense fallback={fallback}>
						<FeedProvider feed={feed}>
							{props.children}
						</FeedProvider>
					</Suspense>
				</Client>
			</body>
		</html>
	)
}
