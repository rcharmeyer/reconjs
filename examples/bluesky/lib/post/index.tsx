import { Provider, withStyle } from "@reconjs/react"
import { ReactNode } from "react"
import { View, Text } from "react-native"
import { MOCK_POST, thePost } from "./the-post"

const PostOverlay = withStyle(View, {
  backgroundColor: "rgb(241, 243, 245)",
  opacity: 0,
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  // @ts-ignore web only properties
  transition: "opacity 0.15s ease-in-out",
  pointerEvents: "none"
})

const ThreadContainer = withStyle (View, {
  borderColor: "rgb(212, 219, 226)",
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderWidth: 1,
})

const Container = withStyle (View, {
  borderColor: "rgb(212, 219, 226)",
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderWidth: 1,
  paddingLeft: 10,
  paddingRight: 15,
  // @ts-ignore web only -prf
  cursor: 'pointer',
})

const Row = withStyle (View, {
  flexDirection: "row",
  marginTop: 1,
})

const LeftColumn = withStyle (View, {
  paddingLeft: 8,
  paddingRight: 10,
  zIndex: 999,
})

const MainColumn = withStyle (View, {
  flex: 1,
  zIndex: 0,
})

export function PostAvatar() {
  return null
}

export function PostHeader() {
  return null
}

export function PostBody() {
  return null
}

export function PostFooter() {
  return null
}

function PostContainer (props: {
  children: React.ReactNode
}) {
  return (
    <Container>
      <PostOverlay />
      {props.children}
    </Container>
  )
}

function ThreadedView (props: {
  avatar: ReactNode,
  children: ReactNode,
}) {
  return (
    <Row>
      <LeftColumn>{props.avatar}</LeftColumn>
      <MainColumn>{props.children}</MainColumn>
    </Row>
  )
}

function Post() {
  return (
    <PostContainer>
      <ThreadedView avatar={<PostAvatar />}>
        <PostHeader />
        <PostBody />
        <PostFooter />
      </ThreadedView>
    </PostContainer>
  )
}

export function Thread () {
  return (
    <ThreadContainer>
      <Provider context={thePost} value={MOCK_POST}>
        <Post />
      </Provider>
    </ThreadContainer>
  )
}