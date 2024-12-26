import { z } from "zod"
import { LINK, Post, TEXT } from '@/lib/post/types'
import { bsky } from "@/lib/atproto";
import { guardAsync } from "@/utils/guard";

const posts: z.infer<typeof Post>[] = [
  {
    id: "1",
    title: "People rated images of 462 individuals and found in 96.1% of cases they were rated more attractive with a beauty filter applied",
    content: "",
    subreddit: "science",
    author: "scienceposter",
    timestamp: "11h",
    votes: 1821,
    comments: 225,
    type: LINK,
    linkUrl: "https://scimex.org/beauty-filter-study",
    linkDomain: "scimex.org",
    imageUrl: "/placeholder.svg?height=160&width=256"
  },
  {
    id: "2",
    title: "How do I tell my wife that I am going to get a vasectomy without crushing her soul?",
    content: "My(35m) wife(35f) and I have been married for almost ten years, and we have two boys, 5 and 8. For the last year, my wife has been begging me to try again for a girl...",
    subreddit: "AskMen",
    author: "username123",
    timestamp: "20h",
    votes: 931,
    comments: 579,
    type: TEXT,
  },
  {
    id: "3",
    title: "What, Exactly, Is a 'Khia'?",
    content: "",
    subreddit: "popheads",
    author: "musicfan",
    timestamp: "13h",
    votes: 184,
    comments: 191,
    type: LINK,
    linkUrl: "https://thecut.com/article",
    linkDomain: "thecut.com",
    imageUrl: "/placeholder.svg?height=160&width=256"
  }
]

async function fetchProfile (actor: string) {
  const [ data, error ] = await guardAsync (() => {
    return bsky.actor.getProfile (actor)
  })

  if (error) {
    console.error ("Error fetching profile", error)
  }

  return { data, error: error?.message }
}

async function fetchFeeds (actor: string) {
  const [ data, error ] = await guardAsync (() => {
    return bsky.feed.getActorFeeds (actor)
  })

  if (error) {
    console.error ("Error fetching posts", error)
  }

  return { data, error: error?.message }
}

export async function GET (request: Request) {
  const actor = "did:plc:uvuzsptk4b22b63xowm62chr"

  return Response.json ({
    posts: Post.array().parse (posts),
    profile: await fetchProfile (actor),
    feed: await fetchFeeds (actor),
  })
}
