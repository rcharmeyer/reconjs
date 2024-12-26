import { use, withStyle } from "@reconjs/react"
import { Text, View } from "react-native"
import { thePost } from "./the-post"
import { thePostLoader } from "./the-post"
import { useContext } from "react"

const Name = withStyle (Text, {
	fontSize: 13,
	fontWeight: "bold",
})

const Handle = withStyle (Text, {
	fontSize: 13,
	fontWeight: "normal",
})

export function PostHeader() {
	const post = useContext (thePost)
	const loadPost = useContext (thePostLoader)

	const { author } = use (loadPost (post))

	return (
		<View>
			<Name>{author.displayName}</Name>
			<Handle>{author.handle}</Handle>
		</View>
	)
}