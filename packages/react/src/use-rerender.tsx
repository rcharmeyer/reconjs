import React from "react"
import { isRSC } from "./react-internals"

const NEVER = {} as any

function useConstant <T> (init: () => T): T {
	if (isRSC()) {
		return init ()
	}

	const ref = React.useRef <T> (NEVER)
	if (ref.current === NEVER) {
		ref.current = init ()
	}
	return ref.current
}

export function useRerender () {
	if (isRSC()) {
		return () => {}
	}

	const [ _, set ] = React.useState (0)
	function rerender () {
		set (x => x + 1)
	}
	return useConstant (() => rerender)
}
