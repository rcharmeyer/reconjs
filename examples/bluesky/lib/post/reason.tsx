import { use, withStyle } from "@reconjs/react"

import { thePostLoader } from "./the-post"

import { thePost } from "./the-post"

import { useContext } from "react"
import { AppBskyActorDefs } from "@atproto/api"
import { REPOST1 } from "../icons"
import { Text, View } from "react-native"
import { Icon } from "../icon"

// TODO: Pin
interface BskyReason {
  $type?: string,
  by?: AppBskyActorDefs.ProfileView,
}

const LIGHT_COLOR = "gray"

function usePostReason () {
  const post = useContext (thePost)
  const loadPost = useContext (thePostLoader)

  const data = use (loadPost (post))
  return data.reason as BskyReason
}

function isReasonRepost (reason: BskyReason) {
  return reason?.$type === "app.bsky.feed.defs#reasonRepost"
}

// TODO:
function useCurrentUserDid () {
	return "did:plc:uvuzsptk4b22b63xowm62chr"
}

function useName (reason?: BskyReason) {
	const userDid = useCurrentUserDid()
	if (reason?.by?.did === userDid) return "You"
	return reason?.by?.displayName ?? ""
}

const IconLabelContainer = withStyle (View, {
	flexDirection: "row",
	gap: 4,
})

function IconLabel (props: {
	icon: string,
	label: string,
}) {
	return (
		<IconLabelContainer>
			<Icon path={props.icon} fill={LIGHT_COLOR} size={10} />
			<Text>{props.label}</Text>
		</IconLabelContainer>
	)
}

export function PostReason () {
	const reason = usePostReason()
	const name = useName (reason)

	if (isReasonRepost (reason)) {
		const label = `Reposted by ${name}`
		const icon = REPOST1
		return <IconLabel icon={icon} label={label} />
	}

	return null
}