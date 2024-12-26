import { Context, memo, ReactNode, useContext, useMemo } from "react"
import { Provider, createContext, defineContext, withProviders } from "@reconjs/react"
import { PostFeedItem } from "./post"
import { FeedRow } from "@/bsky/view/posts/post-feed"
import { FeedPostSlice, FeedPostSliceItem } from "@/bsky/state/queries/post-feed"

const theRows = createContext<Array <FeedRow>>()
const theRowKey = createContext<string>()

const theSlice = createContext<FeedPostSlice>()
const theSliceIndex = createContext<number>()

// #region Stubs

function renderEmptyState () {
  return <></>
}

function PostFeedErrorMessage () {
  return <></>
}

function LoadMoreRetryBtn () {
  return <></>
}

function PostFeedLoadingPlaceholder () {
  return <></>
}

function FeedShutdownMsg () {
  return <></>
}

function SuggestedFollows () {
  return <></>
}

function ProgressGuide () {
  return <></>
}

function TrendingInterstitial () {
  return <></>
}

function ViewFullThread () {
  return <></>
}

function DiscoverFallbackHeader () {
  return <></>
}

function isThreadParentAt (items: FeedPostSliceItem[], index: number) {
  return false
}

function isThreadChildAt (items: FeedPostSliceItem[], index: number) {
  return false
}

function isThreadLastChildAt (items: FeedPostSliceItem[], index: number) {
  return false
}

// #endregion

const theFirstRow = defineContext (() => {
	const key = useContext (theRowKey)
	const rows = useContext (theRows)

	return rows[0].key === key
}, [ theRows, theRowKey ])

const theRow = defineContext (() => {
	const key = useContext (theRowKey)
	const rows = useContext (theRows)

	return rows.find (row => row.key === key)!
}, [ theRows, theRowKey ])

function PostListItemAux(props: {
	slice: FeedPostSlice,
	indexInSlice: number,
	showReplyTo: boolean,
}) {
	const { slice, indexInSlice, showReplyTo } = props

	const isFirstRow = useContext (theFirstRow)

	const item = slice.items[indexInSlice]

	if (!slice.feedContext) {
		throw new Error('slice.feedContext is required')
	}

	return (
		<PostFeedItem
			post={item.post}
			record={item.record}
			reason={indexInSlice === 0 ? slice.reason : undefined}
			feedContext={slice.feedContext}
			moderation={item.moderation}
			parentAuthor={item.parentAuthor}
			showReplyTo={showReplyTo}
			isThreadParent={isThreadParentAt(slice.items, indexInSlice)}
			isThreadChild={isThreadChildAt(slice.items, indexInSlice)}
			isThreadLastChild={
				isThreadChildAt(slice.items, indexInSlice) &&
				slice.items.length === indexInSlice + 1
			}
			isParentBlocked={item.isParentBlocked ?? false}
			isParentNotFound={item.isParentNotFound ?? false}
			hideTopBorder={isFirstRow && indexInSlice === 0}
			rootPost={slice.items[0].post}
		/>
	)
}

const PostListItem = withProviders (PostListItemAux, {
	slice: theSlice,
	index: theSliceIndex,
})

function ListItemAux() {
  if (row.type === 'empty') {
    return renderEmptyState()
  } else if (row.type === 'error') {
    return (
      <PostFeedErrorMessage
        feedDesc={feed}
        error={error ?? undefined}
        onPressTryAgain={onPressTryAgain}
        savedFeedConfig={savedFeedConfig}
      />
    )
  } else if (row.type === 'loadMoreError') {
    return (
      <LoadMoreRetryBtn
        label={_(
          msg`There was an issue fetching posts. Tap here to try again.`,
        )}
        onPress={onPressRetryLoadMore}
      />
    )
  } else if (row.type === 'loading') {
    return <PostFeedLoadingPlaceholder />
  } else if (row.type === 'feedShutdownMsg') {
    return <FeedShutdownMsg feedUri={feedUri} />
  } else if (row.type === 'interstitialFollows') {
    return <SuggestedFollows feed={feed} />
  } else if (row.type === 'interstitialProgressGuide') {
    return <ProgressGuide />
  } 
	// @ts-expect-error
	else if (row.type === 'interstitialTrending') {
    return <TrendingInterstitial />
  } else if (row.type === 'sliceItem') {
    const slice = row.slice
    if (slice.isFallbackMarker) {
      // HACK
      // tell the user we fell back to discover
      // see home.ts (feed api) for more info
      // -prf
      return <DiscoverFallbackHeader />
    }
    const indexInSlice = row.indexInSlice
    const item = slice.items[indexInSlice]
    return (
      <PostListItem
        row={row}
        rowIndex={rowIndex}
        slice={slice}
        indexInSlice={indexInSlice}
        item={item}
      />
    )
  } else if (row.type === 'sliceViewFullThread') {
    return <ViewFullThread uri={row.uri} />
  } else {
    return null
  }
}

const Item = memo (ListItemAux)

function List (props: {
	// as: Component,
	keys: string[],
	context: Context<string>,
	children: ReactNode,
}) {
	return props.keys.map (key => (
		<Provider key={key}context={props.context} value={key}>
			{props.children}
		</Provider>
	))
}

function PostList() {
	const rows = useContext (theRows)
	const keys = useMemo (() => rows.map (row => row.key), [ rows ])

	const item = useMemo (() => {
		return <Item />
	}, [])

	return (
		<List keys={keys} context={theRowKey}>
			{item}
		</List>
	)
}