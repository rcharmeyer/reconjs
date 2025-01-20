import { defineContext, use, withStyle } from "@reconjs/react"
import { useContext } from "react"
import { Text, View } from "react-native"
import { thePost, thePostLoader } from "./the-post"

const BodyContainer = withStyle (View, {
	alignItems: "center",
	flexDirection: "row",
	flexWrap: "wrap",
	overflow: "hidden",
	paddingBottom: 2,
})

// TODO: Font
const BodyText = withStyle (Text, {
	flex: 1,
	fontSize: 15,
	letterSpacing: 0,
	lineHeight: 20,
})

const thePostText = defineContext (() => {
	const post = useContext (thePost)
	const loadPost = useContext (thePostLoader)

	const data = use (loadPost (post))
	return (data.post.record as any)?.text as string|undefined
}, [ thePost, thePostLoader ])

export function PostBody() {
	const text = useContext (thePostText)

  return (
		<BodyContainer>
      <BodyText>{text}</BodyText>
		</BodyContainer>
  )
}
