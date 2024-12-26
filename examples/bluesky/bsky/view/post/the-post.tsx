import { 
  AppBskyFeedDefs, 
  AppBskyFeedPost, 
  AppBskyFeedThreadgate, 
  ModerationDecision,
  RichText as RichTextAPI,
} from "@atproto/api"
import { createContext, defineContext } from "@reconjs/react"
import { useCallback, useContext, useMemo } from "react"
import { theFeed, theFeedFeedback } from "../the-feed"

export const theCurrentAccount = createContext <{
	did: string,
}> ()

export const thePostData = createContext <AppBskyFeedDefs.PostView>()
export const theRootPost = createContext <AppBskyFeedDefs.PostView>()
export const theRecord = createContext <AppBskyFeedPost.Record>()
export const theModeration = createContext <ModerationDecision>()

export const theRichText = defineContext (() => {
  const record = useContext (theRecord)
  return useMemo (() => {
    return new RichTextAPI ({
      text: record.text,
      facets: record.facets,
    })
  }, [record])
}, [theRecord])

export const theOnOpenEmbed = defineContext (() => {
	const post = useContext (thePostData)
	const feedContext = useContext (theFeed)
	const { sendInteraction } = useContext (theFeedFeedback)

	return useCallback(() => {
    sendInteraction({
      item: post.uri,
      event: 'app.bsky.feed.defs#clickthroughEmbed',
      feedContext,
    })
  }, [sendInteraction, post, feedContext])
}, [thePostData, theFeed])

export const theThreadgateRecord = defineContext (() => {
	const rootPost = useContext (theRootPost)
	const record = rootPost.threadgate?.record

	/**
   * If `post[0]` in this slice is the actual root post (not an orphan thread),
   * then we may have a threadgate record to reference
   */
  return AppBskyFeedThreadgate.isRecord(record) ? record : undefined
}, [theRootPost])

export const theParentIsBlocked = defineContext (() => {
  // TODO: implement
  return false
}, [thePostData])

export const theParentIsNotFound = defineContext (() => {
  // TODO: implement
  return false
}, [thePostData])
