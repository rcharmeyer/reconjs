import { withProps } from "@reconjs/react"
import { ReactNode } from "react"

const Container = withProps ("div", {
  className: "bg-white hover:bg-[rgb(250,251,253)]",
  style: {
    paddingLeft: 16,
    paddingRight: 16,
    overflow: "hidden",
    transition: "background-color 0.15s ease-in-out",
    cursor: 'pointer',
  }
})

const Row = withProps ("div", {
  style: {
    flexDirection: "row",
    gap: 10,
  }
})

const BottomLeftQuadrant = withProps ("div", {
  style: {
    zIndex: 999,
    width: 42,
    alignItems: "center",
  }
})

const TopLeftQuadrant = withProps ("div", {
  style: {
    zIndex: 999,
    width: 42,
    alignItems: "center",
    justifyContent: "flex-end",
  }
})

const BottomRightQuadrant = withProps ("div", {
  style: {
    zIndex: 0,
    flex: 1,
    gap: 2,
    paddingBottom: 8,
  }
})

const TopRightQuadrant = withProps ("div", {
  style: {
    zIndex: 0,
    flex: 1,
    gap: 2,
    justifyContent: "flex-end",
    paddingTop: 12,
  }
})

export function PostLayout (props: {
  left: ReactNode,
  above: ReactNode,
  aboveLeft: ReactNode,
  children: ReactNode,
}) {
  return (
    <Container>
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
    </Container>
  )
}
