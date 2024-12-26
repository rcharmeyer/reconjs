import React, { useContext, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { MAX_POST_LINES } from '@/bsky/lib/constants'
import { defineContext, StyleOf } from "@reconjs/react"
import { thePostData, theRichText } from '../the-post'

function RichText (props: any) {
	return null
}

function TextLink (props: any) {
	return null // TODO
}

function countLines(str: string | undefined): number {
  if (!str) return 0
  return str.match(/\n/g)?.length ?? 0
}

const theLimitLinesState = defineContext (() => {
	const richText = useContext (theRichText)
	const [ limitLines, setLimitLines ] = useState (() => {
		return countLines (richText.text) >= MAX_POST_LINES
	})

	return { limitLines, setLimitLines }
}, [ theRichText ])

function ShowMore() {
	const { limitLines, setLimitLines } = useContext (theLimitLinesState)

	function onPressShowMore () {
		setLimitLines (false)
	}

	if (!limitLines) return null
	return (
		<TextLink
			text="Show More"
			style={styles.link}
			onPress={onPressShowMore}
			href="#"
		/>
	)
}

export function TextContent (props: {
	style: StyleOf <typeof View>
}) {
	const richText = useContext (theRichText)
	const { limitLines } = useContext (theLimitLinesState)
	const post = useContext (thePostData)

	if (!richText.text) return null
	return (
		<View style={props.style}>
			<View style={styles.flex_1}>
				<RichText
						enableTags
						testID="postText"
						value={richText}
						numberOfLines={limitLines ? MAX_POST_LINES : undefined}
						style={styles.richText}
						authorHandle={post.author.handle}
				/>
			</View>
			<ShowMore />
		</View>
	)
}

const styles = StyleSheet.create ({
	flex_1: {
		flex: 1,
	},
	richText: {
		flex: 1,
		fontSize: 16,
	},
	link: {},
})
