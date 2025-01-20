import { defineContext, useLoader } from "@reconjs/react"
import { AppBskyFeedDefs } from "@atproto/api"

type BskyFeed = {
	feed: AppBskyFeedDefs.FeedViewPost[]
}

async function fetchFeed (feed: string): Promise <BskyFeed> {
	throw new Error ("Feed not found")
}

export const theFeedLoader = defineContext (() => {
	return useLoader (fetchFeed)
})

export const theFeed = defineContext <string>()
