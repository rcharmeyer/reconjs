import { withStyle } from "@reconjs/react"
import { ReactNode } from "react"
import { View, Pressable, StyleSheet } from "react-native"

const styles = StyleSheet.create ({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    // @ts-ignore web only properties
    overflow: "hidden",
    // @ts-ignore web only properties
    transition: "background-color 0.15s ease-in-out",
    // @ts-ignore web only -prf
    cursor: 'pointer',
    backgroundColor: "white",
  },
  hovered: {
    backgroundColor: "rgb(250, 251, 253)",
  }
})

const Row = withStyle (View, {
  flexDirection: "row",
  // marginTop: 1,
  gap: 10,
})

const BottomLeftQuadrant = withStyle (View, {
  zIndex: 999,
  width: 42,
  alignItems: "center",
})

const BottomRightQuadrant = withStyle (View, {
  zIndex: 0,
  flex: 1,
  gap: 2,
  paddingBottom: 8,
})

const TopLeftQuadrant = withStyle (BottomLeftQuadrant, {
  justifyContent: "flex-end",
})

const TopRightQuadrant = withStyle (BottomRightQuadrant, {
  justifyContent: "flex-end",
  paddingBottom: 0,
  paddingTop: 12,
})

export function PostLayout (props: {
  left: ReactNode,
  above: ReactNode,
  aboveLeft: ReactNode,
  children: ReactNode,
}) {
  return (
    <Pressable style={({ hovered }) => [ styles.container, hovered && styles.hovered ]}>
      <Row>
        <TopLeftQuadrant>
          {props.aboveLeft}
        </TopLeftQuadrant>
        <TopRightQuadrant>
          {props.above}
        </TopRightQuadrant>
      </Row>
      <Row>
        <BottomLeftQuadrant>
          {props.left}
        </BottomLeftQuadrant>
        <BottomRightQuadrant>
          {props.children}
        </BottomRightQuadrant>
      </Row>
    </Pressable>
  )
}