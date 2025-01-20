import { use, withStyle } from "@reconjs/react"
import { Text, View } from "react-native"
import { thePost } from "./the-post"
import { thePostLoader } from "./the-post"
import { useContext } from "react"

const Row = withStyle (View, {
	flexDirection: "row",
	gap: 2,
})

const Name = withStyle (Text, {
	fontSize: 15,
	fontWeight: 600,
	letterSpacing: 0,
	lineHeight: 20,
})

const Handle = withStyle (Text, {
	fontSize: 15,
	color: "rgb(66, 87, 108)",
	letterSpacing: 0,
	lineHeight: 20,
})

export function PostHeader() {
	const post = useContext (thePost)
	const loadPost = useContext (thePostLoader)

	const data = use (loadPost (post))
	const author = data.post.author

	return (
		<Row>
			<Name>{author.displayName}</Name>
			<Handle>&nbsp;@{author.handle}</Handle>
		</Row>
	)
}