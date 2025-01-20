import { Provider, use } from "@reconjs/react"
import { memo } from "react"
import { theFeed, thePost } from "@/lib/post/the-post"
import { Post } from "../post"
import { theFeedLoader } from "./the-feed"

function PostItem (props: {
  item: string
}) {
  return (
    <li className="border-t border-[rgb(212,219,226)]">
      <Provider context={thePost} value={props.item}>
        <Post hasTopLine={true} hasBottomLine={true} />
      </Provider>
    </li>
  )
}

const MemoizedPostItem = memo(PostItem)

export function FeedList() {
  const id = use(theFeed)
  const loadFeed = use(theFeedLoader)
  const { feed } = use(loadFeed(id))

  const posts = feed.map(x => x.post.uri)
  
  return (
    <ul className="flex flex-col flex-shrink first:border-t-0">
      {posts.map((post) => (
        <MemoizedPostItem item={post} />
      ))}
    </ul>
  )
}