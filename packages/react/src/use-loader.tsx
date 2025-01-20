import { useRef } from "react"
import { asFuture, fulfilled } from "./promises"
import { useConstant } from "./use-constant"

type Func = (...args: any[]) => any

type PromiseOf <T> = T extends Promise <any> ? T : Promise <T>

// TODO: Better caching.
export function useLoader <T extends Func> (loader: T) {
	type P = Parameters <T>
	type R = (...args: P) => PromiseOf <ReturnType <T>>

	const loaderRef = useRef <Func> (loader)
	loaderRef.current = loader

	function load (...args: any[]) {
		const value = loaderRef.current (...args)
		if (value instanceof Promise) {
			return asFuture (value)
		}
		return fulfilled (value)
	}

	return useConstant (() => load as R)
}
