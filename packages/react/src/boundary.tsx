import { ReactNode } from "react"

export function createBoundary (useShouldRenderFallback: () => boolean) {
  return function Boundary (props: {
    fallback?: ReactNode,
    children: ReactNode,
  }) {
    const renderFallback = useShouldRenderFallback()
    if (renderFallback) return props.fallback ?? null
    return props.children
  }
}