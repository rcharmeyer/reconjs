import { PostHeader } from "./header"
import { PostBody } from "./body"
import { PostAvatar } from "./avatar"
import { PostFooter } from "./footer"
import { PostLayout } from "./layout"
import { PostReason } from "./reason"

function ReplyLine (props: {
  show?: boolean,
}) {
  if (!props.show) return null
  return <div className="w-2 bg-gray-500 h-full" />
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

