import React, { useContext } from 'react'
import { View } from 'react-native'
import { StyleOf } from '@reconjs/react'

import { thePostData, theModeration } from '../the-post'
import { theFeed } from '../../the-feed'

function PostEmbeds (props: any) {
	return null
}

const PostEmbedViewContext = {
  Feed: 'feed',
  Profile: 'profile',
}

function sendInteraction (interaction: any) {
  console.log ('sendInteraction', interaction)
}

export function EmbedContent (props: {
  style: StyleOf <typeof View>
}) {
  const { uri, embed } = useContext (thePostData)
  const moderation = useContext (theModeration)
  const feed = useContext (theFeed)

  const onOpen = React.useCallback(() => {
    sendInteraction({
      item: uri,
      event: 'app.bsky.feed.defs#clickthroughEmbed',
      feed,
    })
  }, [sendInteraction, uri, feed])

  return (
    <View style={props.style}>
      <PostEmbeds
        embed={embed}
        moderation={moderation}
        onOpen={onOpen}
        viewContext={PostEmbedViewContext.Feed}
      />
    </View>
  )
} 