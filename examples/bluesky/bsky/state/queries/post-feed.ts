import { FeedAPI, ReasonFeedSource } from "@/bsky/lib/api/feed/types"
import { 
	AppBskyActorDefs, 
	AppBskyFeedDefs, 
	AppBskyFeedPost, 
	ModerationDecision,
} from "@atproto/api"

type ActorDid = string
type AuthorFilter =
  | 'posts_with_replies'
  | 'posts_no_replies'
  | 'posts_and_author_threads'
  | 'posts_with_media'
type FeedUri = string
type ListUri = string

export type FeedDescriptor =
	| 'following'
	| `author|${ActorDid}|${AuthorFilter}`
	| `feedgen|${FeedUri}`
	| `likes|${ActorDid}`
	| `list|${ListUri}`

export interface FeedParams {
	mergeFeedEnabled?: boolean
	mergeFeedSources?: string[]
}

export interface FeedPostSliceItem {
  _reactKey: string
  uri: string
  post: AppBskyFeedDefs.PostView
  record: AppBskyFeedPost.Record
  moderation: ModerationDecision
  parentAuthor?: AppBskyActorDefs.ProfileViewBasic
  isParentBlocked?: boolean
  isParentNotFound?: boolean
}

export interface FeedPostSlice {
  _isFeedPostSlice: boolean
  _reactKey: string
  items: FeedPostSliceItem[]
  isIncompleteThread: boolean
  isFallbackMarker: boolean
  feedContext: string | undefined
  reason?: 
    | AppBskyFeedDefs.ReasonRepost
    | AppBskyFeedDefs.ReasonPin
    | ReasonFeedSource
    | {[k: string]: unknown; $type: string}
}

type RQPageParam = {cursor: string | undefined; api: FeedAPI} | undefined

export const RQKEY_ROOT = 'post-feed'
export function RQKEY(feedDesc: FeedDescriptor, params?: FeedParams) {
  return [RQKEY_ROOT, feedDesc, params || {}]
}