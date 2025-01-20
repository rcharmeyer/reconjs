import { thePostLoader } from "./the-post"

import { use, withProps } from "@reconjs/react"
import { thePost } from "./the-post"

const Avatar = withProps ("img", {
	style: {
		width: 40,
		height: 40,
		borderRadius: 40,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.1)",
		margin: 2,
	}
})

function usePostAuthor() {
	const post = use (thePost)
	const loadPost = use (thePostLoader)

	const data = use (loadPost (post))
	return data.post.author
}

export function PostAvatar() {
	const author = usePostAuthor()
	const uri = author.avatar
	
  return (
		<Avatar src={uri} />
	)
}