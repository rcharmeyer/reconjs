import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { AppBskyFeedPost, AtUri } from "@atproto/api"
import { defineContext, StyleOf } from "@reconjs/react"

import { theCurrentAccount, theModeration, thePostData, theThreadgateRecord } from '../the-post'
import { TextContent } from './text-content'
import { EmbedContent } from './embed-content'

function ContentHider (props: any) {
	return null
}

function PostAlerts (props: any) {
	return null
}

function useMergedThreadgateHiddenReplies (props: any) {
	return new Map<string, any>()
}

const thePostIsHiddenByThreadgate = defineContext (() => {
	const post = useContext (thePostData)
	const threadgateRecord = useContext (theThreadgateRecord)
	const threadgateHiddenReplies = useMergedThreadgateHiddenReplies({
		threadgateRecord,
	})
	return threadgateHiddenReplies.has (post.uri)
}, [thePostData, theThreadgateRecord])



const thePostIsControlledByViewer = defineContext (() => {
	const post = useContext (thePostData)
	const currentAccount = useContext (theCurrentAccount)

	const rootPostUri = AppBskyFeedPost.isRecord(post.record)
		? post.record?.reply?.root?.uri || post.uri
		: undefined

	return rootPostUri && new AtUri(rootPostUri).host === currentAccount?.did
}, [thePostData, theCurrentAccount])



type AppModerationCause = any

const theAdditionalPostAlerts = defineContext <AppModerationCause[]> (() => {
	const isPostHiddenByThreadgate = useContext (thePostIsHiddenByThreadgate)
	const isControlledByViewer = useContext (thePostIsControlledByViewer)
	const currentAccount = useContext (theCurrentAccount)

	if (!isControlledByViewer) return []
	if (!isPostHiddenByThreadgate) return []

	return [
		{
			type: 'reply-hidden',
			source: {type: 'user', did: currentAccount?.did},
			priority: 6,
		},
	]
}, [thePostIsHiddenByThreadgate, thePostIsControlledByViewer, theCurrentAccount])



export function PostContent (props: {
	style: StyleOf <typeof View>
}) {
	const additionalPostAlerts = useContext (theAdditionalPostAlerts)
	const moderation = useContext (theModeration)
  return (
    <ContentHider
      testID="contentHider-post"
      modui={moderation.ui('contentList')}
      ignoreMute
      childContainerStyle={props.style}
		>
      <PostAlerts
        modui={moderation.ui('contentList')}
        style={styles.py_2xs}
        additionalCauses={additionalPostAlerts}
      />
      <TextContent style={styles.flex_1} />
			<EmbedContent style={styles.pb_xs} />
		</ContentHider>
	)
}

const styles = StyleSheet.create ({
	flex_1: {
		flex: 1,
	},
	py_2xs: {
		paddingVertical: 4,
	},
	pb_xs: {
		paddingBottom: 8,
	},
})

