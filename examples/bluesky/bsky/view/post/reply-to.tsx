// import { useSession } from '@/bsky/lib/session'
import { AppBskyActorDefs } from '@atproto/api'
// import { usePalette } from '@/theme'
// import { makeProfileLink } from '@/bsky/lib/links'
// import { sanitizeDisplayName, sanitizeHandle } from '@/bsky/lib/text'
import { View, StyleSheet } from 'react-native'

function useSession() {
	return {
		currentAccount: {
			did: '',
		},
	}
}

function sanitizeDisplayName(displayName: string) {
	return displayName
}

function sanitizeHandle(handle: string) {
	return handle
}

function makeProfileLink(profile: AppBskyActorDefs.ProfileViewBasic) {
	return ''
}

function Trans (props: any) {
	return null
}

function TextLinkOnWebOnly (props: any) {
	return null
}

function ProfileHoverCard (props: any) {
	return null
}

function Text (props: any) {
	return null
}

function FontAwesomeIcon (props: any) {
	return null
}

function usePalette (key: string) {
	return {
		colors: {
			textLight: 'lightgray',
		},
		textLight: {
			color: 'lightgray',
		},
	}
}

// Label components

export function BlockedLabel() {
	return <Trans context="description">Reply to a blocked post</Trans>
}

export function NotFoundLabel() {
	return <Trans context="description">Reply to a post</Trans>
}

export function ProfileLabel (props: {
	profile: AppBskyActorDefs.ProfileViewBasic
}) {
	const { profile } = props
	const { currentAccount } = useSession()
	const pal = usePalette('default')

	if (profile.did === currentAccount?.did) {
		return <Trans context="description">Reply to you</Trans>
	}

	const profileName = profile.displayName
		? sanitizeDisplayName(profile.displayName)
		: sanitizeHandle(profile.handle)

	const text = (
		<Text emoji type="md" style={pal.textLight} lineHeight={1.2}>
			{profileName}
		</Text>
	)

	return (
		<Trans context="description">
			Reply to{' '}
			<ProfileHoverCard inline did={profile.did}>
				<TextLinkOnWebOnly
					type="md"
					style={pal.textLight}
					lineHeight={1.2}
					numberOfLines={1}
					href={makeProfileLink(profile)}
					text={text}
				/>
			</ProfileHoverCard>
		</Trans>
	)
} 

export function ReplyToLabel({
  profile,
}: {
  profile?: AppBskyActorDefs.ProfileViewBasic
}) {
  const pal = usePalette('default')

	// should happen
  if (!profile) return null

  return (
    <View style={[s.flexRow, s.mb2, s.alignCenter]}>
      <FontAwesomeIcon
        icon="reply"
        size={9}
        style={[{color: pal.colors.textLight}, s.mr5]}
      />
      <Text
        type="md"
        style={[pal.textLight, s.mr2]}
        lineHeight={1.2}
        numberOfLines={1}
			>
				<ProfileLabel profile={profile} />
			</Text>
		</View>
	)
}

const s = StyleSheet.create({
	mr2: {
		marginRight: 2,
	},
	mr5: {
		marginRight: 5,
	},
	mb2: {
		marginBottom: 2,
	},
	alignCenter: {
		alignItems: 'center',
	},
	flexRow: {
		flexDirection: 'row',
	},
})
