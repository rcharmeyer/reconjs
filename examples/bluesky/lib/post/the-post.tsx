import { cache, createContext } from "@reconjs/react"

const MOCK = {
  post: {
    uri: "at://did:plc:vw4e7blkwzdokanwp24k3igr/app.bsky.feed.post/3leaiee2vzc25",
    cid: "bafyreifxmuqpf54f4ofbilx3kkere4wgwiptytxzeasy4yfvdz2knpzt6i",
    author: {
      did: "did:plc:vw4e7blkwzdokanwp24k3igr",
      handle: "huwupy.kawaii.social",
      displayName: "🍅🥔🫐🌽 hoopy frood 🌶️ 🥑🍫🌵",
      avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:vw4e7blkwzdokanwp24k3igr/bafkreifnugiqfenl35opmlw6dvleyeuzo66fljsokghjfmb2yd3725c6ku@jpeg",
      associated: {
        chat: {
          allowIncoming: "following"
        }
      },
      viewer: {
        muted: false,
        blockedBy: false
      },
      labels: [],
      createdAt: "2023-04-12T07:22:32.646Z"
    },
    record: {
      $type: "app.bsky.feed.post",
      createdAt: "2024-12-26T22:08:05.506Z",
      langs: [
        "en"
      ],
      reply: {
        parent: {
          cid: "bafyreia6szkfmg6mkpmtowzrtho3ez7dfzonw5vkr6eguk7spwkju2f5aa",
          uri: "at://did:plc:vw4e7blkwzdokanwp24k3igr/app.bsky.feed.post/3leaidliup225"
        },
        root: {
          cid: "bafyreibo67bm5msfeytxrrbvbreawnekcfg4h4d5rvij74kcvqwvr56t4m",
          uri: "at://did:plc:bnqkww7bjxaacajzvu5gswdf/app.bsky.feed.post/3leacsauy722p"
        }
      },
      text: "Amusing somehow that they don’t feel safe discussing it on main"
    },
    replyCount: 0,
    repostCount: 0,
    likeCount: 5,
    quoteCount: 0,
    indexedAt: "2024-12-26T22:08:05.853Z",
    viewer: {
      threadMuted: false,
      embeddingDisabled: false
    },
    labels: []
  },
  reply: {
    root: {
      $type: "app.bsky.feed.defs#postView",
      uri: "at://did:plc:bnqkww7bjxaacajzvu5gswdf/app.bsky.feed.post/3leacsauy722p",
      cid: "bafyreibo67bm5msfeytxrrbvbreawnekcfg4h4d5rvij74kcvqwvr56t4m",
      author: {
        did: "did:plc:bnqkww7bjxaacajzvu5gswdf",
        handle: "shreyanjain.net",
        displayName: "Shreyan ✅",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:bnqkww7bjxaacajzvu5gswdf/bafkreigq4o43dv4xwhrhegixhd4fxz3jvcbypxzqzg5tnen4g6l2h64ddy@jpeg",
        associated: {
          chat: {
            allowIncoming: "all"
          }
        },
        viewer: {
          muted: false,
          blockedBy: false,
          following: "at://did:plc:uvuzsptk4b22b63xowm62chr/app.bsky.graph.follow/3lc6mvqrx3g2l"
        },
        labels: [],
        createdAt: "2023-02-18T22:07:24.891Z"
      },
      record: {
        $type: "app.bsky.feed.post",
        createdAt: "2024-12-26T20:28:29.476Z",
        langs: [
          "en"
        ],
        text: "I wonder what tpot has to say about the h1b discourse"
      },
      replyCount: 3,
      repostCount: 0,
      likeCount: 9,
      quoteCount: 1,
      indexedAt: "2024-12-26T20:28:31.555Z",
      viewer: {
        threadMuted: false,
        embeddingDisabled: false
      },
      labels: []
    },
    parent: {
      $type: "app.bsky.feed.defs#postView",
      uri: "at://did:plc:vw4e7blkwzdokanwp24k3igr/app.bsky.feed.post/3leaidliup225",
      cid: "bafyreia6szkfmg6mkpmtowzrtho3ez7dfzonw5vkr6eguk7spwkju2f5aa",
      author: {
        did: "did:plc:vw4e7blkwzdokanwp24k3igr",
        handle: "huwupy.kawaii.social",
        displayName: "🍅🥔🫐🌽 hoopy frood 🌶️ 🥑🍫🌵",
        avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:vw4e7blkwzdokanwp24k3igr/bafkreifnugiqfenl35opmlw6dvleyeuzo66fljsokghjfmb2yd3725c6ku@jpeg",
        associated: {
          chat: {
            allowIncoming: "following"
          }
        },
        viewer: {
          muted: false,
          blockedBy: false
        },
        labels: [],
        createdAt: "2023-04-12T07:22:32.646Z"
      },
      record: {
        $type: "app.bsky.feed.post",
        createdAt: "2024-12-26T22:07:39.749Z",
        langs: [
          "en"
        ],
        reply: {
          parent: {
            cid: "bafyreie5dyzxwyy3itaysorj46pdkop4q4qm7jtsq57ytrmzgkc7zpum2u",
            uri: "at://did:plc:bnqkww7bjxaacajzvu5gswdf/app.bsky.feed.post/3leah52oxac2e"
          },
          root: {
            cid: "bafyreibo67bm5msfeytxrrbvbreawnekcfg4h4d5rvij74kcvqwvr56t4m",
            uri: "at://did:plc:bnqkww7bjxaacajzvu5gswdf/app.bsky.feed.post/3leacsauy722p"
          }
        },
        text: "Yes tell us"
      },
      replyCount: 1,
      repostCount: 0,
      likeCount: 4,
      quoteCount: 0,
      indexedAt: "2024-12-26T22:07:40.049Z",
      viewer: {
        threadMuted: false,
        embeddingDisabled: false
      },
      labels: []
    },
    grandparentAuthor: {
      did: "did:plc:bnqkww7bjxaacajzvu5gswdf",
      handle: "shreyanjain.net",
      displayName: "Shreyan ✅",
      avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:bnqkww7bjxaacajzvu5gswdf/bafkreigq4o43dv4xwhrhegixhd4fxz3jvcbypxzqzg5tnen4g6l2h64ddy@jpeg",
      associated: {
        chat: {
          allowIncoming: "all"
        }
      },
      viewer: {
        muted: false,
        blockedBy: false,
        following: "at://did:plc:uvuzsptk4b22b63xowm62chr/app.bsky.graph.follow/3lc6mvqrx3g2l"
      },
      labels: [],
      createdAt: "2023-02-18T22:07:24.891Z"
    }
  }
}

export const MOCK_POST = MOCK.post.uri

export const thePostLoader = createContext (cache (async (post: string) => {
	if (post === MOCK_POST) return MOCK.post
	throw new Error ("Post not found")
}))

export const thePost = createContext <string>()

