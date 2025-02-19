import React, {useContext, createContext, memo, useRef, useMemo, useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  AppState,
  Dimensions,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import {AppBskyActorDefs} from '@atproto/api'
// import {msg} from '@/bsky/lingui/macro'
// import {useLingui} from '@/bsky/lingui/react'
import {useQueryClient} from '@tanstack/react-query'

import {DISCOVER_FEED_URI, KNOWN_SHUTDOWN_FEEDS} from '@/bsky/lib/constants'
// import {useInitialNumToRender} from '@/bsky/lib/hooks/useInitialNumToRender'
// import {useWebMediaQueries} from '@/bsky/lib/hooks/useWebMediaQueries'
// import {logEvent} from '@/bsky/lib/statsig/statsig'
import {useTheme} from '@/bsky/lib/theme-context'
// import {logger} from '@/bsky/logger'
import {isIOS, isWeb} from '@/bsky/platform/detection'

// import {listenPostCreated} from '@/bsky/state/events'
// import {useFeedFeedbackContext} from '@/bsky/state/feed-feedback'
// import {STALE} from '@/bsky/state/queries'
import {
  FeedDescriptor,
  FeedParams,
  FeedPostSlice,
  // pollLatest,
  RQKEY,
  // usePostFeedQuery,
} from '@/bsky/state/queries/post-feed'
// import {useSession} from '@/bsky/state/session'
// import {useProgressGuide} from '@/bsky/state/shell/progress-guide'
// import {ProgressGuide, SuggestedFollows} from '@/bsky/components/FeedInterstitials'

import {List, ListRef} from '../util/list'
import {PostFeedLoadingPlaceholder} from '../util/loading-placeholder'
// import {LoadMoreRetryBtn} from '../util/LoadMoreRetryBtn'
// import {DiscoverFallbackHeader} from './DiscoverFallbackHeader'
// import {FeedShutdownMsg} from './FeedShutdownMsg'
// import {PostFeedErrorMessage} from './PostFeedErrorMessage'
// import {PostFeedItem} from './PostFeedItem'
// import {ViewFullThread} from './ViewFullThread'
import { useStruct } from '@/hooks/struct'

// #region Stubs

function Stub (props: any) {
  return null
}

const LoadMoreRetryBtn = Stub
const DiscoverFallbackHeader = Stub
const FeedShutdownMsg = Stub
const PostFeedErrorMessage = Stub
const PostFeedItem = Stub
const ViewFullThread = Stub

const ProgressGuide = Stub
const SuggestedFollows = Stub

function useProgressGuide (key: string) {
  return null
}

function useSession() {
  return {
    currentAccount: {
      did: '',
      handle: '',
      avatar: '',
    },
    hasSession: false,
  }
}

function useWebMediaQueries() {
  return {
    isDesktop: false,
  }
}

function useInitialNumToRender() {
  return 0
}

function useFeedFeedbackContext() {
  return {
    onItemSeen: () => {},
  }
}

function usePostFeedQuery (
  feed: FeedDescriptor, 
  feedParams?: FeedParams, 
  opts?: {
    ignoreFilterFor?: string; 
    enabled?: boolean
  },
) {
  return {
    data: {
      pages: [] as Array <{
        slices: FeedPostSlice[],
        fetchedAt: number,
      }>,
    },
    isFetching: false,
    isFetched: false,
    isError: false,
    error: null,
    refetch: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  }
}

async function pollLatest (page: any) {
  return false
}

const STALE = {
  SECONDS: {
    THIRTY: 30,
  },
  HOURS: {
    ONE: 3600,
  },
}

function listenPostCreated (onPostCreated: () => void) {
  return () => {}
}

function logEvent(event: string, data: Record<string, any>) {
  console.log(event, data)
}

const logger = {
  error: (message: string, data?: Record<string, any>) => {
    console.error(message, data)
  },
}

// #endregion Stubs

export type FeedRow =
  | {
      type: 'loading'
      key: string
    }
  | {
      type: 'empty'
      key: string
    }
  | {
      type: 'error'
      key: string
    }
  | {
      type: 'loadMoreError'
      key: string
    }
  | {
      type: 'feedShutdownMsg'
      key: string
    }
  | {
      type: 'slice'
      key: string
      slice: FeedPostSlice
    }
  | {
      type: 'sliceItem'
      key: string
      slice: FeedPostSlice
      indexInSlice: number
      showReplyTo: boolean
    }
  | {
      type: 'sliceViewFullThread'
      key: string
      uri: string
    }
  | {
      type: 'interstitialFollows'
      key: string
    }
  | {
      type: 'interstitialProgressGuide'
      key: string
    }

export function getFeedPostSlice(feedRow: FeedRow): FeedPostSlice | null {
  if (feedRow.type === 'sliceItem') {
    return feedRow.slice
  } else {
    return null
  }
}

// DISABLED need to check if this is causing random feed refreshes -prf
// const REFRESH_AFTER = STALE.HOURS.ONE
const CHECK_LATEST_AFTER = STALE.SECONDS.THIRTY

type PFProps = {
  feed: FeedDescriptor
  feedParams?: FeedParams
  ignoreFilterFor?: string
  enabled?: boolean
  style?: StyleProp<ViewStyle>
  pollInterval?: number
  disablePoll?: boolean
  scrollElRef?: ListRef
  onHasNew?: (v: boolean) => void
  onScrolledDownChange?: (isScrolledDown: boolean) => void
  renderEmptyState: () => JSX.Element
  renderEndOfFeed?: () => JSX.Element
  testID?: string
  headerOffset?: number
  progressViewOffset?: number
  desktopFixedHeightOffset?: number
  ListHeaderComponent?: () => JSX.Element
  extraData?: any
  savedFeedConfig?: AppBskyActorDefs.SavedFeed
  initialNumToRender?: number
}

function usePFProvider ({
  ignoreFilterFor,
  enabled,
  headerOffset = 0,
  initialNumToRender: initialNumToRenderOverride,
  ...props
}: PFProps) {
  const opts = useStruct ({
    ignoreFilterFor,
    enabled,
  })

  const [ feedType, feedUri, feedTab ] = props.feed.split('|')

  const lastFetchRef = useRef (Date.now())

  return useStruct ({
    ...props,
    opts,
    feedType,
    feedUri,
    feedTab,
    headerOffset,
    initialNumToRenderOverride,
    lastFetchRef,
  })
}

const PFContext = createContext <
  ReturnType <typeof usePFProvider>
> (undefined as any)

function usePFQuery() {
  const { 
    feed, 
    feedParams, 
    opts,
    lastFetchRef,
  } = useContext (PFContext)

  const query = usePostFeedQuery (feed, feedParams, opts)

  const lastFetchedAt = query.data?.pages[0].fetchedAt
  if (lastFetchedAt) {
    lastFetchRef.current = lastFetchedAt
  }

  return query
}

function usePFEmpty () {
  const { isFetching, data } = usePFQuery()

  return useMemo (() => {
    if (isFetching) return false

    const hasPageWithSlices = data?.pages
      .some (page => page.slices.length)

    return !hasPageWithSlices
  }, [isFetching, data])
}

function useCheckForNewPosts() {
  const {
    feed,
    opts,
    disablePoll,
    onHasNew,
    lastFetchRef,
  } = useContext (PFContext)
  const checkForNewRef = useRef<(() => void) | null>(null)

  const {data, isFetching} = usePFQuery()

  const lastFetchedAt = data?.pages[0].fetchedAt
  if (lastFetchedAt) {
    lastFetchRef.current = lastFetchedAt
  }

  const checkForNew = useCallback (async () => {
    if (!data?.pages[0] || isFetching || !onHasNew || !opts.enabled || disablePoll) {
      return
    }
    try {
      if (await pollLatest(data.pages[0])) {
        onHasNew(true)
      }
    } catch (e) {
      logger.error('Poll latest failed', {feed, message: String(e)})
    }
  }, [feed, data, isFetching, onHasNew, opts.enabled, disablePoll])

  useEffect(() => {
    checkForNewRef.current = checkForNew
  }, [checkForNew])

  useEffect(() => {
    if (opts.enabled && !disablePoll) {
      const timeSinceFirstLoad = Date.now() - lastFetchRef.current
      if (timeSinceFirstLoad > CHECK_LATEST_AFTER && checkForNewRef.current) {
        checkForNewRef.current()
      }
    }
  }, [opts.enabled, disablePoll, lastFetchRef])

  return checkForNewRef
}

function usePostCreatedListener() {
  const {
    feed,
  } = useContext(PFContext)
  const queryClient = useQueryClient()
  const {currentAccount} = useSession()
  const {data} = usePFQuery()

  const myDid = currentAccount?.did || ''
  const onPostCreated = useCallback(() => {
    if (
      data?.pages.length === 1 &&
      (feed === 'following' ||
        feed === `author|${myDid}|posts_and_author_threads`)
    ) {
      queryClient.invalidateQueries({queryKey: RQKEY(feed)})
    }
  }, [queryClient, feed, data, myDid])

  useEffect(() => {
    return listenPostCreated(onPostCreated)
  }, [onPostCreated])
}

function useAppStatePolling() {
  const {
    pollInterval,
  } = useContext(PFContext)
  const checkForNewRef = useCheckForNewPosts()

  React.useEffect(() => {
    let cleanup1: () => void | undefined, cleanup2: () => void | undefined
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkForNewRef.current?.()
      }
    })
    cleanup1 = () => subscription.remove()
    if (pollInterval) {
      const i = setInterval(() => checkForNewRef.current?.(), pollInterval)
      cleanup2 = () => clearInterval(i)
    }
    return () => {
      cleanup1?.()
      cleanup2?.()
    }
  }, [pollInterval, checkForNewRef])
}

function usePFPolling() {
  usePostCreatedListener()
  useAppStatePolling()
}

function usePFFeedItems() {
  const {
    feed,
    feedType,
    feedUri,
    feedTab,
    lastFetchRef,
  } = useContext(PFContext)
  const {hasSession} = useSession()
  const progressGuide = useProgressGuide('like-10-and-follow-7')
  const {isDesktop} = useWebMediaQueries()
  const showProgressIntersitial = progressGuide && !isDesktop

  const {
    data,
    isFetching,
    isFetched,
    isError,
  } = usePFQuery()

  const lastFetchedAt = lastFetchRef.current
  const isEmpty = data?.pages[0].slices.length === 0

  return useMemo (() => {
    let feedKind: 'following' | 'discover' | 'profile' | undefined
    if (feedType === 'following') {
      feedKind = 'following'
    } else if (feedUri === DISCOVER_FEED_URI) {
      feedKind = 'discover'
    } else if (
      feedType === 'author' &&
      (feedTab === 'posts_and_author_threads' ||
        feedTab === 'posts_with_replies')
    ) {
      feedKind = 'profile'
    }

    let arr: FeedRow[] = []
    if (KNOWN_SHUTDOWN_FEEDS.includes(feedUri)) {
      arr.push({
        type: 'feedShutdownMsg',
        key: 'feedShutdownMsg',
      })
    }
    if (isFetched) {
      if (isError && isEmpty) {
        arr.push({
          type: 'error',
          key: 'error',
        })
      } else if (isEmpty) {
        arr.push({
          type: 'empty',
          key: 'empty',
        })
      } else if (data) {
        let sliceIndex = -1
        for (const page of data?.pages) {
          for (const slice of page.slices) {
            sliceIndex++

            if (hasSession) {
              if (feedKind === 'discover') {
                if (sliceIndex === 0 && showProgressIntersitial) {
                  arr.push({
                    type: 'interstitialProgressGuide',
                    key: 'interstitial-' + sliceIndex + '-' + lastFetchedAt,
                  })
                } else if (sliceIndex === 20) {
                  arr.push({
                    type: 'interstitialFollows',
                    key: 'interstitial-' + sliceIndex + '-' + lastFetchedAt,
                  })
                }
              } else if (feedKind === 'profile') {
                if (sliceIndex === 5) {
                  arr.push({
                    type: 'interstitialFollows',
                    key: 'interstitial-' + sliceIndex + '-' + lastFetchedAt,
                  })
                }
              }
            }

            if (slice.isIncompleteThread && slice.items.length >= 3) {
              const beforeLast = slice.items.length - 2
              const last = slice.items.length - 1
              arr.push({
                type: 'sliceItem',
                key: slice.items[0]._reactKey,
                slice: slice,
                indexInSlice: 0,
                showReplyTo: false,
              })
              arr.push({
                type: 'sliceViewFullThread',
                key: slice._reactKey + '-viewFullThread',
                uri: slice.items[0].uri,
              })
              arr.push({
                type: 'sliceItem',
                key: slice.items[beforeLast]._reactKey,
                slice: slice,
                indexInSlice: beforeLast,
                showReplyTo:
                  slice.items[beforeLast].parentAuthor?.did !==
                  slice.items[beforeLast].post.author.did,
              })
              arr.push({
                type: 'sliceItem',
                key: slice.items[last]._reactKey,
                slice: slice,
                indexInSlice: last,
                showReplyTo: false,
              })
            } else {
              for (let i = 0; i < slice.items.length; i++) {
                arr.push({
                  type: 'sliceItem',
                  key: slice.items[i]._reactKey,
                  slice: slice,
                  indexInSlice: i,
                  showReplyTo: i === 0,
                })
              }
            }
          }
        }
      }
      if (isError && !isEmpty) {
        arr.push({
          type: 'loadMoreError',
          key: 'loadMoreError',
        })
      }
    } else {
      arr.push({
        type: 'loading',
        key: 'loading',
      })
    }

    return arr
  }, [
    isFetched,
    isError,
    isEmpty,
    lastFetchedAt,
    data,
    feedType,
    feedUri,
    feedTab,
    hasSession,
    showProgressIntersitial,
  ])
}

function usePFEvents() {
  const {
    feed,
    feedType,
    onHasNew,
  } = useContext(PFContext)
  const [isPTRing, setIsPTRing] = useState(false)

  const {
    refetch,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isError,
  } = usePFQuery()

  const onRefresh = useCallback(async () => {
    logEvent('feed:refresh', {
      feedType: feedType,
      feedUrl: feed,
      reason: 'pull-to-refresh',
    })
    setIsPTRing(true)
    try {
      await refetch()
      onHasNew?.(false)
    } catch (err) {
      logger.error('Failed to refresh posts feed', {message: err})
    }
    setIsPTRing(false)
  }, [refetch, setIsPTRing, onHasNew, feed, feedType])

  const onEndReached = useCallback(async () => {
    if (isFetching || !hasNextPage || isError) return

    logEvent('feed:endReached', {
      feedType: feedType,
      feedUrl: feed,
    })
    try {
      await fetchNextPage()
    } catch (err) {
      logger.error('Failed to load more posts', {message: err})
    }
  }, [isFetching, hasNextPage, isError, fetchNextPage, feed, feedType])

  const onPressTryAgain = useCallback(() => {
    refetch()
    onHasNew?.(false)
  }, [refetch, onHasNew])

  const onPressRetryLoadMore = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])

  return {
    isPTRing,
    onRefresh,
    onEndReached,
    onPressTryAgain,
    onPressRetryLoadMore,
  }
}

function PFView(): React.ReactNode {
  const {
    feed,
    style,
    testID,
    headerOffset = 0,
    progressViewOffset,
    desktopFixedHeightOffset,
    ListHeaderComponent,
    extraData,
    savedFeedConfig,
    initialNumToRenderOverride,
    renderEmptyState,
    renderEndOfFeed,
    scrollElRef,
    onScrolledDownChange,
  } = useContext(PFContext)

  const theme = useTheme()
  const initialNumToRender = useInitialNumToRender()
  const feedFeedback = useFeedFeedbackContext()

  const {
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isError,
  } = usePFQuery()

  const isEmpty = usePFEmpty()
  const { feedUri } = useContext(PFContext)

  usePFPolling()
  const feedItems = usePFFeedItems()
  const {
    isPTRing,
    onRefresh,
    onEndReached,
    onPressTryAgain,
    onPressRetryLoadMore,
  } = usePFEvents()

  const renderItem = useCallback(
    ({item: row, index: rowIndex}: ListRenderItemInfo<FeedRow>) => {
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
            label="There was an issue fetching posts. Tap here to try again."
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
      } else if (row.type === 'sliceItem') {
        const slice = row.slice
        if (slice.isFallbackMarker) {
          return <DiscoverFallbackHeader />
        }
        const indexInSlice = row.indexInSlice
        const item = slice.items[indexInSlice]
        return (
          <PostFeedItem
            post={item.post}
            record={item.record}
            reason={indexInSlice === 0 ? slice.reason : undefined}
            feedContext={slice.feedContext}
            moderation={item.moderation}
            parentAuthor={item.parentAuthor}
            showReplyTo={row.showReplyTo}
            isThreadParent={isThreadParentAt(slice.items, indexInSlice)}
            isThreadChild={isThreadChildAt(slice.items, indexInSlice)}
            isThreadLastChild={
              isThreadChildAt(slice.items, indexInSlice) &&
              slice.items.length === indexInSlice + 1
            }
            isParentBlocked={item.isParentBlocked}
            isParentNotFound={item.isParentNotFound}
            hideTopBorder={rowIndex === 0 && indexInSlice === 0}
            rootPost={slice.items[0].post}
          />
        )
      } else if (row.type === 'sliceViewFullThread') {
        return <ViewFullThread uri={row.uri} />
      } else {
        return null
      }
    },
    [
      renderEmptyState,
      feed,
      error,
      onPressTryAgain,
      savedFeedConfig,
      onPressRetryLoadMore,
      feedUri,
    ],
  )

  const shouldRenderEndOfFeed =
    !hasNextPage && !isEmpty && !isFetching && !isError && !!renderEndOfFeed

  const FeedFooter = useCallback(() => {
    const offset = Math.max(headerOffset, 32) * (isWeb ? 1 : 2)

    return isFetchingNextPage ? (
      <View style={[styles.feedFooter]}>
        <ActivityIndicator />
        <View style={{height: offset}} />
      </View>
    ) : shouldRenderEndOfFeed ? (
      <View style={{minHeight: offset}}>{renderEndOfFeed()}</View>
    ) : (
      <View style={{height: offset}} />
    )
  }, [isFetchingNextPage, shouldRenderEndOfFeed, renderEndOfFeed, headerOffset])

  return (
    <View testID={testID} style={style}>
      <List
        testID={testID ? `${testID}-flatlist` : undefined}
        ref={scrollElRef}
        data={feedItems}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        ListFooterComponent={FeedFooter}
        ListHeaderComponent={ListHeaderComponent}
        refreshing={isPTRing}
        onRefresh={onRefresh}
        headerOffset={headerOffset}
        progressViewOffset={progressViewOffset}
        contentContainerStyle={{
          minHeight: Dimensions.get('window').height * 1.5,
        }}
        onScrolledDownChange={onScrolledDownChange}
        indicatorStyle={theme.colorScheme === 'dark' ? 'white' : 'black'}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        removeClippedSubviews={true}
        extraData={extraData}
        desktopFixedHeight={
          desktopFixedHeightOffset ? desktopFixedHeightOffset : true
        }
        initialNumToRender={initialNumToRenderOverride ?? initialNumToRender}
        windowSize={9}
        maxToRenderPerBatch={isIOS ? 5 : 1}
        updateCellsBatchingPeriod={40}
        onItemSeen={feedFeedback.onItemSeen}
      />
    </View>
  )
}

const PFVIEW = <PFView />

export const PostFeed = memo (({
  ignoreFilterFor,
  enabled,
  ...props
}: PFProps) => {
  const value = usePFProvider (props)

  return (
    <PFContext.Provider value={value}>
      {PFVIEW}
    </PFContext.Provider>
  )
})

const styles = StyleSheet.create({
  feedFooter: {paddingTop: 20},
})

function isThreadParentAt<T>(arr: Array<T>, i: number) {
  if (arr.length === 1) {
    return false
  }
  return i < arr.length - 1
}

function isThreadChildAt<T>(arr: Array<T>, i: number) {
  if (arr.length === 1) {
    return false
  }
  return i > 0
}