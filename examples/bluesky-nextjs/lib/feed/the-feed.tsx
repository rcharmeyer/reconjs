import { defineContext, useLoader } from "@reconjs/react"
import { BskyFeed } from "./types"

async function fetchFeed (feed: string): Promise <BskyFeed> {
	throw new Error ("Feed not found")
}

export const theFeedLoader = defineContext (() => {
	return useLoader (fetchFeed)
})

export const theFeed = defineContext <string>()
