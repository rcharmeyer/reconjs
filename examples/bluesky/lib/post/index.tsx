import { StyleSheet, View } from "react-native"

import { PostHeader } from "./header"
import { PostBody } from "./body"
import { PostAvatar } from "./avatar"
import { PostFooter } from "./footer"
import { PostLayout } from "./layout"
import { PostReason } from "./reason"

const styles = StyleSheet.create ({
  line: {
    width: 2,
    backgroundColor: "gray",
    height: "100%",
  },
})

function ReplyLine (props: {
  show?: boolean,
}) {
  if (!props.show) return null
  return <View style={styles.line} />
}

export function Post (props: {
  hasTopLine?: boolean,
  hasBottomLine?: boolean,
}) {
  return (
    <PostLayout 
      above={<PostReason />}
      aboveLeft={<ReplyLine show={props.hasTopLine} />}
      left={<>
        <PostAvatar />
        <ReplyLine show={props.hasBottomLine} />
      </>}
    >
      <PostHeader />
      <PostBody />
      <PostFooter />
    </PostLayout>
  )
}

