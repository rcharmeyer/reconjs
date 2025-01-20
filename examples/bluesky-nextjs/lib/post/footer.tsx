import { use, withProps } from "@reconjs/react"
import { COMMENT, DOTS } from "../icons"
import { REPOST1 } from "../icons"
import { IconButton } from "../icon-button"
import { HEART_OUTLINE } from "../icons"
import { thePost } from "./the-post"
import { thePostLoader } from "./the-post"

const FooterContainer = withProps ("div", {
	style: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
		height: 30,
		// marginLeft: -6,
	}
})

const Stretch = withProps ("div", {
	style: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "center",
		height: "100%",
	}
})

function LikeButton () {
	const post = use (thePost)
	const loadPost = use (thePostLoader)
	const data = use (loadPost (post))

	const { likeCount } = data.post
	const label = !likeCount ? "" : likeCount.toString()

	return (
		<Stretch>
			<IconButton path={HEART_OUTLINE} label={label} />
		</Stretch>
	)
}

function RepostButton () {
	const post = use (thePost)
	const loadPost = use (thePostLoader)
	const data = use (loadPost (post))

	const { repostCount } = data.post
	const label = !repostCount ? "" : repostCount.toString()

	return (
		<Stretch>
			<IconButton path={REPOST1} label={label} />
		</Stretch>
	)
}

function CommentButton() {
	const post = use (thePost)
	const loadPost = use (thePostLoader)
	const data = use (loadPost (post))

	const { replyCount } = data.post
	const label = !replyCount ? "" : replyCount.toString()

	return (
		<Stretch>
			<IconButton path={COMMENT} label={label} />
		</Stretch>
	)
}

export function PostFooter() {
  return (
    <FooterContainer>
			<CommentButton />
			<RepostButton />
			<LikeButton />
			<IconButton path={DOTS} />
    </FooterContainer>
  )
}