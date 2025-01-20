import React from "react"
import { isRSC } from "./react-internals"

export function useConstant <T> (init: () => T) {
	if (isRSC()) return init()

	const ref = React.useRef <{ value: T }>()
	ref.current ??= { value: init() }
	return ref.current.value
}