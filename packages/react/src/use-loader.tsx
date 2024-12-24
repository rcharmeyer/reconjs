import { useRef } from "react"
import { fulfilled } from "./promises"

type AnySyncFunction = (...args: any[]) => Exclude <any, Promise <any>>

const NEVER = {} as any

function useConstant <T> (fn: () => T) {
	const ref = useRef <T> (NEVER)
	if (ref.current === NEVER) {
		ref.current = fn()
	}
	return ref.current
}

export function useLoader <T extends AnySyncFunction> (
	loader: T
): (...args: Parameters <T>) => Promise <ReturnType <T>> {
	const loaderRef = useRef <AnySyncFunction> (loader)
	loaderRef.current = loader

	function load (...args: any[]) {
		const value = loaderRef.current (...args)
		return fulfilled (value)
	}

	return useConstant <any> (() => load)
}