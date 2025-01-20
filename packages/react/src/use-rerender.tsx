import React from "react"
import { isRSC } from "./react-internals"
import { useConstant } from "./use-constant"

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
