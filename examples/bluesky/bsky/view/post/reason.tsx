import React, { useCallback, useContext } from 'react'
import {StyleSheet, View} from 'react-native'
import {
	AppBskyActorDefs,
  AppBskyFeedDefs,
  ModerationUI,
} from '@atproto/api'
// import {msg, Trans} from '@lingui/macro'
// import {useLingui} from '@lingui/react'
import { isReasonFeedSource, ReasonFeedSource } from '@/bsky/lib/api/feed/types'
import { theFeed } from '../../the-feed'
import { theModeration, thePost } from '../the-post'

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

function useSession() {
	return {
		currentAccount: {
			did: '',
		},
	}
}

function useFeedFeedbackContext() {
	return {
		sendInteraction: (options: {
			item: string,
			event: string,
			feedContext?: string,
		}) => {},
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

function sanitizeDisplayName(displayName: string, moderationUi?: ModerationUI) {
	return displayName
}

function sanitizeHandle(handle: string) {
	return handle
}

function Text (props: any) {
	return null
}

function Trans (props: any) {
	return null
}

function Link (props: any) {
	return null
}

function FeedNameText (props: any) {
	return null
}

function RepostIcon (props: any) {
	return null
}

function PinIcon (props: any) {
	return null
}

function ProfileHoverCard (props: any) {
	return null
}

function TextLinkOnWebOnly (props: any) {
	return null
}

// #endregion

function ReasonFeed (props: any) {
	const pal = usePalette('default')
	return (
		<Link href={props.reason.href}>
			<Text
				type="sm-bold"
				style={pal.textLight}
				lineHeight={1.2}
				numberOfLines={1}
			>
				From <FeedNameText
					type="sm-bold"
					uri={props.reason.uri}
					href={props.reason.href}
					lineHeight={1.2}
					numberOfLines={1}
					style={pal.textLight}
				/>
			</Text>
		</Link>
	)
}

function ReasonRepost (props: any) {
	const pal = usePalette('default')
	const {currentAccount} = useSession()
	const {sendInteraction} = useFeedFeedbackContext()
	const isOwner = props.reason.by.did === currentAccount?.did

	const onOpenReposter = useCallback(() => {
		sendInteraction({
			item: props.post?.uri,
			event: 'app.bsky.feed.defs#clickthroughReposter',
			feedContext: props.feedContext,
		})
	}, [sendInteraction, props.post, props.feedContext])

	return (
		<Link
			style={styles.includeReason}
			href={makeProfileLink(props.reason.by)}
			title={
				isOwner
					? `Reposted by you`
					: `Reposted by ${sanitizeDisplayName(
							props.reason.by.displayName || props.reason.by.handle
						)}`
			}
			onBeforePress={onOpenReposter}
		>
			<RepostIcon
				style={{color: pal.colors.textLight, marginRight: 3}}
				width={13}
				height={13}
			/>
			<Text
				type="sm-bold"
				style={pal.textLight}
				lineHeight={1.2}
				numberOfLines={1}
			>
				{isOwner ? (
					<Trans>Reposted by you</Trans>
				) : (
					<Trans>
						Reposted by{' '}
						<ProfileHoverCard inline did={props.reason.by.did}>
							<TextLinkOnWebOnly
								type="sm-bold"
								style={pal.textLight}
								lineHeight={1.2}
								numberOfLines={1}
								text={
									<Text
										emoji
										type="sm-bold"
										style={pal.textLight}
										lineHeight={1.2}
									>
										{sanitizeDisplayName(
											props.reason.by.displayName ||
												sanitizeHandle(props.reason.by.handle),
											props.moderation?.ui('displayName'),
										)}
									</Text>
								}
								href={makeProfileLink(props.reason.by)}
								onBeforePress={onOpenReposter}
							/>
						</ProfileHoverCard>
					</Trans>
				)}
			</Text>
		</Link>
	)
}

function ReasonPin (props: any) {
	const pal = usePalette('default')
	return (
		<View style={styles.includeReason}>
			<PinIcon
				style={{color: pal.colors.textLight, marginRight: 3}}
				width={13}
				height={13}
			/>
			<Text
				type="sm-bold"
				style={pal.textLight}
				lineHeight={1.2}
				numberOfLines={1}
			>
				<Trans>Pinned</Trans>
			</Text>
		</View>
	)
}

type ReasonType =
| AppBskyFeedDefs.ReasonRepost
| AppBskyFeedDefs.ReasonPin
| ReasonFeedSource
| {[k: string]: unknown; $type: string}
| undefined

export function PostReason (props: {
	reason: ReasonType,
}) {
	const post = useContext (thePost)
	const feedContext = useContext (theFeed)
	const moderation = useContext (theModeration)

	if (isReasonFeedSource(props.reason)) {
		return <ReasonFeed {...props} />
	}
	else if (AppBskyFeedDefs.isReasonRepost(props.reason)) {
		return <ReasonRepost {...props} />
	}
	else if (AppBskyFeedDefs.isReasonPin(props.reason)) {
		return <ReasonPin {...props} />
	}
	else {
		return null
	}
}

const styles = StyleSheet.create({
	includeReason: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
})
