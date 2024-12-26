import React, {memo, useCallback, useContext, useMemo, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {
	AppBskyActorDefs,
  AppBskyFeedDefs,
  AtUri,
} from '@atproto/api'
// import {msg, Trans} from '@lingui/macro'
// import {useLingui} from '@lingui/react'
import { useQueryClient } from '@tanstack/react-query'
import { ReasonFeedSource } from '@/bsky/lib/api/feed/types'
import { BlockedLabel, NotFoundLabel, ProfileLabel } from './reply-to'
import { PostContent } from './content'
import { theModeration, theParentIsBlocked, theParentIsNotFound, thePostData, theRecord, theRichText, theRootPost, theThreadgateRecord } from './the-post'
import { theFeed, theFeedFeedback } from '../the-feed'
import { PostReason } from './reason'
import { createBoundary, defineContext, Provider, StyleOf, withProviders, withStyle } from '@reconjs/react'
import { FeedRow } from '@/bsky/view/posts/post-feed'

// import {isReasonFeedSource} from '#/lib/api/feed/types'
// import {usePalette} from '#/lib/hooks/usePalette'
// import {makeProfileLink} from '#/lib/routes/links'
// import {sanitizeDisplayName} from '#/lib/strings/display-names'
// import {sanitizeHandle} from '#/lib/strings/handles'
// import {Shadow} from '#/state/cache/post-shadow'
// import {useFeedFeedbackContext} from '#/state/feed-feedback'
// import {precacheProfile} from '#/state/queries/profile'
// import {useSession} from '#/state/session'
// import {useComposerControls} from '#/state/shell/composer'
// import {FeedNameText} from '#/view/com/util/FeedInfoText'
// import {PostCtrls} from '#/view/com/util/post-ctrls/PostCtrls'
// import {PostMeta} from '#/view/com/util/PostMeta'
// import {Text} from '#/view/com/util/text/Text'
// import {PreviewableUserAvatar} from '#/view/com/util/UserAvatar'
// import {Pin_Stroke2_Corner0_Rounded as PinIcon} from '#/components/icons/Pin'
// import {Repost_Stroke2_Corner2_Rounded as RepostIcon} from '#/components/icons/Repost'
// import {LabelsOnMyPost} from '#/components/moderation/LabelsOnMe'
// import {ProfileHoverCard} from '#/components/ProfileHoverCard'
// import {SubtleWebHover} from '#/components/SubtleWebHover'
// import {Link, TextLinkOnWebOnly} from '../util/Link'
// import {AviFollowButton} from './AviFollowButton'

// #region Stubs

const POST_TOMBSTONE = {} as AppBskyFeedDefs.PostView

function usePostShadow (post: AppBskyFeedDefs.PostView) {
  return post
}

function useComposerControls() {
	return {
		openComposer: (
			replyTo: any,
		) => {},
	}
}

function usePalette(key: string): any {
	return {
		colors: {
			border: '',
			replyLine: '',
			textLight: '',
		},
	}
}

function makeProfileLink(profile: AppBskyActorDefs.ProfileViewBasic, type?: string, rkey?: string) {
	return ''
}

function precacheProfile(queryClient: any, profile: AppBskyActorDefs.ProfileViewBasic) {
}

function SubtleWebHover(props: {
	hover: boolean,
}) {
	return null
}

function Link (props: any) {
	return null
}

function PreviewableUserAvatar (props: any) {
	return null
}

function AviFollowButton (props: any) {
	return null
}

function PostMeta (props: any) {
	return null
}

function LabelsOnMyPost (props: any) {
	return null
}

function PostCtrls (props: any) {
	return null
}

// #endregion


interface FeedItemProps {
  // record: AppBskyFeedPost.Record
  // richText: RichTextAPI
  // post: AppBskyFeedDefs.PostView,
  //rootPost: AppBskyFeedDefs.PostView
  reason:
    | AppBskyFeedDefs.ReasonRepost
    | AppBskyFeedDefs.ReasonPin
    | ReasonFeedSource
    | {[k: string]: unknown; $type: string}
    | undefined
  // moderation: ModerationDecision
  parentAuthor: AppBskyActorDefs.ProfileViewBasic | undefined
  showReplyTo: boolean
  isThreadChild?: boolean
  isThreadLastChild?: boolean
  isThreadParent?: boolean
  // feedContext: string | undefined
  hideTopBorder?: boolean
  // isParentBlocked?: boolean
  // isParentNotFound?: boolean
}

const theOpenAuthorCallback = defineContext (() => {
  const { sendInteraction } = useContext (theFeedFeedback)
  const feedContext = useContext (theFeed)
  const post = useContext (thePostData)

  return useCallback (() => {
    sendInteraction({
      item: post.uri,
      event: 'app.bsky.feed.defs#clickthroughAuthor',
      feedContext,
    })
  }, [sendInteraction, feedContext, post])
}, [ theFeedFeedback, theFeed, thePostData ])

function PostAvatar() {
  const moderation = useContext (theModeration)
  const onOpenAuthor = useContext (theOpenAuthorCallback)
  const { author } = useContext (thePostData)

  return (
    <AviFollowButton author={author} moderation={moderation}>
      <PreviewableUserAvatar
        size={42}
        profile={author}
        moderation={moderation.ui('avatar')}
        type={author.associated?.labeler ? 'labeler' : 'user'}
        onBeforePress={onOpenAuthor}
      />
    </AviFollowButton>
  )
}

function FeedItemLink({
  children,
  isThreadChild,
  isThreadLastChild,
  isThreadParent,
  hideTopBorder,
}: {
  children: React.ReactNode
  isThreadChild?: boolean
  isThreadLastChild?: boolean
  isThreadParent?: boolean
  hideTopBorder?: boolean
}) {
  const queryClient = useQueryClient()
  const post = useContext(thePostData)
  const feedContext = useContext(theFeed)
  const {sendInteraction} = useContext(theFeedFeedback)
  const [hover, setHover] = useState(false)
  const pal = usePalette('default')

  const href = useMemo(() => {
    const urip = new AtUri(post.uri)
    return makeProfileLink(post.author, 'post', urip.rkey)
  }, [post.uri, post.author])

  const outerStyles = [
    styles.outer,
    {
      borderColor: pal.colors.border,
      paddingBottom:
        isThreadLastChild || (!isThreadChild && !isThreadParent)
          ? 8
          : undefined,
      borderTopWidth:
        hideTopBorder || isThreadChild ? 0 : StyleSheet.hairlineWidth,
    },
  ]

  const onBeforePress = useCallback(() => {
    sendInteraction({
      item: post.uri,
      event: 'app.bsky.feed.defs#clickthroughItem',
      feedContext,
    })
    precacheProfile(queryClient, post.author)
  }, [queryClient, post, sendInteraction, feedContext])

  return (
    <Link
      testID={`feedItem-by-${post.author.handle}`}
      style={outerStyles}
      href={href}
      noFeedback
      accessible={false}
      onBeforePress={onBeforePress}
      dataSet={{feedContext}}
      onPointerEnter={() => {
        setHover(true)
      }}
      onPointerLeave={() => {
        setHover(false)
      }}
    >
      <SubtleWebHover hover={hover} />
      {children}
    </Link>
  )
}

const ReplyLine = withStyle (View, {
  width: 2,
  marginLeft: 'auto',
  marginRight: 'auto',
  flexGrow: 1,
  backgroundColor: "#ccc", // pal.colors.replyLine,
  marginBottom: 4,
})

const ParentBlockedBoundary = createBoundary (() => {
  const isParentBlocked = useContext (theParentIsBlocked)
  return isParentBlocked
})

const ParentNotFoundBoundary = createBoundary (() => {
  const isParentNotFound = useContext (theParentIsNotFound)
  return isParentNotFound
})

function InnerContent (props: {
  style?: StyleOf <typeof View>
  showReplyTo: boolean
  parentAuthor?: AppBskyActorDefs.ProfileViewBasic
}) {
  const post = useContext (thePostData)
  const moderation = useContext (theModeration)

  const href = useMemo(() => {
    const urip = new AtUri (post.uri)
    return makeProfileLink (post.author, 'post', urip.rkey)
  }, [post.uri, post.author])

  const onOpenAuthor = useContext (theOpenAuthorCallback)

  return (
    <View style={props.style}>
      <PostMeta
        author={post.author}
        moderation={moderation}
        timestamp={post.indexedAt}
        postHref={href}
        onOpenAuthor={onOpenAuthor}
      />
      {!!props.showReplyTo && (
        <ParentBlockedBoundary fallback={<BlockedLabel />}>
          <ParentNotFoundBoundary fallback={<NotFoundLabel />}>
            {!!props.parentAuthor && (
              <ProfileLabel profile={props.parentAuthor} />
            )}
          </ParentNotFoundBoundary>
        </ParentBlockedBoundary>
      )}
      <LabelsOnMyPost post={post} />
      <PostContent style={styles.flex_1} />
      <InnerCtrls />
    </View>
  )
}

const thePressReplyCallback = defineContext (() => {
  const { sendInteraction } = useContext (theFeedFeedback)
  const feedContext = useContext (theFeed)
  const post = useContext (thePostData)

  const record = useContext (theRecord)
  const moderation = useContext (theModeration)

  // TODO: is this a Context?
  const { openComposer } = useComposerControls()

  return useCallback(() => {
    sendInteraction({
      item: post.uri,
      event: 'app.bsky.feed.defs#interactionReply',
      feedContext,
    })
    openComposer({
      replyTo: {
        uri: post.uri,
        cid: post.cid,
        text: record.text || '',
        author: post.author,
        embed: post.embed,
        moderation,
      },
    })
  }, [ sendInteraction, feedContext, post, record, moderation, openComposer ])
}, [ theFeedFeedback, theFeed, thePostData, theRecord, theModeration ])

function InnerCtrls () {
  const post = useContext (thePostData)
  const richText = useContext (theRichText)
  const threadgateRecord = useContext (theThreadgateRecord)
  const feedContext = useContext (theFeed)
  const record = useContext (theRecord)

  const onPressReply = useContext (thePressReplyCallback)

  return (
    <PostCtrls 
      logContext="FeedItem"
      post={post}
      richText={richText}
      record={record}
      feedContext={feedContext}
      threadgateRecord={threadgateRecord}
      onPressReply={onPressReply}
    />
  )
}

const styles = StyleSheet.create({
  relative: {
    position: "relative",
  },
	flex_1: {
		flex: 1,
	},
  outer: {
    paddingLeft: 10,
    paddingRight: 15,
    // @ts-ignore web only -prf
    cursor: 'pointer',
  },
  includeReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
    marginLeft: -16,
  },
  layout: {
    flexDirection: 'row',
    marginTop: 1,
  },
  layoutAvi: {
    paddingLeft: 8,
    paddingRight: 10,
    position: 'relative',
    zIndex: 999,
  },
  layoutContent: {
    position: 'relative',
    flex: 1,
    zIndex: 0,
  },
  alert: {
    marginTop: 6,
    marginBottom: 6,
  },
  postTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: 2,
    overflow: 'hidden',
  },
  contentHiderChild: {
    marginTop: 6,
  },
  embed: {
    marginBottom: 6,
  },
  translateLink: {
    marginBottom: 6,
  },
})

const AviLayout = withStyle (View, {
  paddingLeft: 8,
  paddingRight: 10,
  position: 'relative',
  zIndex: 999,
})

function FeedItemInnerAux ({
  reason,
  parentAuthor,
  showReplyTo,
  isThreadChild,
  isThreadLastChild,
  isThreadParent,
  hideTopBorder,
  // isParentBlocked,
  // isParentNotFound,
}: FeedItemProps & {
}): React.ReactNode {
  return (
    <FeedItemLink 
      isThreadChild={isThreadChild}
      isThreadLastChild={isThreadLastChild}
      isThreadParent={isThreadParent}
      hideTopBorder={hideTopBorder}
    >
      <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 8 }}>
        <View style={{ width: 42 }}>
          {isThreadChild && <ReplyLine />}
        </View>
        <View style={{ paddingTop: 12, flexShrink: 1 }}>
          <PostReason reason={reason} />
        </View>
      </View>

      <View style={styles.layout}>
        <AviLayout style={{ position: 'relative', zIndex: 999 }}>
          <PostAvatar />
          {isThreadParent && <ReplyLine />}
        </AviLayout>
        <InnerContent
          style={{ position: 'relative', flex: 1, zIndex: 0 }}
          showReplyTo={showReplyTo}
          parentAuthor={parentAuthor}
        />
      </View>
    </FeedItemLink>
  )
}

function PostFeedItemAux (props: FeedItemProps & {
  post: AppBskyFeedDefs.PostView,
}) {
  const post = useContext(thePostData)
  const moderation = useContext(theModeration)
  const richText = useContext(theRichText)

  const postShadowed = usePostShadow(post)
  
  if (postShadowed === POST_TOMBSTONE) return null
  if (!richText) return null
  if (!moderation) return null

  return (
    <Provider context={theRichText} value={richText}>
      <Provider context={thePostData} value={postShadowed}>
        <FeedItemInnerAux 
          {...props}
          // make sure state doesn't get clobbered.
          key={postShadowed.uri} 
        />
      </Provider>
    </Provider>
  )
}

export const PostFeedItem = withProviders (PostFeedItemAux, {
  record: theRecord,
  // reason: theReason,
  feedContext: theFeed,
  moderation: theModeration,
  // parentAuthor: theParentAuthor,
  // showReplyTo: theShowReplyTo,
  // isThreadChild: theThreadIsChild,
  // isThreadLastChild: theThreadIsLastChild,
  // isThreadParent: theThreadIsParent,
  // hideTopBorder: theTopBorderIsHidden,
  isParentBlocked: theParentIsBlocked,
  isParentNotFound: theParentIsNotFound,
  rootPost: theRootPost,
})
