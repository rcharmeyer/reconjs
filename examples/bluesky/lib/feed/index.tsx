import { Provider } from "@reconjs/react"

import { use, useLoader } from "@reconjs/react"
import { ReactNode } from "react"
import { theFeed, theFeedLoader } from "./the-feed"
import { thePostLoader } from "../post/the-post"
import { FeedList } from "./list"

function FeedPostProvider (props: { children: ReactNode }) {
	const id = use (theFeed)
	const loadFeed = use (theFeedLoader)
	const { feed } = use (loadFeed (id))

	const loadPost = useLoader ((post: string) => {
    const found = feed.find (x => x.post.uri === post)
    if (found) return found
    throw new Error ("Post not found")
  }, /*[ feed ]*/) // TODO: Add deps to loaders

	return (
    <Provider context={thePostLoader} value={loadPost as any}>
      {props.children}
    </Provider>
  )
}

export function Feed () {
	return (
		<FeedPostProvider>
			<FeedList />
		</FeedPostProvider>
	)
}