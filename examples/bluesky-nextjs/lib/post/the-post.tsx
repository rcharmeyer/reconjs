import { AppBskyFeedDefs } from "@atproto/api"
import { defineContext, useLoader } from "@reconjs/react"

type PostView = AppBskyFeedDefs.FeedViewPost

async function fetchPost (post: string): Promise <PostView> {
	throw new Error ("Post not found")
}

export const thePostLoader = defineContext (() => {
	return useLoader (fetchPost)
})

export const thePost = defineContext <string>()
export const theThread = defineContext <string>()
export const theFeed = defineContext <string>()
