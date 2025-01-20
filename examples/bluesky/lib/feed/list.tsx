import { Provider, use, withStyle } from "@reconjs/react"
import { FunctionComponent, memo, useCallback, useMemo } from "react"
import { FlatList, ListRenderItem, View } from "react-native"
import { theFeed, thePost } from "@/lib/post/the-post"
import { Post } from "../post"
import { theFeedLoader } from "./the-feed"

const Separator = withStyle (View, {
  height: 1,
  backgroundColor: "rgb(212, 219, 226)",
})

type RenderItemProps <T> = Parameters <ListRenderItem<T>>[0]
type RendererComponent <T> = FunctionComponent <RenderItemProps<T>>

function FeedItem ({ item }: RenderItemProps<string>) {
  return (
    <Provider context={thePost} value={item}>
      <Post isFirst={true} isLast={true} />
    </Provider>
  )
}

function useItemRenderer <T> (component: RendererComponent<T>) {
  return useCallback <ListRenderItem<T>>((props) => {
    const Component = memo (component)
    return <Component {...props} />
  }, [ component ])
}

export function FeedList() {
  const id = use (theFeed)
  const loadFeed = use (theFeedLoader)
  const { feed } = use (loadFeed (id))

  const posts = useMemo (() => {
    return feed.map (x => x.post.uri)
  }, [ feed ])
  
  const renderItem = useItemRenderer (FeedItem)

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      scrollEnabled={true}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={{
        flexDirection: "column",
        display: "flex",
        flexShrink: 1,
      }}
    />
  )
}