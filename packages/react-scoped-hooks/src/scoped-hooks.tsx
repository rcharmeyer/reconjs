"use client"
import { 
	ComponentType,
	Context,
	createContext, 
	DependencyList, 
	memo, 
	MemoExoticComponent, 
	PropsWithChildren, 
	useContext, 
	useEffect, 
	useReducer, 
	useRef,
} from "react"

import { createSymbolizer } from "./symbolizer"

interface Entry {
	key: string|symbol,
	deps: DependencyList,
	value: any,
}

function reducer (state: Entry[], action: Entry) {
	const nextState = state.filter (x => x.key !== action.key)
	return [ ...nextState, action ]
}

function useScopeProvider () {
	const [state, dispatch] = useReducer (reducer, [] as Entry[])
	const cache = useRef ([] as Entry[])
	cache.current = state

	return {
		state,
		dispatch,
		cache,
	}
}

const CONTEXTS = [] as Array <{
	context: Context <ReturnType <typeof useScopeProvider>>,
	scope: Function,
}>

function findContext (scope: Function) {
	return CONTEXTS.find (x => x.scope === scope)?.context
}

export type Scope = MemoExoticComponent <ComponentType <PropsWithChildren>> & {
	$$recon: "scope",
}

export function createScope () {
	const context = createContext <
		ReturnType <typeof useScopeProvider>
	> (undefined as any)

	const Provider = memo (context.Provider)

	function Scope (props: PropsWithChildren) {
		const value = useScopeProvider()

		return (
			<Provider value={value}>
				{props.children}
			</Provider>
		)
	}

	// @ts-expect-error
	const scope: Scope = memo (Scope)
	scope.$$recon = "scope"

	CONTEXTS.push ({
		context, 
		scope,
	})

	return scope
}

export const ROOT = createScope()
const ROOT_CONTEXT = findContext (ROOT)

export function ScopeProvider (props: PropsWithChildren) {
	return <ROOT>{props.children}</ROOT>
}

function getContext (deps: DependencyList) {
	for (const dep of deps) {
		const found = findContext (dep as any)
		if (found) return found
	}
	if (!ROOT_CONTEXT) throw new Error ("Root scope not found")
	return ROOT_CONTEXT
}

export function useScopedState <T> (
	key: string|symbol,
	initializer: () => T, 
	deps: DependencyList = [],
) {
	const Context = getContext (deps)
	const { cache, dispatch } = useContext (Context)

	// TODO: Dedupe using deps too.
	let entry = cache.current.find (entry => entry.key === key)
	let initial: Entry | undefined

	if (!entry) {
		const value = initializer()
		function setValue (next: any) {
			dispatch ({ key, deps, value: [ next, setValue ] })
		}

		initial = { key, deps, value: [ value, setValue ] }
		entry = initial
		cache.current.push (initial)
	}

	useEffect (() => {
		if (initial) {
			dispatch (initial)
		}
	}, [ initial ])

	if (!entry) throw new Error ("Entry not found")
	return entry.value as [ T, (value: T) => void ]
}

/**
 * @example
 * const PageScope = createScope()
 * 
 * // You can share state between all components within the same scope.
 * const useCounterState = defineState (() => {
 * 	return 0
 * }, [ PageScope ])
 * 
 * // You can also share state by passing arguments.
 * const useHasVisitedState = defineState ((path: string) => {
 * 	return false
 * }, [])
 */
export function defineState <T, Args extends any[]> (
	initializer: (...args: Args) => T,
	deps: Scope[] = []
) {
	const getSymbol = createSymbolizer()

	return (...args: Args) => {
		const key = getSymbol (...args)
		return useScopedState (key, () => initializer(...args), deps)
	}
}
